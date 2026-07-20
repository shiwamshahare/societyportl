import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '@/utils/supabase';

WebBrowser.maybeCompleteAuthSession();

export type UserRole = 'resident' | 'guard' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  flatNumber?: string;
  tower?: string;
  phone?: string;
  password?: string;
  societyName?: string;
  isApproved?: boolean;
};

export interface DevOtpSession {
  phone: string;
  otp: string;
}

interface AuthState {
  isSignedIn: boolean;
  user: User | null;
  users: User[];
  isSocietyLocked: boolean;
  submittedName: string;
  loading: boolean;
  error: string | null;
  devOtpSession: DevOtpSession | null;
}

const initialState: AuthState = {
  isSignedIn: false,
  user: null,
  users: [],
  isSocietyLocked: false,
  submittedName: 'Shiwam',
  loading: false,
  error: null,
  devOtpSession: null,
};

// Async Thunks
export const checkPhoneExistsThunk = createAsyncThunk(
  'auth/checkPhoneExists',
  async (phone: string, { rejectWithValue }) => {
    try {
      const normalizedInput = phone.replace(/[^0-9]/g, '');
      if (!normalizedInput) return { exists: false };

      const last10Digits = normalizedInput.slice(-10);

      const { data: matchedProfiles, error } = await supabase
        .from('profiles')
        .select('*')
        .like('phone', `%${last10Digits}`);

      if (error) return rejectWithValue(error.message);

      if (!matchedProfiles || matchedProfiles.length === 0) {
        return { exists: false };
      }

      const matched = matchedProfiles[0];
      const matchedUser: User = {
        id: matched.id,
        name: matched.name,
        email: matched.email,
        role: matched.role as UserRole,
        flatNumber: matched.flat_number || undefined,
        tower: matched.tower || undefined,
        phone: matched.phone || undefined,
        societyName: matched.society_name || undefined,
        isApproved: matched.is_approved,
      };

      return { exists: true, user: matchedUser };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error checking phone number');
    }
  }
);

export const checkEmailExistsThunk = createAsyncThunk(
  'auth/checkEmailExists',
  async (email: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .ilike('email', email.trim())
        .limit(1);

      if (error) return rejectWithValue(error.message);

      return { exists: data && data.length > 0 };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error checking email address');
    }
  }
);

export const signInThunk = createAsyncThunk(
  'auth/signIn',
  async (credentials: { email: string; password: string; role: UserRole }, { rejectWithValue }) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) return rejectWithValue(authError.message);
      if (!authData.user) return rejectWithValue('Sign in failed');

      // Fetch profile to verify role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        await supabase.auth.signOut();
        return rejectWithValue('User profile not found. Access denied.');
      }

      if (profile.role !== credentials.role) {
        await supabase.auth.signOut();
        return rejectWithValue(`Invalid role selected. Account registered as ${profile.role}.`);
      }

      const signedInUser: User = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role as UserRole,
        flatNumber: profile.flat_number || undefined,
        tower: profile.tower || undefined,
        phone: profile.phone || undefined,
        societyName: profile.society_name || undefined,
        isApproved: profile.is_approved,
      };

      return signedInUser;
    } catch (err: any) {
      return rejectWithValue(err.message || 'An unexpected error occurred during login');
    }
  }
);

export const signUpThunk = createAsyncThunk(
  'auth/signUp',
  async (newUser: Omit<User, 'id'>, { rejectWithValue }) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password || '',
        options: {
          data: {
            name: newUser.name,
            role: newUser.role,
          }
        }
      });

      if (authError) return rejectWithValue(authError.message);
      if (!authData.user) return rejectWithValue('Registration failed');

      // Insert custom profile data in database
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone || null,
          flat_number: newUser.flatNumber || null,
          tower: newUser.tower || null,
          society_name: newUser.societyName || null,
          is_approved: false,
        });

      if (profileError) {
        return rejectWithValue(`Created auth, but profile db insertion failed: ${profileError.message}`);
      }

      return true;
    } catch (err: any) {
      return rejectWithValue(err.message || 'An unexpected error occurred during registration');
    }
  }
);

export const signOutThunk = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) return rejectWithValue(error.message);
      return true;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Logout failed');
    }
  }
);

export const fetchAllUsersThunk = createAsyncThunk(
  'auth/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) return rejectWithValue(error.message);

      return (profiles || []).map(p => ({
        id: p.id,
        name: p.name,
        email: p.email,
        role: p.role as UserRole,
        flatNumber: p.flat_number || undefined,
        tower: p.tower || undefined,
        phone: p.phone || undefined,
        societyName: p.society_name || undefined,
        isApproved: p.is_approved,
      }));
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch users');
    }
  }
);

export const sendPhoneOTPThunk = createAsyncThunk(
  'auth/sendPhoneOTP',
  async (phone: string, { rejectWithValue }) => {
    try {
      const cleanPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/[^0-9]/g, '')}`;
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: cleanPhone,
      });

      if (error) {
        // Fallback simulation for local/sandbox runs when Twilio is not configured
        if (error.message.includes('provider') || error.message.includes('SMS') || error.message.includes('not configured')) {
          const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
          console.log(`[DEV OTP SIMULATION] Code sent to ${phone}: ${mockOtp}`);
          return { devOtp: mockOtp, phone };
        }
        return rejectWithValue(error.message);
      }

      return { devOtp: undefined, phone };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to send OTP');
    }
  }
);

export const verifyPhoneOTPThunk = createAsyncThunk(
  'auth/verifyPhoneOTP',
  async (payload: { phone: string; token: string; devOtpSession: DevOtpSession | null }, { rejectWithValue }) => {
    try {
      const { phone, token, devOtpSession } = payload;
      
      // Check simulation first
      if (devOtpSession && devOtpSession.phone === phone && devOtpSession.otp === token) {
        // Simulate checking if phone exists
        const normalizedInput = phone.replace(/[^0-9]/g, '');
        const last10Digits = normalizedInput.slice(-10);
        const { data: matchedProfiles, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .like('phone', `%${last10Digits}`);

        if (profileErr || !matchedProfiles || matchedProfiles.length === 0) {
          return rejectWithValue('User profile not found in database.');
        }

        const matched = matchedProfiles[0];
        const matchedUser: User = {
          id: matched.id,
          name: matched.name,
          email: matched.email,
          role: matched.role as UserRole,
          flatNumber: matched.flat_number || undefined,
          tower: matched.tower || undefined,
          phone: matched.phone || undefined,
          societyName: matched.society_name || undefined,
          isApproved: matched.is_approved,
        };

        return matchedUser;
      }

      // Real Supabase verification
      const cleanPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/[^0-9]/g, '')}`;
      const { data, error } = await supabase.auth.verifyOtp({
        phone: cleanPhone,
        token,
        type: 'sms',
      });

      if (error) {
        return rejectWithValue(error.message);
      }

      if (data.user) {
        // Load custom profile details
        const normalizedInput = phone.replace(/[^0-9]/g, '');
        const last10Digits = normalizedInput.slice(-10);
        const { data: matchedProfiles, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .like('phone', `%${last10Digits}`);

        if (!profileErr && matchedProfiles && matchedProfiles.length > 0) {
          const matched = matchedProfiles[0];
          return {
            id: matched.id,
            name: matched.name,
            email: matched.email,
            role: matched.role as UserRole,
            flatNumber: matched.flat_number || undefined,
            tower: matched.tower || undefined,
            phone: matched.phone || undefined,
            societyName: matched.society_name || undefined,
            isApproved: matched.is_approved,
          } as User;
        } else {
          // Fallback if profile row is missing
          return {
            id: data.user.id,
            name: data.user.email?.split('@')[0] || 'User',
            email: data.user.email || '',
            role: 'resident',
            isApproved: false,
          } as User;
        }
      }

      return rejectWithValue('Authentication failed');
    } catch (err: any) {
      return rejectWithValue(err.message || 'OTP verification failed');
    }
  }
);

export const signInWithGoogleThunk = createAsyncThunk(
  'auth/signInWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const redirectUrl = Linking.createURL('auth-callback');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) return rejectWithValue(error.message);
      if (!data.url) return rejectWithValue('Failed to retrieve authentication URL');

      const res = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);

      if (res.type === 'success' && res.url) {
        const parsed = Linking.parse(res.url);
        
        // Supabase returns access_token and refresh_token in the URL hash fragment (#access_token=...&refresh_token=...)
        const urlParts = res.url.split('#');
        const hash = urlParts[1] || '';
        const params: Record<string, string> = {};
        
        hash.split('&').forEach((part: string) => {
          const [key, value] = part.split('=');
          if (key && value) {
            params[key] = decodeURIComponent(value);
          }
        });

        const access_token = params.access_token || (parsed.queryParams?.access_token as string);
        const refresh_token = params.refresh_token || (parsed.queryParams?.refresh_token as string);

        if (access_token && refresh_token) {
          const { data: sessionData, error: sessionErr } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (sessionErr) return rejectWithValue(sessionErr.message);
          if (!sessionData.user) return rejectWithValue('User session not created');

          // Fetch database profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sessionData.user.id)
            .single();

          let loggedInUser: User;

          if (profile && !profileError) {
            loggedInUser = {
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role as UserRole,
              flatNumber: profile.flat_number || undefined,
              tower: profile.tower || undefined,
              phone: profile.phone || undefined,
              societyName: profile.society_name || undefined,
              isApproved: profile.is_approved,
            };
          } else {
            // Auto-create database profile for first-time Google sign-ins
            const newProfile = {
              id: sessionData.user.id,
              name: sessionData.user.user_metadata?.full_name || sessionData.user.email?.split('@')[0] || 'User',
              email: sessionData.user.email || '',
              role: 'resident',
              is_approved: false,
            };

            const { error: insertErr } = await supabase
              .from('profiles')
              .insert(newProfile);

            if (insertErr) {
              console.error('Failed to auto-create profile row for Google login:', insertErr);
            }

            loggedInUser = {
              id: newProfile.id,
              name: newProfile.name,
              email: newProfile.email,
              role: newProfile.role as UserRole,
              isApproved: newProfile.is_approved,
            };
          }

          return loggedInUser;
        }
      }

      return rejectWithValue('Google sign in was cancelled or failed');
    } catch (err: any) {
      return rejectWithValue(err.message || 'Google OAuth failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSignedIn: (state, action: PayloadAction<boolean>) => {
      state.isSignedIn = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setSocietyLocked: (state, action: PayloadAction<boolean>) => {
      state.isSocietyLocked = action.payload;
    },
    setSubmittedName: (state, action: PayloadAction<string>) => {
      state.submittedName = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // signInThunk
      .addCase(signInThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isSignedIn = true;
      })
      .addCase(signInThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // signUpThunk
      .addCase(signUpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signUpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // signOutThunk
      .addCase(signOutThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signOutThunk.fulfilled, (state) => {
        state.user = null;
        state.isSignedIn = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(signOutThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchAllUsersThunk
      .addCase(fetchAllUsersThunk.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      // sendPhoneOTPThunk
      .addCase(sendPhoneOTPThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendPhoneOTPThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.devOtp) {
          state.devOtpSession = {
            phone: action.payload.phone,
            otp: action.payload.devOtp,
          };
        } else {
          state.devOtpSession = null;
        }
      })
      .addCase(sendPhoneOTPThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // verifyPhoneOTPThunk
      .addCase(verifyPhoneOTPThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPhoneOTPThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isSignedIn = true;
        state.devOtpSession = null;
      })
      .addCase(verifyPhoneOTPThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // signInWithGoogleThunk
      .addCase(signInWithGoogleThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInWithGoogleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isSignedIn = true;
      })
      .addCase(signInWithGoogleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSignedIn,
  setUser,
  setUsers,
  setSocietyLocked,
  setSubmittedName,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;

import React, { createContext, ReactNode, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '@/utils/supabase';
import { RootState } from '@/store';
import {
  setSignedIn,
  setUser,
  setSocietyLocked,
  setSubmittedName as setSubmittedNameAction,
  User,
  UserRole,
  checkPhoneExistsThunk,
  checkEmailExistsThunk,
  signInThunk,
  signUpThunk,
  signOutThunk,
  fetchAllUsersThunk,
  sendPhoneOTPThunk,
  verifyPhoneOTPThunk,
  signInWithGoogleThunk,
} from '@/store/slices/authSlice';

type AuthContextType = {
  isSignedIn: boolean;
  user: User | null;
  users: User[];
  signIn: (credentials: { email: string; password: string; role: UserRole }) => Promise<{ success: boolean; error?: string }>;
  signInDirect: (user: User) => void;
  signUp: (newUser: Omit<User, 'id'>) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  debugSwitchRole?: (role: UserRole) => void;
  isSocietyLocked: boolean;
  setIsSocietyLocked: (val: boolean) => void;
  submittedName: string;
  setSubmittedName: (val: string) => void;
  checkPhoneExists: (phone: string) => Promise<{ exists: boolean; user?: User }>;
  checkEmailExists: (email: string) => Promise<{ exists: boolean }>;
  sendPhoneOTP: (phone: string) => Promise<{ success: boolean; error?: string; devOtp?: string }>;
  verifyPhoneOTP: (phone: string, token: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  
  // Read state from Redux
  const isSignedIn = useSelector((state: RootState) => state.auth.isSignedIn);
  const user = useSelector((state: RootState) => state.auth.user);
  const users = useSelector((state: RootState) => state.auth.users);
  const isSocietyLocked = useSelector((state: RootState) => state.auth.isSocietyLocked);
  const submittedName = useSelector((state: RootState) => state.auth.submittedName);
  const devOtpSession = useSelector((state: RootState) => state.auth.devOtpSession);

  // Sync Supabase Auth listener with Redux state
  const handleSession = async (session: any) => {
    if (session?.user) {
      // Fetch database profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile && !error) {
        dispatch(setUser({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role as UserRole,
          flatNumber: profile.flat_number || undefined,
          tower: profile.tower || undefined,
          phone: profile.phone || undefined,
          societyName: profile.society_name || undefined,
          isApproved: profile.is_approved,
        }));
        dispatch(setSignedIn(true));
      } else {
        dispatch(setUser({
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          role: (session.user.user_metadata?.role as UserRole) || 'resident',
          isApproved: false,
        }));
        dispatch(setSignedIn(true));
      }
    } else {
      dispatch(setUser(null));
      dispatch(setSignedIn(false));
    }
  };

  useEffect(() => {
    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch profiles whenever an admin logs in
  useEffect(() => {
    if (isSignedIn && user?.role === 'admin') {
      dispatch(fetchAllUsersThunk() as any);
    }
  }, [isSignedIn, user?.role]);

  const signIn = async (credentials: { email: string; password: string; role: UserRole }): Promise<{ success: boolean; error?: string }> => {
    const resultAction = await dispatch(signInThunk(credentials) as any);
    if (signInThunk.fulfilled.match(resultAction)) {
      return { success: true };
    }
    return { success: false, error: resultAction.payload as string };
  };

  const signInDirect = (userData: User) => {
    dispatch(setUser(userData));
    dispatch(setSignedIn(true));
  };

  const signUp = async (newUserData: Omit<User, 'id'>): Promise<{ success: boolean; error?: string }> => {
    const resultAction = await dispatch(signUpThunk(newUserData) as any);
    if (signUpThunk.fulfilled.match(resultAction)) {
      return { success: true };
    }
    return { success: false, error: resultAction.payload as string };
  };

  const signOut = () => {
    dispatch(signOutThunk() as any);
  };

  const debugSwitchRole = async (role: UserRole) => {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', role)
      .limit(1);

    if (profiles && profiles.length > 0 && !error) {
      const p = profiles[0];
      dispatch(setUser({
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
      dispatch(setSignedIn(true));
    }
  };

  const setIsSocietyLocked = (val: boolean) => {
    dispatch(setSocietyLocked(val));
  };

  const setSubmittedName = (val: string) => {
    dispatch(setSubmittedNameAction(val));
  };

  const checkPhoneExists = async (phone: string): Promise<{ exists: boolean; user?: User }> => {
    const resultAction = await dispatch(checkPhoneExistsThunk(phone) as any);
    if (checkPhoneExistsThunk.fulfilled.match(resultAction)) {
      return resultAction.payload;
    }
    return { exists: false };
  };

  const checkEmailExists = async (email: string): Promise<{ exists: boolean }> => {
    const resultAction = await dispatch(checkEmailExistsThunk(email) as any);
    if (checkEmailExistsThunk.fulfilled.match(resultAction)) {
      return resultAction.payload;
    }
    return { exists: false };
  };

  const sendPhoneOTP = async (phone: string): Promise<{ success: boolean; error?: string; devOtp?: string }> => {
    const resultAction = await dispatch(sendPhoneOTPThunk(phone) as any);
    if (sendPhoneOTPThunk.fulfilled.match(resultAction)) {
      return {
        success: true,
        devOtp: resultAction.payload.devOtp,
      };
    }
    return { success: false, error: resultAction.payload as string };
  };

  const verifyPhoneOTP = async (phone: string, token: string): Promise<{ success: boolean; error?: string }> => {
    const resultAction = await dispatch(
      verifyPhoneOTPThunk({ phone, token, devOtpSession }) as any
    );
    if (verifyPhoneOTPThunk.fulfilled.match(resultAction)) {
      return { success: true };
    }
    return { success: false, error: resultAction.payload as string };
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    const resultAction = await dispatch(signInWithGoogleThunk() as any);
    if (signInWithGoogleThunk.fulfilled.match(resultAction)) {
      return { success: true };
    }
    return { success: false, error: resultAction.payload as string };
  };

  return (
    <AuthContext.Provider value={{
      isSignedIn,
      user,
      users,
      signIn,
      signInDirect,
      signUp,
      signOut,
      debugSwitchRole,
      isSocietyLocked,
      setIsSocietyLocked,
      submittedName,
      setSubmittedName,
      checkPhoneExists,
      checkEmailExists,
      sendPhoneOTP,
      verifyPhoneOTP,
      signInWithGoogle,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
export { User, UserRole };
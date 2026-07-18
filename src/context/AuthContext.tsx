import React, { createContext, ReactNode, useState } from 'react';

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
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Mock users for demonstration
const INITIAL_USERS: User[] = [
  {
    id: '1',
    name: 'Shiwam Shahare',
    email: 'resident@example.com',
    password: 'resident123',
    role: 'resident',
    flatNumber: '101A',
    tower: 'Tower A',
    phone: '+91 8412908901',
    isApproved: true
  },
  {
    id: '2',
    name: 'Security Guard',
    email: 'guard@example.com',
    password: 'guard123',
    role: 'guard',
    phone: '+91 8605978199',
    isApproved: true
  },
  {
    id: '3',
    name: 'Society Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    phone: '+91 0000000000',
    isApproved: true
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [isSocietyLocked, setIsSocietyLocked] = useState(false);
  const [submittedName, setSubmittedName] = useState('Shiwam');

  const signIn = (credentials: { email: string; password: string; role: UserRole }): Promise<{ success: boolean; error?: string }> => {
    return new Promise<{ success: boolean; error?: string }>((resolve) => {
      setTimeout(() => {
        const found = users.find(
          u =>
            u.email === credentials.email &&
            u.password === credentials.password &&
            u.role === credentials.role
        );

        if (found) {
          const { password, ...userWithoutPassword } = found;
          setUser(userWithoutPassword);
          setIsSignedIn(true);
          resolve({ success: true });
        } else {
          resolve({ success: false, error: 'Invalid credentials' });
        }
      }, 1000);
    });
  };

  const signInDirect = (userData: User) => {
    const { password, ...userWithoutPassword } = userData;
    setUser(userWithoutPassword);
    setIsSignedIn(true);
  };

  const signUp = (newUserData: Omit<User, 'id'>): Promise<{ success: boolean; error?: string }> => {
    return new Promise<{ success: boolean; error?: string }>((resolve) => {
      setTimeout(() => {
        // Check if email already exists
        const exists = users.some(u => u.email.toLowerCase() === newUserData.email.toLowerCase());
        if (exists) {
          resolve({ success: false, error: 'User with this email already exists' });
          return;
        }

        const newUserObj: User = {
          ...newUserData,
          id: String(users.length + 1),
          isApproved: false,
        };

        setUsers(prev => [...prev, newUserObj]);

        // Log in the user automatically
        const { password, ...userWithoutPassword } = newUserObj;
        setUser(userWithoutPassword);
        setIsSignedIn(true);

        resolve({ success: true });
      }, 1000);
    });
  };

  const signOut = () => {
    setUser(null);
    setIsSignedIn(false);
  };

  const debugSwitchRole = (role: UserRole) => {
    const foundUser = users.find(u => u.role === role);
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsSignedIn(true);
    }
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
    }}>
      {children}
    </AuthContext.Provider>
  );
};
import React, { createContext, useState, ReactNode } from 'react';

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
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Mock users for demonstration
const INITIAL_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'resident@example.com',
    password: 'resident123',
    role: 'resident',
    flatNumber: '101A',
    tower: 'Tower A',
    phone: '+1 (555) 123-4567'
  },
  {
    id: '2',
    name: 'Security Guard',
    email: 'guard@example.com',
    password: 'guard123',
    role: 'guard',
    phone: '+1 (555) 987-6543'
  },
  {
    id: '3',
    name: 'Society Admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1 (555) 000-1111'
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);

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
    <AuthContext.Provider value={{ isSignedIn, user, users, signIn, signInDirect, signUp, signOut, debugSwitchRole }}>
      {children}
    </AuthContext.Provider>
  );
};
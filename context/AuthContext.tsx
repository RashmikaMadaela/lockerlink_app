import { getUserProfile } from "@/firebase/db";
import { auth } from "@/firebaseconfig";
import { UserProfile } from "@/types";
import {
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User,
} from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

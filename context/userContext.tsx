// This file defines a UserContext to manage user state across the application.
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types/user";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>; 
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Gagal mengambil data user:", err);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return <UserContext.Provider value={{ user, setUser, refreshUser: fetchUser }}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType | null => {
  return useContext(UserContext) ?? null;
};

"use client";

import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ID, Query, type Models } from "appwrite";
import { account, databases, APPWRITE_DB_ID, USERS_COLLECTION_ID } from "@/lib/appwrite";
import type { Course, Order } from "@/data/mockData";

// Extended Appwrite User Type
export interface User {
  id: string;
  name: string;
  phone: string;
  roll: string;
  enrolledBatches: string[];
  enrolledCourses: Course[]; // For UI convenience
  orders: Order[]; // For UI convenience
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (roll: string, pass: string) => Promise<void>;
  register: (name: string, roll: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  theme: "light" | "dark";
  toggleTheme: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const fetchUserData = useCallback(async (userId: string, accountName: string) => {
    try {
      // Get document from users collection
      const docs = await databases.listDocuments(
        APPWRITE_DB_ID,
        USERS_COLLECTION_ID,
        [Query.equal("userId", userId)]
      );

      if (docs.total > 0) {
        const doc = docs.documents[0];
        return {
          id: userId,
          name: accountName,
          phone: doc.phone || "",
          roll: doc.roll,
          enrolledBatches: doc.enrolled_batches || [],
          enrolledCourses: [], // This would ideally be fetched from a courses collection mapping
          orders: [] // This would ideally be fetched from an orders collection mapping
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching user document:", error);
      return null;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const session = await account.get();
      const userData = await fetchUserData(session.$id, session.name);
      setUser(userData);
      
      // Sync cookie for middleware if needed
      document.cookie = "auth-token=true; path=/; max-age=86400; samesite=lax";
    } catch (error) {
      setUser(null);
      document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserData]);

  useEffect(() => {
    refreshUser();
    
    // Theme initialization
    const storedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (storedTheme) {
      setTheme(storedTheme);
      if (storedTheme === "dark") {
        document.documentElement.classList.add("dark");
      }
    }
  }, [refreshUser]);

  const login = useCallback(async (roll: string, pass: string) => {
    // Appwrite needs an email. We'll use roll@examify.me as a pseudo-email.
    const email = `${roll}@examify.me`;
    await account.createEmailPasswordSession(email, pass);
    await refreshUser();
  }, [refreshUser]);

  const register = useCallback(async (name: string, roll: string, pass: string) => {
    const email = `${roll}@examify.me`;
    // 1. Create Account
    const newUser = await account.create(ID.unique(), email, pass, name);
    
    // 2. Create Profile Document
    await databases.createDocument(
      APPWRITE_DB_ID,
      USERS_COLLECTION_ID,
      ID.unique(),
      {
        userId: newUser.$id,
        name: name,
        roll: roll,
        enrolled_batches: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    );

    // 3. Auto Login
    await login(roll, pass);
  }, [login]);

  const logout = useCallback(async () => {
    await account.deleteSession('current');
    setUser(null);
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout, 
      theme, 
      toggleTheme,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
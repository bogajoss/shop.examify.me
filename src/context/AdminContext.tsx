"use client";

import { useRouter } from "next/navigation";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";

export interface Admin {
  uid: string;
  username: string;
  name: string;
  role: string;
}

interface AdminContextType {
  admin: Admin | null;
  isLoading: boolean;
  login: (username: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchAdminData = useCallback(async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from("admins")
        .select("*")
        .eq("uid", uid)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        uid: data.uid,
        username: data.username,
        name: data.name,
        role: data.role,
      };
    } catch (error) {
      console.error("Error fetching admin data:", error);
      return null;
    }
  }, []);

  const refreshAdmin = useCallback(async () => {
    try {
      const storedUid = localStorage.getItem("admin_uid");
      if (storedUid) {
        const adminData = await fetchAdminData(storedUid);
        if (adminData) {
          setAdmin(adminData);
          // Set a cookie for middleware to detect admin session
          document.cookie =
            "admin-token=true; path=/; max-age=86400; samesite=lax";
        } else {
          localStorage.removeItem("admin_uid");
          setAdmin(null);
          document.cookie =
            "admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
      } else {
        setAdmin(null);
      }
    } catch (_error) {
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAdminData]);

  useEffect(() => {
    refreshAdmin();
  }, [refreshAdmin]);

  const login = useCallback(
    async (username: string, pass: string) => {
      const { data, error } = await supabase
        .from("admins")
        .select("uid")
        .eq("username", username)
        .eq("password", pass)
        .single();

      if (error || !data) {
        throw new Error("Invalid username or password");
      }

      localStorage.setItem("admin_uid", data.uid);
      await refreshAdmin();
    },
    [refreshAdmin],
  );

  const logout = useCallback(async () => {
    localStorage.removeItem("admin_uid");
    setAdmin(null);
    document.cookie =
      "admin-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/admin/login");
  }, [router]);

  return (
    <AdminContext.Provider
      value={{
        admin,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined)
    throw new Error("useAdmin must be used within an AdminProvider");
  return context;
};

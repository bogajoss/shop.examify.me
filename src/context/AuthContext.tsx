"use client";

import { createClient } from "@supabase/supabase-js";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { type Course, db, type Order } from "@/data/mockData";
import { supabase } from "@/lib/supabase";

// Extended User Type
export interface User {
  id: string;
  name: string;
  phone: string;
  roll: string;
  enrolledBatches: string[];
  enrolledCourses: Course[];
  orders: Order[];
}

interface PaymentDetails {
  paymentMethod: string;
  paymentNumber: string;
  trxId: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (roll: string, pass: string) => Promise<void>;
  register: (name: string, roll: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  submitOrder: (course: Course, paymentDetails: PaymentDetails) => Promise<void>;
  approveOrder: (orderId: string) => Promise<void>;
  redeemToken: (token: string) => Promise<boolean>;
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

  const fetchUserData = useCallback(async (uid: string) => {
    try {
      const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("uid", uid)
        .single();

      if (error || !userData) {
        console.error("Error fetching user data:", error);
        return null;
      }

      const enrolledBatches: string[] = userData.enrolled_batches || [];

      // Map enrolled batches to courses using batchId
      const enrolledCourses = db.courses.filter((c) =>
        enrolledBatches.includes(c.batchId)
      );

      // Fetch pending or rejected orders to show in Dashboard
      // (Approved orders will be handled via enrollment)
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("student_id", uid)
        .order("created_at", { ascending: false });

      // Transform DB orders to frontend Order objects
      const dbOrders: Order[] = (orderData || []).map(o => {
        // Find course details for this order
        const course = db.courses.find(c => c.batchId === o.batch_id);
        
        return {
          id: o.id,
          student: userData.name || "Student",
          phone: o.payment_number || "N/A",
          courseId: course?.id || "UNKNOWN",
          courseName: course?.title || "Unknown Batch",
          amount: o.amount,
          status: o.status === "approved" ? "Approved" : "Pending",
          token: o.assigned_token || null, // Use the real token from DB
          date: new Date(o.created_at).toLocaleDateString("en-GB"),
        };
      });

      // Merge enrolled courses as "Approved" orders if not already in dbOrders (for backward compatibility or direct enrollments)
      // For now, let's just use dbOrders combined with enrolled courses if needed, 
      // but dbOrders should be the source of truth for "Order History".
      
      // If we want to show enrolled courses in the order list even if they didn't go through the new 'orders' table
      // (e.g. legacy or manual enrollments), we might need to synthesize them.
      // But let's stick to real orders + mapped enrollments for now.

      return {
        id: userData.uid,
        name: userData.name,
        phone: "N/A",
        roll: userData.roll,
        enrolledBatches,
        enrolledCourses,
        orders: dbOrders,
      };
    } catch (error) {
      console.error("Error in fetchUserData:", error);
      return null;
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const storedUid = localStorage.getItem("user_uid");
      if (storedUid) {
        const userData = await fetchUserData(storedUid);
        if (userData) {
          setUser(userData);
          document.cookie =
            "auth-token=true; path=/; max-age=86400; samesite=lax";
        } else {
            localStorage.removeItem("user_uid");
            setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (_error) {
      setUser(null);
      document.cookie =
        "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserData]);

  useEffect(() => {
    refreshUser();
    const storedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (storedTheme) {
      setTheme(storedTheme);
      if (storedTheme === "dark")
        document.documentElement.classList.add("dark");
    }
  }, [refreshUser]);

  const login = useCallback(
    async (roll: string, pass: string) => {
      const { data, error } = await supabase
        .from("users")
        .select("uid")
        .eq("roll", roll)
        .eq("pass", pass)
        .single();

      if (error || !data) {
        throw new Error("Invalid roll or password");
      }

      localStorage.setItem("user_uid", data.uid);
      await refreshUser();
    },
    [refreshUser]
  );

  const register = useCallback(
    async (name: string, roll: string, pass: string) => {
      const { data: existing } = await supabase
        .from("users")
        .select("uid")
        .eq("roll", roll)
        .single();

      if (existing) {
        throw new Error("User with this roll already exists");
      }

      const { data, error } = await supabase
        .from("users")
        .insert({
          name,
          roll,
          pass,
          enrolled_batches: [],
        })
        .select("uid")
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        localStorage.setItem("user_uid", data.uid);
        await refreshUser();
      }
    },
    [refreshUser]
  );

  const logout = useCallback(async () => {
    localStorage.removeItem("user_uid");
    setUser(null);
    document.cookie =
      "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }, []);

  const submitOrder = useCallback(
    async (course: Course, paymentDetails: PaymentDetails) => {
      if (!user) return;

      const { error } = await supabase
        .from("orders")
        .insert({
          student_id: user.id,
          batch_id: course.batchId,
          amount: course.price,
          payment_method: paymentDetails.paymentMethod,
          payment_number: paymentDetails.paymentNumber,
          trx_id: paymentDetails.trxId,
          status: "pending",
        });

      if (error) {
        throw error;
      }

      await refreshUser();
    },
    [user, refreshUser]
  );

  const approveOrder = useCallback(
    async (orderId: string) => {
      console.log("Approve order mock", orderId);
      await refreshUser();
    },
    [refreshUser]
  );

  const redeemToken = useCallback(
    async (token: string): Promise<boolean> => {
      if (token === "FREE-ACCESS") {
          return false;
      }
      return false;
    },
    []
  );

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  }, [theme]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        submitOrder,
        approveOrder,
        redeemToken,
        theme,
        toggleTheme,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

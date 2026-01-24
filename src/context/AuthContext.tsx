"use client";

import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Course, Order } from "@/data/mockData";
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
  register: (name: string, phone: string, pass: string) => Promise<string>;
  logout: () => Promise<void>;
  submitOrder: (
    course: Course,
    paymentDetails: PaymentDetails,
  ) => Promise<void>;
  approveOrder: (orderId: string) => Promise<void>;
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

      // Fetch batch details for enrolled courses from Supabase
      let enrolledCourses: any[] = [];
      if (enrolledBatches.length > 0) {
        const { data: batchesData } = await supabase
          .from("batches")
          .select("*")
          .in("id", enrolledBatches);

        enrolledCourses = (batchesData || []).map((b) => ({
          id: b.id,
          title: b.name,
          category: b.category,
          price: b.price,
          batch: b.name.split(" ")[0],
          description: b.description,
          features: b.features,
          batchId: b.id,
        }));
      }

      // Fetch pending or rejected orders to show in Dashboard
      const { data: orderData } = await supabase
        .from("orders")
        .select("*, batch:batches(name)")
        .eq("student_id", uid)
        .order("created_at", { ascending: false });

      // Transform DB orders to frontend Order objects
      const dbOrders: Order[] = (orderData || []).map((o) => {
        return {
          id: o.id,
          student: userData.name || "Student",
          phone: o.payment_number || "N/A",
          courseId: o.batch_id,
          courseName: (o as any).batch?.name || "Unknown Batch",
          amount: o.amount,
          status:
            o.status === "approved"
              ? "Approved"
              : o.status === "rejected"
                ? "Rejected"
                : "Pending",
          token: o.assigned_token || null,
          adminComment: o.admin_comment || null,
          date: new Date(o.created_at).toLocaleDateString("en-GB"),
        };
      });

      // Merge enrolled courses as "Approved" orders if not already in dbOrders
      enrolledCourses.forEach((course) => {
        const hasOrder = dbOrders.some((o) => o.courseId === course.batchId);
        if (!hasOrder) {
          dbOrders.push({
            id: `virtual-${course.batchId}`,
            student: userData.name || "Student",
            phone: "N/A",
            courseId: course.batchId,
            courseName: course.title,
            amount: course.price,
            status: "Approved",
            token: null,
            date: "Joined", // or generic date
          });
        }
      });

      return {
        id: userData.uid,
        name: userData.name,
        phone: userData.phone || "N/A",
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
      let { data, error } = await supabase
        .from("users")
        .select("uid")
        .eq("roll", roll)
        .eq("pass", pass)
        .maybeSingle();

      if (!data) {
        const { data: phoneData, error: phoneError } = await supabase
          .from("users")
          .select("uid")
          .eq("phone", roll)
          .eq("pass", pass)
          .maybeSingle();

        if (phoneData) {
          data = phoneData;
          error = phoneError;
        }
      }

      if (error || !data) {
        throw new Error("Invalid roll or password");
      }

      localStorage.setItem("user_uid", data.uid);
      await refreshUser();
    },
    [refreshUser],
  );

  const register = useCallback(
    async (name: string, phone: string, pass: string) => {
      let attempts = 0;
      const maxAttempts = 5;

      while (attempts < maxAttempts) {
        // 1. Fetch the latest roll to generate the next one
        const { data: latestUser } = await supabase
          .from("users")
          .select("roll")
          .ilike("roll", "ReadingZone-%") // Only filter for relevant rolls
          .order("created_at", { ascending: false }) // Sort by created_at to get the truly latest user in this series
          .limit(1);

        const latestRoll = latestUser?.[0]?.roll;
        let nextRoll = "ReadingZone-001";

        if (latestRoll && latestRoll.startsWith("ReadingZone-")) {
          const lastNum = parseInt(latestRoll.split("-")[1]);
          if (!isNaN(lastNum)) {
            // Pad with leading zeros to maintain 3-digit format
            const nextNum = lastNum + 1;
            nextRoll = `ReadingZone-${nextNum.toString().padStart(3, "0")}`;
          }
        }

        // 2. Try to insert
        const { data, error } = await supabase
          .from("users")
          .insert({
            name,
            phone,
            roll: nextRoll,
            pass,
            enrolled_batches: [],
          })
          .select("uid")
          .single();

        if (!error && data) {
          localStorage.setItem("user_uid", data.uid);
          await refreshUser();
          return nextRoll; // Return the generated roll
        }

        // 3. If it's a duplicate roll error (code 23505), loop and try again
        if (error?.code === "23505") {
          attempts++;
          // Add a small random delay to reduce race conditions
          await new Promise((resolve) =>
            setTimeout(resolve, Math.random() * 500),
          );
          continue;
        }

        // For other errors, throw immediately
        throw error;
      }

      throw new Error(
        "Could not generate a unique roll number after several attempts. Please try again.",
      );
    },
    [refreshUser],
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

      const { error } = await supabase.from("orders").insert({
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
    [user, refreshUser],
  );

  const approveOrder = useCallback(
    async (orderId: string) => {
      console.log("Approve order mock", orderId);
      await refreshUser();
    },
    [refreshUser],
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

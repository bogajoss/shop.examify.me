"use client";

import { ID, Query } from "appwrite";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { type Course, db, type Order } from "@/data/mockData";
import {
  APPWRITE_DB_ID,
  account,
  databases,
  USERS_COLLECTION_ID,
} from "@/lib/appwrite";

const ORDERS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID || "orders";

// Extended Appwrite User Type
export interface User {
  id: string;
  name: string;
  phone: string;
  roll: string;
  enrolledBatches: string[];
  enrolledCourses: Course[];
  orders: Order[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (roll: string, pass: string) => Promise<void>;
  register: (name: string, roll: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  submitOrder: (course: Course) => Promise<void>;
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

  const fetchUserData = useCallback(
    async (userId: string, accountName: string) => {
      try {
        const userDocs = await databases.listDocuments(
          APPWRITE_DB_ID,
          USERS_COLLECTION_ID,
          [Query.equal("userId", userId)],
        );

        if (userDocs.total > 0) {
          const uDoc = userDocs.documents[0];

          // Fetch Orders
          let orders: Order[] = [];
          try {
            const orderDocs = await databases.listDocuments(
              APPWRITE_DB_ID,
              ORDERS_COLLECTION_ID,
              [Query.equal("userId", userId), Query.orderDesc("$createdAt")],
            );
            orders = orderDocs.documents.map((d) => ({
              id: d.$id,
              student: d.student,
              phone: d.phone,
              courseId: d.courseId,
              courseName: d.courseName,
              amount: d.amount,
              status: d.status,
              token: d.token,
              date: d.date,
            }));
          } catch (e) {
            console.error("Orders fetch failed", e);
          }

          const enrolledBatches = uDoc.enrolled_batches || [];
          const enrolledCourses = db.courses.filter((c) =>
            enrolledBatches.includes(c.id),
          );

          return {
            id: userId,
            name: accountName,
            phone: uDoc.phone || "",
            roll: uDoc.roll,
            enrolledBatches,
            enrolledCourses,
            orders,
          };
        }
        return null;
      } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
      }
    },
    [],
  );

  const refreshUser = useCallback(async () => {
    try {
      const session = await account.get();
      const userData = await fetchUserData(session.$id, session.name);
      setUser(userData);
      document.cookie = "auth-token=true; path=/; max-age=86400; samesite=lax";
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
      const email = `${roll}@examify.me`;
      await account.createEmailPasswordSession(email, pass);
      await refreshUser();
    },
    [refreshUser],
  );

  const register = useCallback(
    async (name: string, roll: string, pass: string) => {
      const email = `${roll}@examify.me`;
      const newUser = await account.create(ID.unique(), email, pass, name);
      await databases.createDocument(
        APPWRITE_DB_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        {
          userId: newUser.$id,
          name,
          roll,
          enrolled_batches: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      );
      await login(roll, pass);
    },
    [login],
  );

  const logout = useCallback(async () => {
    await account.deleteSession("current");
    setUser(null);
    document.cookie =
      "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }, []);

  const submitOrder = useCallback(
    async (course: Course) => {
      if (!user) return;
      await databases.createDocument(
        APPWRITE_DB_ID,
        ORDERS_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.id,
          student: user.name,
          phone: user.phone || "N/A",
          courseId: course.id,
          courseName: course.title,
          amount: course.price,
          status: "Pending",
          date: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        },
      );
      await refreshUser();
    },
    [user, refreshUser],
  );

  const approveOrder = useCallback(
    async (orderId: string) => {
      if (!user) return;
      const token = `EXM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      await databases.updateDocument(
        APPWRITE_DB_ID,
        ORDERS_COLLECTION_ID,
        orderId,
        {
          status: "Approved",
          token,
        },
      );
      await refreshUser();
    },
    [user, refreshUser],
  );

  const redeemToken = useCallback(
    async (token: string): Promise<boolean> => {
      if (!user) return false;

      // Find order with this token
      const orderDocs = await databases.listDocuments(
        APPWRITE_DB_ID,
        ORDERS_COLLECTION_ID,
        [Query.equal("token", token), Query.equal("status", "Approved")],
      );

      if (orderDocs.total === 0) return false;
      const order = orderDocs.documents[0];

      // Add course to user's enrolled_batches
      if (!user.enrolledBatches.includes(order.courseId)) {
        const userDocs = await databases.listDocuments(
          APPWRITE_DB_ID,
          USERS_COLLECTION_ID,
          [Query.equal("userId", user.id)],
        );
        if (userDocs.total > 0) {
          await databases.updateDocument(
            APPWRITE_DB_ID,
            USERS_COLLECTION_ID,
            userDocs.documents[0].$id,
            {
              enrolled_batches: [...user.enrolledBatches, order.courseId],
              updated_at: new Date().toISOString(),
            },
          );
        }
      }

      await refreshUser();
      return true;
    },
    [user, refreshUser],
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

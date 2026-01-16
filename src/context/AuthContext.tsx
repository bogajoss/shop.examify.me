'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Order, Course, db } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  login: (phone: string, name?: string) => void;
  logout: () => void;
  submitOrder: (course: Course) => void;
  approveOrder: (orderId: string) => void;
  redeemToken: (token: string) => boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (storedTheme) {
      setTheme(storedTheme);
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const login = useCallback((phone: string, name: string = 'Student') => {
    // In a real app, this would be an API call
    const newUser: User = {
      name,
      phone,
      enrolledCourses: [],
      orders: db.initialOrders.filter(o => o.phone === phone),
    };
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    // Set cookie for middleware
    document.cookie = "auth-token=true; path=/; max-age=86400; samesite=lax";
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('currentUser');
    // Remove cookie
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }, []);

  const submitOrder = useCallback((course: Course) => {
    if (!user) return;

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      student: user.name,
      phone: user.phone,
      courseId: course.id,
      courseName: course.title,
      amount: course.price,
      status: 'Pending',
      token: null,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    const updatedUser = {
      ...user,
      orders: [newOrder, ...user.orders],
    };

    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  }, [user]);

  const approveOrder = useCallback((orderId: string) => {
    if (!user) return;

    const updatedOrders = user.orders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Approved' as const,
          token: `EXM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        };
      }
      return o;
    });

    const updatedUser = {
      ...user,
      orders: updatedOrders,
    };

    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  }, [user]);

  const redeemToken = useCallback((token: string): boolean => {
    if (!user) return false;

    const order = user.orders.find(o => o.token === token && o.status === 'Approved');
    if (!order) return false;

    // Check if already enrolled
    if (user.enrolledCourses.some(c => c.id === order.courseId)) return true;

    const course = db.courses.find(c => c.id === order.courseId);
    if (!course) return false;

    const updatedUser = {
      ...user,
      enrolledCourses: [...user.enrolledCourses, course],
    };

    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    return true;
  }, [user]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <AuthContext.Provider value={{ user, login, logout, submitOrder, approveOrder, redeemToken, theme, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

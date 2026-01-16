"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-20 sm:bottom-10 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-6 z-[100] flex flex-col gap-2 pointer-events-none items-center sm:items-end w-full max-w-sm px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${
              toast.type === "success"
                ? "bg-primary"
                : toast.type === "error"
                  ? "bg-destructive"
                  : "bg-primary/80"
            } text-primary-foreground px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 pointer-events-auto min-w-[300px] max-w-[90vw] animate-in slide-in-from-bottom-5 duration-300 justify-center sm:justify-start`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span className="text-sm font-medium text-center sm:text-left">
              {toast.message}
            </span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

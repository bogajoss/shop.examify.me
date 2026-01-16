"use client";

import type React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "destructive" | "secondary";
  size?: "sm" | "md" | "lg" | "icon";
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50 rounded-full";

  const variants = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 shadow-sm border-[3px] border-transparent",
    outline:
      "border-[3px] border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/30",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-[3px] border-transparent",
    ghost: "hover:bg-accent hover:text-accent-foreground border-none",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90 border-[3px] border-transparent",
  };

  const sizes = {
    sm: "h-9 px-4 text-xs",
    md: "h-10 px-6 text-sm",
    lg: "h-12 px-8 text-base font-bold",
    icon: "h-9 w-9 p-0",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

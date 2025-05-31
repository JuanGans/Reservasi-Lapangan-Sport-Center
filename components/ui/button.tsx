import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

export function Button({ children, variant = "default", className = "", ...props }: ButtonProps) {
  const baseClass = "px-4 py-2 rounded text-sm font-medium focus:outline-none focus:ring-2";
  const variantClass =
    variant === "outline"
      ? "border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 focus:ring-blue-400"
      : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400";

  return (
    <button {...props} className={`${baseClass} ${variantClass} ${className}`}>
      {children}
    </button>
  );
}

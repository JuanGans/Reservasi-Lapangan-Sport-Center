import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={`border border-gray-300 rounded-md shadow-sm bg-white p-4 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

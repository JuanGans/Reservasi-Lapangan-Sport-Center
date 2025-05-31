import React from "react";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardContent({ children, className, ...props }: CardContentProps) {
  return (
    <div {...props} className={`text-gray-700 ${className ?? ""}`}>
      {children}
    </div>
  );
}

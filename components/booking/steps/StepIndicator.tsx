import React from "react";
import { motion } from "framer-motion";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="fixed top-20 sm:left-0 lg:left-8 right-0 w-full z-10 bg-white px-4 sm:px-6">
      <div className="overflow-x-auto">
        <div className="relative flex items-center justify-center gap-4 sm:gap-6 py-6 w-max mx-auto">
          {steps.map((label, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const isLast = index === steps.length - 1;

            return (
              <div key={index} className="relative flex flex-col items-center text-center">
                {/* Desktop connector line */}
                {index > 0 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      backgroundColor: isActive || isCompleted ? "#2563eb" : "#e5e7eb",
                      width: index === 1 ? 100 : index === 2 ? 95 : 45,
                    }}
                    transition={{ duration: 0.4 }}
                    className={`hidden sm:block absolute ${index === 1 ? "-left-[50px]" : index === 2 ? "-left-[75px]" : "-left-[45px]"} top-4 h-1 rounded-full`}
                  />
                )}

                {/* Mobile connector line */}
                {!isLast && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: currentStep > index ? "32px" : "32px",
                      backgroundColor: currentStep > index ? "#2563eb" : "#d1d5db",
                    }}
                    transition={{ duration: 0.4 }}
                    className="sm:hidden absolute top-1/2 left-full h-0.5"
                  />
                )}

                {/* Step Circle (mobile + desktop) */}
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: isActive ? "#2563eb" : isCompleted ? "#dbeafe" : "#f3f4f6",
                    borderColor: isActive ? "#2563eb" : isCompleted ? "#bfdbfe" : "#d1d5db",
                    color: isActive ? "#ffffff" : isCompleted ? "#2563eb" : "#9ca3af",
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold border z-10"
                >
                  {index + 1}
                </motion.div>

                {/* Step Label (Desktop only) */}
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    color: isActive ? "#1e40af" : "#9ca3af",
                  }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hidden sm:block mt-2 text-xs sm:text-sm font-medium text-center w-max"
                >
                  {label}
                </motion.span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;

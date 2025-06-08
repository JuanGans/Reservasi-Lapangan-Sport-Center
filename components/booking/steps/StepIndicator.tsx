import React from "react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex justify-between mb-6">
      {steps.map((label, index) => (
        <div key={index} className="flex-1 text-center relative">
          <div className={`w-full h-1 ${index <= currentStep ? "bg-blue-600" : "bg-gray-200"} rounded-full mb-2`} />
          <span className={`text-sm font-medium ${index === currentStep ? "text-blue-800" : "text-gray-400"}`}>{label}</span>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;

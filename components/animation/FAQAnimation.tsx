import { useState, useRef, useEffect } from "react";

const FAQAnimation = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [isOpen]);

  return (
    <div className="bg-white rounded-md shadow px-4 py-3 cursor-pointer">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center font-semibold text-blue-900 focus:outline-none cursor-pointer" aria-expanded={isOpen}>
        <span>{question}</span>
        <i className={`ml-2 fas ${isOpen ? "fa-chevron-up" : "fa-chevron-down"}`} aria-hidden="true" />
      </button>
      <div ref={contentRef} style={{ maxHeight: height }} className="overflow-hidden transition-max-height duration-300 ease-in-out text-sm text-gray-600 mt-2">
        <p>{answer}</p>
      </div>
    </div>
  );
};

export default FAQAnimation;

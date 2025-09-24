"use client";
import React from "react";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  instructions?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children, instructions }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg relative max-w-6xl w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">{children}</div>
            {instructions && (
                <div className="p-4 border-l border-gray-200">
                    <h4 className="text-lg font-bold mb-2">Instructions</h4>
                    {instructions}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Modal;

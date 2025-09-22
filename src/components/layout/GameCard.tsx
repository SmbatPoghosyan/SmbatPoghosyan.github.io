import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";

interface GameCardProps {
  title: string;
  description: string;
  image?: string | string[];
  previewComponent?: React.ReactNode;
  onClick: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ title, description, image, previewComponent, onClick }) => {
  const frames = useMemo(() => (Array.isArray(image) ? image : image ? [image] : []), [image]);
  const [frameIndex, setFrameIndex] = useState(0);
  
  // Add random delay for floating animation
  const animationDelay = useMemo(() => Math.random() * 2, []);

  useEffect(() => {
    setFrameIndex(0);

    if (frames.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, 250);

    return () => {
      window.clearInterval(interval);
    };
  }, [frames]);

  const currentImage = frames[frameIndex];

  return (
    <div
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer game-card transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-2"
      onClick={onClick}
      style={{
        animationDelay: `${animationDelay}s`
      }}
    >
      <div className="relative w-full h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
        {previewComponent ? (
          <div className="w-full h-full flex items-center justify-center">
            {previewComponent}
          </div>
        ) : currentImage ? (
          <Image 
            src={currentImage} 
            alt={title} 
            fill 
            className="object-contain transition-transform duration-300 hover:scale-110" 
          />
        ) : (
          <div className="text-gray-400">No preview available</div>
        )}
      </div>
      <div className="p-6 transition-colors duration-300 hover:bg-gray-50">
        <h3 className="text-xl font-bold mb-2 transition-colors duration-300 hover:text-blue-600">{title}</h3>
        <p className="text-gray-700 transition-colors duration-300">{description}</p>
      </div>
    </div>
  );
};

export default GameCard;

import React from "react";
import Image from "next/image";

interface GameCardProps {
  title: string;
  description: string;
  image: string;
  onClick: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ title, description, image, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer game-card"
      onClick={onClick}
    >
      <div className="relative w-full h-48">
        <Image src={image} alt={title} fill className="object-contain" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-700">{description}</p>
      </div>
    </div>
  );
};

export default GameCard;

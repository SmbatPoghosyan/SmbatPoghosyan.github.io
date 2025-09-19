"use client";
import React, { useState } from 'react';

const Clicker: React.FC = () => {
  const [score, setScore] = useState(0);

  const handleClick = () => {
    setScore(score + 1);
  };

  return (
    <div className="text-center p-8">
      <h3 className="text-2xl font-bold mb-4">Clicker Game</h3>
      <p className="text-4xl font-bold mb-8">{score}</p>
      <button
        onClick={handleClick}
        className="px-8 py-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transform hover:scale-110 transition-transform duration-200"
      >
        Click Me!
      </button>
    </div>
  );
};

export default Clicker;

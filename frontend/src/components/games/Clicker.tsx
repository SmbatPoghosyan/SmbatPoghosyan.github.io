"use client";
import React, { useState, useEffect } from 'react';

const Clicker: React.FC = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameState, setGameState] = useState<'idle' | 'running' | 'finished'>('idle');

  useEffect(() => {
    if (gameState !== 'running' || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setGameState('finished');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(15);
    setGameState('running');
  };

  const handleClick = () => {
    if (gameState === 'running') {
      setScore(score + 1);
    }
  };

  return (
    <div className="text-center p-8">
      <h3 className="text-2xl font-bold mb-4">Clicker Game</h3>

      {gameState === 'idle' && (
        <button
          onClick={startGame}
          className="px-8 py-4 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Start Game
        </button>
      )}

      {gameState === 'running' && (
        <>
          <p className="text-2xl mb-4">Time Left: {timeLeft}</p>
          <p className="text-4xl font-bold mb-8">{score}</p>
          <button
            onClick={handleClick}
            className="px-8 py-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transform hover:scale-110 transition-transform duration-200"
          >
            Click Me!
          </button>
        </>
      )}

      {gameState === 'finished' && (
        <>
          <p className="text-2xl mb-4">Game Over!</p>
          <p className="text-4xl font-bold mb-8">Final Score: {score}</p>
          <button
            onClick={startGame}
            className="px-8 py-4 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            Play Again
          </button>
        </>
      )}
    </div>
  );
};

export default Clicker;

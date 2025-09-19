"use client";
import React, { useState, useEffect, useRef } from 'react';

const DinoRun: React.FC = () => {
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState<{ x: number }[]>([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const dinoRef = useRef<HTMLDivElement>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isJumping && !isGameOver) {
        setIsJumping(true);
        setTimeout(() => setIsJumping(false), 500);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isJumping, isGameOver]);

  useEffect(() => {
    if (isGameOver) return;

    const gameLoop = setInterval(() => {
      // Move obstacles
      setObstacles(prevObstacles => {
        const newObstacles = prevObstacles
          .map(o => ({ ...o, x: o.x - 5 }))
          .filter(o => o.x > -20);

        if (Math.random() < 0.02 && newObstacles.length < 3) {
          newObstacles.push({ x: gameAreaRef.current?.clientWidth || 600 });
        }

        return newObstacles;
      });

      // Check for collisions
      if (dinoRef.current && gameAreaRef.current) {
        const dinoRect = dinoRef.current.getBoundingClientRect();
        obstacles.forEach(obstacle => {
          const obstacleEl = document.getElementById(`obstacle-${obstacle.x}`);
          if (obstacleEl) {
            const obstacleRect = obstacleEl.getBoundingClientRect();
            if (
              dinoRect.right > obstacleRect.left &&
              dinoRect.left < obstacleRect.right &&
              dinoRect.bottom > obstacleRect.top
            ) {
              setIsGameOver(true);
            }
          }
        });
      }

      setScore(prevScore => prevScore + 1);
    }, 50);

    return () => clearInterval(gameLoop);
  }, [obstacles, isGameOver, isJumping]);

  const restartGame = () => {
    setIsGameOver(false);
    setScore(0);
    setObstacles([]);
  };

  return (
    <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">Dino Run</h3>
        <div
            ref={gameAreaRef}
            className="relative w-full h-64 bg-gray-200 border-2 border-gray-300 overflow-hidden"
        >
            <div
            ref={dinoRef}
            className={`absolute w-10 h-10 bg-green-500 bottom-0 transition-transform duration-500 ${isJumping ? 'translate-y-[-100px]' : 'translate-y-0'}`}
            style={{ left: '50px' }}
            ></div>
            {obstacles.map((obstacle) => (
            <div
                key={obstacle.x}
                id={`obstacle-${obstacle.x}`}
                className="absolute w-5 h-10 bg-red-500 bottom-0"
                style={{ left: `${obstacle.x}px` }}
            ></div>
            ))}
        </div>
        <div className="mt-4">
            <p className="text-xl">Score: {score}</p>
            {isGameOver && (
            <div>
                <p className="text-red-500 font-bold text-2xl">Game Over</p>
                <button
                    onClick={restartGame}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Restart
                </button>
            </div>
            )}
        </div>
    </div>
  );
};

export default DinoRun;

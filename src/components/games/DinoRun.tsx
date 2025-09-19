"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const DinoRun: React.FC = () => {
    const [isJumping, setIsJumping] = useState(false);
    const [jumpCount, setJumpCount] = useState(0);
    const [obstacles, setObstacles] = useState<{ id: number; x: number; width: number; height: number }[]>([]);
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const dinoRef = useRef<HTMLDivElement>(null);
    const gameAreaRef = useRef<HTMLDivElement>(null);
    const gameLoopRef = useRef<number>();
    const lastTimeRef = useRef<number>();

    const handleJump = () => {
      if (jumpCount < 2) {
        setIsJumping(true);
        setJumpCount(jumpCount + 1);
        setTimeout(() => {
          setIsJumping(false);
          if (jumpCount === 1) {
            setTimeout(() => setJumpCount(0), 300);
          }
        }, 300);
      }
    };

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space' && !isGameOver) {
          e.preventDefault();
          handleJump();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isGameOver, jumpCount]);

    const gameLoop = (time: number) => {
        if (isGameOver) return;

        if (lastTimeRef.current === undefined) {
          lastTimeRef.current = time;
          gameLoopRef.current = requestAnimationFrame(gameLoop);
          return;
        }

        const deltaTime = time - lastTimeRef.current;

        // Move obstacles
        let speed = 5 + score / 200;
        setObstacles(prevObstacles => {
          const newObstacles = prevObstacles
            .map(o => ({ ...o, x: o.x - speed * (deltaTime / 16) }))
            .filter(o => o.x > -o.width);

          const spawnThreshold = Math.max(0.01, 0.05 - score / 10000);
          if (Math.random() < spawnThreshold && newObstacles.length < 4 && (newObstacles.length === 0 || newObstacles[newObstacles.length - 1].x < (gameAreaRef.current?.clientWidth || 600) - 200)) {
            const newObstacle = {
                id: Date.now(),
                x: gameAreaRef.current?.clientWidth || 600,
                width: 20 + Math.random() * 30,
                height: 30 + Math.random() * 40,
            };
            newObstacles.push(newObstacle);
          }

          return newObstacles;
        });

        // Check for collisions
        if (dinoRef.current && gameAreaRef.current) {
          const dinoRect = dinoRef.current.getBoundingClientRect();
          obstacles.forEach(obstacle => {
            const obstacleEl = document.getElementById(`obstacle-${obstacle.id}`);
            if (obstacleEl) {
              const obstacleRect = obstacleEl.getBoundingClientRect();
              if (
                dinoRect.right > obstacleRect.left &&
                dinoRect.left < obstacleRect.right &&
                dinoRect.bottom > obstacleRect.top &&
                dinoRect.top < obstacleRect.bottom
              ) {
                setIsGameOver(true);
              }
            }
          });
        }

        setScore(prevScore => prevScore + Math.floor(deltaTime / 10));

        lastTimeRef.current = time;
        if (!isGameOver) {
            gameLoopRef.current = requestAnimationFrame(gameLoop);
        }
      };

    useEffect(() => {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        return () => {
            if(gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        }
    }, [isGameOver, obstacles]);

    const restartGame = () => {
      setIsGameOver(false);
      setScore(0);
      setObstacles([]);
      setJumpCount(0);
      lastTimeRef.current = undefined;
    };

    return (
      <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Dino Run</h3>
          <div
              ref={gameAreaRef}
              className="relative w-full h-80 bg-gray-200 border-2 border-gray-300 overflow-hidden"
          >
              <div
              ref={dinoRef}
              className={`absolute w-20 h-20 bottom-0 transition-transform duration-300 ${isJumping ? 'translate-y-[-120px]' : 'translate-y-0'}`}
              style={{ left: '50px' }}
              >
                  <Image
                      src="/games/dino.svg"
                      alt="Dino"
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                  />
              </div>
              {obstacles.map((obstacle) => (
              <div
                  key={obstacle.id}
                  id={`obstacle-${obstacle.id}`}
                  className="absolute bg-red-500 bottom-0"
                  style={{ left: `${obstacle.x}px`, width: `${obstacle.width}px`, height: `${obstacle.height}px` }}
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

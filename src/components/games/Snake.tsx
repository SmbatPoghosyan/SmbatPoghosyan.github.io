"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const TILE_SIZE = 20;

type SnakeSegment = { x: number; y: number };
type Food = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const Snake: React.FC = () => {
  const [snake, setSnake] = useState<SnakeSegment[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Food>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const directionRef = useRef<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const generateFood = useCallback(() => {
    setFood({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    });
  }, []);

  const restartGame = useCallback(() => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setIsGameOver(false);
    setScore(0);
    generateFood();
  }, [generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        let newDirection: Direction | null = null;
        switch (e.key) {
            case 'ArrowUp':
                if (directionRef.current !== 'DOWN') newDirection = 'UP';
                break;
            case 'ArrowDown':
                if (directionRef.current !== 'UP') newDirection = 'DOWN';
                break;
            case 'ArrowLeft':
                if (directionRef.current !== 'RIGHT') newDirection = 'LEFT';
                break;
            case 'ArrowRight':
                if (directionRef.current !== 'LEFT') newDirection = 'RIGHT';
                break;
        }
        if (newDirection) {
            directionRef.current = newDirection;
            setDirection(newDirection);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        switch (direction) {
          case 'UP':
            head.y -= 1;
            break;
          case 'DOWN':
            head.y += 1;
            break;
          case 'LEFT':
            head.x -= 1;
            break;
          case 'RIGHT':
            head.x += 1;
            break;
        }

        if (
            head.x < 0 || head.x >= GRID_SIZE ||
            head.y < 0 || head.y >= GRID_SIZE ||
            newSnake.some(segment => segment.x === head.x && segment.y === head.y)
        ) {
            setIsGameOver(true);
            return prevSnake;
        }

        newSnake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 10);
          generateFood();
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, 200);
    return () => clearInterval(gameLoop);
  }, [snake, direction, food, isGameOver, generateFood]);

  return (
    <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">Snake</h3>
        <div
            className="relative bg-gray-900"
            style={{ width: GRID_SIZE * TILE_SIZE, height: GRID_SIZE * TILE_SIZE, border: '2px solid #333' }}
        >
            {snake.map((segment, index) => (
                <div
                    key={index}
                    className="absolute bg-green-500"
                    style={{ left: segment.x * TILE_SIZE, top: segment.y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE}}
                />
            ))}
            <div
                className="absolute bg-red-500"
                style={{ left: food.x * TILE_SIZE, top: food.y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE, borderRadius: '50%' }}
            />
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

export default Snake;

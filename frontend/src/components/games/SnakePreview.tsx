import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const SnakePreview: React.FC = () => {
  const [frame, setFrame] = useState(0);
  
  // Simple animation frames showing snake approaching and eating apple
  const frames = [
    // Frame 0: Snake starting position
    {
      snake: [{ x: 0, y: 2 }, { x: -1, y: 2 }],
      apple: { x: 4, y: 2 },
      direction: 'RIGHT' as const
    },
    // Frame 1: Snake moving right
    {
      snake: [{ x: 1, y: 2 }, { x: 0, y: 2 }],
      apple: { x: 4, y: 2 },
      direction: 'RIGHT' as const
    },
    // Frame 2: Snake closer to apple
    {
      snake: [{ x: 2, y: 2 }, { x: 1, y: 2 }],
      apple: { x: 4, y: 2 },
      direction: 'RIGHT' as const
    },
    // Frame 3: Snake almost at apple
    {
      snake: [{ x: 3, y: 2 }, { x: 2, y: 2 }],
      apple: { x: 4, y: 2 },
      direction: 'RIGHT' as const
    },
    // Frame 4: Snake eating apple (apple disappears, snake grows)
    {
      snake: [{ x: 4, y: 2 }, { x: 3, y: 2 }, { x: 2, y: 2 }],
      apple: null,
      direction: 'RIGHT' as const
    },
    // Frame 5: Snake continues moving, new apple appears
    {
      snake: [{ x: 5, y: 2 }, { x: 4, y: 2 }, { x: 3, y: 2 }],
      apple: { x: 0, y: 2 },
      direction: 'RIGHT' as const
    },
    // Frame 6: Snake moves down to approach new apple
    {
      snake: [{ x: 5, y: 3 }, { x: 5, y: 2 }, { x: 4, y: 2 }],
      apple: { x: 0, y: 2 },
      direction: 'DOWN' as const
    },
    // Frame 7: Snake continues moving
    {
      snake: [{ x: 4, y: 3 }, { x: 5, y: 3 }, { x: 5, y: 2 }],
      apple: { x: 0, y: 2 },
      direction: 'LEFT' as const
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(prev => (prev + 1) % frames.length);
    }, 600); // Medium speed animation for preview

    return () => clearInterval(interval);
  }, [frames.length]);

  // Helper function to get rotation angle based on direction
  const getRotation = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'): number => {
    switch (direction) {
      case 'UP': return -90;
      case 'DOWN': return 90;
      case 'LEFT': return 180;
      case 'RIGHT': return 0;
      default: return 0;
    }
  };

  const currentFrame = frames[frame];
  const tileSize = 14; // Slightly larger tiles for better visibility
  const gridWidth = 6;
  const gridHeight = 4;

  return (
    <div 
      className="relative bg-gray-800 rounded border-2 border-gray-600"
      style={{ 
        width: gridWidth * tileSize, 
        height: gridHeight * tileSize,
        margin: '0 auto'
      }}
    >
      {/* Render snake segments */}
      {currentFrame.snake.map((segment, index) => {
        // Skip segments that are off-grid
        if (segment.x < 0 || segment.x >= gridWidth || segment.y < 0 || segment.y >= gridHeight) {
          return null;
        }

        let segmentType: 'head' | 'body' | 'tail';
        let rotation = 0;

        if (index === 0) {
          segmentType = 'head';
          rotation = getRotation(currentFrame.direction);
        } else if (index === currentFrame.snake.length - 1) {
          segmentType = 'tail';
          // For tail, rotate opposite direction
          rotation = getRotation(currentFrame.direction) + 180;
        } else {
          segmentType = 'body';
        }

        return (
          <div
            key={`snake-${index}`}
            className="absolute transition-all duration-300 ease-in-out"
            style={{
              left: segment.x * tileSize,
              top: segment.y * tileSize,
              width: tileSize,
              height: tileSize
            }}
          >
            <Image
              src={`/games/snake_${segmentType}.svg`}
              alt={`Snake ${segmentType}`}
              width={tileSize}
              height={tileSize}
              style={{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: 'center'
              }}
            />
          </div>
        );
      })}
      
      {/* Render apple if it exists */}
      {currentFrame.apple && (
        <div
          className="absolute transition-all duration-300 ease-in-out"
          style={{
            left: currentFrame.apple.x * tileSize,
            top: currentFrame.apple.y * tileSize,
            width: tileSize,
            height: tileSize
          }}
        >
          <Image
            src="/games/apple.svg"
            alt="Apple"
            width={tileSize}
            height={tileSize}
          />
        </div>
      )}
    </div>
  );
};

export default SnakePreview;
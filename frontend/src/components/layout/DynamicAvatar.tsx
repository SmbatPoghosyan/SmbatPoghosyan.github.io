'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface DynamicAvatarProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const DynamicAvatar: React.FC<DynamicAvatarProps> = ({ src, alt, width, height }) => {
  const [dominantColor, setDominantColor] = useState<string>('rgb(59, 130, 246)'); // Default blue
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const extractDominantColor = (img: HTMLImageElement): string => {
    const canvas = canvasRef.current;
    if (!canvas) return 'rgb(59, 130, 246)';

    const ctx = canvas.getContext('2d');
    if (!ctx) return 'rgb(59, 130, 246)';

    // Set canvas size
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;

    // Draw image to canvas
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Count colors (simplified approach - sample every 4th pixel for performance)
    const colorCounts: { [key: string]: number } = {};
    
    for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const alpha = data[i + 3];

      // Skip transparent/very transparent pixels
      if (alpha < 128) continue;

      // Reduce color precision for better grouping
      const reducedR = Math.floor(r / 32) * 32;
      const reducedG = Math.floor(g / 32) * 32;
      const reducedB = Math.floor(b / 32) * 32;

      const colorKey = `${reducedR},${reducedG},${reducedB}`;
      colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
    }

    // Find the most common color
    let maxCount = 0;
    let dominantRGB = '59,130,246'; // Default blue

    for (const [color, count] of Object.entries(colorCounts)) {
      if (count > maxCount) {
        maxCount = count;
        dominantRGB = color;
      }
    }

    return `rgb(${dominantRGB})`;
  };

  const handleImageLoad = () => {
    if (imgRef.current) {
      const color = extractDominantColor(imgRef.current);
      setDominantColor(color);
    }
  };

  const createGradientBackground = (color: string): string => {
    // Parse RGB values
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!rgbMatch) return 'linear-gradient(135deg, rgb(59, 130, 246), rgb(99, 102, 241), rgb(147, 51, 234))';

    const [, r, g, b] = rgbMatch.map(Number);
    
    // Create multiple color variations for a rich 3D gradient
    const highlight = `rgb(${Math.min(255, r + 60)}, ${Math.min(255, g + 60)}, ${Math.min(255, b + 60)})`;
    const base = `rgb(${r}, ${g}, ${b})`;
    const midtone = `rgb(${Math.max(0, r - 15)}, ${Math.max(0, g - 15)}, ${Math.max(0, b - 15)})`;
    const shadow = `rgb(${Math.max(0, r - 40)}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 40)})`;
    
    return `linear-gradient(135deg, ${highlight} 0%, ${base} 25%, ${midtone} 75%, ${shadow} 100%)`;
  };

  return (
    <div className="flex justify-center md:col-span-1">
      {/* Outer glow container */}
      <div className="relative group">
        {/* Background glow effect */}
        <div 
          className="absolute inset-0 h-40 w-40 md:h-[200px] md:w-[200px] rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-all duration-700 animate-pulse"
          style={{
            background: createGradientBackground(dominantColor),
            transform: 'scale(1.2)',
          }}
        />
        
        {/* Main avatar container with 3D effect */}
        <div 
          className="relative h-40 w-40 md:h-[200px] md:w-[200px] rounded-full border-4 border-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:rotate-2 transform-gpu"
          style={{
            background: createGradientBackground(dominantColor),
            boxShadow: `
              0 20px 40px -12px rgba(0, 0, 0, 0.25),
              0 8px 16px -4px rgba(0, 0, 0, 0.1),
              inset 0 2px 4px rgba(255, 255, 255, 0.1),
              inset 0 -2px 4px rgba(0, 0, 0, 0.1)
            `,
          }}
        >
          {/* Inner shadow ring */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          
          {/* Image container with additional depth */}
          <div className="relative h-[85%] w-[85%] rounded-full overflow-hidden shadow-inner">
            <Image
              ref={imgRef}
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="h-full w-full object-contain transform transition-transform duration-300 group-hover:scale-110"
              onLoad={handleImageLoad}
              crossOrigin="anonymous"
            />
            
            {/* Subtle overlay gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 pointer-events-none" />
          </div>
          
          {/* Top highlight */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-gradient-to-b from-white/20 to-transparent rounded-full blur-sm pointer-events-none" />
        </div>
        
        {/* Hidden canvas for color extraction */}
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

export default DynamicAvatar;
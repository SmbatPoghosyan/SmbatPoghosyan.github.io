import React from 'react';

interface SkillRatingProps {
  level: number;
}

const SkillRating: React.FC<SkillRatingProps> = ({ level }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <span
        key={i}
        className={`h-2 w-4 rounded-full mr-1 ${
          i < level ? 'bg-primary' : 'bg-muted'
        }`}
      />
    ))}
  </div>
);

export default SkillRating;

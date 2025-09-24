'use client';

import React from 'react';
import { ProfessionalSkill, ProfessionalSkillCategory } from '@/lib/types';
import SkillRating from './SkillRating';

const SkillItem: React.FC<{ skill: ProfessionalSkill }> = ({ skill }) => (
  <div className="flex items-center justify-between rounded-md border border-border/20 bg-background/30 p-2 backdrop-blur-sm">
    <p className="font-medium text-foreground/80">{skill.name}</p>
    <SkillRating level={skill.strength} />
  </div>
);

const CategoryCard: React.FC<{ category: ProfessionalSkillCategory }> = ({ category }) => {
  return (
    <div className="group relative">
      <div className="absolute inset-0 transform scale-105 rounded-lg bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-indigo-500/20 blur-xl opacity-20 transition-opacity duration-500 group-hover:opacity-40" />
      <div
        className="relative rounded-lg border border-border/50 bg-gradient-to-br from-card via-card/95 to-card/90 p-6 backdrop-blur-sm transition-shadow duration-300"
        style={{
          boxShadow:
            '0 20px 40px -12px rgba(0, 0, 0, 0.15),\n             0 8px 16px -4px rgba(0, 0, 0, 0.1),\n             inset 0 2px 4px rgba(255, 255, 255, 0.05),\n             inset 0 -2px 4px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="relative z-10 space-y-4">
          <h4 className="text-xl font-bold text-foreground/90 transition-colors duration-300 group-hover:text-foreground">
            {category.title}
          </h4>
          <div className="space-y-3">
            {category.skills.map((skill) => (
              <SkillItem key={skill.id} skill={skill} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfessionalSkills: React.FC<{ categories: ProfessionalSkillCategory[] }> = ({ categories }) => {
  return (
    <div>
      <h3 className="mb-8 text-center text-2xl font-bold">Professional Skills</h3>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default ProfessionalSkills;

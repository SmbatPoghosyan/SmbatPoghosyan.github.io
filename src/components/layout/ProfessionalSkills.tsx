'use client';

import React from 'react';
import { type ProfessionalSkillEntry } from '@/lib/types';
import SkillRating from './SkillRating';

interface ProfessionalSkillsProps {
  skills: ProfessionalSkillEntry[];
}

const ProfessionalSkills: React.FC<ProfessionalSkillsProps> = ({ skills }) => {
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.fields.category as string;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, ProfessionalSkillEntry[]>);

  // Sort skills within each category by strength (descending)
  for (const category in skillsByCategory) {
    skillsByCategory[category].sort((a, b) => (b.fields.strength as number) - (a.fields.strength as number));
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-center mb-8">Professional Skills</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(skillsByCategory).map(([category, skills]) => (
          <div key={category} className="group relative">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-lg blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 transform scale-105" />
            
            {/* Main card with 3D effect */}
            <div 
              className="relative bg-gradient-to-br from-card via-card/95 to-card/90 rounded-lg p-6 border border-border/50 backdrop-blur-sm transition-shadow duration-300"
              style={{
                boxShadow: `
                  0 20px 40px -12px rgba(0, 0, 0, 0.15),
                  0 8px 16px -4px rgba(0, 0, 0, 0.1),
                  inset 0 2px 4px rgba(255, 255, 255, 0.05),
                  inset 0 -2px 4px rgba(0, 0, 0, 0.05)
                `,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = `
                  0 30px 60px -12px rgba(0, 0, 0, 0.25),
                  0 18px 36px -6px rgba(0, 0, 0, 0.15),
                  inset 0 2px 4px rgba(255, 255, 255, 0.08),
                  inset 0 -2px 4px rgba(0, 0, 0, 0.08)
                `;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = `
                  0 20px 40px -12px rgba(0, 0, 0, 0.15),
                  0 8px 16px -4px rgba(0, 0, 0, 0.1),
                  inset 0 2px 4px rgba(255, 255, 255, 0.05),
                  inset 0 -2px 4px rgba(0, 0, 0, 0.05)
                `;
              }}
            >
              {/* Inner highlight ring */}
              <div className="absolute inset-2 rounded-md bg-gradient-to-br from-white/5 to-transparent pointer-events-none group-hover:from-white/8 transition-colors duration-300" />
              
              {/* Top highlight bar */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full group-hover:via-white/30 transition-colors duration-300" />
              
              {/* Content */}
              <div className="relative z-10">
                <h4 className="text-xl font-bold mb-4 text-foreground/90 group-hover:text-foreground transition-colors duration-300">
                  {category as string}
                </h4>
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.sys.id} className="flex justify-between items-center p-2 rounded-md bg-background/30 backdrop-blur-sm border border-border/20 hover:bg-background/50 hover:border-border/40 transition-all duration-200">
                      <p className="font-medium text-foreground/80">{skill.fields.name as string}</p>
                      <SkillRating level={skill.fields.strength as number} />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Bottom shadow accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-black/10 to-transparent rounded-b-lg group-hover:via-black/15 transition-colors duration-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalSkills;

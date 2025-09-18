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

  return (
    <div>
      <h3 className="text-2xl font-bold text-center mb-8">Professional Skills</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(skillsByCategory).map(([category, skills]) => (
          <div key={category} className="bg-muted rounded-lg p-6">
            <h4 className="text-xl font-bold mb-4">{category as string}</h4>
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.sys.id} className="flex justify-between items-center">
                  <p className="font-medium">{skill.fields.name as string}</p>
                  <SkillRating level={skill.fields.strength as number} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalSkills;

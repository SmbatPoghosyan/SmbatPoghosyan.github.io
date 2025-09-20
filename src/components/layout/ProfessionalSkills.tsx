'use client';

import React from 'react';
import { type ProfessionalSkillEntry } from '@/lib/types';
import SkillRating from './SkillRating';

import { Trash2 } from 'lucide-react';

interface ProfessionalSkillsProps {
  skills: ProfessionalSkillEntry[];
  onDoubleClick?: (category: string) => void;
  onAdd?: () => void;
  isEditing?: boolean;
  editingCategory: string | null;
  onCategoryNameChange?: (oldName: string, newName: string) => void;
  onSkillChange?: (id: string, field: 'name' | 'strength', value: string | number) => void;
  onSkillDelete?: (id: string) => void;
  onCategoryDelete?: (category: string) => void;
  onAddSkillToCategory?: (category: string) => void;
}

const ProfessionalSkills: React.FC<ProfessionalSkillsProps> = ({
  skills,
  onDoubleClick,
  onAdd,
  isEditing,
  editingCategory,
  onCategoryNameChange,
  onSkillChange,
  onSkillDelete,
  onCategoryDelete,
  onAddSkillToCategory,
}) => {
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.fields.category as string;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, ProfessionalSkillEntry[]>);

  const sortedCategories = Object.keys(skillsByCategory).sort();

  for (const category in skillsByCategory) {
    if (editingCategory !== category) {
      skillsByCategory[category].sort((a, b) => (b.fields.strength as number) - (a.fields.strength as number));
    }
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-center mb-8">Professional Skills</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedCategories.map(category => {
          const skills = skillsByCategory[category];
          const isCategoryInEdit = editingCategory === category;
          return (
            <div key={category} className="group relative" onDoubleClick={() => onDoubleClick?.(category)}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-lg blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 transform scale-105" />
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
              >
                <div className="absolute inset-2 rounded-md bg-gradient-to-br from-white/5 to-transparent pointer-events-none group-hover:from-white/8 transition-colors duration-300" />
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full group-hover:via-white/30 transition-colors duration-300" />
                <div className="relative z-10">
                  {isCategoryInEdit ? (
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => onCategoryNameChange?.(category, e.target.value)}
                      className="text-xl font-bold mb-4 bg-transparent border-b-2 border-primary/50 w-full text-foreground/90"
                    />
                  ) : (
                    <h4 className="text-xl font-bold mb-4 text-foreground/90 group-hover:text-foreground transition-colors duration-300">
                      {category}
                    </h4>
                  )}
                  <div className="space-y-4">
                    {skills.map((skill) => (
                      <div key={skill.sys.id} className="flex justify-between items-center p-2 rounded-md bg-background/30 backdrop-blur-sm border border-border/20">
                        {isCategoryInEdit ? (
                          <>
                            <input
                              type="text"
                              value={skill.fields.name as string}
                              onChange={(e) => onSkillChange?.(skill.sys.id, 'name', e.target.value)}
                              className="font-medium bg-transparent w-1/2 text-foreground/80"
                            />
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={skill.fields.strength as number}
                              onChange={(e) => onSkillChange?.(skill.sys.id, 'strength', Number(e.target.value))}
                              className="w-1/3"
                            />
                            <button onClick={() => onSkillDelete?.(skill.sys.id)} className="text-red-500 hover:text-red-400">
                              <Trash2 size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <p className="font-medium text-foreground/80">{skill.fields.name as string}</p>
                            <SkillRating level={skill.fields.strength as number} />
                          </>
                        )}
                      </div>
                    ))}
                    {isCategoryInEdit && (
                      <button
                        onClick={() => onAddSkillToCategory?.(category)}
                        className="w-full mt-2 py-2 text-center border-2 border-dashed rounded-md border-border/50 text-foreground/50 hover:bg-primary/10 hover:border-primary/50"
                      >
                        Add Skill
                      </button>
                    )}
                  </div>
                  {isCategoryInEdit && (
                     <div className="mt-4 flex justify-end">
                      <button onClick={() => onCategoryDelete?.(category)} className="text-sm text-red-500 hover:text-red-400">
                        Delete Category
                      </button>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-black/10 to-transparent rounded-b-lg group-hover:via-black/15 transition-colors duration-300" />
              </div>
            </div>
          );
        })}
        <div
          className="group relative flex items-center justify-center bg-gradient-to-br from-card via-card/95 to-card/90 rounded-lg p-6 border-2 border-dashed border-border/50 cursor-pointer hover:border-primary/50 transition-all duration-300"
          onClick={onAdd}
        >
          <div className="text-5xl text-foreground/30 group-hover:text-primary/80 transition-colors duration-300">+</div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSkills;

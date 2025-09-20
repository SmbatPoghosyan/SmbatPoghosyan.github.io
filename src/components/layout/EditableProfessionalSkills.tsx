'use client';

import React, { useState, useTransition, useEffect, useCallback } from 'react';
import { type ProfessionalSkillEntry } from '@/lib/types';
import ProfessionalSkills from './ProfessionalSkills';
import { createSkill, updateSkill, deleteSkill } from '@/app/skills-actions';

interface EditableProfessionalSkillsProps {
  skills: ProfessionalSkillEntry[];
}

const EditableProfessionalSkills: React.FC<EditableProfessionalSkillsProps> = ({ skills: initialSkills }) => {
  const [skills, setSkills] = useState<ProfessionalSkillEntry[]>(initialSkills);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSaveChanges = useCallback(() => {
    startTransition(async () => {
      const originalSkillMap = new Map(initialSkills.map(s => [s.sys.id, s]));
      const currentSkillMap = new Map(skills.map(s => [s.sys.id, s]));
      const promises = [];

      for (const originalSkill of initialSkills) {
        if (!currentSkillMap.has(originalSkill.sys.id)) {
          promises.push(deleteSkill(originalSkill.sys.id));
        }
      }

      for (const currentSkill of skills) {
        if (currentSkill.sys.id.startsWith('new-')) {
          promises.push(createSkill(currentSkill.fields.category as string, currentSkill.fields.name as string, currentSkill.fields.strength as number));
        } else {
          const originalSkill = originalSkillMap.get(currentSkill.sys.id);
          if (originalSkill && (originalSkill.fields.name !== currentSkill.fields.name || originalSkill.fields.strength !== currentSkill.fields.strength || originalSkill.fields.category !== currentSkill.fields.category)) {
            promises.push(updateSkill(currentSkill.sys.id, currentSkill.fields.category as string, currentSkill.fields.name as string, currentSkill.fields.strength as number));
          }
        }
      }

      await Promise.all(promises);
      setEditingCategory(null);
    });
  }, [initialSkills, skills]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        handleSaveChanges();
      } else if (e.key === 'Escape') {
        setEditingCategory(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [skills, handleSaveChanges]);

  const handleDoubleClick = (category: string) => {
    if (editingCategory === category) {
      handleSaveChanges();
      setEditingCategory(null);
    } else if (editingCategory) {
      handleSaveChanges();
      setEditingCategory(category);
    } else {
      setEditingCategory(category);
    }
  };

  const handleAddNewCategory = () => {
    const newCategoryName = 'New Category';
    const tempId = `new-${Date.now()}`;
    const newSkill: ProfessionalSkillEntry = {
      sys: {
        id: tempId,
        type: 'Entry',
        contentType: {
          sys: {
            type: 'Link',
            linkType: 'ContentType',
            id: 'professionalSkill',
          },
        },
      } as unknown as ProfessionalSkillEntry['sys'],
      fields: { category: newCategoryName, name: 'New Skill', strength: 3 },
      metadata: { tags: [] },
    };
    setSkills(prev => [...prev, newSkill]);
    setEditingCategory(newCategoryName);
  };

  const handleCategoryNameChange = (oldName: string, newName: string) => {
    setSkills(prevSkills =>
      prevSkills.map(skill => {
        if (skill.fields.category === oldName) {
          return {
            ...skill,
            fields: {
              ...skill.fields,
              category: newName,
            },
          } as ProfessionalSkillEntry;
        }
        return skill;
      })
    );
    if (editingCategory === oldName) {
      setEditingCategory(newName);
    }
  };

  const handleSkillChange = (id: string, field: 'name' | 'strength', value: string | number) => {
    setSkills(prevSkills =>
      prevSkills.map(skill =>
        skill.sys.id === id ? { ...skill, fields: { ...skill.fields, [field]: value } } : skill
      )
    );
  };

  const handleSkillDelete = (id: string) => {
    setSkills(prevSkills => prevSkills.filter(skill => skill.sys.id !== id));
  };

  const handleCategoryDelete = (category: string) => {
    setSkills(prevSkills => prevSkills.filter(skill => skill.fields.category !== category));
    if (editingCategory === category) {
      setEditingCategory(null);
    }
  };

  const handleAddSkillToCategory = (category: string) => {
    const tempId = `new-${Date.now()}`;
    const newSkill: ProfessionalSkillEntry = {
      sys: {
        id: tempId,
        type: 'Entry',
        contentType: {
          sys: {
            type: 'Link',
            linkType: 'ContentType',
            id: 'professionalSkill',
          },
        },
      } as unknown as ProfessionalSkillEntry['sys'],
      fields: { category, name: 'New Skill', strength: 3 },
      metadata: { tags: [] },
    };
    setSkills(prev => [...prev, newSkill]);
  };

  return (
    <div className="relative group/container">
      <ProfessionalSkills
        skills={skills}
        onDoubleClick={handleDoubleClick}
        onAdd={handleAddNewCategory}
        isEditing // This will be true now
        editingCategory={editingCategory}
        onCategoryNameChange={handleCategoryNameChange}
        onSkillChange={handleSkillChange}
        onSkillDelete={handleSkillDelete}
        onCategoryDelete={handleCategoryDelete}
        onAddSkillToCategory={handleAddSkillToCategory}
      />
    </div>
  );
};

export default EditableProfessionalSkills;

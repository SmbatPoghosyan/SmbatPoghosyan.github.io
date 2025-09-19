'use client';

import React, { useState, useTransition, useEffect, useCallback } from 'react';
import { type ProfessionalSkillEntry } from '@/lib/types';
import ProfessionalSkills from './ProfessionalSkills';
import Modal from './Modal';
import { createSkill, updateSkill, deleteSkill } from '@/app/skills-actions';

interface EditableProfessionalSkillsProps {
  skills: ProfessionalSkillEntry[];
}

const EditableProfessionalSkills: React.FC<EditableProfessionalSkillsProps> = ({ skills: initialSkills }) => {
  const [skills, setSkills] = useState<ProfessionalSkillEntry[]>(initialSkills);
  const [originalSkills, setOriginalSkills] = useState<ProfessionalSkillEntry[]>(initialSkills);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillStrength, setNewSkillStrength] = useState(3);
  const [isPending, startTransition] = useTransition();

  const handleCancelChanges = useCallback(() => {
    setSkills(originalSkills);
    setIsEditing(false);
    setEditingCategory(null);
  }, [originalSkills]);

  const handleSaveChanges = useCallback(() => {
    startTransition(async () => {
      const originalSkillMap = new Map(originalSkills.map(s => [s.sys.id, s]));
      const currentSkillMap = new Map(skills.map(s => [s.sys.id, s]));
      const promises = [];

      for (const originalSkill of originalSkills) {
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
      setIsEditing(false);
      setEditingCategory(null);
    });
  }, [originalSkills, skills]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        if (isEditing) {
          handleSaveChanges();
        } else {
          setIsEditing(true);
          setOriginalSkills(skills);
        }
      } else if (e.key === 'Escape' && isEditing) {
        handleCancelChanges();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, skills, handleSaveChanges, handleCancelChanges]);

  const handleDoubleClick = (category: string) => {
    if (isEditing) setEditingCategory(category);
  };

  const handleAddModalOpen = () => {
    if (isEditing) setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
    setNewCategory('');
    setNewSkillName('');
    setNewSkillStrength(3);
  };

  const handleAddSkillFromModal = () => {
    startTransition(async () => {
      const result = await createSkill(newCategory, newSkillName, newSkillStrength);
      if (result.success) {
        const tempId = `temp-${Date.now()}`;
        const newSkillEntry: ProfessionalSkillEntry = {
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
          fields: { category: newCategory, name: newSkillName, strength: newSkillStrength },
          metadata: { tags: [] },
        };
        setSkills(prev => [...prev, newSkillEntry]);
        handleAddModalClose();
      } else {
        console.error(result.error);
      }
    });
  };

  const handleCategoryNameChange = (oldName: string, newName:string) => {
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
        onAdd={handleAddModalOpen}
        isEditing={isEditing}
        editingCategory={editingCategory}
        onCategoryNameChange={handleCategoryNameChange}
        onSkillChange={handleSkillChange}
        onSkillDelete={handleSkillDelete}
        onCategoryDelete={handleCategoryDelete}
        onAddSkillToCategory={handleAddSkillToCategory}
      />
      {isEditing && (
        <div className="absolute top-0 right-0 p-4 flex gap-2">
          <button onClick={handleSaveChanges} disabled={isPending} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50">
            {isPending ? 'Saving...' : 'Save Changes'}
          </button>
          <button onClick={handleCancelChanges} className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
            Cancel
          </button>
        </div>
      )}
      {!isEditing && (
        <button onClick={() => { setIsEditing(true); setOriginalSkills(skills); }} className="absolute top-0 right-0 p-2 opacity-0 group-hover/container:opacity-100 transition-opacity px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Edit Skills
        </button>
      )}

      {isAddModalOpen && (
        <Modal onClose={handleAddModalClose}>
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-4">Add New Skill Category</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Category Name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full p-2 border rounded-md bg-background text-foreground" />
              <input type="text" placeholder="Skill Name" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} className="w-full p-2 border rounded-md bg-background text-foreground" />
              <div>
                <label className="block mb-2">Skill Strength (1-5)</label>
                <input type="range" min="1" max="5" value={newSkillStrength} onChange={(e) => setNewSkillStrength(Number(e.target.value))} className="w-full" />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button onClick={handleAddModalClose} className="px-4 py-2 rounded-md border">Cancel</button>
              <button onClick={handleAddSkillFromModal} disabled={isPending || !newCategory || !newSkillName} className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50">
                {isPending ? 'Adding...' : 'Add Skill'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EditableProfessionalSkills;

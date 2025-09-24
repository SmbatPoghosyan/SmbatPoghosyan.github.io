'use client';

import React from 'react';
import { ProfessionalSkillCategory } from '@/lib/types';
import ProfessionalSkills from './ProfessionalSkills';

interface EditableProfessionalSkillsProps {
  categories: ProfessionalSkillCategory[];
}

const EditableProfessionalSkills: React.FC<EditableProfessionalSkillsProps> = ({ categories }) => {
  return (
    <ProfessionalSkills categories={categories} />
  );
};

export default EditableProfessionalSkills;

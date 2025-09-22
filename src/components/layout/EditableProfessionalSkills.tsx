'use client';

import React, {
  useState,
  useTransition,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { type ProfessionalSkillEntry } from '@/lib/types';
import ProfessionalSkills from './ProfessionalSkills';
import { createSkill, updateSkill, deleteSkill } from '@/app/skills-actions';

interface EditableProfessionalSkillsProps {
  skills: ProfessionalSkillEntry[];
}

interface CategoryDisplay {
  id: string;
  name: string;
  skills: ProfessionalSkillEntry[];
  error?: string;
}

interface CategoryState {
  skillCategory: Record<string, string>;
  draftNames: Record<string, string>;
  order: string[];
  skillIdsByCategory: Record<string, string[]>;
}

const CATEGORY_ORDER_MULTIPLIER = 1000;

const randomId = () => `cat-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const randomSkillId = () => `temp-skill-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const normalize = (value: string) => value.trim().toLowerCase();

const validateCategoryName = (
  categoryId: string,
  name: string,
  drafts: Record<string, string>,
): string | undefined => {
  if (!name.trim()) {
    return 'Category name is required';
  }

  const normalized = normalize(name);
  for (const [id, label] of Object.entries(drafts)) {
    if (id === categoryId) continue;
    if (normalize(label) === normalized) {
      return 'Category already exists';
    }
  }

  return undefined;
};

const buildInitialState = (entries: ProfessionalSkillEntry[]): CategoryState => {
  const groupedByCategory = new Map<string, { skills: { id: string; order: number }[] }>();

  for (const skill of entries) {
    const name = (skill.fields.category as string) ?? 'New Category';
    const orderValue = typeof skill.fields.order === 'number' ? skill.fields.order : 0;
    const bucket = groupedByCategory.get(name) ?? { skills: [] };
    bucket.skills.push({ id: skill.sys.id, order: orderValue });
    groupedByCategory.set(name, bucket);
  }

  const skillCategory: Record<string, string> = {};
  const draftNames: Record<string, string> = {};
  const order: string[] = [];
  const skillIdsByCategory: Record<string, string[]> = {};

  const categoryMeta = Array.from(groupedByCategory.entries()).map(([name, bucket], index) => {
    const sortedSkills = bucket.skills
      .slice()
      .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
    const primarySkillId = sortedSkills[0]?.id ?? `${name}-${index}`;
    const categoryId = `cat-${primarySkillId}`;

    draftNames[categoryId] = name;
    skillIdsByCategory[categoryId] = sortedSkills.map((item) => item.id);
    for (const item of sortedSkills) {
      skillCategory[item.id] = categoryId;
    }

    const minOrder = sortedSkills[0]?.order ?? Number.MAX_SAFE_INTEGER;
    return { categoryId, minOrder, index };
  });

  categoryMeta
    .sort((a, b) => {
      if (a.minOrder === b.minOrder) {
        return a.index - b.index;
      }
      return a.minOrder - b.minOrder;
    })
    .forEach((meta) => {
      order.push(meta.categoryId);
    });

  return { skillCategory, draftNames, order, skillIdsByCategory };
};

const EditableProfessionalSkills: React.FC<EditableProfessionalSkillsProps> = ({ skills: initialSkills }) => {
  const initialState = useMemo(() => buildInitialState(initialSkills), [initialSkills]);

  const [skills, setSkills] = useState<ProfessionalSkillEntry[]>(initialSkills);
  const [baselineSkills, setBaselineSkills] = useState<ProfessionalSkillEntry[]>(initialSkills);
  const [skillCategoryMap, setSkillCategoryMap] = useState<Record<string, string>>(initialState.skillCategory);
  const [categoryDraftNames, setCategoryDraftNames] = useState<Record<string, string>>(initialState.draftNames);
  const [categoryOrder, setCategoryOrder] = useState<string[]>(initialState.order);
  const [skillOrderByCategory, setSkillOrderByCategory] = useState<Record<string, string[]>>(initialState.skillIdsByCategory);
  const [categoryErrors, setCategoryErrors] = useState<Record<string, string>>({});
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const editingCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const nextState = buildInitialState(initialSkills);
    setSkills(initialSkills);
    setBaselineSkills(initialSkills);
    setSkillCategoryMap(nextState.skillCategory);
    setCategoryDraftNames(nextState.draftNames);
    setCategoryOrder(nextState.order);
    setSkillOrderByCategory(nextState.skillIdsByCategory);
    setCategoryErrors({});
    setEditingCategoryId(null);
  }, [initialSkills]);

  const handleEditingCardRefChange = useCallback((node: HTMLDivElement | null) => {
    editingCardRef.current = node;
  }, []);

  useEffect(() => {
    if (!editingCategoryId) {
      editingCardRef.current = null;
    }
  }, [editingCategoryId]);

  const categories = useMemo<CategoryDisplay[]>(() => {
    const skillsByCategory = new Map<string, ProfessionalSkillEntry[]>();
    for (const skill of skills) {
      const categoryId = skillCategoryMap[skill.sys.id];
      if (!categoryId) {
        continue;
      }
      const list = skillsByCategory.get(categoryId);
      if (list) {
        list.push(skill);
      } else {
        skillsByCategory.set(categoryId, [skill]);
      }
    }

    return categoryOrder
      .map((categoryId) => {
        const orderedIds = skillOrderByCategory[categoryId] ?? [];
        const orderedSkills = orderedIds
          .map((skillId) => skills.find((skill) => skill.sys.id === skillId))
          .filter((skill): skill is ProfessionalSkillEntry => Boolean(skill));

        const fallbackSkills = skillsByCategory.get(categoryId) ?? [];
        for (const fallbackSkill of fallbackSkills) {
          if (!orderedSkills.some((existing) => existing.sys.id === fallbackSkill.sys.id)) {
            orderedSkills.push(fallbackSkill);
          }
        }

        if (orderedSkills.length === 0) {
          return null;
        }

        const name =
          categoryDraftNames[categoryId] ??
          ((orderedSkills[0].fields.category as string) ?? 'New Category');

        return {
          id: categoryId,
          name,
          skills: orderedSkills,
          error: categoryErrors[categoryId],
        } satisfies CategoryDisplay;
      })
      .filter((value): value is CategoryDisplay => Boolean(value));
  }, [
    skills,
    skillCategoryMap,
    categoryOrder,
    skillOrderByCategory,
    categoryDraftNames,
    categoryErrors,
  ]);

  const computeFinalSkills = useCallback(() => {
    const categoryIndexMap = new Map<string, number>();
    categoryOrder.forEach((categoryId, index) => {
      categoryIndexMap.set(categoryId, index);
    });

    const positionBySkillId = new Map<string, number>();
    Object.entries(skillOrderByCategory).forEach(([, skillIds]) => {
      skillIds.forEach((skillId, index) => {
        positionBySkillId.set(skillId, index);
      });
    });

    return skills.map((skill) => {
      const categoryId = skillCategoryMap[skill.sys.id];
      const categoryIndex = categoryIndexMap.get(categoryId ?? '') ?? categoryOrder.length;
      const position = positionBySkillId.get(skill.sys.id) ?? 0;
      const orderValue = categoryIndex * CATEGORY_ORDER_MULTIPLIER + position;
      const categoryName =
        categoryDraftNames[categoryId ?? ''] ?? (skill.fields.category as string) ?? 'New Category';

      return {
        ...skill,
        fields: {
          ...skill.fields,
          category: categoryName,
          order: orderValue,
        },
      } as ProfessionalSkillEntry;
    });
  }, [
    skills,
    skillCategoryMap,
    categoryOrder,
    skillOrderByCategory,
    categoryDraftNames,
  ]);

  const saveSkillsToContentful = useCallback(async () => {
    const finalSkills = computeFinalSkills();
    const idReplacements = new Map<string, string>();

    const baselineMap = new Map(baselineSkills.map((skill) => [skill.sys.id, skill]));
    const currentMap = new Map(finalSkills.map((skill) => [skill.sys.id, skill]));

    for (const baselineSkill of baselineSkills) {
      if (!currentMap.has(baselineSkill.sys.id)) {
        await deleteSkill(baselineSkill.sys.id);
      }
    }

    for (const finalSkill of finalSkills) {
      const { sys, fields } = finalSkill;
      const category = fields.category as string;
      const name = fields.name as string;
      const strength = fields.strength as number;
      const order = fields.order as number;

      if (sys.id.startsWith('temp-skill-')) {
        const result = await createSkill(category, name, strength, order);
        if (result?.success && result.entryId) {
          idReplacements.set(sys.id, result.entryId);
        }
        continue;
      }

      const baselineSkill = baselineMap.get(sys.id);
      if (
        baselineSkill &&
        (baselineSkill.fields.name !== name ||
          baselineSkill.fields.strength !== strength ||
          baselineSkill.fields.category !== category ||
          baselineSkill.fields.order !== order)
      ) {
        await updateSkill(sys.id, category, name, strength, order);
      }
    }

    const updatedSkills = finalSkills.map((skill) => {
      const replacementId = idReplacements.get(skill.sys.id);
      if (!replacementId) {
        return skill;
      }
      return {
        ...skill,
        sys: {
          ...skill.sys,
          id: replacementId,
        },
      } as ProfessionalSkillEntry;
    });

    if (idReplacements.size > 0) {
      setSkillCategoryMap((prev) => {
        const next: Record<string, string> = {};
        for (const [skillId, categoryId] of Object.entries(prev)) {
          const replacementId = idReplacements.get(skillId) ?? skillId;
          next[replacementId] = categoryId;
        }
        return next;
      });

      setSkillOrderByCategory((prev) => {
        const next: Record<string, string[]> = {};
        for (const [categoryId, skillIds] of Object.entries(prev)) {
          next[categoryId] = skillIds.map((skillId) => idReplacements.get(skillId) ?? skillId);
        }
        return next;
      });
    }

    setSkills(updatedSkills);
    setBaselineSkills(updatedSkills);
  }, [
    baselineSkills,
    computeFinalSkills,
  ]);

  const handleSaveChanges = useCallback(
    (options?: { nextCategory?: string | null }) => {
      if (isPending) {
        return;
      }

      const hasErrors = Object.keys(categoryErrors).length > 0;
      const emptyCategoryEntry = Object.entries(categoryDraftNames).find(([, name]) => !name.trim());

      if (hasErrors || emptyCategoryEntry) {
        if (emptyCategoryEntry) {
          const [categoryId] = emptyCategoryEntry;
          setCategoryErrors((prev) => ({ ...prev, [categoryId]: 'Category name is required' }));
        }
        return;
      }

      const nextCategory = options?.nextCategory ?? null;

      startTransition(() => {
        void saveSkillsToContentful()
          .then(() => {
            setEditingCategoryId(nextCategory);
          })
          .catch((error) => {
            console.error('Failed to save professional skills', error);
          });
      });
    },
    [categoryDraftNames, categoryErrors, isPending, saveSkillsToContentful],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!editingCategoryId) {
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
        event.preventDefault();
        handleSaveChanges({ nextCategory: null });
      } else if (event.key === 'Escape') {
        event.preventDefault();
        handleSaveChanges({ nextCategory: null });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingCategoryId, handleSaveChanges]);

  useEffect(() => {
    if (!editingCategoryId) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (isPending) {
        return;
      }

      const targetNode = event.target as Node;
      if (editingCardRef.current && editingCardRef.current.contains(targetNode)) {
        return;
      }

      handleSaveChanges({ nextCategory: null });
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [editingCategoryId, handleSaveChanges, isPending]);

  const handleDoubleClick = (categoryId: string) => {
    if (isPending) {
      return;
    }

    if (editingCategoryId === categoryId) {
      return;
    }

    if (editingCategoryId) {
      handleSaveChanges({ nextCategory: categoryId });
    } else {
      setEditingCategoryId(categoryId);
    }
  };

  const handleAddNewCategory = () => {
    const categoryId = randomId();
    const tempSkillId = randomSkillId();
    const newSkill: ProfessionalSkillEntry = {
      sys: {
        id: tempSkillId,
        type: 'Entry',
        contentType: {
          sys: {
            type: 'Link',
            linkType: 'ContentType',
            id: 'professionalSkill',
          },
        },
      } as ProfessionalSkillEntry['sys'],
      fields: { category: 'New Category', name: 'New Skill', strength: 3, order: 0 },
      metadata: { tags: [] },
    };

    setSkills((prev) => [...prev, newSkill]);
    setSkillCategoryMap((prev) => ({ ...prev, [tempSkillId]: categoryId }));
    setCategoryDraftNames((prev) => ({ ...prev, [categoryId]: 'New Category' }));
    setCategoryOrder((prev) => [...prev, categoryId]);
    setSkillOrderByCategory((prev) => ({ ...prev, [categoryId]: [tempSkillId] }));
    setCategoryErrors((prev) => {
      const next = { ...prev };
      delete next[categoryId];
      return next;
    });
    setEditingCategoryId(categoryId);
  };

  const handleCategoryNameChange = useCallback(
    (categoryId: string, newName: string) => {
      setCategoryDraftNames((prevDrafts) => {
        const nextDrafts = { ...prevDrafts, [categoryId]: newName };
        setCategoryErrors((prevErrors) => {
          const validationMessage = validateCategoryName(categoryId, newName, nextDrafts);
          if (validationMessage) {
            return { ...prevErrors, [categoryId]: validationMessage };
          }
          if (prevErrors[categoryId]) {
            const next = { ...prevErrors };
            delete next[categoryId];
            return next;
          }
          return prevErrors;
        });
        return nextDrafts;
      });

      setSkills((prevSkills) =>
        prevSkills.map((skill) =>
          skillCategoryMap[skill.sys.id] === categoryId
            ? ({
                ...skill,
                fields: {
                  ...skill.fields,
                  category: newName,
                },
              } as ProfessionalSkillEntry)
            : skill,
        ),
      );
    },
    [skillCategoryMap],
  );

  const handleSkillChange = (id: string, field: 'name' | 'strength', value: string | number) => {
    setSkills((prevSkills) =>
      prevSkills.map((skill) =>
        skill.sys.id === id
          ? ({
              ...skill,
              fields: {
                ...skill.fields,
                [field]: value,
              },
            } as ProfessionalSkillEntry)
          : skill,
      ),
    );
  };

  const handleSkillDelete = (id: string) => {
    const categoryId = skillCategoryMap[id];
    setSkills((prevSkills) => prevSkills.filter((skill) => skill.sys.id !== id));
    setSkillCategoryMap((prevMap) => {
      const next = { ...prevMap };
      delete next[id];
      return next;
    });
    setSkillOrderByCategory((prev) => {
      if (!categoryId) {
        return prev;
      }
      const next = { ...prev };
      next[categoryId] = (next[categoryId] ?? []).filter((skillId) => skillId !== id);
      return next;
    });
  };

  const handleCategoryDelete = (categoryId: string) => {
    const skillIds = skillOrderByCategory[categoryId] ?? [];
    setSkills((prevSkills) => prevSkills.filter((skill) => (skillCategoryMap[skill.sys.id] ?? '') !== categoryId));
    setSkillCategoryMap((prevMap) => {
      const next: Record<string, string> = {};
      for (const [skillId, currentCategoryId] of Object.entries(prevMap)) {
        if (currentCategoryId !== categoryId) {
          next[skillId] = currentCategoryId;
        }
      }
      return next;
    });
    setCategoryDraftNames((prevDrafts) => {
      const next = { ...prevDrafts };
      delete next[categoryId];
      return next;
    });
    setCategoryErrors((prevErrors) => {
      if (!(categoryId in prevErrors)) {
        return prevErrors;
      }
      const next = { ...prevErrors };
      delete next[categoryId];
      return next;
    });
    setCategoryOrder((prevOrder) => prevOrder.filter((id) => id !== categoryId));
    setSkillOrderByCategory((prev) => {
      const next = { ...prev };
      delete next[categoryId];
      return next;
    });

    if (editingCategoryId === categoryId) {
      setEditingCategoryId(null);
    }

    // Remove pending baseline entries for deleted skills
    setBaselineSkills((prevBaseline) => prevBaseline.filter((skill) => !skillIds.includes(skill.sys.id)));
  };

  const handleAddSkillToCategory = (categoryId: string) => {
    const tempSkillId = randomSkillId();
    const categoryName = categoryDraftNames[categoryId] ?? 'New Category';
    const newSkill: ProfessionalSkillEntry = {
      sys: {
        id: tempSkillId,
        type: 'Entry',
        contentType: {
          sys: {
            type: 'Link',
            linkType: 'ContentType',
            id: 'professionalSkill',
          },
        },
      } as ProfessionalSkillEntry['sys'],
      fields: { category: categoryName, name: 'New Skill', strength: 3, order: 0 },
      metadata: { tags: [] },
    };

    setSkills((prev) => [...prev, newSkill]);
    setSkillCategoryMap((prev) => ({ ...prev, [tempSkillId]: categoryId }));
    setSkillOrderByCategory((prev) => ({
      ...prev,
      [categoryId]: [...(prev[categoryId] ?? []), tempSkillId],
    }));
  };

  const handleCategoryReorder = (newOrder: string[]) => {
    setCategoryOrder(newOrder);
  };

  const handleSkillReorder = (categoryId: string, newOrder: string[]) => {
    setSkillOrderByCategory((prev) => ({
      ...prev,
      [categoryId]: newOrder,
    }));
  };

  return (
    <div className="relative group/container">
      <ProfessionalSkills
        categories={categories}
        onDoubleClick={handleDoubleClick}
        onAdd={handleAddNewCategory}
        editingCategoryId={editingCategoryId}
        onCategoryNameChange={handleCategoryNameChange}
        onSkillChange={handleSkillChange}
        onSkillDelete={handleSkillDelete}
        onCategoryDelete={handleCategoryDelete}
        onAddSkillToCategory={handleAddSkillToCategory}
        onSaveCategory={() => handleSaveChanges({ nextCategory: null })}
        onCategoryReorder={handleCategoryReorder}
        onSkillReorder={handleSkillReorder}
        isSaving={isPending}
        onEditingCardRefChange={handleEditingCardRefChange}
      />
    </div>
  );
};

export default EditableProfessionalSkills;

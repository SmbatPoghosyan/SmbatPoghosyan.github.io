'use client';

import React, { useCallback, useMemo } from 'react';
import { type ProfessionalSkillEntry } from '@/lib/types';
import SkillRating from './SkillRating';
import { Trash2, Loader2, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CategoryDisplay {
  id: string;
  name: string;
  skills: ProfessionalSkillEntry[];
  error?: string;
}

interface ProfessionalSkillsProps {
  categories: CategoryDisplay[];
  onDoubleClick?: (categoryId: string) => void;
  onAdd?: () => void;
  editingCategoryId: string | null;
  onCategoryNameChange?: (categoryId: string, newName: string) => void;
  onSkillChange?: (id: string, field: 'name' | 'strength', value: string | number) => void;
  onSkillDelete?: (id: string) => void;
  onCategoryDelete?: (categoryId: string) => void;
  onAddSkillToCategory?: (categoryId: string) => void;
  onSaveCategory?: (categoryId: string) => void;
  onCategoryReorder?: (newOrder: string[]) => void;
  onSkillReorder?: (categoryId: string, newOrder: string[]) => void;
  isSaving?: boolean;
  onEditingCardRefChange?: (node: HTMLDivElement | null) => void;
}

interface CategoryCardProps {
  category: CategoryDisplay;
  isSaving?: boolean;
  isEditing: boolean;
  onDoubleClick?: (categoryId: string) => void;
  onCategoryNameChange?: (categoryId: string, newName: string) => void;
  onSkillChange?: (id: string, field: 'name' | 'strength', value: string | number) => void;
  onSkillDelete?: (id: string) => void;
  onCategoryDelete?: (categoryId: string) => void;
  onAddSkillToCategory?: (categoryId: string) => void;
  onSaveCategory?: (categoryId: string) => void;
  onSkillReorder?: (categoryId: string, newOrder: string[]) => void;
  onEditingCardRefChange?: (node: HTMLDivElement | null) => void;
}

interface SkillItemProps {
  skill: ProfessionalSkillEntry;
  isEditing: boolean;
  onSkillChange?: (id: string, field: 'name' | 'strength', value: string | number) => void;
  onSkillDelete?: (id: string) => void;
}

const SkillSortableItem: React.FC<SkillItemProps> = ({ skill, isEditing, onSkillChange, onSkillDelete }) => {
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill.sys.id, disabled: !isEditing });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between gap-2 rounded-md border border-border/20 bg-background/30 p-2 backdrop-blur-sm"
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...listeners}
        {...attributes}
        className="mr-1 flex h-8 w-8 items-center justify-center rounded-md text-foreground/40 transition hover:text-foreground"
        aria-label="Drag skill"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <input
        type="text"
        value={skill.fields.name as string}
        onChange={(event) => onSkillChange?.(skill.sys.id, 'name', event.target.value)}
        className="flex-1 rounded-md border border-transparent bg-transparent px-2 py-1 text-sm font-medium text-foreground/80 focus:border-primary/40 focus:outline-none"
      />
      <input
        type="range"
        min="1"
        max="5"
        value={skill.fields.strength as number}
        onChange={(event) => onSkillChange?.(skill.sys.id, 'strength', Number(event.target.value))}
        className="w-28"
      />
      <button
        type="button"
        onClick={() => onSkillDelete?.(skill.sys.id)}
        className="flex h-8 w-8 items-center justify-center rounded-md text-red-500 transition hover:text-red-400"
        aria-label="Delete skill"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

const SkillStaticItem: React.FC<{ skill: ProfessionalSkillEntry }> = ({ skill }) => (
  <div className="flex items-center justify-between rounded-md border border-border/20 bg-background/30 p-2 backdrop-blur-sm">
    <p className="font-medium text-foreground/80">{skill.fields.name as string}</p>
    <SkillRating level={skill.fields.strength as number} />
  </div>
);

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSaving,
  isEditing,
  onDoubleClick,
  onCategoryNameChange,
  onSkillChange,
  onSkillDelete,
  onCategoryDelete,
  onAddSkillToCategory,
  onSaveCategory,
  onSkillReorder,
  onEditingCardRefChange,
}) => {
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id, disabled: Boolean(isSaving) });

  const containerStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.92 : 1,
  };

  const skillIds = useMemo(() => category.skills.map((skill) => skill.sys.id), [category.skills]);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleSkillDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (!onSkillReorder) {
        return;
      }
      const { active, over } = event;
      if (!over || active.id === over.id) {
        return;
      }
      const activeIndex = skillIds.indexOf(String(active.id));
      const overIndex = skillIds.indexOf(String(over.id));
      if (activeIndex === -1 || overIndex === -1) {
        return;
      }
      const reordered = arrayMove(skillIds, activeIndex, overIndex);
      onSkillReorder(category.id, reordered);
    },
    [category.id, onSkillReorder, skillIds],
  );

  const setCombinedRef = useCallback(
    (node: HTMLDivElement | null) => {
      setNodeRef(node);
      if (isEditing) {
        onEditingCardRefChange?.(node);
      }
    },
    [isEditing, onEditingCardRefChange, setNodeRef],
  );

  return (
    <div
      ref={setCombinedRef}
      style={containerStyle}
      className="group relative"
      onDoubleClick={() => onDoubleClick?.(category.id)}
    >
      <div className="absolute inset-0 transform scale-105 rounded-lg bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-indigo-500/20 blur-xl opacity-20 transition-opacity duration-500 group-hover:opacity-40" />
      <div
        className="relative rounded-lg border border-border/50 bg-gradient-to-br from-card via-card/95 to-card/90 p-6 backdrop-blur-sm transition-shadow duration-300"
        style={{
          boxShadow:
            '0 20px 40px -12px rgba(0, 0, 0, 0.15),\n             0 8px 16px -4px rgba(0, 0, 0, 0.1),\n             inset 0 2px 4px rgba(255, 255, 255, 0.05),\n             inset 0 -2px 4px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="absolute inset-2 rounded-md bg-gradient-to-br from-white/5 to-transparent transition-colors duration-300 group-hover:from-white/8 pointer-events-none" />
        <div className="absolute top-2 left-1/2 h-1 w-16 -translate-x-1/2 transform rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-colors duration-300 group-hover:via-white/30" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-start justify-between gap-3">
            {isEditing ? (
              <input
                type="text"
                value={category.name}
                onChange={(event) => onCategoryNameChange?.(category.id, event.target.value)}
                className={`text-xl font-bold text-foreground/90 focus:outline-none ${
                  category.error ? 'border-b-2 border-red-500/80' : 'border-b-2 border-primary/50'
                } bg-transparent pb-1`}
              />
            ) : (
              <h4 className="text-xl font-bold text-foreground/90 transition-colors duration-300 group-hover:text-foreground">
                {category.name}
              </h4>
            )}
            <button
              type="button"
              ref={setActivatorNodeRef}
              {...attributes}
              {...listeners}
              className="flex h-8 w-8 items-center justify-center rounded-md text-foreground/30 transition hover:text-foreground"
              aria-label="Drag category"
            >
              <GripVertical className="h-4 w-4" />
            </button>
          </div>
          {isEditing && category.error && (
            <p className="-mt-3 text-sm text-red-400">{category.error}</p>
          )}
          {isEditing ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleSkillDragEnd}
            >
              <SortableContext items={skillIds} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {category.skills.map((skill) => (
                    <SkillSortableItem
                      key={skill.sys.id}
                      skill={skill}
                      isEditing
                      onSkillChange={onSkillChange}
                      onSkillDelete={onSkillDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="space-y-3">
              {category.skills.map((skill) => (
                <SkillStaticItem key={skill.sys.id} skill={skill} />
              ))}
            </div>
          )}
          {isEditing && (
            <button
              type="button"
              onClick={() => onAddSkillToCategory?.(category.id)}
              className="mt-2 w-full rounded-md border-2 border-dashed border-border/50 py-2 text-center text-foreground/50 transition hover:border-primary/50 hover:bg-primary/10"
            >
              Add Skill
            </button>
          )}
          {isEditing && (
            <div className="mt-4 flex items-center justify-end gap-4">
              {isSaving && (
                <span className="flex items-center gap-2 text-sm text-primary/80">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving
                </span>
              )}
              <button
                type="button"
                onClick={() => onSaveCategory?.(category.id)}
                disabled={Boolean(isSaving) || Boolean(category.error)}
                className="rounded-md bg-primary/80 px-3 py-1 text-sm text-primary-foreground transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => onCategoryDelete?.(category.id)}
                className="text-sm text-red-500 transition hover:text-red-400"
              >
                Delete Category
              </button>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-lg bg-gradient-to-r from-transparent via-black/10 to-transparent transition-colors duration-300 group-hover:via-black/15" />
      </div>
    </div>
  );
};

const ProfessionalSkills: React.FC<ProfessionalSkillsProps> = ({
  categories,
  onDoubleClick,
  onAdd,
  editingCategoryId,
  onCategoryNameChange,
  onSkillChange,
  onSkillDelete,
  onCategoryDelete,
  onAddSkillToCategory,
  onSaveCategory,
  onCategoryReorder,
  onSkillReorder,
  isSaving,
  onEditingCardRefChange,
}) => {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const categoryIds = useMemo(() => categories.map((category) => category.id), [categories]);

  const handleCategoryDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (!onCategoryReorder) {
        return;
      }
      const { active, over } = event;
      if (!over || active.id === over.id) {
        return;
      }
      const activeIndex = categoryIds.indexOf(String(active.id));
      const overIndex = categoryIds.indexOf(String(over.id));
      if (activeIndex === -1 || overIndex === -1) {
        return;
      }
      const reordered = arrayMove(categoryIds, activeIndex, overIndex);
      onCategoryReorder(reordered);
    },
    [categoryIds, onCategoryReorder],
  );

  return (
    <div>
      <h3 className="mb-8 text-center text-2xl font-bold">Professional Skills</h3>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleCategoryDragEnd}
        >
          <SortableContext items={categoryIds} strategy={rectSortingStrategy}>
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isEditing={editingCategoryId === category.id}
                isSaving={isSaving}
                onDoubleClick={onDoubleClick}
                onCategoryNameChange={onCategoryNameChange}
                onSkillChange={onSkillChange}
                onSkillDelete={onSkillDelete}
                onCategoryDelete={onCategoryDelete}
                onAddSkillToCategory={onAddSkillToCategory}
                onSaveCategory={onSaveCategory}
                onSkillReorder={onSkillReorder}
                onEditingCardRefChange={onEditingCardRefChange}
              />
            ))}
          </SortableContext>
        </DndContext>
        <div
          className="group relative flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-border/50 bg-gradient-to-br from-card via-card/95 to-card/90 p-6 transition-all duration-300 hover:border-primary/50"
          onClick={onAdd}
        >
          <div className="text-5xl text-foreground/30 transition-colors duration-300 group-hover:text-primary/80">+</div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSkills;

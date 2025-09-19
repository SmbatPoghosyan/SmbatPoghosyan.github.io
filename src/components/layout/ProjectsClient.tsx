'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import ProjectCard from './ProjectCard';
import { type ProjectEntry } from '@/lib/types';

interface ProjectsClientProps {
  initialProjects: ProjectEntry[];
}

const ProjectsClient: React.FC<ProjectsClientProps> = ({ initialProjects }) => {
  const [projects, setProjects] = useState<ProjectEntry[]>(initialProjects);
  const [isDragging, setIsDragging] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const resetDraggingState = () => {
    setTimeout(() => setIsDragging(false), 0);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setProjects((items) => {
        const oldIndex = items.findIndex((item) => item.sys.id === active.id);
        const newIndex = items.findIndex((item) => item.sys.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    resetDraggingState();
  };

  const handleDragCancel = () => {
    resetDraggingState();
  };

  return (
    <section id="projects" className="py-24 sm:py-32 bg-muted animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">My Projects</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
            Here are some of the projects I&apos;ve worked on. {isClient && "(You can drag and drop to reorder them!)"}
          </p>
        </div>
        {isClient ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext items={projects.map((project) => project.sys.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <ProjectCard key={project.sys.id} project={project} disableLinkClicks={isDragging} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.sys.id}>
                <ProjectCard project={project} disableLinkClicks={false} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsClient;

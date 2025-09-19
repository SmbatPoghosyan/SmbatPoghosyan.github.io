'use client';

import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { getProjects } from '@/lib/contentful';
import ProjectCard from './ProjectCard';
import { type ProjectEntry } from '@/lib/types';

const Projects = () => {
  const [projects, setProjects] = useState<ProjectEntry[]>([]);
  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    const fetchProjects = async () => {
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects);
    };
    fetchProjects();
  }, []);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setProjects((items) => {
        const oldIndex = items.findIndex((item) => item.sys.id === active.id);
        const newIndex = items.findIndex((item) => item.sys.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <section id="projects" className="py-24 sm:py-32 bg-muted animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">My Projects</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
            Here are some of the projects I&apos;ve worked on. (You can drag and drop to reorder them!)
          </p>
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={projects.map((p) => p.sys.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard key={project.sys.id} project={project} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </section>
  );
};

export default Projects;

import React from 'react';
import { getProjects } from '@/lib/contentful';
import ProjectCard from './ProjectCard';

// --- Main Component ---

const Projects = async () => {
  const projects = await getProjects();

  return (
    <section id="projects" className="py-24 sm:py-32 bg-muted animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">My Projects</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
            Here are some of the projects I've worked on.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.sys.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

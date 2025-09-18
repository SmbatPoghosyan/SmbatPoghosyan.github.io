import React from 'react';
import { getProjects } from '@/lib/contentful';
import ProjectCard from './ProjectCard';

// --- Main Component ---

const Projects = async () => {
  const projects = await getProjects();

  return (
    <section id="projects" className="py-16 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Projects</h2>
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

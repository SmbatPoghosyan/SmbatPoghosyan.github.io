import React from 'react';
import { contentfulClient } from '@/lib/contentful';
import { type Asset } from 'contentful';

interface Project {
  title: string;
  description: string;
  projectUrl?: string;
  image?: Asset;
}

interface ProjectEntry {
  fields: Project;
}

const getProjects = async (): Promise<ProjectEntry[]> => {
  const entries = await contentfulClient.getEntries<Project>({
    content_type: 'project',
  });
  return entries.items as ProjectEntry[];
};

const Work = async () => {
  const projects = await getProjects();

  return (
    <section id="work" className="py-16 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">My Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <a
              href={project.fields.projectUrl || '#'}
              key={index}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-muted rounded-lg p-6 hover:bg-muted/80 transition-colors"
            >
              {project.fields.image && (
                <img
                  // @ts-ignore
                  src={`https:${project.fields.image.fields.file.url}`}
                  // @ts-ignore
                  alt={project.fields.image.fields.description || project.fields.title}
                  className="mb-4 rounded-md"
                />
              )}
              <h3 className="text-xl font-bold mb-2">{project.fields.title}</h3>
              <p className="text-muted-foreground">{project.fields.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;

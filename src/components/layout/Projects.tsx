import React from 'react';
import Image from 'next/image';
import { contentfulClient } from '@/lib/contentful';
import { type Asset, type Entry, type EntryFieldTypes, type EntrySkeletonType } from 'contentful';

// --- Data Fetching and Types ---

interface ProjectSkeleton extends EntrySkeletonType {
  fields: {
    title: EntryFieldTypes.Text;
    description: EntryFieldTypes.Text;
    projectUrl?: EntryFieldTypes.Text;
    image?: EntryFieldTypes.AssetLink | Asset;
  };
  contentTypeId: 'project';
}

const getProjects = async (): Promise<Entry<ProjectSkeleton>[]> => {
  const entries = await contentfulClient.getEntries<ProjectSkeleton>({
    content_type: 'project',
    include: 2,
  });
  return entries.items;
};

// --- Helper Functions ---

const toAbsoluteUrl = (url: string) => {
  if (!url) return '#';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};

// --- Main Component ---

const Projects = async () => {
  const projects = await getProjects();

  return (
    <section id="projects" className="py-16 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <a
              href={toAbsoluteUrl(project.fields.projectUrl as string)}
              key={project.sys.id}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-muted rounded-lg p-6 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              title={`Open project "${project.fields.title}" in a new tab`}
            >
              <div className="relative h-48 w-full mb-4 overflow-hidden rounded-md">
                {project.fields.image && 'fields' in project.fields.image ? (
                  <Image
                    src={`https:${project.fields.image.fields.file.url}`}
                    alt={project.fields.image.fields.description || (project.fields.title as string)}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-background text-muted-foreground">
                    <span>No Image</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 p-1.5 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2">{project.fields.title}</h3>
              <p className="text-muted-foreground">{project.fields.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

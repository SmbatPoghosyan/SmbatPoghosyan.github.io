import React from 'react';
import Image from 'next/image';
import { contentfulClient } from '@/lib/contentful';
import { type Entry, type EntryFieldTypes, type EntrySkeletonType } from 'contentful';

interface ProjectSkeleton extends EntrySkeletonType {
  fields: {
    title: EntryFieldTypes.Text;
    description: EntryFieldTypes.Text;
    projectUrl?: EntryFieldTypes.Text;
    image?: EntryFieldTypes.AssetLink;
  };
  contentTypeId: 'project';
}

const getProjects = async (): Promise<Entry<ProjectSkeleton>[]> => {
  const entries = await contentfulClient.getEntries<ProjectSkeleton>({
    content_type: 'project',
    include: 2, // to resolve linked assets
  });
  return entries.items;
};

const Projects = async () => {
  const projects = await getProjects();

  return (
    <section id="projects" className="py-16 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <a
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              href={(project.fields.projectUrl as any) || '#'}
              key={project.sys.id}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-muted rounded-lg p-6 hover:bg-muted/80 transition-colors"
            >
              {project.fields.image && (
                <Image
                  // The Contentful SDK types for localized fields are complex.
                  // Using `any` here as a pragmatic solution to avoid build errors.
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  src={`https:${(project.fields.image as any).fields.file.url}`}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  alt={(project.fields.image as any).fields.description || project.fields.title}
                  width={400}
                  height={300}
                  className="mb-4 rounded-md"
                />
              )}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <h3 className="text-xl font-bold mb-2">{project.fields.title as any}</h3>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <p className="text-muted-foreground">{project.fields.description as any}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;

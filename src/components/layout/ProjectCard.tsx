import React from 'react';
import Image from 'next/image';
import { type ProjectEntry } from '@/lib/types';
import { toAbsoluteUrl } from '@/lib/utils';

interface ProjectCardProps {
  project: ProjectEntry;
}

import { type Asset } from 'contentful';

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { title, description, projectUrl, image } = project.fields;

  let imageUrl = '';
  let imageAlt = title as string;

  const asset = image as Asset;
  if (asset?.fields?.file?.url) {
    imageUrl = `https:${asset.fields.file.url}`;
    imageAlt = (asset.fields.description as string) || (title as string);
  }

  return (
    <a
      href={toAbsoluteUrl(projectUrl as string)}
      key={project.sys.id}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-muted rounded-lg p-6 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
      title={`Open project "${title as string}" in a new tab`}
    >
      <div className="relative h-48 w-full mb-4 overflow-hidden rounded-md">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-arrow-up-right"
          >
            <path d="M7 7h10v10" />
            <path d="M7 17 17 7" />
          </svg>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-2">{title as string}</h3>
      <p className="text-muted-foreground">{description as string}</p>
    </a>
  );
};

export default ProjectCard;

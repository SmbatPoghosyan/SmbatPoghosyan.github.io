import React from 'react';
import Image from 'next/image';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type ProjectEntry } from '@/lib/types';
import { toAbsoluteUrl } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';
import { type Asset } from 'contentful';

interface ProjectCardProps {
  project: ProjectEntry;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: project.sys.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const { title, description, projectUrl, image } = project.fields;

  let imageUrl = '';
  let imageAlt = title as string;

  const asset = image as Asset;
  if (asset?.fields?.file?.url) {
    imageUrl = `https:${asset.fields.file.url}`;
    imageAlt = (asset.fields.description as string) || (title as string);
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <a
        href={toAbsoluteUrl(projectUrl as string)}
        key={project.sys.id}
        target="_blank"
        rel="noopener noreferrer"
        className="group block bg-card rounded-lg p-6 border shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
        title={`Open project "${title as string}" in a new tab`}
      >
        <div className="relative h-48 w-full mb-4 overflow-hidden rounded-md">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-secondary text-muted-foreground">
              <span>No Image</span>
            </div>
          )}
          <div className="absolute top-2 right-2 p-1.5 bg-card/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>

        <h3 className="text-xl font-bold mb-2">{title as string}</h3>
        <p className="text-muted-foreground">{description as string}</p>
      </a>
    </div>
  );
};

export default ProjectCard;

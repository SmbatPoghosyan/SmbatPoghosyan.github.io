import { createClient } from 'contentful';
import {
  type AboutMeEntry,
  type AboutMeSkeleton,
  type ContactEntry,
  type ContactSkeleton,
  type EducationEntry,
  type EducationSkeleton,
  type ProfessionalSkillEntry,
  type ProfessionalSkillSkeleton,
  type ProjectEntry,
  type ProjectSkeleton,
  type WorkHistoryEntry,
  type WorkHistorySkeleton,
} from '@/lib/types';

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

export const contentfulClient =
  spaceId && accessToken
    ? createClient({
        space: spaceId,
        accessToken: accessToken,
      })
    : null;

// --- Data Fetching Functions ---

export const getAboutMe = async (): Promise<AboutMeEntry | null> => {
  if (!contentfulClient) return null;
  const entries = await contentfulClient.getEntries<AboutMeSkeleton>({
    content_type: 'aboutMe',
    limit: 1,
    include: 2,
  });
  return entries.items[0] || null;
};

export const getSkills = async (): Promise<ProfessionalSkillEntry[]> => {
  if (!contentfulClient) return [];
  const entries = await contentfulClient.getEntries<ProfessionalSkillSkeleton>({
    content_type: 'professionalSkill',
    order: ['fields.category', 'fields.strength'],
  });
  return entries.items;
};

export const getContact = async (): Promise<ContactEntry | null> => {
  if (!contentfulClient) return null;
  const entries = await contentfulClient.getEntries<ContactSkeleton>({
    content_type: 'contact',
    limit: 1,
  });
  return entries.items[0] || null;
};

export const getEducation = async (): Promise<EducationEntry[]> => {
  if (!contentfulClient) return [];
  const entries = await contentfulClient.getEntries<EducationSkeleton>({
    content_type: 'education',
    order: ['-fields.startDate'],
  });
  return entries.items;
};

export const getProjects = async (): Promise<ProjectEntry[]> => {
  if (!contentfulClient) return [];
  const entries = await contentfulClient.getEntries<ProjectSkeleton>({
    content_type: 'project',
    include: 2,
  });
  return entries.items;
};

export const getWorkHistory = async (): Promise<WorkHistoryEntry[]> => {
  if (!contentfulClient) return [];
  const entries = await contentfulClient.getEntries<WorkHistorySkeleton>({
    content_type: 'workHistory',
    order: ['-fields.startDate'],
  });
  return entries.items;
};

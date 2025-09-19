import { type Entry, type EntryFieldTypes, type EntrySkeletonType } from 'contentful';

// --- Base Skeletons ---

export interface AuthorSkeleton extends EntrySkeletonType {
  fields: {
    name: EntryFieldTypes.Symbol;
  };
  contentTypeId: 'author';
}

export interface AboutMeSkeleton extends EntrySkeletonType {
  fields: {
    text: EntryFieldTypes.Text;
    avatar: EntryFieldTypes.AssetLink;
    avatarUrl: EntryFieldTypes.Symbol;
  };
  contentTypeId: 'aboutMe';
}

export interface ContactSkeleton extends EntrySkeletonType {
  fields: {
    email: EntryFieldTypes.Symbol;
    phone: EntryFieldTypes.Symbol;
    socialLinks: EntryFieldTypes.Object;
  };
  contentTypeId: 'contact';
}

export interface WorkHistorySkeleton extends EntrySkeletonType {
  fields: {
    company: EntryFieldTypes.Text;
    location: EntryFieldTypes.Text;
    period: EntryFieldTypes.Text;
    title: EntryFieldTypes.Text;
    description: EntryFieldTypes.Text;
    startDate: EntryFieldTypes.Date;
  };
  contentTypeId: 'workHistory';
}

export interface EducationSkeleton extends EntrySkeletonType {
  fields: {
    institution: EntryFieldTypes.Symbol;
    degree: EntryFieldTypes.Symbol;
    period: EntryFieldTypes.Symbol;
    startDate: EntryFieldTypes.Date;
  };
  contentTypeId: 'education';
}

export interface ProfessionalSkillSkeleton extends EntrySkeletonType {
  fields: {
    name: EntryFieldTypes.Symbol;
    category: EntryFieldTypes.Symbol;
    strength: EntryFieldTypes.Integer;
  };
  contentTypeId: 'professionalSkill';
}

export interface ProjectSkeleton extends EntrySkeletonType {
  fields: {
    title: EntryFieldTypes.Symbol;
    description: EntryFieldTypes.Text;
    projectUrl: EntryFieldTypes.Symbol;
    image: EntryFieldTypes.AssetLink;
  };
  contentTypeId: 'project';
}

// --- Entry Types ---

export type AuthorEntry = Entry<AuthorSkeleton>;
export type AboutMeEntry = Entry<AboutMeSkeleton>;
export type ContactEntry = Entry<ContactSkeleton>;
export type WorkHistoryEntry = Entry<WorkHistorySkeleton>;
export type EducationEntry = Entry<EducationSkeleton>;
export type ProfessionalSkillEntry = Entry<ProfessionalSkillSkeleton>;
export type ProjectEntry = Entry<ProjectSkeleton>;

import { Author, AboutMe, Contact, WorkHistory, Education, ProfessionalSkillCategory, Project } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function fetchData<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${endpoint}`);
  }
  return res.json();
}

export const getAuthor = () => fetchData<Author>('/author');
export const getAboutMe = () => fetchData<AboutMe>('/about');
export const getContact = () => fetchData<Contact>('/contact');
export const getWorkHistory = () => fetchData<WorkHistory[]>('/work-history');
export const getEducation = () => fetchData<Education[]>('/education');
export const getSkills = () => fetchData<ProfessionalSkillCategory[]>('/skills');
export const getProjects = () => fetchData<Project[]>('/projects');

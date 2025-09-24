export interface Author {
  id: number;
  name: string;
}

export interface AboutMe {
  id: number;
  text: string;
  avatar_url: string;
}

export interface Contact {
  id: number;
  email: string;
  phone: string;
  social_links?: { [key: string]: string };
}

export interface WorkHistory {
  id: number;
  company: string;
  location: string;
  period: string;
  title: string;
  description: string;
  start_date: string; // Dates will be strings in JSON
}

export interface Education {
  id:number;
  institution: string;
  degree: string;
  period: string;
  start_date: string; // Dates will be strings in JSON
}

export interface ProfessionalSkill {
  id: number;
  name: string;
  strength: number;
  order: number;
  category_id: number;
}

export interface ProfessionalSkillCategory {
  id: number;
  title: string;
  order: number;
  skills: ProfessionalSkill[];
}

export interface Project {
  id: number;
  title: string;
  description: string;
  project_url: string;
  image_url: string;
}

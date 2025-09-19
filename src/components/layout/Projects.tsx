import { getProjects } from '@/lib/contentful';
import ProjectsClient from './ProjectsClient';

const Projects = async () => {
  const projects = await getProjects();

  return <ProjectsClient initialProjects={projects} />;
};

export default Projects;

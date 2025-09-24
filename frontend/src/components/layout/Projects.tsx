import { getProjects } from '@/lib/api';
import ProjectsClient from './ProjectsClient';

const Projects = async () => {
  const projects = await getProjects();

  return <ProjectsClient initialProjects={projects} />;
};

export default Projects;

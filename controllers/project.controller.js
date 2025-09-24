const projectService = require('../services/project.service');

async function getProjects(req, res, next) {
  try {
    const projects = await projectService.getProjects();
    res.json(projects);
  } catch (err) {
    console.error(`Error while getting projects`, err.message);
    next(err);
  }
}

module.exports = {
  getProjects,
};

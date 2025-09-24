const Project = require('../models/Project');

async function getProjects() {
  return await Project.query();
}

module.exports = {
  getProjects,
};

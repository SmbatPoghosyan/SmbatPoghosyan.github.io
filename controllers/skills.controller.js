const skillsService = require('../services/skills.service');

async function getSkills(req, res, next) {
  try {
    const skills = await skillsService.getSkills();
    res.json(skills);
  } catch (err) {
    console.error(`Error while getting skills`, err.message);
    next(err);
  }
}

module.exports = {
  getSkills,
};

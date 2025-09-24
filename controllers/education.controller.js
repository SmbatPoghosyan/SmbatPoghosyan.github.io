const educationService = require('../services/education.service');

async function getEducation(req, res, next) {
  try {
    const education = await educationService.getEducation();
    res.json(education);
  } catch (err) {
    console.error(`Error while getting education`, err.message);
    next(err);
  }
}

module.exports = {
  getEducation,
};

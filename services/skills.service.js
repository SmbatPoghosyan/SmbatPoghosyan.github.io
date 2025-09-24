const ProfessionalSkillCategory = require('../models/ProfessionalSkillCategory');

async function getSkills() {
  return await ProfessionalSkillCategory.query().withGraphFetched('skills');
}

module.exports = {
  getSkills,
};

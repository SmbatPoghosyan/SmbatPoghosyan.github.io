const Education = require('../models/Education');

async function getEducation() {
  return await Education.query().orderBy('start_date', 'desc');
}

module.exports = {
  getEducation,
};

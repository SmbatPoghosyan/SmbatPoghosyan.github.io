const WorkHistory = require('../models/WorkHistory');

async function getWorkHistory() {
  return await WorkHistory.query().orderBy('start_date', 'desc');
}

module.exports = {
  getWorkHistory,
};

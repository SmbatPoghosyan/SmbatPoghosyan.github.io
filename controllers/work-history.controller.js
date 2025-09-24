const workHistoryService = require('../services/work-history.service');

async function getWorkHistory(req, res, next) {
  try {
    const workHistory = await workHistoryService.getWorkHistory();
    res.json(workHistory);
  } catch (err) {
    console.error(`Error while getting work history`, err.message);
    next(err);
  }
}

module.exports = {
  getWorkHistory,
};

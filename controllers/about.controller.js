const aboutService = require('../services/about.service');

async function getAboutMe(req, res, next) {
  try {
    const aboutMe = await aboutService.getAboutMe();
    res.json(aboutMe);
  } catch (err) {
    console.error(`Error while getting about me`, err.message);
    next(err);
  }
}

module.exports = {
  getAboutMe,
};

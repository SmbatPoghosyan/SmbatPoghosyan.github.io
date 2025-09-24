const AboutMe = require('../models/AboutMe');

async function getAboutMe() {
  return await AboutMe.query().first();
}

module.exports = {
  getAboutMe,
};

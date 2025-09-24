const Author = require('../models/Author');

async function getAuthor() {
  // There is only one author, so we can just fetch the first one.
  return await Author.query().first();
}

module.exports = {
  getAuthor,
};

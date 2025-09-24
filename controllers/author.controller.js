const authorService = require('../services/author.service');

async function getAuthor(req, res, next) {
  try {
    const author = await authorService.getAuthor();
    res.json(author);
  } catch (err) {
    console.error(`Error while getting author`, err.message);
    next(err);
  }
}

module.exports = {
  getAuthor,
};

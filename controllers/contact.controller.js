const contactService = require('../services/contact.service');

async function getContact(req, res, next) {
  try {
    const contact = await contactService.getContact();
    res.json(contact);
  } catch (err) {
    console.error(`Error while getting contact`, err.message);
    next(err);
  }
}

module.exports = {
  getContact,
};

const Contact = require('../models/Contact');

async function getContact() {
  return await Contact.query().first();
}

module.exports = {
  getContact,
};

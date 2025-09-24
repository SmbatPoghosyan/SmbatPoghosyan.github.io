const { Model } = require('objection');

class AboutMe extends Model {
  static get tableName() {
    return 'about_me';
  }
}

module.exports = AboutMe;

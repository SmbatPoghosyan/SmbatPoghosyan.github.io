const { Model } = require('objection');

class Education extends Model {
  static get tableName() {
    return 'education';
  }
}

module.exports = Education;

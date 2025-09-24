const { Model } = require('objection');

class WorkHistory extends Model {
  static get tableName() {
    return 'work_histories';
  }
}

module.exports = WorkHistory;

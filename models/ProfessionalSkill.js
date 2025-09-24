const { Model } = require('objection');

class ProfessionalSkill extends Model {
  static get tableName() {
    return 'professional_skills';
  }

  static get relationMappings() {
    const ProfessionalSkillCategory = require('./ProfessionalSkillCategory.js');
    return {
      category: {
        relation: Model.BelongsToOneRelation,
        modelClass: ProfessionalSkillCategory,
        join: {
          from: 'professional_skills.category_id',
          to: 'professional_skill_categories.id'
        }
      }
    }
  }
}

module.exports = ProfessionalSkill;

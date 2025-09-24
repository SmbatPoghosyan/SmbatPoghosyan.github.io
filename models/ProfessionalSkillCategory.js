const { Model } = require('objection');

class ProfessionalSkillCategory extends Model {
  static get tableName() {
    return 'professional_skill_categories';
  }

  static get relationMappings() {
    const ProfessionalSkill = require('./ProfessionalSkill.js');
    return {
      skills: {
        relation: Model.HasManyRelation,
        modelClass: ProfessionalSkill,
        join: {
          from: 'professional_skill_categories.id',
          to: 'professional_skills.category_id'
        }
      }
    }
  }
}

module.exports = ProfessionalSkillCategory;

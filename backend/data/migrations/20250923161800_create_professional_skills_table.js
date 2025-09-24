exports.up = function(knex) {
  return knex.schema.createTable('professional_skills', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.integer('strength').notNullable();
    table.integer('order').notNullable();
    table.integer('category_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('professional_skill_categories')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('professional_skills');
};

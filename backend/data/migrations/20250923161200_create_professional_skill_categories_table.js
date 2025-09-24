exports.up = function(knex) {
  return knex.schema.createTable('professional_skill_categories', table => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.integer('order').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('professional_skill_categories');
};

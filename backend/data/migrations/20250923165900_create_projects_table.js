exports.up = function(knex) {
  return knex.schema.createTable('projects', table => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description');
    table.string('project_url');
    table.string('image_url');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('projects');
};

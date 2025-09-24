exports.up = function(knex) {
  return knex.schema.createTable('about_me', table => {
    table.increments('id').primary();
    table.text('text').notNullable();
    table.string('avatar_url');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('about_me');
};

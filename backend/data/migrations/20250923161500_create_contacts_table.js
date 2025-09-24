exports.up = function(knex) {
  return knex.schema.createTable('contacts', table => {
    table.increments('id').primary();
    table.string('email').notNullable();
    table.string('phone');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('contacts');
};

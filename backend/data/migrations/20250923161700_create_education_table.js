exports.up = function(knex) {
  return knex.schema.createTable('education', table => {
    table.increments('id').primary();
    table.string('institution').notNullable();
    table.string('degree');
    table.string('period');
    table.date('start_date');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('education');
};

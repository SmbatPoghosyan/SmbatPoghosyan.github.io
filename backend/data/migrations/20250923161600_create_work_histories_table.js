exports.up = function(knex) {
  return knex.schema.createTable('work_histories', table => {
    table.increments('id').primary();
    table.string('company').notNullable();
    table.string('location');
    table.string('period');
    table.string('title').notNullable();
    table.text('description');
    table.date('start_date');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('work_histories');
};

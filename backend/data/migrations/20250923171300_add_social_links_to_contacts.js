exports.up = function(knex) {
  return knex.schema.table('contacts', table => {
    table.json('social_links');
  });
};

exports.down = function(knex) {
  return knex.schema.table('contacts', table => {
    table.dropColumn('social_links');
  });
};

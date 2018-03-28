exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('families', function(table) {
      table.increments('id').primary();
      table.string('name');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('characters', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('description');
      table.boolean('book_presence');
      table.integer('family_id').unsigned()
      table.foreign('family_id')
        .references('families.id');

      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('characters'),
    knex.schema.dropTable('families')
  ]);
};

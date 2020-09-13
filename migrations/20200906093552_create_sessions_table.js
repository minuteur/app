
exports.up = function(knex) {
    return knex.schema
        .createTable('sessions', function (table) {
            table.string('uuid').primary();
            table.string('project_uuid');
            table.string('name', 255).nullable();
            table.timestamp('started_at').nullable();
            table.date('date').notNullable();
            table.integer('time').nullable();
        })
};

exports.down = function(knex) {
    return knex.schema.dropTable('projects');
};

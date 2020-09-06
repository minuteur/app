
exports.up = function(knex) {
    return knex.schema
        .createTable('projects', function (table) {
            table.string('uuid').primary();
            table.string('client_uuid');
            table.string('name', 255).notNullable();
        })
};

exports.down = function(knex) {
    return knex.schema.dropTable('projects');
};

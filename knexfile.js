// Update with your config settings.

module.exports = {

    development: {
        client: 'sqlite3',
        connection: {
            filename: './dev.sqlite3'
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },

    production: {
        client: 'sqlite3',
        connection: {
            filename: './prod.sqlite3'
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }

};

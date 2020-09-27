// Update with your config settings.

module.exports = {

    development: {
        client: 'sqlite3',
        connection: {
            filename: 'db/dev.sqlite3',
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: 'migrations',
        }
    },

    production: {
        client: 'sqlite3',
        connection: {
            filename: 'db/prod.sqlite3'
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: 'migrations',
        }
    }

};

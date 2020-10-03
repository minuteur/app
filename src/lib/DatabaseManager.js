import knex from 'knex';
import { resolve } from 'path';
import { remote } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import WebpackMigrationSource from '@lib/WebpackMigrationSource';

class DatabaseManager {
    init () {
        const environment = process.env.NODE_ENV || 'development';
        let configuration = require('./../../knexfile')[environment];

        configuration.connection.filename = resolve(remote.app.getPath('userData'), `../${configuration.connection.filename}`);
        configuration.migrations.directory = resolve(remote.app.getPath('userData'), `../${configuration.migrations.directory}`);

        console.info('Connection configuration', configuration);

        this.knexManager = knex(configuration);
    }

    migrate () {
        return this.knexManager.migrate.latest({
            migrationSource: new WebpackMigrationSource(require.context('./../../migrations', false, /.js$/))
        });
    }

    select (...fields) {
        return this.knexManager.select(...fields);
    }

    raw (...fields) {
        return this.knexManager.raw(...fields);
    }

    async insert (table, fields) {
        fields['uuid'] = uuidv4();

        await this.knexManager(table).insert(fields);

        return fields['uuid'];
    }

    getInstance (parameters = null) {
        if (parameters) {
            return this.knexManager(parameters);
        }

        return this.knexManager;
    }
}

export default new DatabaseManager

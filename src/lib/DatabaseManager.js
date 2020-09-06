import { v4 as uuidv4 } from 'uuid';

class DatabaseManager {
    init() {
        const environment = process.env.NODE_ENV || 'development';
        const configuration = require('./../../knexfile')[environment];

        this.knexManager = require('knex')(configuration);
    }

    select (fields) {
        return this.knexManager.select(fields);
    }

    async insert (table, fields) {
        fields['uuid'] = uuidv4();

        await this.knexManager(table).insert(fields);

        return fields['uuid'];
    }

    getInstance (parameters) {
        return this.knexManager(parameters);
    }
}

export default new DatabaseManager

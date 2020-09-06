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

    insert (table, fields) {
        fields['uuid'] = uuidv4();

        return this.knexManager(table).insert(fields);
    }
}

export default new DatabaseManager

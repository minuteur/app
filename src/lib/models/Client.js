import DatabaseManager from './../DatabaseManager'

class Client {
    async all () {
        return await DatabaseManager.select('*').from('clients');
    }

    async find (uuid) {
        return DatabaseManager.select('*').from('clients').where('uuid', uuid).first();
    }

    async create (fields) {
        let clientUuid = await DatabaseManager.insert('clients', fields);

        return this.find(clientUuid);
    }

    async update (uuid, fields) {
        await DatabaseManager.getInstance('clients')
            .where('uuid', uuid)
            .update(fields);
    }
}

export default new Client

import DatabaseManager from './../DatabaseManager'

class Client {
    async all () {
        return await DatabaseManager.select('*').from('clients');
    }

    async create (name) {
        return await DatabaseManager.insert('clients', { name });
    }
}

export default new Client

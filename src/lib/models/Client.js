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

    async delete (uuid) {
        const projects = await DatabaseManager
            .select('projects.*')
            .where('client_uuid', uuid)
            .from('projects');

        projects.forEach(async project => {
            await DatabaseManager.getInstance('sessions')
                .where('project_uuid', project.uuid)
                .delete();
        });

        await DatabaseManager.getInstance('projects')
            .where('client_uuid', uuid)
            .delete();

        await DatabaseManager.getInstance('clients')
            .where('uuid', uuid)
            .delete();
    }
}

export default new Client

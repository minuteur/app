import DatabaseManager from './../DatabaseManager'

class Project {
    async all (clientUuid) {
        return await DatabaseManager
            .select('*')
            .where('client_uuid', clientUuid)
            .from('projects');
    }

    async find (uuid) {
        console.log('finding uuid', uuid);
        return DatabaseManager.select('*').from('projects').where('uuid', uuid).first();
    }

    async create (fields) {
        let projectUuid = await DatabaseManager.insert('projects', fields);

        return this.find(projectUuid);
    }

    async update (uuid, fields) {
        await DatabaseManager.getInstance('projects')
            .where('uuid', uuid)
            .update(fields);
    }
}

export default new Project

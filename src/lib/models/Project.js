import DatabaseManager from './../DatabaseManager'

class Project {
    async all () {
        return await DatabaseManager.select('*').from('projects');
    }

    async find (uuid) {
        console.log('finding uuid', uuid);
        return DatabaseManager.select('*').from('projects').where('uuid', uuid).first();
    }

    async create (fields) {
        let projectUuid = await DatabaseManager.insert('projects', fields);

        return this.find(projectUuid);
    }
}

export default new Project

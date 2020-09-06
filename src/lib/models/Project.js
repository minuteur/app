import DatabaseManager from './../DatabaseManager'

class Project {
    async all () {
        return await DatabaseManager.select('*').from('projects');
    }

    async create (fields) {
        return await DatabaseManager.insert('projects', fields);
    }
}

export default new Project

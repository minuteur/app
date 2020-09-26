import DatabaseManager from './../DatabaseManager'

class Project {
    async all (clientUuid) {
        return await DatabaseManager
            .select('*')
            .where('client_uuid', clientUuid)
            .from('projects');
    }

    async find (uuid) {
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

    async summary () {
        return DatabaseManager.select(
            'projects.*',
            'sessions.date',
            DatabaseManager.raw('SUM(sessions.time) as time'),
            DatabaseManager.raw('GROUP_CONCAT(sessions.name, ", ") as notes'),
        )
            .from('projects')
            .innerJoin('sessions', 'sessions.project_uuid', 'projects.uuid')
            .groupBy('sessions.date');

        // select projects.*, sessions.date, SUM(sessions.time)
        // from projects
        // inner join sessions on sessions.project_uuid = projects.uuid
        // group by sessions."date"
    }
}

export default new Project

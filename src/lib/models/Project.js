import DatabaseManager from './../DatabaseManager';
import { SESSION_STATUS_DONE } from './Session';

class Project {
    async all (callback) {
        let query = DatabaseManager
            .select('projects.*')
            .from('projects');

        if (typeof callback === 'function') {
            callback(query);
        }

        return await query;
    }

    async allFromClient (clientUuid) {
        return await DatabaseManager
            .select('projects.*')
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
            .where('sessions.state', '=', SESSION_STATUS_DONE)
            .groupByRaw('sessions.date, projects.uuid');
    }
}

export default new Project

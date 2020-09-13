import moment from 'moment';
import DatabaseManager from './../DatabaseManager';

class Session {
    async all (projectUuid) {
        return await DatabaseManager
            .select('*')
            .where('project_uuid', projectUuid)
            .from('sessions');
    }

    async find (uuid) {
        return DatabaseManager.select('*').from('sessions').where('uuid', uuid).first();
    }

    async create (fields) {
        let sessiontUuid = await DatabaseManager.insert('sessions', {
            ...fields,
            ...{
                date: moment().format('YYYY-MM-DD'),
                started_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            }
        });

        return this.find(sessiontUuid);
    }

    async update (uuid, fields) {
        await DatabaseManager.getInstance('sessions')
            .where('uuid', uuid)
            .update(fields);
    }
}

export default new Session

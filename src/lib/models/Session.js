import moment from 'moment';
import DatabaseManager from './../DatabaseManager';

const SESSION_STATUS_RUNNING = 'running';
const SESSION_STATUS_DONE = 'done';

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
                state: SESSION_STATUS_RUNNING,
                time: 1
            }
        });

        return this.find(sessiontUuid);
    }

    async update (uuid, fields) {
        await DatabaseManager.getInstance('sessions')
            .where('uuid', uuid)
            .update(fields);
    }

    async delete (uuid) {
        await DatabaseManager.getInstance('sessions')
            .where('uuid', uuid)
            .delete();
    }

    async stopTimer (uuid, time) {
        await DatabaseManager.getInstance('sessions')
            .where('uuid', uuid)
            .update({
                time: time,
                state: SESSION_STATUS_DONE
            });
    }

    async deleteFromProject (project_uuid) {
        await DatabaseManager.getInstance('sessions')
            .where('project_uuid', project_uuid)
            .delete();
    }

    /**
     * Get the running session for a specific project.
     * @param {string} uuid
     */
    getRunningSession (uuid) {
        return DatabaseManager
            .select('*')
            .from('sessions')
            .where({
                project_uuid: uuid,
                state: SESSION_STATUS_RUNNING
            })
            .first();
    }
}

export default new Session;
export { SESSION_STATUS_DONE, SESSION_STATUS_RUNNING };

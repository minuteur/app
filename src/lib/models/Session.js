import moment from 'moment';
import { ipcRenderer } from 'electron';
import TimeManager from '@lib/TimeManager';
import DatabaseManager from '@lib/DatabaseManager';

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
        return DatabaseManager.select('*')
            .from('sessions')
            .where('uuid', uuid)
            .first();
    }

    async totalTimeSpend (project_uuid) {
        return DatabaseManager.select(DatabaseManager.raw('SUM(sessions.time) as total'))
            .from('sessions')
            .where('project_uuid', project_uuid)
            .first();
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

        // sending a message to the background process so it can change the icon :)
        ipcRenderer.send('timer:started', {});

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

    async stopTimer (uuid, time, name) {
        await DatabaseManager.getInstance('sessions')
            .where('uuid', uuid)
            .update({
                time: TimeManager.round(time),
                state: SESSION_STATUS_DONE,
                name: name || null
            });

        // sending a message to the background process so it can change the icon :)
        ipcRenderer.send('timer:stopped', {});
    }

    async deleteFromProject (project_uuid) {
        await DatabaseManager.getInstance('sessions')
            .where('project_uuid', project_uuid)
            .where('state', SESSION_STATUS_DONE)
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

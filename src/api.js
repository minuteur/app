import Project from '@models/Project';
import { SESSION_STATUS_RUNNING } from '@models/Session';
import Session from '@models/Session';
import EventManager from '@lib/EventManager';
import TimeManager from '@lib/TimeManager';

const express = require('express')
const api = express()

api.param('project', async (req, res, next, id) => {
    try {
        req.project = await Project.find(id);
        next();
    } catch (e) {
        next(new Error('failed to load project'))
    }
  })

/**
 * Returns a list of all the active projects
 */
api.get('/api/projects', async (req, res) => {
    const projects = await Project.all((query) => {
        if (req.query.q) {
            query.where('projects.name', 'like', `${req.query.q}%`);
        }

        if (req.query.only_running) {
            query.innerJoin('sessions', 'sessions.project_uuid', 'projects.uuid')
                 .where('sessions.state', '=', SESSION_STATUS_RUNNING);
        }
    });

    res.json(projects);
});

/**
 * Returns a daily summary per project.
 */
api.get('/api/projects/summary/daily', async (req, res) => {
    const summary = await Project.summary();

    res.json(summary);
});

/**
 * Start a new session in a given project.
 */
api.post('/api/projects/:project/sessions', async (req, res) => {
    const project = req.project;
    const runningSession = await Session.getRunningSession(project.uuid);

    if (runningSession !== null && typeof runningSession !== 'undefined') {
        res.status(422).json({
            error: "There's already a running session",
        });
        return;
    }

    await Session.create({
        project_uuid: project.uuid,
        name: 'Session'
    });

    EventManager.fire('sessions.changed');

    res.sendStatus(204);
});

/**
 * Stop the first running session for a given project.
 */
api.delete('/api/projects/:project/session/running', async (req, res) => {
    const project = req.project;
    const runningSession = await Session.getRunningSession(project.uuid);

    if (runningSession === null && typeof runningSession === 'undefined') {
        res.status(404).json({
            error: "There's no running session for this project",
        });
        return;
    }

    Session.stopTimer(
        runningSession.uuid,
        TimeManager.toSeconds(runningSession.started_at)
    );

    EventManager.fire('sessions.changed');

    res.sendStatus(204);
});

/**
 * Clear all the sessions for a given project.
 */
api.delete('/api/projects/:project/sessions/clear', async (req, res) => {
    const project = req.project;
    await Session.deleteFromProject(project.uuid);

    EventManager.fire('sessions.changed');

    res.sendStatus(204);
});

export default api;

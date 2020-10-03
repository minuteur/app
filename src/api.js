import Project from '@models/Project'
import Session from '@models/Session'
import EventManager from '@lib/EventManager'

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
    const projects = await Project.all();

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
    await Session.create({
        project_uuid: project.uuid,
        name: 'Session'
    });

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

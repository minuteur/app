import Project from '@models/Project'
import Session from '@models/Session'

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
 * Returns a daily summary per project.
 */
api.get('/api/projects/summary/daily', async (req, res) => {
    const summary = await Project.summary();

    res.json(summary);
});

/**
 * Clear all the sessions for a given project.
 */
api.delete('/api/projects/:project/sessions/clear', async (req, res) => {
    const project = req.project;
    await Session.deleteFromProject(project.uuid);

    res.sendStatus(204);
});

export default api;

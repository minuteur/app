import Project from '@models/Project'

const express = require('express')
const api = express()

/**
 * Returns a summary of hours per day for all clients.
 */
api.get('/api/projects/summary/daily', async (req, res) => {
    const summary = await Project.summary();
    res.json(summary);
})

export default api

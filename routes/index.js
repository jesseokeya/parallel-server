const Router = require('express').Router()

/* Required Routes */
const SnapshotRoute = require('./snapshot')
const NotificationRoute = require('./notification')

/* Required Services */
const {
    QueueService,
    SnapshotService
} = require('../services')

/* Required Daos */
const ResultDao = require('../dao/result')
const SnapshotDao = require('../dao/snapshot')

const context = {
    Router
}

const routes = [
    new SnapshotRoute({
        ...context,
        QueueService,
        SnapshotService,
        SnapshotDao
    }),
    new NotificationRoute({
        ...context
    })
]

module.exports = routes
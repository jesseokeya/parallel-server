const Router = require('express').Router()

/* Required Routes */
const SnapshotRoute = require('./snapshot')

/* Required Services */
const {
    QueueService,
    SnapshotService,
    NotificationService,
    ChromeDriver
} = require('../services')

/* Required Daos */
const SnapshotDao = require('../dao/snapshot')

const context = {
    Router
}

const routes = [
    new SnapshotRoute({
        ...context,
        QueueService,
        SnapshotService,
        SnapshotDao,
        NotificationService,
        ChromeDriver
    })
]

module.exports = routes
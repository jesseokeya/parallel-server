const Router = require('express').Router()

/* Required Routes */
const SnapshotRoute = require('./snapshot')

/* Required Daos */
const SnapshotDao = require('../dao/snapshot')

/* Required Services */
const {
    QueueService,
    SnapshotService,
    NotificationService,
    ChromeDriver
} = require('../services')

const routes = [
    new SnapshotRoute({
        Router,
        QueueService,
        SnapshotService,
        SnapshotDao,
        NotificationService,
        ChromeDriver
    })
]

module.exports = routes
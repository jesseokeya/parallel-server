const Router = require('express').Router()

/* Required Routes */
const SnapshotRoute = require('./snapshot')
const NotificationRoute = require('./notification')

/* Required Services */
const {
    QueueService
} = require('../services')

/* Required Daos */

const context = {
    Router
}

const routes = [
    new SnapshotRoute({
        ...context,
        QueueService
    }),
    new NotificationRoute(context)
]

module.exports = routes
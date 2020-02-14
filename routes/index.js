const Router = require('express').Router()

/* Required Routes */
const SnapshotRoute = require('./snapshot')
const NotificationRoute = require('./notification')

/* Required Services */
const { CacheService, QueueService }  = require('../services')

/* Required Daos */

const context = {
    Router,
    CacheService
}

const routes = [
    new SnapshotRoute({ ...context, QueueService }),
    new NotificationRoute(context)
]

module.exports = routes
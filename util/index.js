const {
    depthOfTree,
    identicalTrees,
    compareTrees
} = require('./tree')

/**
 * Initializes all app routes
 * @param {Object} context - cotains the express app instance and all routes ready to be initialized
 * @throws {Error} if exception occurs at runtime
 * @example
 * initializeRoutes({ app, routes })
 */
const initializeRoutes = ({
    app,
    routes
}) => {
    const prefix = '/api/v1/'
    routes.forEach(route => {
        route.initialize()
        app.use(prefix, route.router)
    });
}

module.exports = {
    initializeRoutes,
    depthOfTree,
    identicalTrees,
    compareTrees
}
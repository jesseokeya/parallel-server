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
    initializeRoutes
}
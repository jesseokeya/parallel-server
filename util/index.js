const axios = require('axios')
const cheerio = require('cheerio')

const {
    depthOfTree,
    identicalTrees,
    compareTrees,
    inOrderTraversal
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

/**
 * Registers application models
 * @throws {Error} if exception occurs at runtime
 * @example
 * registerModels()
 */
const registerModels = _ => {
    require('../models/snapshot')
    require('../models/result')
}

const extractHostname = url => {
    let hostname = null
    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2]
    } else {
        hostname = url.split('/')[0]
    }
    hostname = hostname.split(':')[0]
    hostname = hostname.split('?')[0]
    return hostname
}


/**
 * Returns the document object model for a given url
 * @param {string} url - url of the website
 * @throws {Error} if exception occurs at runtime
 * @example
 * getDocument('https://seriesflv.org')
 */
const getDocument = async url => {
    try {
        const html = await axios.get(url).then(res => res.data)
        return cheerio.load(html)
    } catch (err) {
        throw err
    }
}


module.exports = {
    initializeRoutes,
    registerModels,
    depthOfTree,
    identicalTrees,
    compareTrees,
    getDocument,
    inOrderTraversal,
    extractHostname,
    getDocument
}
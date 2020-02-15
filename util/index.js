const axios = require('axios')
const cheerio = require('cheerio')

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

/**
 * Returns the document object model for a given url
 * @param {string} url - url of the website
 * @throws {Error} if exception occurs at runtime
 * @example
 * getDocument('https://seriesflv.org')
 */
const getDocument = async (url) => {
    try {
        const html = await axios.get(url).then(res => res.data)
        return cheerio.load(html)
    } catch (err) {
        throw err
    }
}

const getAttributes = attributes => {
    console.log(Object.keys(attributes))
    const results = {}
    if (!attributes) return results
    for (let i = 0; i < attributes.length; i++) {
        const attribute = attributes[i]
        results[attribute.name] = attribute.value
    }
    return results
}

const extractContext = (children) => {
    const results = []
    if (children && children.length > 0) {
        for (const child of children) {
            const invalid = ['script', 'noscript', 'meta', 'style', 'link']
            const name = child.name
            if (!invalid.includes(name) && child.type !== 'text' && name) {
                results.push({
                    name,
                    attributes: getAttributes(child.attribs),
                    children: [...extractContext(child.children)]
                })
            }
        }
    }
    return results
}

const inOrderTraversal = root => {
    if (!root) throw new Error('root node cannot be null. it is required for traversal')
    const node = root[0]
    const results = {
        name: node.name,
        attributes: getAttributes(node.attribs),
        children: [...extractContext(node.children)]
    }
    return results
}

module.exports = {
    initializeRoutes,
    registerModels,
    depthOfTree,
    identicalTrees,
    compareTrees,
    getDocument,
    inOrderTraversal
}
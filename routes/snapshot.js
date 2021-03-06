const uuid = require('uuid/v1');
const { isEmpty } = require("lodash");
const {
    depthOfTree,
    identicalTrees,
    compareTrees,
    extractHostname,
    isDaysOld,
    countNode
} = require('../util')

class Snapshot {
    constructor(options = {}) {
        this.options = options
        this.router = options.Router
        this.notificationService = new options.NotificationService()
        this.snapshotService = new options.SnapshotService({
            snapshotDao: new options.SnapshotDao(),
            notificationService: this.notificationService,
            util: {
                depthOfTree,
                identicalTrees,
                compareTrees,
                countNode,
                isDaysOld
            }
        })
        this.queueService = new options.QueueService({
            name: process.env.NAME,
            chromeDriver: options.ChromeDriver,
            util: {
                extractHostname
            },
            snapshotService: this.snapshotService
        })
    }

    initialize() {
        this.router.get('/snapshots/', (req, res) => this.getSnapshots(req, res))
        this.router.post('/snapshots/', (req, res) => this.createSnapshot(req, res))
        this.router.post('/webhooks/', (req, res) => this.webhooks(req, res))
        this.router.get('/comparison/', (req, res) => this.comparison(req, res))
    }

    async getSnapshots(req, res) {
        try {
            const query = req.query
            const snapshots = await this.snapshotService.snapshots(query)
            res.send({
                msg: 'successfully retrieved all snapshots',
                snapshots
            })
        } catch (err) {
            throw err
        }
    }

    async createSnapshot(req, res) {
        try {
            const {
                url
            } = req.body
            await this.queueService.add(uuid(), {
                url
            })
            res.send({
                status: 200,
                msg: `successfully added ${url} to snapshot queue`
            })
        } catch (err) {
            throw err
        }
    }

    async webhooks(req, res) {
        try {
            const {
                challenge,
                command,
                event,
                text
            } = req.body
            if (!isEmpty(challenge)) res.send(challenge)
            if (!isEmpty(command) && command === '/parallel') {
                const urls = this.snapshotService.extractUrls(text)
                await this.queueService.addBulk(urls, uuid)
            }
            if (!isEmpty(event) && !isEmpty(event.text)) {
                const urls = this.snapshotService.extractUrls(event.text)
                await this.queueService.addBulk(urls, uuid)
            }
            res.send({
                msg: 'successfully received data'
            })
        } catch (err) {
            throw err
        }
    }

    async comparison(req, res) {
        try {
            const { domain, otherDomain } = req.query
            const context = await this.snapshotService.retrieveComparison({ domain, otherDomain })
            res.send(context)
        } catch (err) {
            throw err
        }
    }

}

module.exports = Snapshot
const uuid = require('uuid/v1');

const {
    depthOfTree,
    identicalTrees,
    compareTrees,
    getDocument,
    inOrderTraversal,
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
                extractHostname,
            }
        })
        this.queueService = new options.QueueService({
            name: process.env.NAME,
            chromeDriver: options.ChromeDriver,
            util: {
                getDocument,
                inOrderTraversal,
                extractHostname,
                isDaysOld
            },
            snapshotService: this.snapshotService
        })
    }

    initialize() {
        this.router.get('/snapshots/', (req, res) => this.getSnapshots(req, res))
        this.router.post('/snapshots/', (req, res) => this.createSnapshot(req, res))
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
            const id = uuid()
            await this.queueService.add(id, {
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
}

module.exports = Snapshot
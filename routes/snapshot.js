const uuid = require('uuid/v1');

const {
    depthOfTree,
    identicalTrees,
    compareTrees,
    getDocument,
    inOrderTraversal,
    extractHostname,
    isDaysOld
} = require('../util')

class Snapshot {
    constructor(options = {}) {
        this.options = options
        this.router = options.Router
        this.snapshotService = new options.SnapshotService({
            snapshotDao: new options.SnapshotDao(),
            resultDao: new options.ResultDao(),
            util: {
                depthOfTree,
                identicalTrees,
                compareTrees,
            }
        })
        this.queueService = new options.QueueService({
            name: process.env.NAME,
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
            const limit = req.query.limit
            const snapshots = await this.snapshotService.snapshots(limit)
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
}

module.exports = Snapshot
const uuid = require('uuid/v1');

const {
    depthOfTree,
    identicalTrees,
    compareTrees,
    getDocument,
    inOrderTraversal
} = require('../util')

class Snapshot {
    constructor(options = {}) {
        this.options = options
        this.router = options.Router
        this.queueService = new options.QueueService({
            name: process.env.NAME,
            util: {
                depthOfTree,
                identicalTrees,
                compareTrees,
                getDocument,
                inOrderTraversal
            }
        })
        this.snapshotService = new options.SnapshotService({
            snapshotDao: new options.SnapshotDao()
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
            await this.queueService.add(uuid(), { url })
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
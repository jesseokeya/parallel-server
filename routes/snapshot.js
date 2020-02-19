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
            resultDao: new options.ResultDao(),
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
        this.router.get('/results/', (req, res) => this.getResults(req, res))
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

    async getResults(req, res) {
        try {
            const results = await this.snapshotService.results(req.query)
            res.send({
                msg: 'successfully retrieved all results',
                results
            })
        } catch (err) {
            throw err
        }
    }

    async createSnapshot(req, res) {
        try {
            const {
                url,
                snapshot
            } = req.body
            const selenium = req.query.selenium
            const id = uuid()
            if (selenium && selenium === 'true') {
                const newSnapshot = await this.snapshotService.create({
                    ...req.body,
                    snapshot: JSON.stringify(snapshot)
                })
                await this.queueService.add(id, {
                    url,
                    selenium: true,
                    snapshotId: newSnapshot._id
                })
                return res.send({
                    status: 200,
                    msg: `successfully added ${url} to snapshot queue`
                })
            }
            await this.queueService.add(id, {
                url,
                selenium: false
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
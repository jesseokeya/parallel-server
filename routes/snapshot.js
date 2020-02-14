const {
    depthOfTree,
    identicalTrees
} = require('../util')

class Snapshot {
    constructor(options = {}) {
        this.options = options
        this.router = options.Router
        this.queueService = new options.QueueService({
            name: 'Parallel',
            util: {
                depthOfTree,
                identicalTrees
            }
        })
        this.queueService.registerWorker()
        this.queueService.registerQueueEvents()
    }

    initialize() {
        this.router.get('/snapshots/', (req, res) => this.getSnapshots(req, res))
        this.router.post('/snapshots/', (req, res) => this.createSnapshot(req, res))
    }

    getSnapshots(req, res) {
        try {
            console.log(req.body)
            res.send({
                msg: 'snapshots!'
            })
        } catch (err) {
            throw err
        }
    }

    async createSnapshot(req, res) {
        try {
            const {
                url,
                page_title,
                snapshot,
                current_url,
                browser,
                priority
            } = req.body
            const context = {
                page_title,
                snapshot,
                current_url,
                browser,
                priority
            }
            await this.queueService.addJob(url, context)
            res.send({
                status: 200,
                msg: `successfully added ${url} to job queue`
            })
        } catch (err) {
            throw err
        }
    }
}

module.exports = Snapshot
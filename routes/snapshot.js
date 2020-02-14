const { depthOfTree, identicalTrees } = require('../util')

class Snapshot {
    constructor(options = {}) {
        this.options = options
        this.router = options.Router
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

    createSnapshot(req, res) {
        try {
            const ctx = req.body.snapshot
            console.log(depthOfTree(ctx))
            console.log(identicalTrees(ctx, ctx))
            res.send({
                msg: 'snapshots!'
            })
        } catch (err) {
            throw err
        }
    }
}

module.exports = Snapshot
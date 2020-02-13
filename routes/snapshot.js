class Snapshot {
    constructor(options = {}) {
        this.options = options
        this.router = options.Router
    }

    initialize() {
        this.router.get('/snapshots/', (req, res) => this.getSnapshots(req, res))
    }

    getSnapshots(req, res) {
        try {
            res.send({
                msg: 'snapshots!'
            })
        } catch (err) {
            throw err
        }
    }
}

module.exports = Snapshot
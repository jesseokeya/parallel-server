class Notification {
    constructor(options = {}) {
        this.options = options
        this.router = options.Router
    }

    initialize() {
        this.router.get('/notifications/', (req, res) => this.getSnapshots(req, res))
    }

    getSnapshots(req, res) {
        try {
            res.send({
                msg: 'notifications!'
            })
        } catch (err) {
            throw err
        }
    }
}

module.exports = Notification
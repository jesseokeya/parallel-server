class SnapshotService {
    constructor(options = {}) {
        this.options = options
        this.snapshotDao = options.snapshotDao
        this.util = options.util
    }

    async comparison(context) {
        try {
            console.log(context)
        } catch (err) {
            throw err
        }
    }
}

module.exports = SnapshotService
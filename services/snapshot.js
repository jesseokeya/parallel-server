class SnapshotService {
    constructor(options = {}) {
        this.options = options
        this.snapshotDao = options.snapshotDao 
    }
}

module.exports = SnapshotService
class SnapshotService {
    constructor(options = {}) {
        this.options = options
        this.snapshotDao = options.snapshotDao
        this.resultDao = options.resultDao
        this.util = options.util
    }

    async comparison(context) {
        try {
            const { snapshot } = context
            const depth = this.util.depthOfTree(snapshot)
            const isIdentical = this.util.identicalTrees(snapshot, snapshot)
            const similarityScore = this.util.compareTrees(snapshot, snapshot)
            // const snapshots = await this.resultDao.getAll()
            // const newSnapshot = await this.snapshotDao.create({
            //     ...context,
            //     snapshot: JSON.stringify(snapshot)
            // })
            console.log({ depth, isIdentical, similarityScore })
        } catch (err) {
            throw err
        }
    }
}

module.exports = SnapshotService
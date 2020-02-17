const {
    isEmpty
} = require('lodash')

class SnapshotService {
    constructor(options = {}) {
        this.options = options
        this.snapshotDao = options.snapshotDao
        this.resultDao = options.resultDao
        this.util = options.util
    }

    async comparison(context) {
        try {
            const {
                snapshot,
                domain
            } = context
            const depth = this.util.depthOfTree(snapshot)
            let existingSnapshot = await this.snapshotDao.get({
                domain
            })
            if (isEmpty(existingSnapshot)) {
                existingSnapshot = await this.snapshotDao.create({
                    ...context,
                    snapshot: JSON.stringify(snapshot)
                })
            }
            const allSnapshots = await this.snapshotDao.getAll()
            allSnapshots.forEach(async ctx => {
                const {
                    _id,
                    updatedAt
                } = ctx
                const result = this.resultDao.get({
                    domain,
                    comparison: _id
                })
                if (isEmpty(result) || this.util.isDaysOld(updatedAt, 5)) {
                    const ctxSnapshot = JSON.parse(ctx.snapshot)
                    const depth = this.util.depthOfTree(snapshot)
                    const identical = this.util.identicalTrees(snapshot, ctxSnapshot)
                    const similarityScore = this.util.compareTrees(snapshot, ctxSnapshot)
                    if (isEmpty(result)) {
                        await this.resultDao.create({
                            domain,
                            comparison: existingSnapshot._id,
                            depth,
                            similarityScore,
                            identical
                        })
                        await this.resultDao.create({
                            domain,
                            comparison: _id,
                            depth,
                            similarityScore,
                            identical
                        })
                    } else {
                        const fields = {
                            depth,
                            similarityScore,
                            identical
                        }
                        await this.resultDao.create({
                            domain,
                            comparison: _id
                        }, fields)
                        await this.resultDao.create({
                            domain,
                            comparison: existingSnapshot._id
                        }, fields)
                    }
                }
            })
        } catch (err) {
            throw err
        }
    }
}

module.exports = SnapshotService
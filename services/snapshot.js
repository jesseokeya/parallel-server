const {
    isEmpty,
    pick,
    isNumber
} = require('lodash')

class SnapshotService {
    constructor(options = {}) {
        this.options = options
        this.snapshotDao = options.snapshotDao
        this.notificationService = options.notificationService
        this.util = options.util;
        this.chromeDriver = options.chromeDriver
    }

    async snapshots({
        limit,
        ignoreSnaphots
    }) {
        try {
            let snapshots = await this.snapshotDao.getAll(),
                num = Number(limit)
            if (limit && isNumber(num)) {
                snapshots = snapshots.slice(0, num)
            }
            if (ignoreSnaphots && ignoreSnaphots === 'true') {
                return snapshots.map(snapshot => pick(snapshot, ['domain', 'url', 'title', 'createdAt', 'updatedAt']))
            }
            return snapshots
        } catch (err) {
            throw err
        }
    }

    async get(ctx) {
        try {
            return this.snapshotDao.get(ctx)
        } catch (err) {
            throw err
        }
    }

    async comparison(context) {
        try {
            const {
                snapshot,
                domain,
                url
            } = context
            const depth = this.util.depthOfTree(snapshot)
            let existingSnapshot = await this.snapshotDao.get({
                domain
            })
            if (isEmpty(existingSnapshot)) {
                existingSnapshot = await this.snapshotDao.create({
                    ...context,
                    snapshot: JSON.stringify(snapshot),
                    depth
                })
            }
            const allSnapshots = await this.snapshotDao.getAll()
            allSnapshots.forEach(async ctx => {
                if (depth > 5 && domain !== ctx.domain && this.util.isDaysOld(ctx.updatedAt, 5)) {
                    const ctxSnapshot = JSON.parse(ctx.snapshot)
                    const identical = this.util.identicalTrees(snapshot, ctxSnapshot)
                    const countFirstNode = this.util.countNode(snapshot),
                        countSecondNode = this.util.countNode(ctxSnapshot)
                    const similarityScore = countFirstNode > countSecondNode ? this.util.compareTrees(snapshot, ctxSnapshot, identical) : this.util.compareTrees(ctxSnapshot, snapshot, identical)
                    console.log({
                        url,
                        domain,
                        otherDomain: ctx.domain,
                        otherDepth: ctx.depth,
                        identical,
                        similarityScore,
                        depth,

                    })
                    if (similarityScore >= 80) {
                        const context = {
                            url,
                            domain,
                            otherDomain: ctx.domain,
                            otherDepth: ctx.depth,
                            similarityScore,
                            depth,

                        }
                        await this.notificationService.slackNotify(context)
                    }
                }
            })
        } catch (err) {
            console.log(err.stack)
            throw err
        }
    }
}

module.exports = SnapshotService
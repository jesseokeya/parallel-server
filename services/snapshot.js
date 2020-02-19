const psl = require('psl');
const {
    isEmpty,
    pick,
    isNumber
} = require('lodash')

class SnapshotService {
    constructor(options = {}) {
        this.options = options
        this.snapshotDao = options.snapshotDao
        this.resultDao = options.resultDao
        this.notificationService = options.notificationService,
            this.util = options.util
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

    async results({ greaterThan }) {
        try {
            let results = await this.resultDao.getAll()
            results = results.map(async result => {
                const comparison = await this.snapshotDao.get({
                    _id: result.comparison
                })
                const {
                    title,
                    url
                } = await this.snapshotDao.get({
                    domain: result.domain
                }) 
                return {
                    ...result.toJSON(),
                    comparison: pick(comparison, ['domain', 'url', 'title', 'createdAt', 'updatedAt', 'browser']),
                    title,
                    url
                }
            })
            let context = await Promise.all(results)
            context = context.filter(val => val.domain !== val.comparison.domain)
            if (!isEmpty(greaterThan) && Number.isInteger(Number(greaterThan))) {
                return context.filter(val => val.similarityScore > greaterThan)
            }
            return context
        } catch (err) {

        }
    }

    async get(ctx) {
        try {
            return this.snapshotDao.get(ctx)
        } catch (err) {
            throw err
        }
    }

    async create({
        snapshot,
        url,
        page_title,
        browser
    }) {
        try {
            const domain = psl.get(this.util.extractHostname(url))
            const ctx = {
                domain,
                url,
                browser,
                snapshot,
                title: page_title
            }
            return this.snapshotDao.create(ctx)
        } catch (err) {
            throw err
        }
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
                    updatedAt,
                } = ctx
                const result = this.resultDao.get({
                    domain,
                    comparison: _id
                })
                if (depth > 5 && domain !== ctx.domain && (isEmpty(result) || this.util.isDaysOld(updatedAt, 5))) {
                    const ctxSnapshot = JSON.parse(ctx.snapshot)
                    const identical = this.util.identicalTrees(snapshot, ctxSnapshot)
                    const countFirstNode = this.util.countNode(snapshot),
                        countSecondNode = this.util.countNode(ctxSnapshot)
                    const similarityScore = countFirstNode > countSecondNode ? this.util.compareTrees(snapshot, ctxSnapshot, identical) : this.util.compareTrees(ctxSnapshot, snapshot, identical)
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
                    if (similarityScore >= 80) {
                        const context = {
                            domain,
                            otherDomain: ctx.domain,
                            similarityScore,
                            depth
                        }
                        await this.notificationService.slack(context)
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
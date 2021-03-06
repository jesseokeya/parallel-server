const {
    isEmpty,
    pick,
    isNumber
} = require('lodash')
const AWS = require('aws-sdk');

class SnapshotService {
    constructor(options = {}) {
        this.options = options
        this.snapshotDao = options.snapshotDao
        this.notificationService = options.notificationService
        this.util = options.util;
        this.chromeDriver = options.chromeDriver
        this.s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        })
    }

    async snapshots({
        limit,
        ignoreSnapshots
    }) {
        try {
            let snapshots = await this.snapshotDao.getAll(),
                num = Number(limit)
            if (limit && isNumber(num)) {
                snapshots = snapshots.slice(0, num)
            }
            if (ignoreSnapshots && ignoreSnapshots === 'true') {
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
                url,
                screenshot
            } = context
            const depth = this.util.depthOfTree(snapshot)
            let existingSnapshot = await this.snapshotDao.get({
                domain
            })
            if (isEmpty(existingSnapshot)) {
                const ctx = await this.uploadImageToAWS(screenshot, domain)
                existingSnapshot = await this.snapshotDao.create({
                    ...context,
                    snapshot: JSON.stringify(snapshot),
                    depth,
                    screenshot: ctx
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
                        identical,
                        domain,
                        otherDomain: ctx.domain,
                        otherDepth: ctx.depth,
                        similarityScore,
                        depth
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
            throw err
        }
    }

    async uploadImageToAWS(screenshot, domain) {
        try {
            const base64Data = Buffer.from(screenshot.replace(/^data:image\/\w+;base64,/, ""), 'base64')
            const params = {
                Bucket: process.env.S3_BUCKET,
                Key: `${domain.replace(/\./gi, '_')}.jpeg`,
                Body: base64Data,
                ACL: 'public-read',
                ContentEncoding: 'base64',
                ContentType: 'image/jpeg'
            }
            return await new Promise((resolve, reject) => {
                this.s3.upload(params, (err, data) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(data.Location)
                    }
                });
            })
        } catch (err) {
            throw err
        }
    }

    extractUrls(text) {
        try {
            const results = []
            const values = text.split(' ')
            for (let value of values) {
                value = value.replace(/[<>]/gi, '').replace(/[*]/gi, '')
                const notGitlab = !value.includes('irdeto.com')
                if (value.includes('_') && notGitlab) {
                    const context = value.replace(/_/gi, '.')
                    results.push(`http://${context}`)
                }
                if (this._validUrl(value) && notGitlab) {
                    results.push(value)
                }
            }
            return results
        } catch (err) {
            throw err
        }
    }

    async retrieveComparison({
        domain,
        otherDomain
    }) {
        try {
            if (isEmpty(domain) || isEmpty(otherDomain)) {
                return {
                    msg: 'invalid query domain or otherDomain is empty',
                    snapshots: {}
                }
            }
            return {
                msg: 'sucessfully retrieved comparison',
                snapshots: {
                    domain: await this.get({
                        domain
                    }),
                    otherDomain: await this.get({
                        domain: otherDomain
                    })
                }
            }
        } catch (err) {
            throw err
        }
    }

    _validUrl(str) {
        try {
            const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
            return !!pattern.test(str);
        } catch (err) {
            throw err
        }
    }
}

module.exports = SnapshotService
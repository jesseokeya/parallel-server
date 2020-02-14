const {
    Queue,
    QueueScheduler,
    Worker,
    QueueEvents
} = require('bullmq');
const IORedis = require('ioredis');

/**
 * @constructor QueueService - manages jobs to be scheduled in the future
 * @param {Object} options - options used to configure the queueService
 * @example
 * const options = {}
 * const queueService = new QueueService(options)
 */
class QueueService {
    constructor(options = {}) {
        this.options = options
        this.name = options.name
        this.util = options.util
        this.connection = new IORedis();
        this.queue = new Queue(options.name, {
            connection: this.connection
        });
        this.queue.waitUntilReady()
        this.registerScheduler()
        this.registerWorker()
        this.registerEvents()
    }

    /**
     * Adds new job to the queue to be processed
     * @param {string} name - name of the new job usually the domain of the site
     * @typedef Snapshot
     * @type {Object}
     * @property {string} snapshot - snapshot of the dom
     * @property {string} current_url - cuurent page url from selenium
     * @property {string} page_title - extracted page title
     * @property {string} browser - browser type
     * @property {number} priority - Priority of the new job in the queue defaults to 10
     * @return {Promise<Queue>}
     * @example
     * const context = { snapshot, url, current_url, page_title, browser, priority }
     * const newJob = queueService.add('https://google.com', context)
     */
    async add(name, context) {
        try {
            const timings = [1000, 20000, 60000]
            return this.queue.add(name, context, {
                priority: context.priority || 10,
                delay: timings[Math.floor(Math.random() * timings.length)]
            });
        } catch (err) {
            throw err
        }
    }

    /**
     * @constructor QueueService - manages jobs to be scheduled in the future
     * @param {Snapshot} job - job data to be processed
     * @returns {Promise<Object>} response for resolved bob
     * @example
     * const job = { snapshot, url, current_url, page_title, browser, priority }
     * const process = queueService.process(job)
     */
    async process(job) {
        try {
            const jobs = await this.completedJobs()
            if (jobs.length > 1) {
                const start = new Date()
                const hrstart = process.hrtime()
                const {
                    current_url,
                    snapshot
                } = job.data
                const ctx = JSON.parse(jobs[1].data)
                console.log(current_url, ctx.current_url)

                const depth = this.util.depthOfTree(snapshot)
                const isIdentical = this.util.identicalTrees(ctx.snapshot, snapshot)
                const similarityScore = compareTrees(snapshot, ctx.snapshot)

                const end = new Date() - start,
                    hrend = process.hrtime(hrstart)

                console.info('Execution time: %dms', end)
                console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
                return JSON.stringify({
                    depth,
                    isIdentical,
                    similarityScore
                })
            } else {
                const start = new Date()
                const hrstart = process.hrtime()
                const {
                    snapshot
                } = job.data
                const depth = this.util.depthOfTree(snapshot)
                const isIdentical = this.util.identicalTrees(snapshot, snapshot)
                const similarityScore = compareTrees(snapshot, snapshot)
                const end = new Date() - start,
                    hrend = process.hrtime(hrstart)
                console.info('Execution time: %dms', end)
                console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
                return JSON.stringify({
                    depth,
                    isIdentical,
                    similarityScore
                })
            }
        } catch (err) {
            throw err
        }
    }

    /**
     * @constructor QueueService - manages jobs to be scheduled in the future
     * @param {Snapshot} job - job data to be processed
     * @returns {Promise<Object>} response for resolved bob
     * @example
     * const job = { snapshot, url, current_url, page_title, browser, priority }
     * const process = queueService.process(job)
     */
    async registerWorker() {
        try {
            return new Worker(this.name, async job => await this.process(job))
        } catch (err) {
            throw err
        }
    }

    /**
     * @constructor QueueService - manages jobs to be scheduled in the future
     * @param {Snapshot} job - job data to be processed
     * @returns {Promise<Object>} response for resolved bob
     * @example
     * const job = { snapshot, url, current_url, page_title, browser, priority }
     * const process = queueService.process(job)
     */
    async pause() {
        try {
            return this.queue.pause().then(context => context)
        } catch (err) {
            throw err
        }
    }

    /**
     * @constructor QueueService - manages jobs to be scheduled in the future
     * @param {Snapshot} job - job data to be processed
     * @returns {Promise<Object>} response for resolved bob
     * @example
     * const job = { snapshot, url, current_url, page_title, browser, priority }
     * const process = queueService.process(job)
     */
    async resume() {
        try {
            return this.queue.resume().then(context => context)
        } catch (err) {
            throw err
        }
    }

    /**
     * @constructor QueueService - manages jobs to be scheduled in the future
     * @param {Snapshot} job - job data to be processed
     * @returns {Promise<Object>} response for resolved bob
     * @example
     * const job = { snapshot, url, current_url, page_title, browser, priority }
     * const process = queueService.process(job)
     */
    async activeJob() {
        try {
            return this.queue.getActive().then(context => context)
        } catch (err) {
            throw err
        }
    }

    /**
     * @constructor QueueService - manages jobs to be scheduled in the future
     * @param {Snapshot} job - job data to be processed
     * @returns {Promise<Object>} response for resolved bob
     * @example
     * const job = { snapshot, url, current_url, page_title, browser, priority }
     * const process = queueService.process(job)
     */
    async empty() {
        try {
            return this.connection.flushall().then(context => context)
        } catch (err) {
            throw err
        }
    }

    /**
     * @constructor QueueService - manages jobs to be scheduled in the future
     * @param {Snapshot} job - job data to be processed
     * @returns {Promise<Object>} response for resolved bob
     * @example
     * const job = { snapshot, url, current_url, page_title, browser, priority }
     * const process = queueService.process(job)
     */
    async keys() {
        try {
            return this.connection.keys('*').then(context => context)
        } catch (err) {
            throw err
        }
    }

    /**
     * @constructor QueueService - manages jobs to be scheduled in the future
     * @param {Snapshot} job - job data to be processed
     * @returns {Promise<Object>} response for resolved bob
     * @example
     * const job = { snapshot, url, current_url, page_title, browser, priority }
     * const process = queueService.process(job)
     */
    completedCount() {
        try {
            return this.queue.getCompletedCount().then(context => context)
        } catch (err) {
            throw err
        }
    }

    /**
     * @constructor QueueService - manages jobs to be scheduled in the future
     * @param {Snapshot} job - job data to be processed
     * @returns {Promise<Object>} response for resolved bob
     * @example
     * const job = { snapshot, url, current_url, page_title, browser, priority }
     * const process = queueService.process(job)
     */
    failedCount() {
        try {
            return this.queue.getFailedCount().then(context => context)
        } catch (err) {
            throw err
        }
    }

    /**
     * @constructor QueueService - manages jobs to be scheduled in the future
     * @param {Snapshot} job - job data to be processed
     * @returns {Promise<Object>} response for resolved bob
     * @example
     * const job = { snapshot, url, current_url, page_title, browser, priority }
     * const process = queueService.process(job)
     */
    delayedCount() {
        try {
            return this.queue.getDelayedCount().then(context => context)
        } catch (err) {
            throw err
        }
    }

    /**
     * @constructor QueueService - manages jobs to be scheduled in the future
     * @param {Snapshot} job - job data to be processed
     * @returns {Promise<Object>} response for resolved bob
     * @example
     * const job = { snapshot, url, current_url, page_title, browser, priority }
     * const process = queueService.process(job)
     */
    activeCount() {
        try {
            return this.queue.getActiveCount().then(context => context)
        } catch (err) {
            throw err
        }
    }

    /**
     * @constructor QueueService - manages jobs to be scheduled in the future
     * @param {Snapshot} job - job data to be processed
     * @returns {Promise<Object>} response for resolved bob
     * @example
     * const job = { snapshot, url, current_url, page_title, browser, priority }
     * const process = queueService.process(job)
     */
    async job(id) {
        try {
            return this.connection.hgetall(id).then(context => context)
        } catch (err) {
            throw err
        }
    }

    /**
     * @constructor QueueService - manages jobs to be scheduled in the future
     * @param {Snapshot} job - job data to be processed
     * @returns {Promise<Object>} response for resolved bob
     * @example
     * const job = { snapshot, url, current_url, page_title, browser, priority }
     * const process = queueService.process(job)
     */
    async completedJobs() {
        try {
            const results = []
            const length = await this.completedCount()
            for (let i = 1; i <= length; i++) {
                results.push(this.job(`bull:Parallel:${i}`))
            }
            return Promise.all(results)
        } catch (err) {
            throw err
        }
    }

    /**
     * @constructor QueueService - manages jobs to be scheduled in the future
     * @param {Snapshot} job - job data to be processed
     * @returns {Promise<Object>} response for resolved bob
     * @example
     * const job = { snapshot, url, current_url, page_title, browser, priority }
     * const process = queueService.process(job)
     */
    getWaitingCount() {
        try {

        } catch (err) {
            throw err
        }
    }

    /**
     * @constructor QueueService - manages jobs to be scheduled in the future
     * @param {Snapshot} job - job data to be processed
     * @returns {Promise<Object>} response for resolved bob
     * @example
     * const job = { snapshot, url, current_url, page_title, browser, priority }
     * const process = queueService.process(job)
     */
    async registerEvents() {
        try {
            const queueEvents = new QueueEvents(this.name)
            await queueEvents.waitUntilReady();

            queueEvents.on('waiting', ctx => this._handleEvents('waiting', ctx));
            queueEvents.on('active', ctx => this._handleEvents('active', ctx));
            queueEvents.on('completed', ctx => this._handleEvents('completed', ctx));
            queueEvents.on('failed', ctx => this._handleEvents('failed', ctx));
            queueEvents.on('progress', (ctx, timestamp) => this._handleEvents('failed', {
                ...ctx,
                timestamp
            }))
        } catch (err) {
            throw err
        }
    }

    async registerScheduler() {
        try {
            const queueScheduler = new QueueScheduler(this.name);
            await queueScheduler.waitUntilReady();
            return queueScheduler
        } catch (err) {
            throw err
        }
    }

    /**
     * @constructor QueueService - manages jobs to be scheduled in the future
     * @param {Snapshot} job - job data to be processed
     * @returns {Promise<Object>} response for resolved bob
     * @example
     * const job = { snapshot, url, current_url, page_title, browser, priority }
     * const process = queueService.process(job)
     */
    _handleEvents(type, ctx) {
        try {
            switch (type) {
                case 'waiting':
                    console.log(`A job with ID ${ctx.jobId} is waiting`);
                    break
                case 'active':
                    console.log(`Job ${ctx.jobId} is now active; previous status was ${ctx.prev}`);
                    break
                case 'completed':
                    console.log(ctx)
                    console.log(`${ctx.jobId} has completed and returned ${ctx.returnvalue}`);
                    break
                case 'failed':
                    console.log(`${ctx.jobId} has failed with reason ${ctx.failedReason}`);
                    break
                case 'progess':
                    console.log(`${ctx.jobId} reported progress ${ctx.data} at ${ctx.timestamp}`);
                    break
                default:
                    console.log(`${type} -> ${ctx}`)
            }
        } catch (err) {
            throw err
        }
    }
}

module.exports = QueueService
const {
    Queue,
    Worker,
    QueueEvents
} = require('bullmq');
const IORedis = require('ioredis');

class QueueService {
    constructor(options = {}) {
        this.options = options
        this.name = options.name
        this.connection = new IORedis();
        this.queue = new Queue(options.name, {
            connection: this.connection
        });
        this.util = options.util
        this.getJob('bull:Parallel:completed').then(res => console.log(res))
    }

    async addJob(name, context) {
        try {
            return this.queue.add(name, context, {
                priority: context.priority || 10
            });
        } catch (err) {
            throw err
        }
    }

    async processJobs(job) {
        try {
            const {
                snapshot
            } = job.data
            return JSON.stringify({
                depth: this.util.depthOfTree(snapshot),
                isIdentical: this.util.identicalTrees(snapshot, snapshot)
            })
        } catch (err) {

        }
    }

    async registerWorker() {
        try {
            this.worker = new Worker(this.name, async job => await this.processJobs(job))
            return this.getWorker()
        } catch (err) {
            throw err
        }
    }

    async getWorker() {
        try {
            return this.worker
        } catch (err) {
            throw err
        }
    }

    async getRedisConnection() {
        try {
            return this.connection
        } catch (err) {
            throw err
        }
    }

    async getQueue() {
        try {
            return this.queue
        } catch (err) {
            throw err
        }
    }

    async registerQueueEvents() {
        try {
            const queueEvents = new QueueEvents(this.name);
            queueEvents.on('waiting', ({
                jobId
            }) => {
                console.log(`A job with ID ${jobId} is waiting`);
            });

            queueEvents.on('active', ({
                jobId,
                prev
            }) => {
                console.log(`Job ${jobId} is now active; previous status was ${prev}`);
            });

            queueEvents.on('completed', ({
                jobId,
                returnvalue
            }) => {
                console.log(`${jobId} has completed and returned ${returnvalue}`);
            });

            queueEvents.on('failed', ({
                jobId,
                failedReason
            }) => {
                console.log(`${jobId} has failed with reason ${failedReason}`);
            });

            queueEvents.on('progress', ({
                jobId,
                data
            }, timestamp) => {
                console.log(`${jobId} reported progress ${data} at ${timestamp}`);
            });
        } catch (err) {
            throw err
        }
    }

    async getJobKeys() {
        try {
            return this.connection.keys('*').then(keys => keys)
        } catch (err) {
            throw err
        }
    }

    async getJob(key) {
        try {
            return this.connection.get(key).then(context => context)
        } catch (err) {
            throw err
        }
    }
}

module.exports = QueueService
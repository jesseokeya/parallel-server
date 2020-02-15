const mongoose = require('mongoose')

/**
 * @constructor SnapshotDao
 * Connects to the database and performs CRUD (create, read, upodate, delete)
 * operations on the snapshot model
 */
class SnapshotDao {
    constructor(options = {}) {
        this.options = options;
        this.snapshot = mongoose.model('Snapshot');
    }

    /**
     * Creates a snapshot
     * @param {Object} - ctx
     * @returns {Promise<Object>} - returns a snapshot object
     * @throws {Error} if exception occurs at runtime
     */
    async create(ctx) {
        try {
            const snapshot = new this.snapshot(ctx);
            return snapshot.save();
        } catch (err) {
            throw err;
        }
    }

    /**
     * Deletes a snapshot
     * @param {snapshotId} - id of snapshot to be deleted
     * @returns {Promise<Object>} - returns a snapshot object
     * @throws {Error} if exception occurs at runtime
     */
    async delete(snapshotId) {
        try {
            if (isEmpty(snapshotId)) {
                throw new Error('snapshot id is required to delete a snapshot');
            }
            return this.snapshot.findByIdAndDelete({
                _id: snapshotId
            });
        } catch (err) {
            throw err;
        }
    }

    /**
     * Get a particular snapshot by snapshot id
     * @param {string | Object} - ctx
     * @returns {Promise<Object>} - returns a snapshot object
     * @throws {Error} if exception occurs at runtime
     */
    async get(ctx) {
        try {
            if (isEmpty(ctx)) {
                throw new Error('object parameter is required to retrieve a particular snapshot');
            }
            if (typeof ctx === 'object') {
                return this.snapshot.findOne(ctx);
            }
            return this.snapshot.findOne({
                _id: ctx
            });
        } catch (err) {
            throw err;
        }
    }

    /**
     * Get all snapshots
     * @param {string | Object} - ctx
     * @returns {Promise<Array<Object>>} - returns an array snapshot objects
     * @throws {Error} if exception occurs at runtime
     */
    async getAll() {
        try {
            return await this.snapshot.find();
        } catch (err) {
            throw err;
        }
    }

    /**
     * Update snapshot by certain criterias
     * @param {string | Object} - ctx
     * @returns {Promise<Object>} - returns updated snapshot
     * @throws {Error} if exception occurs at runtime
     */
    async update(ctx) {
        try {
            if (isEmpty(ctx.id)) {
                throw new Error('snapshot id is required to update a particular snapshot');
            }
            return await this.snapshot.findByIdAndUpdate({
                _id: ctx.id
            }, ctx, {
                new: true
            });
        } catch (err) {
            throw err;
        }
    }
}

module.exports = SnapshotDao
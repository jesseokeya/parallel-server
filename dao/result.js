const mongoose = require('mongoose')
const { isEmpty } = require('lodash')

/**
 * @constructor ResultDao
 * Connects to the database and performs CRUD (create, read, upodate, delete)
 * operations on the result model
 */
class ResultDao {
    constructor(options = {}) {
        this.options = options;
        this.result = mongoose.model('Result');
    }

    /**
     * Creates a result
     * @param {Object} - ctx
     * @returns {Promise<Object>} - returns a result object
     * @throws {Error} if exception occurs at runtime
     */
    async create(ctx) {
        try {
            const result = new this.result(ctx);
            return result.save();
        } catch (err) {
            throw err;
        }
    }

    /**
     * Deletes a result
     * @param {resultId} - id of result to be deleted
     * @returns {Promise<Object>} - returns a result object
     * @throws {Error} if exception occurs at runtime
     */
    async delete(resultId) {
        try {
            if (isEmpty(resultId)) {
                throw new Error('result id is required to delete a result');
            }
            return this.result.findByIdAndDelete({
                _id: resultId
            });
        } catch (err) {
            throw err;
        }
    }

    /**
     * Get a particular result by result id
     * @param {string | Object} - ctx
     * @returns {Promise<Object>} - returns a result object
     * @throws {Error} if exception occurs at runtime
     */
    async get(ctx) {
        try {
            if (isEmpty(ctx)) {
                throw new Error('object parameter is required to retrieve a particular result');
            }
            if (typeof ctx === 'object') {
                return this.result.findOne(ctx);
            }
            return this.result.findOne({
                _id: ctx
            });
        } catch (err) {
            throw err;
        }
    }

    /**
     * Get all results
     * @param {string | Object} - ctx
     * @returns {Promise<Array<Object>>} - returns an array result objects
     * @throws {Error} if exception occurs at runtime
     */
    async getAll() {
        try {
            return await this.result.find();
        } catch (err) {
            throw err;
        }
    }

    /**
     * Update result by certain criterias
     * @param {string | Object} - ctx
     * @returns {Promise<Object>} - returns updated result
     * @throws {Error} if exception occurs at runtime
     */
    async update(query, ctx) {
        try {
            if (isEmpty(ctx.id)) {
                throw new Error('result id is required to update a particular result');
            }
            return await this.result.findOneAndUpdate(query, ctx, {
                new: true
            });
        } catch (err) {
            throw err;
        }
    }
}

module.exports = ResultDao
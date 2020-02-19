const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ResultSchema = new Schema({
    domain: {
        type: String,
        required: true,
    },
    depth: {
        type: Number,
        required: true
    },
    identical: {
        type: Boolean,
        required: true
    },
    similarityScore: {
        type: Number,
        required: true
    },
    /* comparsion points to the unique _id of the other site that was compared */
    comparison: Schema.Types.ObjectId,
}, {
    timestamps: true
})

module.exports = mongoose.model("Result", ResultSchema)
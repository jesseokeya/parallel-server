const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ResultSchema = new Schema({
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
    association: Schema.Types.ObjectId,
}, {
    timestamps: true
})

module.exports = mongoose.model("Result", ResultSchema)
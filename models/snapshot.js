const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SnapshotSchema = new Schema({
    domain: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    snapshot: {
        type: String,
        required: true
    },
    browser: {
        type: String,
        required: true
    },
    title: String,
}, {
    timestamps: true
})

module.exports = mongoose.model("Snapshot", SnapshotSchema)
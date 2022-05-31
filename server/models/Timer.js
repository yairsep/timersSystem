let mongoose = require('mongoose');
const autoIncrement = require("mongoose-auto-increment");

const TimerSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    url: {
        type: String,
        required: true
    },
    fired: {
        type: Boolean,
        required: true,
        default: false
    },
    triggered: {
        type: Boolean,
        required: true,
        default: false
    }
});

TimerSchema.plugin(autoIncrement.plugin , 'timer')
let Timer = mongoose.model('timer', TimerSchema);

module.exports = Timer
const mongoose = require("mongoose");
var schema = mongoose.Schema;

const citySchema = new schema({
    request_id: {
        type: String,
        unique : true,
        required: true
    },
    city_id: {
        type: String,
        required: true
    },
    sensor_id: {
        type: String,
        required: true
    },
    event_time: {
        type: Date,
        default: Date.now
    },
    event_type: {
        type: String,
        required: true
    },
    event_value_in_mm: {
        type: Number,
        required: true
    }
});

module.exports = log = mongoose.model("log", citySchema);

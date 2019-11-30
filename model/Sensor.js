const mongoose = require("mongoose");
var schema = mongoose.Schema;

const sensorSchema = new schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'ACTIVE'
    }
});

module.exports = sensor = mongoose.model("sensor", sensorSchema);

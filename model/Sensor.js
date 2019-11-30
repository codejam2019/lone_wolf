const mongoose = require("mongoose");
var schema = mongoose.Schema;

const sensorSchema = new schema({
    name: {
        type: String,
        //unique : true,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'PAUSED'
    }
});

module.exports = sensor = mongoose.model("sensor", sensorSchema);

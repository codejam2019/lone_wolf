const mongoose = require("mongoose");
var schema = mongoose.Schema;

const citySchema = new schema({
  name: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  assigned_sensors:[{
      sensors_id: {
        type: String,
        required: true
      },
      sensor_name :{
        type: String,
        required: true
      }
  }]
});

module.exports = city = mongoose.model("city", citySchema);

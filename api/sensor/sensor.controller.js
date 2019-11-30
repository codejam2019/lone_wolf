const Sensor = require("../../model/Sensor");

sensorControllers = {}

sensorControllers.getSensorDetails = function (req, res) {
    sensor.find().then(function (data) {
        res.json(data)
    });
}

sensorControllers.addSensorDetails = function (req, res) {
    var newSensor = new Sensor(req.body);
    newSensor.save(function (err, entry) {
        if (err) {
            console.log(err);
            res.json({ msg: "Failed to add sensor Entry", success: false });
        } else {
            res.json({ msg: "sensor Entry Added SuccessFully", success: true });
        }
    });
}

module.exports = sensorControllers;
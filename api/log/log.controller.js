const Log = require("../../model/Log");
const cityController = require('../city/city.controller')
const sensorController = require('../sensor/sensor.controller')

logControllers = {}

logControllers.getLogDetails = function (req, res) {
    if (req.query.city_id && req.query.sensor_id && req.query.start_date && req.query.end_date) {
        var start = new Date(req.query.start_date.substring(0, 4), req.query.start_date.substring(4, 6) - 1, req.query.start_date.substring(6));
        var end = new Date(req.query.end_date.substring(0, 4), req.query.end_date.substring(4, 6) - 1, req.query.end_date.substring(6));
        Log.find({ city_id: req.query.city_id, sensor_id: req.query.sensor_id, event_time: { "$gte": start, "$lt": end } }).then(function (data) {
            res.json(data)
        });
    }
    else if (req.query.city_id && req.query.sensor_id) {
        Log.find({ city_id: req.query.city_id, sensor_id: req.query.sensor_id }).then(function (data) {
            res.json(data)
        });
    } else if (req.query.city_id) {
        Log.find({ city_id: req.query.city_id }).then(function (data) {
            res.json(data)
        });
    } else if (req.query.sensor_id) {
        Log.find({ sensor_id: req.query.sensor_id }).then(function (data) {
            res.json(data)
        });
    } else {
        Log.find().then(function (data) {
            res.json(data)
        });
    }
}

logControllers.addLogDetails = function (req, res) {
    var newLog = new Log({
        "request_id": req.id,
        "city_id": req.body.city_id,
        "sensor_id": req.body.sensor_id,
        "event_type": req.body.event_type,
        "event_value_in_mm": req.body.event_value_in_mm
    });
    newLog.save(function (err, entry) {
        if (err) {
            console.log(err);
            res.json({ msg: "Failed to add log Entry", success: false });
        } else {
            res.json({ msg: "log Entry Added SuccessFully", success: true });
        }
    });
}

logControllers.getTempDetails = function (req, res) {

    if (req.query.city_id && req.query.sensor_id && req.query.start_date && req.query.end_date) {
        var start = new Date(req.query.start_date.substring(0, 4), req.query.start_date.substring(4, 6) - 1, req.query.start_date.substring(6));
        var end = new Date(req.query.end_date.substring(0, 4), req.query.end_date.substring(4, 6) - 1, req.query.end_date.substring(6));
        Log.find({ event_type: "temp", city_id: req.query.city_id, sensor_id: req.query.sensor_id, event_time: { "$gte": start, "$lt": end } }).then(function (data) {
            res.json(data)
        });
    }
    else if (req.query.city_id && req.query.sensor_id) {
        Log.find({ city_id: req.query.city_id, sensor_id: req.query.sensor_id, event_type: "temp" }).then(function (data) {
            res.json(data)
        });
    } else if (req.query.city_id) {
        Log.find({ city_id: req.query.city_id, event_type: "temp" }).then(function (data) {
            res.json(data)
        });
    } else if (req.query.sensor_id) {
        Log.find({ sensor_id: req.query.sensor_id, event_type: "temp" }).then(function (data) {
            res.json(data)
        });
    } else {
        Log.find({ event_type: "temp" }).then(function (data) {
            res.json(data)
        });
    }
}

logControllers.getRainDetails = function (req, res) {
    if (req.query.city_id && req.query.sensor_id && req.query.start_date && req.query.end_date) {
        var start = new Date(req.query.start_date.substring(0, 4), req.query.start_date.substring(4, 6) - 1, req.query.start_date.substring(6));
        var end = new Date(req.query.end_date.substring(0, 4), req.query.end_date.substring(4, 6) - 1, req.query.end_date.substring(6));
        Log.find({ event_type: "rain", city_id: req.query.city_id, sensor_id: req.query.sensor_id, event_time: { "$gte": start, "$lt": end } }).then(function (data) {
            res.json(data)
        });
    }
    else if (req.query.city_id && req.query.sensor_id) {
        Log.find({ city_id: req.query.city_id, sensor_id: req.query.sensor_id, event_type: "rain" }).then(function (data) {
            res.json(data)
        });
    } else if (req.query.city_id) {
        Log.find({ city_id: req.query.city_id, event_type: "rain" }).then(function (data) {
            res.json(data)
        });
    } else if (req.query.sensor_id) {
        Log.find({ sensor_id: req.query.sensor_id, event_type: "rain" }).then(function (data) {
            res.json(data)
        });
    } else {
        Log.find({ event_type: "rain" }).then(function (data) {
            res.json(data)
        });
    }
}

module.exports = logControllers;
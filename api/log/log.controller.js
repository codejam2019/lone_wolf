const Log = require("../../model/Log");

logControllers = {}

logControllers.getLogDetails = function (req, res) {
    log.find().then(function (data) {
        res.json(data)
    });
}

logControllers.addLogDetails = function (req, res) {
    var newLog = new Log(req.body);
    newLog.save(function (err, entry) {
        if (err) {
            console.log(err);
            res.json({ msg: "Failed to add log Entry", success: false });
        } else {
            res.json({ msg: "log Entry Added SuccessFully", success: true });
        }
    });
}

module.exports = logControllers;
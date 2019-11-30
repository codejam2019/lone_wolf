const City = require("../../model/City");

cityControllers = {}

cityControllers.getCityDetails = function (req, res) {
    City.find().then(function (data) {
        res.json(data)
    });
}


cityControllers.addCityDetails = function (req, res) {
    var newCity = new City({
        name: req.body.name,
        country: req.body.country,
        assigned_sensors: req.body.assigned_sensors
    });

    newCity.save(function (err, entry) {
        if (err) {
            console.log(err);
            res.json({ msg: "Failed to add city Entry", success: false });
        } else {
            res.json({ msg: "city Entry Added SuccessFully", success: true });
        }
    });
}

module.exports = cityControllers;
const express = require("express");
const sensorRoute = express.Router();

const sensorController = require("./sensor.controller")

sensorRoute.get('/',sensorController.getSensorDetails)
sensorRoute.post("/",sensorController.addSensorDetails)


module.exports = sensorRoute;
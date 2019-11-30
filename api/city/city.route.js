const express = require("express");
const cityRoute = express.Router();

const cityController = require("./city.controller")

cityRoute.get('/',cityController.getCityDetails)


module.exports = cityRoute;
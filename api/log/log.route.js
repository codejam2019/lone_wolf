const express = require("express");
const logRoute = express.Router();

const logController = require("./log.controller")

logRoute.get('/',logController.getLogDetails)
logRoute.post("/",logController.addLogDetails)


module.exports = logRoute;
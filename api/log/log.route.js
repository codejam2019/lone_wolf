const express = require("express");
const logRoute = express.Router();

const logController = require("./log.controller")

logRoute.get('/',logController.getLogDetails)
logRoute.post("/",logController.addLogDetails)
logRoute.get('/temp',logController.getTempDetails)
logRoute.get('/rain',logController.getRainDetails)



module.exports = logRoute;
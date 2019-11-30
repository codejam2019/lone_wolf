const express = require("express");
const logRoute = express.Router();

const logController = require("./log.controller")

logRoute.get('/', logController.getLogDetails)
logRoute.post("/", logController.addLogDetails)
logRoute.get('/temp', logController.getTempDetails)
logRoute.get('/rain', logController.getRainDetails)
logRoute.get('/hottest', logController.getHottestCity)
logRoute.get('/coolest', logController.getCoolest)
logRoute.get('/wettest', logController.getCoolest)
logRoute.get('/dryest', logController.getDryest)



module.exports = logRoute;
const express = require("express");
const next = require("next");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const serverConfig = require("./config");
const dev = serverConfig.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const cookieParser = require("cookie-parser");
var compression = require("compression");
const addRequestId = require('express-request-id')();
const request = require('request')
const DateFormatter = require('./shared/DateFormater')

require('log-timestamp')(function () { return DateFormatter.getDateWithTimestamp(new Date()) + ' : %s' });

app.prepare().then(() => {
    const server = express();
    /**** middleware ****/
    server.use(cookieParser());
    server.use(addRequestId);
    server.use(compression({ filter: shouldCompress }));
    function shouldCompress(req, res) {
        if (req.headers["x-no-compression"]) {
            // don't compress responses with this request header
            return false;
        }
    }

    server.use(bodyParser.json({ limit: '50mb', extended: true }));
    server.use(express.static("static"));


    //routes
    server.use(
        "/api/city",
        require(path.resolve(__dirname, "./api/city/city.route"))
    );

    server.use(
        "/api/sensor",
        require(path.resolve(__dirname, "./api/sensor/sensor.route"))
    );

    server.use(
        "/api/log",
        require(path.resolve(__dirname, "./api/log/log.route"))
    );

    server.get("*", (req, res) => {
        res.json({ msg: "in progress" })
    });


    /*
       UI part is remaining so commenting below part that will invoke pages with nextjs react routing
    */
    // server.get("*", (req, res) => {
    //     //return handle(req, res);
    // });

    //connect mongodb and start server
    mongoose
        .connect(serverConfig.mongoURI, { useNewUrlParser: true })
        .then(res => {
            console.log("Mongodb conection is Successfull");
            server.listen(serverConfig.PORT, () => {
                console.log("Server is running at port no " + serverConfig.PORT);


            });
        })
        .catch(err => console.error(err));
});

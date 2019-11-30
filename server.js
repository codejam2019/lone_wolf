const express = require("express");
const next = require("next");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const serverConfig = require("./config/server");
const dev = serverConfig.NODE_ENV !== "production";
const app = next({ dev });
const fileUpload = require('express-fileupload');
const handle = app.getRequestHandler();
const cookieParser = require("cookie-parser");
const appConfig = require('./config')
var compression = require("compression");
const addRequestId = require('express-request-id')();
const request = require('request')

require('log-timestamp')(function () { return DateFormater.getDateWithTimestamp(new Date()) + ' : %s' });

app.prepare().then(() => {
  const server = express();
  /**** middleware ****/
  server.use(cookieParser());
  server.use(addRequestId);
  server.use(fileUpload());
  server.use(compression({ filter: shouldCompress }));
  function shouldCompress(req, res) {
    if (req.headers["x-no-compression"]) {
      // don't compress responses with this request header
      return false;
    }
  }

  server.use(bodyParser.json({ limit: '50mb', extended: true }));
  server.use((req, res, next) => {
    if (req.path == "/pixel.png") {
      //track mail
      var client_name = req.query.client_name;
      var username = req.query.email;
      var template_name = req.query.template_name;
      var sent_time = req.query.sent_time;
      console.log("request for image contain values")
      console.log(req.query)
      if (client_name && username && template_name && sent_time) {
        var email_track_entry = {
          client_name: client_name,
          sent_time: sent_time,
          template_name: template_name,
          username: username,
          view_time: DateFormater.getDateWithTimestamp(new Date())
        }
        DBService.addEmailTrackingEntry(email_track_entry).then((DBRes) => {
          console.log("email tracker pixel entry add db res :" + JSON.stringify(DBRes) + "  for entry : " + JSON.stringify(email_track_entry))
        })
      }
    }
    next()
  })
  server.use(express.static("static"));
  server.use(UserSessionHandler.authenticate);

  //routes
  server.use(
    "/api/user",
    require(path.resolve(__dirname, "./server/api/web/routes/user.route"))
  );
  server.use(
    "/api/client",
    require(path.resolve(__dirname, "./server/api/web/routes/client.route"))
  );
  server.use(
    "/api/dashboard",
    require(path.resolve(__dirname, "./server/api/web/routes/dashboard.route"))
  );

  server.use(
    "/api/email",
    require(path.resolve(__dirname, "./server/api/web/routes/email.route"))
  );

  server.use(
    "/api/script",
    require(path.resolve(__dirname, "./server/api/web/routes/script.route"))
  );

  server.use(
    "/api/session",
    require(path.resolve(__dirname, "./server/api/web/routes/session.route"))
  );
  server.use(
    "/api/fbdetails",
    require(path.resolve(__dirname, "./server/api/web/routes/fbdetails.route"))
  );
  server.use(
    "/api/adsetdetails",
    require(path.resolve(
      __dirname,
      "./server/api/web/routes/adsetdetails.route"
    ))
  );


  server.use(
    "/api/campaign",
    require(path.resolve(
      __dirname,
      "./server/api/facebook/routes/campaign.route"
    ))
  );

  server.use(
    "/api/csvrepo",
    require(path.resolve(__dirname, "./server/api/web/routes/csvrepo.route.js"))
  );

  server.use(
    "/api/onboard",
    require(path.resolve(__dirname, "./server/api/web/routes/onboard.route"))
  );

  server.use(
    "/api/adset",
    require(path.resolve(__dirname, "./server/api/facebook/routes/adset.route"))
  );
  server.use(
    "/api/tracker",
    require(path.resolve(
      __dirname,
      "./server/api/web/routes/eventtracker.route.js"
    ))
  );

  server.get("/api/hades/context", (req, res) => {
    Hades.getContext(appConfig.HADES_APPLICATION_NAME, req.query.application_key).then((data) => {
      res.json(data)
    }).catch((error) => {
      res.json({ success: false, error: error })
    })
  })

  server.post("/api/hades/context", (req, res) => {
    Hades.addConext(appConfig.HADES_APPLICATION_NAME, req.body.application_key, req.body.context).then((data) => {
      res.json(data)
    }).catch((error) => {
      res.json({ success: false, error: "system error contact support" })
    })
  })

  server.get("/dashboard/:client_name/:id", (req, res) => {
    const actualPage = "/dashboard";
    app.render(req, res, actualPage);
  });

  server.get("/email/list", (req, res) => {
    const actualPage = "/emailtemplatelist";
    app.render(req, res, actualPage);
  });

  server.get("/email/add", (req, res) => {
    const actualPage = "/addemailtemplate";
    app.render(req, res, actualPage);
  });


  server.get("/script/add", (req, res) => {
    const actualPage = "/addscript";
    app.render(req, res, actualPage);
  });

  server.get("/script/list", (req, res) => {
    const actualPage = "/scriptlist";
    app.render(req, res, actualPage);
  });

  server.get("/dbm/add", (req, res) => {
    const actualPage = "/onboarddbm";
    app.render(req, res, actualPage);
  });

  server.get("/email/edit/:client_id/:client_name/:tamplate_name", (req, res) => {
    const actualPage = "/editemailtemplate";
    app.render(req, res, actualPage);
  });

  server.get("/email/dignoisis", (req, res) => {
    const actualPage = "/emaildignoisis";
    app.render(req, res, actualPage);
  });

  server.get("/dbm/list", (req, res) => {
    const actualPage = "/dbmclientlist";
    app.render(req, res, actualPage);
  });

  server.get("/dbm/dignoisis", (req, res) => {
    const actualPage = "/dbmdignoisis";
    app.render(req, res, actualPage);
  });

  server.post("/upload", (req, res) => {
    if(req.query.csv_name.indexOf("S2S")!= -1){
        CsvHandler.UploadToS3Bucket(req,res).then((data)=>{
          res.json(data)
        })
    }else{
      CsvHandler.handle(req, res).then(function (data) {
        res.json(data);
      })
    }
  });


  server.get("/csv/header", (req, res) => {
    var csvPath = path.resolve(__dirname, "./uploads/sample/" + req.query.fileName);
    CsvHandler.getHeader(csvPath).then((data) => {
      res.json(data)
    })
  })

  var generateTableSchema = function (tableName, tableSchemaDetails) {
    var column_map = {};
    var schema = "CREATE TABLE " + tableName + "("
    var columnList = {};

    tableSchemaDetails.columnList.map((entry, i) => {
      columnList[entry.db_name] = entry.data_type;
    });

    var sorted_data = {};
    sorted_keys = Object.keys(columnList).sort()
    for (i of sorted_keys) {
      sorted_data[i] = columnList[i];
    }

    Object.keys(sorted_data).forEach(function (key) {
      if (sorted_data[key] == "DATE") {
        schema = schema + " " + key + " TIMESTAMP"
      } else if (sorted_data[key] == "NUMBER") {
        schema = schema + " " + key + " DOUBLE PRECISION DEFAULT 0"
      } else {
        schema = schema + " " + key + " VARCHAR(1024)"
      }
      if (tableSchemaDetails.primaryKeys.indexOf(key) !== -1) {
        schema = schema + " NOT NULL,"
      } else {
        schema = schema + ", "
      }

    });
    schema = schema + " last_update_date TIMESTAMP NOT NULL,"
    return schema + "PRIMARY KEY(" + tableSchemaDetails.primaryKeys.join(',') + "))"
  }

  processRequest = function (payload) {
    return new Promise((resolve, reject) => {
      var options = {
        method: 'POST',
        url: 'http://localhost:9810/schedule/',
        headers:
        {
          'cache-control': 'no-cache',
          'content-type': 'application/json'
        },
        body: payload,
        json: true
      };

      request(options, function (error, response, body) {
        if (error) {
          resolve({ success: false, error: error })
        }
        resolve(body)
      });
    })
  }

  server.put("/onboard/dbm", (req, res) => {

    var payload = req.body;
    var client_reporting_details = {};
    client_reporting_details.clientId = payload.client_id;
    client_reporting_details.clientName = payload.client_name;
    client_reporting_details.hadesApplicationKey = payload.hadesApplicationKey;
    client_reporting_details.reportingType = payload.reporting_type;
    client_reporting_details.scheduleType = payload.schedule_type;
    client_reporting_details.dataSource = "DBM";
    client_reporting_details.dataSourceConfig = Encoder.encode({ reportingId: payload.reporting_id });
    client_reporting_details.tableName = payload.tableName;
    var primaryKeys = [];
    payload.primary_keys.map((keyEntry) => { primaryKeys.push(keyEntry.column_name) })
    client_reporting_details.tableSchemaDetails = {};
    client_reporting_details.tableSchemaDetails.columnList = payload.sql_schema;
    client_reporting_details.tableSchemaDetails.primaryKeys = primaryKeys;
    var csvPath = path.resolve(__dirname, "./uploads/sample/" + payload.fileName);
    CSVValidator.validate(csvPath, client_reporting_details.tableSchemaDetails).then((validateRes) => {
      if (!validateRes.success) {
        res.json({ success: false, message: "primary key combination is not unique" })
      } else {
        //create table entry for table 
        var tableSchmea = generateTableSchema(payload.tableName, client_reporting_details.tableSchemaDetails)
        DBService.create(tableSchmea).then((DBRes) => {
          if (!DBRes.success) {
            res.json(DBRes)
          } else {
            //client reporting entry
            client_reporting_details.tableSchemaDetails = Encoder.encode(client_reporting_details.tableSchemaDetails);
            DBService.addClientReportingDetailsEntry(client_reporting_details).then((DBRes) => {
              processRequest(client_reporting_details);
              res.json(DBRes)
            })
          }
        })
      }
    })
  })

  server.post("/upload/sample", (req, res) => {
    if (!req.files || Object.keys(req.files).length == 0) {
      resolve({ success: false, error: "No any file to upload" })
    } else {
      let sampleFile = req.files.file;
      if (path.parse(sampleFile.name).ext !== ".csv") {
        res.json({ success: false, error: "only csv file will be uploded" })
      } else {
        var fileName = req.id + ".csv";
        sampleFile.mv("./uploads/sample" + "/" + fileName, function (err) {
          if (err)
            res.json({ success: false, error: err })
          else
            res.json({ success: true, fileName: fileName, actual_name: sampleFile.name })
        })
      }
    }
  });

  server.post("/email", (req, res) => {
    req.body.request_id = req.id;
    Emailer.send(req.body).then((data) => {
      res.json(data)
    }).catch((err) => {
      consol.log(err.stack)
      res.json({ success: false, error: "system internal error please contact tech support" })
    })
  });


  server.post("/query", (req, res) => {
    DBService.selectLimited(req.body.query).then((DBRes) => {
      res.json(DBRes)
    })
  })

  server.post("/query/csv", (req, res) => {
    DBService.select(req.body.query).then((DBRes) => {
      //create csv with name request_id
      res.json(DBRes)
    })
  })

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  //connect mongodb and start server
  mongoose
    .connect(serverConfig.mongoURI, { useNewUrlParser: true })
    .then(res => {
      console.log("Mongodb conection is Successfull");
      const port = serverConfig.PORT;
      server.listen(port, () => {
        console.log("Server is running at port no " + port);
      });
    })
    .catch(err => console.error(err));
});

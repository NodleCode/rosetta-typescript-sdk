import express from "express";
// const { Middleware } = require('swagger-express-middleware');
import http from "http";
import fs from "fs";
import path from "path";
import swaggerUI from "swagger-ui-express";
import jsYaml from "js-yaml";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import * as OpenApiValidator from "express-openapi-validator";


export default class ExpressServer {
  port: number;
  host: string;
  openApiPath: string;

  //TODO add types
  app: any;
  schema: any;
  server: any;

  constructor(port: number, host: string, openApiYaml) {
    this.port = port;
    this.host = host;

    this.app = express();
    this.openApiPath = openApiYaml;

    try {
      this.schema = jsYaml.load(fs.readFileSync(openApiYaml, "utf-8")); //this.schema = jsYaml.safeLoad(fs.readFileSync(openApiYaml));
    } catch (e) {
      console.error("failed to start Express Server");
      process.exit(1);
    }

    this.setupMiddleware();
  }

  setupMiddleware() {
    // this.setupAllowedMedia();
    this.app.use(cors());
    //this.app.use(bodyParser.json({ limit: "14MB" }));
    this.app.use(express.json());
    this.app.use(express.text());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(cookieParser());

    //Simple test to see that the server is up and responding
    this.app.get("/hello", (req, res) =>
      res.send(`Hello World. path: ${this.openApiPath}`)
    );

    //Send the openapi document *AS GENERATED BY THE GENERATOR*
    this.app.get("/openapi", (req, res) =>
      res.sendFile(path.join(__dirname, "..", "..", "api", "openapi.yaml"))
    );

    //View the openapi document in a visual interface. Should be able to test from this page
    this.app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(this.schema));

    this.app.get("/login-redirect", (req, res) => {
      res.status(200);
      res.json(req.query);
    });

    this.app.get("/oauth2-redirect.html", (req, res) => {
      res.status(200);
      res.json(req.query);
    });

    this.app.routeHandlers = {};

    this.app.use(
      OpenApiValidator.middleware({
        apiSpec: this.openApiPath,
        operationHandlers: path.join(__dirname),
        validateRequests: true,
        validateResponses: false,
      })
    );

    this.app.use((err, req, res, next) => {
      // 7. Customize errors
      console.error(err); // dump error to console for debug
      res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
      });
    });
  }

  configure(config) {
    this.app.config = config;
  }

  launch() {
    http.createServer(this.app).listen(this.port);
    console.log(`Listening on port ${this.port}`);
  }

  async close() {
    if (this.server !== undefined) {
      await this.server.close();
      console.log(`Server on port ${this.port} shut down`);
    }
  }
}

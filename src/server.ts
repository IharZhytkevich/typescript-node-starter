import express from "express";
import session from "express-session";
import flash from "express-flash";
import compression from "compression";
import bodyParser from "body-parser";
import lusca from "lusca";
import MongoStore from "connect-mongo";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import bluebird from "bluebird";
import errorHandler from "errorhandler";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";

import { ApiRouter } from "./routes/apiRoutes";
import { OAuthAuthenticationRouter } from "./routes/oauthAuthenticationRoutes";
import { ContactRouter } from "./routes/contactRoutes";
import { homeRouter } from "./routes/homeRoutes";
import { userRouter } from "./routes/userRoutes";

declare module "express-session" {
  export interface SessionData {
    returnTo: string;
  }
}

class Server {
  public app: express.Application;
  public mongoUrl = MONGODB_URI;

  constructor() {
    this.app = express();
    this.mongo();
    this.config();
    this.routes();
  }

  private mongo(): void {
    mongoose.Promise = bluebird;
    mongoose
      .connect(this.mongoUrl, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      })
      .catch((err) => {
        console.log(
          `MongoDB connection error. Please make sure MongoDB is running. ${err}`
        );
      });
  }

  public config(): void {
    this.app.set("port", process.env.PORT || 3000);
    this.app.set("views", path.join(__dirname, "../views"));
    this.app.set("view engine", "pug");
    this.app.use(compression());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(
      session({
        resave: true,
        saveUninitialized: true,
        secret: SESSION_SECRET,
        store: new MongoStore({
          mongoUrl: this.mongoUrl,
          mongoOptions: {
            autoReconnect: true,
          },
        }),
      })
    );
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use(flash());
    this.app.use(lusca.xframe("SAMEORIGIN"));
    this.app.use(lusca.xssProtection(true));
    this.app.use((req, res, next) => {
      res.locals.user = req.user;
      next();
    });
    this.app.use((req, res, next) => {
      // After successful login, redirect back to the intended page
      if (
        !req.user &&
        req.path !== "/login" &&
        req.path !== "/signup" &&
        !req.path.match(/^\/auth/) &&
        !req.path.match(/\./)
      ) {
        req.session.returnTo = req.path;
      } else if (req.user && req.path == "/account") {
        req.session.returnTo = req.path;
      }
      next();
    });

    this.app.use(
      express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
    );

    if (process.env.NODE_ENV === "development") {
      this.app.use(errorHandler());
    }
  }

  public routes(): void {
    this.app.use("/", new homeRouter().router);
    this.app.use("/", new userRouter().router);
    this.app.use("/contact", new ContactRouter().router);
    this.app.use("/api", new ApiRouter().router);
    this.app.use("/auth", new OAuthAuthenticationRouter().router);
  }

  public start(): void {
    this.app.listen(this.app.get("port"), () => {
      console.log(
        "  App is running at http://localhost:%d in %s mode",
        this.app.get("port"),
        this.app.get("env")
      );
      console.log("  Press CTRL-C to stop\n");
    });
  }
}

const server = new Server();

server.start();

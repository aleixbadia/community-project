require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const hbs = require("hbs");
const mongoose = require("mongoose");

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const shopRouter = require("./routes/shop");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const stripeRouter = require('./routes/stripe');

// DB CONNECTION
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to the DB"))
  .catch((err) => console.log("Error connection to the DB", err));

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// MIDDLEWARES
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// SESSION(COOKIES) MIDDLEWARE
app.use(session({
  secret: process.env.SESSION_SECRET,
  // cookie: { maxAge: 3600000 * 1 },	// 1 hour
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 60 * 60 * 24 * 7 // Time to live - 7 days (14 days - Default)
  })
}));

// Register the location for handlebars partials here:
hbs.registerPartials(path.join(__dirname, "views/partials"));

// ROUTES
app.use("/", shopRouter);
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/", stripeRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

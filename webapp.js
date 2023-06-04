//#region initial setup
const express = require("express");
const path = require("path");
const hbs = require("hbs");

// Define paths for express
const publicDirPath = path.join(__dirname, "/public");
const viewsPath = path.join(__dirname, "/public/templates/views");
const partialsPath = path.join(__dirname, "/public/templates/partials");

// Create initial objects
require(path.join(__dirname, "/src/", "/db/mongoose"));
const userRouter = require(`${path.join(__dirname, "/src", "/routers/user")}`);
const characterRouter = require(path.join(__dirname, "/src", "/routers/character"));

// Setup express
const app = express();

// Maintenance middleware
// app.use((req, res, next) => {
// 	res.status(503).send('Site is currently under maintenance. Check back soon!');
// })

//Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Express use
app.use(express.static(publicDirPath));
app.use(express.json());
app.use(userRouter);
app.use(characterRouter);

//#endregion

//#region Website Views
app.get("", (req, res) => {
  res.render("index", {
    title: "Index",
  });
});

app.get("/search", (req, res) => {
  res.render("search", {
    title: "Search",
  });
});

app.get("/search2", (req, res) => {
  res.render("search2", {
    title: "Search 2",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    title: "Help",
  });
});

app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Heath Barcus",
  });
});
//#endregion

// Open listener on port 3000
app.listen(3000, () => {
  console.log("Server is up on port 80");
});

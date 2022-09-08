const { urlencoded } = require("express");
const express = require("express");
const { json } = require("express/lib/response");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3000;

//custom middleware logger
app.use(logger);

// cors = Cross origin resource sharing
app.use(cors(corsOptions));

//built-in middlware to handle urlencoded-form data
app.use(express.urlencoded({ extended: false }));

// built in middleware for json
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, "/public")));

//routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/employees", require("./routes/api/employees"));

//fallback no route matches
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts(".html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts(".json")) {
    res.json({ error: "404 not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errorHandler);

app.listen(PORT, console.log(`Server running at port: ${PORT}`));

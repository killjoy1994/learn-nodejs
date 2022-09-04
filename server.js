const { urlencoded } = require("express");
const express = require("express");
const { json } = require("express/lib/response");
const cors = require("cors");
const app = express();
const path = require("path");
const {logger} = require('./middleware/logEvents');
const errorHandler = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3000;


//custom middleware logger
app.use(logger)

// cors = Cross origin resource sharing
const whitelist = ["https://www.yoursite.com", "http://127.0.0.1:5500", "http://localhost:3000"];
const corsOption = {
    origin: (origin, callback) => {
        if(whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error("Not alloswed by CORS"))
        }
    },
    optionsSuccessStatus: 200 
}
app.use(cors(corsOption))

app.use(express.urlencoded({extended:false}))

// built in middleware for json
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, "/public")))
app.use("/subdir", express.static(path.join(__dirname, "/public")))

app.use("/", require("./routes/root"))
app.use("/subdir", require("./routes/subdir"))
app.use("/employees", require("./routes/api/employees"))

//fallback no route matches
app.all("*", (req,res) => {
    res.status(404);
    if(req.accepts(".html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"))
    } else if(req.accepts(".json")) {
        res.json({error: "404 not found"})
    } else {
        res.type("txt").send("404 not found")
    }
})

app.use(errorHandler)

app.listen(PORT, console.log(`Server running at port: ${PORT}`))
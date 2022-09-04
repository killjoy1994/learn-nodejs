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
const whitelist = ["https://www.yoursite.com", "http://127.0.0.1:5500", "http://localhost"];
const corsOption = {
    origin: (origin, callback) => {
        if(whitelist.indexOf(origin) !== -1) {
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

app.get("/index(.html)?", (req, res) => {
    // res.sendFile("./views/index.html", {root: __dirname});
    res.sendFile(path.join(__dirname,"views", "index.html"))
})

app.get("/new-page(.html)?", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "new-page.html"))
})

app.get("/old-page(.html)?", (req, res) => {
    res.redirect(301, "new-page.html"); //default 302
})

//Route handlers
app.get("/hello(.html)?", (req, res, next) => {
    console.log("attempted to load page hello.html")
    next();
}, (req, res) => {
    res.send("Hello World!")
})

//chain route handlers
const one = (req, res, next) => {
    console.log("one");
    next()
}

const two = (req, res,next) => {
    console.log("two");
    next();
}

const three = (req, res) => {
    console.log("three")
    res.send("finished")
}

app.get("/chain(.html)?", [one,two,three])

//fallback no route matches
app.use("/*", (req,res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"))
})

app.use(errorHandler)

app.listen(PORT, console.log(`Server running at port: ${PORT}`))
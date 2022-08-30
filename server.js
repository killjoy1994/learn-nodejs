const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;

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
app.get("/*", (req,res) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"))
})



app.listen(PORT, console.log(`Server running at port: ${PORT}`))

console.log(__dirname)
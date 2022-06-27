const express = require("express");
const app = express();
const port = 4000;

app.get("/", (req, res) => {
    res.send("<h1>Hello World<h1/>");
});

app.get("/contact", (req, res) => {
    res.send("Contact me at: something.com");
});

app.get("/about", (req, res) => {
    res.send("Name: Imtiaz Ahmad");
});

app.get("/hello", (req, res) => {
    res.send("Hello mate welcome back");
});
app.listen(port, () => {
    console.log("Server started on port 4000")
});
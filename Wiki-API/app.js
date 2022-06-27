const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Setting up mongoose
mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchma = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchma);
// ends mongoose setup 

app.route("/articles")
.get((req, res) => {
    Article.find({}, (err, foundArticles) => {
        if (!err)
            res.send(foundArticles);
        else 
            res.send(err)
    })
})
.post((req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    
    const newArticle = new Article({
        title: title,
        content: content
    });

    newArticle.save((err) => {
        if (!err) {
            res.send("data added successfully");
        }else {
            res.send(err);
        }
    });
})
.delete((req, res) => {
    Article.deleteMany({}, (err) => {
        if (!err) {
            res.send("Successfully deleted all articles");
        }else {
            res.send(err)
        }
    })
});


///////////////////////Requests targetting a specific article ////////////////
app.route("/articles/:articleTitle")
.get((req, res) => {
    const choosenArticle = req.params.articleTitle;
    Article.findOne({title: choosenArticle}, (err, foundArticle) => {
        if (foundArticle) {
            res.send(foundArticle);
        }else {
            res.send("No article matching that title was fond.")
        }
    });
})
.put((req, res) => {
    const choosenArticle = req.params.articleTitle;
    Article.updateOne(
        {title: choosenArticle},
        {title: req.body.title, content: req.body.content},
        function(err) {
            if (!err) {
                res.send("Successfully updated article.")
            }else {
                res.send(err.message)
            }
        }
    );
})
.patch((req, res) => {
    const choosenArticle = req.params.articleTitle;
    Article.updateOne(
        {title: choosenArticle},
        {$set: req.body},
        function(err) {
            if (!err) {
                res.send("Successfully updated article.")
            }else {
                res.send(err)
            }
        }
    )
})
.delete((req, res) => {
    const choosenArticle = req.params.articleTitle;
    Article.deleteOne(
        {title: choosenArticle},
        (err) => {
            if (!err) {
                res.send("Article deleted successfully.")
            }else {
                res.send(err)
            }
        }
    )
});




app.listen(5000, () => {
    console.log("Server started on port 5000");
})

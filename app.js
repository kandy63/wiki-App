const bodyParser = require("body-parser");
const ejs = require("ejs");
const { request } = require("express");
const express = require("express");
const mongoose = require("mongoose");


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.static("public"));

app.set('view engine', 'ejs');



mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);



app.get("/articles", async function (req, res) {
    try {
        const foundArticles = await Article.find({});
        res.send(foundArticles);
    } catch (err) {
        console.log(err)
    }
});

app.get("/articles/:articleTitle", async function (req, res) {
    try {
        const foundArticle = await Article.findOne({ title: req.params.articleTitle });
        if (foundArticle) {
            res.send(foundArticle);
        } else {
            res.send("No article matching that title was found.");
        }
    } catch (err) {
        res.status(500).send("Error finding article by title: " + err.message);
    }
});


app.post("/articles", async function (req, res) {
    try {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        console.log(newArticle);
        await newArticle.save();

        res.status(201).send("Article created successfully");
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});


//Using async-await and try-catch block to handle success and err
app.delete("/articles", async function (req, res) {
    try {
        await Article.deleteMany({});
        res.send("Successfully deleted all articles");
    } catch (err) {
        res.send(err);
    }
});

app.delete("/articles/:articleTitle", async function (req, res) {
    try {
        await Article.deleteOne(
            { title: req.params.articleTitle },
        );
        res.send("Successfully deleted article");
    } catch (err) {
        res.status(500).send("Error deleting article: " + err.message);
    }
});

app.put("/articles/:articleTitle", async function (req, res) {
    const articleTitle = req.params.articleTitle;
    const updatedArticle = {
        title: req.body.title,
        content: req.body.content
    };
    try {
        const article = await Article.findOneAndUpdate(
            { title: articleTitle },
            updatedArticle,
            { overwrite: true, new: true }
        );
        if (!article) {
            res.status(404).send("Article not found");
        } else {
            res.send("Successfully updated article");
        }
    } catch (err) {
        res.status(500).send("Error updating article");
    }
});



app.patch("/articles/:articleTitle", async function (req, res) {
    try {
        await Article.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body }
        );
        res.send("Successfully updated article");
    } catch (err) {
        res.status(500).send("Error updating article: " + err.message);
    }
});









app.listen(3000, function () {
    console.log("Server started on port 3000!");
});



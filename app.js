var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/blogrest");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var blogSchema = new mongoose.Schema({
    title: String,
    body: String,
    image: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

// var item = {
//     title: "My Second Blog",
//     body: "This is my second blog. So it is a very nice experience to add this to the database. Why don't you create two too.",
//     image: "https://www.offervault.com/scoop/wp-content/uploads/2014/08/blog-post-icon.jpg",
// };

// Blog.create(item);

app.get("/", function(req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log(err);
        }
        else {
            res.render("index", { blogs: blogs });
        }
    });
});

app.get("/blogs/new", function(req, res) {
    res.render("new");
});

app.post("/blogs", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    var blog = req.body.blog;
    Blog.create(blog, function(err, blog) {
        if (err) {
            res.render("new");
        }
        else {
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if (err) {
            res.redirect("/");
        }
        else {
            res.render("show", { blog: blog });
        }
    });
});

app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, blog) {
        if (err) {
            res.redirect("/blogs/" + req.params.id);
        }
        else {
            res.render("edit", { blog: blog });
        }
    });
});

app.put("/blogs/:id", function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);

    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog) {
        if (err) {
            res.render("edit", { blog: blog });
        }
        else {
            res.redirect("/blogs/" + blog._id);
        }
    });
});


app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err, blog) {
        if (err) {
            res.render("show", { blog: blog });
        }
        else {
            res.redirect("/");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Running your app...");
});

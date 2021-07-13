const express = require("express");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

const projectHelper = require(`${__dirname}/helper.js`);
const app = express();
const connectionString = `mongodb+srv://admin-celestino:mong0DBcelestin0asaDM@cluster0.34ugi.mongodb.net/blogsDB`;

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "No Title Specified"]
  },
  post: {
    type: String,
    required: [true, "No Post Specified"]
  }
});

const Blog = mongoose.model("Blog", blogSchema);


app.set('view engine', 'ejs').use(express.urlencoded({
  extended: true
})).use(express.static("public"));


app.get("/", (request, response) => {

  Blog.find({}, (error, blogs) => {
    if (error) {
      console.log(`An error is encountered while fetching blogs: ${error}`);
    } else {
      response.render("home", {
        startingText: projectHelper.getHomeStartingText(),
        posts: blogs
      });
    }
  });
});

app.get("/about", (request, response) => {
  response.render("about", {
    startingText: projectHelper.getAboutStartingText()
  });
});

app.get("/contact", (request, response) => {
  response.render("contact", {
    startingText: projectHelper.getContactStartingText()
  });
});

app.get("/compose", (request, response) => {
  response.render("compose");
});

app.get("/posts/:post", (request, response) => {
  let postParam = request.params.post

  Blog.find({}, (error, blogs) => {
    if (error) {
      console.log(`An error is encountered while fetching blogs: ${error}`);
    } else {
      blogs.forEach((blog) => {
        if (_.lowerCase(blog.title) === _.lowerCase(postParam)) {
          response.render("post", {
            postParam: blog
          });
        }
      });
    }
  });
});

app.post("/compose", (request, response) => {
  var post = {
    title: request.body.composeTitle,
    post: request.body.composePost,
  };

  const blog = Blog({
    title: request.body.composeTitle,
    post: request.body.composePost
  });

  Blog.findOne({
    title: post.title
  }, (error, existingBlog) => {
    if (error) {
      console.log(`An error is encountered while finding document with title '${post.title}': + ${getValidationErrorMessage(error)}`);
      response.redirect("/");
    } else if (existingBlog) {
      console.log(`Blog's title is already used.`);
      response.redirect("/");
    } else {
      blog.save().then((newBlogSaved) => {
        console.log(`Successfully saved a new blog with title '${newBlogSaved.title}'`);
        response.redirect("/");
      }).catch((saveError) => {
        console.log(`An error is encountered while saving the blog: ${saveError}`);
        response.redirect("/");
      });
    }
  });
});

/**
 * utility method to get the exact error message from the passed error reference
 * @param {*} validationError reference to error message object
 * @returns exact error message set to passed error message reference.
 */
function getValidationErrorMessage(validationError) {
  let validationErrorMessage = "";
  if (validationError.name == 'ValidationError') {
    for (field in validationError.errors) {
      console.log(field);
      validationErrorMessage += (validationError.errors[field].message);
    }
  }
  return validationErrorMessage;
}

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
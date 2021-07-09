const express = require("express");
const ejs = require("ejs");
const lodash = require('lodash')
const projectHelper = require(`${__dirname}/helper.js`);
const posts = [];

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));


app.get("/", function (request, response) {
  response.render("home", {
    startingText: projectHelper.getHomeStartingText(),
    posts: posts
  });
});

app.get("/about", function (request, response) {
  response.render("about", {
    startingText: projectHelper.getAboutStartingText()
  });
});

app.get("/contact", function (request, response) {
  response.render("contact", {
    startingText: projectHelper.getAboutStartingText()
  });
});

app.get("/compose", function (request, response) {
  response.render("compose");
});

app.get("/posts/:post", function (request, response) {
  let postParam = request.params.post

  for (let index in posts) {
    if (lodash.lowerCase(posts[index].title) === lodash.lowerCase(postParam)) {
      response.render("post", {postParam: posts[index]});
      break;
    }
  }
});

app.post("/compose", function (request, response) {
  var post = {
    title: request.body.composeTitle,
    post: request.body.composePost,
  }
  posts.push(post);
  response.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
const Post = require("../models/post");
const { check, validationResult } = require("express-validator");

// create a post and save it to the database
exports.create_post = [
  // validate and sanitize fields
  check("title", "Title is required").trim().notEmpty().escape(),
  check("content", "Content is required").trim().notEmpty().escape(),
  check("author", "Author is required").trim().notEmpty().escape(),
  // process request after validation and sanitization
  (req, res, next) => {
    console.log("start of create_post function");
    console.log("Received request body", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // extract the post data from the request body
    const { title, content, author } = req.body;
    console.log("Creating new post with data:", {
      title,
      content,
      author,
    });
    // create a new Post object with escaped and trimmed data
    const post = new Post({ title, content, author });

    // save the Post to the database
    post.save((err) => {
      if (err) {
        console.log("Error occured:", err);
        return next(err);
      }
      console.log("Saved post to the database:", post);
      // successful - return the created post to the client
      res.json(post);
    });
  },
];

// get all posts
exports.get_posts = (req, res, next) => {
  Post.find()
    .sort([["createdAt", "ascending"]])
    .exec((err, list_posts) => {
      if (err) {
        return next(err);
      }
      // successful, return JSON object of all posts
      res.json(list_posts);
    });
};

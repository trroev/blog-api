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
      res.status(200).json(post);
    });
  },
];

// retrieve all posts
exports.get_posts = (req, res, next) => {
  Post.find()
    .sort([["createdAt", "descending"]])
    .exec((err, list_posts) => {
      if (err) {
        return next(err);
      }
      // successful, return JSON object of all posts
      res.status(200).json(list_posts);
    });
};

// retrieve specific post by ID
exports.get_post = (req, res, next) => {
  Post.findById(req.params.id).exec((err, post) => {
    if (err) {
      return next(err);
    }
    if (!post) {
      return res
        .status(404)
        .json({ err: `post with id ${req.params.id} not found` });
    }
    // successful, return JSON object of specific post
    res.status(200).json(post);
  });
};

// PUT update a specific post by its ID
exports.update_post = (req, res, next) => {
  Post.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, post) => {
      if (err) {
        return next(err);
      }
      if (!post) {
        return res
          .status(404)
          .json({ err: `post with id ${req.params.id} not found` });
      }
      // successful - return JSON object of the updated post
      res.status(200).json(post);
    }
  );
};

// DELETE a specific post by its ID
exports.delete_post = (req, res, next) => {
  Post.findByIdAndRemove(req.params.id, (err, post) => {
    if (err) {
      return next(err);
    }
    if (!post) {
      return res
        .status(404)
        .json({ err: `post with id ${req.params.id} not found` });
    }
    // successful - return JSON message indicating post was deleted
    res.status(200).json({
      msg: `post ${req.params.id} was successfully deleted`,
    });
  });
};

// GET - retrieve a list of all published or unpublished posts

// GET - retrieve a list of all posts sorted by a specific field (e.g. title, date)

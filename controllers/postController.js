const Post = require("../models/post");
const { check, validationResult } = require("express-validator");

// create a post and save it to the database
exports.create_post = [
  // validate and sanitize fields
  check("title", "Title is required").trim().notEmpty().escape(),
  check("content", "Content is required").trim().notEmpty().escape(),
  check("author", "Author is required").trim().notEmpty().escape(),
  // process request after validation and sanitization
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // extract the post data from the request body
      const { title, content, author } = req.body;
      // create a new Post object with escaped and trimmed data
      const post = new Post({ title, content, author });

      // save the Post to the database
      post.save();
      // successful - return the created post to the client
      res.status(200).json(post);
    } catch (err) {
      return next(err);
    }
  },
];

// retrieve all posts
exports.get_posts = async (req, res, next) => {
  try {
    const list_posts = await Post.find()
      .sort([["createdAt", "descending"]])
      .exec();

    // successful, return JSON object of all posts
    res.status(200).json(list_posts);
  } catch (err) {
    return next(err);
  }
};

// retrieve specific post by ID
exports.get_post = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).exec();

    if (!post) {
      return res
        .status(404)
        .json({ err: `post with id ${req.params.id} not found` });
    }
    // successful, return JSON object of specific post
    res.status(200).json(post);
  } catch (err) {
    return next(err);
  }
};

// PUT update a specific post by its ID
exports.update_post = [
  // validate and sanitize fields
  check("title", "Title is required").trim().notEmpty().escape(),
  check("content", "Content is required").trim().notEmpty().escape(),
  check("author", "Author is required").trim().notEmpty().escape(),
  (req, res, next) => {
    // process request after validation and sanitization
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  async (req, res, next) => {
    try {
      const post = await Post.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!post) {
        return res
          .status(404)
          .json({ err: `post with id ${req.params.id} not found` });
      }
      // successful - return JSON object of the updated post
      res.status(200).json(post);
    } catch (err) {
      return next(err);
    }
  },
];

// DELETE a specific post by its ID
exports.delete_post = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndRemove(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ err: `post with id ${req.params.id} not found` });
    }
    // successful - return JSON message indicating post was deleted
    res.status(200).json({
      msg: `post ${req.params.id} was successfully deleted`,
    });
  } catch (err) {
    return next(err);
  }
};

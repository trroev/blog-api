const Post = require("../models/post");
const { check, validationResult } = require("express-validator");

exports.create_post = [
  // validate and sanitize fields
  check("title", "Title is required").trim().notEmpty().escape(),
  check("content", "Content is required").trim().notEmpty().escape(),
  check("author", "Author is required").trim().notEmpty().escape(),
  // process request after validation and sanitization
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // extract the post data from the request body
      const { title, content, author } = req.body;
      // create a new Post object with escaped and trimmed data
      const post = new Post({ title, content, author });

      // save the Post to the database
      await post.save();

      // successful - return the created post to the client
      res.json(post);
    } catch (err) {
      res.status(500).send(err);
    }
  },
];

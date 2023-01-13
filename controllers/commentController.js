const Comment = require("../models/comment");
const Post = require("../models/post");
const { check, validationResult } = require("express-validator");

// create a comment for a specific post and add it to the database
exports.create_comment = [
  // validate and sanitize fields
  check("author", "Author is required").trim().notEmpty().escape(),
  check("content", "Content is required").trim().notEmpty().escape(),
  // process request after validation and sanitization
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // extract the comment data from the request body
    const { author, content } = req.body;
    const postId = req.params.id;
    // create a new Comment object with the escaped and trimmed data
    const comment = new Comment({ author, content, postId });
    // save the comment to the database
    comment.save((err, comment) => {
      if (err) return next(err);
    });
    // find and update the post and push the comment in to the comment array
    Post.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: comment } },
      { new: true },
      (err, post) => {
        if (err) {
          return next(err);
        }
        // successful - return JSON object of the new comment
        res.status(200).json(comment);
      }
    );
  },
];

// retrieve all comments for a specific post
exports.get_comments = (req, res, next) => {
  const postId = req.params.id;

  // find the post by id and populate the comments array
  Post.findById(postId)
    .populate({
      path: "comments",
      options: { sort: { createdAt: "descending" } },
    })
    .sort([["createdAt", "descending"]])
    .exec((err, post) => {
      if (err) {
        return next(err);
      }
      // successful - return JSON object of the comments
      res.status(200).json(post.comments);
    });
};

// get_comment

// update_comment

// delete_comment

// delete_post_comments

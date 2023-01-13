const Comment = require("../models/comment");
const Post = require("../models/post");
const { check, validationResult } = require("express-validator");

// create a comment for a specific post and add it to the database
exports.create_post_comment = [
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
exports.get_post_comments = (req, res, next) => {
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
      if (!post) {
        return res
          .status(404)
          .json({ err: `Post with id ${postId} not found` });
      }
      // successful - return JSON object of the comments
      res.status(200).json(post.comments);
    });
};

// retrieve a specfic comment base on ID
exports.get_post_comment = (req, res, next) => {
  const { postId, commentId } = req.params;

  Comment.findById(commentId).exec((err, comment) => {
    if (err) {
      return next(err);
    }
    if (!comment) {
      return res
        .status(404)
        .json({ err: `Comment with id ${commentId} not found` });
    }
    if (comment.postId !== postId) {
      return res.status(404).json({
        err: `Comment with id ${commentId} not found for this post`,
      });
    }
    // successful - return JSON object of the comment
    res.status(200).json(comment);
  });
};

// update a specific comment for a specific blog post
exports.update_post_comment = (req, res, next) => {
  const { postId, commentId } = req.params;
  const { author, content } = req.body;
  // validate and sanitize fields
  check("author", "Author is required").trim().notEmpty().escape();
  check("content", "Content is required").trim().notEmpty().escape();
  // process request after validation and sanitization
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  Comment.findByIdAndUpdate(
    commentId,
    req.body,
    { new: true },
    (err, comment) => {
      if (err) {
        return next(err);
      }
      if (!comment) {
        return res
          .status(404)
          .json({ err: `Comment with id ${commentId} not found` });
      }
      if (comment.postId !== postId) {
        return res.status(404).json({
          err: `Comment with id ${commentId} not found for this post`,
        });
      }
      // successful - return JSON object of updated comment
      res.status(200).json(comment);
    }
  );
};

// delete a specific comment for a specific blog post
exports.delete_post_comment = (req, res, next) => {
  const { postId, commentId } = req.params;

  Comment.findByIdAndRemove(commentId, (err, comment) => {
    if (err) {
      return next(err);
    }
    if (!comment) {
      return res
        .status(404)
        .json({ err: `Comment with id ${commentId} not found` });
    }
    if (comment.postId !== postId) {
      return res.status(404).json({
        err: `Comment with id ${commentId} not found for this post`,
      });
    }
    // find post and remove the deleted comment from the comment array
    Post.findByIdAndUpdate(
      postId,
      { $pull: { comments: commentId } },
      { new: true },
      (err, post) => {
        if (err) {
          return next(err);
        }
      }
    );
    // successful - return JSON message indicating the comment was deleted
    res
      .status(200)
      .json({ msg: `Comment ${commentId} was successfully deleted` });
  });
};

// delete_post_comments
exports.delete_post_comments = (req, res, next) => {
  const postId = req.params.postId;
  Comment.deleteMany({ postId }, (err) => {
    if (err) {
      return next(err);
    }
    // find Post and remove deleted comments from the comment array
    Post.findByIdAndUpdate(
      { _id: postId },
      { $pull: { comments: { postId } } },
      (err, result) => {
        if ((err, post)) {
          return next(err);
        }
        if (!post) {
          return res
            .status(404)
            .json({ err: `Post with id ${postId} was not found ` });
        }
      }
    );
    // successful - return JSON message indicating all comments were deleted
    res
      .status(200)
      .json({ msg: "All comments were successfully deleted" });
  });
};

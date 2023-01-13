const Comment = require("../models/comment");
const Post = require("../models/post");
const { check, validationResult } = require("express-validator");

// create a comment for a specific post and add it to the database
exports.create_post_comment = [
  // validate and sanitize fields
  check("author", "Author is required").trim().notEmpty().escape(),
  check("content", "Content is required").trim().notEmpty().escape(),
  // process request after validation and sanitization
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // extract the comment data from the request body
      const { author, content } = req.body;
      const postId = req.params.id;

      // create a new Comment object with the escaped and trimmed data
      const comment = new Comment({ author, content, postId });

      // save the comment to the database
      await comment.save();

      // find and update the post and push the comment in to the comment array
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $push: { comments: comment } },
        { new: true }
      );

      // successful - return JSON object of the new comment
      res.status(200).json(comment);
    } catch (err) {
      return next(err);
    }
  },
];

// retrieve all comments for a specific post
exports.get_post_comments = async (req, res, next) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId)
      .populate({
        path: "comments",
        options: { sort: { createdAt: "descending" } },
      })
      .sort([["createdAt", "descending"]]);

    if (!post) {
      return res
        .status(404)
        .json({ err: `Post with id ${postId} not found` });
    }

    // successful - return JSON object of the comments
    res.status(200).json(post.comments);
  } catch (err) {
    return next(err);
  }
};

// retrieve a specfic comment base on ID
exports.get_post_comment = async (req, res, next) => {
  try {
    const { postId, commentId } = req.params;

    const comment = await Comment.findById(commentId);
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
  } catch (err) {
    return next(err);
  }
};

// update a specific comment for a specific blog post
exports.update_post_comment = async (req, res, next) => {
  try {
    const { postId, commentId } = req.params;
    const { author, content } = req.body;

    // validate and sanitize fields
    check("author", "Author is required").trim().notEmpty().escape();
    check("content", "Content is required")
      .trim()
      .notEmpty()
      .escape();
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find and update the comment
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      req.body,
      { new: true }
    );
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
  } catch (err) {
    return next(err);
  }
};

// delete a specific comment for a specific blog post
exports.delete_post_comment = async (req, res, next) => {
  try {
    const { postId, commentId } = req.params;

    const comment = await Comment.findByIdAndRemove(commentId);

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
    await Post.findByIdAndUpdate(postId, {
      $pull: { comments: commentId },
    });

    // successful - return JSON message indicating the comment was deleted
    res
      .status(200)
      .json({ msg: `Comment ${commentId} was successfully deleted` });
  } catch (err) {
    return next(err);
  }
};

// delete all comments on a specific blog post
exports.delete_post_comments = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    await Comment.deleteMany({ postId });

    const post = await Post.findOneAndUpdate(
      { _id: postId },
      { $pull: { comments: { postId } } }
    );

    if (!post) {
      return res
        .status(404)
        .json({ err: `Post with id ${postId} was not found` });
    }

    res
      .status(200)
      .json({ msg: "All comments were successfully deleted" });
  } catch (err) {
    next(err);
  }
};

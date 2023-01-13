const express = require("express");
const router = express.Router();
const passport = require("passport");
require("../config/passport")(passport);

const post_controller = require("../controllers/postController");
const admin_controller = require("../controllers/adminController");
const comment_controller = require("../controllers/commentController");

// index route
router.get("/", (req, res, next) => {
  res.redirect("/api/posts");
});

/// POSTS ROUTES ///

// POST request for creating a new blog post
router.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  post_controller.create_post
);

// GET request for retrieving all posts from the database
router.get("/posts", post_controller.get_posts);

// GET request for retrieving specific post based on ID
router.get("/posts/:id", post_controller.get_post);

// PUT request for updating a specific post based on ID
router.put("/posts/:id/update", post_controller.update_post);

// POST request to delete a specific post based on ID
router.delete("/posts/:id/delete", post_controller.delete_post);

/// COMMENTS ROUTES ///

// POST request for creating a comment on a blog post
router.post(
  "/posts/:id/comments",
  comment_controller.create_post_comment
);

// GET request to retrieve all comments for a specific blog post
router.get(
  "/posts/:id/comments",
  comment_controller.get_post_comments
);

// GET request to retrieve a specific comment based on ID
router.get(
  "/posts/:postId/comments/:commentId",
  comment_controller.get_post_comment
);

// PUT request for updating a specific comment based on ID
router.put(
  "/posts/:postId/comments/:commentId/update",
  comment_controller.update_post_comment
);

// DELETE request to delete a specific comment based on ID
router.delete(
  "/posts/:postId/comments/:commentId/delete",
  comment_controller.delete_post_comment
);

// DELETE request to delete ALL comments on a blog post
router.delete(
  "/posts/:postId/comments/delete",
  comment_controller.delete_post_comments
);

/// ADMIN ROUTES ///

// POST request to login the admin
router.post("/login", admin_controller.login);

// GET request to logout the admin
router.get("/logout", admin_controller.logout);

module.exports = router;

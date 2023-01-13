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

// POST request for creating a comment on a blog post
router.post("/posts/:id/comment", comment_controller.create_comment);

// POST request to login the admin
router.post("/login", admin_controller.login);

// GET request to logout the admin
router.get("/logout", admin_controller.logout);

module.exports = router;

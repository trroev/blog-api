const express = require("express");
const router = express.Router();
const passport = require("passport");

const post_controller = require("../controllers/postController");
const admin_controller = require("../controllers/adminController");

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
router.put("/posts/:id", post_controller.update_post);

router.post("/login", admin_controller.login);

router.get("/logout", admin_controller.logout);

module.exports = router;

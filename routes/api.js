const express = require("express");
const router = express.Router();
const passport = require("passport");

const post_controller = require("../controllers/postController");

router.post(
  "/posts",
  passport.authenticate("jwt", { session: false }),
  post_controller.create_post
);

module.exports = router;

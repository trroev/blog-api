const Post = require("../models/post");
const { check, validationResult } = require("express-validator");

exports.create_post = async (req, res) => {
  try {
    // extract the post data from the request body
    const { title, content, author } = req.body;
    // create a new post document using the Post model
    const post = new Post({ title, content, author });
    // save the post to the database
    await post.save();
    // return the created post to the client
    res.json(post);
  } catch (err) {
    // handle any errors that occur during the process
    res.status(500).send(err);
  }
};

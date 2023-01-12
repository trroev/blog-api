const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
  // extract the username and password from the request body
  const { username, password } = req.body;

  // find the admin by their username
  const admin = await Admin.findOne({ username });
  if (!admin)
    return res.status(401).json({ error: "Invalid username" });

  // compare the provided password with the hashed password stored in the database
  const isMatch = await admin.isValidPassword(password);
  if (!isMatch)
    return res.status(401).json({ error: "Invalid password" });

  // create a JSON web token
  const payload = { adminId: admin._id };
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  // return the token to the client
  res.json({ token });
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

const Admin = require("../models/admin");
const Blacklist = require("../models/blacklist");
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
  res.status(200).json({ msg: "Login successful", token });
};

exports.logout = (req, res, next) => {
  try {
    // get the jwt from the headers
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY);
    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000);

    // invalidate the token by making it blacklisted
    Blacklist.create({ token, expiresAt });

    // successful - return a JSON message indicating the logout was a success
    res.status(200).json({ msg: "Logout successful" });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    return next(err);
  }
};

const passport = require("passport");
const LocalStrategy = require("passport-jwt").Strategy;
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const secret = process.env.SECRET_KEY;
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret,
};

module.exports = new JwtStrategy(jwtOptions, (payload, done) => {
  // verify the payload and call the done callback with the admin object
  Admin.findById(payload.userId, (err, admin) => {
    if (err) return done(err);
    if (!admin) return done(null, false);
    done(null, admin);
  });
});

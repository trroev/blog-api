const passport = require("passport");

module.exports = (passport) => {
  const JwtStrategy = require("passport-jwt").Strategy;
  const ExtractJwt = require("passport-jwt").ExtractJwt;
  const Admin = require("../models/admin");

  const secret = process.env.SECRET_KEY;
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secret,
  };

  const strategy = new JwtStrategy(jwtOptions, (payload, done) => {
    // verify the payload and call the done callback with the admin object
    Admin.findById(payload.adminId, (err, admin) => {
      if (err) return done(err);
      if (!admin) return done(null, false);
      done(null, admin);
    });
  });

  passport.use(strategy);
};

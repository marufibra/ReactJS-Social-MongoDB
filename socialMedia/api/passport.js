import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "./connection.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      const googleId = profile.id;
      const email = profile.emails[0].value;
      const name = profile.displayName;
      const profilePic = profile.photos[0].value;

      // 1️⃣ Check if user already exists by email
      const q = "SELECT * FROM users WHERE email = ?";

      db.query(q, [email], (err, data) => {
        if (err) return done(err);

        // ✅ User exists → link Google account if not linked
        if (data.length) {
          const user = data[0];

          if (!user.google_id) {
            const updateQ =
              "UPDATE users SET google_id=?, profilePic=? WHERE id=?";
            db.query(updateQ, [googleId, profilePic, user.id]);
          }

          return done(null, user);
        }

        // 2️⃣ User does NOT exist → create new Google user
        const insertQ =
          "INSERT INTO users (`username`,`email`,`password`,`name`,`google_id`,`profilePic`) VALUES (?)";

        const values = [
          email.split("@")[0], // username
          email,
          null,                // no password for Google users
          name,
          googleId,
          profilePic,
        ];

        db.query(insertQ, [values], (err, result) => {
          if (err) return done(err);

          return done(null, {
            id: result.insertId,
            username: values[0],
            email,
            name,
            profilePic,
          });
        });
      });
    }
  )
);

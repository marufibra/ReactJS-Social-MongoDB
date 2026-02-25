import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const profilePic = profile.photos?.[0]?.value;

        if (!email) {
          return done(null, false);
        }

        let user = await User.findOne({ email });

        if (user) {
          // link Google account if not linked
          if (!user.google_id) {
            user.google_id = googleId;
            await user.save();
          }
          return done(null, user);
        }

        // create new user
        user = new User({
          username: email.split("@")[0],
          email,
          google_id: googleId,
          profilePicture: profilePic,
        });

        await user.save();
        return done(null, user);

      } catch (err) {
        return done(err);
      }
    }
  )
);

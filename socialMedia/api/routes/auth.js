import express from 'express'
import { login, register, logout, getMe } from '../controllers/auth.js';
import passport from "passport";
import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", getMe);


// Google OAuth
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user.id },
            process.env.JWT_SECRET
        );

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: isProduction ? true : false,
            sameSite: isProduction ? "none" : "lax",
        });

        res.redirect(process.env.CLIENT_URL);
    }
);

export default router;
import { db } from "../connection.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const register = (req, res) => {

    //CHECK USER IF EXISTS
    const query = "SELECT * FROM users WHERE username = ? OR email = ?";
    db.query(query, [req.body.username, req.body.email], (err, data) => {
        if (err) return res.status(500).json(err);

        if (
            !req.body.username?.trim() ||
            !req.body.email?.trim() ||
            !req.body.password?.trim() ||
            !req.body.name?.trim()
        ) {
            return res.status(400).json("All fields are required");
        }


        if (data.length) return res.status(409).json("User already exist!");
        //data.length something was found

        //CREATE A NEW USER
        //Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt)

        const query = "INSERT INTO users(`username`,`email`,`password`,`name`) VALUES(?)";
        const values = [req.body.username, req.body.email, hashedPassword, req.body.name];
        db.query(query, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json({ message: "User has been created." })

        })
    })

}

export const login = (req, res) => {
    const query = "SELECT * FROM users WHERE `username` = ?";
    db.query(query, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err);
        if (
            !req.body.username?.trim() ||
            !req.body.password?.trim()
        ) {
            return res.status(400).json("All fields are required");
        }
        if (data.length === 0) return res.status(404).json("User not found");
        //data.length === 0 nothing was found

        const checkPassword = bcrypt.compareSync(req.body.password, data[0].password)
        if (!checkPassword) return res.status(400).json("Wrong password or username!")

        const token = jwt.sign({ id: data[0].id }, process.env.JWT_SECRET);

        const { password, ...others } = data[0];
        const isProduction = process.env.NODE_ENV === "production";
        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: isProduction ? true : false,
            sameSite: isProduction ? "none" : "lax",
        }).status(200).json(others);

    })
}


export const logout = (req, res) => {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: isProduction ? true : false,
        sameSite: isProduction ? "none" : "lax",
    }).status(200).json("User has been logged out");
}
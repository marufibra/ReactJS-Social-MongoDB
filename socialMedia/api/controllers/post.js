import moment from "moment/moment.js";
import { db } from "../connection.js";
import jwt from "jsonwebtoken";
// export const getPosts = (req, res) => {
//     const userId = req.query.userId;
//     const token = req.cookies.accessToken;
//     if (!token) return res.status(401).json("Not logged in!");

//     jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
//         if (err) return res.status(403).json("Token is not valid!")

//         const query = userId !== "undefined"
//             ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
//             : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) 
//             LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ? 
//             ORDER BY p.createdAt DESC`

//         const values = userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id]

//         db.query(query, values, (err, data) => {
//             if (err) return res.status(500).json(err);
//             return res.status(200).json(data);
//         })
//     })
// }


export const getPosts = (req, res) => {
    const userId = req.query.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        let query;
        let values;

        if (userId && userId !== "undefined") {
            query = `
                SELECT p.*, u.id AS userId, u.name, u.profilePic
                FROM posts AS p
                JOIN users AS u ON u.id = p.userId
                WHERE p.userId = ?
                ORDER BY p.createdAt DESC
                LIMIT ? OFFSET ?
            `;
            values = [userId, limit, offset];
        } else {
            query = `
                SELECT p.*, u.id AS userId, u.name, u.profilePic
                FROM posts AS p
                JOIN users AS u ON u.id = p.userId
                LEFT JOIN relationships AS r 
                  ON p.userId = r.followedUserId
                WHERE r.followerUserId = ? OR p.userId = ?
                ORDER BY p.createdAt DESC
                LIMIT ? OFFSET ?
            `;
            values = [userInfo.id, userInfo.id, limit, offset];
        }

        db.query(query, values, (err, data) => {
            if (err) return res.status(500).json(err);

            // 🔴 IMPORTANT: send pagination info
            res.status(200).json({
                posts: data,
                nextPage: data.length === limit ? page + 1 : null
            });
        });
    });
};



















export const addPost = (req, res) => {
    if (
        !req.body.desc?.trim()
    ) {
        return res.status(400).json("Description required!");
    }

    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!")

        const query = 'INSERT INTO posts(`desc`,`img`,`createdAt`,`userId`) VALUES(?)';

        const values = [
            req.body.desc,
            req.body.img,
            moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            userInfo.id
        ]

        db.query(query, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Post has been created");
        })
    })
}

export const deletePost = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!")

        const query = 'DELETE FROM posts WHERE `id` = ? AND `userId` = ?';

        db.query(query, [req.params.id, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err);
            if(data.affectedRows > 0) return res.status(200).json("Post has been deleted");
            return res.status(403).json("You can delete only your post");
        })
    })
}
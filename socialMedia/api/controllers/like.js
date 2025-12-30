import jwt from "jsonwebtoken";
import { db } from "../connection.js";


export const getLikes = (req, res) => {

    if (
        !req.query.postId?.trim()
    ) {
        return res.status(400).json("postId required!");
    }
    const query = 'SELECT userId from likes WHERE postId = ?';
    db.query(query, [req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data.map(like => like.userId));
    })
}


export const addLike = (req, res) => {

    if (!req.body.postId) {
        return res.status(400).json("postId required!");
    }

    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!")

        const query = 'INSERT INTO likes(`userId`, `postId`) VALUES(?)';

        const values = [
            userInfo.id,
            req.body.postId
        ]

        db.query(query, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Post has been liked");
        })
    })

}

export const deleteLike = (req, res) => {

    if (!req.query.postId?.trim()) {
        return res.status(400).json("postId required!");
    }

    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!")

        const query = 'DELETE FROM likes WHERE `userId` = ? AND `postId` = ?';

      

        db.query(query, [userInfo.id, req.query.postId], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Post has been disliked.");
        })
    })
}
import jwt from "jsonwebtoken";
import { db } from "../connection.js";


export const getRelationships = (req, res) => {

    const query = 'SELECT followerUserId from relationships WHERE followedUserId = ?';
    db.query(query, [req.query.followedUserId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data.map(relationship => relationship.followerUserId));
    })
}


export const addRelationship = (req, res) => {

    // if (!req.body.postId) {
    //     return res.status(400).json("postId required!");
    // }

    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!")

        const query = 'INSERT INTO relationships(`followerUserId`, `followedUserId`) VALUES(?)';

        const values = [
            userInfo.id,
            req.body.userId
        ]

        db.query(query, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Following");
        })
    })

}

export const deleteRelationship = (req, res) => {


    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!")

        const query = 'DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?';

      

        db.query(query, [userInfo.id, req.query.userId], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Unfollowed!.");
        })
    })
}
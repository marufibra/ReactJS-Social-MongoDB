import moment from "moment/moment.js";
import jwt from "jsonwebtoken";
import Post from "../models/Post.js";
import mongoose from "mongoose";
import User from "../models/User.js";

export const addPost = async (req, res) => {
    const newPost = new Post(req.body);
    //matches req.body fields to the fields of mongoose schema
    //would ignore fields not in the mongoose schema
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err.message)
    }
}

export const updatePost = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json("Invalid post ID");
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.userId)) {
        return res.status(400).json("Invalid user ID");
    }

    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json("Post not found");
        }

        // ✅ Correct ObjectId comparison
        if (!post.userId.equals(req.body.userId)) {
            return res.status(403).json("You can edit only your post");
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(500).json(err.message);
    }
};





export const deletePost = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json("Invalid post ID");
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.userId)) {
        return res.status(400).json("Invalid user ID");
    }

    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json("Post not found");
        }

        // ✅ Correct ObjectId comparison
        if (!post.userId.equals(req.body.userId)) {
            return res.status(403).json("You can delete only your post");
        }

        await post.deleteOne();
        res.status(200).json("Post deleted!");
    } catch (err) {
        res.status(500).json(err.message);
    }
};

//like/dislike
export const likePost = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json("Invalid post ID");
    }

    if (!mongoose.Types.ObjectId.isValid(req.body.userId)) {
        return res.status(400).json("Invalid user ID");
    }

    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json("Post not found");
        }
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).json("The post has been liked")
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } })
            res.status(200).json("The post has been disliked")
        }
    } catch (err) {
        res.status(500).json(err.message)
    }
}

export const getPost = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json("Invalid post ID");
    }

    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json("Post not found");
        }
        res.status(200).json(post)
    } catch (err) {
        res.status(500).json(err.message)
    }
}

export const getPosts = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
        return res.status(400).json("Invalid user ID");
    }
    try {
        const currentUser = await User.findById(req.params.userId);

        const userPosts = await Post.find({ userId: currentUser._id })
            .sort({ createdAt: -1 });

        const friendPosts = await Promise.all(
            //we are using Promise.all() because Post.find() is asychronouse
            //i.e await Post.find()
            currentUser.followings.map(friendId =>
                Post.find({ userId: friendId }).sort({ createdAt: -1 })
            )
        );

        const allPosts = userPosts.concat(...friendPosts)
            .sort((a, b) => b.createdAt - a.createdAt);
            //above sorting type ensures correct global order
        res.status(200).json(allPosts);
    } catch (err) {
        res.status(500).json(err.message);
    }

}

export const getUserPosts = async (req, res) => {

    try {
        const currentUser = await User.findOne({username: req.params.username});
        const userPosts = await Post.find({ userId: currentUser._id })
            .sort({ createdAt: -1 });
        res.status(200).json(userPosts);
    } catch (err) {
        res.status(500).json(err.message);
    }

}

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


// export const addPost = (req, res) => {
//     if (
//         !req.body.desc?.trim()
//     ) {
//         return res.status(400).json("Description required!");
//     }

//     const token = req.cookies.accessToken;
//     if (!token) return res.status(401).json("Not logged in!");

//     jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
//         if (err) return res.status(403).json("Token is not valid!")

//         const query = 'INSERT INTO posts(`desc`,`img`,`createdAt`,`userId`) VALUES(?)';

//         const values = [
//             req.body.desc,
//             req.body.img,
//             moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
//             userInfo.id
//         ]

//         db.query(query, [values], (err, data) => {
//             if (err) return res.status(500).json(err);
//             return res.status(200).json("Post has been created");
//         })
//     })
// }

// export const deletePost = (req, res) => {

//     const token = req.cookies.accessToken;
//     if (!token) return res.status(401).json("Not logged in!");

//     jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
//         if (err) return res.status(403).json("Token is not valid!")

//         const query = 'DELETE FROM posts WHERE `id` = ? AND `userId` = ?';

//         db.query(query, [req.params.id, userInfo.id], (err, data) => {
//             if (err) return res.status(500).json(err);
//             if(data.affectedRows > 0) return res.status(200).json("Post has been deleted");
//             return res.status(403).json("You can delete only your post");
//         })
//     })
// }
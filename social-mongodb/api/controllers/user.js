
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import mongoose from 'mongoose';

//update user
export const updateUser = async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        try {
            const user = await User.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },//Update ONLY fields passed through req.body and leave everything else untouched.
                { new: true, runValidators: true }
                //new:true
                //returns the updated document. without it would return the old document

                // runValidators:true
                // Mongoose does NOT run schema validators on updates by default.
                //   With runValidators: true
                //     Mongoose enforces:
                //     minlength
                //     maxlength
                //     enum
                //     required
                //     custom validators
                //     If invalid data is sent → update fails.

            );

            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json(err.message);
        }

    } else {
        return res.status(403).json("You can update only your account!");
    }
};

//delete user
export const deleteUser = async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {

        try {
            const user = await User.findByIdAndDelete(req.params.id);
            //findOneAndDelete({ _id: id })

            if (!user) {
                return res.status(404).json("User not found");
            }

            return res.status(200).json("User has been deleted successfully");
        } catch (err) {
            return res.status(500).json(err.message);
        }

    } else {
        return res.status(403).json("You can delete only your account!");
    }
};

//get a user
export const getUser = async (req, res) => {

    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId
            ? await User.findById(userId).select("-password")
            : await User.findOne({ username }).select("-password");
        // ❌ You cannot mix include and exclude fields
        // ✅ Except _id

        if (!user) {
            return res.status(404).json("User not found");
        }

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json(err.message);
    }
};

//get friends

export const getFriends = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        const friends = await User.find(
            { _id: { $in: user.followings } }
        ).select("_id username profilePicture");

        res.status(200).json(friends);
    } catch (err) {
        res.status(500).json(err.message);
    }
};


//Follow User
export const followUser = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json("Invalid user id")
    }
    if (!mongoose.Types.ObjectId.isValid(req.body.userId)) {
        return res.status(400).json("Invalid current user id")
    }
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.params.id } })

                // await User.findByIdAndUpdate(
                //     req.params.id,
                //     { $push: { followers: req.body.userId } },
                //     { new: true, runValidators:true }
                //   );

                // await User.findByIdAndUpdate(
                //     req.body.userId,
                //     { $push: { followings: req.body.userId } },
                //     { new: true }
                //   );

                res.status(200).json("user has been followed")
            } else {
                res.status(403).json("you already follow this user")
            }
        } catch (err) {
            res.status(500).json(err.message)
        }

    } else {
        res.status(403).json("you can't follow yourself")
    }
}

//Unfollow User
export const unfollowUser = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json("Invalid user id")
    }
    if (!mongoose.Types.ObjectId.isValid(req.body.userId)) {
        return res.status(400).json("Invalid current user id")
    }
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({ $pull: { followers: req.body.userId } });
                await currentUser.updateOne({ $pull: { followings: req.params.id } })
                res.status(200).json("user has been unfollowed")
            } else {
                res.status(403).json(`you are not following this user ${user}`)
            }
        } catch (err) {
            res.status(500).json(err.message)
        }

    } else {
        res.status(403).json("you can't unfollow yourself")
    }
}

import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

//New conversation
export const addConversation = async (req, res) => {
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId

    const newConversation = new Conversation({
        members: [senderId, receiverId]
    });

    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json(err);
    }
}

//Get conversaion of a user
// export const getConversation = async(req,res)=>{
//     try{
//         const conversation = await Conversation.find({
//             members: {$in: [req.params.userId]}
//         })
//         res.status(200).json(conversation)
//     }catch(err){
//         res.status(500).json(err);
//     }
// }

export const getConversation = async (req, res) => {
    const userId = req.params.userId;

    try {
        const conversations = await Conversation.find({
            members: { $in: [userId] }
        });

        const conversationsWithUnread = await Promise.all(
            conversations.map(async (conv) => {

                const unreadCount = await Message.countDocuments({
                    conversationId: conv._id,
                    sender: { $ne: userId },   // not sent by current user
                    status: { $ne: "read" }    // not read
                });

                return {
                    ...conv._doc,
                    unreadCount
                };
            })
        );

        res.status(200).json(conversationsWithUnread);

    } catch (err) {
        res.status(500).json(err);
    }
};

//Get conversation of two userId
export const getConversationOfTwoUserId = async (req, res) => {
    try {
        const conversaion = await Conversation.findOne({
            members: { $all: [req.params.firstUserId, req.params.secondUserId] }
        })
        res.status(200).json(conversaion);
    } catch (err) {
        res.status(500).json(err);
    }
}
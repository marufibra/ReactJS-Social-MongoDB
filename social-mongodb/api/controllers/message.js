import Message from "../models/Message.js"

//add message
export const addMessage = async (req, res) => {
    const newMessage = new Message(req.body)
    try {
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json(err)
    }
}

//get message
export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        })
        res.status(200).json(messages)
    } catch (err) {
        res.status(500).json(err)
    }
}

//update message status
export const updateMessageStatus = async (req, res) => {
    try {
        const updatedMessage = await Message.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        res.status(200).json(updatedMessage);
    } catch (err) {
        res.status(500).json(err);
    }

}

//update read messages
export const updateReadMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { userId } = req.body;

        // 1️⃣ Get messages that will be marked as read
        const messagesToUpdate = await Message.find({
            conversationId,
            sender: { $ne: userId },
            status: { $ne: "read" }
        });

        // 2️⃣ Update them
        await Message.updateMany(
            {
                conversationId,
                sender: { $ne: userId },
                status: { $ne: "read" }
            },
            { $set: { status: "read" } }
        );

        // 3️⃣ Return updated messages
        res.status(200).json(messagesToUpdate);

    } catch (err) {
        res.status(500).json(err);
    }
};

//update delivered message
export const updateDeliveredMessage = async (req, res) => {
    try {
        const userId = req.params.userId;

        const updatedMessages = await Message.find({
            sender: { $ne: userId },
            status: "sent"
        });

        await Message.updateMany(
            {
                sender: { $ne: userId },
                status: "sent"
            },
            { $set: { status: "delivered" } }
        );

        res.status(200).json(updatedMessages);

    } catch (err) {
        res.status(500).json(err);
    }
}

export const getUnreadMessages = async (req, res) => {
    try {
        const userId = req.params.userId;

        const count = await Message.countDocuments({
            sender: { $ne: userId },
            status: { $ne: "read" }
        });

        res.status(200).json({ count });

    } catch (err) {
        res.status(500).json(err);
    } 
}
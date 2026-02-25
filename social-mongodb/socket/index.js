import { Server } from "socket.io";
import dotenv from 'dotenv'

dotenv.config();

const PORT = process.env.PORT || 8900;//Render automatically sets process.env.PORT

const io = new Server(PORT, {
    cors: {
        origin: process.env.CLIENT_URL,
    },
});

let users = [];//contains {userId:..., socketId:...},{...}...
let activeChats = [];

const setActiveChat = (userId, conversationId) => {
    activeChats = activeChats.filter(
        chat => chat.userId !== userId
    );

    activeChats.push({ userId, conversationId });
};

const getActiveChat = (userId) => {
    return activeChats.find(chat => chat.userId === userId);
};

const removeActiveChat = (userId) => {
    activeChats = activeChats.filter(
        chat => chat.userId !== userId
    );
};


const addUser = (userId, socketId) => {
    const exists = users.find(user => user.userId === userId);

    if (!exists) {
        users.push({
            userId,
            socketId,
            activeConversationId: null
        });
    } else {
        exists.socketId = socketId;
    }
};

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId)
}

//"connection" and "disconnect" are predefined (built-in) event names in Socket.IO.
//connection event fires automatically when client connects to the server.
//disconnection event fires automatically when client Closes the tab, refreshes, loses internet, calls socket.dsconnect()

io.on("connection", (socket) => {
    

    socket.on("addUser", userId => {
        
        addUser(userId, socket.id);
        io.emit('getUsers', users);
    });

    socket.on("activeChat", ({ userId, conversationId }) => {
        const user = users.find(u => u.userId === userId);
        if (user) {
            user.activeConversationId = conversationId;
        }
    });

    // 🔵 Send message to receiver
    socket.on("sendMessage", async ({ senderId, receiverId, text, messageId, conversationId }) => {

        const receiver = users.find(u => u.userId === receiverId);
        const sender = users.find(u => u.userId === senderId);

        const receiverIsActive =
            receiver &&
            receiver.activeConversationId === conversationId;

        if (!receiver || !receiver.socketId) return;

        // Send message instantly
        io.to(receiver.socketId).emit("getMessage", {
            senderId,
            text,
            messageId,
            conversationId
        });

        if (receiverIsActive) {

            await fetch(`${process.env.API_URL}/messages/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messageId,
                    status: "read"
                })
            });

            if (sender) {
                io.to(sender.socketId).emit("messageReadUpdate", { messageId });
            }

        } else {

            await fetch(`${process.env.API_URL}/messages/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messageId,
                    status: "delivered"
                })
            });

            if (sender) {
                io.to(sender.socketId).emit("messageDelivered", { messageId });
            }
        }
    });

    // 🟢 Notify sender that message became delivered
    socket.on("messageDelivered", ({ messageId, senderId }) => {
        const user = getUser(senderId);
        if (user) {
            io.to(user.socketId).emit("messageDelivered", { messageId });
        }
    });

    // 🔵 Notify sender that message became read
    socket.on("messageRead", ({ messageId, senderId }) => {
        const user = getUser(senderId);
        if (user) {
            io.to(user.socketId).emit("messageReadUpdate", {
                messageId
            });
        }
    });

    socket.on("disconnect", () => {
       

        users = users.filter(user => user.socketId !== socket.id);

        // 🔥 BROADCAST updated list
        io.emit("getUsers", users);
    });
});


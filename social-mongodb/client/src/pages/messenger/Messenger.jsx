// 👉 The received message comes from the WebSocket first, not the database.
// 👉 The database is used for persistence (saving + loading messages later).

// User clicks on a friend to chat with
// Messages are loaded from db
// User clicks Send
// Message is emitted via WebSocket (instant)
// Message is saved to DB (permanent)
// Receiver gets message instantly from ws


import { useContext, useEffect, useRef, useState } from 'react'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import Conversation from '../../components/conversations/Conversation'
import Message from '../../components/message/Message'
import Topbar from '../../components/topbar/Topbar'
import './Messenger.css';
import { AuthContext } from '../../context/AuthCreateContext';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useSearchParams } from 'react-router-dom'
import EmojiPicker from "emoji-picker-react";
import { useMutation } from "@tanstack/react-query";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Overlay from '../../components/overlay/Overlay'

const ShowImg = ({ imgPath, setImgPath, setOverlay }) => {

    return (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: "12" }}>
            <div className='imgContainer'>
                <img className='msImg' src={imgPath} alt="" />
                <span className='closeImg' onClick={() => { setImgPath(""); setOverlay(false) }}>×</span>
            </div>
        </div>
    )
}

const Messenger = () => {

    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null)
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [receiver, setReceiver] = useState(null);
    const [showPicker, setShowPicker] = useState(false);
    const cursorPositionRef = useRef(0);
    const [file, setFile] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [owner, setOwner] = useState("");
    const [imgPath, setImgPath] = useState("");

    const { user, socket } = useContext(AuthContext);
    const scrollRef = useRef();
    const pickerRef = useRef();

    const textareaRef = useRef(null);
    const [overlay, setOverlay] = useState(false)




    const [searchParams, setSearchParams] = useSearchParams()
    useEffect(() => {
        const friendId = searchParams.get("u");

        if (!friendId || !user?._id) return;

        const getConversation = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/conversations/find/${user._id}/${friendId}`
                );

                setCurrentChat(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        getConversation();
    }, [searchParams, user]);



    const handleClick = async (conv) => {
        setNewMessage("")
        setSearchParams({});
        setCurrentChat(conv);
        setShowPicker(false);
        setFile(null)
        setReplyText("")

        // ✅ Reset unread count immediately
        setConversations(prev =>
            prev.map(c =>
                c._id === conv._id
                    ? { ...c, unreadCount: 0 }
                    : c
            )
        );


        // ✅ Update database
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/messages/read/${conv._id}`,
                { userId: user._id }
            );

            // ✅ Optional: notify sender via socket
            socket.current.emit("conversationRead", {
                conversationId: conv._id,
                readerId: user._id
            });

            res.data.forEach(msg => {
                socket.current.emit("messageRead", {
                    messageId: msg._id,
                    senderId: msg.sender
                });
            });

        } catch (err) {
            console.log("Failed to mark messages as read", err);
        }
    }

    const onEmojiClick = (emojiData) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        setNewMessage(prev => {
            const updated =
                prev.substring(0, start) +
                emojiData.emoji +
                prev.substring(end);

            return updated;
        });

        const newCursorPos = start + emojiData.emoji.length;

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };


    useEffect(() => {
        if (!currentChat?._id) return;

        socket.current.emit("activeChat", {
            userId: user._id,
            conversationId: currentChat._id
        });

    }, [currentChat]);


    // What happens here:
    // Browser connects to Socket.IO server
    // Server assigns socket.id
    // Client listens for "getMessage"
    // Incoming real-time messages go into arrivalMessage

    useEffect(() => {
        if (!user || !socket.current) return;

        socket.current.on("getMessage", async (data) => {
            const incomingMessage = {
                _id: data.messageId,
                sender: data.senderId,
                text: data.text,
                conversationId: data.conversationId,
                createdAt: Date.now(),
                status: "delivered"
            };

            setArrivalMessage(incomingMessage);


        });





    }, []);




    // Bridging WebSocket and React State
    // - WebSocket message arrives
    // - If it belongs to the open chat
    // - Add it to UI messages

    //message from ws (arrivalMessage) is added to current chat messages (messages) 


    useEffect(() => {
        if (!arrivalMessage) return;

        const isCurrentChatOpen =
            currentChat?._id === arrivalMessage.conversationId;

        if (isCurrentChatOpen) {

            // 1️⃣ Add message to UI
            setMessages(prev => [...prev, arrivalMessage]);

            // 2️⃣ Immediately mark as read in DB
            axios.put(
                `${import.meta.env.VITE_API_URL}/messages/${arrivalMessage._id}/status`,
                { status: "read" }
            ).catch(err => console.log(err));



        } else {
            // 🔹 Increase unread badge
            setConversations(prev =>
                prev.map(conv =>
                    conv._id === arrivalMessage.conversationId
                        ? {
                            ...conv,
                            unreadCount: (conv.unreadCount || 0) + 1
                        }
                        : conv
                )
            );
        }

    }, [arrivalMessage, currentChat]);




    // Registering user with Socket.IO (online users)
   useEffect(() => {
    if (!user || !socket.current) return;

    const handleUsers = (users) => {
        

        // Store raw userIds
        setOnlineUsers(users.map(u => u.userId));
    };

    socket.current.on("getUsers", handleUsers);

    // ✅ Cleanup to prevent duplicate listeners
    return () => {
        socket.current.off("getUsers", handleUsers);
    };

}, [user]);


    // Database: fetching conversations from db
    useEffect(() => {
        const getConversations = async () => {
            try {

                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/conversations/${user._id}`
                );

                setConversations(res.data);

            } catch (err) {
                console.log(err)
            }
        }
        getConversations();
    }, [user._id])

    // Database: fetching chat messages for first time
    useEffect(() => {
        if (!currentChat?._id) return;
        const getMessages = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/messages/${currentChat?._id}`)
                setMessages(res.data)
            } catch (err) {
                console.log(err)
            }
        }
        getMessages();

    }, [currentChat?._id])

    //get receiverId
    useEffect(() => {
        if (!currentChat) return;

        const getReceiver = async () => {
            const receiverId = currentChat.members.find(
                member => member !== user._id
            );

            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/users?userId=${receiverId}`
                );

                setReceiver(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        getReceiver();
    }, [currentChat, user._id]);


    const uploadMutation = useMutation({
        mutationFn: async (file) => {
            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/upload`,
                formData
            );

            return res.data.url; // Cloudinary URL
        },
    });

    const messageMutation = useMutation({
        mutationFn: async (messageData) => {
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/messages`,
                messageData
            );
            return res.data;
        },

        onSuccess: (data, variables) => {

            setMessages(prev => [...prev, data]);

            socket.current.emit("sendMessage", {
                senderId: user._id,
                receiverId: variables.receiverId,
                text: data.text,
                messageId: data._id,
                conversationId: data.conversationId
            });

            setNewMessage("");
            setFile(null);
        }
    });


    useEffect(() => {
        return () => {
            if (!user || !socket.current) return;

            socket.current.emit("activeChat", {
                userId: user._id,
                conversationId: null
            });
        };
    }, []);


    useEffect(() => {
        if (!user || !socket.current) return;
        socket.current.on("messageDelivered", ({ messageId }) => {
            setMessages(prev =>
                prev.map(m =>
                    m?._id === messageId
                        ? { ...m, status: "delivered" }
                        : m
                )
            );
        });

        socket.current.on("messageReadUpdate", ({ messageId }) => {
            setMessages(prev =>
                prev.map(m =>
                    m?._id === messageId
                        ? { ...m, status: "read" }
                        : m
                )
            );
        });


    }, []);



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file && !newMessage.trim()) return;

        const receiverId = currentChat.members.find(
            (member) => member !== user?._id
        );

        let imgUrl = null;

        if (file) {
            imgUrl = await uploadMutation.mutateAsync(file);
        }

        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat?._id,
            img: imgUrl,
            receiverId // 👈 include it
        };

        messageMutation.mutate(message);
    };


    const messageCountRef = useRef(0);

    useEffect(() => {
        if (messages.length > messageCountRef.current) {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" });
        }

        messageCountRef.current = messages.length;

    }, [messages]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        // setOverlay(true)
    }

    const handleCancelImg = () => {
        setFile(null);
        // setOverlay(false)

    }



    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";              // reset height
            textarea.style.height = textarea.scrollHeight + "px"; // grow
        }
    }, [newMessage]); // runs every time message changes


    return (
        <>
            {overlay && <Overlay />}
            {imgPath && <ShowImg imgPath={imgPath} setImgPath={setImgPath} setOverlay={setOverlay} />}
            <Topbar />
            <div className="messenger">

                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input type="text" className="chatMenuInput" placeholder='Search for friends' />
                        {conversations.map((conv) => (
                            <div key={conv._id} onClick={() => { handleClick(conv) }}>
                                <Conversation conversation={conv} currentUser={user} unreadCount={conv.unreadCount} />
                            </div>
                        ))}

                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {
                            currentChat ?
                                (<>


                                    {showPicker && (
                                        <div ref={pickerRef} style={{ position: "absolute", bottom: "130px", display: "flex", flexDirection: "column" }}>
                                            <span style={{ cursor: "pointer", alignSelf: "flex-end", backgroundColor: "black", width: "20px", textAlign: "center", color: "red", fontWeight: "bold" }} class="closeEmojiPicker" onClick={() => setShowPicker(false)}>❌</span>
                                            <EmojiPicker onEmojiClick={onEmojiClick} />
                                        </div>
                                    )}


                                    <div className="chatBoxTitle">

                                        <div style={{ position: "relative" }}>
                                            <img className="titleImg" src={receiver?.profilePicture ? receiver.profilePicture : "/assets/person/defaultProfileImg.png"} alt="" />
                                            {onlineUsers.some((u) => u === receiver?._id) && <div className='online'></div>}
                                        </div>


                                        <div>{receiver?.username} </div>
                                    </div>
                                    <div className="chatBoxTop">
                                        {
                                            messages.map(m => (
                                                <div key={m._id} ref={scrollRef}>
                                                    <Message
                                                        message={m}
                                                        own={m.sender === user._id}
                                                        setReplyText={setReplyText}
                                                        setOwner={setOwner}
                                                        setImgPath={setImgPath}
                                                        setOverlay={setOverlay}
                                                    />
                                                </div>
                                            ))
                                        }


                                    </div>



                                    <div className="chatBoxBottom">
                                        {
                                            replyText && (<div className='replyText'><div style={{ color: "rgb(83, 189, 235)", marginBottom: "5px", fontWeight: "bold" }}>{owner && owner === "receiver" ? receiver.username : "You"}</div>{replyText.substring(0, 25)} <div className="closeReplyText" onClick={() => setReplyText("")}>×</div></div>)
                                        }
                                        {file ? (
                                            <div className="shareImgContainer">
                                                <img style={{ height: "400px", objectFit: "cover" }} className='shareImg' src={URL.createObjectURL(file)} alt="" />
                                                {/* <CancelIcon style={{ backgroundColor: "red", color: "white" }} className="shareCancelImg" onClick={handleCancelImg} /> */}
                                            </div>
                                        ) :
                                            (

                                                <textarea
                                                    className='chatMessageInput'
                                                    placeholder='Write something...'
                                                    onChange={e => setNewMessage(e.target.value)}
                                                    onClick={(e) => {
                                                        cursorPositionRef.current = e.target.selectionStart;
                                                    }}
                                                    onKeyUp={(e) => {
                                                        cursorPositionRef.current = e.target.selectionStart;
                                                    }}
                                                    value={newMessage}
                                                    ref={textareaRef}
                                                ></textarea>
                                            )
                                        }



                                        <div className='chatSend'>
                                            <button disabled={messageMutation.isPending} className="chatSubmitButton" onClick={handleSubmit}>

                                                {messageMutation.isPending
                                                    ? <Box sx={{ display: 'flex', justifyContent: "center" }}>
                                                        <CircularProgress style={{ color: "white" }} />
                                                    </Box>
                                                    : "Send"}
                                            </button>


                                            {
                                                !file ? <div onClick={() => setShowPicker(!showPicker)} title="emoji" style={{ fontSize: "20px", cursor: "pointer" }}>😄</div>
                                                    : <button className='chatCancelButton' onClick={handleCancelImg}>Cancel Upload</button>
                                            }
                                            <div>
                                                <label htmlFor="file" className="shareOption" onClick={() => { setShowPicker(false) }} >
                                                    <img title={"Image"} style={{ width: "20px", cursor: "pointer" }} src="/assets/person/defaultImg.png" alt="" />

                                                    <input
                                                        style={{ display: "none" }}
                                                        type="file"
                                                        id="file"
                                                        accept=".png,.jpeg,.jpg"
                                                        onChange={handleFileChange}
                                                    />
                                                </label>
                                            </div>





                                        </div>



                                    </div>
                                </>)
                                : (<span className='noConversationText'>Open a conversation to start a chart.</span>)
                        }
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <ChatOnline

                            currentId={user._id}
                            setCurrentChat={setCurrentChat}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Messenger




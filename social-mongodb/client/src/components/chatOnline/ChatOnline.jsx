// import { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import './chatOnline.css'
// import { AuthContext } from '../../context/AuthCreateContext';
// import { useNavigate } from 'react-router-dom';

// const ChatOnline = ({ setCurrentChat, page }) => {
//     const navigate = useNavigate();

//     const [friends, setFriends] = useState([]);
//     const [onlineFriends, setOnlineFriends] = useState([]);
//     const { user, socket } = useContext(AuthContext);
//     const [onlineUsers, setOnlineUsers] = useState([])

//     useEffect(() => {
//         if (!user || !socket.current) return;

//         const handleUsers = (users) => {
//             if (!user?.followings) return;

//             const online = user.followings.filter((f) =>
//                 users.some((u) => u.userId === f)
//             );

//             setOnlineUsers(online);
//         };

//         socket.current.on("getUsers", handleUsers);

//         return () => {
//             socket.current.off("getUsers", handleUsers);
//         };

//     }, [user, socket]);

//     useEffect(() => {
//         const getFriends = async () => {
//             const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/friends/${user?._id}`);
//             setFriends(res.data)
//         };
//         getFriends();
//     }, [user?._id]);

//     useEffect(() => {
//         setOnlineFriends(friends.filter(friend => onlineUsers.includes(friend._id)));
//     }, [friends, onlineUsers]);

//     const handleClick = async (userFriend) => {
//         if (page) {
//             navigate(`/messenger?u=${userFriend._id}`);
//             return; // stop execution here
//         }


//         try {
//             const res = await axios.get(import.meta.env.VITE_API_URL + `/conversations/find/${user?._id}/${userFriend._id}`);
//             setCurrentChat(res.data);
//         } catch (err) {
//             console.log(err)
//         }
//     }

//     return (
//         <div className='chatOnline'>
//             {
//                 onlineFriends.map((onlineFriend) => (
//                     <div className="chatOnlineFriend" onClick={() => { handleClick(onlineFriend) }} >
//                         <div className="chatOnlineImgContainer">
//                             <img className='chatOnlineImg' src={onlineFriend.profilePicture || "/assets/person/defaultProfileImg.png"} alt="" />
//                             <div className="chatOnlineBadge"></div>
//                         </div>
//                         <span className="chatOnlineName">{onlineFriend.username}</span>
//                     </div>
//                 ))
//             }


//         </div>
//     )
// }

// export default ChatOnline

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./chatOnline.css";
import { AuthContext } from "../../context/AuthCreateContext";
import { useNavigate } from "react-router-dom";

const ChatOnline = ({ setCurrentChat, page }) => {
    const navigate = useNavigate();

    const { user, socket } = useContext(AuthContext);

    const [friends, setFriends] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [onlineFriends, setOnlineFriends] = useState([]);

    // ✅ Listen for online users
    useEffect(() => {
    if (!socket.current) return;

    const handleUsers = (users) => {
       
        const userIds = users.map(u => u.userId.toString());
        setOnlineUsers(userIds);
    };

    socket.current.on("getUsers", handleUsers);

    // 🔥 Ask server for current users immediately
    socket.current.emit("addUser", user._id);

    return () => {
        socket.current.off("getUsers", handleUsers);
    };
}, [socket.current, user?._id]);

    // ✅ Fetch friends from DB (source of truth)
    useEffect(() => {
        if (!user) return;

        const getFriends = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/users/friends/${user._id}`
                );
                setFriends(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        getFriends();
    }, [user]);

    // ✅ Match friends with online users
    useEffect(() => {
        const online = friends.filter(friend =>
            onlineUsers.includes(friend._id.toString())
        );

        setOnlineFriends(online);
    }, [friends, onlineUsers]);

    const handleClick = async (friend) => {
        if (page) {
            navigate(`/messenger?u=${friend._id}`);
            return;
        }

        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/conversations/find/${user._id}/${friend._id}`
            );

            setCurrentChat(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="chatOnline">
            {onlineFriends.map(friend => (
                <div
                    key={friend._id}
                    className="chatOnlineFriend"
                    onClick={() => handleClick(friend)}
                >
                    <div className="chatOnlineImgContainer">
                        <img
                            className="chatOnlineImg"
                            src={
                                friend.profilePicture ||
                                "/assets/person/defaultProfileImg.png"
                            }
                            alt=""
                        />
                        <div className="chatOnlineBadge"></div>
                    </div>
                    <span className="chatOnlineName">
                        {friend.username}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default ChatOnline;
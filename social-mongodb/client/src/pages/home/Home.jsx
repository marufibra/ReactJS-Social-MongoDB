import { useContext, useEffect, useReducer, useState } from "react"
import Feed from "../../components/feed/Feed"

import Rightbar from "../../components/rightbar/Rightbar"
import Sidebar from "../../components/sidebar/Sidebar"
import Topbar from "../../components/topbar/Topbar"
import "./home.css"
// import { io } from "socket.io-client"
import { AuthContext } from "../../context/AuthCreateContext"
import axios from "axios"
import ChatOnline from "../../components/chatOnline/ChatOnline"

import AuthReducer from "../../context/AuthReducer"


const Home = () => {
  const { user, socket } = useContext(AuthContext)
  const [onlineUsers, setOnlineUsers] = useState([]);





  useEffect(() => {
    if (!user || !socket.current) return;
    // ✅ Call API
    const syncDelivered = async () => {
      try {
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/messages/delivered/${user._id}`
        );

        // Notify senders via socket
        res.data.forEach(msg => {
          socket.current.emit("messageDelivered", {
            messageId: msg._id,
            senderId: msg.sender
          });
        });

      } catch (err) {
        console.log(err);
      }
    };

    syncDelivered();

  }, [user]);

  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    if (!user) return;
    const getFriends = async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/friends/${user._id}`);
      setFriends(res.data)
    };
    getFriends();
  }, [user]);

  useEffect(() => {
    setOnlineFriends(friends.filter(friend => onlineUsers.includes(friend._id)));
  }, [friends, onlineUsers]);

  return (
    <>
      <Topbar onlineUsers={onlineUsers} />
      <div className="homeContainer">
        <Sidebar />
        <Feed />
        {/* <Rightbar onlineFriends={onlineFriends} /> */}
        <ChatOnline page="page" />
      </div>
    </>
  )
}

export default Home
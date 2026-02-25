import { useEffect, useState } from "react"
import "./conversation.css"
import axios from "axios";

const Conversation = ({ conversation, currentUser, unreadCount }) => {
  const [user, setUser] = useState(null);


  useEffect(() => {
    const friendId = conversation.members.find(m => m !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await axios(`${import.meta.env.VITE_API_URL}/users?userId=${friendId}`)
        setUser(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    getUser();
  }, [conversation.members, currentUser])

  return (
    <div className="conversation">
     <div style={{position:"relative"}}>

      <img src={user?.profilePicture || '/assets/person/defaultProfileImg.png'} alt="" className="conversationImg" />
       {unreadCount > 0 && (
          <div className="unreadBadge">{unreadCount}</div>
      )}
     </div>
      <span className="conversationName">{user?.username}</span>
      
    </div>
  )
}

export default Conversation
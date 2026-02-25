import { useEffect, useState } from 'react'
import Feed from '../../components/feed/Feed'
import Rightbar from '../../components/rightbar/Rightbar'
import Sidebar from '../../components/sidebar/Sidebar'
import Topbar from '../../components/topbar/Topbar'
import './profile.css'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const Profile = () => {
  const [user, setUser] = useState({});

  const username = useParams().username;
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/users?username=${username}`)
        setUser(res.data)
      } catch (err) { console.log(err) }
    }
    fetchData();
  }, [username])




  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img src={user.coverPicture || "/assets/person/defaultCoverImg.jpg"} alt="" className="profileCoverImg" />
              <img src={user.profilePicture || "/assets/person/defaultProfileImg.png"} alt="" className="profileUserImg" />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
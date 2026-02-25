import { useNavigate } from "react-router-dom"
import "./online.css"

const Online = ({user}) => {
    const navigate = useNavigate()
    const handleClick = ()=>{
        
        navigate("/messenger?u=" + user._id)
    }
    return (
        
            <li className="rightbarFriend" onClick={handleClick}>
                <div className="rightbarProfileImgContainer">
                    <img src={user.profilePicture || '/assets/person/defaultProfileImg.png'} alt="" className="rightbarProfileImg" />
                    <span className="rightbarOnline"></span>
                </div>
                <span className="rightbarUsername">{user.username}</span>
            </li>
      
    )
}

export default Online
import './topbar.css'
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link, useNavigate } from 'react-router-dom';

import { AuthContext } from '../../context/AuthCreateContext';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';


const Topbar = () => {
    const { user, socket, logout } = useContext(AuthContext)
    const [unreadCount, setUnreadCount] = useState(0);
    const [onlineUsers, setOnlineUsers] = useState([])
    const navigate = useNavigate();
    useEffect(() => {
        if (!user || !socket.current) return;

        const handleUsers = (users) => {
            const filtered = user.followings.filter((f) =>
                users.some((u) => u.userId === f)
            );

            setOnlineUsers(filtered);
        };

        socket.current.on("getUsers", handleUsers);

        // 🔥 Request latest users list
        socket.current.emit("addUser", user._id);

        return () => {
            socket.current.off("getUsers", handleUsers);
        };

    }, [user, socket.current]);



    useEffect(() => {
        const fetchUnread = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/messages/unread/${user?._id}`
                );

                setUnreadCount(res.data.count);
            } catch (err) {
                console.log(err);
            }
        };

        fetchUnread();
    }, [user]);


    return (
        <div className='topbarContainer'>
            <div className="topbarLeft">
                <Link to='/' style={{ textDecoration: "none" }} ><span className="logo">Marufsocial</span></Link>
            </div>
            <div className="topbarCenter">
                <div className="searchbar">
                    <SearchIcon className='searchIcon' />
                    <input type="search" name="" placeholder='Search for friend, post or video' className='searchInput' />
                </div>
            </div>
            <div className="topbarRight">
                <div className="topbarLinks">

                    <Link style={{ textDecoration: "none", color: "white" }} to="/">Home</Link>

                </div>
                <div className="topbarIcons">
                    <div className="topbarIconItem">
                        <PersonIcon />
                        {onlineUsers?.length > 0 &&
                            <span className="topbarIconBadge">{onlineUsers?.length}</span>
                        }
                    </div>
                    <div className="topbarIconItem">
                    <div onClick={()=>{navigate("/messenger")}}>
                            <ChatIcon />
                        {
                            unreadCount > 0 && <span className="topbarIconBadge">{unreadCount}</span>
                        }
                        </div>

                    </div>
                    <div className="topbarIconItem">
                        <NotificationsIcon />
                        <span className="topbarIconBadge">1</span>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Link to={`/profile/${user?.username}`}>
                        <img src={user?.profilePicture || "/assets/person/defaultProfileImg.png"} alt="" className="topbarImg" />

                    </Link>
                    <span onClick={logout} style={{ marginLeft: "10px", cursor: "pointer" }}><LogoutIcon /></span>
                </div>
            </div>
        </div>
    )
}

export default Topbar
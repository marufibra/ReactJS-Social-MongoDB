import './navBar.scss'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Link } from 'react-router-dom';
import { DarkModeContext } from '../../Context/darkModeContext';
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContext';

function NavBar() {
    const { toggle, darkMode } = useContext(DarkModeContext);
    const { currentUser, logout } = useContext(AuthContext);
    return (
        <div className='navBar'>
            <div className="left">
                <Link to='/' style={{ textDecoration: "none" }}>
                    <span>marufSocial</span>
                </Link>
                <HomeOutlinedIcon />
                {darkMode ? <WbSunnyOutlinedIcon onClick={toggle} /> : <DarkModeOutlinedIcon onClick={toggle} />}
                <GridViewOutlinedIcon />
                <div className='search'>
                    <SearchOutlinedIcon />
                    <input type="search" name="" id="" placeholder="Search..." />
                </div>
            </div>
            <div className="right">
                <PersonOutlineOutlinedIcon />
                <EmailOutlinedIcon />
                <NotificationsOutlinedIcon />
                <div className="user">
                    

                        <Link to={`/profile/${currentUser.id}`}><img src={currentUser.profilePic} alt="" /></Link>
                        <Link to={`/profile/${currentUser.id}`} style={{textDecoration:"none",color:'inherit'}}><span>{currentUser.name}</span></Link>
                    
                </div>
                <div className='login-logout'>{currentUser ? <span onClick={logout}>Logout</span> : <span>Login</span>}</div>
            </div>
        </div>
    )
}

export default NavBar
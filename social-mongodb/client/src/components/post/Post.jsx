import './post.css'
import MoreVertIcon from '@mui/icons-material/MoreVert';
// import { Users } from '../../../dummyData';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthCreateContext';



const Post = ({ post }) => {
    // const user = Users.filter(u=>u.id===1);//will give you an array
    // console.log(user[0].username)//will give you an object then value

    const [like, setLike] = useState(post.likes.length)

    const [user, setUser] = useState({});
    const { user: currentUser } = useContext(AuthContext);

    const [isLiked, setIsLiked] = useState(
        post.likes.includes(currentUser._id)
    );


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/users?userId=${post.userId}`)
                setUser(res.data)
            } catch (err) { console.log(err) }
        }
        fetchData();
    }, [post.userId])

 


    const likeHandler = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/posts/${post._id}/likes`, { userId: currentUser._id })

        } catch (err) {
            console.log(err.message)
        }

        setLike(prev => (isLiked ? prev - 1 : prev + 1));
        setIsLiked(prev => !prev);
    }
    return (
        < div className='post' >
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`/profile/${user.username}`}>
                            <img className='postProfileImg' src={user.profilePicture || '/assets/person/defaultProfileImg.png'} alt="" />
                        </Link>
                        <Link to={`/profile/${user.username}`} style={{ textDecoration: "none", color: "inherit" }}>
                            <span className="postUsername">
                                {user.username}
                            </span>
                        </Link>
                        <span className="postDate">{moment(post.createdAt).fromNow()}</span>
                    </div>
                    <div className="postTopRight">
                        <MoreVertIcon />
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">{post?.desc}</span>
                    <img className='postImg' src={post?.img} alt="" />
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <img src="/assets/like.png" alt="" className="likeIcon" onClick={likeHandler} />
                        <img src="/assets/heart.png" alt="" className="likeIcon" onClick={likeHandler} />
                        <span className="postLikeCounter">{like} people like it</span>
                    </div>
                    <div className="postBottomRight">
                        <span className="postCommentText">{post.comment} comments</span>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Post
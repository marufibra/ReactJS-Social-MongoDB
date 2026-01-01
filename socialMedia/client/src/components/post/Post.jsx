import './post.scss';
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from 'react-router-dom'
import Comments from '../comments/Comments';
import { useContext, useState } from 'react';
import moment from 'moment';
import { makeRequest } from '../../axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthContext } from '../../Context/AuthContext';

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Post = ({ post }) => {
    const [commentOpen, setCommentOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { currentUser } = useContext(AuthContext);

    const { isLoading, error, data = [] } = useQuery({
        queryKey: ["likes", post?.id],
        queryFn: () =>
            makeRequest.get("/likes?postId=" + post.id).then(res => res.data),
        enabled: !!post?.id, // don't run query until post.id exists
    });

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: (liked) => {
            if (liked) return makeRequest.delete("/likes?postId=" + post.id);
            return makeRequest.post("/likes", { postId: post.id });
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['likes', post.id] }) //Invalidate only the current post’s likes
        },
    })

    const handleLike = () => {
        mutation.mutate(data.includes(currentUser.id)) //returns true or false
    }


    const deleteMutation = useMutation({
        mutationFn: (postId) => {

            return makeRequest.delete("/posts/" + postId);
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
    })
    const handleDeletePost = () => {
        deleteMutation.mutate(post.id)
    }

    return (
        <div className='post'>
            <div className="container">
                <div className="user">
                    <div className="userInfo">
                        <img src={post.profilePic} alt="" />
                        <div className="details">
                            <Link to={`/profile/${post.userId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <span className='name'>{post.name}</span>
                            </Link>
                            <span className='date'>{moment(post.createdAt).fromNow()}</span>
                        </div>
                    </div>
                    <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
                    {menuOpen && post.userId === currentUser.id && (
                        <button onClick={handleDeletePost}>Delete</button>
                    )}
                </div>
                <div className="content">
                    <p>{post.desc}</p>
                    <img src={post.img} alt="" />
                </div>
                <div className="info">
                    <div className="item">
                        {error ?
                            "Something went wrong!"
                            : isLoading
                                ? <Skeleton height={200} />
                                : data.includes(currentUser.id) ? <FavoriteOutlinedIcon style={{ color: "red" }} onClick={handleLike} /> : <FavoriteBorderOutlinedIcon onClick={handleLike} />}
                        {error ?
                            "Something went wrong!"
                            : isLoading
                                ? <Skeleton height={200} />
                                : data.length} likes
                    </div>

                    <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
                        <TextsmsOutlinedIcon />
                        12 Comments
                    </div>

                    <div className="item">
                        <ShareOutlinedIcon />
                        Share
                    </div>
                </div>
                {commentOpen && <Comments postId={post.id} />}
            </div>
        </div>
    )
}

export default Post

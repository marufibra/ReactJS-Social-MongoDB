// import './share.css'
// import PermMediaIcon from '@mui/icons-material/PermMedia';
// import LabelIcon from '@mui/icons-material/Label';
// import RoomIcon from '@mui/icons-material/Room';
// import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
// import { useContext, useRef, useState } from 'react';
// import { AuthContext } from '../../context/AuthCreateContext';
// import axios from 'axios';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { makeRequest } from '../../axios';

// const Share = () => {
//     const { user } = useContext(AuthContext);
//     const desc = useRef();
//     const [file, setFile] = useState(null)

//     const upload = async () => {
//         if (!file) return null;// No uploads when there is no file
//         try {
//             const formData = new FormData();
//             formData.append('file', file);

//             const url = `${import.meta.env.VITE_API_URL}/upload`;

//             const res = await axios.post(url, formData);
//             // console.log (res.data.url);
//             return res.data.url; // Cloudinary URL
//         } catch (err) {
//             console.log(err);
//         }
//     };



//     const queryClient = useQueryClient()
//     const mutation = useMutation({
//         mutationFn: (newComment) => {
//             return makeRequest.post("/posts", newComment)
//         },
//         onSuccess: () => {
//             // Invalidate and refetch
//             queryClient.invalidateQueries({ queryKey: ['posts'] })
//         },
//     })


//     const submitHandler = async (e) => {
//         e.preventDefault();
//         const imgUrl = await upload();
//         const newPost = {
//             userId: user._id,
//             desc: desc.current.value,
//             img: file ? imgUrl : "",
//         }


//             mutation.mutate(newPost)
//             // await axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost)
//             // window.location.reload();


//     }
//     return (
//         <div className='share'>
//             <div className="shareWrapper">
//                 <div className="shareTop">
//                     <img src={user.profilePicture || "/assets/person/defaultProfileImg.png"} alt={user.username} className="shareProfileImg" />
//                     <input ref={desc} placeholder={`What's in your mind ${user.username}?`} type="text" className="shareInput" />
//                 </div>
//                 <hr className='shareHr' />
//                 <form className="shareBottom" onSubmit={submitHandler}>
//                     <div className="shareOptions">
//                         <label htmlFor={file} className="shareOption">
//                             <PermMediaIcon htmlColor='tomato' className='shareIcon' />
//                             <span className='shareOptionText'>Photo or Video</span>
//                             <input style={{ display: "none" }} type="file" id="file" accept='.png,.jpeg,.jpg' onChange={e => setFile(e.target.files[0])} />
//                         </label>
//                         <div className="shareOption">
//                             <LabelIcon htmlColor='blue' className='shareIcon' />
//                             <span className='shareOptionText'>Tag</span>
//                         </div>
//                         <div className="shareOption">
//                             <RoomIcon htmlColor='green' className='shareIcon' />
//                             <span className='shareOptionText'>Location</span>
//                         </div>
//                         <div className="shareOption">
//                             <EmojiEmotionsIcon htmlColor='goldenrod' className='shareIcon' />
//                             <span className='shareOptionText'>Feelings</span>
//                         </div>
//                     </div>
//                     <button type='submit' className="shareButton">Share</button>
//                 </form>
//             </div>
//         </div>
//     )
// }

// export default Share





import './share.css'
import PermMediaIcon from '@mui/icons-material/PermMedia';
import LabelIcon from '@mui/icons-material/Label';
import RoomIcon from '@mui/icons-material/Room';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { useContext, useRef, useState } from 'react';
import { AuthContext } from '../../context/AuthCreateContext';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import CancelIcon from '@mui/icons-material/Cancel';
import Overlay from '../overlay/Overlay';
const Share = () => {
    const { user } = useContext(AuthContext);
    const desc = useRef();
    const [file, setFile] = useState(null);
    const [overlay, setOverlay] = useState(false)

    const queryClient = useQueryClient();

    // 🔹 Mutation handles BOTH upload + post creation
    const mutation = useMutation({
        mutationFn: async (newPost) => {
            let imgUrl = "";

            if (file) {
                const formData = new FormData();
                formData.append("file", file);

                const uploadRes = await axios.post(
                    `${import.meta.env.VITE_API_URL}/upload`,
                    formData
                );

                imgUrl = uploadRes.data.url;
            }

            return makeRequest.post("/posts", {
                ...newPost,
                img: imgUrl,
            });
        },

        onSuccess: () => {
            // Clear form
            desc.current.value = "";
            setFile(null);

            // Refetch posts
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },

        onError: (error) => {
            console.log("Post creation failed:", error.message);
        },
    });

    const submitHandler = (e) => {
        e.preventDefault();

        mutation.mutate({
            userId: user._id,
            desc: desc.current.value,
        });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setOverlay(true)

    }

    const handleCancelImg = () => {
        setFile(null);
        setOverlay(false)
    }
    return (
        <>

            {overlay && <Overlay />}
            <div className="share" style={{ zIndex: !file ? 8 : 11 }}>
                <div className="bg"></div>
                <div className="shareWrapper">
                    <div className="shareTop">
                        <img
                            src={user.profilePicture || "/assets/person/defaultProfileImg.png"}
                            alt={user.username}
                            className="shareProfileImg"
                        />
                        <input
                            ref={desc}
                            placeholder={`What's in your mind ${user.username}?`}
                            type="text"
                            className="shareInput"
                        />
                    </div>

                    <hr className="shareHr" />


                    {file && (
                        <div className="shareImgContainer">
                            <img className='shareImg' src={URL.createObjectURL(file)} alt="" />
                            <CancelIcon className="shareCancelImg" onClick={handleCancelImg} />

                        </div>
                    )}
                    <form className="shareBottom" onSubmit={submitHandler}>
                        <div className="shareOptions">
                            <label htmlFor="file" className="shareOption" >
                                <PermMediaIcon htmlColor="tomato" className="shareIcon" />
                                <span className="shareOptionText">Photo or Video</span>
                                <input
                                    style={{ display: "none" }}
                                    type="file"
                                    id="file"
                                    accept=".png,.jpeg,.jpg"
                                    onChange={handleFileChange}
                                />
                            </label>

                            <div className="shareOption">
                                <LabelIcon htmlColor="blue" className="shareIcon" />
                                <span className="shareOptionText">Tag</span>
                            </div>

                            <div className="shareOption">
                                <RoomIcon htmlColor="green" className="shareIcon" />
                                <span className="shareOptionText">Location</span>
                            </div>

                            <div className="shareOption">
                                <EmojiEmotionsIcon htmlColor="goldenrod" className="shareIcon" />
                                <span className="shareOptionText">Feelings</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="shareButton"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ?
                                <Box sx={{ display: 'flex', justifyContent: "center" }}>

                                    <CircularProgress size={18} thickness={5} style={{ color: "white" }} />
                                </Box>
                                : "Share"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Share;

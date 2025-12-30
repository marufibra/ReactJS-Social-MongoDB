import { useContext, useState } from 'react';
import './comments.scss';
import { AuthContext } from '../../Context/AuthContext'
import { useQuery, useMutation, useQueryClient, } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import moment from 'moment';

const Comments = ({ postId }) => {
    const [desc, setDesc] = useState("")
    const { currentUser } = useContext(AuthContext);

    const { isLoading, error, data } = useQuery({
        queryKey: ["comments",postId],
        queryFn: () =>
            makeRequest.get("/comments?postId=" + postId).then(res => res.data),
    });

    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: (newComment) => {
            return makeRequest.post("/comments", newComment)
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['comments',postId] })
        },
    })


    const handleClick = async (e) => {
        e.preventDefault();
        mutation.mutate({ desc, postId })
        setDesc("");

    }


    // const comments = [
    //     {
    //         id: 1,
    //         desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam",
    //         name: "John Doe",
    //         userId: 1,
    //         profilePicture:
    //             "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    //     },
    //     {
    //         id: 2,
    //         desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam",
    //         name: "Jane Doe",
    //         userId: 2,
    //         profilePicture:
    //             "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
    //     },
    // ];
    return (
        <div className='comments'>
            <div className="write">
                <img src={currentUser.profilePic} alt="" />
                <input
                    type="text"
                    placeholder="Write a comment"
                    onChange={(e)=>setDesc(e.target.value)}
                    value={desc}
                />
                <button onClick={handleClick}>Send</button>
            </div>
            {error
                ? "Something went wrong!"
                : isLoading
                    ? "Loading"
                    : data.map((comment) => (
                        <div className='comment'>
                            <img src={comment.profilePic} alt="" />
                            <div className="info">
                                <span>{comment.name}</span>
                                <p>{comment.desc}</p>
                            </div>
                            <span className='date'>{moment(comment.createdAt).fromNow()}</span>
                        </div>
                    ))
            }
        </div>
    )
}

export default Comments
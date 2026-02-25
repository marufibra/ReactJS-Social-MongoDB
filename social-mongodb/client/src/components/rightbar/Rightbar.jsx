
import "./rightbar.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthCreateContext";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Users } from "../../../dummyData"
import Online from "../online/Online"
const HomeRightbar = ({onlineFriends}) => {
    
    return (
        <>
            <div className="birthdayContainer">
                <img src="/assets/gift.png" alt="" className="birthdayImg" />
                <span className="birthdayText">
                    <strong>Emmanuel Aboagye</strong> and <strong>3 other friends</strong> have a birthday today
                </span>
            </div>
            <img src="/assets/ad.png" alt="" className="rightbarAd" />
            <h4 className="rightbarTitle">Online Friends</h4>
            <ul className="rightbarFriendList">
                {onlineFriends.map((user) => (
                    <Online key={user._id} user={user} />
                ))}
            </ul>
        </>
    );
};

const ProfileRightbar = ({ user }) => {
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const queryClient = useQueryClient();

  
    // Normalize user IDs
    const userId = user?._id?.$oid ?? user?._id;
    const currentUserId = currentUser?._id?.$oid ?? currentUser?._id;

    // Track follow state locally for optimistic updates
    const [isFollowed, setIsFollowed] = useState(
        currentUser.followings.includes(userId)
    );
   
    // Sync if currentUser.followings changes
    useEffect(() => {
        setIsFollowed(currentUser.followings.includes(userId));
    }, [currentUser.followings, userId]);

    // Fetch friends
    const { data: friends = [] } = useQuery({
        queryKey: [userId],
        queryFn: () => makeRequest.get(`/users/friends/${userId}`).then(res => res.data),
        enabled: !!userId,
    });

    // Follow/unfollow mutation
    const mutation = useMutation({
        mutationFn: ({ follow }) => {
            return follow
                ? makeRequest.put(`/users/${userId}/follow`, { userId: currentUserId })
                : makeRequest.put(`/users/${userId}/unfollow`, { userId: currentUserId });
        },
        onSuccess: (_, variables) => {
            dispatch({
                type: variables.follow ? "FOLLOW" : "UNFOLLOW",
                payload: userId,
            });

            queryClient.invalidateQueries({ queryKey: [userId] });
        },
    });

    const handleClick = () => {
        mutation.mutate({ follow: !isFollowed });
    };

    return (
        <>
            {user.username !== currentUser.username && (
                <button className="rightbarFollowButton" onClick={handleClick}>
                    {isFollowed ? <>Unfollow <RemoveIcon /></> : <>Follow <AddIcon /></>}
                </button>
            )}

            <h4 className="rightbarTitle">User information</h4>
            <div className="rightbarInfo">
                <div className="rightbarInfoItem">
                    <span className="rightbarInfoKey">City:</span>
                    <span className="rightbarInfoValue">{user.city}</span>
                </div>
                <div className="rightbarInfoItem">
                    <span className="rightbarInfoKey">From:</span>
                    <span className="rightbarInfoValue">{user.from}</span>
                </div>
                <div className="rightbarInfoItem">
                    <span className="rightbarInfoKey">Relationship:</span>
                    <span className="rightbarInfoValue">
                        {user.relationship === 1
                            ? "Single"
                            : user.relationship === 2
                                ? "Married"
                                : user.relationship === 3
                                    ? "Prefer not to say"
                                    : ""}
                    </span>
                </div>
            </div>

            <h4 className="rightbarTitle">User friends</h4>
            <div className="rightbarFollowings">
                {friends.map(friend => (
                    <Link
                        key={friend._id}
                        to={`/profile/${friend.username}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                    >
                        <div className="rightbarFollowing">
                            <img
                                src={friend.profilePicture || "/assets/person/defaultProfileImg.png"}
                                alt={friend.username}
                                className="rightbarFollowingImg"
                            />
                            <span className="rightFollowingName">{friend.username}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
};

const Rightbar = ({ user, onlineFriends }) => {
    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
                {user ? <ProfileRightbar user={user} /> : <HomeRightbar onlineFriends={onlineFriends} />}
            </div>
        </div>
    );
};

export default Rightbar;


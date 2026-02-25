import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthCreateContext";
import { makeRequest } from "../../axios";
import { useQuery } from "@tanstack/react-query";

const Feed = ({ username }) => {
  const { user } = useContext(AuthContext);

  const {
    isLoading,
    error,
    data: posts = [],
  } = useQuery({
    queryKey: ["posts", username, user._id],
    queryFn: () => {
      if (username) {
        return makeRequest
          .get(`/posts/profile/${username}`)
          .then(res => res.data);
      }
      return makeRequest
        .get(`/posts/timeline/${user._id}`)
        .then(res => res.data);
    },
    enabled: !!user?._id,
  });

  if (isLoading) {
    return <div className="feed">Loading posts...</div>;
  }

  if (error) {
    return <div className="feed">Failed to load posts</div>;
  }

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) ? <Share/> : <div style={{marginBottom:"-30px"}}></div>}
       
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;

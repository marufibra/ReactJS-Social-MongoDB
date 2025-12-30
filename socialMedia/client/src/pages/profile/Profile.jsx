import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts"
import { makeRequest } from "../../axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import DefaultProfilePic from "../../assets/defaultProfilePic.jpg"
import DefaultCoverPic from "../../assets/defaultCoverPic.jpg"
import Update from "../../components/update/Update";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const userId = parseInt(useLocation().pathname.split("/").at(-1));

  const { isLoading, error, data = [null] } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      makeRequest.get("/users/find/" + userId).then(res => res.data),
    //enabled: !!post?.id, // don't run query until post.id exists
  });


  const { data: relationshipData = [null] } = useQuery({
    queryKey: ["relationship"],
    queryFn: () =>
      makeRequest.get("relationships?followedUserId=" + userId).then(res => res.data),
    //enabled: !!post?.id, // don't run query until post.id exists
  });


  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (following) => {
      if (following) return makeRequest.delete("/relationships?userId=" + userId);
      return makeRequest.post("/relationships", { userId });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['relationship'] }) //Invalidate only the current post’s likes
    },
  })


    const handleFollow = () => {
        mutation.mutate(relationshipData.includes(currentUser.id)) //returns true or false
    }


  return (
    <div className="profile">
      {error ? "Something went wrong!"
        : isLoading
          ? "Loading"
          :
          <>
            <div className="images">
              <img
                src={data?.coverPic || DefaultCoverPic}
                alt={data.name}
                className="cover"
              />
              <img
                src={data?.profilePic || DefaultProfilePic}
                alt={data?.name}
                className="profilePic"
              />
            </div>
            <div className="profileContainer">
              <div className="uInfo">
                <div className="left">
                  <a href="http://facebook.com">
                    <FacebookTwoToneIcon fontSize="large" />
                  </a>
                  <a href="http://facebook.com">
                    <InstagramIcon fontSize="large" />
                  </a>
                  <a href="http://facebook.com">
                    <TwitterIcon fontSize="large" />
                  </a>

                </div>
                <div className="center">
                  <span>{data.name}</span>
                  <div className="info">
                    <div className="item">
                      <PlaceIcon />
                      <span>{data.city}</span>
                    </div>
                    <div className="item">
                      <LanguageIcon />
                      <span>{data.website}</span>
                    </div>
                  </div>
                  {currentUser.id === userId
                    ? <button onClick={()=>setOpenUpdate(true)}>update</button>
                    : <button onClick={handleFollow}>{relationshipData.includes(currentUser.id)
                      ? "Following"
                      : "Follow"}
                    </button>}

                </div>
                <div className="right">
                  <EmailOutlinedIcon />
                  <MoreVertIcon />
                </div>
              </div>
              <Posts userId={userId}/>
            </div>

          </>
      }
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
      
    </div>

  );
};

export default Profile;

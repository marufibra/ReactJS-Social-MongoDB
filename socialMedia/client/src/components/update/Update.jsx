import { useState } from "react"
import "./update.scss"
import { AuthContext } from "../../Context/AuthContext"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { makeRequest } from "../../axios"
import axios from "axios"

const Update = ({ setOpenUpdate, user }) => {
  const [cover, setCover] = useState(null)
  const [profile, setProfile] = useState(null)
  const [texts, setTexts] = useState({
    name: "",
    city: "",
    website: "",
  });


  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (user) => {
      return makeRequest.put("/users", user)
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

  const handleClick = async (e) => {
    e.preventDefault();
    let coverUrl;
    let profileUrl;
    
    coverUrl = cover ? await upload(cover) : user.coverPic;
    profileUrl = profile ? await upload(profile) : user.profilePic;

    mutation.mutate({ ...texts, coverPic:coverUrl, profilePic:profileUrl });
    setOpenUpdate(false);
  }

  const upload = async (file) => {
    if (!file) return null;// No uploads when there is no file
    try {
      const formData = new FormData();
      formData.append('file', file);

      const url = `${import.meta.env.VITE_API_URL}/upload`;

      const res = await axios.post(url, formData);
      // console.log (res.data.url);
      return res.data.url; // Cloudinary URL
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value, }));
  };


  return (
    <div className="update">
      Update
      <form>
        cover <input type="file" onChange={(e) => setCover(e.target.files[0])} />
        profile <input type="file" onChange={(e) => setProfile(e.target.files[0])} />
        <input type="text" name="name" onChange={handleChange} />
        <input type="text" name="city" onChange={handleChange} />
        <input type="text" name="website" onChange={handleChange} />
        <button onClick={handleClick}>Update</button>
      </form>
      <button onClick={() => setOpenUpdate(false)}>X</button>
    </div>
  )
}

export default Update
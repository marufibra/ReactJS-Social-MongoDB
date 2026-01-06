
import './rightBar.scss'


import { useNavigate } from "react-router-dom";


function RightBar() {
  const navigate = useNavigate();
  const friendsImg = "https://cdn.pixabay.com/photo/2022/12/07/02/58/ai-generated-7640108_1280.jpg"

  // const [onlineFriends, setOnlineFriends] = useState([])

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // const url = `${import.meta.env.VITE_API_URL}/posts${cat ? `?cat=${cat}` : ""}`;
  //       const res = await axios.get(`${import.meta.env.VITE_API_URL}/onlinefriends`);
  //       setOnlineFriends(res.data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   fetchData();
  // }, []);

  return (
    <div className='rightBar'>
      <div className="container">
        <div className="item">
          <span>Suggestions For You</span>
          <div className="user">
            <div className="userInfo">
              <img src={friendsImg} alt="" />
              <span>Jane Doe</span>
            </div>
            <div className="buttons">
              <button>follow</button>
              <button>dismiss</button>
            </div>
          </div>

          <div className="user">
            <div className="userInfo">
              <img src={friendsImg} alt="" />
              <span>Jane Doe</span>
            </div>
            <div className="buttons">
              <button>follow</button>
              <button>dismiss</button>
            </div>
          </div>
        </div>

        {/* LAST ACTIVITY */}
        <div className="item">
          <span>Latest Activities</span>
          <div className="user">
            <div className="userInfo">
              <img src={friendsImg} alt="" />
              <p>
                <span>Jane Doe</span> changed their cover
              </p>
            </div>
            <span>1 min ago</span>
          </div>

          <div className="user">
            <div className="userInfo">
              <img src={friendsImg} alt="" />
              <p>
                <span>Jane Doe</span> changed their cover
              </p>
            </div>
            <span>1 min ago</span>
          </div>

          <div className="user">
            <div className="userInfo">
              <img src={friendsImg} alt="" />
              <p>
                <span>Jane Doe</span> changed their cover
              </p>
            </div>
            <span>1 min ago</span>
          </div>

          <div className="user">
            <div className="userInfo">
              <img src={friendsImg} alt="" />
              <p>
                <span>Jane Doe</span> changed their cover
              </p>
            </div>
            <span>1 min ago</span>
          </div>
        </div>

        {/* ONLINE FRIENDS */}
        <div className="item">
          <span>Online Friends</span>
          <div
            className="user chatUser"
            onClick={() => navigate(`/chat/2`)}
          >
            <div className="userInfo">
              <img src={friendsImg} alt="" />
              <div className='online' />
              <span>Jane Doe</span>
            </div>
          </div>

          <div
            className="user chatUser"
            onClick={() => navigate(`/chat/3`)}
          >
            <div className="userInfo">
              <img src={friendsImg} alt="" />
              <div className='online' />
              <span>Jane Doe</span>
            </div>
          </div>

          <div
            className="user chatUser"
            onClick={() => navigate(`/chat/6`)}
          >
            <div className="userInfo">
              <img src={friendsImg} alt="" />
              <div className='online' />
              <span>Jane Doe</span>
            </div>
          </div>

          <div
            className="user chatUser"
            onClick={() => navigate(`/chat/3`)}
          >
            <div className="userInfo">
              <img src={friendsImg} alt="" />
              <div className='online' />
              <span>Jane Doe</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default RightBar
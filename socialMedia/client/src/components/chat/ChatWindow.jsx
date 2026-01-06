import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import Message from "./Message";
import ChatSkeleton from "./ChatSkeleton";
import ChatInput from "./ChatInput";

const ChatWindow = ({ receiverId }) => {
  const { currentUser } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  /* ---------------- LOAD CHAT ---------------- */
  useEffect(() => {
    setLoading(true);
    setMessages([]);
    setPage(1);

    axios
      .get(`${import.meta.env.VITE_API_URL}/messages/${receiverId}`, {
        params: { page: 1, limit: 20 },
      })
      .then((res) => {
        setMessages(res.data);
        setHasMore(res.data.length === 20);
      })
      .finally(() => setLoading(false));
  }, [receiverId]);

  /* ---------------- LOAD MORE ---------------- */
  const loadMore = async () => {
    if (!hasMore) return;

    const nextPage = page + 1;

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/messages/${receiverId}`,
      {
        params: { page: nextPage, limit: 20 },
      }
    );

    setMessages((prev) => [...res.data, ...prev]);
    setPage(nextPage);
    setHasMore(res.data.length === 20);
  };

  if (loading) return <ChatSkeleton />;

  return (
    <div className="chatWindow">
      {hasMore && (
        <button className="loadMore" onClick={loadMore}>
          Load older messages
        </button>
      )}

      {messages.map((msg) => (
        <Message
          key={msg.id}
          msg={msg}
          isOwn={msg.sender_id === currentUser.id}
        />
      ))}

      <ChatInput receiverId={receiverId} setMessages={setMessages} />
    </div>
  );
};

export default ChatWindow;

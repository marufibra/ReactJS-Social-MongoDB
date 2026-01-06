import { useEffect, useState, useContext } from "react";
import { socket } from "../../socket";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../../Context/AuthContext";
import { useParams } from "react-router-dom";
import "./chatWindow.scss";
import axios from "axios";

const ChatWindow = () => {
  const { id: receiverId } = useParams();
  const { currentUser } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  /* ================= REGISTER USER ================= */
  useEffect(() => {
    if (currentUser?.id) {
      socket.emit("addUser", currentUser.id); // ✅ NEW (VERY IMPORTANT)
    }
  }, [currentUser?.id]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = () => {
    if (!message.trim()) return;

    const tempId = uuid();

    socket.emit("sendMessage", {
      senderId: currentUser.id,
      receiverId,
      text: message,
      tempId,
    });

    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        senderId: currentUser.id,
        receiverId,
        text: message,
        status: "sent",
      },
    ]);

    setMessage("");
  };

  /* ================= DELIVERED ================= */
  useEffect(() => {
    const handler = ({ tempId, messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId
            ? { ...msg, id: messageId, status: "delivered" }
            : msg
        )
      );
    };

    socket.on("messageDelivered", handler);
    return () => socket.off("messageDelivered", handler);
  }, []);

  /* ================= RECEIVE MESSAGE ================= */
  useEffect(() => {
    const handler = (msg) => {
      setMessages((prev) => {
        // 🔧 FIX: prevent duplicates
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("receiveMessage", handler);
    return () => socket.off("receiveMessage", handler);
  }, []);

  /* ================= SEEN (EMIT) ================= */
  useEffect(() => {
    messages.forEach((msg) => {
      if (
        msg.senderId !== currentUser.id &&
        msg.status !== "seen"
      ) {
        socket.emit("messageSeen", {
          senderId: msg.senderId,
          messageId: msg.id,
        });
      }
    });
  }, [messages, currentUser.id]);

  /* ================= SEEN (LISTEN) ================= */
  useEffect(() => {
    const handler = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, status: "seen" } : msg
        )
      );
    };

    socket.on("messageSeen", handler);
    return () => socket.off("messageSeen", handler);
  }, []);

  /* ================= LOAD CHAT HISTORY ================= */
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/messages/${receiverId}`,
          { withCredentials: true }
        );

        const normalized = res.data.map((msg) => ({
          id: msg.id,
          senderId: msg.sender_id,
          receiverId: msg.receiver_id,
          text: msg.text,
          status: msg.status || "delivered",
        }));

        setMessages(normalized);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [receiverId]);

  /* ================= UI ================= */
  return (
    <div className="chatWindow">
      <div className="chatHeader">
        <span>Chat</span>
      </div>

      <div className="chatMessages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${
              msg.senderId === currentUser.id ? "own" : ""
            }`}
          >
            <p>{msg.text}</p>
            <span className="status">
              {msg.status === "sent" && "✓"}
              {msg.status === "delivered" && "✓✓"}
              {msg.status === "seen" && "✓✓"}
            </span>
          </div>
        ))}
      </div>

      <div className="chatInput">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;

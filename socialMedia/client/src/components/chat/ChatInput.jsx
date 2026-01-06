import { useState, useContext } from "react";
import { AuthContextProvider } from "../../Context/AuthContextProvider";
import { socket } from "../../socket";


const ChatInput = () => {
  const [text, setText] = useState("");
  const { currentUser } = useContext(AuthContextProvider);

  const handleSend = () => {
    if (!text) return;

    socket.emit("sendMessage", {
      senderId: currentUser.id,
      receiverId: 2, // selected chat user
      text,
    });

    setText("");
  };

  return (
    <div className="chatInput">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatInput;


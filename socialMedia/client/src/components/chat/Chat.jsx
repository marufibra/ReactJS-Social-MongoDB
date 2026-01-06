import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import "./chat.scss";

const Chat = () => {
  return (
    <div className="chat">
      <ChatList />
      <ChatWindow />
    </div>
  );
};

export default Chat;

const ChatList = () => {
  return (
    <div className="chatList">
      <h3>Chats</h3>

      {[1, 2, 3].map((c) => (
        <div className="chatUser" key={c}>
          <img src="/avatar.png" alt="" />
          <div>
            <span>John Doe</span>
            <p>Last message preview...</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;

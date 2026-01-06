const Message = ({ own }) => {
  return (
    <div className={`message ${own ? "own" : ""}`}>
      <div className="messageContent">
        Hello, this is a message
        <span className="messageStatus">✓✓</span>
      </div>
    </div>
  );
};

export default Message;

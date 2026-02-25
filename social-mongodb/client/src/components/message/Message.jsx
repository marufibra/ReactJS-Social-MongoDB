import "./message.css"
import moment from 'moment'

const MessageText = ({ message, setImgPath, setOverlay }) => {
  return (
    <>
      {message.text ? <p className="messageText">{message.text}</p> : <img onClick={() => { setImgPath(message.img); setOverlay(true) }} style={{ width: "100px", cursor: "pointer" }} src={message.img}></img>}
    </>
  )
}

const Message = ({ message, own, setReplyText, setOwner, setImgPath, setOverlay }) => {


  return (
    <div className={own ? "message own" : "message"}>

      <div className="messageTop">

        {
          own ? <>
            
            <img className="replyIcon" src="/assets/miscImg/reply.png" alt="" onClick={() => { setReplyText(message.text); setOwner("sender") }} />
            <span className="ticks">
              {message.status === "sent" && "✓"}
              {message.status === "delivered" && "✓✓"}
              {message.status === "read" && (
                <span style={{ color: "#34B7F1" }}>✓✓</span>
              )}
            </span>
             <MessageText setImgPath={setImgPath} message={message} setOverlay={setOverlay} /></> :
            <><MessageText setImgPath={setImgPath} message={message} setOverlay={setOverlay} /><img className="replyIcon" style={{ transform: "rotate(180deg)" }} src="/assets/miscImg/reply.png" alt="" onClick={() => { setReplyText(message.text); setOwner("receiver") }} /></>
        }

      </div>

      <div className="messageBottom">{moment(message.createdAt).fromNow()}</div>
    </div>
  )
}

export default Message
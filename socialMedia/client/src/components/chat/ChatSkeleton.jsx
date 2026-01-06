import Skeleton from "react-loading-skeleton";

const ChatSkeleton = () => {
  return (
    <div className="chatSkeleton">
      {Array(8)
        .fill()
        .map((_, i) => (
          <div key={i} className="skeletonMessage">
            <Skeleton height={20} width="60%" />
          </div>
        ))}
    </div>
  );
};

export default ChatSkeleton;


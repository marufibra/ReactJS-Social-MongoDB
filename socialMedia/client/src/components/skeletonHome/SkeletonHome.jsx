import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./skeletonHome.scss";

const SkeletonHome = () => {
  return (
    <div className="skeletonLayout">

      {/* ===== LEFT BAR ===== */}
      <div className="skeletonLeft">
        {Array(6).fill().map((_, i) => (
          <div className="leftItem" key={i}>
            <Skeleton circle width={30} height={30} />
            <Skeleton width={120} height={14} />
          </div>
        ))}
      </div>

      {/* ===== FEED ===== */}
      <div className="skeletonFeed">

        {/* STORIES */}
        <div className="stories">
          {Array(5).fill().map((_, i) => (
            <Skeleton key={i} width={110} height={180} borderRadius={10} />
          ))}
        </div>

        {/* CREATE POST */}
        <div className="createPost">
          <div className="row">
            <Skeleton circle width={40} height={40} />
            <Skeleton height={40} width="85%" borderRadius={20} />
          </div>

          <div className="row space">
            {Array(3).fill().map((_, i) => (
              <Skeleton key={i} width={90} height={20} />
            ))}
          </div>
        </div>

        {/* POSTS */}
        {Array(3).fill().map((_, i) => (
          <div className="post" key={i}>
            <div className="postHeader">
              <Skeleton circle width={40} height={40} />
              <div>
                <Skeleton width={120} height={14} />
                <Skeleton width={80} height={12} />
              </div>
            </div>

            <Skeleton count={2} height={12} />
            <Skeleton height={250} />

            <div className="row space">
              {Array(3).fill().map((_, i) => (
                <Skeleton key={i} width={80} height={20} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ===== RIGHT BAR ===== */}
      <div className="skeletonRight">
        <Skeleton width={120} height={16} />

        {Array(4).fill().map((_, i) => (
          <div className="rightItem" key={i}>
            <Skeleton circle width={35} height={35} />
            <div>
              <Skeleton width={100} height={14} />
              <Skeleton width={60} height={12} />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default SkeletonHome;

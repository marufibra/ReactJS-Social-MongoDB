// import { makeRequest } from '../../axios';
// import Post from '../post/Post';
// import './post.scss'
// import { useQuery } from '@tanstack/react-query'
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

// const Posts = ({ userId }) => {

//     //TEMPORARY
//     // const posts = [
//     //     {
//     //         id: 1,
//     //         name: "John Doe",
//     //         userId: 1,
//     //         profilePic:
//     //             "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     //         desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
//     //         img: "https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     //     },
//     //     {
//     //         id: 2,
//     //         name: "Jane Doe",
//     //         userId: 2,
//     //         profilePic:
//     //             "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     //         desc: "Tenetur iste voluptates dolorem rem commodi voluptate pariatur, voluptatum, laboriosam consequatur enim nostrum cumque! Maiores a nam non adipisci minima modi tempore.",
//     //     },
//     // ];

//     const { isLoading, error, data } = useQuery({
//         queryKey: ["posts"],
//         queryFn: () =>
//             makeRequest.get("/posts?userId=" + userId).then(res => res.data),
//     });


//     return (
//         <div className='posts'>
//             {error
//                 ? (
//                     <div className="error-box">
//                         <span className="error-icon">⚠️</span>
//                         <h3>Something went wrong</h3>
//                         <p>We couldn’t load posts right now. Please try again later.</p>
//                         <button onClick={() => window.location.reload()}>
//                             Retry
//                         </button>
//                     </div>
//                 )
//                 : isLoading
//                     ? Array(5).fill().map((_, i) => (
//                         <div key={i} style={{ marginBottom: "16px" }}>
//                             {/* Image skeleton */}
//                             <Skeleton height={200} baseColor="#e6e1dc" highlightColor="#f4f1ee" />

//                             {/* Text skeletons */}
//                             <div
//                                 style={{
//                                     display: "flex",
//                                     justifyContent:"space-between",
//                                     marginTop: "12px",
//                                 }}
//                             >
//                                 <div style={{ flex: "0 0 30%" }}>
//                                     <Skeleton height={20} baseColor="#e6e1dc" highlightColor="#f4f1ee" />
//                                 </div>

//                                 <div style={{ flex: "0 0 20%" }}>
//                                     <Skeleton height={20} baseColor="#e6e1dc" highlightColor="#f4f1ee" />
//                                 </div>

//                                 <div style={{ flex: "0 0 30%" }}>
//                                     <Skeleton height={20} baseColor="#e6e1dc" highlightColor="#f4f1ee" />
//                                 </div>

//                             </div>
//                         </div>
//                     ))
//                     : data.map((post) => <Post post={post} key={post.id} />)
//             }
//         </div>
//     )
// }

// export default Posts



import { makeRequest } from "../../axios";
import Post from "../post/Post";
import "./post.scss";
import { useInfiniteQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect, useRef } from "react";

const LIMIT = 5;

const Posts = ({ userId }) => {
  const loadMoreRef = useRef(null);

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", userId],
    queryFn: ({ pageParam = 1 }) =>  // <- start from page 1
      makeRequest
        .get("/posts", {
          params: {
            userId,
            limit: LIMIT,
            page: pageParam,      // <- send 'page', not 'cursor'
          },
        })
        .then((res) => res.data),
    getNextPageParam: (lastPage) => lastPage.nextPage || undefined, // <- backend returns nextPage
  });

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: "100px" }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  const SkeletonPost = () => (
                    //  Array(5).fill().map((_, i) => (
                        <div  style={{ marginBottom: "30px" }}>
                            {/* Image skeleton */}
                            <Skeleton height={200} baseColor="#e6e1dc" highlightColor="#f4f1ee" />

                            {/* Text skeletons */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:"space-between",
                                    marginTop: "8px",
                                }}
                            >
                                <div style={{ flex: "0 0 30%" }}>
                                    <Skeleton height={20} baseColor="#e6e1dc" highlightColor="#f4f1ee" />
                                </div>

                                <div style={{ flex: "0 0 20%" }}>
                                    <Skeleton height={20} baseColor="#e6e1dc" highlightColor="#f4f1ee" />
                                </div>

                                <div style={{ flex: "0 0 30%" }}>
                                    <Skeleton height={20} baseColor="#e6e1dc" highlightColor="#f4f1ee" />
                                </div>

                            </div>
                        </div>
                    // ))
  );

  return (
    <div className="posts">
      {error && (
        <div className="error-box">
          <h3>Something went wrong</h3>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {isLoading && Array.from({ length: 5 }).map((_, i) => <SkeletonPost key={i} />)}

      {data?.pages.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page.posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      ))}

      {isFetchingNextPage && Array.from({ length: 2 }).map((_, i) => <SkeletonPost key={i} />)}

      <div ref={loadMoreRef} style={{ height: "1px" }} />
    </div>
  );
};

export default Posts;

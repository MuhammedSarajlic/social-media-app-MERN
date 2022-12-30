import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import axios from "axios";
import { Comment } from "../index";

const Post = ({ post, user }) => {
  const [postComments, setPostComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [showAllComments, setShowAllComments] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isComment, setIsComment] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const date = moment(post.createdAt).format("MMMM D, YYYY");
  const time = moment(post.createdAt).format("HH:mm");
  const postId = post._id;
  const userId = user._id;

  useEffect(() => {
    async function checkLiked() {
      await axios
        .get(`http://localhost:5000/api/posts/${postId}/like?userId=${userId}`)
        .then((res) => {
          setIsLiked(res.data.liked);
        });
    }
    checkLiked();
    async function getComments() {
      await axios
        .get(`http://localhost:5000/api/posts/${post._id}/comments`)
        .then((res) => {
          setComments(res.data.comments);
        });
    }
    getComments();
    setLikeCount(post.likes.length);
    setCommentCount(post.comments.length);
  }, [postId]);

  const handleLike = async () => {
    const id = post._id;
    if (!isLiked) {
      await axios
        .post(`http://localhost:5000/api/posts/${id}/like`, { userId })
        .then(() => {
          setLikeCount((prev) => prev + 1);
          setIsLiked(true);
        });
    } else if (isLiked) {
      await axios
        .delete(`http://localhost:5000/api/posts/${id}/like`, {
          data: { userId },
        })
        .then(() => {
          setLikeCount((prev) => prev - 1);
          setIsLiked(false);
        });
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    await axios
      .post(`http://localhost:5000/api/posts/${postId}/comments`, {
        userId,
        comment,
      })
      .then((res) => {
        setPostComments((prev) => [...prev, comment]);
        setCommentCount((prev) => prev + 1);
        setComment("");
      })
      .catch((error) => console.log(error));
  };

  const handleShowComments = () => {
    setShowAllComments(true);
  };

  return (
    <>
      <div className="flex flex-col rounded-xl overflow-hidden bg-white my-5">
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                {post?.authorId.imageUrl ? (
                  <img
                    src={post?.authorId.imageUrl}
                    alt=""
                    className="w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-500">
                    <p className="text-white font-bold text-lg">
                      {post?.authorId.firstName.charAt(0)}
                      {post?.authorId.lastName.charAt(0)}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <Link to={`/${post?.authorId.username}`}>
                  <p className="font-bold hover:cursor-pointer hover:underline">
                    {`${post?.authorId.firstName} ${post?.authorId.lastName}`}
                  </p>
                </Link>
                <p className="text-gray-600 ">{`@${post?.authorId.username}`}</p>
              </div>
            </div>
            <div className="cursor-pointer text-xl">
              <ion-icon name="ellipsis-vertical-outline"></ion-icon>
            </div>
          </div>
          <div className="px-4 py-2">
            <p>{post?.description}</p>
          </div>
        </div>
        {post?.imageUrl && (
          <div className="w-full h-full">
            <img src={post?.imageUrl} alt="" className="w-full h-full" />
          </div>
        )}
        <div className="max-w-full flex items-center justify-between px-4 py-2 border-y-[1px]">
          <div className="flex items-center justify-center space-x-6">
            <div className="text-xl cursor-pointer" onClick={handleLike}>
              {isLiked ? (
                <div className="flex items-center justify-center space-x-1">
                  <div className="flex items-center justify-center w-8 h-8 text-indigo-600">
                    <ion-icon name="heart"></ion-icon>
                  </div>
                  <p className="text-base text-indigo-800">{likeCount}</p>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-1 hover:text-indigo-800">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-indigo-400 hover:text-indigo-800">
                    <ion-icon name="heart-outline"></ion-icon>
                  </div>
                  <p className="text-base">{likeCount}</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center space-x-1 text-xl cursor-pointer hover:text-green-600">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-green-300 hover:text-green-800"
                onClick={() => {
                  setIsComment(true);
                }}
              >
                <ion-icon name="chatbubble-outline"></ion-icon>
              </div>
              <p className="text-base">{commentCount}</p>
            </div>
            <div className="flex items-center justify-center space-x-1 text-xl cursor-pointer hover:text-sky-600">
              <div className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-sky-300 hover:text-sky-800">
                <ion-icon name="arrow-redo-outline"></ion-icon>
              </div>
            </div>
          </div>
          <div>
            <p className="text-gray-600">{`${time}, ${date}`}</p>
          </div>
        </div>
        {isComment && (
          <>
            <div className="w-full px-4 py-3">
              <p
                className="cursor-pointer font-bold text-base hover:underline"
                onClick={handleShowComments}
              >
                Show all comments
              </p>

              {showAllComments &&
                comments.map((comment) => (
                  <Comment
                    key={comment._id}
                    comment={comment}
                    comments={comments}
                    setComments={setComments}
                    setCommentCount={setCommentCount}
                  />
                  // <div
                  //   key={comment._id}
                  //   className="flex items-start my-2 space-x-1"
                  // >
                  //   <div className="w-10">
                  //     <img
                  //       src={comment?.userId.imageUrl}
                  //       className="w-8 h-8 rounded-full"
                  //     />
                  //   </div>
                  //   <div>
                  //     <div className="w-full h-full bg-[#f0f2f5] p-2 rounded-2xl">
                  //       <Link
                  //         to={`/${comment?.userId.username}`}
                  //         className="font-bold"
                  //       >{`${comment?.userId.firstName} ${comment?.userId.lastName}`}</Link>
                  //       <div>
                  //         <p>{comment?.comment}</p>
                  //       </div>
                  //     </div>
                  //     <div className="flex items-end space-x-2 px-2 py-1">
                  //       <p className="text-sm hover:underline cursor-pointer font-bold text-[#65676b]">
                  //         Like
                  //       </p>
                  //       <p className="text-sm text-[#65676b] hover:underline cursor-pointer">
                  //         {moment(comment.createdAt).fromNow()}
                  //       </p>
                  //     </div>
                  //   </div>
                  //   <div
                  //     className="relative flex items-center justify-center p-2 cursor-pointer text-lg rounded-full hover:bg-[#f0f2f5]"
                  //     onClick={() => setIsOpen(!isOpen)}
                  //   >
                  //     <ion-icon name="ellipsis-horizontal-outline"></ion-icon>
                  //     {isOpen && (
                  //       <div className="absolute left-0 top-0 mt-8 w-32 rounded-md shadow-lg z-10">
                  //         <div className="py-1 rounded-md bg-white shadow-xs">
                  //           <a
                  //             href="#"
                  //             className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                  //           >
                  //             Edit
                  //           </a>
                  //           <div
                  //             href="#"
                  //             className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                  //           >
                  //             Delete
                  //           </div>
                  //         </div>
                  //       </div>
                  //     )}
                  //   </div>
                  // </div>
                ))}
              {postComments.length > 0 &&
                postComments.map((comment, i) => (
                  <div key={i} className="flex items-start my-2 space-x-1">
                    <div className="w-10">
                      <img
                        src={user?.imageUrl}
                        className="w-8 h-8 rounded-full"
                      />
                    </div>
                    <div>
                      <div className="w-full h-full bg-[#f0f2f5] p-2 rounded-2xl">
                        <Link
                          to={`/${user?.username}`}
                          className="font-bold"
                        >{`${user?.firstName} ${user?.lastName}`}</Link>
                        <div>
                          <p>{comment}</p>
                        </div>
                      </div>
                      <div className="flex items-end space-x-2 px-2 py-1">
                        <p className="text-sm hover:underline cursor-pointer font-bold text-[#65676b]">
                          Like
                        </p>
                      </div>
                    </div>
                    <div
                      className="flex items-center justify-center p-2 cursor-pointer text-lg rounded-full hover:bg-[#f0f2f5]"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      <ion-icon name="ellipsis-horizontal-outline"></ion-icon>
                      {isOpen && (
                        <div className="absolute left-0 top-0 mt-8 w-32 rounded-md shadow-lg z-10">
                          <div className="py-1 rounded-md bg-white shadow-xs">
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                            >
                              Edit
                            </a>
                            <a
                              href="#"
                              className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                            >
                              Delete
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex items-center px-4 pb-3 space-x-1">
              <div className="w-11">
                <img
                  src={user.imageUrl}
                  alt=""
                  className="w-9 h-9 rounded-full"
                />
              </div>
              <div className="flex items-center w-full h-10 bg-[#f0f2f5] rounded-3xl pr-5">
                <textarea
                  className="w-full h-10 bg-inherit rounded-3xl border-none resize-none overflow-auto scrollbar-hide focus:ring-0"
                  placeholder="Comment something"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  className="bg-inherit border-none text-indigo-600 font-bold"
                  onClick={addComment}
                >
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default Post;

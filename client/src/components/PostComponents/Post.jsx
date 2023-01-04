import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import axios from "axios";
import { Comment, TempComment } from "../index";

const Post = ({ post, user }) => {
  const [postComments, setPostComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [showAllComments, setShowAllComments] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isComment, setIsComment] = useState(false);
  const date = moment(post.createdAt).format("MMMM D, YYYY");
  const time = moment(post.createdAt).format("HH:mm");
  const postId = post._id;
  const userId = user._id;
  const receiver = post?.authorId._id;

  useEffect(() => {
    async function checkLiked() {
      await axios
        .get(
          `http://localhost:5000/api/posts/${postId}/check-like?userId=${userId}`
        )
        .then((res) => {
          setIsLiked(res.data);
        });
    }
    checkLiked();
    async function getComments() {
      await axios
        .get(`http://localhost:5000/api/posts/${post._id}/get-comments`)
        .then((res) => {
          setComments(res.data);
        });
    }
    getComments();
    setLikeCount(post.likes.length);
    setCommentCount(post.comments.length);
  }, [postId]);

  const handleLike = async () => {
    const id = post?._id;
    if (!isLiked) {
      await axios
        .post(`http://localhost:5000/api/posts/${id}/add-like`, { userId })
        .then(() => {
          setLikeCount((prev) => prev + 1);
          setIsLiked(true);
        });
      {
        user._id !== receiver &&
          (await axios
            .post("http://localhost:5000/api/notifications/send", {
              senderId: userId,
              receiverId: receiver,
              message: `liked your post`,
              type: "like",
              postId: id,
            })
            .then((res) => console.log(res)));
      }
    } else if (isLiked) {
      await axios
        .delete(`http://localhost:5000/api/posts/${id}/remove-like`, {
          data: { userId },
        })
        .then(() => {
          setLikeCount((prev) => prev - 1);
          setIsLiked(false);
        });
    }
  };

  const addComment = async (e) => {
    const id = post?._id;
    e.preventDefault();
    await axios
      .post(`http://localhost:5000/api/posts/${postId}/add-comment`, {
        userId,
        comment,
      })
      .then((res) => {
        setPostComments((prev) => [...prev, res.data]);
        setCommentCount((prev) => prev + 1);
        setComment("");
      })
      .catch((error) => console.log(error));
    {
      user._id !== receiver &&
        (await axios
          .post("http://localhost:5000/api/notifications/send", {
            senderId: userId,
            receiverId: receiver,
            message: `commented on your post`,
            type: "comment",
            postId: id,
          })
          .then((res) => console.log(res)));
    }
  };

  const handleShowComments = () => {
    setShowAllComments(true);
  };

  return (
    <>
      <div className="flex flex-col rounded-xl overflow-hidden bg-white mb-5">
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={post?.authorId.imageUrl}
                  alt=""
                  className="w-full h-full"
                />
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
                    user={user}
                    post={post}
                    comment={comment}
                    comments={comments}
                    setComments={setComments}
                    setCommentCount={setCommentCount}
                  />
                ))}
              {postComments.length > 0 &&
                postComments.map((comment) => (
                  <TempComment
                    key={comment._id}
                    user={user}
                    comment={comment}
                    setPostComments={setPostComments}
                    postComments={postComments}
                    setCommentCount={setCommentCount}
                  />
                ))}
            </div>
            <div className="flex items-center px-4 pb-3 space-x-1">
              <div className="w-11">
                <img
                  src={user?.imageUrl}
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

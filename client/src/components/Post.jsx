import React, { useState, useEffect } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import axios from "axios";

const Post = ({ post, user, handleOpenPost, setTempPost }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
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
    setLikeCount(post.likes.length);
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
                  handleOpenPost();
                  setTempPost(post);
                }}
              >
                <ion-icon name="chatbubbles-outline"></ion-icon>
              </div>
              <p className="text-base">231</p>
            </div>
            <div className="flex items-center justify-center space-x-1 text-xl cursor-pointer hover:text-sky-600">
              <div className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-sky-300 hover:text-sky-800">
                <ion-icon name="arrow-redo-outline"></ion-icon>
              </div>
              <p className="text-base">231</p>
            </div>
          </div>
          <div>
            <p className="text-gray-600">{`${time}, ${date}`}</p>
          </div>
        </div>
        <div className="w-full px-4 py-3">
          <p className="cursor-pointer font-bold text-base hover:underline">
            Show all comments
          </p>
        </div>
        <div className="flex items-center px-4 pb-3 space-x-1">
          <div className="w-11">
            <img
              src={post.authorId.imageUrl}
              alt=""
              className="w-9 h-9 rounded-full"
            />
          </div>
          <div className="flex items-center w-full h-10 bg-[#f0f2f5] rounded-3xl pr-5">
            <textarea
              className="w-full h-10 bg-inherit rounded-3xl border-none resize-none overflow-auto scrollbar-hide focus:ring-0"
              placeholder="Comment something"
            />
            <button className="bg-inherit border-none text-indigo-600 font-bold">
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Post;

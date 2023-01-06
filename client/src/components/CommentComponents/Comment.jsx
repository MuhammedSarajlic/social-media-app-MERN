import axios from "axios";
import moment from "moment";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Comment = ({ comment, comments, setComments, setCommentCount }) => {
  const commentId = comment._id;
  const [isOpen, setIsOpen] = useState(false);

  const handleDeleteComment = () => {
    axios
      .delete(`http://localhost:5000/api/posts/${commentId}/remove-comment`)
      .then(() => {
        setComments(comments.filter((comment) => comment._id !== commentId));
        setCommentCount((prev) => prev - 1);
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <div className="flex items-start my-2 space-x-1">
        <div className="w-10">
          <img
            src={comment?.userId.imageUrl}
            className="w-8 h-8 rounded-full"
          />
        </div>
        <div>
          <div className="w-full h-full bg-[#f0f2f5] p-2 rounded-2xl">
            <Link
              to={`/${comment?.userId.username}`}
              className="font-bold"
            >{`${comment?.userId.firstName} ${comment?.userId.lastName}`}</Link>
            <div>
              <p>{comment?.comment}</p>
            </div>
          </div>
          <div className="flex items-end space-x-2 px-2 py-1">
            <p className="text-sm hover:underline cursor-pointer font-bold text-[#65676b]">
              Like
            </p>
            <p className="text-sm text-[#65676b] hover:underline cursor-pointer">
              {moment(comment.createdAt).fromNow()}
            </p>
          </div>
        </div>
        <div
          className="relative flex items-center justify-center p-2 cursor-pointer text-lg rounded-full hover:bg-[#f0f2f5]"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <ion-icon name="ellipsis-horizontal-outline"></ion-icon>
          {isOpen && (
            <div className="absolute left-0 top-0 mt-8 w-32 rounded-md shadow-lg z-10">
              <div className="py-1 rounded-md bg-white shadow-xs">
                <div className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out">
                  Edit
                </div>
                <div
                  className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                  onClick={handleDeleteComment}
                >
                  Delete
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Comment;

import React from "react";
import { Link } from "react-router-dom";

const PostModal = ({ handleOpenPost, tempPost }) => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex items-center justify-center z-10">
        <div className="w-full max-w-sm m-4 bg-white rounded-lg shadow-xl">
          {/* close button */}
          <div
            className="absolute top-0 right-0 flex items-center justify-center w-8 h-8 p-1 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
            onClick={handleOpenPost}
          >
            <ion-icon name="close-outline" size="large"></ion-icon>
          </div>
          <div className="flex justify-between items-center px-4 py-3">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                {tempPost?.authorId.imageUrl ? (
                  <img src={tempPost?.authorId.imageUrl} alt="" />
                ) : (
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-500">
                    <p className="text-white font-bold text-lg">
                      {tempPost?.authorId.firstName.charAt(0)}
                      {tempPost?.authorId.lastName.charAt(0)}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <Link to={`/${tempPost?.authorId.username}`}>
                  <p className="font-bold hover:cursor-pointer hover:underline">
                    {`${tempPost?.authorId.firstName} ${tempPost?.authorId.lastName}`}
                  </p>
                </Link>
                <p className="text-gray-600 ">{`@${tempPost?.authorId.username}`}</p>
              </div>
            </div>
            <div className="cursor-pointer text-xl">
              <ion-icon name="ellipsis-vertical-outline"></ion-icon>
            </div>
          </div>
          <div className="w-full border-b-[1px]">
            {tempPost?.description && <div>{tempPost?.description}</div>}
            {tempPost?.imageUrl && (
              <div>
                <img src={tempPost?.imageUrl} />
              </div>
            )}
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default PostModal;

import React from "react";

const LoadingPost = () => {
  return (
    <>
      <div className="w-full bg-white my-3 rounded-lg px-4 pt-5 pb-2 text-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-400 rounded-full"></div>
          <div className="space-y-1">
            <div className="h-3 w-20 bg-gray-400 rounded-lg"></div>
            <div className="h-2 w-10 bg-gray-400 rounded-lg"></div>
          </div>
        </div>
        <div className="max-w-full flex items-center pt-3 space-x-2">
          <div className="flex items-center justify-center text-xl w-8 h-8 rounded-full text-gray-400">
            <ion-icon name="heart-outline"></ion-icon>
          </div>
          <div className="flex items-center justify-center text-xl w-8 h-8 rounded-full text-gray-400">
            <ion-icon name="chatbubbles-outline"></ion-icon>
          </div>
          <div className="flex items-center justify-center text-xl w-8 h-8 rounded-full text-gray-400">
            <ion-icon name="arrow-redo-outline"></ion-icon>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingPost;

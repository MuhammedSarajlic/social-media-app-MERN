import React from "react";

const RemoveFriendModal = ({
  setIsModalOpen,
  username,
  handleRemoveFriend,
}) => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10 overscroll-none	">
        <div className="w-full max-w-sm m-4 bg-white rounded-lg shadow-xl">
          <div className="px-4 py-5 sm:px-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl leading-7 font-semibold text-gray-900">
                Are you sure you want to remove{" "}
                <span className="font-bold">{username}</span> as friend
              </h2>
            </div>
            {/* modal content */}
            <div className="flex space-x-3">
              <div
                className="flex items-center justify-center px-3 py-1 border-2 border-indigo-600 text-indigo-600 text-xl font-bold rounded-lg cursor-pointer"
                onClick={() => {
                  handleRemoveFriend();
                  setIsModalOpen(false);
                }}
              >
                Remove
              </div>
              <div
                className="flex items-center justify-center px-3 py-1 border-2 border-indigo-600 bg-indigo-600 text-white rounded-lg cursor-pointer"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RemoveFriendModal;

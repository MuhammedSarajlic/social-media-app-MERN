import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { AddPostModal, Navbar } from "../components";

const Home = ({ user, handleLogOut }) => {
  const fileInput = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleImageInput = (e) => {
    e.preventDefault();
    const file = fileInput.current.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const addPost = () => {
    console.log("Add post");
    handleRemoveImage();
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleRemoveImage = () => {
    setImageUrl("");
  };

  return (
    <>
      <Navbar user={user} handleLogOut={handleLogOut} />
      <div className="flex space-x-10 mt-10 mx-auto max-w-6xl px-2 sm:px-6 lg:px-8">
        <div className="w-2/3 bg-red-900">
          {/* add post form */}
          <div className="w-full rounded-lg bg-white">
            <form>
              <div className="h-5 w-full border-b-[1px] py-5 flex items-center">
                <p className="font-bold px-4">Add post</p>
              </div>
              <div>
                <textarea
                  className="min-h-full w-full resize-none border-none outline-none"
                  placeholder="Say something..."
                />
              </div>
              <div className="flex justify-between px-2 py-3 border-y-[1px]">
                <div
                  className="flex items-center border-2 px-2 space-x-2 rounded-xl cursor-pointer"
                  onClick={handleOpen}
                >
                  <ion-icon name="videocam-outline"></ion-icon>
                  <p>Add Video</p>
                </div>
                <div
                  className="flex items-center border-2 px-2 space-x-2 rounded-xl cursor-pointer"
                  onClick={handleOpen}
                >
                  <ion-icon name="image-outline"></ion-icon>
                  <p>Add photo</p>
                </div>
                <div
                  className="flex items-center border-2 px-2 space-x-2 rounded-xl cursor-pointer"
                  onClick={handleOpen}
                >
                  <ion-icon name="map-outline"></ion-icon>{" "}
                  <p>Add map location</p>
                </div>
                {/* <input
                    type="file"
                    id="file"
                    className="hidden"
                    accept="image/*"
                    ref={fileInput}
                    onChange={handleImageInput}
                  /> */}
              </div>
              <button
                onClick={addPost}
                type="button"
                className="ml-2 mt-2 focus:outline-none text-white bg-indigo-600 hover:bg-indigo-600 font-medium rounded-xl text-sm px-4 py-2 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
              >
                Add post
              </button>

              {isOpen && (
                <AddPostModal
                  handleOpen={handleOpen}
                  imageUrl={imageUrl}
                  handleRemoveImage={handleRemoveImage}
                  fileInput={fileInput}
                  handleImageInput={handleImageInput}
                  addPost={addPost}
                />
              )}
            </form>
          </div>
          {/* Posts */}
          <div>Post</div>
        </div>
        <div className="w-1/3 bg-lime-600">Suggest</div>
      </div>
    </>
  );
};

export default Home;

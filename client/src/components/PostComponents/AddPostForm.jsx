import React from "react";

const AddPostForm = ({ handleAddPost, formData, handleChange, handleOpen }) => {
  return (
    <>
      <form onSubmit={handleAddPost} className="mb-5">
        <div className="h-5 w-full border-b-[1px] py-5 flex items-center">
          <p className="font-bold px-4">Add post</p>
        </div>
        <div>
          <textarea
            className="min-h-full w-full resize-none border-none outline-none focus:ring-0"
            placeholder="Say something..."
            name="description"
            value={formData.description}
            onChange={handleChange}
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
            <ion-icon name="map-outline"></ion-icon> <p>Add map location</p>
          </div>
        </div>
        <button
          disabled={!(formData.description || formData.imageUrl)}
          type="submit"
          className="ml-2 mt-2 focus:outline-none text-white bg-indigo-600 hover:bg-indigo-800 font-medium rounded-xl text-sm px-4 py-2 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
        >
          Add post
        </button>
      </form>
    </>
  );
};

export default AddPostForm;

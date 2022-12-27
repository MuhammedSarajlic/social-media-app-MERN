import React from "react";

const AddPostModal = ({
  handleOpen,
  imageUrl,
  handleRemoveImage,
  fileInput,
  handleImageInput,
  handleAddPost,
  handleChange,
  formData,
}) => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10">
        <div className="w-full max-w-sm m-4 bg-white rounded-lg shadow-xl">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl leading-7 font-semibold text-gray-900">
                Add Post
              </h2>
              {/* close button */}
              <div
                className=" flex items-center justify-center w-8 h-8 p-1 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
                onClick={handleOpen}
              >
                <ion-icon name="close-outline" size="large"></ion-icon>
              </div>
            </div>
            {/* modal content */}
            <form onSubmit={handleAddPost}>
              <div className="flex flex-col items-center justify-center w-full mt-4">
                <textarea
                  className="w-full border-none p-0 resize-none outline-none"
                  placeholder="Say something..."
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
                {imageUrl ? (
                  <div className="w-full h-full relative">
                    <img src={imageUrl} className="w-full h-full mt-4" />
                    <div
                      className="flex items-center justify-center cursor-pointer mt-6 mr-2 w-6 h-6 bg-white absolute rounded-full top-0 right-0"
                      onClick={handleRemoveImage}
                    >
                      <ion-icon name="close-outline" size="small"></ion-icon>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 mt-4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        aria-hidden="true"
                        className="w-10 h-10 mb-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      ref={fileInput}
                      onChange={handleImageInput}
                      accept="image/*"
                    />
                  </label>
                )}
              </div>
              <button
                disabled={!(formData.description || formData.imageUrl)}
                type="submit"
                className="w-full mt-4 mb-2 focus:outline-none text-white bg-indigo-600 font-medium rounded-lg text-sm px-4 py-2"
              >
                Add post
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPostModal;

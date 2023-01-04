import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import {
  AddPostForm,
  AddPostModal,
  LoadingPost,
  Navbar,
  Post,
} from "../components";
import axios from "axios";

const Home = ({ user, handleLogOut }) => {
  const fileInput = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [isOpen, setIsOpen] = useState({
    addPostModal: false,
  });
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    imageUrl: "",
    authorId: "",
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/get-posts").then((response) => {
      setPosts(response.data);
    });
  }, []);

  const handleImageInput = (e) => {
    e.preventDefault();
    const file = fileInput.current.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target.result);
      setFormData({ ...formData, imageUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleAddPost = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { description, imageUrl } = formData;
    axios
      .post("http://localhost:5000/api/create-post", {
        description,
        imageUrl,
        authorId: user._id,
      })
      .then(() => {
        setIsLoading(false);
        setFormData({ description: "", imageUrl: "" });
        window.location.reload(false);
      });
    handleRemoveImage();
    setIsOpen({ addPostModal: false });
  };

  const handleOpen = () => {
    setIsOpen({ addPostModal: !isOpen.addPostModal });
    handleRemoveImage();
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setFormData({ ...formData, imageUrl: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <Navbar user={user} handleLogOut={handleLogOut} />
      <div className="h-full flex space-x-10 mt-5 mx-auto max-w-5xl sm:px-6 lg:px-8">
        <div className="w-2/3">
          <div className="w-full rounded-lg bg-white">
            <AddPostForm
              handleAddPost={handleAddPost}
              formData={formData}
              handleChange={handleChange}
              handleOpen={handleOpen}
            />

            {isOpen.addPostModal && (
              <AddPostModal
                handleOpen={handleOpen}
                imageUrl={imageUrl}
                handleRemoveImage={handleRemoveImage}
                fileInput={fileInput}
                handleImageInput={handleImageInput}
                handleAddPost={handleAddPost}
                handleChange={handleChange}
                formData={formData}
              />
            )}
          </div>
          <div>
            {isLoading && <LoadingPost />}

            {posts.length > 0 ? (
              posts?.map(
                (post, i) =>
                  (user.following.includes(post.authorId._id) ||
                    post.authorId._id === user._id ||
                    user.friends.includes(post.authorId._id)) && (
                    <Post key={i} post={post} user={user} />
                  )
              )
            ) : (
              <LoadingPost />
            )}
          </div>
        </div>
        <div className="w-1/3 bg-lime-600">Suggest</div>
      </div>
    </>
  );
};

export default Home;

import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { AddPostForm, AddPostModal, Navbar, Post } from "../components";
import axios from "axios";

const Home = ({ user, handleLogOut }) => {
  const fileInput = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    imageUrl: "",
    authorId: user?.user._id,
  });

  useEffect(() => {
    axios.get("http://localhost:5000/posts").then((response) => {
      setPosts(response.data);
    });
    console.log(posts);
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
    const { description, imageUrl, authorId } = formData;
    axios
      .post("http://localhost:5000/create-post", {
        description,
        imageUrl,
        authorId,
      })
      .then((res) => {
        console.log(res.data);
        setPosts([formData, ...posts]);
        setFormData({ description: "", imageUrl: "" });
      })
      .catch((error) => console.log(error));
    handleRemoveImage();
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
    handleRemoveImage();
  };

  const handleRemoveImage = () => {
    setImageUrl("");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <Navbar user={user} handleLogOut={handleLogOut} />
      <div className="flex space-x-10 mt-5 mx-auto max-w-5xl sm:px-6 lg:px-8">
        <div className="w-2/3">
          <div className="w-full rounded-lg bg-white">
            <AddPostForm
              handleAddPost={handleAddPost}
              formData={formData}
              handleChange={handleChange}
              handleOpen={handleOpen}
            />
            {isOpen && (
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
            {posts?.map((post, i) => (
              <Post key={i} post={post} />
            ))}
          </div>
        </div>
        <div className="w-1/3 bg-lime-600">Suggest</div>
      </div>
    </>
  );
};

export default Home;

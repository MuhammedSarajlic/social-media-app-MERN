import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import {
  AddPostForm,
  AddPostModal,
  LaodingPost,
  Navbar,
  Post,
} from "../components";
import axios from "axios";

const Home = ({ user, handleLogOut }) => {
  const fileInput = useRef(null);
  const [postId, setPostId] = useState("");
  const [changeLike, setChangeLike] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    imageUrl: "",
    authorId: "",
  });

  useEffect(() => {
    axios.get("http://localhost:5000/posts").then((response) => {
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
      .post("http://localhost:5000/create-post", {
        description,
        imageUrl,
        authorId: user._id,
      })
      .then(() => {
        setIsLoading(false);
        setFormData({ description: "", imageUrl: "" });
        window.location.reload(false);
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
    setFormData({ ...formData, imageUrl: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLike = (id) => {
    // console.log(id);
    const userId = user._id;
    console.log(userId);
    if (!changeLike) {
      console.log("Liked");
      axios
        .post(`http://localhost:5000/api/posts/${id}/like`, { userId })
        .then((res) => console.log(res.data.message));
      setChangeLike(true);
    } else {
      console.log("Unliked");
      axios
        .delete(`http://localhost:5000/api/posts/${id}/like`, {
          data: { userId },
        })
        .then((res) => console.log(res.data.message))
        .catch((error) => console.log(error));
      setChangeLike(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <Navbar user={user} handleLogOut={handleLogOut} />
      <div className="h-screen flex space-x-10 mt-5 mx-auto max-w-5xl sm:px-6 lg:px-8">
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
            {isLoading && <LaodingPost />}

            {posts?.map((post, i) => (
              <Post
                key={i}
                post={post}
                handleLike={handleLike}
                setPostId={setPostId}
                // setIsLiked={setIsLiked}
                // isLiked={isLiked}
              />
            ))}
          </div>
        </div>
        <div className="w-1/3 bg-lime-600">Suggest</div>
      </div>
    </>
  );
};

export default Home;

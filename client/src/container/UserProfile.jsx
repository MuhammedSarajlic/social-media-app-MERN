import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { LoadingPost, Navbar, Post } from "../components";

const UserProfile = ({ user, handleLogOut }) => {
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const [openedUser, setOpenedUser] = useState();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/users?username=${username}`)
      .then((res) => setOpenedUser(res.data));
    axios.get("http://localhost:5000/posts").then((res) => setPosts(res.data));
  }, []);

  return (
    <>
      <Navbar user={user} handleLogOut={handleLogOut} />
      <div className="bg-[#f0f2f5] h-full">
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute w-1/3 t-0 mt-48 z-10">
            <div className="w-60 h-60 border-8 border-white overflow-hidden rounded-full bg-center">
              <img
                src={openedUser?.imageUrl}
                alt=""
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
        <div>
          <div className="w-full h-80 bg-center bg-no-repeat bg-cover overflow-hidden flex items-center">
            <img
              src="https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&dpr=1"
              alt=""
              className="w-full"
            />
          </div>
          <div className="w-full h-48 bg-white drop-shadow-lg">
            <div className="flex max-w-5xl mx-auto h-full space-x-8">
              <div className="w-1/4"></div>
              <div className="w-3/4 h-full py-2  space-y-3">
                <p className="text-4xl font-bold">{`${openedUser?.firstName} ${openedUser?.lastName}`}</p>
                <p className="text-lg">@{openedUser?.username}</p>
                <div className="flex space-x-3">
                  <p className="font-bold text-lg">0 Friends</p>
                  <p>&#x2022;</p>
                  <p className="font-bold text-lg">0 Followers</p>
                  <p>&#x2022;</p>
                  <p className="font-bold text-lg">0 Following</p>
                </div>
                <div className="flex space-x-4">
                  <div className="flex h-full items-center justify-center px-3 py-1.5 space-x-2 rounded-xl bg-indigo-600 text-white cursor-pointer">
                    <ion-icon name="person-add-outline"></ion-icon>
                    <p>Add friend</p>
                  </div>
                  <div className="flex h-full items-center justify-center px-3 py-1.5 space-x-2 rounded-xl bg-indigo-600 text-white cursor-pointer">
                    <ion-icon name="heart-outline"></ion-icon>
                    <p>Follow</p>
                  </div>
                  <div className="flex h-full items-center justify-center px-3 py-1.5 space-x-2 rounded-xl bg-indigo-600 text-white cursor-pointer">
                    <ion-icon name="chatbubble-ellipses-outline"></ion-icon>
                    <p>Message</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex max-w-5xl mx-auto h-full mt-10 space-x-8">
          <div className="w-2/3 h-full">
            {posts.length > 0 ? (
              posts?.map(
                (post) =>
                  post.authorId._id === openedUser._id && (
                    <Post key={post._id} post={post} user={user} />
                  )
              )
            ) : (
              <LoadingPost />
            )}
          </div>
          <div className="w-1/3 h-48 bg-gray-400"></div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;

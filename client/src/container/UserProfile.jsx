import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { LoadingPost, Navbar, Post, RemoveFriendModal } from "../components";

const UserProfile = ({ user, handleLogOut }) => {
  const { username } = useParams();
  const [posts, setPosts] = useState([]);
  const [openedUser, setOpenedUser] = useState();
  const [isFollowing, setIsFollowing] = useState(false);
  const [sentRequest, setSentRequest] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [receivedFriendRequest, setReceivedFriendRequest] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [friendsCount, setFriendsCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = user?._id;
  const id = openedUser?._id;

  useEffect(() => {
    axios
      .get(`http://localhost:5000/users?username=${username}`)
      .then((res) => {
        setOpenedUser(res.data);
        setFollowersCount(res.data.followers.length);
        setFollowingCount(res.data.following.length);
        setFriendsCount(res.data.friends.length);
        setIsFollowing(res.data.followers.includes(user?._id));
        setIsFriend(res.data.friends.includes(userId));
      });
    axios.get("http://localhost:5000/posts").then((res) => setPosts(res.data));
  }, [user, username]);

  useEffect(() => {
    userId && id && getFriend();
  }, [openedUser, receivedFriendRequest]);

  const getFriend = () => {
    axios
      .get(`http://localhost:5000/friend-request/${id}/check?userId=${userId}`)
      .then((res) => {
        res.data.status === "pending" && setSentRequest(true);
        res.data.status === "accepted" && setIsFriend(true);
        setReceivedFriendRequest(res.data.receiverId === userId);
      });
  };

  const handleFollow = async () => {
    await axios
      .post(`http://localhost:5000/api/users/${id}/follow`, {
        userId,
      })
      .then(() => {
        setFollowersCount((prev) => prev + 1);
      });
    await axios
      .post("http://localhost:5000/notifications/send", {
        senderId: userId,
        receiverId: id,
        message: `started following you`,
        type: "follow",
      })
      .then((res) => console.log(res));
  };

  const handleUnfollow = () => {
    axios
      .post(`http://localhost:5000/api/users/${id}/unfollow`, {
        userId,
      })
      .then(() => setFollowersCount((prev) => prev - 1));
  };

  const handleSendFriendRequest = async () => {
    await axios
      .post("http://localhost:5000/friend-request/send", {
        senderId: userId,
        receiverId: id,
      })
      .then(() => {
        setSentRequest(true);
      });
    await axios
      .post("http://localhost:5000/notifications/send", {
        senderId: userId,
        receiverId: id,
        message: `sent you a friend request`,
        type: "friend request",
      })
      .then((res) => console.log(res));
  };

  const handleRemoveFriendRequest = async () => {
    await axios
      .delete("http://localhost:5000/friend-request/remove", {
        data: { senderId: userId, receiverId: id },
      })
      .then(() => setSentRequest(false));
    await axios.delete("http://localhost:5000/notifications/remove", {
      data: {
        senderId: userId,
        receiverId: id,
        type: "friend request",
      },
    });
  };

  const handleChangeRequestStatus = async (status) => {
    await axios
      .patch("http://localhost:5000/friend-request/status", {
        senderId: id,
        receiverId: userId,
        status,
      })
      .then((res) => {
        res.data.status === "accepted" && setFriendsCount((prev) => prev + 1);
      });
  };

  const handleRemoveFriend = () => {
    axios
      .delete("http://localhost:5000/friend/remove", {
        data: { senderId: userId, receiverId: id },
      })
      .then(() => {
        setIsFriend(false);
        setFriendsCount((prev) => prev - 1);
      });
  };

  if (!user || !openedUser) return <div>Loading...</div>;

  return (
    <>
      <Navbar user={user} handleLogOut={handleLogOut} />
      <div className="bg-[#f0f2f5] h-full">
        {isModalOpen && (
          <RemoveFriendModal
            setIsModalOpen={setIsModalOpen}
            username={username}
            handleRemoveFriend={handleRemoveFriend}
          />
        )}
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
                  <p className="font-bold text-lg">{`${friendsCount} Friends`}</p>
                  <p>&#x2022;</p>
                  <p className="font-bold text-lg">{`${followersCount} Followers`}</p>
                  <p>&#x2022;</p>
                  <p className="font-bold text-lg">{`${followingCount} Following`}</p>
                </div>
                {openedUser?._id !== user?._id ? (
                  <div className="flex space-x-4">
                    {receivedFriendRequest ? (
                      <div className="flex space-x-2">
                        <div
                          className="flex h-full items-center justify-center px-3 py-1.5 space-x-2 rounded-xl border-2 border-indigo-600 bg-indigo-600 text-white cursor-pointer"
                          onClick={() => {
                            handleChangeRequestStatus("accepted");
                            setReceivedFriendRequest(false);
                            setSentRequest(false);
                            setIsFriend(true);
                          }}
                        >
                          <p>Accept Request</p>
                        </div>
                        <div
                          className="flex h-full items-center justify-center px-3 py-1.5 space-x-2 rounded-xl border-2 border-indigo-600 text-indigo-600 font-bold cursor-pointer"
                          onClick={() => {
                            handleChangeRequestStatus("rejected");
                            setReceivedFriendRequest(false);
                            setSentRequest(false);
                            setIsFriend(false);
                          }}
                        >
                          <p>Delete Request</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {sentRequest ? (
                          <div
                            className="flex h-full items-center justify-center px-3 py-1.5 space-x-2 rounded-xl border-2 border-indigo-600 text-indigo-600 font-bold cursor-pointer"
                            onClick={handleRemoveFriendRequest}
                          >
                            <ion-icon name="person-add-outline"></ion-icon>
                            <p>Friend request sent</p>
                          </div>
                        ) : isFriend ? (
                          <>
                            <div
                              className="flex h-full items-center justify-center px-3 py-1.5 space-x-2 rounded-xl border-2 border-indigo-600 bg-indigo-600 text-white cursor-pointer"
                              onClick={() => {
                                setIsModalOpen(true);
                              }}
                            >
                              <ion-icon name="person"></ion-icon>
                              <p>Friends</p>
                            </div>
                          </>
                        ) : (
                          <div
                            className="flex h-full items-center justify-center px-3 py-1.5 space-x-2 rounded-xl border-2 border-indigo-600 text-indigo-600 font-bold cursor-pointer"
                            onClick={handleSendFriendRequest}
                          >
                            <ion-icon name="person-add-outline"></ion-icon>
                            <p>Add friend</p>
                          </div>
                        )}
                      </>
                    )}
                    {isFollowing ? (
                      <div
                        className="flex h-full items-center justify-center px-3 py-1.5 space-x-2 rounded-xl border-2 border-indigo-600 bg-indigo-600 text-white cursor-pointer"
                        onClick={() => {
                          setIsFollowing(!isFollowing);
                          handleUnfollow();
                        }}
                      >
                        <ion-icon name="heart"></ion-icon>
                        <p>Following</p>
                      </div>
                    ) : (
                      <div
                        className="flex h-full items-center justify-center px-3 py-1.5 space-x-2 rounded-xl border-2 border-indigo-600 text-indigo-600 font-bold cursor-pointer"
                        onClick={() => {
                          setIsFollowing(!isFollowing);
                          handleFollow();
                        }}
                      >
                        <ion-icon name="heart-outline"></ion-icon>
                        <p>Follow</p>
                      </div>
                    )}
                    <div className="flex h-full items-center justify-center px-3 py-1.5 space-x-2 rounded-xl bg-indigo-600 border-2 border-indigo-600 text-white cursor-pointer">
                      <ion-icon name="chatbubble-ellipses-outline"></ion-icon>
                      <p>Message</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex">
                    <div className="flex h-full items-center justify-center px-3 py-1.5 space-x-2 rounded-xl border-2 border-indigo-600 bg-indigo-600 text-white cursor-pointer">
                      <ion-icon name="code-slash"></ion-icon>
                      <p>Edit Profile</p>
                    </div>
                  </div>
                )}
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

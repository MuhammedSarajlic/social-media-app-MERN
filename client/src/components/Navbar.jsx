import React from "react";
import { Link } from "react-router-dom";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const Navbar = ({ user, handleLogOut }) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const getNotifications = () => {
    axios.get(`http://localhost:5000/notifications/${user._id}`).then((res) => {
      console.log(res.data);
      setNotifications(res.data);
    });
  };

  useEffect(() => {
    setNotificationCount(user.notifications.length);
    getNotifications();
  }, []);

  return (
    <>
      <Disclosure as="nav" className="bg-gray-800">
        <div className="mx-auto px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-start sm:items-stretch sm:justify-start">
              <div className="flex flex-shrink-0 items-center">
                <img
                  className="block h-8 w-auto lg:hidden"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                  alt="Your Company"
                />
                <img
                  className="hidden h-8 w-auto lg:block"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                  alt="Your Company"
                />
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none ">
                    <div className="inline-flex relative items-center p-3 text-sm font-medium text-center text-white cursor-pointer">
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                      <div className="inline-flex absolute top-1 right-1 justify-center items-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                        {notificationCount}
                      </div>
                    </div>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-72 origin-top-right rounded-md bg-white py-1 shadow-lg focus:outline-none">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <Menu.Item key={notification._id}>
                          <Link
                            to={
                              notification.type === "friend request" ||
                              notification.type === "follow"
                                ? `/${notification.senderId.username}`
                                : notification.type === "like" ||
                                  notification.type === "comment"
                                ? `/post/${notification.postId}`
                                : "/"
                            }
                            className={
                              "flex items-center space-x-3 px-4 py-2 text-sm text-gray-700"
                            }
                          >
                            <img
                              src={notification.senderId.imageUrl}
                              className="w-8 h-8 rounded-full"
                            />
                            <p>
                              <span className="font-bold">
                                {notification.senderId.username}
                              </span>{" "}
                              {notification.message}
                            </p>
                          </Link>
                        </Menu.Item>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-700">
                        There are no new notifications
                      </div>
                    )}
                  </Menu.Items>
                </Transition>
              </Menu>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none ">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user?.imageUrl}
                      alt=""
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg focus:outline-none">
                    <Menu.Item>
                      <Link
                        to={`/${user?.username}`}
                        className={"block px-4 py-2 text-sm text-gray-700"}
                      >
                        Your Profile
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link
                        to={"/settings"}
                        className={"block px-4 py-2 text-sm text-gray-700"}
                      >
                        Settings
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <button
                        onClick={handleLogOut}
                        className={"block px-4 py-2 text-sm text-gray-700"}
                      >
                        Sign out
                      </button>
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
      </Disclosure>
    </>
  );
};

export default Navbar;

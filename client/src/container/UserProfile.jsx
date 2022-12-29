import React from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../components";

const UserProfile = ({ user, handleLogOut }) => {
  const { username } = useParams();
  return (
    <div>
      <Navbar user={user} handleLogOut={handleLogOut} />
    </div>
  );
};

export default UserProfile;

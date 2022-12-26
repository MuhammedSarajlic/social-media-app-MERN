import React from "react";
import { Navbar } from "../components";

const UserProfile = ({ user, handleLogOut }) => {
  return (
    <div>
      User profile
      <Navbar user={user} handleLogOut={handleLogOut} />
    </div>
  );
};

export default UserProfile;

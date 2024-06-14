import React from "react";
import Layout from "../Components/Layout";
import ProfileOtherUsersCard from "../Components/ProfileOtherUsersCard";
import Footer from "../Components/Footer";

function ProfileOtherUsers() {

  return (
    <div className="flex flex-col h-screen">
      <Layout activeTab={1} activeSubTabProfile={2} />
      <div className="flex p-4 justify-center h-auto">
        <ProfileOtherUsersCard />
      </div>
      <div className="flex-shrink-0 p-0">
        <Footer />
      </div>
    </div>
  );
}

export default ProfileOtherUsers;

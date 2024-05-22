import React from "react";
import Layout from "../Components/Layout";
import { Avatar } from "flowbite-react";
import ProfileCard from "../Components/ProfileCard";

function MyProfile_AboutMe() {
  return (
    <div className="flex flex-col min-h-screen">
      <Layout activeTab={0} activeSubTabProfile={4} />
      <div className="flex-grow flex p-4">
        <div className="justify-center w-1/3">
          <ProfileCard />
        </div>
      </div>
    </div>
  );
}

export default MyProfile_AboutMe;

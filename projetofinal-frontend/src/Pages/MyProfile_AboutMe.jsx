import React from "react";
import Layout from "../Components/Layout";
import ProfileCard from "../Components/ProfileCard";
import ProjectMyProfileTable from "../Components/ProjectMyProfileTable";

function MyProfile_AboutMe() {
  return (
    <div className="flex flex-col min-h-screen">
      <Layout activeTab={0} activeSubTabProfile={4} />
      <div className="flex-grow flex p-4">
        <div className="justify-center w-1/3">
          <ProfileCard />
        </div>
        <div className="justify-center w-2/3">
        <ProjectMyProfileTable/>
        </div>
      </div>
    </div>
  );
}

export default MyProfile_AboutMe;

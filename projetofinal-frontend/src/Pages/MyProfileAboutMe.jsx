import React, { useState } from "react";
import Layout from "../Components/Layout";
import ProfileCard from "../Components/ProfileCard";
import ProjectMyProfileTable from "../Components/ProjectMyProfileTable";
import AddSkills from "../Components/AddSkills";

function MyProfile_AboutMe() {
  const [openPopUpSkills, setOpenPopUpSkills] = useState(false);

  function openAddSkillsModal() {
    setOpenPopUpSkills(true);
  }

  function closeAddSkillsModal() {
    setOpenPopUpSkills(false);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Layout activeTab={0} activeSubTabProfile={4} />
      <div className="flex-grow flex p-4">
        <div className="justify-center w-1/3">
          <ProfileCard openPopUpSkills={openAddSkillsModal} />
        </div>
        <div className="justify-center w-2/3">
          <ProjectMyProfileTable />
        </div>
      </div>
      <AddSkills openPopUpSkills={openPopUpSkills} closePopUpSkills={closeAddSkillsModal} />
    </div>
  );
}

export default MyProfile_AboutMe;
import React, { useState } from "react";
import Layout from "../Components/Layout";
import ProfileCard from "../Components/ProfileCard";
import ProjectMyProfileTable from "../Components/ProjectMyProfileTable";
import AddSkills from "../Components/AddSkills";
import AddInterests from "../Components/AddInterests";
import RemoveSkills from "../Components/RemoveSkills";

function MyProfile_AboutMe() {
  const [statePopUpSkills, setStatePopUpSkills] = useState(false);
  const [statePopUpInterests, setStatePopUpInterests] = useState(false);
  const [statePopUpSkillsRemove, setStatePopUpSkillsRemove] = useState(false);

  function openAddSkillsModal() {
    setStatePopUpSkills(true);
  }

  function closeAddSkillsModal() {
    setStatePopUpSkills(false);
  }

  function openAddInterestsModal() {
    setStatePopUpInterests(true);
  }

  function closeAddInterestsModal() {
    setStatePopUpInterests(false);
  }

  function openAddSkillsRemoveModal() {
    setStatePopUpSkillsRemove(true);
  }

  function closeAddSkillsRemoveModal() {
    setStatePopUpSkillsRemove(false);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Layout activeTab={0} activeSubTabProfile={4} />
      <div className="flex-grow flex p-4">
        <div className="justify-center w-1/3">
          <ProfileCard
            openPopUpSkills={openAddSkillsModal}
            openPopUpInterests={openAddInterestsModal}
            openPopUpSkillsRemove={openAddSkillsRemoveModal}
          />
        </div>
        <div className="justify-center w-2/3">
          <ProjectMyProfileTable />
        </div>
      </div>
      <AddSkills
        openPopUpSkills={statePopUpSkills}
        closePopUpSkills={closeAddSkillsModal}
      />
      <AddInterests
        openPopUpInterests={statePopUpInterests}
        closePopUpInterests={closeAddInterestsModal}
      />
      <RemoveSkills
        openPopUpSkillsRemove={statePopUpSkillsRemove}
        closePopUpSkillsRemove={closeAddSkillsRemoveModal}
      />
    </div>
  );
}

export default MyProfile_AboutMe;

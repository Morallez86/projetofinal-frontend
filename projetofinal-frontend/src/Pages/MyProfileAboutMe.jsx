import React, { useState } from "react";
import Layout from "../Components/Layout";
import ProfileCard from "../Components/ProfileCard";
import ProjectMyProfileTable from "../Components/ProjectMyProfileTable";
import AddSkills from "../Components/AddSkills";
import AddInterests from "../Components/AddInterests";
import RemoveSkills from "../Components/RemoveSkills";
import RemoveInterests from "../Components/RemoveInterests";
import Footer from "../Components/Footer";

function MyProfile_AboutMe() {
  const [statePopUpSkills, setStatePopUpSkills] = useState(false);
  const [statePopUpInterests, setStatePopUpInterests] = useState(false);
  const [statePopUpSkillsRemove, setStatePopUpSkillsRemove] = useState(false);
  const [statePopUpInterestRemove, setStatePopUpInterestRemove] =
    useState(false);

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

  function openAddInterestRemoveModal() {
    setStatePopUpInterestRemove(true);
  }

  function closeAddInterestRemoveModal() {
    setStatePopUpInterestRemove(false);
  }

  return (
    <div className="flex flex-col h-screen">
      <Layout activeTab={0} activeSubTabProfile={4} />
      <div className="flex-grow flex p-4">
        <div className="justify-center w-1/3 h-auto">
          <ProfileCard
            openPopUpSkills={openAddSkillsModal}
            openPopUpInterests={openAddInterestsModal}
            openPopUpSkillsRemove={openAddSkillsRemoveModal}
            openPopUpInterestRemove={openAddInterestRemoveModal}
          />
        </div>
      </div>
      <div className="flex-shrink-0 p-0">
        <Footer />
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
      <RemoveInterests
        openPopUpInterestRemove={statePopUpInterestRemove}
        closePopUpInterestRemove={closeAddInterestRemoveModal}
      />
    </div>
  );
}

export default MyProfile_AboutMe;

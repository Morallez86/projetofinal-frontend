import React, { useState } from "react";
import Layout from "../Components/Layout";
import AddSkills from "../Components/AddSkills";
import AddInterests from "../Components/AddInterests";
import RemoveSkills from "../Components/RemoveSkills";
import RemoveInterests from "../Components/RemoveInterests";
import Footer from "../Components/Footer";
import ProjectCard from "../Components/ProjectCard";
import AddComponents from "../Components/AddComponents";
import RemoveComponents from "../Components/RemoveComponents";
import AddResources from "../Components/AddResources";
import RemoveResources from "../Components/RemoveResources";
import AddUsers from "../Components/AddUsers"; 
import RemoveUsers from "../Components/RemoveUsers";
import useProjectInfo from "../Hooks/useProjectInfo";

function AllProjectsCreateNew() {
  const [statePopUpSkills, setStatePopUpSkills] = useState(false);
  const [statePopUpInterests, setStatePopUpInterests] = useState(false);
  const [statePopUpSkillsRemove, setStatePopUpSkillsRemove] = useState(false);
  const [statePopUpInterestRemove, setStatePopUpInterestRemove] =
    useState(false);
  const [statePopUpComponent, setStatePopUpComponent] = useState(false);
  const [statePopUpComponentsRemove, setStatePopUpComponentsRemove] =
    useState(false);
  const [statePopUpResources, setStatePopUpResources] = useState(false);
  const [statePopUpResourcesRemove, setStatePopUpResourcesRemove] =
    useState(false);
  const [statePopUpUsers, setStatePopUpUsers] = useState(false); 
  const [statePopUpUsersRemove, setStatePopUpUsersRemove] = useState(false);

  const { projectInfo, handleChange, handleWorkplaceChange } = useProjectInfo();
  console.log(projectInfo);

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

  function openAddComponentModal() {
    setStatePopUpComponent(true);
  }

  function closeAddComponentModal() {
    setStatePopUpComponent(false);
  }

  function openRemoveComponentsModal() {
    setStatePopUpComponentsRemove(true);
  }

  function closeRemoveComponentsModal() {
    setStatePopUpComponentsRemove(false);
  }

  function openAddResourcesModal() {
    setStatePopUpResources(true);
  }

  function closeAddResourcesModal() {
    setStatePopUpResources(false);
  }

  function openRemoveResourcesModal() {
    setStatePopUpResourcesRemove(true);
  }

  function closeRemoveResourcesModal() {
    setStatePopUpResourcesRemove(false);
  }

  function openAddUsersModal() {
    setStatePopUpUsers(true); 
  }

  function closeAddUsersModal() {
    setStatePopUpUsers(false); 
  }

  function openRemoveUsersModal() {
    console.log("Opening remove users modal");
    setStatePopUpUsersRemove(true); 
  }

  function closeRemoveUsersModal() {
    setStatePopUpUsersRemove(false);
  }

  return (
    <div className="flex flex-col h-screen">
      <Layout activeTab={1} activeSubTabProfile={0} />
      <div className="flex p-4 justify-center h-auto">
        <ProjectCard
          openPopUpSkills={openAddSkillsModal}
          openPopUpInterests={openAddInterestsModal}
          openPopUpSkillsRemove={openAddSkillsRemoveModal}
          openPopUpInterestRemove={openAddInterestRemoveModal}
          openPopUpComponent={openAddComponentModal}
          openPopUpComponentsRemove={openRemoveComponentsModal}
          openPopUpResources={openAddResourcesModal}
          openPopUpResourcesRemove={openRemoveResourcesModal}
          openPopUpUsers={openAddUsersModal}
          openPopUpUsersRemove={openRemoveUsersModal}
          projectInfo={projectInfo}
          handleChange={handleChange}
          handleWorkplaceChange={handleWorkplaceChange}
        />
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
      <AddComponents
        openPopUpComponent={statePopUpComponent}
        closePopUpComponent={closeAddComponentModal}
        projectInfo={projectInfo}
      />
      <RemoveComponents
        openPopUpComponentsRemove={statePopUpComponentsRemove}
        closePopUpComponentsRemove={closeRemoveComponentsModal}
      />
      <AddResources
        openPopUpResources={statePopUpResources}
        closePopUpResources={closeAddResourcesModal}
      />
      <RemoveResources
        openPopUpResourcesRemove={statePopUpResourcesRemove}
        closePopUpResourcesRemove={closeRemoveResourcesModal}
      />
      <AddUsers
        openPopUpUsers={statePopUpUsers}
        closePopUpUsers={closeAddUsersModal}
        projectInfo={projectInfo}
      />
      <RemoveUsers
        openPopUpUsersRemove={statePopUpUsersRemove}
        closePopUpUsersRemove={closeRemoveUsersModal}
      />
    </div>
  );
}

export default AllProjectsCreateNew;

import React, { useState } from "react";
import AddSkills from "../Components/AddSkills";
import AddInterests from "../Components/AddInterests";
import RemoveSkills from "../Components/RemoveSkills";
import RemoveInterests from "../Components/RemoveInterests";

import ProjectCard from "../Components/ProjectCard";
import AddComponents from "../Components/AddComponents";
import RemoveComponents from "../Components/RemoveComponents";
import AddResources from "../Components/AddResources";
import RemoveResources from "../Components/RemoveResources";
import AddUsers from "../Components/AddUsers"; 
import RemoveUsers from "../Components/RemoveUsers";
import useProjectInfo from "../Hooks/useProjectInfo";

function AllProjectsCreateNew() {
  const [statePopUpSkills, setStatePopUpSkills] = useState(false); // Skills
  const [statePopUpInterests, setStatePopUpInterests] = useState(false); // Interesses
  const [statePopUpSkillsRemove, setStatePopUpSkillsRemove] = useState(false); // Remover Skills pop up
  const [statePopUpInterestRemove, setStatePopUpInterestRemove] = 
    useState(false); // Remover Interesses pop up 
  const [statePopUpComponent, setStatePopUpComponent] = useState(false); // Componentes pop up
  const [statePopUpComponentsRemove, setStatePopUpComponentsRemove] = 
    useState(false); // Remover Componentes pop up 
  const [statePopUpResources, setStatePopUpResources] = useState(false); // Recursos pop up
  const [statePopUpResourcesRemove, setStatePopUpResourcesRemove] =
    useState(false); // Remover Recursos pop up
  const [statePopUpUsers, setStatePopUpUsers] = useState(false);  // Utilizadores pop up
  const [statePopUpUsersRemove, setStatePopUpUsersRemove] = useState(false); // Remover Utilizadores 

  const { projectInfo, setProjectInfo, handleChange, handleWorkplaceChange } = useProjectInfo(); // Custom Hook
  

  function openAddSkillsModal() { // Função para abrir o modal de adicionar skills
    setStatePopUpSkills(true); 
  }

  function closeAddSkillsModal() { // Função para fechar o modal de adicionar skills
    setStatePopUpSkills(false);
  }

  function openAddInterestsModal() { // Função para abrir o modal de adicionar interesses
    setStatePopUpInterests(true);
  }

  function closeAddInterestsModal() { // Função para fechar o modal de adicionar interesses
    setStatePopUpInterests(false);
  }

  function openAddSkillsRemoveModal() { // Função para abrir o modal de remover skills
    setStatePopUpSkillsRemove(true); 
  }

  function closeAddSkillsRemoveModal() { // Função para fechar o modal de remover skills
    setStatePopUpSkillsRemove(false);
  }

  function openAddInterestRemoveModal() {   // Função para abrir o modal de remover interesses
    setStatePopUpInterestRemove(true);
  }

  function closeAddInterestRemoveModal() { // Função para fechar o modal de remover interesses
    setStatePopUpInterestRemove(false);
  }

  function openAddComponentModal() { // Função para abrir o modal de adicionar componentes
    setStatePopUpComponent(true);
  }

  function closeAddComponentModal() { // Função para fechar o modal de adicionar componentes
    setStatePopUpComponent(false);
  }

  function openRemoveComponentsModal() { // Função para abrir o modal de remover componentes
    setStatePopUpComponentsRemove(true);
  }

  function closeRemoveComponentsModal() { // Função para fechar o modal de remover componentes
    setStatePopUpComponentsRemove(false);
  }

  function openAddResourcesModal() { // Função para abrir o modal de adicionar recursos
    setStatePopUpResources(true);
  }

  function closeAddResourcesModal() { // Função para fechar o modal de adicionar recursos
    setStatePopUpResources(false); 
  }

  function openRemoveResourcesModal() { // Função para abrir o modal de remover recursos
    setStatePopUpResourcesRemove(true);
  }

  function closeRemoveResourcesModal() { // Função para fechar o modal de remover recursos
    setStatePopUpResourcesRemove(false);
  }

  function openAddUsersModal() { // Função para abrir o modal de adicionar utilizadores
    setStatePopUpUsers(true); 
  }

  function closeAddUsersModal() { // Função para fechar o modal de adicionar utilizadores
    setStatePopUpUsers(false); 
  }

  function openRemoveUsersModal() { // Função para abrir o modal de remover utilizadores
   
    setStatePopUpUsersRemove(true); 
  }

  function closeRemoveUsersModal() { // Função para fechar o modal de remover utilizadores
    setStatePopUpUsersRemove(false);
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-center py-4 mb-10 h-auto">
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
          setProjectInfo={setProjectInfo}
          handleChange={handleChange}
          handleWorkplaceChange={handleWorkplaceChange}
        />
      </div>
      <AddSkills
        openPopUpSkills={statePopUpSkills}
        closePopUpSkills={closeAddSkillsModal}
        projectInfo={projectInfo}
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

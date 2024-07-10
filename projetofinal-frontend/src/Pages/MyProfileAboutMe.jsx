import React, { useState } from "react";
import ProfileCard from "../Components/ProfileCard";
import AddSkills from "../Components/AddSkills";
import AddInterests from "../Components/AddInterests";
import RemoveSkills from "../Components/RemoveSkills";
import RemoveInterests from "../Components/RemoveInterests";

function MyProfile_AboutMe() {
  const [statePopUpSkills, setStatePopUpSkills] = useState(false); // Skills
  const [statePopUpInterests, setStatePopUpInterests] = useState(false); // Interesses
  const [statePopUpSkillsRemove, setStatePopUpSkillsRemove] = useState(false); // Remover Skills pop up
  const [statePopUpInterestRemove, setStatePopUpInterestRemove] = 
    useState(false); // Remover Interesses pop up

  function openAddSkillsModal() { // Função para abrir o modal de adicionar skills
    setStatePopUpSkills(true);
  }

  function closeAddSkillsModal() { // Função para fechar o modal de adicionar skills
    setStatePopUpSkills(false);
  }

  function openAddInterestsModal() {  // Função para abrir o modal de adicionar interesses
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

  function openAddInterestRemoveModal() {  // Função para abrir o modal de remover interesses
    setStatePopUpInterestRemove(true);
  }

  function closeAddInterestRemoveModal() { // Função para fechar o modal de remover
    setStatePopUpInterestRemove(false);
  }

  return (
    <div className="flex flex-col h-auto">
      <div className="flex p-4 justify-center h-auto ">
        <ProfileCard
          openPopUpSkills={openAddSkillsModal}
          openPopUpInterests={openAddInterestsModal}
          openPopUpSkillsRemove={openAddSkillsRemoveModal}
          openPopUpInterestRemove={openAddInterestRemoveModal}
        />
      </div>
      <AddSkills
        openPopUpSkills={statePopUpSkills}
        closePopUpSkills={closeAddSkillsModal}
        context={"user"}
      />
      <AddInterests
        openPopUpInterests={statePopUpInterests}
        closePopUpInterests={closeAddInterestsModal}
        context={"user"}
      />
      <RemoveSkills
        openPopUpSkillsRemove={statePopUpSkillsRemove}
        closePopUpSkillsRemove={closeAddSkillsRemoveModal}
        context={"user"}
      />
      <RemoveInterests
        openPopUpInterestRemove={statePopUpInterestRemove}
        closePopUpInterestRemove={closeAddInterestRemoveModal}
        context={"user"}
      />
    </div>
  );
}

export default MyProfile_AboutMe;

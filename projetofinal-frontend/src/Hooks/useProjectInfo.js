import { useState, useEffect } from "react";
import useProjectStore from "../Stores/ProjectStore";

const useProjectInfo = () => {
  const projectSkills = useProjectStore((state) => state.projectSkills); // skills
  const projectInterests = useProjectStore((state) => state.projectInterests); // interesses
  const projectComponents = useProjectStore((state) => state.projectComponents); // componentes
  const projectResources = useProjectStore((state) => state.projectResources); // recursos
  const projectUsers = useProjectStore((state) => state.projectUsers); // utilizadores
  const clearProjectComponents = useProjectStore(
    (state) => state.clearProjectComponents // limpar componentes
  );

  const [projectInfo, setProjectInfo] = useState({ // informações do projeto
    title: "",
    description: "",
    motivation: "",
    maxUsers: 4,
    startingDate: "",
    plannedEndDate: "",
    workplace: { id: null, name: "" },
    components: [],
    resources: [],
    interests: [],
    skills: [],
    userProjectDtos: [],
  });

  useEffect(() => { // useEffect
    setProjectInfo((prevInfo) => ({ // set das informações do projeto
      ...prevInfo,
      skills: projectSkills,
      interests: projectInterests,
      components: projectComponents,
      resources: projectResources,
      userProjectDtos: projectUsers,
    }));
  }, [
    projectSkills,
    projectInterests,
    projectComponents,
    projectResources,
    projectUsers,
  ]);

  const handleChange = (e) => { // função para mudar os valores
    const { name, value } = e.target;
    setProjectInfo((prevInfo) => ({ // set das informações do projeto
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleWorkplaceChange = (e) => { // função para mudar o local de trabalho
    clearProjectComponents(); // limpar componentes
    const selectedWorkplace = JSON.parse(e.target.value);
    setProjectInfo((prevInfo) => ({
      ...prevInfo,
      workplace: selectedWorkplace,
    }));
  };

  return {
    projectInfo,
    handleChange,
    handleWorkplaceChange,
  };
};

export default useProjectInfo;

import { useState, useEffect } from "react";
import useProjectStore from "../Stores/ProjectStore";

const useProjectInfo = () => {
  const projectSkills = useProjectStore((state) => state.projectSkills);
  const projectInterests = useProjectStore((state) => state.projectInterests);
  const projectComponents = useProjectStore((state) => state.projectComponents);
  const projectResources = useProjectStore((state) => state.projectResources);
  const projectUsers = useProjectStore((state) => state.projectUsers);
  const clearProjectComponents = useProjectStore(
    (state) => state.clearProjectComponents
  );

  const [projectInfo, setProjectInfo] = useState({
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

  useEffect(() => {
    setProjectInfo((prevInfo) => ({
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleWorkplaceChange = (e) => {
    clearProjectComponents();
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

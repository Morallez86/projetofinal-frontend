import { useState, useEffect } from "react";
import useProjectStore from "../Stores/ProjectStore";

const useProjectInfo = () => {
  const projectSkills = useProjectStore((state) => state.projectSkills);
  const projectInterests = useProjectStore((state) => state.projectInterests);
  const projectComponents = useProjectStore((state) => state.projectComponents);
  const projectResources = useProjectStore((state) => state.projectResources);
  const projectUsers = useProjectStore((state) => state.projectUsers);

  const [projectInfo, setProjectInfo] = useState({
    title: "",
    description: "",
    motivation: "",
    status: "",
    maxUsers: 0,
    startingDate: "",
    plannedEndDate: "",
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
  }, [projectSkills, projectInterests, projectComponents, projectResources, projectUsers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  return {
    projectInfo,
    handleChange,
  };
};

export default useProjectInfo;

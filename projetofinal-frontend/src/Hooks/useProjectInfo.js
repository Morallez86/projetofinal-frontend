import { useState, useEffect } from "react";
import useProjectStore from "../Stores/ProjectStore";

const useProjectInfo = () => {
  const projectSkills = useProjectStore((state) => state.projectSkills);
  const projectInterests = useProjectStore((state) => state.projectInterests);

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
  });

  useEffect(() => {
    setProjectInfo((prevInfo) => ({
      ...prevInfo,
      skills: projectSkills,
      interests: projectInterests,
    }));
  }, [projectSkills, projectInterests]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleDropdownChange = (name, value) => {
    setProjectInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  return {
    projectInfo,
    handleChange,
    handleDropdownChange,
  };
};

export default useProjectInfo;

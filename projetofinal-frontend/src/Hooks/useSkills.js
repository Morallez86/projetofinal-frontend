import { useEffect } from "react";
import { getSkills } from "../Services/skillService";
import useSkillStore from "../Stores/SkillStore";
import useUserStore from "../Stores/UserStore";
import { useNavigate } from "react-router-dom";

const useSkills = () => {
  const setSkills = useSkillStore((state) => state.setSkills);
  const skills = useSkillStore((state) => state.skills);
  const { token } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Only fetch skills if token exists and they are not already set
    if (token && (!skills || skills.length === 0)) {
      const fetchData = async () => {
        try {
          const data = await getSkills(token, navigate); // Pass token to getSkills
          setSkills(data);
        } catch (error) {
          console.error("Error fetching skills:", error);
        }
      };
      fetchData();
    }
  }, [token, skills, setSkills, navigate]);

  return { skills };
};

export default useSkills;

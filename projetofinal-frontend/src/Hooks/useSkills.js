import { useEffect } from "react";
import { getSkills } from "../Services/skillService";
import useSkillStore from "../Stores/SkillStore";
import useUserStore from "../Stores/UserStore";
import { useNavigate } from "react-router-dom";

const useSkills = () => {
  const setSkills = useSkillStore((state) => state.setSkills); // setSkills
  const skills = useSkillStore((state) => state.skills); // skills
  const { token } = useUserStore(); // token
  const navigate = useNavigate(); 

  useEffect(() => {
    
    if (token && (!skills || skills.length === 0)) { // se o token existir e as skills não existirem
      const fetchData = async () => {
        try {
          const data = await getSkills(token, navigate); // fetch das skills
          setSkills(data);
        } catch (error) {
          console.error("Error fetching skills:", error);
        }
      };
      fetchData();
    }
  }, [token, skills, setSkills, navigate]); // dependências

  return { skills };
};

export default useSkills;

import { useEffect } from "react";
import { getInterests } from "../Services/interestService";
import useInterestStore from "../Stores/InterestStore";
import useUserStore from "../Stores/UserStore";

const useInterests = () => {
  const setInterests = useInterestStore((state) => state.setInterests); // setInterests
  const interests = useInterestStore((state) => state.interests); // interesses
  const { token } = useUserStore(); // token

  useEffect(() => {
    
    if (token && (!interests || interests.length === 0)) { // se o token existir e os interesses não existirem
      const fetchData = async () => {
        try {
          const data = await getInterests(token);
          setInterests(data);
        } catch (error) {
          console.error("Error fetching interests:", error);
        }
      };
      fetchData();
    }
  }, [token, interests, setInterests]);

  return { interests };
};

export default useInterests;

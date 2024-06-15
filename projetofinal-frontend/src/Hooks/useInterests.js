import { useEffect } from "react";
import { getInterests } from "../Services/interestService";
import useInterestStore from "../Stores/InterestStore";
import useUserStore from "../Stores/UserStore";

const useInterests = () => {
  const setInterests = useInterestStore((state) => state.setInterests);
  const interests = useInterestStore((state) => state.interests);
  const { token } = useUserStore();

  useEffect(() => {
    // Only fetch interests if token exists and they are not already set
    if (token && (!interests || interests.length === 0)) {
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

import { Card } from "flowbite-react";
import { Avatar } from "flowbite-react";
import useUserStore from "../Stores/UserStore";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { LuPlusCircle } from "react-icons/lu";
import { Tooltip } from "react-tooltip";

function ProfileCard({ openPopUpSkills, openPopUpInterests }) {
  const token = useUserStore((state) => state.token);
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  const setSkills = useUserStore((state) => state.setSkills);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const [userInfo, setUserInfo] = useState({
    name: "",
    jobLocation: "",
    nickname: "",
    skills: "",
    interests: "",
    biography: "",
  });

  const fetchUserInfo = async () => {
    fetch(
      `http://localhost:8080/projetofinal-backend-1.0-SNAPSHOT/rest/users/profile/${userId}`,
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(async function (response) {
        if (response.status === 404) {
          console.log("User with this token is not found");
        } else if (response.status === 200) {
          const userInfoData = await response.json();
          console.log(userInfoData);
          console.log("User skills", userInfoData.skills);
          setSkills(userInfoData.skills);
          setUserInfo({
            name: `${userInfoData.firstName} ${userInfoData.lastName}`,
            nickname: userInfoData.username,
            biography: userInfoData.userBiography,
            jobLocation: userInfoData.workplace,
            skills: userInfoData.skills,
            interests: userInfoData.interests,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };

  return (
    <Card className="max-w-sm bg-transparent hover:bg-gray-200 transition-colors duration-200">
      <div className="flex flex-col pb-10 ">
        <Avatar
          img="https://byuc.wordpress.com/wp-content/uploads/2012/07/avat-2.jpg?w=640"
          alt="avatar"
          size={"xl"}
          rounded
        />
        <div className="mt-4">
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            Name
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {userInfo.name}
          </p>
        </div>
        <div className="mt-4">
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            Job Location
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {userInfo.jobLocation}
          </p>
        </div>
        <div className="mt-4">
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            Nickname
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {userInfo.nickname}
          </p>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
              Skills
            </h5>
            <div
              id="icon-element"
              className="inline-flex items-center cursor-pointer"
              onClick={openPopUpSkills}
            >
              <LuPlusCircle className="h-4 w-4 text-black font-bold ml-2" />
            </div>
            <Tooltip
              anchorSelect="#icon-element"
              content="Add new skill"
              place="right"
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {userInfo.skills}
          </p>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
              Interests
            </h5>
            <div
              id="icon-element-interests"
              className="inline-flex items-center cursor-pointer"
              onClick={openPopUpInterests}
            >
              <LuPlusCircle className="h-4 w-4 text-black font-bold ml-2" />
            </div>
            <Tooltip
              anchorSelect="#icon-element-interests"
              content="Add new interest"
              place="right"
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {userInfo.interests}
          </p>
        </div>
        <div className="mt-4">
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            Biography
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {userInfo.biography}
          </p>
        </div>
      </div>
    </Card>
  );
}
export default ProfileCard;

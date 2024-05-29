import { Card, TextInput, Label, Button, Textarea, Avatar } from "flowbite-react";
import useUserStore from "../Stores/UserStore";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { LuPlusCircle } from "react-icons/lu";
import { Tooltip } from "react-tooltip";
import { MdOutlineRemoveCircleOutline } from "react-icons/md";
import { MdOutlineEdit } from "react-icons/md";

function ProfileCard({
  openPopUpSkills,
  openPopUpInterests,
  openPopUpSkillsRemove,
  openPopUpInterestRemove,
}) {
  const token = useUserStore((state) => state.token);
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  const setSkills = useUserStore((state) => state.setSkills);
  const setInterests = useUserStore((state) => state.setInterests);

  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    jobLocation: "",
    nickname: "",
    skills: [],
    interests: [],
    biography: "",
  });

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/projetofinal-backend-1.0-SNAPSHOT/rest/users/profile/${userId}`,
        {
          method: "GET",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 404) {
        console.log("User with this token is not found");
      } else if (response.status === 200) {
        const userInfoData = await response.json();
        console.log(userInfoData);
        setSkills(userInfoData.skills);
        setInterests(userInfoData.interests);
        setUserInfo({
          name: `${userInfoData.firstName} ${userInfoData.lastName}`,
          nickname: userInfoData.username,
          biography: userInfoData.biography,
          jobLocation: userInfoData.workplace,
          skills: userInfoData.skills.map((skill) => skill.name),
          interests: userInfoData.interests.map((interest) => interest.name),
        });
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    // Save the updated user info here
    try {
      const response = await fetch(
        `http://localhost:8080/projetofinal-backend-1.0-SNAPSHOT/rest/users/profile/${userId}`,
        {
          method: "PUT",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: userInfo.name.split(' ')[0],
            lastName: userInfo.name.split(' ')[1],
            username: userInfo.nickname,
            biography: userInfo.biography,
            workplace: userInfo.jobLocation,
          }),
        }
      );

      if (response.status === 200) {
        console.log("User info updated successfully");
        setEditMode(false);
      } else {
        console.error("Error updating user info");
      }
    } catch (error) {
      console.error("Error updating user info:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  return (
    <Card className="max-w-sm bg-transparent hover:bg-gray-200 transition-colors duration-200">
      <div className="flex flex-col pb-10">
        <div className="relative flex items-center justify-center">
          <Avatar
            img="https://byuc.wordpress.com/wp-content/uploads/2012/07/avat-2.jpg?w=640"
            alt="avatar"
            size="xl"
            rounded
          />
          <MdOutlineEdit
            className="h-6 w-6 text-black cursor-pointer absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2"
            onClick={handleEditClick}
          />
        </div>
        <div className="mt-4">
          <Label htmlFor="name" value="Name" />
          {editMode ? (
            <TextInput
              id="name"
              type="text"
              name="name"
              value={userInfo.name}
              onChange={handleChange}
              className="text-sm text-gray-500 dark:text-gray-400"
            />
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">{userInfo.name}</p>
          )}
        </div>
        <div className="mt-4">
          <Label htmlFor="jobLocation" value="Job Location" />
          {editMode ? (
            <TextInput
              id="jobLocation"
              type="text"
              name="jobLocation"
              value={userInfo.jobLocation}
              onChange={handleChange}
              className="text-sm text-gray-500 dark:text-gray-400"
            />
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">{userInfo.jobLocation}</p>
          )}
        </div>
        <div className="mt-4">
          <Label htmlFor="nickname" value="Nickname" />
          {editMode ? (
            <TextInput
              id="nickname"
              type="text"
              name="nickname"
              value={userInfo.nickname}
              onChange={handleChange}
              className="text-sm text-gray-500 dark:text-gray-400"
            />
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">{userInfo.nickname}</p>
          )}
        </div>
        <div className="mt-4">
          <Label htmlFor="biography" value="Biography" />
          {editMode ? (
            <Textarea
              id="biography"
              name="biography"
              value={userInfo.biography}
              onChange={handleChange}
              className="text-sm text-gray-500 dark:text-gray-400"
              rows={2}
            />
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">{userInfo.biography}</p>
          )}
        </div>
        {editMode && (
          <Button onClick={handleSaveClick} className="mt-4">
            Save
          </Button>
        )}
        <div className="mt-4">
          <div className="flex items-center">
            <Label htmlFor="skills" value="Skills" />
            <div
              id="icon-element"
              className="inline-flex items-center cursor-pointer"
              onClick={openPopUpSkills}
            >
              <LuPlusCircle className="h-4 w-4 text-black font-bold ml-2" />
            </div>
            <div
              id="icon-element-remove"
              className="inline-flex items-center cursor-pointer"
              onClick={openPopUpSkillsRemove}
            >
              <MdOutlineRemoveCircleOutline className="h-4.5 w-4.5 text-black font-bold ml-2" />
            </div>
            <Tooltip
              anchorSelect="#icon-element"
              content="Add new skill"
              place="top"
            />
            <Tooltip
              anchorSelect="#icon-element-remove"
              content="Remove a skill"
              place="top"
            />
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              {Array.isArray(userInfo.skills)
                ? userInfo.skills.slice(-5).join(", ")
                : ""}
            </p>
            {Array.isArray(userInfo.skills) && userInfo.skills.length > 5 && (
              <div id="tip-all-skills">
                <button className="ml-2 w-12 h-6 flex items-center justify-center hover:text-2xl hover:font-bold">
                  {`+${userInfo.skills.length - 5}`}
                </button>
                <Tooltip
                  anchorSelect="#tip-all-skills"
                  content="Check all skills"
                  place="top"
                />
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <Label htmlFor="interests" value="Interests" />
            <div
              id="icon-element-interests"
              className="inline-flex items-center cursor-pointer"
              onClick={openPopUpInterests}
            >
              <LuPlusCircle className="h-4 w-4 text-black font-bold ml-2" />
            </div>
            <div
              id="icon-element-remove-interest"
              className="inline-flex items-center cursor-pointer"
              onClick={openPopUpInterestRemove}
            >
              <MdOutlineRemoveCircleOutline className="h-4.5 w-4.5 text-black font-bold ml-2" />
            </div>
            <Tooltip
              anchorSelect="#icon-element-interests"
              content="Add new interest"
              place="top"
            />
            <Tooltip
              anchorSelect="#con-element-remove-interest"
              content="Remove an interest"
              place="top"
            />
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              {Array.isArray(userInfo.interests)
                ? userInfo.interests.slice(-5).join(", ")
                : ""}
            </p>
            {Array.isArray(userInfo.interests) &&
              userInfo.interests.length > 5 && (
                <div id="tip-all-interests">
                  <button className="ml-2 w-12 h-6 flex items-center justify-center hover:text-2xl hover:font-bold">
                    {`+${userInfo.interests.length - 5}`}
                  </button>
                  <Tooltip
                    anchorSelect="#tip-all-interests"
                    content="Check all interests"
                    place="top"
                  />
                </div>
              )}
          </div>
        </div>
      </div>
    </Card>
  );
}
export default ProfileCard;

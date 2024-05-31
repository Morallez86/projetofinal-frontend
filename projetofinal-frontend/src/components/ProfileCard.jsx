import {
  Card,
  TextInput,
  Label,
  Button,
  Textarea,
  Avatar,
  FileInput,
  Select,
} from "flowbite-react";
import useUserStore from "../Stores/UserStore";
import useWorkplaceStore from "../Stores/WorkplaceStore";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { LuPlusCircle } from "react-icons/lu";
import { Tooltip } from "react-tooltip";
import { MdOutlineRemoveCircleOutline, MdOutlineEdit } from "react-icons/md";
import useApiStore from '../Stores/ApiStore';

function ProfileCard({
  openPopUpSkills,
  openPopUpInterests,
  openPopUpSkillsRemove,
  openPopUpInterestRemove,
}) {
  const apiUrl = useApiStore((state) => state.apiUrl);
  const token = useUserStore((state) => state.token);
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  const email = decodedToken.sub;
  const setSkills = useUserStore((state) => state.setSkills);
  const setInterests = useUserStore((state) => state.setInterests);
  const userSkills = useUserStore((state) => state.skills);
  const userInterests = useUserStore((state) => state.interests);
  const setProfileImage = useUserStore((state) => state.setProfileImage);
  const initialProfileImage = useUserStore((state) => state.profileImage);
  const { workplaces } = useWorkplaceStore();

  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImageLocal] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: "",
    jobLocation: "",
    nickname: "",
    visibility: true,
    skills: [],
    interests: [],
    biography: "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setSelectedImage(file);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      skills: userSkills.map((skill) => skill.name),
    }));
  }, [userSkills]);

  useEffect(() => {
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      interests: userInterests.map((interest) => interest.name),
    }));
  }, [userInterests]);

  useEffect(() => {
    if (initialProfileImage) {
      setProfileImageLocal(initialProfileImage);
    }
  }, [initialProfileImage]);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/users/profile/${userId}`,
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
          visibility: userInfoData.visibility,
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
  try {
    if (selectedImage) {
      console.log(email);
      const fileInput = document.getElementById("small-file-upload");
      const file = fileInput.files[0];

      const imageResponse = await fetch(`${apiUrl}/users/image`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          filename: file.name,
          email: email,
        },
        body: file,
      });

      if (imageResponse.status === 200) {
        console.log("Image uploaded successfully");
      } else {
        console.log("Image upload failed");
      }
    }

    // Update the user info
  const response = await fetch(`${apiUrl}/users/profile/${userId}`, {
      method: "PUT",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        firstName: userInfo.name.split(" ")[0],
        lastName: userInfo.name.split(" ")[1],
        username: userInfo.nickname,
        biography: userInfo.biography,
        workplace: userInfo.jobLocation,
        visibility: userInfo.visibility,
      }),
    });

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

  const handleCancelClick = () => {
    setEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  return (
    <Card className="bg-gray-200 transition-colors duration-200 w-1/2 h-auto">
      <div className="flex flex-col pb-10">
        <div className="relative flex items-center space-x-10 justify-center">
          <Avatar
            img={profileImage}
            alt="avatar"
            size="xl"
            rounded
          />
          <MdOutlineEdit
            className="h-6 w-6 text-black cursor-pointer absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2"
            onClick={handleEditClick}
          />
          {editMode && (
            <FileInput
              id="small-file-upload"
              sizing="sm"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-4"
            />
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
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
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {userInfo.name}
              </p>
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
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {userInfo.jobLocation}
              </p>
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
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {userInfo.nickname}
              </p>
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
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {userInfo.biography}
              </p>
            )}
          </div>
          <div className="mt-4">
            <Label htmlFor="visibility" value="Visibility" />
            {editMode ? (
              <Select
                id="visibility"
                name="visibility"
                value={userInfo.visibility.toString()} 
                onChange={handleChange}
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                <option value="true">Public</option>
                <option value="false">Private</option>
              </Select>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {userInfo.visibility ? "Public" : "Private"} 
              </p>
            )}
          </div>
        </div>
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
              anchorSelect="#icon-element-remove-interest"
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
            {Array.isArray(userInfo.interests) && userInfo.interests.length > 5 && (
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
        {editMode && (
          <div className="flex justify-end mt-4">
            <Button onClick={handleCancelClick} className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleSaveClick}>Save</Button>
          </div>
        )}
      </div>
    </Card>
  );
}

export default ProfileCard;

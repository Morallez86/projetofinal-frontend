import React, { useState } from "react";
import { Modal, Button, TextInput } from "flowbite-react";
import useUserStore from "../Stores/UserStore";
import useProjectStore from "../Stores/ProjectStore";
import useApiStore from "../Stores/ApiStore";
import basePhoto from "../Assets/092.png";
import { jwtDecode } from "jwt-decode";
import {useTranslation} from "react-i18next";

function AddUsers({ openPopUpUsers, closePopUpUsers, projectInfo }) {
  const token = useUserStore((state) => state.token);
  const apiUrl = useApiStore((state) => state.apiUrl);
  const projectUsers = useProjectStore((state) => state.projectUsers);
  const setProjectUsers = useProjectStore((state) => state.setProjectUsers);
  let currentUserId;
  if(token){
      const decodedToken = jwtDecode(token);
      currentUserId = decodedToken.id;
  }

  const [users, setUsers] = useState([]);
  const [userImages, setUserImages] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const handleSearch = async () => {
    if (inputValue.length >= 3) {
      try {
        const response = await fetch(
          `${apiUrl}/users/search?query=${inputValue}`,
          {
            method: "GET",
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          setUsers(data);
          console.log(data);
          fetchUserImages(data);
        } else if (response.status === 404) {
          console.log("Users not found");
          setUsers([]);
          setUserImages({});
        }
      } catch (error) {
        console.error("Error searching users:", error);
      }
    } else {
      setUsers([]);
      setUserImages({});
    }
  };

  const fetchUserImages = async (users) => {
    const userIds = users.map((user) => user.id);
    try {
      const response = await fetch(`${apiUrl}/users/images`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userIds),
      });

      if (response.ok) {
        const imagesData = await response.json();
        const imagesMap = {};
        imagesData.forEach((img) => {
          imagesMap[img.id] = img;
        });
        setUserImages(imagesMap);
      } else {
        console.error("Error fetching user images");
      }
    } catch (error) {
      console.error("Error fetching user images:", error);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddUser = (user) => {
    if (projectUsers.length >= projectInfo.maxUsers - 1) {
      setError(`Cannot add more than ${projectInfo.maxUsers - 1} users`);
      return;
    }
    console.log(user.id);
    console.log(currentUserId);

    if (user.id === currentUserId) {
      setError("You cannot add yourself to the project team");
      return;
    }

    if (projectUsers.some((projectUser) => projectUser.userId === user.id)) {
      setError("This user is already in the project team");
      return;
    }

    const userData = { userId: user.id, username: user.username };

    // Add the user to the project users
    setProjectUsers([...projectUsers, userData]);

    // Clear the input field and close the modal
    setInputValue("");
    setError("");
    setUsers([]);
    setUserImages({});
    closePopUpUsers();
  };

  return (
    <Modal
      show={openPopUpUsers}
      size="xl"
      onClose={() => {
        closePopUpUsers();
        setUsers([]);
        setError("");
        setInputValue("");
        setUserImages({});
      }}
      popup
    >
      <Modal.Header />
      <Modal.Body>
        <div className="flex flex-col items-center justify-center space-y-5 overflow-x-hidden overflow-y-hidden">
          <h3 className="mb-5 text-lg font-bold text-gray-500 dark:text-gray-400">
            {t("addUsers")}
          </h3>
          <div className="space-y-3">
            <h4>{t('SearchForAuserByTypingAtLeast3Letters')}</h4>
            <div className="flex items-center space-x-4">
              <TextInput
                id="search"
                type="text"
                placeholder={t('SearchForAUser')}
                value={inputValue}
                onChange={handleInputChange}
              />
              <Button onClick={handleSearch}>{t('Search')}</Button>
            </div>
            <div className="mt-4 w-full">
              {users.length > 0 ? (
                <ul className="space-y-2">
                  {users.map((user) => (
                    <li
                      key={user.id}
                      className="flex items-center justify-between p-2 border rounded-lg cursor-pointer hover:bg-gray-100"
                      onClick={() => handleAddUser(user)}
                    >
                      <div className="flex items-center">
                        {userImages[user.id] ? (
                          <img
                            src={`data:${userImages[user.id].type};base64,${
                              userImages[user.id].image
                            }`}
                            alt={`${user.username}'s profile`}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                        ) : (
                          <img
                            src={basePhoto}
                            alt="Placeholder"
                            className="w-8 h-8 rounded-full mr-2"
                          />
                        )}
                        <span>{user.username}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">{t('NoUsersFound')}</p>
              )}
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AddUsers;

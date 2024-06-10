import React, { useState, useEffect } from "react";
import { Modal, Button, TextInput } from "flowbite-react";
import useUserStore from "../Stores/UserStore";
import useApiStore from "../Stores/ApiStore";

function AddUsers({ openPopUpUsers, closePopUpUsers, context }) {
  const token = useUserStore((state) => state.token);
  const apiUrl = useApiStore((state) => state.apiUrl);

  const [users, setUsers] = useState([]);
  const [inputValue, setInputValue] = useState("");

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
        } else if (response.status === 404) {
          console.log("Users not found");
        }
      } catch (error) {
        console.error("Error searching users:", error);
      }
    } else {
      setUsers([]);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddUser = async (user) => {
    const data = [{ id: user.id, username: user.username }];

    if (context === "user") {
      try {
        const response = await fetch(`${apiUrl}/users`, {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (response.status === 201) {
          const newUsers = await response.json();
          setUsers([...users, ...newUsers]);
        } else if (response.status === 500) {
          console.error("Internal Server Error");
        }
      } catch (error) {
        console.error("Error adding user:", error);
      }
    } else {
      // Handle project user addition logic
    }
  };

  return (
    <Modal
      show={openPopUpUsers}
      size="xl"
      onClose={() => {
        closePopUpUsers();
        setUsers([]);
        setInputValue("");
      }}
      popup
    >
      <Modal.Header />
      <Modal.Body>
        <div className="flex flex-col items-center justify-center space-y-5 overflow-x-hidden overflow-y-hidden">
          <h3 className="mb-5 text-lg font-bold text-gray-500 dark:text-gray-400">
            Add User
          </h3>
          <div className="space-y-3">
            <h4>Search for a user by typing at least 3 letters</h4>
            <div className="flex items-center space-x-4">
              <TextInput
                id="search"
                type="text"
                placeholder="Search for users"
                value={inputValue}
                onChange={handleInputChange}
              />
              <Button onClick={handleSearch}>Search</Button>
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
                        <img
                          src={user.photo}
                          alt={user.username}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span>{user.username}</span>
                      </div>
                      <Button size="xs">Add</Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No users found</p>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AddUsers;

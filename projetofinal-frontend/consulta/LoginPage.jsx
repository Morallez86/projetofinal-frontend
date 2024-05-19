import React from "react";
import "../general.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { userStore } from "../stores/UserStore";
import translations from "../Translation/translation";

function LoginPage() {
  const navigate = useNavigate();
  const updateToken = userStore((state) => state.updateToken);
  const updateUserPhoto = userStore((state) => state.updateUserPhoto);
  const updateLoginUser = userStore((state) => state.updateLoginUser);
  const updateFirstName = userStore((state) => state.updateFirstName);
  const loginUser = userStore((state) => state.loginUser);
  const updateNotification = userStore((state) => state.updateNotification);
  const updateAllUsers = userStore((state) => state.updateAllUsers);
  const language = userStore((state) => state.language);
  const updateLanguage = userStore((state) => state.updateLanguage);

  const updateNotCheckedNotification = userStore(
    (state) => state.updateNotCheckedNotification
  );

  const {
    usernameLabel,
    usernamePlaceholder,
    passwordLabel,
    passwordPlaceholder,
    backButton,
    switchLanguageButton,
    recoveryPassword,
  } = translations[language];

  const toggleLanguage = (e) => {
    e.preventDefault();
    updateLanguage(language === "en" ? "pt" : "en");
  };

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const goBack = () => {
    navigate("/goBackInitialPage", { replace: true });
  };

  const loginSucess = () => {
    navigate("/htmlDefault", { replace: true });
  };

  const recoveryPassPage = (e) => {
    e.preventDefault();
    navigate("/recoveryPassword", { replace: true });
  };

  const findUser = (username, token) => {
    fetch(`http://localhost:8080/projecto5backend/rest/user/${username}`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        token: token,
      },
    })
      .then(async function (response) {
        if (response.status === 404) {
          alert("Username not found");
        } else if (response.status === 200) {
          const user = await response.json();
          updateLoginUser(user);
          console.log("user", user);
          console.log("loginUser", loginUser);
          updateFirstName(user.name.split(" ")[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("http://localhost:8080/projecto5backend/rest/user/login", {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        username: formData.username,
        password: formData.password,
      },
    }).then(async function (response) {
      if (response.status === 403) {
        alert("User is not active or not confirmed");
      } else if (response.status === 404) {
        alert("Username or password are incorrect");
      } else if (response.status === 200) {
        const token = await response.text();
        updateToken(token);
        findUser(formData.username, token);
        fetch("http://localhost:8080/projecto5backend/rest/user/photo", {
          method: "GET",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            token: token,
          },
        })
          .then(async function (response) {
            if (response.status === 401) {
              alert("Unauthorized");
            } else if (response.status === 200) {
              const userPhoto = await response.text();
              updateUserPhoto(userPhoto);
              console.log("loginUser", loginUser);
              fetch(
                "http://localhost:8080/projecto5backend/rest/notif/notifications",
                {
                  method: "GET",
                  headers: {
                    Accept: "*/*",
                    "Content-Type": "application/json",
                    token: token,
                    username: formData.username,
                  },
                }
              )
                .then(async function (response) {
                  if (response.status === 403) {
                    alert("User with this token is not found");
                  } else if (response.status === 200) {
                    const notifications = await response.json();
                    updateNotification(notifications);
                    fetch(
                      "http://localhost:8080/projecto5backend/rest/notif/notificationsNotChecked",
                      {
                        method: "GET",
                        headers: {
                          Accept: "*/*",
                          "Content-Type": "application/json",
                          token: token,
                        },
                      }
                    )
                      .then(async function (response) {
                        if (response.status === 403) {
                          alert("User with this token is not found");
                        } else if (response.status === 200) {
                          const notCheckedNotifications = await response.json();
                          updateNotCheckedNotification(notCheckedNotifications);

                          fetch(
                            "http://localhost:8080/projecto5backend/rest/user/all",
                            {
                              method: "GET",
                              headers: {
                                Accept: "*/*",
                                "Content-Type": "application/json",
                                token: token,
                              },
                            }
                          )
                            .then(async function (response) {
                              if (response.status === 403) {
                                alert("User with this token is not found");
                              } else if (response.status === 200) {
                                const usersData = await response.json();
                                updateAllUsers(usersData);
                                loginSucess();
                              }
                            })
                            .catch((error) => {
                              console.error("Error fetching users:", error);
                            });
                        }
                      })
                      .catch((error) => {
                        console.error(
                          "Error fetching user not checked notifications:",
                          error
                        );
                      });
                  }
                })
                .catch((error) => {
                  console.error("Error fetching user notifications:", error);
                });
            }
          })
          .catch((error) => {
            console.error("Error fetching user photo:", error);
          });
      }
    });
  };

  return (
    <div>
      <div className="overlay"></div>
      <div className="modal">
        <form onSubmit={handleSubmit}>
          <div>
            <div className="labels-containers">
              <label htmlFor="username">{usernameLabel}</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder={usernamePlaceholder}
              />
              <label htmlFor="password">{passwordLabel}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={passwordPlaceholder}
              />
            </div>
          </div>
          <div className="button-container">
            <input className="button" type="submit" value="Send" />
            <button className="button" onClick={goBack}>
              {backButton}
            </button>
            <button className="button" onClick={toggleLanguage}>
              {switchLanguageButton}
            </button>
            <button className="button" onClick={recoveryPassPage}>
              {recoveryPassword}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

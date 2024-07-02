import React from "react";
import "../general.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useUserStore from "../Stores/UserStore";

function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const setLanguage = useUserStore((state) => state.setLanguage);

  //Dados do formulário
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    contactNumber: "",
    userPhoto: "",
  });

  const [warnings, setWarnings] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    contactNumber: "",
    userPhoto: "",
  });

  const fetchGreeting = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/projetofinal-backend-1.0-SNAPSHOT/rest/greetings",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erro na requisição: " + response.statusText);
      }

      const data = await response.json();
      console.log(data);

      // Supondo que 'data.locale' seja uma string como 'en-AU'
      // e você quer apenas 'en'
      const languageCode = data.locale.substring(0, 2);
      console.log(languageCode);
      setLanguage(languageCode);

      // Agora você pode usar 'languageCode' para mudar a linguagem da aplicação
      i18n.changeLanguage(languageCode);
    } catch (error) {
      console.error("Erro ao buscar a saudação:", error.message);
      throw error;
    }
  };

  useEffect(() => {
    fetchGreeting();
  }, []);

  //Mudaça de valores pelos preenchidos
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setWarnings((prevWarnings) => ({ ...prevWarnings, [name]: "" }));
    console.log(formData);
  };

  //Submissão do formulário
  const handleSubmit = (event) => {
    event.preventDefault();

    const newWarnings = {};

    if (/\s/.test(formData.username)) {
      newWarnings.username = t("Username cannot contain spaces");
    }
    if (formData.password === "") {
      newWarnings.password = t("Password is required");
    }
    if (!/^(\S+\s+\S+)$/.test(formData.name.trim())) {
      newWarnings.name = t("Name must contain exactly two names");
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newWarnings.email = t("Invalid email format");
    }
    if (!/^\d{9}$/.test(formData.contactNumber.trim())) {
      newWarnings.contactNumber = t(
        "Invalid phone number format (should contain exactly 9 digits"
      );
    }

    if (
      formData.userPhoto.trim() &&
      !formData.userPhoto.trim().startsWith("https://")
    ) {
      newWarnings.userPhoto = t("Photo URL should start with https://");
    }

    setWarnings(newWarnings);

    if (Object.values(newWarnings).every((warning) => warning === "")) {
      console.log(formData.password);
      fetch("http://localhost:8080/projecto5backend/rest/user/register", {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }).then(function (response) {
        if (response.status === 400) {
          alert("All elements are required");
        } else if (response.status === 409) {
          alert("User with this username is already exists");
        } else if (response.status === 201) {
          navigate("/loginPage", { replace: true });
        }
      });
    }
  };

  const goBack = () => {
    navigate("/goBackInitialPage", { replace: true });
  };

  return (
    <div>
      <div className="overlay"></div>
      <div className="modal">
        <form onSubmit={handleSubmit}>
          <div>
            <div className="labels-containers">
              <label htmlFor="username"> {t("Username")} </label>
              <input
                type="text"
                name="username"
                defaultValue=""
                onChange={handleChange}
                placeholder={t("Your Username")}
              />
              <div className="warning">{warnings.username}</div>
              <label>
                <label htmlFor="password"> {t("password")} </label>
                <input
                  type="password"
                  name="password"
                  defaultValue=""
                  onChange={handleChange}
                  placeholder={t("Your Password")}
                />
                <div className="warning">{warnings.password}</div>
              </label>
              <label htmlFor="name"> {t("Name")} </label>
              <input
                type="text"
                name="name"
                defaultValue=""
                onChange={handleChange}
                placeholder={t("First and Last Name")}
              />
              <div className="warning">{warnings.name}</div>
              <label htmlFor="email"> {t("Email")}</label>
              <input
                type="text"
                name="email"
                defaultValue=""
                onChange={handleChange}
                placeholder={t("Your Email")}
              />
              <div className="warning">{warnings.email}</div>
              <label htmlFor="contactNumber"> {t("PhoneNumber")} </label>
              <input
                type="text"
                name="contactNumber"
                defaultValue=""
                onChange={handleChange}
                placeholder={t("Your Phone Number")}
              />
              <div className="warning">{warnings.contactNumber}</div>
              <label htmlFor="userPhoto"> {t("Photo")}</label>
              <input
                type="text"
                name="userPhoto"
                defaultValue=""
                onChange={handleChange}
                placeholder={t("Photo")}
              />
              <div className="warning">{warnings.userPhoto}</div>
            </div>
          </div>
          <div className="button-container">
            <input className="button" type="submit" value="Send" />
            <button className="button" onClick={goBack}>
              {" "}
              {t("Back")}{" "}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;

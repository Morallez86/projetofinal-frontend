import React from "react";
import "../general.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function RegisterPage() {
  const navigate = useNavigate();

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
      newWarnings.username = "Username cannot contain spaces";
    }
    if ((formData.password === "")) {
      newWarnings.password = "Password is required";
    }
    if (!/^(\S+\s+\S+)$/.test(formData.name.trim())) {
      newWarnings.name = "Name must contain exactly two names";
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newWarnings.email = "Invalid email format";
    }
    if (!/^\d{9}$/.test(formData.contactNumber.trim())) {
      newWarnings.contactNumber =
        "Invalid phone number format (should contain exactly 9 digits)";
    }

    if (
      formData.userPhoto.trim() &&
      !formData.userPhoto.trim().startsWith("https://")
    ) {
      newWarnings.userPhoto = "Photo URL should start with 'https://'";
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
              <label htmlFor="username"> Username: </label>
              <input
                type="text"
                name="username"
                defaultValue=""
                onChange={handleChange}
                placeholder="Your username"
              />
              <div className="warning">{warnings.username}</div>
              <label>
                <label htmlFor="password"> Password: </label>
                <input
                  type="password"
                  name="password"
                  defaultValue=""
                  onChange={handleChange}
                  placeholder="Your Password"
                />
                <div className="warning">{warnings.password}</div>
              </label>
              <label htmlFor="name"> Name: </label>
              <input
                type="text"
                name="name"
                defaultValue=""
                onChange={handleChange}
                placeholder="First and Last Name"
              />
              <div className="warning">{warnings.name}</div>
              <label htmlFor="email"> Email: </label>
              <input
                type="text"
                name="email"
                defaultValue=""
                onChange={handleChange}
                placeholder="Your email"
              />
              <div className="warning">{warnings.email}</div>
              <label htmlFor="contactNumber"> Phone number: </label>
              <input
                type="text"
                name="contactNumber"
                defaultValue=""
                onChange={handleChange}
                placeholder="Your Phone Number"
              />
              <div className="warning">{warnings.contactNumber}</div>
              <label htmlFor="userPhoto"> Photo: </label>
              <input
                type="text"
                name="userPhoto"
                defaultValue=""
                onChange={handleChange}
                placeholder="Your Photo"
              />
              <div className="warning">{warnings.userPhoto}</div>
            </div>
          </div>
          <div className="button-container">
            <input className="button" type="submit" value="Send" />
            <button className="button" onClick={goBack}>
              {" "}
              Back{" "}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;

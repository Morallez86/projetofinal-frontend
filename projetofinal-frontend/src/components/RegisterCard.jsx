import { Button, Card, Label, TextInput, Alert, Dropdown, FileInput } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { FaStarOfLife } from "react-icons/fa";
import { useState } from "react";
import zxcvbn from "zxcvbn";
import useApiStore from '../Stores/ApiStore';
import useWorkplaceStore from '../Stores/WorkplaceStore';
import { useNavigate } from "react-router-dom";
import {useTranslation} from "react-i18next";

function RegisterCard() {
  const [formDataName, setFormDataName] = useState({ name: "" }); //useState para os dados do formulário
  const [formDatapasswords, setFormDatapasswords] = useState({ password: "", passwordConfirmation: "" }); //useState para as senhas
  const [formDataNames, setFormDataNames] = useState({ firstName: "", lastName: "" }); //useState para os nomes
  const [formDataRegister, setFormDataRegister] = useState({ //useState para o registo 
    email: "",
    password: "",
    workplace: "",
    firstName: "",
    lastName: "",
    username: "",
    biography: "",
  });
  const [selectedWorkLocation, setSelectedWorkLocation] = useState(""); //useState para a localização do trabalho
  const [warningUsername, setWarningUsername] = useState(0); //useState para os avisos
  const [warningPasswordEquals, setWarningPasswordEquals] = useState(0); 
  const [warningPasswordPower, setWarningPasswordPower] = useState(0);
  const [warningNameMax, setWarningNameMax] = useState(0);
  const [warningNameMin, setWarningNameMin] = useState(0);
  const [warningRequiresInputs, setWarningRequiresInputs] = useState(0);
  const [warningEmail, setWarningEmail] = useState(0);
  const { apiUrl } = useApiStore(); //api url
  const {workplaces} = useWorkplaceStore(); //locais de trabalho
  const navigate = useNavigate(); 
  const { t } = useTranslation(); //tradução

  const handleChange = (event) => { //função para mudar os dados  
    const { name, value } = event.target;
    if (name === "name") {
      setFormDataName((prevDataName) => ({ ...prevDataName, [name]: value }));

      const nameParts = value.split(" ");
      setFormDataNames({
        firstName: nameParts[0] || "",
        lastName: nameParts[1] || "",
      });

      setFormDataRegister((prevDataRegister) => ({
        ...prevDataRegister,
        firstName: nameParts[0] || "",
        lastName: nameParts[1] || "",
      }));
    } else if (name === "password") {
      setFormDatapasswords((prevData) => ({ ...prevData, [name]: value }));
      setFormDataRegister((prevDataRegister) => ({
        ...prevDataRegister,
        [name]: value,
      }));
    } else if (name === "passwordConfirmation") {
      setFormDatapasswords((prevData) => ({ ...prevData, [name]: value }));
    } else {
      setFormDataRegister((prevDataRegister) => ({
        ...prevDataRegister,
        [name]: value,
      }));
    }
  };

  const handleWorkLocationChange = (location) => { //função para mudar a localização do trabalho
    setSelectedWorkLocation(location);
    setFormDataRegister((prevDataRegister) => ({
      ...prevDataRegister,
      workplace: location,
    }));
  };

  const handleInvalid = (event) => { //função para invalidar o evento
    event.preventDefault();
  };

  const handleSubmit = async () => { //função para submeter
    

    // limpar avisos
    setWarningUsername(0);
    setWarningPasswordEquals(0);
    setWarningPasswordPower(0);
    setWarningNameMax(0);
    setWarningNameMin(0);
    setWarningRequiresInputs(0);
    setWarningEmail(0);

    // variáveis temporárias para os avisos
    let warningUsername = 0;
    let warningPasswordEquals = 0;
    let warningPasswordPower = 0;
    let warningNameMax = 0;
    let warningNameMin = 0;
    let warningRequiresInputs = 0;
    let warningEmail = 0;

    // Verificar se os dados estão corretos
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formDataRegister.email.trim())) { //verificar se o email está correto
      warningEmail = 1;
      
    }

    if (/\s/.test(formDataRegister.username)) { //verificar se o username tem espaços
      warningUsername = 1;
      
    }

    if (formDataRegister.password.length < 8 || zxcvbn(formDataRegister.password).score < 3) { //verificar se a password é forte
      warningPasswordPower = 1;
      
    }

    if (formDataRegister.password !== formDatapasswords.passwordConfirmation) { //verificar se as passwords são iguais
      warningPasswordEquals = 1;
    }

    if (formDataName.name.split(" ").length > 2) { //verificar se o nome tem mais de 2 nomes
      warningNameMax = 1;
      
    }

    if (formDataName.name.split(" ").length < 2) { //verificar se o nome tem menos de 2 nomes
      warningNameMin = 1;
      
    }

    if (
      formDataRegister.email === "" ||
      formDatapasswords.password === "" ||
      formDatapasswords.passwordConfirmation === "" ||
      formDataRegister.workplace === "" ||
      formDataNames.firstName === "" ||
      formDataNames.lastName === ""
    ) {
      warningRequiresInputs = 1;
      
    }

    // Atualizar avisos
    setWarningEmail(warningEmail);
    setWarningUsername(warningUsername);
    setWarningPasswordPower(warningPasswordPower);
    setWarningPasswordEquals(warningPasswordEquals);
    setWarningNameMax(warningNameMax);
    setWarningNameMin(warningNameMin);
    setWarningRequiresInputs(warningRequiresInputs);

    // Se houver avisos, não entrar em fetch
    if (
      warningUsername === 1 ||
      warningPasswordEquals === 1 ||
      warningPasswordPower === 1 ||
      warningNameMax === 1 ||
      warningNameMin === 1 ||
      warningRequiresInputs === 1 ||
      warningEmail === 1
    ) {
      
      return;
    }

    

    try {
      const registerResponse = await fetch( //fetch para o registo
        `${apiUrl}/users/register`,
        {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataRegister),
        }
      );

      if (registerResponse.status === 201) {
        

        const fileInput = document.getElementById("small-file-upload");
        const file = fileInput.files[0];

        const imageResponse = await fetch( //fetch para a imagem
          `${apiUrl}/users/image`,
          {
            method: "POST",
            headers: {
              Accept: "*/*",
              filename: file.name,
              email: formDataRegister.email,
            },
            body: file,
          }
        );

        if (imageResponse.status === 200) { //se a imagem for bem sucedida
          console.log("Image uploaded successfully");
        } else {
          console.log("Image upload failed");
        }
      } else {
        console.log("User registration failed");
      }
    } catch (error) {
      console.error("Error during registration or image upload:", error);
    }
  };

  return (
    <Card className="max-w-lg overflow-auto p-4 border-gray-600 bg-gradient-to-r from-gray-400 via-gray-50 to-white rounded-lg ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="mb-2 flex items-center">
            <Label
              htmlFor="email"
              value= {t("Email")}
              className="font-semibold text-base"
            />
            <FaStarOfLife className="text-red-500 ml-2 text-xs" />
          </div>
          <TextInput
            id="email"
            type="email"
            name="email"
            placeholder= {t("Your email")}
            onChange={handleChange}
            onInvalid={handleInvalid}
          />
        </div>
        <div>
          <div className="mb-2 flex items-center">
            <Label
              htmlFor="password"
              value= {t("Password")}
              className="font-semibold text-base"
            />
            <FaStarOfLife className="text-red-500 ml-2 text-xs" />
          </div>
          <TextInput
            id="password"
            type="password"
            name="password"
            placeholder= {t("Your password")}
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="mb-2 flex items-center">
            <Label
              htmlFor="password-confirmation"
              value= {t("Password Confirmation")}
              className="font-semibold text-base"
            />
            <FaStarOfLife className="text-red-500 ml-2 text-xs" />
          </div>
          <TextInput
            id="password-confirmation"
            type="password"
            name="passwordConfirmation"
            placeholder= {t("Confirm your password")}
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="mb-2 flex items-center">
            <Label
              htmlFor="workplace"
              value= {t("Workplace")}
              className="font-semibold text-base"
            />
            <FaStarOfLife className="text-red-500 ml-2 text-xs" />
          </div>
          <Dropdown
            label={selectedWorkLocation ||  t("Select your workplace")}
            dismissOnClick={true}
          >
            {workplaces.map((location) => (
              <Dropdown.Item
                key={location.id}
                onClick={() => handleWorkLocationChange(location.name)}
              >
                {location.name}
              </Dropdown.Item>
            ))}
          </Dropdown>
        </div>
        <div>
          <div className="mb-2 flex items-center">
            <Label
              htmlFor="name"
              value= {t("Full Name")}
              className="font-semibold text-base"
            />
            <FaStarOfLife className="text-red-500 ml-2 text-xs" />
          </div>
          <TextInput
            id="name"
            type="text"
            name="name"
            placeholder= {t("First and Last Name")}
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label
              htmlFor="username"
              value= {t("Username")}
              className="font-semibold text-base"
            />
          </div>
          <TextInput
            id="username"
            type="text"
            name="username"
            placeholder= {t('Example: John Doe')}
            maxLength={15}
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label
              htmlFor="photo"
              value= {t("Photo")}
              className="font-semibold text-base"
            />
          </div>
          <FileInput id="small-file-upload" sizing="sm" accept="image/*" />
        </div>
        <div className="mb-2 block col-span-full">
          <Label
            htmlFor="biography"
            value= {t("Biography")}
            className="font-semibold text-base"
          />
          <textarea
            id="biography"
            placeholder= {t("Tell us a bit about yourself")} 
            rows={2}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
            maxLength={300}
            name="biography"
            onChange={handleChange}
          />
        </div>
        <div className="mb-2 flex items-center col-span-full">
          <FaStarOfLife className="text-red-500 mr-2 text-xs" />
          <Label
            htmlFor="warning"
            value= {t("Fields with this symbol are mandatory")}
          />
        </div>
        <div className="flex justify-between col-span-full">
          <div>
            <Button onClick={handleSubmit}>{t('Submit')}</Button>
          </div>
          <div className="ml-auto">
            <Button type="button" onClick={() => navigate("/")}>
              {t("Back")}
            </Button>
          </div>
        </div>
      </div>
      {warningEmail === 1 && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">{t('Email format is incorrect!')}</span>
        </Alert>
      )}
      {warningUsername === 1 && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">{t('Username can t have spaces')}</span>
        </Alert>
      )}
      {warningPasswordPower === 1 && (
        <>
          <Alert color="failure" icon={HiInformationCircle}>
            <span className="font-medium">{t('Password isn t strong enough')}</span>
          </Alert>
          <Alert color="warning" icon={HiInformationCircle} rounded>
            <span
              className="font-medium"
              style={{ textDecoration: "underline" }}
            >
              {t('TIP TO A STRONG PASSWORD!')}
            </span>
            {
              t(' Must have at least 8 characters, use upper and lower case letters, use numbers and special characters')
            }
          </Alert>
        </>
      )}
      {warningPasswordEquals === 1 && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">{t('Passwords don t match')}</span>
        </Alert>
      )}
      {warningNameMax === 1 && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">
            {t('You can only enter 2 names (first and last)')}
          </span>
        </Alert>
      )}
      {warningNameMin === 1 && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">
            {t('You need to enter 2 names (first and last)')}
          </span>
        </Alert>
      )}
      {warningRequiresInputs === 1 && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">
            {t('The required fields are not all filled in')}
          </span>
        </Alert>
      )}
    </Card>
  );
}

export default RegisterCard;

import {
  Button,
  Card,
  Label,
  TextInput,
  Spinner,
  Alert,
  Modal,
} from "flowbite-react";
import { HiInformationCircle, HiOutlineMail } from "react-icons/hi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useUserStore from "../Stores/UserStore";
import useApiStore from "../Stores/ApiStore";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../Language/i18n";



function LoginCard() {
  const apiUrl = useApiStore((state) => state.apiUrl);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [emailRecovery, setEmailRecovery] = useState({
    email: "",
  });

  const {t} = useTranslation();
  const setLanguage = useUserStore((state) => state.setLanguage);


  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(0);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [warningEmailFormat, setWarningEmailFormat] = useState(0);
  const [emailRecoverySuccess, setEmailRecoverySuccess] = useState(false);
  const [emailRecoveryError, setEmailRecoveryError] = useState(false);

  const setToken = useUserStore((state) => state.setToken);
  const setRole = useUserStore((state) => state.setRole);
  const setUsername = useUserStore((state) => state.setUsername);
  const setUserId = useUserStore((state) => state.setUserId);

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleChangeEmailRecovery = (event) => {
    const { name, value } = event.target;
    setEmailRecovery((prevData) => ({ ...prevData, [name]: value }));
  };

  // Function to store token and role in Zustand state
  const storeTokenAndRole = (token) => {
    setToken(token); // Store the token
    const decodedToken = jwtDecode(token); // Decode the token
    const role = decodedToken.role; // Extract the role from decoded token
    setRole(role); // Store the role in Zustand
    const username = decodedToken.username;
    setUsername(username);
    const userId = decodedToken.id;
    setUserId(userId);
  };

  const handleSubmitRecover = async () => {
    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        emailRecovery.email
      )
    ) {
      setWarningEmailFormat(1);
      return;
    }
    setLoading(true);
    setWarningEmailFormat(0);
    setEmailRecoverySuccess(false);
    setEmailRecoveryError(false);

    try {
      const response = await fetch(`${apiUrl}/users/emailRecoveryPassword`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailRecovery.email),
      });

      if (response.status === 200) {
        console.log("Email sent");
        setEmailRecoverySuccess(true);
        setEmailRecovery("");
        setTimeout(() => {
          setOpenPopUp(false);
          setEmailRecoverySuccess(false);
        }, 3000);
      } else {
        console.log("Email could not be sent");
        setEmailRecoveryError(true);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setEmailRecoveryError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setWarning(2);
      return;
    }
    setLoading(true);
    setWarning(0);
    try {
      const response = await fetch(`${apiUrl}/users/login`, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) {
        setWarning(1);
        console.log("Invalid information");
      } else if (response.status === 200) {
        setWarning(0);
        const data = await response.json();
        const token = data.token;
        console.log(token);
        storeTokenAndRole(token);
        console.log("Successful login");
        navigate("/myProjects");
      } else {
        console.log("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setWarning(3);
    } finally {
      setLoading(false);
    }
  };

  const handleInvalid = (event) => {
    event.preventDefault();
  };

  const openEmailInput = () => {
    setOpenPopUp(true);
  };

  const cleanWarnings = () => {
    setWarning(0);
    setWarningEmailFormat(0);
  };

  return (
    <Card className="max-w-sm p-4 border-gray-600 bg-gradient-to-r from-gray-400 via-gray-50 to-white rounded-lg">
      <div className="flex flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label
              htmlFor="email"
              value={t('email')}
              className="font-semibold text-base"
            />
          </div>
          <TextInput
            id="email"
            name="email"
            type="email"
            placeholder={t( 'emailPlaceholder')}
            value={formData.email}
            onChange={handleChange}
            onInvalid={handleInvalid}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label
              htmlFor="password"
              value={t('password')}
              className="font-semibold text-base"
            />
          </div>
          <TextInput
            id="password"
            type="password"
            name="password"
            placeholder={t('passwordPlaceholder')}
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? <Spinner size="sm" /> : t('login')}
        </Button>
        <Button type="button" onClick={openEmailInput}>
          {t('recoverPassword')}
        </Button>
        <Button type="button" onClick={() => navigate("/")}>
          {t('back')}
        </Button>
      </div>
      <div className="flex flex-col gap-4"></div>
      <Modal
        show={openPopUp}
        size="md"
        onClose={() => setOpenPopUp(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="">
            <h3 className="mb-5 text-lg text-center font-bold text-gray-500 dark:text-gray-400">
            {t('recoverPassword')}
            </h3>
            <div>
              <TextInput
                id="emailRecovery"
                type="email"
                placeholder={t('emailPlaceholder')}
                icon={HiOutlineMail}
                name="email"
                onChange={handleChangeEmailRecovery}
                value={emailRecovery.email}
              />
            </div>
            <div className="mb-4 -ml-2">
              {warningEmailFormat === 1 && (
                <Alert color="failure" icon={HiInformationCircle}>
                  <span className="font-medium">{t('emailFormatIncorret')}</span>
                </Alert>
              )}
              {emailRecoveryError && (
                <Alert color="failure" icon={HiInformationCircle}>
                  <span className="font-medium">{t('emailNotSent')}</span>
                </Alert>
              )}
              {emailRecoverySuccess && (
                <Alert color="success" icon={HiInformationCircle}>
                  <span className="font-medium">
                  {t('emailSent')}
                  </span>
                </Alert>
              )}
            </div>
            <div className="flex justify-center gap-4">
              {!loading && (
                <Button onClick={handleSubmitRecover}>{t('submit')}</Button>
              )}
              {loading && (
                <Spinner
                  aria-label="Alternate spinner button example"
                  size="sm"
                />
              )}
              <Button
                className="bg-gray-700"
                onClick={() => {
                  setOpenPopUp(false);
                  cleanWarnings();
                }}
              >
                {t('cancel')}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {warning === 1 && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">{t('incorrectInformation')}</span>
        </Alert>
      )}
      {warning === 2 && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">{t('fillFields')}</span>
        </Alert>
      )}
      {warning === 3 && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">
          {t('networkError')}
          </span>
        </Alert>
      )}
      {warning === 1 && (
        <Alert color="warning" icon={HiInformationCircle} rounded>
          <span className="font-medium" style={{ textDecoration: "underline" }}>
          {t('remember')}
          </span>{" "}
          {t('validateEmail')}
        </Alert>
      )}
    </Card>
  );
}

export default LoginCard;

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
  const apiUrl = useApiStore((state) => state.apiUrl); // Obter o URL da API
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ // Dados do formulário
    email: "",
    password: "",
  });

  const [emailRecovery, setEmailRecovery] = useState({ // Recuperação de email
    email: "",
  });

  const {t} = useTranslation(); // Função de tradução
  const setLanguage = useUserStore((state) => state.setLanguage); // Função para definir a linguagem

  const languageApp = useUserStore((state) => state.language); // Obter a linguagem da aplicação
  

 

  const handleLanguageToggle = () => { // Função para alternar a linguagem
    const newLanguage = languageApp === 'en' ? 'pt' : 'en';
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };


  const [loading, setLoading] = useState(false); // Carregamento
  const [warning, setWarning] = useState(0); // Aviso
  const [openPopUp, setOpenPopUp] = useState(false); // Pop-up
  const [warningEmailFormat, setWarningEmailFormat] = useState(0); // Aviso de formato de email
  const [emailRecoverySuccess, setEmailRecoverySuccess] = useState(false); // Sucesso na recuperação de email
  const [emailRecoveryError, setEmailRecoveryError] = useState(false); // Erro na recuperação de email

  const setToken = useUserStore((state) => state.setToken); // Função para definir o token
  const setRole = useUserStore((state) => state.setRole); // Função para definir o role
  const setUsername = useUserStore((state) => state.setUsername); // Função para definir o nome de utilizador
  const setUserId = useUserStore((state) => state.setUserId);  // Função para definir o ID do utilizador

  const fetchGreeting = async () => { // Função para buscar a localização e alterar o idioma consonate a resposta
    try {
      const response = await fetch(
        "https://localhost:8443/projetofinal-backend-1.0-SNAPSHOT/rest/greetings",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) { // em caso de ok
        throw new Error("Erro na requisição: " + response.statusText);
      }

      const data = await response.json();
     

      
      const languageCode = data.locale.substring(0, 2); // Obter o código do idioma
    
      setLanguage(languageCode); // Definir o idioma

      i18n.changeLanguage(languageCode); // Alterar o idioma
    } catch (error) {
      console.error("Error: ", error.message);
      throw error;
    }
  };

  useEffect(() => {
    fetchGreeting();
  }, []);

  const handleChange = (event) => { // Função para lidar com a mudança de valor
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleChangeEmailRecovery = (event) => { // Função para lidar com a recuperação de email
    const { name, value } = event.target;
    setEmailRecovery((prevData) => ({ ...prevData, [name]: value }));
  };

  // Função para armazenar o token e o role
  const storeTokenAndRole = (token) => {
    setToken(token); 
    const decodedToken = jwtDecode(token);  // Decodificar o token
    const role = decodedToken.role; 
    setRole(role); 
    const username = decodedToken.username;
    setUsername(username);
    const userId = decodedToken.id;
    setUserId(userId);
  };

  const handleSubmitRecover = async () => { // Função para lidar com a recuperação de email
    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        emailRecovery.email
      )
    ) {
      setWarningEmailFormat(1); // Aviso de formato de email
      return;
    }
    setLoading(true);
    setWarningEmailFormat(0);
    setEmailRecoverySuccess(false);
    setEmailRecoveryError(false);

    try {
      const response = await fetch(`${apiUrl}/users/emailRecoveryPassword`, { // Enviar o email de recuperação
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailRecovery.email),
      });

      if (response.status === 200) {  // Verificar se o email foi enviado
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
    } catch (error) { // Em caso de erro
      console.error("Error fetching user:", error);
      setEmailRecoveryError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => { // Função para lidar com o envio
    if (!formData.email || !formData.password) { // Verificar se os campos estão preenchidos
      setWarning(2);
      return;
    }
    setLoading(true);
    setWarning(0);
    try {
      const response = await fetch(`${apiUrl}/users/login`, { // Enviar o pedido de login
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 401) { // Verificar se as credenciais são inválidas
        setWarning(1);
        console.log("Invalid information");
      } else if (response.status === 200) { // Verificar se o login foi bem-sucedido
        setWarning(0);
        const data = await response.json();
        const token = data.token;
        console.log(token);
        storeTokenAndRole(token);
        console.log("Successful login");
        navigate("/myProjects"); // Navegar para a página de projetos
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

  const handleInvalid = (event) => { // Função para lidar com a invalidade
    event.preventDefault();
  };

  const openEmailInput = () => {  // Função para abrir o input de email
    setOpenPopUp(true);
  };

  const cleanWarnings = () => { // Função para limpar os avisos
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
       
            
            <Button
            className="bg-gray-700"  onClick={() => { handleLanguageToggle() }}>
              {(languageApp === 'en'
      ? "Change to PT" 
      : "Change to EN")}
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

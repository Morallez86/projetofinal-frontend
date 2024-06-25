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

  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(0);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [warningEmailFormat, setWarningEmailFormat] = useState(0);
  const [emailRecoverySuccess, setEmailRecoverySuccess] = useState(false); // New state
  const [emailRecoveryError, setEmailRecoveryError] = useState(false); // New state

  const setToken = useUserStore((state) => state.setToken);
  const setRole = useUserStore((state) => state.setRole);
  const setUsername = useUserStore((state) => state.setUsername);
  const setUserId = useUserStore((state) => state.setUserId);

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
              value="Email"
              className="font-semibold text-base"
            />
          </div>
          <TextInput
            id="email"
            name="email"
            type="email"
            placeholder="Your email"
            value={formData.email}
            onChange={handleChange}
            onInvalid={handleInvalid}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label
              htmlFor="password"
              value="Password"
              className="font-semibold text-base"
            />
          </div>
          <TextInput
            id="password"
            type="password"
            name="password"
            placeholder="Your password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? <Spinner size="sm" /> : "Submit"}
        </Button>
        <Button type="button" onClick={openEmailInput}>
          Forgot password?
        </Button>
        <Button type="button" onClick={() => navigate("/")}>
          Home
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
              Recover Password
            </h3>
            <div>
              <TextInput
                id="emailRecovery"
                type="email"
                placeholder="Enter your email to recover your password"
                icon={HiOutlineMail}
                name="email"
                onChange={handleChangeEmailRecovery}
                value={emailRecovery.email}
              />
            </div>
            <div className="mb-4 -ml-2">
              {warningEmailFormat === 1 && (
                <Alert color="failure" icon={HiInformationCircle}>
                  <span className="font-medium">Email format is incorrect</span>
                </Alert>
              )}
              {emailRecoveryError && (
                <Alert color="failure" icon={HiInformationCircle}>
                  <span className="font-medium">Email could not be sent.</span>
                </Alert>
              )}
              {emailRecoverySuccess && (
                <Alert color="success" icon={HiInformationCircle}>
                  <span className="font-medium">
                    Email was sent successfully.
                  </span>
                </Alert>
              )}
            </div>
            <div className="flex justify-center gap-4">
              {!loading && (
                <Button onClick={handleSubmitRecover}>Submit</Button>
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
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {warning === 1 && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">Incorrect information! Try again.</span>
        </Alert>
      )}
      {warning === 2 && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">Please fill out all fields.</span>
        </Alert>
      )}
      {warning === 3 && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">
            Network error! Please try again later.
          </span>
        </Alert>
      )}
      {warning === 1 && (
        <Alert color="warning" icon={HiInformationCircle} rounded>
          <span className="font-medium" style={{ textDecoration: "underline" }}>
            REMEMBER!
          </span>{" "}
          Validate your account in your email if you haven't already done so.
        </Alert>
      )}
    </Card>
  );
}

export default LoginCard;

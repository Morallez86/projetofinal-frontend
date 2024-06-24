import { Button, Card, Label, TextInput, Alert, Dropdown, FileInput } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { FaStarOfLife } from "react-icons/fa";
import { useState } from "react";
import zxcvbn from "zxcvbn";
import useApiStore from '../Stores/ApiStore';
import useWorkplaceStore from '../Stores/WorkplaceStore';
import { useNavigate } from "react-router-dom";

function RegisterCard() {
  const [formDataName, setFormDataName] = useState({ name: "" });
  const [formDatapasswords, setFormDatapasswords] = useState({ password: "", passwordConfirmation: "" });
  const [formDataNames, setFormDataNames] = useState({ firstName: "", lastName: "" });
  const [formDataRegister, setFormDataRegister] = useState({
    email: "",
    password: "",
    workplace: "",
    firstName: "",
    lastName: "",
    username: "",
    biography: "",
  });
  const [selectedWorkLocation, setSelectedWorkLocation] = useState("");
  const [warningUsername, setWarningUsername] = useState(0);
  const [warningPasswordEquals, setWarningPasswordEquals] = useState(0);
  const [warningPasswordPower, setWarningPasswordPower] = useState(0);
  const [warningNameMax, setWarningNameMax] = useState(0);
  const [warningNameMin, setWarningNameMin] = useState(0);
  const [warningRequiresInputs, setWarningRequiresInputs] = useState(0);
  const [warningEmail, setWarningEmail] = useState(0);
  const { apiUrl } = useApiStore();
  const {workplaces} = useWorkplaceStore();
  const navigate = useNavigate();

  const handleChange = (event) => {
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

  const handleWorkLocationChange = (location) => {
    setSelectedWorkLocation(location);
    setFormDataRegister((prevDataRegister) => ({
      ...prevDataRegister,
      workplace: location,
    }));
  };

  const handleInvalid = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async () => {
    console.log(1);

    // Reset warnings
    setWarningUsername(0);
    setWarningPasswordEquals(0);
    setWarningPasswordPower(0);
    setWarningNameMax(0);
    setWarningNameMin(0);
    setWarningRequiresInputs(0);
    setWarningEmail(0);

    // Temporary variables to track warnings
    let warningUsername = 0;
    let warningPasswordEquals = 0;
    let warningPasswordPower = 0;
    let warningNameMax = 0;
    let warningNameMin = 0;
    let warningRequiresInputs = 0;
    let warningEmail = 0;

    // Perform checks and set temporary variables
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formDataRegister.email.trim())) {
      warningEmail = 1;
      console.log(2);
    }

    if (/\s/.test(formDataRegister.username)) {
      warningUsername = 1;
      console.log(3);
    }

    if (formDataRegister.password.length < 8 || zxcvbn(formDataRegister.password).score < 3) {
      warningPasswordPower = 1;
      console.log(4);
    }

    if (formDataRegister.password !== formDatapasswords.passwordConfirmation) {
      warningPasswordEquals = 1;
    }

    if (formDataName.name.split(" ").length > 2) {
      warningNameMax = 1;
      console.log(5);
    }

    if (formDataName.name.split(" ").length < 2) {
      warningNameMin = 1;
      console.log(6);
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
      console.log(7);
    }

    // Set state based on temporary variables
    setWarningEmail(warningEmail);
    setWarningUsername(warningUsername);
    setWarningPasswordPower(warningPasswordPower);
    setWarningPasswordEquals(warningPasswordEquals);
    setWarningNameMax(warningNameMax);
    setWarningNameMin(warningNameMin);
    setWarningRequiresInputs(warningRequiresInputs);

    // Check if any warnings are set
    if (
      warningUsername === 1 ||
      warningPasswordEquals === 1 ||
      warningPasswordPower === 1 ||
      warningNameMax === 1 ||
      warningNameMin === 1 ||
      warningRequiresInputs === 1 ||
      warningEmail === 1
    ) {
      console.log("not enter in fetch");
      return;
    }

    console.log("entrei com avisos");

    try {
      const registerResponse = await fetch(
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
        console.log("User registered successfully");

        const fileInput = document.getElementById("small-file-upload");
        const file = fileInput.files[0];

        const imageResponse = await fetch(
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

        if (imageResponse.status === 200) {
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
            <Label htmlFor="email" value="Email" />
            <FaStarOfLife className="text-red-500 ml-2 text-xs" />
          </div>
          <TextInput
            id="email"
            type="email"
            name="email"
            placeholder="Your email"
            onChange={handleChange}
            onInvalid={handleInvalid}
          />
        </div>
        <div>
          <div className="mb-2 flex items-center">
            <Label htmlFor="password" value="Password" />
            <FaStarOfLife className="text-red-500 ml-2 text-xs" />
          </div>
          <TextInput
            id="password"
            type="password"
            name="password"
            placeholder="Your password"
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="mb-2 flex items-center">
            <Label
              htmlFor="password-confirmation"
              value="Password Confirmation"
            />
            <FaStarOfLife className="text-red-500 ml-2 text-xs" />
          </div>
          <TextInput
            id="password-confirmation"
            type="password"
            name="passwordConfirmation"
            placeholder="Confirm your password"
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="mb-2 flex items-center">
            <Label htmlFor="workplace" value="Workplace" />
            <FaStarOfLife className="text-red-500 ml-2 text-xs" />
          </div>
          <Dropdown
            label={selectedWorkLocation || "Choose a location"}
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
            <Label htmlFor="name" value="Full name" />
            <FaStarOfLife className="text-red-500 ml-2 text-xs" />
          </div>
          <TextInput
            id="name"
            type="text"
            name="name"
            placeholder="First and Last Name"
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="username" value="Username" />
          </div>
          <TextInput
            id="username"
            type="text"
            name="username"
            placeholder="Example: JohnDoe98"
            maxLength={15}
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="photo" value="Photo" />
          </div>
          <FileInput id="small-file-upload" sizing="sm" accept="image/*" />
        </div>
        <div className="mb-2 block col-span-full">
          <Label htmlFor="biography" value="Biography" />
          <textarea
            id="biography"
            placeholder="Talk about yourself..."
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
            value="Inputs with this symbol are mandatory"
          />
        </div>
        <div className="flex justify-between col-span-full">
          <div>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
          <div className="ml-auto">
            <Button type="button" onClick={() => navigate("/")}>
              Home
            </Button>
          </div>
        </div>
      </div>
      {warningEmail === 1 && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">Email format is incorrect!</span>
        </Alert>
      )}
      {warningUsername === 1 && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">Username can't have spaces</span>
        </Alert>
      )}
      {warningPasswordPower === 1 && (
        <>
          <Alert color="failure" icon={HiInformationCircle}>
            <span className="font-medium">Password isn't strong enough</span>
          </Alert>
          <Alert color="warning" icon={HiInformationCircle} rounded>
            <span
              className="font-medium"
              style={{ textDecoration: "underline" }}
            >
              TIP TO A STRONG PASSWORD!
            </span>
            {
              " Must have at least 8 characters, use upper and lower case letters, use numbers and special characters"
            }
          </Alert>
        </>
      )}
      {warningPasswordEquals === 1 && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">Passwords don't match</span>
        </Alert>
      )}
      {warningNameMax === 1 && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">
            You can only enter 2 names (first and last)
          </span>
        </Alert>
      )}
      {warningNameMin === 1 && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">
            You need to enter 2 names (first and last)
          </span>
        </Alert>
      )}
      {warningRequiresInputs === 1 && (
        <Alert color="failure" icon={HiInformationCircle}>
          <span className="font-medium">
            The required fields are not all filled in
          </span>
        </Alert>
      )}
    </Card>
  );
}

export default RegisterCard;

import { Button, Card, Label, TextInput } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";
import { Dropdown } from "flowbite-react";
import { FaStarOfLife } from "react-icons/fa";
import { FileInput } from "flowbite-react";
import { useState } from "react";

function RegisterCard() {

  const [formDataName, setFormDataName] = useState({
    name: "",
  });

  const [formDatapasswords, setFormDatapasswords] = useState({
    password: "",
    passwordConfirmation: "",
  });

  const [formDataNames, setFormDataNames] = useState({
    firstName: formDataName.name.split(" ")[0],
    lastName: formDataName.name.split(" ")[1],
  });

  const [formDataRegister, setFormDataRegister] = useState({
    email: "",
    password: "",
    workplace: "",
    firstName: "",
    lastName: "",
    username: "",
    biography: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "name") {
      setFormDataName((prevDataName) => ({ ...prevDataName, [name]: value }));

      const nameParts = value.split(" ");
      setFormDataNames({
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
      });

      setFormDataRegister((prevDataRegister) => ({
        ...prevDataRegister,
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
      }));
    } else if (name === "password" || name === "passwordConfirmation") {
      setFormDatapasswords((prevData) => ({ ...prevData, [name]: value }));
      setFormDataRegister((prevDataRegister) => ({ ...prevDataRegister, [name]: value }));
    } else {
      setFormDataRegister((prevDataRegister) => ({ ...prevDataRegister, [name]: value }));
    }
    
    console.log(formDataRegister);
    console.log(formDataName);
    console.log(formDatapasswords); 
    console.log(formDataNames);
  };

  return (
    <Card className="max-w-sm overflow-auto">
      <form className="flex flex-col gap-4">
        <div>
          <div className="mb-2 block flex items-center">
            <Label htmlFor="email" value="Email" />
            <FaStarOfLife className="text-red-500  ml-2 text-xs" />
          </div>
          <TextInput
            id="email"
            type="email"
            name= "email"
            placeholder="Your email"
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="mb-2 block flex items-center">
            <Label htmlFor="password" value="Password" />
            <FaStarOfLife className="text-red-500  ml-2 text-xs" />
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
          <div className="mb-2 block flex items-center">
            <Label
              htmlFor="password-confirmation"
              value="Password Confirmation"
            />
             <FaStarOfLife className="text-red-500  ml-2 text-xs" />
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
          <div className="mb-2 block flex items-center">
            <Label htmlFor="Work-location" value="Work Location" />
            <FaStarOfLife className="text-red-500  ml-2 text-xs" />
          </div>
          <div>
            <Dropdown label="Choose a location" dismissOnClick={true}>
              <Dropdown.Item>Lisbon</Dropdown.Item>
              <Dropdown.Item>Coimbra</Dropdown.Item>
              <Dropdown.Item>Porto</Dropdown.Item>
              <Dropdown.Item>Tomar</Dropdown.Item>
              <Dropdown.Item>Viseu</Dropdown.Item>
              <Dropdown.Item>Vila Real</Dropdown.Item>
            </Dropdown>
          </div>
        </div>
        <div>
          <div className="mb-2 block flex items-center">
            <Label htmlFor="name" value="Name" />
            <FaStarOfLife className="text-red-500  ml-2 text-xs" />
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
            <Label htmlFor="nickname" value="Username" />
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
        <div className="mb-2 block">
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
        <div className="mb-2 block flex items-center">
          <FaStarOfLife className="text-red-500  mr-2 text-xs" />
          <Label
            htmlFor="warning"
            value="inputs with this symbol are mandatory"
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
      <Alert color="failure" icon={HiInformationCircle}>
        <span className="font-medium"> </span> Email format is incorrect!
      </Alert>
      <Alert color="failure" icon={HiInformationCircle}>
        <span className="font-medium"> </span>
        Password isn't strong enough
      </Alert>
      <Alert color="failure" icon={HiInformationCircle}>
        <span className="font-medium"> </span>
        Passwords don't match
      </Alert>
      <Alert color="failure" icon={HiInformationCircle}>
        <span className="font-medium"> </span>
        You can only enter 2 names (first and last)
      </Alert>
      <Alert color="failure" icon={HiInformationCircle}>
        <span className="font-medium"> </span>
        The required fields are not all filled in
      </Alert>
    </Card>
  );
}

export default RegisterCard;

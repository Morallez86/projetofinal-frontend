import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import { RiLoginCircleFill } from "react-icons/ri";
import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";
import { useState } from "react";

function LoginCard() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <Card className="max-w-sm">
      <form className="flex flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email" value="Email" />
          </div>
          <TextInput
            id="email"
            type="email"
            name="email"
            placeholder="Your email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password" value="Password" />
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
        <Button type="submit">Submit</Button>
        <Button icon={RiLoginCircleFill}>Forgot password?</Button>
      </form>
      <Alert color="failure" icon={HiInformationCircle}>
        <span className="font-medium"> </span> Incorrect information! Try again
      </Alert>
      <Alert color="warning" icon={HiInformationCircle} rounded>
        <span className="font-medium" style={{ textDecoration: "underline" }}>
          {" "}
          REMEMBER!{" "}
        </span>{" "}
        Validate your account in your email if you haven't already done so!
      </Alert>
    </Card>
  );
}

export default LoginCard;

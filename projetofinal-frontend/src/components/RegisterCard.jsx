import { Button, Card, Label, TextInput } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";

function RegisterCard() {
  return (
    <Card className="max-w-sm overflow-auto">
      <form className="flex flex-col gap-4">
        <div>
          <div className="mb-2 block flex items-center">
            <Label htmlFor="email" value="Email" />
          </div>
          <TextInput
            id="email"
            type="email"
            placeholder="Your email"
          />
        </div>
        <div>
          <div className="mb-2 block flex items-center">
            <Label htmlFor="password" value="Password" />
          </div>
          <TextInput
            id="password"
            type="password"
            placeholder="Your password"
            
          />
        </div>
        <div>
          <div className="mb-2 block flex items-center">
            <Label
              htmlFor="password-confirmation"
              value="Password Confirmation"
            />
          </div>
          <TextInput
            id="password-confirmation"
            type="password"
            placeholder="Confirm your password"
            
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
    </Card>
  );
}

export default RegisterCard;

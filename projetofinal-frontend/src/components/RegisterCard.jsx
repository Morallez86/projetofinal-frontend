import { Button, Card, Label, TextInput } from "flowbite-react";

import { FaStarOfLife } from "react-icons/fa";

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
            required
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
            required
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
            required
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Card>
  );
}

export default RegisterCard;

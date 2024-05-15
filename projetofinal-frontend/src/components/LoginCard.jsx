import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import { RiLoginCircleFill } from "react-icons/ri";

function LoginCard() {
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
            placeholder="Your email"
            required
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password" value="Password" />
          </div>
          <TextInput id="password" type="password" placeholder="Your password" required />
        </div>
        <Button type="submit">Submit</Button>
        <Button icon={RiLoginCircleFill}>Forgot password?</Button>
      </form>
    </Card>
  );
}

export default LoginCard;

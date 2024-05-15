import { Button, Card, Label, TextInput } from "flowbite-react";
import { Dropdown } from "flowbite-react";
import { FileInput } from "flowbite-react";
import { FaStarOfLife } from "react-icons/fa";

function RegisterCard() {
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
            placeholder="Your email"
            required
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
            <FaStarOfLife className="text-red-500  ml-2 text-xs" />
          </div>
          <TextInput
            id="password-confirmation"
            type="password"
            placeholder="Confirm your password"
            required
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
            placeholder="First and Last Name"
            required
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="nickname" value="Nickname" />
          </div>
          <TextInput
            id="nickname"
            type="text"
            placeholder="Example: JohnDoe98"
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
    </Card>
  );
}

export default RegisterCard;

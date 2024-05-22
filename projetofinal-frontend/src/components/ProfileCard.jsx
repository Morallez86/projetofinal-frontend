import { Card } from "flowbite-react";
import { Avatar } from "flowbite-react";

function ProfileCard() {
  return (
    <Card className="max-w-sm bg-transparent hover:bg-gray-200 transition-colors duration-200">
      <div className="flex flex-col pb-10 ">
        <Avatar
          img="https://i5.walmartimages.com/seo/Funko-Pokemon-Pikachu-Sticker_f08cd5a5-9ca2-4a6a-a111-2a613a1ac474.57a8547237c06ef905a16271ac9fcc0c.jpeg"
          alt="avatar of Jese"
          size={"xl"}
          rounded
        />
        <div className="mt-4">
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            Name
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ricardo Elias
          </p>
        </div>
        <div className="mt-4">
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            Job Location
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Coimbra
          </p>
        </div>
        <div className="mt-4">
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            Nickname
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Elias98
          </p>
        </div>
        <div className="mt-4">
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            Skills
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            HTML, CSS, JavaScript, React, Node.js
          </p>
        </div>
        <div className="mt-4">
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            Interests
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Coding, Gaming, Sport
          </p>
        </div>
        <div className="mt-4">
          <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
            Biography
          </h5>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Your biography goes here.
          </p>
        </div>
      </div>
    </Card>
  );
}
export default ProfileCard;

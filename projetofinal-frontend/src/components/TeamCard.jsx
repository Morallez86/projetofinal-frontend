import React from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaLevelUpAlt, FaLevelDownAlt } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import basePhoto from "../Assets/092.png";
import { LuPlusCircle } from "react-icons/lu";
import { Label } from "flowbite-react";

function TeamCard({
  projectDetails,
  currentUserIsAdmin,
  userImages,
  handleAdminChange,
  handleUserDeactivation,
  currentUserId,
  openPopUpUsers,
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="Team" value="Team" />
        <div
          className="inline-flex items-center cursor-pointer"
          id="icon-element7"
          onClick={openPopUpUsers}
        >
          <LuPlusCircle className="h-4 w-4 text-black font-bold ml-2" />
        </div>
        <Tooltip anchorSelect="#icon-element7" place="top" />
        {projectDetails.userProjectDtos
          ?.filter((up) => up.active)
          .map((up) => (
            <div key={up.userId} className="flex items-center mb-2">
              {userImages[up.userId] ? (
                <img
                  src={`data:${userImages[up.userId].type};base64,${
                    userImages[up.userId].image
                  }`}
                  alt={`${up.username}'s profile`}
                  className="w-8 h-8 rounded-full mr-2"
                />
              ) : (
                <img
                  src={basePhoto}
                  alt="Placeholder"
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <span className="flex-grow">{up.username}</span>
              {up.userId !== projectDetails.owner && (
                <>
                  {up.admin ? (
                    <FaLevelDownAlt
                      className={`h-4 w-4 ml-2 ${
                        currentUserIsAdmin
                          ? "text-red-500 cursor-pointer"
                          : "text-gray-500"
                      }`}
                      onClick={() =>
                        currentUserIsAdmin &&
                        handleAdminChange(up.userId, false)
                      }
                      data-tooltip-id={`tooltip-${up.userId}`}
                      data-tooltip-content="Remove Admin"
                    />
                  ) : (
                    <FaLevelUpAlt
                      className={`h-4 w-4 ml-2 ${
                        currentUserIsAdmin
                          ? "text-green-500 cursor-pointer"
                          : "text-gray-500"
                      }`}
                      onClick={() =>
                        currentUserIsAdmin && handleAdminChange(up.userId, true)
                      }
                      data-tooltip-id={`tooltip-${up.userId}`}
                      data-tooltip-content="Make Admin"
                    />
                  )}
                  {(currentUserIsAdmin || up.userId === currentUserId) && (
                    <IoCloseCircleOutline
                      className="h-4 w-4 ml-2 text-red-500 cursor-pointer"
                      onClick={() => handleUserDeactivation(up.userId)}
                      data-tooltip-id={`tooltip-${up.userId}`}
                      data-tooltip-content="Deactivate User"
                    />
                  )}
                  <Tooltip id={`tooltip-${up.userId}`} place="top" />
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default TeamCard;

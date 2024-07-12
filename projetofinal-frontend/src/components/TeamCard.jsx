import {React, useState} from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaLevelUpAlt, FaLevelDownAlt } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import basePhoto from "../Assets/defaultAvatar.jpg";
import { LuPlusCircle } from "react-icons/lu";
import { Label } from "flowbite-react";
import { useTranslation } from "react-i18next";
import ConfirmationModal from "./ConfirmationModal";

function TeamCard({
  projectDetails,
  currentUserIsAdmin,
  userImages,
  handleAdminChange,
  handleUserDeactivation,
  currentUserId,
  openPopUpUsers,
}) {
  const { t } = useTranslation(); // Traduzir o texto
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [confirmFunction, setConfirmFunction] = useState(null);

  // Função para lidar com a confirmação do estado admin dos users num projeto
  const confirmAdminChange = (userId, isAdmin) => {
    setShowConfirmation(true);
    setConfirmationMessage(
      isAdmin
        ? t("Make this user an admin?")
        : t("Remove admin rights from this user?")
    );
    setConfirmFunction(() => () => handleAdminChange(userId, isAdmin));
  };

  // Função para lidar com a confirmação da desactivação de um user num projeto
  const confirmUserDeactivation = (userId) => {
    setShowConfirmation(true);
    setConfirmationMessage(t("Are you sure you want to deactivate this user?"));
    setConfirmFunction(() => () => handleUserDeactivation(userId));
  };

  // Função para fechar o modelo de confirmação
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setConfirmFunction(null);
  };

  // Função para abrir o modelo de confirmação
  const handleConfirm = () => {
    if (confirmFunction) {
      confirmFunction();
    }
    setShowConfirmation(false);
    setConfirmFunction(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label htmlFor="Team" value={t("Team")} />
        {currentUserIsAdmin && (
          <div
            className="inline-flex items-center cursor-pointer"
            id="icon-element7"
            onClick={openPopUpUsers}
          >
            <LuPlusCircle className="h-4 w-4 text-black font-bold ml-2" />
          </div>
        )}
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
                        confirmAdminChange(up.userId, false)
                      }
                      data-tooltip-id={`tooltip-${up.userId}`}
                      data-tooltip-content={t("Remove Admin")}
                    />
                  ) : (
                    <FaLevelUpAlt
                      className={`h-4 w-4 ml-2 ${
                        currentUserIsAdmin
                          ? "text-green-500 cursor-pointer"
                          : "text-gray-500"
                      }`}
                      onClick={() =>
                        currentUserIsAdmin &&
                        confirmAdminChange(up.userId, true)
                      }
                      data-tooltip-id={`tooltip-${up.userId}`}
                      data-tooltip-content={t("Make Admin")}
                    />
                  )}
                  {(currentUserIsAdmin || up.userId === currentUserId) && (
                    <IoCloseCircleOutline
                      className="h-4 w-4 ml-2 text-red-500 cursor-pointer"
                      onClick={() => confirmUserDeactivation(up.userId)}
                      data-tooltip-id={`tooltip-${up.userId}`}
                      data-tooltip-content={t("Deactivate User")}
                    />
                  )}
                  <Tooltip id={`tooltip-${up.userId}`} place="top" />
                </>
              )}
            </div>
          ))}
      </div>
      <ConfirmationModal
        show={showConfirmation}
        onClose={handleCloseConfirmation}
        onConfirm={handleConfirm}
        message={confirmationMessage}
      />
    </div>
  );
}

export default TeamCard;

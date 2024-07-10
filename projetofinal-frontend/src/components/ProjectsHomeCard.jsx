import React, { useState } from "react";
import { Card, Button, Modal, Label } from "flowbite-react";
import { LuBadge, LuBadgeCheck, LuBadgeX } from "react-icons/lu";
import { Tooltip } from "react-tooltip";
import {useTranslation} from "react-i18next";

const ProjectsHomeCard = ({ project }) => {
  const [showModal, setShowModal] = useState(false); //modal
  const { t } = useTranslation(); //tradução

  const handleOpenModal = () => { //função para abrir o modal
    setShowModal(true);
  };

  const handleCloseModal = () => { //função para fechar o modal
    setShowModal(false);
  };

  const formatDateForInput = (dateArray) => { //função para formatar a data
    if (!Array.isArray(dateArray) || dateArray.length < 3) {
      return "";
    }
    const [year, month, day, hour = 0, minute = 0] = dateArray;
    return new Date(year, month - 1, day, hour, minute)
      .toISOString()
      .split("T")[0];
  };

  const getBadge = (approved) => { //função para retornar o badge
    if (approved === true) {
      return (
        <>
          <LuBadgeCheck
            id="badge-approved"
            className="h-6 w-6 text-white bg-green-500 rounded-full p-1 ml-2"
          />
          <Tooltip
            anchorSelect="#badge-approved"
            content= {t('Approved')}
            place="top"
          />
        </>
      );
    } else if (approved === false) {
      return (
        <>
          <LuBadgeX
            id="badge-not-approved"
            className="h-6 w-6 text-white bg-red-500 rounded-full p-1 ml-2"
          />
          <Tooltip
            anchorSelect="#badge-not-approved"
            content= {t('Not Approved')}
            place="top"
          />
        </>
      );
    } else {
      return (
        <>
          <LuBadge
            id="badge-under-planning"
            className="h-6 w-6 text-white bg-gray-500 rounded-full p-1 ml-2"
          />
          <Tooltip
            anchorSelect="#badge-under-planning"
            content= {t('Under Planning')}
            place="top"
          />
        </>
      );
    }
  };

  return (
    <>
      <Card className="p-4 flex flex-col border-gray-600 bg-gradient-to-r from-gray-400 via-gray-50 to-white rounded-lg shadow-md w-72 h-64">
        <div className="flex flex-col items-center flex-grow">
          <h3 className="text-lg font-bold text-center overflow-hidden w-full">
            {project.title}
          </h3>
          <p className="text-sm text-black text-center mt-2 flex-grow overflow-hidden w-full">
            {project.description}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-center space-x-2">
          <Button size="sm" onClick={handleOpenModal}>
            {t('View Details')}
          </Button>
        </div>
      </Card>

      <Modal show={showModal} size="lg" onClose={handleCloseModal}>
        <Modal.Body>
          <div className="flex items-center overflow-hidden w-full mb-4">
            <h1 className="font-bold text-2xl">{project.title}</h1>
            {getBadge(project.approved)}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="title"
                value= {t('Title')}
                className="font-semibold text-base"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 overflow-hidden w-full">
                {project.title}
              </p>
            </div>
            <div>
              <Label
                htmlFor="status"
                value= {t('Status')}
                className="font-semibold text-base"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {
                  {
                    100: "PLANNING",
                    200: "READY",
                    300: "IN PROGRESS",
                    400: "FINISHED",
                    500: "CANCELLED",
                  }[project.status]
                }
              </p>
            </div>
            <div>
              <Label
                htmlFor="description"
                value= {t('Description')}
                className="font-semibold text-base"
              />
              <textarea
                className="text-sm text-gray-500 dark:text-gray-400 p-1 border border-gray-300 rounded-md resize-none h-20"
                readOnly
                value={project.description}
              />
            </div>
            <div>
              <Label
                htmlFor="motivation"
                value= {t('Motivation')}
                className="font-semibold text-base"
              />
              <textarea
                className="text-sm text-gray-500 dark:text-gray-400 p-1 border border-gray-300 rounded-md resize-none h-20"
                readOnly
                value={project.motivation}
              />
            </div>
            <div>
              <Label
                htmlFor="creationDate"
                value= {t('Creation Date')}
                className="font-semibold text-base"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDateForInput(project.creationDate)}
              </p>
            </div>
            <div>
              <Label
                htmlFor="plannedEndDate"
                value= {t('Planned End Date')}
                className="font-semibold text-base"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDateForInput(project.plannedEndDate)}
              </p>
            </div>
            <div>
              <Label
                htmlFor="workplace"
                value= {t('Workplace')}
                className="font-semibold text-base"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {project.workplace?.name || t('Unknown')}
              </p>
            </div>
            <div>
              <Label
                htmlFor="maxUsers"
                value= {t('Max Users')}
                className="font-semibold text-base"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {project.maxUsers}
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="bg-gray-700" onClick={handleCloseModal}>
            {t('Close')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProjectsHomeCard;

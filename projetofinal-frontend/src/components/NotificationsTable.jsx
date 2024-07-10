import React, { useState } from "react";
import DataTable from "react-data-table-component";
import NotificationModal from "./NotificationModal";
import { useTranslation } from "react-i18next";
import { ToggleSwitch } from "flowbite-react";

const NotificationsTable = ({
  data,
  pagination,
  paginationServer,
  paginationTotalRows,
  onChangePage,
  onChangeRowsPerPage,
  rowsPerPage,
  onUpdateSeenStatus,
  onBulkUpdateSeenStatus,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false); // Estado do modal
  const [selectedNotification, setSelectedNotification] = useState(null); // Notificação selecionada
  const { t } = useTranslation(); // Função de tradução
  const [switch2, setSwitch2] = useState(false); // Estado do switch

 
  

  const openModal = (notification) => { // Função para abrir o modal
    setSelectedNotification(notification);
    setModalIsOpen(true);
  };

  const closeModal = () => { // Função para fechar o modal
    setModalIsOpen(false);
    setSelectedNotification(null);
  };

  const formatDateForInput = (dateArray) => { // Função para formatar a data
    if (!Array.isArray(dateArray) || dateArray.length < 3) {
      return "";
    }
    const [year, month, day, hour, minute] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute);
    return date.toLocaleDateString("pt-BR");
  };

  const formatTimeForInput = (dateArray) => { // Função para formatar o horário
    if (!Array.isArray(dateArray) || dateArray.length < 5) {
      return "";
    }
    const [year, month, day, hour, minute] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSeenChange = async (notificationId, currentStatus) => { // Função para alterar o status da notificação
    const newStatus = !currentStatus;
    await onUpdateSeenStatus(notificationId, newStatus);
  };

  const handleSeenChangeResponsive = async (notificationId, currentStatus) => { // Função para alterar o status da notificação
    setTimeout(() => {
      handleSeenChange(notificationId, currentStatus);
    }, 500
      )
  };

  const handleBulkSeenChange = async (event) => { // Função para alterar o visto de uma notificação 
    const newStatus = event.target.checked;
    await onBulkUpdateSeenStatus(newStatus);
  };

  const columns = [ // Colunas da tabela
    { name:  t('Description'), selector: (row) => row.description, sortable: true },
    {
      name:  t('Timestamp'),
      selector: (row) => {
        const dateArray = row.timestamp;
        const formattedDate = formatDateForInput(dateArray);
        const formattedTime = formatTimeForInput(dateArray);
        return `${formattedDate} ${formattedTime}`;
      },
      sortable: true,
    },
    {
      name:  t('Type'),
      selector: (row) => row.type,
      sortable: true,
    },
    {
      name: (
        <div>
          <input
            type="checkbox"
            onChange={handleBulkSeenChange}
            className="mr-2"
          />
          { t('Seen')}
        </div>
      ),
      selector: (row) => (
        <input
          type="checkbox"
          checked={row.seen}
          onChange={() => handleSeenChange(row.id, row.seen)}
        />
      ),
      sortable: true,
    },
  ];

  const renderCards = () => { // Função para renderizar os cartões para a responsividade
    return data.map((notification) => (
      <div key={notification.id} className="p-4 bg-white rounded-lg shadow-md m-2">
        <h3 className="font-bold">{notification.type}</h3>
        <p>{notification.description}</p>
        <p>{formatDateForInput(notification.timestamp)} {formatTimeForInput(notification.timestamp)}</p>
        <div className="flex justify-between items-center">
          <button
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 transition-colors"
            onClick={() => openModal(notification)}
          >
            {t('View Details')}
          </button>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <ToggleSwitch
                checked={notification.seen}
                onChange={() => {handleSeenChangeResponsive(notification.id, notification.seen); setSwitch2((prevState) => !prevState);
                }}
                
              />
            </div>
            <div className="ml-3 text-gray-700 font-medium">
              {notification.seen ? t('Seen') : t('Unseen')}
            </div>
          </label>
        </div>
      </div>
    ));
  };
  return (
    <div className="p-6 bg-white rounded-lg h-[44rem] shadow-lg border-2 border-red-900">
      <style>
        {`
          .clickable-rows {
            cursor: pointer;
          }
          .data-table-row {
            transition: background-color 0.2s ease;
          }
          .data-table-row:hover {
            background-color: #f0f4f8; /* Adjust as needed */
          }
        `}
      </style>
      <div className="hidden md:block">
      <DataTable
        columns={columns}
        data={data}
        pagination={pagination}
        paginationServer={paginationServer}
        paginationTotalRows={paginationTotalRows}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        paginationPerPage={rowsPerPage}
        onRowClicked={(row) => openModal(row)}
        paginationComponentOptions={{
          rowsPerPageText: t("RowsPerPage"),
          rangeSeparatorText: t("of"),
        }}
        noHeader={true}
        className="clickable-rows"
        customStyles={{
          rows: {
            style: {
              minHeight: "40px",
            },
          },
        }}
        striped={true}
      />
      </div>
      <div className="md:hidden">
        {renderCards()}
      </div>
      <NotificationModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        notification={selectedNotification}
      />
    </div>
  );
};

export default NotificationsTable;

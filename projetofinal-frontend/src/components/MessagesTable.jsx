import React, { useState } from "react";
import DataTable from "react-data-table-component";
import MessageModal from "./MessageModal";
import { useTranslation } from "react-i18next";

const MessagesTable = ({
  data,
  loading,
  pagination,
  paginationServer,
  paginationTotalRows,
  onChangePage,
  onChangeRowsPerPage,
  rowsPerPage,
  onUpdateSeenStatus,
  view,
  onBulkUpdateSeenStatus,
  authToken,
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false); // Estado do modal
  const [selectedMessage, setSelectedMessage] = useState(null); // Mensagem selecionada
  const { t } = useTranslation(); // Função de tradução

  const openModal = (message) => {  // Função para abrir o modal
    setSelectedMessage(message);
    setModalIsOpen(true);
  };

  const closeModal = () => { // Função para fechar o modal
    setModalIsOpen(false);
    setSelectedMessage(null);
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

  const handleSeenChange = async (messageId, currentStatus) => { // Função para alterar o estado de visto
    const newStatus = !currentStatus;
    await onUpdateSeenStatus(messageId, newStatus);
  };

  const handleBulkSeenChange = async (event) => { // Função para alterar o visto de uma mensagem
    const newStatus = event.target.checked;
    await onBulkUpdateSeenStatus(newStatus);
  };


  let columns = [ // Colunas da tabela
    { name: t('Content'), selector: (row) => row.content, sortable: true },
    {
      name: t('Timestamp'),
      selector: (row) => {
        const dateArray = row.timestamp;
        const formattedDate = formatDateForInput(dateArray);
        const formattedTime = formatTimeForInput(dateArray);
        return `${formattedDate} ${formattedTime}`;
      },
      sortable: true,
    },
    {
      name: view === "received" ? t('From') : t('To'),
      selector: (row) =>
        view === "received" ? row.senderUsername : row.receiverUsername,
      sortable: true,
    },
    {
      name: (
        <div>
          {view === "received" && (
            <input type="checkbox" onChange={handleBulkSeenChange} className="mr-2"/>
          )}
          {t('Seen')}{" "}
        </div>
      ),
      selector: (row) =>
        view === "received" ? (
          <input
            type="checkbox"
            checked={row.seen}
            onChange={() => handleSeenChange(row.id, row.seen)}
          />
        ) : row.seen ? (
          t('Yes')
        ) : (
          t('No')
        ),
      sortable: true,
    },
  ];

  const renderCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data.map((message) => (
        <div
          key={message.id}
          className="bg-white p-4 rounded-lg shadow border cursor-pointer hover:shadow-md"
          onClick={() => openModal(message)}
        >
          <h3 className="font-semibold">{view === "received" ? t('From') : t('To')}: {view === "received" ? message.senderUsername : message.receiverUsername}</h3>
          <p>{message.content}</p>
          <p>{t('Seen')}: {message.seen ? t('Yes') : t('No')}</p>
        </div>
      ))}
    </div>
  );


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
      <div className="hidden sm:block">
      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
        pagination={pagination}
        paginationServer={paginationServer}
        paginationTotalRows={paginationTotalRows}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        paginationPerPage={rowsPerPage}
        onRowClicked={(row) => openModal(row)}
        paginationComponentOptions={{
          rowsPerPageText: t('RowsPerPage'),
          rangeSeparatorText: t('of'),
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
      <div className="sm:hidden">
        {renderCards()}
      </div>
      <MessageModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        message={selectedMessage}
        authToken={authToken}
        view={view}
      />
    </div>
  );
};

export default MessagesTable;

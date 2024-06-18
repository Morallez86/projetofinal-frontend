import React, { useState } from "react";
import DataTable from "react-data-table-component";
import MessageModal from "./MessageModal";

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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const openModal = (message) => {
    setSelectedMessage(message);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedMessage(null);
  };

  const formatDateForInput = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 3) {
      return "";
    }
    const [year, month, day, hour, minute] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute);
    return date.toLocaleDateString("pt-BR");
  };

  const formatTimeForInput = (dateArray) => {
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

  const handleSeenChange = async (messageId, currentStatus) => {
    const newStatus = !currentStatus;
    await onUpdateSeenStatus(messageId, newStatus);
  };

  const handleBulkSeenChange = async (event) => {
    const newStatus = event.target.checked;
    await onBulkUpdateSeenStatus(newStatus);
  };

  // Define columns dynamically based on the view (received or sent)
  let columns = [
    { name: "Content", selector: (row) => row.content, sortable: true },
    {
      name: "Timestamp",
      selector: (row) => {
        const dateArray = row.timestamp;
        const formattedDate = formatDateForInput(dateArray);
        const formattedTime = formatTimeForInput(dateArray);
        return `${formattedDate} ${formattedTime}`;
      },
      sortable: true,
    },
    {
      name: view === "received" ? "From" : "To",
      selector: (row) =>
        view === "received" ? row.senderUsername : row.receiverUsername,
      sortable: true,
    },
    {
      name: (
        <div>
          Seen{" "}
          {view === "received" && (
            <input type="checkbox" onChange={handleBulkSeenChange} />
          )}
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
          "Yes"
        ) : (
          "No"
        ),
      sortable: true,
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg border-2 border-red-900">
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
      <MessageModal
        isOpen={modalIsOpen}
        closeModal={closeModal}
        message={selectedMessage}
        authToken={authToken}
      />
    </div>
  );
};

export default MessagesTable;

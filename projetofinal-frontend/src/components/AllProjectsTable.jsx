import React from "react";
import DataTable from "react-data-table-component";
import { FcInvite } from "react-icons/fc";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import { useTranslation } from "react-i18next";

// Helper function to convert the date array to a JS Date object
const formatDate = (dateArray) => {
  if (!Array.isArray(dateArray) || dateArray.length < 3) {
    return "Invalid Date";
  }
  // Adjust month value as JS Date months are zero-based
  const [year, month, day, hour = 0, minute = 0] = dateArray;
  return new Date(year, month - 1, day, hour, minute).toLocaleDateString();
};


// Helper function to map status value to status string
const getStatusString = (statusValue) => {
  switch (statusValue) {
    case 100:
      return "PLANNING";
    case 200:
      return "READY";
    case 300:
      return "IN PROGRESS";
    case 400:
      return "FINISHED";
    case 500:
      return "CANCELLED";
    default:
      return "UNKNOWN";
  }
};

// Helper function to get skills as a comma-separated string
const getSkillsString = (skills) => {
  if (!Array.isArray(skills)) {
    return "No skills";
  }
  return skills.map((skill) => skill.name).join(", ");
};

// Helper function to get interests as a comma-separated string
const getInterestsString = (interests) => {
  if (!Array.isArray(interests)) {
    return "No interests";
  }
  return interests.map((interest) => interest.name).join(", ");
};

function AllProjectsTable({
  data,
  loading,
  pagination,
  paginationServer,
  paginationTotalRows,
  onChangePage,
  onChangeRowsPerPage,
  rowsPerPage,
}) {
  const apiUrl = useApiStore((state) => state.apiUrl);
  const token = useUserStore((state) => state.token);

  const {t} = useTranslation();

  const handleInviteClick = async (projectId) => {
    const confirmed = window.confirm(
      t('AreYouSureYouWantToSendAnInvitationToThisProject')
    );
    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "300",
          projectId: projectId,
        }),
      });

      if (response.ok) {
        alert("Invitation sent successfully");
      } else {
        alert("Failed to send invitation");
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      alert("An error occurred while sending the invitation");
    }
  };

  const columns = [
    {
      name: t('ProjectName') ,
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: t('Status') ,
      selector: (row) => getStatusString(row.status),
      sortable: true,
    },
    {
      name:  t('Skills') ,
      selector: (row) => getSkillsString(row.skills),
      sortable: true,
    },
    {
      name: t('Interests'),
      selector: (row) => getInterestsString(row.interests),
      sortable: true,
    },
    {
      name: t('SlotsOpen'),
      selector: (row) => row.maxUsers - row.userProjectDtos.length,
      cell: (row) => {
        const slotsOpen = row.maxUsers - row.userProjectDtos.length;
        return (
          <div className="flex justify-between items-center w-1/2">
            <span>{slotsOpen}</span>
            <FcInvite
              className={`ml-2 cursor-pointer ${
                slotsOpen <= 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={slotsOpen > 0 ? () => handleInviteClick(row.id) : null}
            />
          </div>
        );
      },
    },
    {
      name: t('CreationDate'),
      selector: (row) => formatDate(row.creationDate),
      sortable: true,
    },
  ];

  return (
    <div className="p-6 border border-gray-600 bg-white rounded-lg">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-center ml-3">All Projects</h1>
      </div>
      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
        pagination={pagination}
        paginationServer={paginationServer}
        paginationTotalRows={paginationTotalRows}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
        paginationPerPage={rowsPerPage}
        responsive
        paginationComponentOptions={{
          rowsPerPageText: t('RowsPerPage'),
          rangeSeparatorText: t('of'),
        }}
      />
    </div>
  );
}

export default AllProjectsTable;

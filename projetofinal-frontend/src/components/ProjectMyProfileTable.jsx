import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { TextInput } from "flowbite-react";

function ProjectMyProfileTable({ data, onRowClick }) {
  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Approved",
      selector: (row) => (row.approved ? "Yes" : "No"),
      sortable: true,
    },
    {
      name: "Creation Date",
      selector: (row) => row.creationDate,
      sortable: true,
    },
    {
      name: "Approved Date",
      selector: (row) => row.approvedDate || "N/A",
      sortable: true,
    },
    {
      name: "Starting Date",
      selector: (row) => row.startingDate || "N/A",
      sortable: true,
    },
    {
      name: "Planned End Date",
      selector: (row) => row.plannedEndDate || "N/A",
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => row.endDate || "N/A",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={() => onRowClick(row.id)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
        >
          View Gantt Chart
        </button>
      ),
    },
  ];

  const [records, setRecords] = useState(data);

  function handleFilter(e) {
    const value = e.target.value;
    const filteredData = data.filter((record) => {
      return record.title.toLowerCase().includes(value.toLowerCase());
    });
    setRecords(filteredData);
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">My Projects</h2>
        <TextInput
          placeholder="Search by title..."
          onChange={handleFilter}
          className="w-full sm:w-1/3 lg:w-1/4"
        />
      </div>
      <DataTable
        columns={columns}
        data={records}
        fixedHeader
        pagination
        responsive
        customStyles={{
          header: {
            style: {
              minHeight: '56px',
            },
          },
          headRow: {
            style: {
              backgroundColor: '#f3f4f6',
            },
          },
          rows: {
            style: {
              minHeight: '56px',
              '&:not(:last-of-type)': {
                borderBottomWidth: '1px',
                borderBottomColor: '#e5e7eb',
              },
            },
          },
          pagination: {
            style: {
              borderTopWidth: '1px',
              borderTopColor: '#e5e7eb',
            },
          },
        }}
      />
    </div>
  );
}

export default ProjectMyProfileTable;

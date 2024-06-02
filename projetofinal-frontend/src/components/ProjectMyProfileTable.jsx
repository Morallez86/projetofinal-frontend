// src/Components/ProjectMyProfileTable.js
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { TextInput } from "flowbite-react";

function ProjectMyProfileTable({ data, onRowClick }) {
  const columns = [
    {
      name: "Project Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.creation_date,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <button onClick={() => onRowClick(row.id)}>View Gantt Chart</button>
      ),
    },
  ];

  const [records, setRecords] = useState(data);

  function handleFilter(e) {
    const value = e.target.value;
    const filteredData = data.filter((record) => {
      return record.name.toLowerCase().includes(value.toLowerCase());
    });
    setRecords(filteredData);
  }

  return (
    <div>
      <div>
        <TextInput
          placeholder="Search by name..."
          onChange={handleFilter}
          style={{ width: "20%" }}
        />
      </div>
      <DataTable
        title="My Projects"
        columns={columns}
        data={records}
        fixedHeader
        pagination
        responsive
      />
    </div>
  );
}

export default ProjectMyProfileTable;

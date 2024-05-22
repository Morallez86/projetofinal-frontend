import React from "react";
import DataTable from "react-data-table-component";
import { useState } from "react";

function ProjectMyProfileTable() {
  const columns = [
    {
      name: "Project Name",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.creation_date,
      sortable: true,
    },
    {
      name: "Status",
      selector: "status",
      selector: (row) => row.status,
      sortable: true,
    },
  ];

  const data = [
    {
      id: 1,
      title: "Project 1",
      creation_date: "08/04/2024",
      status: "Pending",
    },
    {
      id: 2,
      title: "Project 2",
      creation_date: "10/08/2023",
      status: "Finished",
    },
    {
      id: 3,
      title: "Project 3",
      creation_date: "10/08/2022",
      status: "Finished",
    },
  ];

  const [records, setRecords] = useState(data);

  function handleFilter(e){
    const value = e.target.value;
    const filteredData = data.filter((record) => {
      return record.title.toLowerCase().includes(value.toLowerCase());
    });
    setRecords(filteredData);
  }

  return (
    <div>
        <div>
            <input type="text" onChange={handleFilter}/>
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

import React from "react";
import DataTable from "react-data-table-component";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../stores/UserStore";
import translations from "../Translation/translation";



function DataTableUsers() {
  const allUsers = userStore((state) => state.allUsers);
  const token = userStore((state) => state.token);
  const updateProfileInfo = userStore((state) => state.updateProfileInfo);
  const language = userStore((state) => state.language);
  const { nameLabel, role } = translations[language];

  const columns = [
    {
      name: nameLabel,
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      hide: "sm",
    },
    { name: role, selector: (row) => row.role, sortable: true },
  ];

  const navigate = useNavigate();

  const [records, setRecords] = useState(allUsers);

  function handleFilter(event) {
    const user = event.target.value.toLowerCase();
    fetch(`http://localhost:8080/projecto5backend/rest/user/search/${user}`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        token: token,
      },
    })
      .then(async function (response) {
        if (response.status === 403) {
          alert("User with this token is not found");
        } else if (response.status === 401) {
          alert("Token timer expired, please login again.");
          navigate("/goBackInitialPage", { replace: true });
        } else if (response.status === 200) {
          const result = await response.json();
          console.log(result);
          setRecords(result);
        }
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
    if (user === "") {
      setRecords(allUsers);
    }
  }

  function handleRowClicked(row) {
    console.log("Row clicked:", row);
    const username = row.username;
    console.log("Username:", username);
    /* const data = {
      name: row.name,
      email: row.email,
      username: row.username,
      photo: row.userPhoto,
      tasks: "",
      tasksTODO: [],
      tasksDOING: [],
      tasksDONE: [],
    }; */
    navigate(`/userProfile/${username}`, { replace: true });
  }

  return (
    <div className="table-users">
      <div>
        <input
          className="search-bar"
          type="text"
          onChange={handleFilter}
          placeholder="Search by name"
        />
      </div>

      <div>
        <DataTable
          columns={columns}
          data={records}
          fixedHeader
          pagination
          onRowClicked={handleRowClicked}
          responsive
        />
      </div>
    </div>
  );
}

export default DataTableUsers;

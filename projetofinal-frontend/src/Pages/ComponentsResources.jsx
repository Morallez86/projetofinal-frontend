import React from "react";
import Layout from "../Components/Layout";
import ComponentsTable from "../Components/ComponentsTable";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import { useEffect, useState } from "react";


function ComponentsResources() {
  const apiUrl = useApiStore((state) => state.apiUrl);
  const token = useUserStore((state) => state.token);
  const [resources, setResources] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    getResources();
  }
  , [page, rowsPerPage, filterText]);



  const getResources = async () => {
    try {
    const response = await fetch(`${apiUrl}/resources?page=${page}&limit=${rowsPerPage}&filter=${encodeURIComponent(filterText)}`, {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      console.log("resources fetched successfully");
      const data = await response.json();
      setResources(data.resources);
      setTotalPages(data.totalPages);
      console.log(data);
    } else {
      console.error("Error fetching resources" + response.status);
    } } catch (error) {
      console.error("Error fetching resources" + error);
    } 
    finally {
      setLoading(false);
    }
  }



  return (
    <div className="flex flex-col min-h-screen">
      <Layout activeTab={2} activeSubComponents={1} />{" "}
      <div className="p-14">
        <ComponentsTable
          data={resources}
          loading={loading}
          pagination
          paginationServer
          paginationTotalRows={totalPages}
          onChangePage={(newPage) => setPage(newPage)}
          onChangeRowsPerPage={(newRowsPerPage) =>
            setRowsPerPage(newRowsPerPage)
          }
          rowsPerPage={rowsPerPage}
          filterText={filterText}
          setFilterText={setFilterText}
          context={"resources"}
        />
      </div>
    </div>
  );
}

export default ComponentsResources;

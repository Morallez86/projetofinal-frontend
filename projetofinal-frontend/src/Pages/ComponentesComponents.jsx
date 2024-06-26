import React from "react";
import ComponentsTable from "../Components/ComponentsTable";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import ComponentResourceCardDetails from "../Components/ComponentResourceCardDetails";

function ComponentesComponents() {
  const apiUrl = useApiStore((state) => state.apiUrl);
  const token = useUserStore((state) => state.token);
  const [components, setComponents] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getComponents();
  }, [page, rowsPerPage, filterText]);

  const getComponents = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/components/toTables?page=${page}&limit=${rowsPerPage}&filter=${encodeURIComponent(
          filterText
        )}`,
        {
          method: "GET",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("components fetched successfully");
        const data = await response.json();
        setComponents(data.components);
        setTotalPages(data.totalPages);
        console.log(data);
      } else {
        console.error("Error fetching components" + response.status);
      }
    } catch (error) {
      console.error("Error fetching components" + error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    getComponents(); // Refresh the data after creation
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-14">
        <Button className="mb-4" onClick={() => setShowModal(true)}>Create New Component</Button>
        <ComponentsTable
          data={components}
          loading={loading}
          pagination
          paginationServer
          paginationTotalRows={totalPages * rowsPerPage}
          onChangePage={(newPage) => setPage(newPage)}
          onChangeRowsPerPage={(newRowsPerPage) =>
            setRowsPerPage(newRowsPerPage)
          }
          rowsPerPage={rowsPerPage}
          filterText={filterText}
          setFilterText={setFilterText}
          context={"components"}
          getComponents={getComponents}
        />
      </div>
      {showModal && (
        <ComponentResourceCardDetails
          data={{}}
          context="components"
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default ComponentesComponents;

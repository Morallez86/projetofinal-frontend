import React, { useEffect, useState } from "react";
import ComponentsTable from "../Components/ComponentsTable";
import useApiStore from "../Stores/ApiStore";
import useUserStore from "../Stores/UserStore";
import { Button } from "flowbite-react";
import ComponentResourceCardDetails from "../Components/ComponentResourceCardDetails";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function ComponentesComponents() {
  const apiUrl = useApiStore((state) => state.apiUrl); // URL da API
  const token = useUserStore((state) => state.token); // Token
  const [components, setComponents] = useState([]); // Componentes
  const [totalPages, setTotalPages] = useState(0); // Total de páginas
  const [page, setPage] = useState(1); // Página
  const [rowsPerPage, setRowsPerPage] = useState(10); // Linhas por página
  const [loading, setLoading] = useState(true); // Loading
  const [filterText, setFilterText] = useState(""); // Texto de filtro
  const [showModal, setShowModal] = useState(false); // Modal
  const navigate = useNavigate(); 
  const handleSessionTimeout = () => { // Função para lidar com o timeout da sessão
    navigate("/", { state: { showSessionTimeoutModal: true } }); // Navegar para a página inicial
  };

  const { t } = useTranslation(); // Função de tradução

  const getComponents = async () => { // Função para obter os componentes
    setLoading(true); //  Ativar o loading
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
      if (response.status === 200) { // Se a resposta for 200
        
        const data = await response.json();
        setComponents(data.components);
        setTotalPages(data.totalPages);
       
      } else if (response.status === 401) {
        const data = await response.json();
        const errorMessage = data.message || "Unauthorized";

        if (errorMessage === "Invalid token") {
          handleSessionTimeout(); // Lidar com o timeout da sessão
          return; 
        } else {
          console.error("Error updating seen status:", errorMessage);
        }
      } else {
        console.error("Error fetching components" + response.status);
      }
    } catch (error) {
      console.error("Error fetching components" + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { // Atualizar os componentes
    getComponents();
  }, [page, rowsPerPage, filterText, apiUrl, token]); // Atualizar os componentes

  const handleModalClose = () => { // Função para fechar o modal
    setShowModal(false);
    getComponents(); // Obter os componentes
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-14">
        <Button className="mb-4" onClick={() => setShowModal(true)}>
          {t("CreateNewComponent")}
        </Button>
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

import React, { useEffect } from "react";
import Layout from "./Components/Layout";
import useWorkplaces from "./Hooks/useWorkplaces";
import "./general.css";

function App() {
  const { workplaces } = useWorkplaces();
  console.log(workplaces)

  useEffect(() => {
  }, []);

  return <Layout activeTab={1} activeSubProjects={1} />;
}

export default App;



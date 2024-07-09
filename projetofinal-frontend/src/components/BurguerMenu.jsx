import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { VscTools } from 'react-icons/vsc';
import { GrResources } from 'react-icons/gr';
import { ImProfile } from 'react-icons/im';
import { AiOutlineFundProjectionScreen } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { IoCreateOutline } from 'react-icons/io5';
import { CiBoxList } from 'react-icons/ci';
import { IoIosPeople } from 'react-icons/io';
import { CiSettings } from 'react-icons/ci';

// Estrutura de dados para tabs e subtabs
const menuItems = [
  {
    title: "MyProfile", 
    path: "/myProfile",
    icon: <ImProfile />,
    subtabs: [
      { title: "My Projects", path: "/myProjects", icon: <CiSettings /> },
      { title: "Change Password", path: "/changePassword", icon: <CiSettings /> },
      { title: "About Me", path: "/aboutMe", icon: <CgProfile /> },
    ],
  },
  {
    title: "All Projects",
    path: "/allProjects",
    icon: <AiOutlineFundProjectionScreen />,
    subtabs: [
      { title: "Create New", path: "/createNewProject", icon: <IoCreateOutline /> },
      { title: "Projects List", path: "/projectsList", icon: <CiBoxList /> },
      { title: "Users", path: "/users", icon: <CiSettings /> },
    ],
  },
  {
    title: "Components/Resources",
    path: "/componentsResources",
    icon: <GrResources />,
    subtabs: [
      { title: "Components", path: "/components", icon: <VscTools /> },
      { title: "Resources", path: "/resources", icon: <GrResources /> },
    ],
  },
];

function BurgerMenu() { //BurguerMenu para o Mobile 
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [expandedTab, setExpandedTab] = useState(null); // Passo 1


  const handleItemClick = (path, title) => {
    if (path) {
      navigate(path);
    }
    // Fechar o menu após a tentativa de navegação ou ao expandir/clicar em um item sem path
    setIsOpen(false);
  
    if (!path) {
      // Alternar a expansão das subtabs se não houver path
      setExpandedTab(expandedTab === title ? null : title);
    }
  };


  return (
    <div className="flex flex-col items-start">
      {menuItems.map((item, index) => (
        <div key={index} className="mb-2">
          <button onClick={() => handleItemClick(null, item.title)} className="flex items-center w-full text-left px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition duration-150 ease-in-out">
            {item.icon}
            <span className="ml-2">{item.title}</span>
          </button>
          {item.subtabs && expandedTab === item.title && (
            <div className="subtabs mt-2">
              {item.subtabs.map((subtab, subIndex) => (
                <button key={subIndex} onClick={() => handleItemClick(subtab.path)} className="ml-4 flex items-center w-full text-left px-2 py-1 text-sm text-gray-500 hover:bg-gray-50 rounded transition duration-150 ease-in-out">
                  {subtab.icon}
                  <span className="ml-2">{subtab.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default BurgerMenu;
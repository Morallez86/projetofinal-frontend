import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ProjectCard = ({ project, onRowClick }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
  
    return (
        <div className="p-4 border border-gray-300 bg-white rounded-lg shadow-md m-2">
        <h2 className="text-xl font-bold mb-2">{project.title}</h2>
        <p>{t('Status')}: {project.status}</p>
        <p>{t('Approved')}: {project.approved ? t('Yes') : t('No')}</p>
        <p>{t('CreationDate')}: {project.creationDate}</p>
        <p>{t('PlannedEndDate')}: {project.plannedEndDate}</p>
        <div className="flex flex-col space-y-2">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={() => navigate(`/myProjects/${project.id}`)}
          >
            {t('ViewDetails')}
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={() => onRowClick(project.id)}
          >
            {t('View Gantt Chart')}
          </button>
        </div>
      </div>
  );
};

function ProjectMyProfileCards({ data, onRowClick }) {
    return (
      <div className="flex flex-wrap justify-center">
        {data.map((project) => (
          <ProjectCard key={project.id} project={project} onRowClick={onRowClick} />
        ))}
      </div>
  );
}

export default ProjectMyProfileCards;
import React from "react";
import { Card, Button } from "flowbite-react";

const ProjectsHomeCard = ({ project }) => {
  return (
    <Card className="p-4 flex flex-col border-gray-600 bg-gradient-to-r from-gray-400 via-gray-50 to-white rounded-lg shadow-md w-60 h-64">
      <div className="flex flex-col items-center flex-grow">
        <h3 className="text-lg font-bold text-center">{project.title}</h3>
        <p className="text-sm text-black text-center mt-2 flex-grow">
          {project.description}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-center space-x-2">
        <Button size="sm" onClick={() => alert(`Project ID: ${project.id}`)}>
          Details
        </Button>
      </div>
    </Card>
  );
};

export default ProjectsHomeCard;

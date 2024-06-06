import React from 'react'

function ProjectDetailsCard({ project }) {
  // Helper function to convert the date array to a JS Date object
  console.log(project);
  const formatDate = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 3) {
      return "Invalid Date";
    }
    const [year, month, day, hour = 0, minute = 0] = dateArray;
    return new Date(year, month - 1, day, hour, minute).toLocaleDateString();
  };

  // Helper function to map status value to status string
  const getStatusString = (statusValue) => {
    switch (statusValue) {
      case 100:
        return "PLANNING";
      case 200:
        return "READY";
      case 300:
        return "IN PROGRESS";
      case 400:
        return "FINISHED";
      case 500:
        return "CANCELLED";
      default:
        return "UNKNOWN";
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full mx-auto">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
        <p>
          <strong>Description:</strong> {project.description}
        </p>
        <p>
          <strong>Status:</strong> {getStatusString(project.status)}
        </p>
        <p>
          <strong>Approved:</strong> {project.approved ? "Yes" : "No"}
        </p>
        <p>
          <strong>Creation Date:</strong> {formatDate(project.creationDate)}
        </p>
        <p>
          <strong>Planned End Date:</strong>{" "}
          {formatDate(project.plannedEndDate)}
        </p>
      </div>
    </div>
  );
}

export default ProjectDetailsCard
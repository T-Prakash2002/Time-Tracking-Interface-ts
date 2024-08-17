import React, { useState, useContext } from "react";
import Timer from "../shared/Timer";
import { ContextApi } from "../Context/UserContext";

// Define types for your props
interface Project {
  id: number;
  project_name: string;
  // Add other fields as necessary
}

interface ProjectListProps {
  project: Project;
  setAddEdit: React.Dispatch<React.SetStateAction<{
    id: number;
    description: string;
    text: string;
  }>>;
}

const ProjectList: React.FC<ProjectListProps> = ({ project, setAddEdit }) => {
  const { setProjects, projects, deleteProject } = useContext(ContextApi);

  const handleDelete = async (id: number) => {
    const filterObj = projects.filter((item: Project) => item.id !== id);
    setProjects(filterObj);
    await deleteProject(id);
  };

  const handleUpdate = () => {
    setAddEdit({
      id: project.id,
      description: project.project_name,
      text: "Edit",
    });
  };

  return (
    <>
      <div className="p-2" id="projectName">
        {project.project_name}
      </div>
      <div className="">
        <Timer project={project} />
      </div>
      <div className="flex justify-between mt-4">
        <button
          className="px-4 py-2 border border-yellow-500 text-yellow-500 rounded hover:bg-yellow-500 hover:text-white"
          onClick={() => handleUpdate()}
        >
          Edit
        </button>
        <button
          className="px-4 py-2 border border-black text-black rounded hover:bg-black hover:text-white"
          onClick={() => handleDelete(project.id)}
        >
          Delete
        </button>
      </div>
      <hr className="mt-4" />
    </>
  );
};

export default ProjectList;

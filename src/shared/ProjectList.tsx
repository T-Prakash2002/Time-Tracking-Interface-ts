import React, { useContext } from 'react';
import { ContextApi } from '../Context/UserContext';
import Timer from './Timer';

interface Project {
  id: string;
  userEmail: string;
  project_name: string;
  time: number;
  createDate: Date;
  startDate: Date | null;
  endDate: Date | null;
  status: string;
}
interface ProjectListProps {
  project: Project;
  setAddEdit: React.Dispatch<React.SetStateAction<{
    id: string;
    description: string;
    text: string;
  }>>;
}

const ProjectList: React.FC<ProjectListProps> = ({ project, setAddEdit }) => {
  const context = useContext(ContextApi);

  if (!context) {
    throw new Error('useContext must be used within a ContextProvider');
  }

  const { setProjects, projects, deleteProject } = context;

  const handleDelete = async (id: string) => {
    const updatedProjects = projects.filter((item) => item.id != id);
    setProjects(updatedProjects);
    await deleteProject(id);
  };

  const handleUpdate = () => {
    setAddEdit({
      id: project.id,
      description: project.project_name,
      text: 'Edit',
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
          onClick={handleUpdate}
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

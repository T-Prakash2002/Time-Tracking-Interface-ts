// Home.tsx
import React, { useState, useContext } from "react";
import "../Style/home.css";
import ProjectList from "../shared/ProjectList";
import { ContextApi } from "../Context/UserContext";
import { v4 as uuidv4 } from "uuid";

interface Project {
  id: string;
  userEmail: string;
  project_name: string;
  time: number;
  createDate: Date;
  endDate: string;
  startDate: string;
  status: string;
}

interface AddEditState {
  id: string;
  description: string;
  text: string;
}

interface ContextProps {
  user: { email: string };
  addProject: (project: Project) => Promise<void>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  updateProject: (id: string, updatedProject: Project) => Promise<void>;
  isLoggedIn: boolean;
}

const Home: React.FC = () => {
  const { user, addProject, projects, setProjects, updateProject, isLoggedIn } = useContext(ContextApi) as ContextProps;

  const [AddEdit, setAddEdit] = useState<AddEditState>({
    id: "",
    description: "",
    text: "Add",
  });

  const handleSubmit = async () => {
    if (isLoggedIn) {
      const newProject: Project = {
        id: uuidv4(),
        userEmail: user.email,
        project_name: AddEdit.description,
        time: 0,
        createDate: new Date(),
        endDate: '',
        startDate: '',
        status: 'stop',
      };

      setProjects([...projects, newProject]);
      await addProject(newProject);
      setAddEdit({ ...AddEdit, description: "" });
    } else {
      alert("Please log in first");
    }
  };

  const handleSubmitUpdate = async () => {
    const fetchP = projects.find((item) => item.id === AddEdit.id);
    if (!fetchP) return;

    const updateProjectObj = { ...fetchP, project_name: AddEdit.description };
    await updateProject(AddEdit.id, updateProjectObj);

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === AddEdit.id ? updateProjectObj : project
      )
    );
    setAddEdit({ id: "", description: "", text: "Add" });
  };

  return (
    <div className="home container mx-auto p-4">
      <div className="AddProject mb-4">
        <div className="flex gap-4">
          <input
            type="text"
            className="form-input px-4 py-2 border rounded-lg w-full"
            placeholder="What are you working on?"
            onChange={(e) => setAddEdit({ ...AddEdit, description: e.target.value })}
            value={AddEdit.description}
            required
          />
          <button
            type="submit"
            onClick={() => AddEdit.text === "Add" ? handleSubmit() : handleSubmitUpdate()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            {AddEdit.text} Project
          </button>
        </div>
      </div>

      <div className="projectListGroup grid grid-cols-1 p-3">
        {projects.map((project) => (
          <div key={project.id} className="projectlist">
            <ProjectList project={project} setAddEdit={setAddEdit} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

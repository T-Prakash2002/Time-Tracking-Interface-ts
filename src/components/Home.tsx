import React, { useState, useContext } from "react";
import "../Style/home.css";
import ProjectList from "../shared/ProjectList";
import { ContextApi } from "../Context/UserContext"; // Ensure your Context is correctly typed
import { v4 as uuidv4 } from "uuid";

interface AddEditState {
  id: string;
  description: string;
  text: string;
}

const Home: React.FC = () => {
  const { user, addProject, projects, setProjects, updateProject ,isLoggedIn} = useContext(ContextApi);

  const [AddEdit, setAddEdit] = useState<AddEditState>({
    id: "",
    description: "",
    text: "Add",
  });

  // New Project
  const handleSubmit = async () => {
    if(isLoggedIn){
      const newProject = {
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
    }else{
      alert("Loggin First")
    }
  };

  // Edit Project
  const handleSubmitUpdate = async () => {
    const fetchP = projects.find((item) => item.id === AddEdit.id);

    if (!fetchP) return;

    const updateProjectObj = {
      ...fetchP,
      project_name: AddEdit.description,
    };

    await updateProject(AddEdit.id, updateProjectObj);

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === AddEdit.id ? { ...project, project_name: AddEdit.description } : project
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
            onChange={(e) =>
              setAddEdit({ ...AddEdit, description: e.target.value })
            }
            value={AddEdit.description}
            required
          />
          <button
            type="submit"
            onClick={() => {
              if (AddEdit.text === "Add") {
                handleSubmit();
              } else {
                handleSubmitUpdate();
              }
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            {AddEdit.text} Project
          </button>
        </div>
      </div>

      <div className="projectListGroup grid grid-cols-1 p-3">
        {projects.map((project, index) => (
          <div key={index} className="projectlist">
            <ProjectList project={project} setAddEdit={setAddEdit} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

// Define types
interface User {
  name: string;
  email: string;
  password?: string;
}

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

interface ContextProps {
  user: User;
  addProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  updateProject: (id: string, updatedProject: Project) => Promise<void>;
  isLoggedIn: boolean;
  register: (name: string, email: string, password: string) => Promise<string | void>;
  login: (email: string, password: string) => Promise<string>;
  logout: () => void;
}

// Create context with default values
export const ContextApi = createContext<ContextProps | undefined>(undefined);

interface UserContextProviderProps {
  children: ReactNode;
}

const UserContextProvider: React.FC<UserContextProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(Boolean(localStorage.getItem("isLoggedIn")));
  const [user, setUser] = useState<User>(JSON.parse(localStorage.getItem("user") || "{}"));
  const [projects, setProjects] = useState<Project[]>([]);
  const BASE_URL = 'https://time-tracking-interface-be.onrender.com';

  useEffect(() => {
    if (isLoggedIn && user.email) {
      getProject(user.email);
    }
  }, [isLoggedIn, user.email]);

  const register = async (name: string, email: string, password: string): Promise<string | void> => {
    try {
      const response = await axios.post(`${BASE_URL}/register`, { name, email, password });
      setUser(response.data.data);
      setIsLoggedIn(true);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data));
      localStorage.setItem("isLoggedIn", "true");
      return response.data.message;
    } catch (err) {
      console.log("Error Registering");
    }
  };

  const login = async (email: string, password: string): Promise<string> => {
    try {
      const response = await axios.get(`${BASE_URL}/login`, { params: { email, password } });
      setUser(response.data.data);
      setIsLoggedIn(true);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data));
      localStorage.setItem("isLoggedIn", "true");
      return response.data.message;
    } catch (error) {
      return "Login Failed, Try Again";
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    setUser({ name: "", email: "" });
    setProjects([]);
  };

  const addProject = async (project: Project): Promise<void> => {
    try {
      const response = await axios.post(`${BASE_URL}/addProject`, project);
      alert(response.data.message);
      getProject(user.email); // Refresh the project list
    } catch (error) {
      console.log(error);
    }
  };

  const getProject = async (email: string): Promise<void> => {
    try {
      const response = await axios.get(`${BASE_URL}/getProject`, { params: { email } });
      setProjects(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    try {
      const response = await axios.delete(`${BASE_URL}/deleteProject`, { params: { id } });
      alert(response.data.message);
      getProject(user.email); // Refresh the project list
    } catch (error) {
      console.log(error);
    }
  };

  const updateProject = async (id: string, updatedProject: Project): Promise<void> => {
    try {
      await axios.put(`${BASE_URL}/updateProject`, updatedProject, { params: { id } });
      getProject(user.email); // Refresh the project list
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ContextApi.Provider
      value={{
        isLoggedIn,
        user,
        register,
        login,
        logout,
        addProject,
        deleteProject,
        updateProject,
        projects,
        setProjects,
      }}
    >
      {children}
    </ContextApi.Provider>
  );
};

export { UserContextProvider };

import React, { useState, useEffect, useContext } from "react";
import { ContextApi } from "../Context/UserContext";




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
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  updateProject: (id: string, updatedProject: Project) => Promise<void>;
}

const Timer: React.FC<{ project: Project }> = ({ project }) => {
  const { setProjects, projects, updateProject } = useContext(ContextApi) as ContextProps;

  const [timeElapsed, setTimeElapsed] = useState<number>(project.time);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: number;
    if (isActive) {
      intervalId = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isActive]);

  const updateProjectStatus = async (status: string, endDate: Date | null = null) => {
    const fetchP = projects.find((item) => item.id === project.id);

    if (fetchP) {
      const updatedProject: Project = {
        ...fetchP,
        status,
        time: timeElapsed,
        endDate,
        startDate: status === "Active" ? new Date() : fetchP.startDate,
      };

      try {
        await updateProject(project.id, updatedProject);
        setProjects((prevProjects) =>
          prevProjects.map((p) =>
            p.id === project.id ? updatedProject : p
          )
        );
      } catch (error) {
        console.error("Failed to update project", error);
      }
    }
  };

  const handleStart = async () => {
    setIsActive(true);
    setIsPaused(false);
    await updateProjectStatus("Active");
  };

  const handleStartPause = async () => {
    setIsActive(!isActive);
    setIsPaused(!isPaused);
    await updateProjectStatus(isPaused ? "Active" : "Pause");
  };

  const handleStop = async () => {
    setIsActive(false);
    setIsPaused(false);
    await updateProjectStatus("stop", new Date());
  };


  const formatTime = (time:number) => {
    const days = Math.floor(time / (60 * 60 * 24));
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${days}D:${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

  return (
    <div className="timer d-flex gap-3">
      <div className="timerCount px-4">{formatTime(timeElapsed)}</div>
      <div className="timerBtn">
        {isActive || isPaused ? (
          <>
            <button className="px-4 py-2 border border-black text-black rounded hover:bg-black hover:text-white" onClick={handleStartPause}>
              {isPaused ? "Continue" : "Pause"}
            </button>
            <button className="px-4 py-2 border border-black text-black rounded hover:bg-black hover:text-white" onClick={handleStop}>
              Stop
            </button>
          </>
        ) : (
          <button className="px-4 py-2 border border-black text-black rounded hover:bg-black hover:text-white startBtn" onClick={handleStart}>
            Start
          </button>
        )}
      </div>
    </div>
  );
};

export default Timer;

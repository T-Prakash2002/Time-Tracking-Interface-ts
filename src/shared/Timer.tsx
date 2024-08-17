import React, { useState, useEffect, useContext } from "react";
import { formatTime } from "./TimeConvert";
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

interface TimerProps {
  project: Project;
}

const Timer: React.FC<TimerProps> = ({ project }) => {
  const { setProjects, projects, updateProject } = useContext(ContextApi);

  const [timeElapsed, setTimeElapsed] = useState<number>(project.time);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isActive) {
      intervalId = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isActive]);

  // Time Start
  const handleStart = async () => {
    setIsActive(true);
    setIsPaused(false);

    const fetchP = projects.find((item) => item.id === project.id);

    if (fetchP) {
      const updateProjectObj = {
        ...fetchP,
        startDate: new Date(),
        status: "Active",
      };
      await updateProject(project.id, updateProjectObj);

      setProjects((prevProjects) =>
        prevProjects.map((p) =>
          p.id === project.id
            ? { ...p, startDate: new Date(), status: "Active" }
            : p
        )
      );
    }
  };

  // Time Pause
  const handleStartPause = async () => {
    setIsActive(!isActive);
    setIsPaused(!isPaused);

    const fetchP = projects.find((item) => item.id === project.id);

    if (fetchP) {
      const updateProjectObj = {
        ...fetchP,
        status: "Pause",
        time: timeElapsed,
      };
      await updateProject(project.id, updateProjectObj);

      setProjects((prevProjects) =>
        prevProjects.map((p) =>
          p.id === project.id
            ? { ...p, status: "Pause", time: timeElapsed }
            : p
        )
      );
    }
  };

  // Time Stop
  const handleStop = async () => {
    setIsActive(false);
    setIsPaused(false);

    const fetchP = projects.find((item) => item.id === project.id);

    if (fetchP) {
      const updateProjectObj = {
        ...fetchP,
        status: "stop",
        time: timeElapsed,
        endDate: new Date(),
      };
      await updateProject(project.id, updateProjectObj);

      setProjects((prevProjects) =>
        prevProjects.map((p) =>
          p.id === project.id
            ? { ...p, time: timeElapsed, endDate: new Date(), status: "stop" }
            : p
        )
      );
    }
  };

  return (
    <div className="timer d-flex gap-3">
      <div className="timerCount px-4">{formatTime(timeElapsed)}</div>
      <div className="timerBtn">
        {isActive || isPaused ? (
          <>
            <button className="btn btn-secondary" onClick={handleStartPause}>
              {isPaused ? "Continue" : "Pause"}
            </button>
            <button className="btn btn-dark" onClick={handleStop}>
              Stop
            </button>
          </>
        ) : (
          <button className="btn startBtn" onClick={handleStart}>
            Start
          </button>
        )}
      </div>
    </div>
  );
};

export default Timer;

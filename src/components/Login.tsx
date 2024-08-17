
import React, { useState, useContext, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ContextApi } from "../Context/UserContext"; // Corrected the typo
import "../Style/register.css"; // Assuming you'll also convert this to Tailwind CSS

interface FormData {
  email: string;
  password: string | number;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: '',
  });

  const { login } = useContext(ContextApi);

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const ApiRes = await login(formData.email, formData.password);

    if (ApiRes === "Login Successful") {
      alert(ApiRes);
      navigate("/");
    } else {
      alert(ApiRes);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
      >
        <sup className="block mb-4 text-gray-700 cursor-pointer">
          <i
            className="bi bi-arrow-left"
            onClick={() => {
              navigate(-1);
            }}
          ></i>
        </sup>
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">LOG IN</h1>
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            minLength={4}
            maxLength={8}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;

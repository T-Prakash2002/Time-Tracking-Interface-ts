import React, { useState, useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { ContextApi } from "../Context/UserContext";
import "../Style/navbar.css";

const Navbar: React.FC = () => {
  const { isLoggedIn,logout } = useContext(ContextApi);
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);

  return (
    <>
      <nav className="bg-gray-800 p-3">
        <div className="container mx-auto flex items-center justify-between">
          <a className="text-white font-bold" href="#">
            <i className="bi bi-hourglass-split"></i> Time Tracking
          </a>
          <button
            className="text-white md:hidden"
            type="button"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="text-xl">&#9776;</span>
          </button>
          <div className="hidden md:flex md:items-center" id="navbarNav">
            <ul className="flex space-x-4">
              <li className="nav-item">
                <Link to="/" className="text-white">
                  Home
                </Link>
              </li>
              {isLoggedIn ? (
                <div className="flex gap-2">
                  <button
                    className="bg-gray-700 text-white py-2 px-4 rounded"
                    onClick={() => {
                      setModal(!modal);
                    }}
                  >
                    Log Out
                  </button>

                  {modal && (
                    <div
                      className="relative z-10"
                      aria-labelledby="modal-title"
                      role="dialog"
                      aria-modal="true"
                    >
                      <div
                        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                        aria-hidden="true"
                      ></div>

                      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                              <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                  <h3
                                    className="text-base font-semibold leading-6 text-gray-900"
                                    id="modal-title"
                                  >
                                    Are you Logout?
                                  </h3>
                                </div>
                              </div>
                            </div>
                            <div className=" px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                              <button
                                type="button"
                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                onClick={() => {
                                  setModal(!modal);
                                  navigate("/");
                                  logout();
                                }}
                              >
                                Log Out
                              </button>
                              <button
                                type="button"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                onClick={() => {
                                  setModal(!modal);
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/register"
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                  >
                    Log In
                  </Link>
                </div>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mx-auto mt-4">
        <Outlet />
      </div>
    </>
  );
};

export default Navbar;

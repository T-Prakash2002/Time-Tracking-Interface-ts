import "./App.css";
import Navbar from "./components/Navbar";
import { UserContextProvider } from "./Context/UserContext"; // Corrected typo

function App() {
  // console.log("App");
  return (
    <>
      <UserContextProvider>
        <Navbar />
      </UserContextProvider>
    </>
  );
}

export default App;

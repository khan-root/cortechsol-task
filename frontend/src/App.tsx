import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Routers from "./Routers/Routers";
import { Toaster } from "./components/Toaster";

function App(){

  const location = useLocation(); 
  return(
    <div className="h-screen w-screen bg-gradient-to-r-custom">
      <Toaster />
      {location.pathname !== "/signin" && location.pathname !== "/register" && <Navbar />}
      <Routers />
    </div>
  )
}

export default App;
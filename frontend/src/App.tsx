// import Register from "./components/Register";
// import Sign from "./components/Sign";
import Navbar from "./components/Navbar";
import Dashboard from "./view/Dashboard/Dashboard";

function App(){
  return(
    <div className="h-screen w-screen bg-gradient-to-r-custom">
      <Navbar />
      <Dashboard />
    </div>
  )
}

export default App;
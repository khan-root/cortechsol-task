import { Routes, Route } from "react-router-dom";

import Dashboard from "../view/Dashboard/Dashboard";
import GuardRoute from "./GuardRoute";
import Sign from "../components/Sign";
import Register from "../components/Register";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<GuardRoute><Dashboard /></GuardRoute>} />
      <Route path="/sign" element={<Sign />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default Routers;
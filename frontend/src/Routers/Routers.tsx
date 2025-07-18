import { Routes, Route } from "react-router-dom";

import Dashboard from "../view/Dashboard/Dashboard";
import GuardRoute from "./GuardRoute";
import GuestRoute from "./GuestRoute";
import Sign from "../components/Sign";
import Register from "../components/Register";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<GuardRoute><Dashboard /></GuardRoute>} />
      <Route path="/sign" element={<GuestRoute><Sign /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
    </Routes>
  );
};

export default Routers;

import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "../view/Dashboard/Dashboard";
import GuardRoute from "./GuardRoute";
import GuestRoute from "./GuestRoute";
import SignIn from "../components/SignIn";
import Register from "../components/Register";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<GuardRoute><Dashboard /></GuardRoute>} />
      <Route path="/signin" element={<GuestRoute><SignIn /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="*" element={<Navigate to="/signin" />} />
    </Routes>
  );
};

export default Routers;

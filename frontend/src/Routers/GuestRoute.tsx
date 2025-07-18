import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/" />; // already logged in, redirect to dashboard
  }
  return children;
};

export default GuestRoute;

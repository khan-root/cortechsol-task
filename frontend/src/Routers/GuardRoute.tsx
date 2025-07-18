import { Navigate } from "react-router-dom";

const GuardRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/sign" />;
  }
  return children;
};

export default GuardRoute;
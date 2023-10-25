import { Navigate, Route, Routes } from "react-router-dom";
import { Login } from "../pages/Login";

export const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      {/* <Route path="register" element={<Register />} /> */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

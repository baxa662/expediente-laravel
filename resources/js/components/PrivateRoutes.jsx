import { Navigate, Route, Routes } from "react-router-dom";
import { Pacientes } from "../pages/ListaPacientes";
import { Paciente } from "../pages/Paciente";
import { Calendario } from "../pages/Calendario";
import AltaUsuarios from "../pages/administrador/AltaUsuarios";
import AltaServicios from "../pages/administrador/AltaServicios";

export const PrivateRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Pacientes />} />
      <Route path="/paciente/:id" element={<Paciente />} />
      <Route path="/calendario" element={<Calendario />} />
      <Route path="/admin/users" element={<AltaUsuarios />} />
      <Route path="/admin/services" element={<AltaServicios />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

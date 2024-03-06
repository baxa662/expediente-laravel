import { Navigate, Route, Routes } from "react-router-dom";
import { Pacientes } from "../pages/ListaPacientes";
import { Paciente } from "../pages/Paciente";
import { Calendario } from "../pages/Calendario";
import AltaUsuarios from "../pages/administrador/AltaUsuarios";
import AltaServicios from "../pages/administrador/AltaServicios";
import PaymentList from "../pages/administrador/PaymentList";

export const PrivateRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Pacientes />} />
      <Route path="/paciente/:id" element={<Paciente />} />
      <Route path="/calendario" element={<Calendario />} />
      <Route path="/admin/users" element={<AltaUsuarios />} />
      <Route path="/admin/services" element={<AltaServicios />} />
      <Route path="/admin/payments" element={<PaymentList />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

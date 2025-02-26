import { Navigate, Route, Routes } from "react-router-dom";
import { Pacientes } from "../pages/ListaPacientes";
import { Paciente } from "../pages/Paciente";
import { Calendario } from "../pages/Calendario";
import AltaUsuarios from "../pages/administrador/AltaUsuarios";
import AltaServicios from "../pages/administrador/AltaServicios";
import PaymentList from "../pages/administrador/PaymentList";
import Ingredients from "../pages/nutricion/alimentos/Ingredients";
import IngredientDetail from "../pages/nutricion/alimentos/IngredientDetail";
import Recipes from "../pages/nutricion/recipes/Recipes";
import RecipeDetail from "../pages/nutricion/recipes/RecipeDetail";

export const PrivateRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Pacientes />} />
      <Route path="/paciente/:id" element={<Paciente />} />
      <Route path="/calendario" element={<Calendario />} />
      <Route path="/admin/users" element={<AltaUsuarios />} />
      <Route path="/admin/services" element={<AltaServicios />} />
      <Route path="/admin/payments" element={<PaymentList />} />
      <Route path="/nutricion/ingredients" element={<Ingredients />} />
      <Route path="/nutricion/ingredients/:id" element={<IngredientDetail />} />
      <Route path="/nutricion/recipes" element={<Recipes />} />
      <Route path="/nutricion/recipes/:id" element={<RecipeDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

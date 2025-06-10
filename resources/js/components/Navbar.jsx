import React from "react";
import { Link } from "react-router-dom";
import LoginServices from "../services/LoginServices";
import DropdownMenu from "./navigation/DropdownMenu";

export const Navbar = ({ clase, idNav }) => {
  const cerraNav = () => {
    const nav = document.getElementById(idNav);
    nav.checked = false;
  };

  const logout = async () => {
    const response = await LoginServices.logout();

    cerraNav.call();
  };

  return (
    <ul className={`${clase} z-50`}>
      {localStorage.getItem("sessionToken") ? (
        <>
          <li>
            <Link to={"/"} onClick={cerraNav}>
              Pacientes
            </Link>
          </li>
          <li>
            <Link to={"/calendario"} onClick={cerraNav}>
              Calendario
            </Link>
          </li>
          {atob(localStorage.getItem("rol")) == 1 && [
            <li>
              <DropdownMenu label={"Administrador"}>
                <li>
                  <Link to={"/admin/users"} onClick={cerraNav}>
                    Usuarios
                  </Link>
                </li>
                <li>
                  <Link to={"/admin/services"} onClick={cerraNav}>
                    Servicios
                  </Link>
                </li>
                <li>
                  <Link to={"/admin/payments"} onClick={cerraNav}>
                    Lista de pagos
                  </Link>
                </li>
              </DropdownMenu>
            </li>,
          ]}
          {atob(localStorage.getItem("rol")) == 1 && [
            <li>
              <DropdownMenu label={"Nutricion"}>
                <li>
                  <Link to={"/nutricion/ingredients"} onClick={cerraNav}>
                    Alimentos
                  </Link>
                </li>
                <li>
                  <Link to={"/nutricion/recipes"} onClick={cerraNav}>
                    Recetas
                  </Link>
                </li>
                <li>
                  <Link to={"/nutricion/diets"} onClick={cerraNav}>
                    Dietas
                  </Link>
                </li>
              </DropdownMenu>
            </li>,
          ]}
          <li className="">
            <Link to={"/login"} onClick={logout}>
              Cerrar Sesión
            </Link>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link to={"/login"} onClick={cerraNav}>
              Iniciar Sesion
            </Link>
          </li>
        </>
      )}
    </ul>
  );
};

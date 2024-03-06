import React from "react";
import { Link } from "react-router-dom";
import LoginServices from "../services/LoginServices";

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
    <ul className={clase}>
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
          {atob(localStorage.getItem("rol")) == 1 && (
            <li>
              <div className="collapse collapse-arrow p-0 grid-cols-1 gap-1">
                <input
                  type="checkbox"
                  name="my-accordion-1"
                  className="min-h-[2rem]"
                />
                <div className="collapse-title w-full py-2 min-h-0">
                  Administrador
                </div>
                <div className="ml-3 collapse-content">
                  <div className="my-2">
                    <Link to={"/admin/users"} onClick={cerraNav}>
                      Usuarios
                    </Link>
                  </div>
                  <div className="my-2">
                    <Link to={"/admin/services"} onClick={cerraNav}>
                      Servicios
                    </Link>
                  </div>
                  <div className="my-2">
                    <Link to={"/admin/payments"} onClick={cerraNav}>
                      Lista de pagos
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          )}
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

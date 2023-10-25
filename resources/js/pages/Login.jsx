import { useState } from "react";
import { useForm } from "react-hook-form";
import { InputForm } from "../components/InputForm";
import LoginServices from "../services/LoginServices";
import { AlertComponent } from "../components/AlertComponent";

export const Login = () => {
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const handleLogin = async (data) => {
    let spinner = document.getElementById("spinner");
    const params = {
      email: data.email,
      password: data.password,
    };
    spinner.classList.remove("hidden");

    const response = await LoginServices.login(params);
    if (response.success) {
      const token = response.token.split(".");
      const tokenAuth = token[1];
      const rol = token[0];
      localStorage.setItem("sessionToken", tokenAuth);
      localStorage.setItem("rol", rol);
      location.reload();
    } else {
      setError("El correo y contraseña no coinciden");
      spinner.classList.add("hidden");
    }
  };

  return (
    <div className="flex justify-center items-center h-[90vh]">
      <div className="card shadow-xl sm:w-2/5 max-sm:w-11/12">
        <div className="card-body">
          <div>
            <p className="text-2xl text-center">Bienvenido</p>
            <p className="text-sm text-center">
              Ingresa tus credenciales para acceder
            </p>
          </div>
          {error && <AlertComponent mensaje={error} type="error" />}
          <form onSubmit={handleSubmit(handleLogin)}>
            <InputForm
              register={register}
              required={true}
              label={"Correo"}
              id={"email"}
              type={"text"}
              errors={errors}
            />
            <InputForm
              register={register}
              required={true}
              label={"Contraseña"}
              errors={errors}
              type={"password"}
              id={"password"}
            />
            <button type="submit" className="btn btn-primary mt-3 w-full">
              <span
                className="loading loading-spinner hidden"
                id="spinner"
              ></span>
              <p className="text-white">Ingresar</p>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

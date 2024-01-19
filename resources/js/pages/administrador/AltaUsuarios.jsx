import { useEffect, useState } from "react";
import { IconButton } from "../../components/IconButton";
import { Modal } from "../../components/Modal";
import UsuarioService from "../../services/UsuarioService";
import { useForm } from "react-hook-form";
import { InputForm } from "../../components/InputForm";
import { SelectInputForm } from "../../components/SelectInputForm";
import { AlertComponent } from "../../components/AlertComponent";

function AltaUsuarios() {
  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(null);
  const [edit, setEdit] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (users == null) {
      getUsers();
    }
  }, [users]);

  const getUsers = async () => {
    const response = await UsuarioService.getUsers();
    if (response) {
      setUsers(response);
    }
  };

  const handleNewUser = () => {
    setEdit(false);
    setError(null);
    reset({
      id: "",
      celNumber: "",
      email: "",
      name: "",
      surname: "",
      password: "",
      rol: 2,
    });
    setOpenModal(true);
  };

  const handleSaveUser = async (data) => {
    let response;
    console.log(data);
    if (data.id) {
      response = await UsuarioService.update(data);
    } else {
      response = await UsuarioService.saveUser(data);
    }
    if (response == true) {
      getUsers();
      setOpenModal(false);
      setError(null);
    } else {
      setError(response);
    }
  };

  const handleEditUser = (user) => {
    setEdit(true);
    setError(null);
    reset({
      id: user.id_usuario,
      celNumber: user.telefono,
      email: user.email,
      name: user.nombre,
      surname: user.apellido,
      rol: user.rolid,
    });
    setOpenModal(true);
  };

  const handleDelteUser = (id) => {
    document.getElementById("idUser").value = id;
    setOpenDelete(true);
  };

  const handleConfirmDelete = () => {
    const id = document.getElementById("idUser").value;
    const response = UsuarioService.destroy(id);
    if (response) {
      getUsers();
      setOpenDelete(false);
    }
  };

  return (
    <div className="container mx-auto mt-5">
      <div className="flex pt-2">
        <div className="flex-1">
          <IconButton
            icon="person_add"
            clase="btn-outline"
            id={"openModal"}
            onclick={handleNewUser}
          />
        </div>
        <div className="form-control flex-none mx-2 w-60">
          <input
            type="text"
            className="input input-bordered w-full max-w-xs input-sm"
            placeholder="Buscar"
            onChange={(event) => null}
          />
        </div>
      </div>
      <div className="overflow-x-auto mt-5">
        <table className="table table-zebra table-sm">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Telefono</th>
              <th>Rol</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users != null
              ? users.map((user, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        {user.nombre} {user.apellido}
                      </td>
                      <td>{user.email}</td>
                      <td>{user.telefono}</td>
                      <td>{user.rol}</td>
                      <td>
                        <div className="flex">
                          <IconButton
                            icon={"edit"}
                            clase={"link-info"}
                            onclick={() => handleEditUser(user)}
                          />
                          <IconButton
                            icon={"delete"}
                            clase={"link-error"}
                            onclick={() => handleDelteUser(user.id_usuario)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
      </div>
      <Modal
        setIsChecked={setOpenModal}
        isChecked={openModal}
        id={"userModal"}
        title={"Usuario"}
      >
        {error != null ? <AlertComponent type={"error"} mensaje={error} /> : ""}
        <form onSubmit={handleSubmit(handleSaveUser)}>
          <InputForm id={"id"} register={register} type={"hidden"} />
          <InputForm
            id={"name"}
            label={"Nombre"}
            errors={errors}
            required={true}
            register={register}
          />
          <InputForm
            id={"surname"}
            label={"Apellido"}
            errors={errors}
            required={true}
            register={register}
          />
          <InputForm
            id={"email"}
            label={"Correo"}
            errors={errors}
            required={true}
            register={register}
          />
          {!edit && (
            <InputForm
              id={"password"}
              label={"Contraseña"}
              errors={errors}
              required={true}
              register={register}
              type={"password"}
            />
          )}
          <InputForm
            id={"celNumber"}
            label={"Numero Celular"}
            errors={errors}
            required={true}
            register={register}
          />
          <SelectInputForm
            register={register}
            required={true}
            label={"Permisos"}
            id={"rol"}
            options={[
              { id: 2, name: "Usuario" },
              { id: 1, name: "Admin" },
            ]}
          />
          <button type="submit" className="btn btn-success w-full mt-3">
            Guardar Usuario
          </button>
        </form>
      </Modal>
      <Modal
        isChecked={openDelete}
        setIsChecked={setOpenDelete}
        id={"deleteModal"}
        title={"Borrar Usuario"}
      >
        <div className="flex flex-col justify-center items-center">
          <i className="material-symbols-outlined text-orange-400 text-8xl">
            warning
          </i>
          <p>Estas seguro de borrar este registro?</p>
          <div className="mt-5">
            <input type="hidden" id="idUser" />
            <a
              className="btn btn-success btn-sm mx-2"
              onClick={() => handleConfirmDelete()}
            >
              Confirmar
            </a>
            <a
              className="btn btn-error btn-sm mx-2"
              onClick={() => setOpenDelete(false)}
            >
              Cancelar
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AltaUsuarios;

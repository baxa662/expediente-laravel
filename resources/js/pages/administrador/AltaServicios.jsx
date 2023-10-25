import { useEffect, useState } from "react";
import { IconButton } from "../../components/IconButton";
import { Modal } from "../../components/Modal";
import { useForm } from "react-hook-form";
import { InputForm } from "../../components/InputForm";
import { SelectInputForm } from "../../components/SelectInputForm";
import { AlertComponent } from "../../components/AlertComponent";
import ServicesService from "../../services/ServicesService";

function AltaServicios() {
  const [openModal, setOpenModal] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(15);
  const [allPages, setAllPages] = useState();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  var time;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (services.length == 0) {
      getservices(limit, offset, query);
    }
  }, [services]);

  const getservices = async (limit, offset, query) => {
    var params = {
      query: query,
      limit: limit,
      offset: offset,
    };
    const response = await ServicesService.getServicios(params);
    if (response) {
      setServices(response.data);
      setPage(response.page);
      setOffset(response.offset);
      setAllPages(response.allPages);
    }
  };

  const handleNewService = () => {
    setError(null);
    reset({
      id: "",
      name: "",
      price: "",
    });
    setOpenModal(true);
  };

  const handleSaveservice = async (data) => {
    let response;
    if (data.id) {
      response = await ServicesService.update(data);
    } else {
      response = await ServicesService.saveService(data);
    }
    if (response == true) {
      getservices(limit, offset, query);
      setOpenModal(false);
      setError(null);
    } else {
      setError(response);
    }
  };

  const handleEditService = (service) => {
    setError(null);
    reset({
      id: service.id_servicio,
      name: service.nombre,
      price: service.costo,
    });
    setOpenModal(true);
  };

  const handleDelteService = (id) => {
    document.getElementById("idService").value = id;
    setOpenDelete(true);
  };

  const handleConfirmDelete = () => {
    const id = document.getElementById("idService").value;
    const response = ServicesService.destroy(id);
    if (response) {
      getservices(limit, offset, query);
      setOpenDelete(false);
    }
  };

  function nextPage() {
    if (page < allPages) {
      var newOffset = offset + limit;
      getservices(limit, newOffset, query);
    }
  }

  function afterPage() {
    if (page > 1) {
      var newOffset = offset - limit;
      getservices(limit, newOffset, query);
    }
  }

  function search(event) {
    var query = event.target.value;
    setOffset(0);
    setQuery(query);
    clearTimeout(time);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      getservices(limit, offset, query);
    }, 1000);
    return () => clearTimeout(timer);
  }, [query, limit, offset]);

  return (
    <div className="container mx-auto my-5">
      <div className="flex pt-2">
        <div className="flex-1">
          <IconButton
            icon="person_add"
            clase="btn-outline"
            id={"openModal"}
            onclick={handleNewService}
          />
        </div>
        <div className="form-control flex-none mx-2 w-60">
          <input
            type="text"
            className="input input-bordered w-full max-w-xs input-sm"
            placeholder="Buscar"
            onChange={(event) => search(event)}
          />
        </div>
      </div>
      <div className="overflow-x-auto mt-5">
        <table className="table table-zebra table-sm">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Costo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {services.length != 0
              ? services.map((service, index) => {
                  return (
                    <tr key={index}>
                      <td>{service.nombre}</td>
                      <td>${service.costo}</td>
                      <td>
                        <div className="flex">
                          <IconButton
                            icon={"edit"}
                            clase={"link-info"}
                            onclick={() => handleEditService(service)}
                          />
                          <IconButton
                            icon={"delete"}
                            clase={"link-error"}
                            onclick={() =>
                              handleDelteService(service.id_servicio)
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
        <div className="flex justify-center mt-4">
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => afterPage()}
            >
              «
            </button>
            <button className="btn btn-sm">Page {page}</button>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => nextPage()}
            >
              »
            </button>
          </div>
        </div>
      </div>
      <Modal
        setIsChecked={setOpenModal}
        isChecked={openModal}
        id={"serviceModal"}
        title={"Servicio"}
      >
        {error != null ? <AlertComponent type={"error"} mensaje={error} /> : ""}
        <form onSubmit={handleSubmit(handleSaveservice)}>
          <InputForm id={"id"} register={register} type={"hidden"} />
          <InputForm
            id={"name"}
            label={"Nombre"}
            errors={errors}
            required={true}
            register={register}
          />
          <InputForm
            id={"price"}
            label={"Precio"}
            errors={errors}
            required={true}
            register={register}
          />
          <button type="submit" className="btn btn-success w-full mt-3">
            Guardar Servicio
          </button>
        </form>
      </Modal>
      <Modal
        isChecked={openDelete}
        setIsChecked={setOpenDelete}
        id={"deleteModal"}
        title={"Borrar Servicio"}
      >
        <div className="flex flex-col justify-center items-center">
          <i className="material-symbols-outlined text-orange-400 text-8xl">
            warning
          </i>
          <p>Estas seguro de borrar este registro?</p>
          <div className="mt-5">
            <input type="hidden" id="idService" />
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

export default AltaServicios;

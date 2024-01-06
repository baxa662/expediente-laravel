import { useState, useEffect } from "react";
import { PacienteRow } from "../components/PacienteRow";
import { IconButton } from "../components/IconButton";
import { Modal } from "../components/Modal";
import { InputForm } from "../components/InputForm";
import { SelectInputForm } from "../components/SelectInputForm";
import { useForm } from "react-hook-form";
import PacienteService from "../services/PacienteService";
import { AlertComponent } from "../components/AlertComponent";

export const Pacientes = () => {
    const [post, setPost] = useState(null);
    const [page, setPage] = useState(1);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(20);
    const [allPages, setAllPages] = useState();
    const [isVisible, setIsVisible] = useState(false);
    const [isVisibleDel, setIsVisibleDel] = useState(false);
    const [query, setQuery] = useState("");
    const [sexos, setSexos] = useState([]);
    const [edoCivil, setEdoCivil] = useState([]);
    const [mensaje, setMensaje] = useState();
    const [mensajeVis, setMensajeVis] = useState("hidden");
    const [isLoading, setIsLoading] = useState(true);
    var time;
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        var params = {
            id: data.id,
            nombres: data.nombre,
            apellidos: data.apellidos,
            sexo: data.sexo,
            alergias: data.alergias,
            antHere: data.antHere,
            antNoPat: data.antNoPat,
            antPat: data.antPat,
            celular: data.celular,
            correo: data.correo,
            edoCivil: data.edoCivil,
            ocupacion: data.ocupacion,
            nacimiento: data.nacimiento,
        };
        var response;
        if (data.id) {
            response = await PacienteService.update(params);
        } else {
            response = await PacienteService.create(params);
        }
        if (response.success) {
            getPacientes(limit, offset, query);
            setMensaje(response.msg);
            setMensajeVis("");
            handleOnChange();
            reset();
            setTimeout(() => {
                setMensajeVis("hidden");
            }, 4000);
        }
    };

    function handleOnChange() {
        setIsVisible(!isVisible);
    }

    useEffect(() => {
        const getUtil = async () => {
            if (sexos.length == 0 && edoCivil.length == 0) {
                const response = await PacienteService.getUtils();
                if (response.sexos) {
                    setSexos(response.sexos.data);
                }
                if (response.edoCivil) {
                    setEdoCivil(response.edoCivil.data);
                }
            }
        };
        getUtil();
    }, [sexos, edoCivil]);

    async function handleDeletePac() {
        const id = document.getElementById("idDel").value;
        const params = {
            id: id,
        };
        const response = await PacienteService.deletePaciente(params);
        if (response) {
            setMensaje(response);
            setIsVisibleDel(!isVisibleDel);
            getPacientes(limit, offset, query);
        } else {
            setMensaje("Ocurrio un error al eliminar");
        }
        setMensajeVis("");
        setTimeout(() => {
            setMensajeVis("hidden");
        }, 4000);
    }

    async function getPacientes(limit, offset, query) {
        setIsLoading(true);
        setPost(null);
        var params = {
            query: query,
            limit: limit,
            offset: offset,
        };
        const response = await PacienteService.getPacientes(params);
        if (response.success) {
            setPost(response.data);
            setPage(response.page);
            setOffset(response.offset);
            setAllPages(response.allPages);
        }
        setIsLoading(false);
    }

    function handleOpenModalDel(id) {
        document.getElementById("idDel").value = id;
        setIsVisibleDel(!isVisibleDel);
    }

    function nextPage() {
        if (page < allPages) {
            var newOffset = offset + limit;
            setOffset(newOffset);
            // getPacientes(limit, newOffset, query);
        }
    }

    function afterPage() {
        if (page > 1) {
            var newOffset = offset - limit;
            setOffset(newOffset);
        }
    }

    function search(event) {
        var query = event.target.value;
        setOffset(0);
        setQuery(query);
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            getPacientes(limit, offset, query);
        }, 1000);
        return () => clearTimeout(timer);
    }, [query, limit, offset]);

    function handleClickNuvPac(data) {
        if (data) {
            setValue("id", data.id);
            setValue("nombre", data.nombres);
            setValue("apellidos", data.apellidos);
            setValue("sexo", data.sexo);
            setValue("edoCivil", data.edo_civil);
            setValue("correo", data.email);
            setValue("nacimiento", data.nacimiento);
            setValue("alergias", data.alergias);
            setValue("antPat", data.ant_pat);
            setValue("antNoPat", data.ant_per_no_pat);
            setValue("antHere", data.ant_here);
            setValue("ocupacion", data.ocupacion);
            setValue("celular", data.numero);
        }
        setIsVisible(!isVisible);
    }

    return (
        <div className="w-4/5 mx-auto my-4 h-screen">
            <div className={mensajeVis}>
                <AlertComponent mensaje={mensaje} />
            </div>
            <div className="container flex items-center px-4 pt-2">
                <div className="flex-1">
                    <IconButton
                        icon="person_add"
                        clase="btn-outline"
                        id={"openModal"}
                        onclick={handleClickNuvPac}
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
            {post != null ? (
                <table className="table w-full my-2 table-zebra table-compact">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Numero</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="overflow-y-auto">
                        {post.map((paciente) => (
                            <PacienteRow
                                data={paciente}
                                edit={handleClickNuvPac}
                                dele={handleOpenModalDel}
                                key={paciente.id}
                            />
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>Nombre</th>
                            <th>Numero</th>
                            <th></th>
                        </tr>
                    </tfoot>
                </table>
            ) : isLoading ? (
                <div className="flex justify-center items-center h-screen">
                    <progress className="progress w-56"></progress>
                </div>
            ) : (
                <h3>Error de conexion</h3>
            )}
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
            <Modal
                id={"nuevoPaciente"}
                isChecked={isVisible}
                setIsChecked={setIsVisible}
                title={"Agregar Paciente"}
                key={"modal"}
            >
                <form action="" onSubmit={handleSubmit(onSubmit)}>
                    <InputForm
                        type={"hidden"}
                        register={register}
                        id="id"
                        required={false}
                        errors={errors}
                    />
                    <InputForm
                        register={register}
                        type="text"
                        label={"Nombre"}
                        id={"nombre"}
                        required={"Este campo es requerido"}
                        errors={errors}
                    />
                    <InputForm
                        register={register}
                        type="text"
                        label={"Apellidos"}
                        id={"apellidos"}
                        required={"Este campo es requerido"}
                        errors={errors}
                    />
                    <SelectInputForm
                        register={register}
                        label={"Sexo"}
                        id={"sexo"}
                        required={false}
                        options={sexos}
                        errors={errors}
                    />
                    <SelectInputForm
                        register={register}
                        label={"Estado Civil"}
                        id={"edoCivil"}
                        options={edoCivil}
                        required={false}
                        errors={errors}
                    />
                    <InputForm
                        register={register}
                        type="text"
                        label={"Ocupación"}
                        id={"ocupacion"}
                        required={false}
                        errors={errors}
                    />
                    <InputForm
                        register={register}
                        type="text"
                        label={"Celular"}
                        id={"celular"}
                        required={false}
                        errors={errors}
                    />
                    <InputForm
                        register={register}
                        type="email"
                        label={"Correo"}
                        id={"correo"}
                        required={false}
                        errors={errors}
                    />
                    <InputForm
                        register={register}
                        type="date"
                        label={"Fecha De Nacimiento"}
                        id={"nacimiento"}
                        required={"Este campo es requerido"}
                        errors={errors}
                    />
                    <InputForm
                        register={register}
                        type="text"
                        label={"Alergias"}
                        id={"alergias"}
                        required={false}
                        errors={errors}
                    />
                    <InputForm
                        register={register}
                        type="text"
                        label={"Antecedentes Patológicos"}
                        id={"antPat"}
                        required={false}
                        errors={errors}
                    />
                    <InputForm
                        register={register}
                        type="text"
                        label={"Antecedentes Personales no Patológicos"}
                        id={"antNoPat"}
                        required={false}
                        errors={errors}
                    />
                    <InputForm
                        register={register}
                        type="text"
                        label={"Antecedentes Hereditarios"}
                        id={"antHere"}
                        required={false}
                        errors={errors}
                    />
                    <div className="mt-4">
                        <input type="submit" className="btn w-full" />
                    </div>
                </form>
            </Modal>

            <Modal
                id={"eliminar"}
                title={"Eliminar Usuario"}
                isChecked={isVisibleDel}
                setIsChecked={setIsVisibleDel}
            >
                <div className="flex flex-col justify-center items-center">
                    <i className="material-symbols-outlined text-orange-400 text-8xl">
                        warning
                    </i>
                    <p>Estas seguro de borrar este paciente?</p>
                    <div className="mt-5">
                        <input type="hidden" id="idDel" />
                        <a
                            className="btn btn-success btn-sm mx-2"
                            onClick={() => handleDeletePac()}
                        >
                            Confirmar
                        </a>
                        <a
                            className="btn btn-error btn-sm mx-2"
                            onClick={() => setIsVisibleDel(!isVisibleDel)}
                        >
                            Cancelar
                        </a>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

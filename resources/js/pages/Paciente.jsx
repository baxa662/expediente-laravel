import { useEffect, useState } from "react";
import { PacienteCard } from "../components/PacienteCard";
import { PacienteToolbar } from "../components/PacienteToolbar";
import { NotaPaciente } from "../components/NotaPaciente";
import { MedidasPaciente } from "../components/MedidasPaciente";
import pacienteService from "../services/PacienteService";
import MedidasService from "../services/MedidasService";
import { useParams } from "react-router-dom";
import { InputForm } from "../components/InputForm";
import NotasServices from "../services/NotasServices";
import { Modal } from "../components/Modal";
import { useForm } from "react-hook-form";
import { AlertComponent } from "../components/AlertComponent";
import { FormMedidasV1 } from "../components/paciente/FormMedidasV1";
import { FormMedidasV2 } from "../components/paciente/FormMedidasV2";

export const Paciente = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [notas, setNotas] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedNota, setIsCheckedNota] = useState(false);
  const [isCheckedNotaDel, setIsCheckedNotaDel] = useState(false);
  const [isCheckedMedDel, setIsCheckedMedDel] = useState(false);
  const [mensaje, setMensaje] = useState();
  const [mensajeVis, setMensajeVis] = useState("hidden");

  var oldValue = 0;
  useEffect(() => {
    if (notas === null) {
      getNotas();
    }
    if (data === null) {
      getDataPaciente();
    }
  }, [data, id]);

  const getDataPaciente = async () => {
    const response = await pacienteService.getPaciente(id);
    setData(response);
  };

  const getNotas = async () => {
    const params = {
      idPaciente: id,
    };
    const response = await NotasServices.getAll(params);
    setNotas(response);
  };

  const {
    register: medRegister,
    handleSubmit: medSubmit,
    setValue: medSetValue,
    reset: medReset,
    formState: { errorsMed },
  } = useForm();

  const {
    register: notaRegister,
    handleSubmit: notaSubmit,
    setValue: notaSetValue,
    reset: notaReset,
    formState: { errorsNota },
  } = useForm();

  const handleOnChange = (idMedida, data) => {
    medReset();
    if (idMedida) {
      medSetValue("id_medidas", idMedida);
      medSetValue("altura", data.altura);
      medSetValue("fecha", data.fecha);
      medSetValue("peso", data.peso);
      medSetValue("imc", data.imc);
      medSetValue("grasa_corporal", data.gc);
      medSetValue("grasa_visceral", data.gv);
      medSetValue("masa_musculoes", data.msc);
      medSetValue("masa_libre", data.masaLibreGrasa);
      medSetValue("tasa_metabolica", data.kcal);
      medSetValue("por_obesidad", data.obesidadPor);
      // medSetValue("edad_corporal", data.ec);
    } else {
      let dateObj = new Date();
      let year = dateObj.getFullYear();
      let month = dateObj.getMonth() + 1;
      let day = dateObj.getDate();

      if (month < 10) {
        month = `0${month}`;
      }

      if (day < 10) {
        day = `0${day}`;
      }

      medSetValue("fecha", `${year}-${month}-${day}`);
    }
    setIsChecked(!isChecked);
  };

  const onSubmit = async (data) => {
    var response = "";
    if (data.id_medidas) {
      response = await MedidasService.update(data);
    } else {
      response = await MedidasService.saveMedida(data);
    }
    if (response == true) {
      getDataPaciente();
      handleOnChange();
      medReset();
    }
  };

  const handleOnChangeNota = (idNota, nota) => {
    if (idNota) {
      notaSetValue("idNota", idNota);
      notaSetValue("nota", nota);
    } else {
      notaSetValue("idNota", "");
      notaSetValue("nota", "");
    }
    setIsCheckedNota(!isCheckedNota);
  };

  const onSubmitNota = async (data) => {
    var response = "";
    if (data.idNota) {
      response = await NotasServices.update(data);
    } else {
      response = await NotasServices.saveNota(data);
    }
    if (response == true) {
      if (data.idNota) {
        document.getElementById(data.idNota).value = data.nota;
      }
      getNotas();
      handleOnChangeNota();
      notaReset({
        nota: "",
        idPaciente: "",
      });
    }
  };

  const handleDeleteNota = async () => {
    const id = document.getElementById("idNotaDel").value;
    const response = await NotasServices.remove(id);
    if (response) {
      getNotas();
      setIsCheckedNotaDel(!isCheckedNotaDel);
      setMensaje(response);
    } else {
      setMensaje("Ocurrio un error al eliminar");
    }
    setMensajeVis("");
    setTimeout(() => {
      setMensajeVis("hidden");
    }, 4000);
  };

  const handleDeleteMed = async () => {
    const id = document.getElementById("idMedDel").value;
    const response = await MedidasService.remove(id);
    if (response) {
      getDataPaciente();
      setIsCheckedMedDel(!isCheckedMedDel);
      setMensaje(response);
    } else {
      setMensaje("Ocurrio un error al eliminar");
    }
    setMensajeVis("");
    setTimeout(() => {
      setMensajeVis("hidden");
    }, 4000);
  };

  const onPressDelNota = (id) => {
    document.getElementById("idNotaDel").value = id;
    setIsCheckedNotaDel(!isCheckedNotaDel);
  };

  const onPressDelMed = (id) => {
    document.getElementById("idMedDel").value = id;
    setIsCheckedMedDel(!isCheckedMedDel);
  };

  return data != null && data != false ? (
    <div className="lg:w-[90vw]" style={{ margin: "0 auto 50px auto" }}>
      <PacienteCard paciente={data.paciente} medida={data.medidas[0]} />
      <PacienteToolbar
        handleOnChange={handleOnChange}
        handleOnChangeNota={handleOnChangeNota}
      />
      <div className={mensajeVis}>
        <AlertComponent mensaje={mensaje} />
      </div>
      <div className="flex gap-2 mt-10 w-full">
        <div className="flex-1 w-1/2">
          <div className="flex gap-2 flex-wrap justify-center">
            {data.medidas.map((e, key) => {
              const html = (
                <div className="flex-initial max-lg:w-56 w-56">
                  <MedidasPaciente
                    data={e}
                    oldValue={oldValue}
                    handleOnChange={handleOnChange}
                    onPresDelMed={onPressDelMed}
                    key={key}
                    edad={data.paciente.edad}
                    idSexo={data.paciente.idSexo}
                  />
                </div>
              );
              oldValue = e.peso;
              return html;
            })}
          </div>
        </div>
        <div className="flex-1 gap-2 w-1/2">
          <div className="flex gap-2 flex-wrap justify-center">
            {notas.map((e, key) => (
              <div className="flex-initial max-lg:w-56 w-56" key={key}>
                <NotaPaciente
                  data={e}
                  handleOnChange={handleOnChangeNota}
                  delNota={onPressDelNota}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        id={"form-medidas"}
        title={"Agregar Medidas"}
        isChecked={isChecked}
        setIsChecked={setIsChecked}
      >
        <FormMedidasV2
          errorsMed={errorsMed}
          idPaciente={data.paciente.id}
          medRegister={medRegister}
          medSubmit={medSubmit}
          onSubmit={onSubmit}
        />
        {/* <FormMedidasV1
          medRegister={medRegister}
          onSubmit={onSubmit}
          errorsMed={errorsMed}
          idPaciente={data.paciente.id}
          medSubmit={medSubmit}
        /> */}
      </Modal>

      <Modal
        id={"form-nota"}
        title={"Agregar Nota"}
        isChecked={isCheckedNota}
        setIsChecked={setIsCheckedNota}
      >
        <form onSubmit={notaSubmit(onSubmitNota)}>
          <InputForm
            id={"id_paciente"}
            type={"hidden"}
            register={notaRegister}
            value={data.paciente.id}
          />
          <InputForm id={"idNota"} type={"hidden"} register={notaRegister} />
          <textarea
            {...notaRegister("nota", {})}
            className="textarea w-full h-full"
            placeholder="Escribe la nota"
            rows={20}
          />
          <div className="sticky bottom-0 bg-white p-1">
            <input type="submit" className="btn w-full" />
          </div>
        </form>
      </Modal>

      <Modal
        isChecked={isCheckedNotaDel}
        setIsChecked={setIsCheckedNotaDel}
        id={"nota-del"}
        title={"Advertencia"}
      >
        <div className="flex flex-col justify-center items-center">
          <i className="material-symbols-outlined text-orange-400 text-8xl">
            warning
          </i>
          <p>Estas seguro de borrar esta nota?</p>
          <div className="mt-5">
            <input type="hidden" id="idNotaDel" />
            <a
              className="btn btn-success btn-sm mx-2"
              onClick={() => handleDeleteNota()}
            >
              Confirmar
            </a>
            <a
              className="btn btn-error btn-sm mx-2"
              onClick={() => setIsCheckedNotaDel(!isCheckedNotaDel)}
            >
              Cancelar
            </a>
          </div>
        </div>
      </Modal>
      <Modal
        isChecked={isCheckedMedDel}
        setIsChecked={setIsCheckedMedDel}
        id={"med-del"}
        title={"Advertencia"}
      >
        <div className="flex flex-col justify-center items-center">
          <i className="material-symbols-outlined text-orange-400 text-8xl">
            warning
          </i>
          <p>Estas seguro de borrar este registro?</p>
          <div className="mt-5">
            <input type="hidden" id="idMedDel" />
            <a
              className="btn btn-success btn-sm mx-2"
              onClick={() => handleDeleteMed()}
            >
              Confirmar
            </a>
            <a
              className="btn btn-error btn-sm mx-2"
              onClick={() => setIsCheckedMedDel(!isCheckedMedDel)}
            >
              Cancelar
            </a>
          </div>
        </div>
      </Modal>
    </div>
  ) : data == false ? (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="">
        <i className="material-symbols-outlined text-5xl">help</i>
      </div>
      <h1 className="text-2xl">El paciente que buscas no ha sido encontrado</h1>
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <progress className="progress w-56"></progress>
    </div>
  );
};

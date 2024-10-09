import React, { useEffect, useRef, useState } from "react";
import CalendarioService from "../services/CalendarioService";
import { IconButton } from "../components/IconButton";
import { Modal } from "../components/Modal";
import { CitaFormComponent } from "../components/CitaFormComponent";
import { useForm } from "react-hook-form";
import { InputForm } from "../components/InputForm";
import { PaymentForm } from "../components/payment/PaymentForm";

export const Calendario = () => {
  var daysMonth = [];
  var totalDays = 42;

  const [citas, setCitas] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [modalCheck, setModalCheck] = useState(false);
  const [citasDay, setCitasDay] = useState(null);
  const [modalCitas, setModalCitas] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [modalReschedule, setModalReschedule] = useState(false);
  const [modalTicket, setModalTicket] = useState(false);
  const [isLoadingTicket, setLoadingTicket] = useState(false);
  const [resumeDate, setResumeDate] = useState(null);
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const selectPacienteRef = useRef();
  const selectServicioRef = useRef();

  const useFormPayment = useForm();

  var date = new Date(year, month, 0).getDate();
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Deciembre",
  ];
  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const {
    register: registerReschedule,
    handleSubmit: handleSubmitReschedule,
    setValue: setValueReschedule,
    reset: resetReschedule,
    formState: formStateSchedule,
  } = useForm();

  useEffect(() => {
    if (citas == null) {
      getCitas(month, year);
    }
  }, [citas, month, year]);

  const getCitas = async (month, year) => {
    var params = {
      idMedico: 1,
      month: month,
      year: year,
    };
    const response = await CalendarioService.getCitas(params);
    setCitas(response);
  };

  for (var day = 1; day <= date; day++) {
    var indice = new Date(year, month - 1, day).getDay();
    if (day == 1 && diasSemana[indice] != diasSemana[0]) {
      var lastDay = new Date(year, month - 1, 0).getDate();
      for (let i = indice - 1; i >= 0; i--) {
        daysMonth.push({
          day: lastDay - i,
          month: month - 1,
        });
      }
    }
    daysMonth.push({
      day: day,
      month: month,
    });
    if (day == date) {
      for (let i = 1; daysMonth.length < totalDays; i++) {
        daysMonth.push({
          day: i,
          month: month + 1,
        });
      }
    }
  }

  const handleOnClickNext = () => {
    setCitas(null);
    var newMonth = month;
    var newYear = year;
    if (newMonth + 1 < 13) {
      newMonth++;
    } else {
      newYear++;
      newMonth = 1;
    }
    setMonth(newMonth);
    setYear(newYear);
    getCitas(newMonth, newYear);
  };

  const handleOnClickBack = () => {
    setCitas(null);
    var newMonth = month;
    var newYear = year;
    if (newMonth - 1 > 0) {
      newMonth--;
    } else {
      newMonth = 12;
      newYear--;
    }
    setMonth(newMonth);
    setYear(newYear);
    getCitas(newMonth, newYear);
  };

  const handleDayClick = async (day, month, year) => {
    setCitasDay(null);
    document.getElementById("dayModal").value = day;
    document.getElementById("monthModal").value = month;
    document.getElementById(
      "titlecitas"
    ).innerHTML = `Citas del dia ${day} de ${meses[month - 1]}`;
    setModalCheck(true);
    const params = {
      day: day,
      month: month,
      year: year,
    };
    const response = await CalendarioService.getCita(params);
    if (response != undefined) {
      setCitasDay(response);
    }
  };

  const handleOnAddCita = () => {
    reset({ fecha: "" }, { keepValues: false });
    selectPacienteRef.current.clearValue();
    selectServicioRef.current.clearValue();
    setModalCitas(!modalCitas);
  };

  const handleClickCancelBtn = (id) => {
    const input = document.getElementById("idCitaCancel");
    input.value = id;
    setModalCancel(!modalCancel);
  };

  const handleCancel = async () => {
    const id = document.getElementById("idCitaCancel").value;
    const day = document.getElementById("dayModal").value;
    const month = document.getElementById("monthModal").value;
    const response = await CalendarioService.cancel(id);
    handleDayClick(day, month, year);
    getCitas(month, year);
    setModalCancel(!modalCancel);
  };

  const handleClickOnEdit = (cita) => {
    resetReschedule(
      { oldDate: "", dateReschedule: "", idCita: "" },
      { keepValues: false }
    );
    console.log(cita);
    setValueReschedule("oldDate", `${cita.fecha} ${cita.hora}`);
    setValueReschedule("idCita", cita.id_cita);
    setModalReschedule(true);
  };

  const submitReschedule = async (obj) => {
    const response = await CalendarioService.update(
      obj.idCita,
      obj.dateReschedule
    );

    if (response) {
      const day = new Date(obj.dateReschedule).getDate();
      const month = document.getElementById("monthModal").value;
      getCitas(month, year);
      handleDayClick(day, month, year);
      setModalReschedule(false);
    }
  };

  const handleClickPayBtn = async (idCita, total) => {
    setLoadingTicket(true);
    setModalTicket(true);
    const response = await CalendarioService.resume(idCita);
    useFormPayment.setValue("idCitaPayment", idCita);
    setResumeDate(response);
    setLoadingTicket(false);
  };

  const toastVisible = (msg) => {
    setToast(true);
    setToastMessage(msg);
    setTimeout(() => {
      setToast(false);
    }, 1500);
  };

  return (
    <div className="w-full h-5/6 lg:max-w-[70vw] mx-auto">
      <div className="flex text-center p-0 m-1 my-2 text-lg">
        <div className="flex-1">
          <IconButton
            icon={"arrow_back_ios"}
            clase={"w-full"}
            onclick={() => handleOnClickBack()}
          />
        </div>
        <div className="flex-1">{meses[month - 1] + " " + year}</div>
        <div className="flex-1">
          <IconButton
            icon={"arrow_forward_ios"}
            clase={"w-full"}
            onclick={() => handleOnClickNext()}
          />
        </div>
        <div className="flex-initial w-28">
          <IconButton
            icon={"add"}
            clase={"w-full"}
            onclick={() => handleOnAddCita()}
          >
            Cita
          </IconButton>
        </div>
      </div>
      {citas != null ? (
        <div className="h-full max-h-96 ">
          <div className="flex text-center">
            <div className="max-md:hidden flex-1 p-1">Domingo</div>
            <div className="max-md:hidden flex-1 p-1">Lunes</div>
            <div className="max-md:hidden flex-1 p-1">Martes</div>
            <div className="max-md:hidden flex-1 p-1">Miercoles</div>
            <div className="max-md:hidden flex-1 p-1">Jueves</div>
            <div className="max-md:hidden flex-1 p-1">Viernes</div>
            <div className="max-md:hidden flex-1 p-1">Sabado</div>
            <div className="sm:hidden flex-1 p-1">Dom</div>
            <div className="sm:hidden flex-1 p-1">Lun</div>
            <div className="sm:hidden flex-1 p-1">Mar</div>
            <div className="sm:hidden flex-1 p-1">Mie</div>
            <div className="sm:hidden flex-1 p-1">Jue</div>
            <div className="sm:hidden flex-1 p-1">Vie</div>
            <div className="sm:hidden flex-1 p-1">Sab</div>
          </div>
          <div className="grid grid-cols-7 grid-rows-6 h-[80vh] max-md:h-[50vh]">
            {daysMonth.map((day, index) => {
              var classDiv =
                "flex-1 p-2 border max-md:text-sm max-md:text-center font-semibold";

              classDiv =
                day.month != month ? classDiv + " text-gray-400" : classDiv;

              var total = citas.find((cita) => {
                return cita.dia == day.day && cita.month == day.month;
              });

              return (
                <div
                  key={index}
                  className={classDiv}
                  onClick={() =>
                    day.month == month
                      ? handleDayClick(day.day, day.month, year)
                      : null
                  }
                >
                  <p>{day.day}</p>
                  <p>{total == undefined ? "" : `${total.total} Citas`}</p>
                </div>
              );
            })}
          </div>
          <Modal
            id={"citas"}
            isChecked={modalCheck}
            setIsChecked={setModalCheck}
            title={"Citas"}
            className={"sm:w-11/12 !max-w-5xl w-full"}
          >
            <div className="overflow-x-auto">
              <input type="hidden" id="dayModal" />
              <input type="hidden" id="monthModal" />
              <table className="table">
                <thead>
                  <tr>
                    <th>Hora</th>
                    <th>Nombre</th>
                    <th>Servicio</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {citasDay != null ? (
                    citasDay.map((cita) => {
                      return (
                        <tr>
                          <td>{cita.hora}</td>
                          <td>{cita.pacientes}</td>
                          <td className="capitalize">{cita.servicio}</td>
                          <td>
                            <div className="flex">
                              <IconButton
                                icon={"attach_money"}
                                clase={"text-success"}
                                onclick={() => handleClickPayBtn(cita.id_cita)}
                              />
                              <IconButton
                                icon={"edit"}
                                clase={"text-info"}
                                onclick={() => handleClickOnEdit(cita)}
                              />
                              <IconButton
                                icon={"delete"}
                                clase={"text-red-600"}
                                onclick={() =>
                                  handleClickCancelBtn(cita.id_cita)
                                }
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <div className="flex justify-center w-full">
                      <span className="loading loading-spinner loading-lg"></span>
                    </div>
                  )}
                </tbody>
              </table>
            </div>
          </Modal>
        </div>
      ) : (
        <div className="flex justify-center w-full h-[80vh] max-md:h-[50vh]">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
      <Modal
        id={"addCita"}
        isChecked={modalCitas}
        setIsChecked={setModalCitas}
        title={"Agregar nueva cita"}
        style={{ overflow: "unset" }}
        r
        className={"rounded"}
      >
        <CitaFormComponent
          onSubmit={() => {
            getCitas(month, year);
            setModalCitas(!modalCitas);
          }}
          handleSubmit={handleSubmit}
          errors={errors}
          register={register}
          reset={reset}
          setValue={setValue}
          selectPacienteRef={selectPacienteRef}
          selectServicioRef={selectServicioRef}
        />
      </Modal>

      <Modal
        isChecked={modalCancel}
        setIsChecked={setModalCancel}
        id={"nota-del"}
        title={"Advertencia"}
      >
        <div className="flex flex-col justify-center items-center">
          <i className="material-symbols-outlined text-orange-400 text-8xl">
            warning
          </i>
          <p>Estas seguro de cancelar esta cita?</p>
          <div className="mt-5">
            <input type="hidden" id="idCitaCancel" />
            <a
              className="btn btn-success btn-sm mx-2"
              onClick={() => handleCancel()}
            >
              Confirmar
            </a>
            <a
              className="btn btn-error btn-sm mx-2"
              onClick={() => setModalCancel(!modalCancel)}
            >
              Cancelar
            </a>
          </div>
        </div>
      </Modal>

      <Modal
        isChecked={modalReschedule}
        setIsChecked={setModalReschedule}
        title={"Reagendar paciente"}
      >
        <form onSubmit={handleSubmitReschedule(submitReschedule)}>
          <InputForm
            id={"idCita"}
            register={registerReschedule}
            type={"hidden"}
          />
          <InputForm
            id={"oldDate"}
            label={"Fecha Actual"}
            register={registerReschedule}
            type={"datetime-local"}
            disabled={true}
            b
          />
          <InputForm
            errors={formStateSchedule.errors}
            required={true}
            id={"dateReschedule"}
            label={"Nueva fecha"}
            register={registerReschedule}
            type={"datetime-local"}
          />
          <input
            className="btn btn-success mt-3 w-full"
            type="submit"
            value="Reagendar"
          />
        </form>
      </Modal>

      <Modal
        id={"ticketModal"}
        title={"Ticket"}
        isChecked={modalTicket}
        setIsChecked={setModalTicket}
      >
        <PaymentForm
          isLoadingTicket={isLoadingTicket}
          resumeDate={resumeDate}
          useFormPayment={useFormPayment}
          setModalPayment={setModalTicket}
          toastVisible={toastVisible}
        />
      </Modal>

      {toast && (
        <div className="toast toast-top toast-end" style={{ zIndex: "9999" }}>
          <div className="alert alert-success">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { IconButton } from "../../components/IconButton";
import PaymentServices from "../../services/PaymentServices";
import { Modal } from "../../components/Modal";
import { PaymentForm } from "../../components/payment/PaymentForm";
import { useForm } from "react-hook-form";
import { InputForm } from "../../components/InputForm";
import { currencyFormatter } from "../../helpers/CurrencyFormatter";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(15);
  const [allPages, setAllPages] = useState();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [modalTicket, setModalTicket] = useState(false);
  const [modalTotal, setModalTotal] = useState(false);
  const [resumeDate, setResumeDate] = useState(null);
  const [totalizacion, setTotalizacion] = useState(null);
  const [isLoadingTicket, setLoadingTicket] = useState(false);
  var time;

  const useFormPayment = useForm();
  const useFormTotal = useForm();

  useEffect(() => {
    if (payments.length == 0) {
      getPayments(limit, offset, query);
    }
  }, [payments]);

  const getPayments = async (limit, offset, query) => {
    var params = {
      query: query,
      limit: limit,
      offset: offset,
    };
    const response = await PaymentServices.get(params);
    if (response) {
      setPayments(response.data);
      setPage(response.page);
      setOffset(response.offset);
      setAllPages(response.allPages);
    }
  };

  const handleClickPayBtn = async (idCita) => {
    setLoadingTicket(true);
    setModalTicket(true);
    const response = await CalendarioService.resume(idCita);
    useFormPayment.setValue("idCitaPayment", idCita);
    setResumeDate(response);
    setLoadingTicket(false);
  };

  const handleTotalizacion = async (data) => {
    const response = await PaymentServices.totalization(data);
    if (response.success) {
      setTotalizacion(response.data);
    }
  };

  function nextPage() {
    if (page < allPages) {
      var newOffset = offset + limit;
      getPayments(limit, newOffset, query);
    }
  }

  function afterPage() {
    if (page > 1) {
      var newOffset = offset - limit;
      getPayments(limit, newOffset, query);
    }
  }

  function search(event) {
    var query = event.target.value;
    setOffset(0);
    setQuery(query);
    clearTimeout(time);
  }

  return (
    <div className="container mx-auto my-5">
      <div className="flex pt-2 justify-evenly">
        <div className="flex-1 flex gap-3">
          <div className="flex-none">
            {/* <IconButton
              icon="payments"
              clase="btn-outline"
              id={"openModal"}
              onclick={handleClickPayBtn}
            /> */}
          </div>
          <div className="flex-none">
            <IconButton
              icon="request_quote"
              clase="btn-outline"
              id={"openModal"}
              onclick={() => setModalTotal(true)}
              children={"Totalizacion"}
            />
          </div>
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
              <th>Fecha Cita</th>
              <th>Fecha Pago</th>
              <th>Total</th>
              <th>Metodo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {payments.length != 0 &&
              payments.map((service, index) => {
                return (
                  <tr key={index}>
                    <td>{service.nombrePaciente}</td>
                    <td>{service.fechaCita}</td>
                    <td>{service.fechaPago}</td>
                    <td>
                      {currencyFormatter({
                        currency: "MXN",
                        value: service.monto,
                      })}
                    </td>
                    <td>{service.metodo}</td>
                    <td>
                      <div className="flex">
                        {/* <IconButton
                          icon={"edit"}
                          clase={"link-info"}
                          // onclick={() => handleEditService(service)}
                        />
                        <IconButton
                          icon={"delete"}
                          clase={"link-error"}
                          // onclick={() =>
                          //   handleDelteService(service.id_servicio)
                          // }
                        /> */}
                      </div>
                    </td>
                  </tr>
                );
              })}
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
        id={"modalTotalizacion"}
        isChecked={modalTotal}
        setIsChecked={setModalTotal}
        title={"Totalizacion"}
      >
        <form
          action=""
          onSubmit={useFormTotal.handleSubmit(handleTotalizacion)}
        >
          <InputForm
            register={useFormTotal.register}
            errors={useFormTotal.formState.errors}
            required={true}
            id={"fechaTotal"}
            label={"Fecha"}
            type={"date"}
          />
          <input
            type="submit"
            className="btn btn-sm btn-success w-full mt-2"
            placeholder="Consultar"
          />
        </form>
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Metodo</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {totalizacion &&
              totalizacion.map((total) => {
                return (
                  <tr>
                    <td>{total.metodo}</td>
                    <td>
                      {currencyFormatter({
                        currency: "MXN",
                        value: total.total,
                      })}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
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
          // toastVisible={toastVisible}
        />
      </Modal>
    </div>
  );
};

export default PaymentList;

import { useEffect, useState } from "react";
import { PaymentResume } from "./PaymentResume";
import { SelectInputForm } from "../SelectInputForm";
import { InputForm } from "../InputForm";
import PaymentMethodsService from "../../services/PaymentMethodsService";
import PaymentServices from "../../services/PaymentServices";

export const PaymentForm = ({
  isLoadingTicket,
  resumeDate,
  useFormPayment,
  setModalPayment,
  toastVisible,
}) => {
  const [paymentMethods, setPaymentMethods] = useState(null);

  const {
    register: registerPayment,
    handleSubmit: handleSubmitPayment,
    setValue: setValuePayment,
    reset: resetPayment,
    formState: { errors },
  } = useFormPayment;

  const submitPayment = async (obj) => {
    const response = await PaymentServices.save(obj);
    if (response) {
      setModalPayment(false);
      toastVisible(response);
    }
  };

  useEffect(() => {
    if (paymentMethods == null) {
      getPaymentMethods();
    }
  }, [paymentMethods]);

  const getPaymentMethods = async () => {
    const response = await PaymentMethodsService.get();
    setPaymentMethods(response);
  };

  return (
    <>
      <PaymentResume isLoading={isLoadingTicket} items={resumeDate} />
      <form onSubmit={handleSubmitPayment(submitPayment)}>
        <InputForm
          id={"idCitaPayment"}
          register={registerPayment}
          type={"hidden"}
        />
        <SelectInputForm
          id={"paymentType"}
          label={"Tipo de pago"}
          register={registerPayment}
          required={true}
          options={paymentMethods ?? []}
        />
        <InputForm
          id={"amount"}
          register={registerPayment}
          label={"Cantidad $"}
          required={true}
          type={"number"}
        />
        <button type="submit" className="btn btn-sm btn-success w-full mt-3">
          Guardar
        </button>
      </form>
    </>
  );
};

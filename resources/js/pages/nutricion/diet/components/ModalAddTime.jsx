import React, { useState } from "react";
import { Modal } from "../../../../components/Modal";
import { IconButton } from "../../../../components/IconButton";
import { useForm } from "react-hook-form";
import { InputForm } from "../../../../components/InputForm";

const ModalAddTime = ({ onSubmitTime }) => {
    const [showed, setShowed] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setIsSaving(true);
        await onSubmitTime(data);
        setShowed(false);
        setIsSaving(false);
    };

    return (
        <>
            <IconButton
                icon="add"
                clase="btn btn-primary"
                onclick={() => setShowed(true)}
            >
                Agregar Tiempo
            </IconButton>

            <Modal
                isChecked={showed}
                setIsChecked={setShowed}
                title="Agregar Tiempo"
            >
                <div className="flex gap-2 mb-4">
                    <IconButton
                        icon="breakfast_dining"
                        clase="btn btn-primary"
                        onclick={() => onSubmit({ name: "Desayuno" })}
                        isLaoding={isSaving}
                    >
                        Agregar Desayuno
                    </IconButton>
                    <IconButton
                        icon="lunch_dining"
                        clase="btn btn-primary"
                        onclick={() => onSubmit({ name: "Almuerzo" })}
                        isLaoding={isSaving}
                    >
                        Agregar Almuerzo
                    </IconButton>
                    <IconButton
                        icon="dinner_dining"
                        clase="btn btn-primary"
                        onclick={() => onSubmit({ name: "Cena" })}
                        isLaoding={isSaving}
                    >
                        Agregar Cena
                    </IconButton>
                </div>
                <div className="text-center mt-4">O crear uno nuevo</div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control">
                        <InputForm
                            register={register}
                            errors={errors}
                            label="Nombre"
                            id="name"
                            required="Este campo es requerido"
                            type="text"
                        />
                    </div>
                    <div className="mt-4">
                        <IconButton
                            icon="add"
                            clase="btn w-full btn-primary"
                            type="submit"
                            isLaoding={isSaving}
                        >
                            Crear
                        </IconButton>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default ModalAddTime;

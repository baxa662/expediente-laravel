import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "../../../../components/Modal";
import DietServices from "../../../../services/DietServices";
import { IconButton } from "../../../../components/IconButton";

const ModalAddDiet = ({ onSaved }) => {
    const { register, handleSubmit, reset } = useForm();
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        const response = await DietServices.create(data);
        onSaved(response);
        reset();
        setLoading(false);
        setModalOpen(false);
    };

    return (
        <>
            <IconButton
                icon={"add"}
                clase={"link-success"}
                onclick={() => setModalOpen(true)}
            />
            <Modal
                isChecked={isModalOpen}
                setIsChecked={setModalOpen}
                id="addDiet"
                title="Agregar Dieta"
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="name">Nombre</label>
                        <input
                            type="text"
                            id="name"
                            {...register("name", { required: true })}
                            className="form-control"
                        />
                    </div>
                    <IconButton
                        icon={"save"}
                        clase={"link-primary mt-2"}
                        type="submit"
                        isLoading={isLoading}
                    >
                        Guardar
                    </IconButton>
                </form>
            </Modal>
        </>
    );
};

export default ModalAddDiet;

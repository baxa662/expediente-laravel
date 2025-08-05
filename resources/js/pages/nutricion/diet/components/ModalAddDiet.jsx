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
                    <div className="input-group">
                        <label htmlFor="name">Nombre: *</label>
                        <input
                            placeholder="Nombre de la dieta"
                            type="text"
                            id="name"
                            {...register("name", { required: true })}
                            className="input input-bordered w-full"
                        />
                    </div>
                    <IconButton
                        icon={"save"}
                        clase={"btn btn-success mt-2 w-full"}
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

export const NotaPaciente = ({ data, handleOnChange, delNota }) => {
  const { nota, fecha_not, id_nota } = data;

  return (
    <div className="shadow-md rounded-md card h-[42rem]">
      <div className="card-actions flex justify-between p-2">
        <div>
          <p>{fecha_not}</p>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-square"
            onClick={() => handleOnChange(id_nota, nota)}
          >
            <i className="material-symbols-outlined">edit</i>
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm text-red-600 btn-square"
            onClick={() => delNota(id_nota)}
          >
            <i className="material-symbols-outlined">delete</i>
          </button>
        </div>
      </div>
      <textarea
        id={id_nota}
        value={nota}
        className="textarea w-full h-full cursor-default"
        placeholder="Escribe la nota"
        readOnly={true}
      />
    </div>
  );
};

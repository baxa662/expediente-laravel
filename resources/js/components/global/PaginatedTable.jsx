import React, { useEffect, useState } from "react";

const PaginatedTable = ({
  headers,
  data,
  itemsPerPage = 10,
  nextPageCallback,
  afterPageCallback,
  totalItems,
  utilsContent,
  search,
  isLoading,
  rowActions,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calcular los índices de los datos actuales para la paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  // Calcular el total de páginas
  const totalPages = Math.ceil((totalItems || data.length) / itemsPerPage);

  // Función para ir a la página anterior
  const afterPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
    if (afterPageCallback) afterPageCallback(newPage);
  };

  // Función para ir a la página siguiente
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    if (nextPageCallback) nextPageCallback(newPage);
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="container flex items-center px-4 pt-2">
        <div className="flex-1" name={"iconos"}>
          {utilsContent}
        </div>
        <div className="form-control flex-none mx-2 w-60">
          <input
            type="text"
            className="input input-bordered w-full max-w-xs input-sm"
            placeholder="Buscar"
            onChange={(event) => search(event.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <progress className="progress w-56"></progress>
        </div>
      ) : (
        <table className="table w-full my-2 table-zebra table-compact">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(row).map((value, colIndex) => (
                  <td key={colIndex}>
                    {typeof value === "object" &&
                    value !== null &&
                    value.type === "image" ? (
                      <img
                        src={URL.createObjectURL(value.file)}
                        alt="alimento"
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      value
                    )}
                  </td>
                ))}
                {/* Botones de acciones por fila */}
                {rowActions && <td>{rowActions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Paginador */}
      {isLoading ? null : (
        <div className="flex justify-center mt-4">
          <div className="btn-group">
            <button
              type="button"
              className="btn btn-sm"
              onClick={afterPage}
              disabled={currentPage === 1} // Deshabilitar si es la primera página
            >
              «
            </button>
            <button className="btn btn-sm">Page {currentPage}</button>
            <button
              type="button"
              className="btn btn-sm"
              onClick={nextPage}
              disabled={currentPage === totalPages} // Deshabilitar si es la última página
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginatedTable;

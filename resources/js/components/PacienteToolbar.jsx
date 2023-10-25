import React, { useRef } from "react";
import { useState } from "react";

export const PacienteToolbar = ({ handleOnChange, handleOnChangeNota }) => {
  return (
    <div>
      <div className="card sm:w-auto shadow-md mt-2">
        <div className="p-2">
          <div className="flex justify-center">
            <div className="flex-auto flex items-center justify-center">
              <a
                onClick={() => handleOnChange()}
                className="btn btn-sm btn-primary"
              >
                <i className="material-symbols-outlined">playlist_add</i>
              </a>
            </div>
            <div className="flex-auto flex items-center justify-center">
              <a
                onClick={() => handleOnChangeNota()}
                className="btn btn-sm btn-primary"
              >
                <i className="material-symbols-outlined">post_add</i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

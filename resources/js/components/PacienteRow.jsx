import React from "react";
import { DropdownButton } from "./DropdownButton";
import { IconButton } from "./IconButton";

export const PacienteRow = ({ data, edit, dele }) => {
  const { id, nombresCom, numero, key } = data;

  return (
    <tr key={key}>
      <td className="py-0 whitespace-normal">{nombresCom}</td>
      <td className="py-0">
        {numero == null || numero == "" ? "S/N" : numero}
      </td>
      <td className="py-0">
        <div className="flex max-sm:hidden">
          <IconButton
            clase="link-primary"
            icon="description"
            ruta={`/paciente/${id}`}
          />
          <IconButton
            clase="link-info"
            icon="edit"
            onclick={() => edit(data)}
          />
          <IconButton
            clase="link-error"
            icon="delete"
            onclick={() => dele(id)}
          />
        </div>
        <DropdownButton
          icon={"more_vert"}
          claseBtn={"btn-sm btn-ghost btn-square"}
          claseDrop={"sm:hidden"}
        >
          <IconButton
            clase="link-primary"
            icon="description"
            ruta={`/paciente/${id}`}
          />
          <IconButton
            clase="link-accent"
            icon="edit"
            onclick={() => edit(data)}
          />
          <IconButton
            clase="link-error"
            icon="delete"
            onclick={() => dele(id)}
          />
        </DropdownButton>
      </td>
    </tr>
  );
};

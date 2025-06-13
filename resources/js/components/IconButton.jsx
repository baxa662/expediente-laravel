import React from "react";

export const IconButton = ({
    clase,
    icon,
    ruta,
    id,
    onclick,
    children,
    isLoading,
    type,
}) => {
    if (!children) {
        clase = clase + " btn-square btn-ghost";
    }

    const getBody = () => {
        return (
            <div className="flex justify-center gap-1 items-center">
                {isLoading && <span className="loading loading-spinner"></span>}
                {icon && <i className="material-symbols-outlined">{icon}</i>}
                {children && <div>{children}</div>}
            </div>
        );
    };

    return (
        <div>
            {ruta ? (
                <a
                    className={"btn btn-sm " + clase}
                    href={ruta}
                    id={id}
                    onClick={onclick}
                    type={type}
                >
                    {getBody()}
                </a>
            ) : (
                <button
                    className={"btn btn-sm " + clase}
                    id={id}
                    onClick={onclick}
                    disabled={isLoading}
                    type={type}
                >
                    {getBody()}
                </button>
            )}
        </div>
    );
};

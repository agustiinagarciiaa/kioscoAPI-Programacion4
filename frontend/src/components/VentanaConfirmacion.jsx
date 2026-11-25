
import { useEffect } from "react";

// Ventana para confirmar una acción (por ejemplo, eliminar).
// Reemplaza al window.confirm del navegador con el estilo de la página.
function VentanaConfirmacion({
    titulo,
    children,
    textoConfirmar = "Eliminar",
    procesando = false,
    onConfirmar,
    onCancelar
}) {
    // Escape cancela, igual que en las otras ventanas.
    useEffect(() => {
        const manejarTecla = (e) => {
            if (e.key === "Escape" && !procesando) {
                onCancelar();
            }
        };

        window.addEventListener("keydown", manejarTecla);

        return () => window.removeEventListener("keydown", manejarTecla);
    }, [onCancelar, procesando]);

    return (
        <div className="modal-fondo" onClick={procesando ? undefined : onCancelar}>
            <div
                className="modal-ventana modal-confirmacion"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="tituloConfirmacion"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="icono-confirmacion" aria-hidden="true">!</div>

                <h2 id="tituloConfirmacion">{titulo}</h2>

                <div className="texto-confirmacion">{children}</div>

                <div className="acciones-confirmacion">
                    <button
                        type="button"
                        className="boton-cancelar"
                        onClick={onCancelar}
                        disabled={procesando}
                        autoFocus
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        className="boton-peligro"
                        onClick={onConfirmar}
                        disabled={procesando}
                    >
                        {procesando ? "Eliminando..." : textoConfirmar}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VentanaConfirmacion;

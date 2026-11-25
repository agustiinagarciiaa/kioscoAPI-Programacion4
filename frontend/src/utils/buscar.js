// ==========================================
// BÚSQUEDA POR PALABRA
// ==========================================

// Pasamos el texto a minúsculas y le sacamos los acentos,
// así "categoria" encuentra "Categoría".
const normalizar = (texto) =>
    String(texto ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

// Devolvemos true si todas las palabras buscadas aparecen
// en alguno de los campos indicados.
export const coincideBusqueda = (busqueda, campos) => {
    const palabras = normalizar(busqueda).split(/\s+/).filter(Boolean);

    if (palabras.length === 0) return true;

    const texto = normalizar(campos.join(" "));

    return palabras.every((palabra) => texto.includes(palabra));
};

function normalizarTextoLaudo(valor) {
    if (valor === undefined || valor === null) {
        return valor;
    }

    return String(valor)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toUpperCase();
}

module.exports = normalizarTextoLaudo;

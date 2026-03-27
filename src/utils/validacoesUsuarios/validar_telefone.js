function validarTelefone(telefone) {
    const telefoneSemMascara = telefone.replace(/\D/g, '');
    return /^(\d{2})9\d{8}$/.test(telefoneSemMascara);
}

module.exports = validarTelefone;
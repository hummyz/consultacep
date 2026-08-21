const frmCep = document.getElementById('frmCep');
const statusEl = document.getElementById('status');

function setStatus(message, type = '') {
    statusEl.textContent = message;
    statusEl.className = `status ${type}`.trim();
}

function limparTela() {
    frmCep.reset();
    setStatus('');
    document.getElementById('cep').focus();
}

function consultarCep(event) {
    event.preventDefault();

    const cepDigitado = frmCep.cep.value.replace(/\D/g, '');

    if (!cepDigitado) {
        setStatus('Digite um CEP para continuar.', 'erro');
        frmCep.cep.focus();
        return;
    }

    if (cepDigitado.length !== 8) {
        setStatus('CEP inválido. Digite 8 números.', 'erro');
        frmCep.cep.focus();
        return;
    }

    const url = `https://viacep.com.br/ws/${cepDigitado}/json/`;

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Erro na resposta da API');
            }

            return response.json();
        })
        .then((res) => {
            if (res.erro) {
                setStatus('CEP não encontrado. Verifique o número informado.', 'erro');
                limparTela();
                return;
            }

            frmCep.logradouro.value = res.logradouro || '';
            frmCep.bairro.value = res.bairro || '';
            frmCep.cidade.value = res.localidade || '';
            frmCep.estado.value = res.uf || '';
            setStatus('CEP encontrado com sucesso!', 'sucesso');
        })
        .catch((error) => {
            console.error('Erro ao consultar CEP:', error);
            setStatus('Não foi possível consultar o CEP. Tente novamente.', 'erro');
        });
}

frmCep.addEventListener('submit', consultarCep);
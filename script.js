// Dados dos produtos
let produtos = [];

// Carregar dados dos produtos do arquivo JSON
fetch('./dados/produtos.json')
    .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Produtos carregados:', data.produtos.length);
        produtos = data.produtos;
        carregarProdutos();
        configurarFiltros(); // Adiciona configuração dos filtros após carregar produtos
    })
    .catch(error => console.error('Erro ao carregar os produtos:', error));

// Função para carregar produtos dinamicamente
function carregarProdutos(listaProdutos = produtos) {
    const container = document.querySelector('.gifts-section');
    
    if (!container) {
        console.error('Container .gifts-section não encontrado');
        return;
    }

    // Limpa o container
    container.innerHTML = '';

    // Gera os cards com a lista fornecida (filtrada ou completa)
    listaProdutos.forEach(produto => {
        const cardHTML = `
            <div class="card-gift" data-produto-id="${produto.id}">
                <img src="${produto.imagem}" alt="${produto.nome}" class="card-image" onerror="this.src='images/placeholder.svg'">
                <div class="card-content">
                    <h3>${produto.nome}</h3>
                    <button class="btn-marcar" onclick="abrirModal(${produto.id})">Marcar para presentear</button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// Função para configurar os filtros
function configurarFiltros() {
    const filterButtons = document.querySelectorAll('.main_gifts_btns_btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterText = button.textContent.trim();
            
            // Remove classe ativa de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('ativo'));
            // Adiciona classe ativa ao botão clicado
            button.classList.add('ativo');
            
            filtrarProdutos(filterText);
        });
    });
}

// Função para filtrar produtos
function filtrarProdutos(categoria) {
    let produtosFiltrados;
    
    // Mapeia o texto do botão para a categoria no JSON
    const mapeamentoCategoria = {
        'Sala': 'sala',
        'Cozinha': 'cozinha', 
        'Quarto': 'quarto',
        'Banheiro': 'banheiro'
    };
    
    const categoriaMinuscula = mapeamentoCategoria[categoria];
    
    if (categoriaMinuscula) {
        produtosFiltrados = produtos.filter(produto => 
            produto.categoria.toLowerCase() === categoriaMinuscula
        );
    } else {
        produtosFiltrados = produtos; // Fallback para mostrar todos
    }
    
    // Chama a função correta para gerar os cards
    carregarProdutos(produtosFiltrados);
}

// Função para abrir o modal
function abrirModal(produtoId) {
    const produto = produtos.find(p => p.id == produtoId);
    
    if (!produto) {
        console.error('Produto não encontrado');
        return;
    }

    // Preenche os dados do modal
    document.getElementById('modal-produto-imagem').src = produto.imagem;
    document.getElementById('modal-produto-nome').textContent = produto.nome;
    document.getElementById('modal-produto-descricao').textContent = produto.descricao;
    document.getElementById('produto-id').value = produto.id;

    // Exibe o modal
    document.getElementById('modal-produto').style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Impede scroll da página
}

// Função para fechar o modal
function fecharModal() {
    document.getElementById('modal-produto').style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaura scroll da página
    
    // Limpa o formulário
    document.getElementById('form-presente').reset();
    limparErros();
}

// Validação de telefone brasileiro
function validarTelefone(telefone) {
    // Remove espaços, parênteses e traços
    const telefoneNumeros = telefone.replace(/\D/g, '');
    
    // Regex para telefone brasileiro: (11) 99999-9999 ou 11999999999
    const regexTelefone = /^(\d{2})(\d{4,5})(\d{4})$/;
    
    return regexTelefone.test(telefoneNumeros);
}

// Função para formatar telefone enquanto digita
function formatarTelefone(input) {
    let valor = input.value.replace(/\D/g, '');
    
    if (valor.length <= 11) {
        valor = valor.replace(/^(\d{2})(\d{0,5})(\d{0,4}).*/, (match, p1, p2, p3) => {
            let resultado = `(${p1})`;
            if (p2) resultado += ` ${p2}`;
            if (p3) resultado += `-${p3}`;
            return resultado;
        });
    }
    
    input.value = valor;
}

// Função para mostrar erro de validação
function mostrarErro(campo, mensagem) {
    const erro = document.getElementById(`erro-${campo}`);
    if (erro) {
        erro.textContent = mensagem;
        erro.style.display = 'block';
    }
}

// Função para limpar erros
function limparErros() {
    const erros = document.querySelectorAll('.erro-validacao');
    erros.forEach(erro => {
        erro.style.display = 'none';
        erro.textContent = '';
    });
}

// Função para enviar formulário
function enviarFormulario(event) {
    event.preventDefault();
    
    // Limpa erros anteriores
    limparErros();
    
    // Obtém os dados do formulário
    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const produtoId = document.getElementById('produto-id').value;
    
    let temErro = false;
    
    // Validação do nome
    if (!nome || nome.length < 2) {
        mostrarErro('nome', 'Nome deve ter pelo menos 2 caracteres');
        temErro = true;
    }
    
    // Validação do telefone
    if (!telefone) {
        mostrarErro('telefone', 'Telefone é obrigatório');
        temErro = true;
    } else if (!validarTelefone(telefone)) {
        mostrarErro('telefone', 'Formato inválido. Use: (11) 99999-9999');
        temErro = true;
    }
    
    // Se não há erros, processa o envio
    if (!temErro) {
        const produto = produtos.find(p => p.id == produtoId);
        
        // Aqui você pode implementar o envio para um servidor
        alert(`Obrigado ${nome}! Você marcou o presente "${produto.nome}". Entraremos em contato pelo telefone ${telefone}.`);
        
        fecharModal();
    }
}

// Inicialização quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners para o modal
    document.getElementById('telefone').addEventListener('input', function() {
        formatarTelefone(this);
    });
    
    // Fechar modal ao clicar fora dele
    document.getElementById('modal-produto').addEventListener('click', function(e) {
        if (e.target === this) {
            fecharModal();
        }
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            fecharModal();
        }
    });
});

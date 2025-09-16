// Dados dos produtos
const produtos = [
    {
        id: 1,
        nome: "Panela de Pressão",
        descricao: "Panela de pressão 5 litros em alumínio, ideal para cozinhar feijão, carnes e legumes de forma rápida e prática.",
        imagem: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSvyOG7WTEvsAYiRLlpermcdhSqPYKv_Q_4wuAGNHfHg7EYx5wHIA0qF3ekSoig7chah19X1QQUfZxOhId56nQE8L1vuPaMCHLqzm4XaaoTdsdS_RSB8nOf",
        categoria: "cozinha"
    },
    {
        id: 2,
        nome: "Jogo de Talheres",
        descricao: "Conjunto completo com 42 peças em aço inox, incluindo garfos, facas, colheres e utensílios de servir.",
        imagem: "images/talheres.jpg",
        categoria: "cozinha"
    },
    {
        id: 3,
        nome: "Sofá 3 Lugares",
        descricao: "Sofá confortável de 3 lugares em tecido suede, cor cinza, perfeito para a sala de estar.",
        imagem: "images/sofa.jpg",
        categoria: "sala"
    },
    {
        id: 4,
        nome: "Jogo de Lençol",
        descricao: "Jogo de lençol casal 100% algodão, com 4 peças: lençol, lençol elástico e 2 fronhas.",
        imagem: "images/lencol.jpg",
        categoria: "quarto"
    },
    {
        id: 5,
        nome: "Toalha de Banho",
        descricao: "Kit com 4 toalhas de banho em algodão, macias e absorventes, cores neutras.",
        imagem: "images/toalha.jpg",
        categoria: "banheiro"
    },
    {
        id: 6,
        nome: "Liquidificador",
        descricao: "Liquidificador potente com copo de vidro de 2 litros, 12 velocidades e função pulsar.",
        imagem: "images/liquidificador.jpg",
        categoria: "cozinha"
    }
];

// Função para carregar produtos dinamicamente
function carregarProdutos() {
    const container = document.querySelector('.gifts-section');
    
    if (!container) {
        console.error('Container .gifts-section não encontrado');
        return;
    }

    // Limpa o container
    container.innerHTML = '';

    // Gera os cards
    produtos.forEach(produto => {
        const cardHTML = `
            <div class="card-gift" data-produto-id="${produto.id}">
                <img src="${produto.imagem}" alt="${produto.nome}" class="card-image" onerror="this.src='images/placeholder.jpg'">
                <div class="card-content">
                    <h3>${produto.nome}</h3>
                    <button class="btn-marcar" onclick="abrirModal(${produto.id})">Marcar para presentear</button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// Função para abrir o modal
function abrirModal(produtoId) {
    const produto = produtos.find(p => p.id === produtoId);
    
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
    carregarProdutos();
    
    // Event listeners
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
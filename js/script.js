// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAvk1z-_nRq_3c_7HAyq_6-fKfQtlbYP30",
    authDomain: "gestao-micten.firebaseapp.com",
    databaseURL: "https://gestao-micten-default-rtdb.firebaseio.com",
    projectId: "gestao-micten",
    storageBucket: "gestao-micten.appspot.com",
    messagingSenderId: "126181556759",
    appId: "1:126181556759:web:eabcacb0cd5bf90fb3d252",
    measurementId: "G-8YDQJ2N5VS"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Variáveis globais
let produtos = [];
let vendas = [];
let currentUser = null;

// Dados de exemplo para demonstração (caso Firebase não esteja disponível)
const produtosExemplo = [
    { id: 1, nome: "Banana Prata", categoria: "hortifruti", preco: 4.50, quantidade: 50, descricao: "Bananas frescas e doces, ideais para vitaminas e lanches" },
    { id: 2, nome: "Pão Francês", categoria: "padaria", preco: 0.75, quantidade: 100, descricao: "Pão francês fresquinho, assado diariamente" },
    { id: 3, nome: "Leite Integral", categoria: "laticinios", preco: 4.20, quantidade: 30, descricao: "Leite integral 1L, rico em cálcio e proteínas" },
    { id: 4, nome: "Refrigerante Cola", categoria: "bebidas", preco: 5.50, quantidade: 25, descricao: "Refrigerante cola 2L, gelado e refrescante" },
    { id: 5, nome: "Detergente", categoria: "limpeza", preco: 2.80, quantidade: 40, descricao: "Detergente neutro para louças, 500ml" }
];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Verificar se há usuário logado
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            currentUser = user;
            showMainSite();
            loadProdutos();
        } else {
            showAuthScreen();
        }
    });

    // Event listeners
    setupEventListeners();
}

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });

    // Tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', handleTabSwitch);
    });

    // Search
    const searchInput = document.getElementById('buscar-produto');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Contact form
    const contactForm = document.getElementById('contato-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}

// Autenticação
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            Swal.fire({
                title: 'Sucesso!',
                text: 'Login realizado com sucesso!',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        })
        .catch(error => {
            Swal.fire({
                title: 'Erro!',
                text: getErrorMessage(error.code),
                icon: 'error'
            });
        });
}

function mostrarRegistro() {
    Swal.fire({
        title: 'Registrar Novo Usuário',
        html: `
            <input id="swal-email" class="swal2-input" placeholder="Email" type="email">
            <input id="swal-senha" class="swal2-input" placeholder="Senha" type="password">
            <input id="swal-confirmar" class="swal2-input" placeholder="Confirmar Senha" type="password">
        `,
        showCancelButton: true,
        confirmButtonText: 'Registrar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const email = document.getElementById('swal-email').value;
            const senha = document.getElementById('swal-senha').value;
            const confirmar = document.getElementById('swal-confirmar').value;

            if (!email || !senha || !confirmar) {
                Swal.showValidationMessage('Todos os campos são obrigatórios');
                return false;
            }

            if (senha !== confirmar) {
                Swal.showValidationMessage('As senhas não coincidem');
                return false;
            }

            if (senha.length < 6) {
                Swal.showValidationMessage('A senha deve ter pelo menos 6 caracteres');
                return false;
            }

            return firebase.auth().createUserWithEmailAndPassword(email, senha)
                .then(() => {
                    Swal.fire('Sucesso!', 'Conta criada com sucesso!', 'success');
                })
                .catch(error => {
                    Swal.fire('Erro!', getErrorMessage(error.code), 'error');
                });
        }
    });
}

function recuperarSenha() {
    Swal.fire({
        title: 'Recuperar Senha',
        input: 'email',
        inputLabel: 'Digite seu email',
        inputPlaceholder: 'seu@email.com',
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar'
    }).then(result => {
        if (result.isConfirmed && result.value) {
            firebase.auth().sendPasswordResetEmail(result.value)
                .then(() => {
                    Swal.fire('Enviado!', 'Verifique seu email para redefinir a senha.', 'success');
                })
                .catch(error => {
                    Swal.fire('Erro!', getErrorMessage(error.code), 'error');
                });
        }
    });
}

function logout() {
    Swal.fire({
        title: 'Sair do sistema?',
        text: 'Você será desconectado',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim, sair',
        cancelButtonText: 'Cancelar'
    }).then(result => {
        if (result.isConfirmed) {
            firebase.auth().signOut().then(() => {
                location.reload();
            });
        }
    });
}

function getErrorMessage(errorCode) {
    const messages = {
        'auth/user-not-found': 'Usuário não encontrado',
        'auth/wrong-password': 'Senha incorreta',
        'auth/email-already-in-use': 'Este email já está em uso',
        'auth/weak-password': 'A senha é muito fraca',
        'auth/invalid-email': 'Email inválido',
        'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde'
    };
    return messages[errorCode] || 'Erro desconhecido';
}

// Interface
function showAuthScreen() {
    document.getElementById('auth-screen').style.display = 'flex';
    document.getElementById('main-site').style.display = 'none';
}

function showMainSite() {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('main-site').style.display = 'block';
    showSection('inicio');
    updateStats();
}

function handleNavigation(e) {
    e.preventDefault();
    const section = e.target.getAttribute('data-section');
    showSection(section);
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    e.target.classList.add('active');
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Load section-specific content
    switch(sectionName) {
        case 'produtos':
            renderProdutos();
            break;
        case 'admin':
            loadAdminData();
            break;
    }
}

// Produtos
function loadProdutos() {
    // Tentar carregar do Firebase primeiro
    firebase.database().ref('produtos').once('value')
        .then(snapshot => {
            const firebaseProdutos = snapshot.val();
            if (firebaseProdutos) {
                produtos = Object.keys(firebaseProdutos).map(key => ({
                    id: key,
                    ...firebaseProdutos[key]
                }));
            } else {
                // Usar dados de exemplo se Firebase estiver vazio
                produtos = [...produtosExemplo];
                // Salvar dados de exemplo no Firebase
                produtos.forEach(produto => {
                    firebase.database().ref('produtos/' + produto.id).set({
                        nome: produto.nome,
                        categoria: produto.categoria,
                        preco: produto.preco,
                        quantidade: produto.quantidade,
                        descricao: produto.descricao
                    });
                });
            }
            updateStats();
            renderProdutos();
        })
        .catch(error => {
            console.log('Erro ao carregar do Firebase, usando dados locais:', error);
            produtos = [...produtosExemplo];
            updateStats();
            renderProdutos();
        });
}

function renderProdutos(filteredProdutos = null) {
    const grid = document.getElementById('produtos-grid');
    if (!grid) return;

    const produtosToRender = filteredProdutos || produtos;
    grid.innerHTML = '';

    produtosToRender.forEach((produto, index) => {
        const card = createProdutoCard(produto, index);
        grid.appendChild(card);
    });
}

function createProdutoCard(produto, index) {
    const card = document.createElement('div');
    card.className = 'produto-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const imagemPlaceholder = getImagePlaceholder(produto.categoria);
    
    card.innerHTML = `
        <img src="${imagemPlaceholder}" alt="${produto.nome}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDI4MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik0xNDAgMTAwQzE0MCA4Ni43NDUyIDEyOS4yNTUgNzYgMTE2IDc2QzEwMi43NDUgNzYgOTIgODYuNzQ1MiA5MiAxMDBDOTIgMTEzLjI1NSAxMDIuNzQ1IDEyNCAxMTYgMTI0QzEyOS4yNTUgMTI0IDE0MCAxMTMuMjU1IDE0MCAxMDBaIiBmaWxsPSIjRTBFMEUwIi8+CjxwYXRoIGQ9Ik0xODggMTAwQzE4OCA4Ni43NDUyIDE3Ny4yNTUgNzYgMTY0IDc2QzE1MC43NDUgNzYgMTQwIDg2Ljc0NTIgMTQwIDEwMEMxNDAgMTEzLjI1NSAxNTAuNzQ1IDEyNCAxNjQgMTI0QzE3Ny4yNTUgMTI0IDE4OCAxMTMuMjU1IDE4OCAxMDBaIiBmaWxsPSIjRTBFMEUwIi8+Cjwvc3ZnPgo='">
        <div class="produto-info">
            <h3>${produto.nome}</h3>
            <span class="produto-categoria">${getCategoriaLabel(produto.categoria)}</span>
            <div class="produto-preco">MZN ${produto.preco.toFixed(2)}</div>
            <div class="produto-estoque">Estoque: ${produto.quantidade} unidades</div>
            <p>${produto.descricao}</p>
        </div>
    `;
    
    return card;
}

function getImagePlaceholder(categoria) {
    const placeholders = {
        hortifruti: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDI4MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iMjAwIiBmaWxsPSIjYTdjOTU3Ii8+CjxjaXJjbGUgY3g9IjE0MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSIxNDAiIHk9IjEwNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Ib3J0aWZydXRpPC90ZXh0Pgo8L3N2Zz4K',
        padaria: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDI4MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZGViODg3Ii8+CjxjaXJjbGUgY3g9IjE0MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSIxNDAiIHk9IjEwNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QYWRhcmlhPC90ZXh0Pgo8L3N2Zz4K',
        laticinios: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDI4MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjJlOGNmIi8+CjxjaXJjbGUgY3g9IjE0MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSIxNDAiIHk9IjEwNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2NjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5MYXRpY8OtbmlvczwvdGV4dD4KPC9zdmc+Cg==',
        bebidas: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDI4MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNGE3YzU5Ii8+CjxjaXJjbGUgY3g9IjE0MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSIxNDAiIHk9IjEwNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CZWJpZGFzPC90ZXh0Pgo8L3N2Zz4K',
        limpeza: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDI4MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iMjAwIiBmaWxsPSIjN2ZiMDY5Ii8+CjxjaXJjbGUgY3g9IjE0MCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMyIvPgo8dGV4dCB4PSIxNDAiIHk9IjEwNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjZmZmZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5MaW1wZXphPC90ZXh0Pgo8L3N2Zz4K'
    };
    return placeholders[categoria] || placeholders.hortifruti;
}

function getCategoriaLabel(categoria) {
    const labels = {
        hortifruti: 'Hortifruti',
        padaria: 'Padaria',
        laticinios: 'Laticínios',
        bebidas: 'Bebidas',
        limpeza: 'Limpeza'
    };
    return labels[categoria] || categoria;
}

// Filtros
function handleFilter(e) {
    const categoria = e.target.getAttribute('data-categoria');
    
    // Update active filter
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Filter products
    if (categoria === 'todos') {
        renderProdutos();
    } else {
        const filtered = produtos.filter(produto => produto.categoria === categoria);
        renderProdutos(filtered);
    }
}

// Administração
function handleTabSwitch(e) {
    const tabName = e.target.getAttribute('data-tab');
    
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');
    
    // Show tab content
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Load tab-specific content
    switch(tabName) {
        case 'estoque':
            renderEstoque();
            break;
        case 'vendas':
            renderVendas();
            break;
        case 'dashboard':
            loadDashboardData();
            break;
    }
}

function loadAdminData() {
    loadDashboardData();
    renderEstoque();
}

function loadDashboardData() {
    // Produtos mais vendidos (simulado)
    const produtosVendidos = document.getElementById('produtos-vendidos');
    if (produtosVendidos) {
        produtosVendidos.innerHTML = `
            <div class="produto-vendido">
                <span>Pão Francês</span>
                <span>150 unidades</span>
            </div>
            <div class="produto-vendido">
                <span>Banana Prata</span>
                <span>120 unidades</span>
            </div>
            <div class="produto-vendido">
                <span>Leite Integral</span>
                <span>80 unidades</span>
            </div>
        `;
    }
    
    // Estoque baixo
    const estoqueBaixo = document.getElementById('estoque-baixo');
    if (estoqueBaixo) {
        const produtosBaixoEstoque = produtos.filter(p => p.quantidade < 30);
        estoqueBaixo.innerHTML = produtosBaixoEstoque.length > 0 
            ? produtosBaixoEstoque.map(p => `
                <div class="produto-baixo">
                    <span>${p.nome}</span>
                    <span class="text-danger">${p.quantidade} unidades</span>
                </div>
            `).join('')
            : '<p class="text-muted">Nenhum produto com estoque baixo</p>';
    }
}

function renderEstoque() {
    const tbody = document.getElementById('estoque-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    produtos.forEach(produto => {
        const row = createEstoqueRow(produto);
        tbody.appendChild(row);
    });
}

function createEstoqueRow(produto) {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${produto.nome}</td>
        <td>${getCategoriaLabel(produto.categoria)}</td>
        <td>MZN ${produto.preco.toFixed(2)}</td>
        <td>${produto.quantidade}</td>
        <td>MZN ${(produto.preco * produto.quantidade).toFixed(2)}</td>
        <td>
            <div class="action-buttons">
                <button class="action-btn btn-warning" onclick="editarProdutoModal('${produto.id}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="action-btn btn-danger" onclick="removerProduto('${produto.id}')">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </td>
    `;
    
    return row;
}

// CRUD Produtos
function adicionarProdutoModal() {
    Swal.fire({
        title: 'Novo Produto',
        html: `
            <div class="swal-form">
                <input id="nome-produto" class="swal2-input" placeholder="Nome do produto" required>
                <select id="categoria-produto" class="swal2-input">
                    <option value="">Selecione uma categoria</option>
                    <option value="hortifruti">Hortifruti</option>
                    <option value="padaria">Padaria</option>
                    <option value="laticinios">Laticínios</option>
                    <option value="bebidas">Bebidas</option>
                    <option value="limpeza">Limpeza</option>
                </select>
                <input id="preco-produto" class="swal2-input" type="number" step="0.01" placeholder="Preço (MZN)" required>
                <input id="quantidade-produto" class="swal2-input" type="number" placeholder="Quantidade" required>
                <textarea id="descricao-produto" class="swal2-textarea" placeholder="Descrição do produto"></textarea>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Adicionar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const nome = document.getElementById('nome-produto').value;
            const categoria = document.getElementById('categoria-produto').value;
            const preco = parseFloat(document.getElementById('preco-produto').value);
            const quantidade = parseInt(document.getElementById('quantidade-produto').value);
            const descricao = document.getElementById('descricao-produto').value;

            if (!nome || !categoria || !preco || !quantidade) {
                Swal.showValidationMessage('Todos os campos obrigatórios devem ser preenchidos');
                return false;
            }

            const novoProduto = {
                nome,
                categoria,
                preco,
                quantidade,
                descricao: descricao || `${nome} - produto de qualidade`
            };

            return adicionarProduto(novoProduto);
        }
    });
}

function adicionarProduto(produto) {
    const id = Date.now().toString();
    produto.id = id;
    
    // Adicionar ao Firebase
    firebase.database().ref('produtos/' + id).set(produto)
        .then(() => {
            produtos.push(produto);
            updateStats();
            renderEstoque();
            Swal.fire('Sucesso!', 'Produto adicionado com sucesso!', 'success');
        })
        .catch(error => {
            console.error('Erro ao adicionar produto:', error);
            // Adicionar localmente mesmo se Firebase falhar
            produtos.push(produto);
            updateStats();
            renderEstoque();
            Swal.fire('Adicionado!', 'Produto adicionado localmente', 'success');
        });
}

function editarProdutoModal(id) {
    const produto = produtos.find(p => p.id == id);
    if (!produto) return;

    Swal.fire({
        title: 'Editar Produto',
        html: `
            <div class="swal-form">
                <input id="edit-nome" class="swal2-input" value="${produto.nome}" required>
                <select id="edit-categoria" class="swal2-input">
                    <option value="hortifruti" ${produto.categoria === 'hortifruti' ? 'selected' : ''}>Hortifruti</option>
                    <option value="padaria" ${produto.categoria === 'padaria' ? 'selected' : ''}>Padaria</option>
                    <option value="laticinios" ${produto.categoria === 'laticinios' ? 'selected' : ''}>Laticínios</option>
                    <option value="bebidas" ${produto.categoria === 'bebidas' ? 'selected' : ''}>Bebidas</option>
                    <option value="limpeza" ${produto.categoria === 'limpeza' ? 'selected' : ''}>Limpeza</option>
                </select>
                <input id="edit-preco" class="swal2-input" type="number" step="0.01" value="${produto.preco}" required>
                <input id="edit-quantidade" class="swal2-input" type="number" value="${produto.quantidade}" required>
                <textarea id="edit-descricao" class="swal2-textarea">${produto.descricao}</textarea>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Salvar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            const nome = document.getElementById('edit-nome').value;
            const categoria = document.getElementById('edit-categoria').value;
            const preco = parseFloat(document.getElementById('edit-preco').value);
            const quantidade = parseInt(document.getElementById('edit-quantidade').value);
            const descricao = document.getElementById('edit-descricao').value;

            if (!nome || !categoria || !preco || !quantidade) {
                Swal.showValidationMessage('Todos os campos obrigatórios devem ser preenchidos');
                return false;
            }

            const produtoAtualizado = {
                ...produto,
                nome,
                categoria,
                preco,
                quantidade,
                descricao
            };

            return editarProduto(id, produtoAtualizado);
        }
    });
}

function editarProduto(id, produtoAtualizado) {
    // Atualizar no Firebase
    firebase.database().ref('produtos/' + id).update(produtoAtualizado)
        .then(() => {
            const index = produtos.findIndex(p => p.id == id);
            if (index !== -1) {
                produtos[index] = produtoAtualizado;
            }
            updateStats();
            renderEstoque();
            renderProdutos();
            Swal.fire('Sucesso!', 'Produto atualizado com sucesso!', 'success');
        })
        .catch(error => {
            console.error('Erro ao atualizar produto:', error);
            // Atualizar localmente mesmo se Firebase falhar
            const index = produtos.findIndex(p => p.id == id);
            if (index !== -1) {
                produtos[index] = produtoAtualizado;
            }
            updateStats();
            renderEstoque();
            renderProdutos();
            Swal.fire('Atualizado!', 'Produto atualizado localmente', 'success');
        });
}

function removerProduto(id) {
    const produto = produtos.find(p => p.id == id);
    if (!produto) return;

    Swal.fire({
        title: 'Tem certeza?',
        text: `Deseja remover "${produto.nome}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, remover!',
        cancelButtonText: 'Cancelar'
    }).then(result => {
        if (result.isConfirmed) {
            // Remover do Firebase
            firebase.database().ref('produtos/' + id).remove()
                .then(() => {
                    produtos = produtos.filter(p => p.id != id);
                    updateStats();
                    renderEstoque();
                    renderProdutos();
                    Swal.fire('Removido!', 'Produto removido com sucesso!', 'success');
                })
                .catch(error => {
                    console.error('Erro ao remover produto:', error);
                    // Remover localmente mesmo se Firebase falhar
                    produtos = produtos.filter(p => p.id != id);
                    updateStats();
                    renderEstoque();
                    renderProdutos();
                    Swal.fire('Removido!', 'Produto removido localmente', 'success');
                });
        }
    });
}

// Busca
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProdutos = produtos.filter(produto => 
        produto.nome.toLowerCase().includes(searchTerm) ||
        produto.categoria.toLowerCase().includes(searchTerm) ||
        produto.descricao.toLowerCase().includes(searchTerm)
    );
    
    const tbody = document.getElementById('estoque-tbody');
    if (tbody) {
        tbody.innerHTML = '';
        filteredProdutos.forEach(produto => {
            const row = createEstoqueRow(produto);
            tbody.appendChild(row);
        });
    }
}

// Vendas
function renderVendas() {
    const vendasList = document.getElementById('vendas-list');
    if (!vendasList) return;
    
    vendasList.innerHTML = `
        <div class="vendas-placeholder">
            <i class="fas fa-shopping-cart fa-3x text-muted"></i>
            <h4>Sistema de Vendas</h4>
            <p>Funcionalidade em desenvolvimento</p>
        </div>
    `;
}

function novaVenda() {
    Swal.fire({
        title: 'Nova Venda',
        text: 'Funcionalidade em desenvolvimento',
        icon: 'info'
    });
}

// Estatísticas
function updateStats() {
    const totalProdutos = produtos.length;
    const totalEstoque = produtos.reduce((sum, produto) => sum + produto.quantidade, 0);
    const valorTotal = produtos.reduce((sum, produto) => sum + (produto.preco * produto.quantidade), 0);
    
    document.getElementById('total-produtos').textContent = totalProdutos;
    document.getElementById('total-estoque').textContent = totalEstoque;
    document.getElementById('valor-total').textContent = `MZN ${valorTotal.toFixed(2)}`;
}

// Utilitários
function gerarRelatorio() {
    const totalProdutos = produtos.length;
    const totalEstoque = produtos.reduce((sum, produto) => sum + produto.quantidade, 0);
    const valorTotal = produtos.reduce((sum, produto) => sum + (produto.preco * produto.quantidade), 0);
    
    const produtosPorCategoria = produtos.reduce((acc, produto) => {
        acc[produto.categoria] = (acc[produto.categoria] || 0) + 1;
        return acc;
    }, {});
    
    const relatorio = `
RELATÓRIO MERCEARIA MICTEN
==========================
Data: ${new Date().toLocaleDateString('pt-BR')}

RESUMO GERAL:
- Total de produtos: ${totalProdutos}
- Total de itens em estoque: ${totalEstoque}
- Valor total do estoque: MZN ${valorTotal.toFixed(2)}

PRODUTOS POR CATEGORIA:
${Object.entries(produtosPorCategoria)
    .map(([categoria, quantidade]) => `- ${getCategoriaLabel(categoria)}: ${quantidade} produtos`)
    .join('\n')}

PRODUTOS DETALHADOS:
${produtos.map(produto => 
    `- ${produto.nome} (${getCategoriaLabel(produto.categoria)}): ${produto.quantidade} unidades × MZN ${produto.preco.toFixed(2)} = MZN ${(produto.quantidade * produto.preco).toFixed(2)}`
).join('\n')}
    `;
    
    const blob = new Blob([relatorio], {type: 'text/plain'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_micten_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    
    Swal.fire('Sucesso!', 'Relatório gerado e baixado!', 'success');
}

function exportarDados() {
    const dados = {
        produtos: produtos,
        dataExportacao: new Date().toISOString(),
        versao: '2.0'
    };
    
    const blob = new Blob([JSON.stringify(dados, null, 2)], {type: 'application/json'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `backup_micten_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    Swal.fire('Sucesso!', 'Dados exportados com sucesso!', 'success');
}

function importarDados() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const dados = JSON.parse(e.target.result);
                if (dados.produtos && Array.isArray(dados.produtos)) {
                    Swal.fire({
                        title: 'Importar Dados',
                        text: `Encontrados ${dados.produtos.length} produtos. Deseja importar?`,
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Sim, importar',
                        cancelButtonText: 'Cancelar'
                    }).then(result => {
                        if (result.isConfirmed) {
                            produtos = dados.produtos;
                            updateStats();
                            renderProdutos();
                            renderEstoque();
                            
                            // Salvar no Firebase
                            dados.produtos.forEach(produto => {
                                firebase.database().ref('produtos/' + produto.id).set(produto);
                            });
                            
                            Swal.fire('Sucesso!', 'Dados importados com sucesso!', 'success');
                        }
                    });
                } else {
                    Swal.fire('Erro!', 'Arquivo inválido', 'error');
                }
            } catch (error) {
                Swal.fire('Erro!', 'Erro ao ler o arquivo', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
}

// Formulário de contato
function handleContactForm(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email-contato').value;
    const assunto = document.getElementById('assunto').value;
    const mensagem = document.getElementById('mensagem').value;
    
    // Simular envio
    Swal.fire({
        title: 'Enviando...',
        text: 'Aguarde um momento',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    setTimeout(() => {
        Swal.fire('Sucesso!', 'Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        document.getElementById('contato-form').reset();
    }, 2000);
}


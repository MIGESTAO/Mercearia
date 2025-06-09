# Site da Mercearia Micten

Um site completo para gerenciamento da Mercearia Micten, desenvolvido com HTML, CSS e JavaScript puro, com valores em **Meticais (MZN)**.

## 🚀 Funcionalidades

### Página Inicial
- Dashboard com estatísticas em tempo real
- Contadores de produtos, itens em estoque e valor total em Meticais
- Design responsivo e moderno

### Seção de Produtos
- Visualização de todos os produtos cadastrados com preços em MZN
- Filtros por categoria (Hortifruti, Padaria, Laticínios, Bebidas, Limpeza)
- Cards informativos com preço, estoque e descrição

### Gerenciamento de Estoque
- **Adicionar produtos**: Formulário completo para cadastro com preços em Meticais
- **Editar produtos**: Modal para atualização de informações
- **Excluir produtos**: Remoção com confirmação
- **Busca**: Campo de pesquisa para localizar produtos rapidamente
- **Tabela organizada**: Visualização clara de todos os dados em MZN

### Seção Sobre Nós
- Informações sobre a mercearia
- Características e diferenciais
- Design atrativo com ícones

### Contato
- Informações de contato completas
- Formulário para envio de mensagens
- Horário de funcionamento

### Funcionalidades Extras
- **Exportar dados**: Backup dos produtos em formato JSON
- **Importar dados**: Restauração de backup
- **Gerar relatório**: Relatório em texto com estatísticas em Meticais
- **Armazenamento local**: Dados salvos automaticamente no navegador
- **Design responsivo**: Funciona em desktop, tablet e mobile

## 💰 Moeda

O site está configurado para usar **Meticais (MZN)** como moeda padrão em todas as funcionalidades:
- Preços dos produtos exibidos em MZN
- Valores totais calculados em MZN
- Formulários de cadastro e edição com campos em MZN
- Relatórios gerados com valores em MZN

## 📁 Estrutura do Projeto

```
micten-mercearia/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos e design responsivo
├── js/
│   └── script.js       # Funcionalidades JavaScript
├── images/             # Pasta para imagens (vazia)
└── README.md           # Este arquivo
```

## 🛠️ Como Usar

### 1. Instalação Local
1. Baixe todos os arquivos do projeto
2. Mantenha a estrutura de pastas
3. Abra o arquivo `index.html` em qualquer navegador moderno

### 2. Navegação
- Use o menu superior para navegar entre as seções
- Clique nos botões de filtro na seção Produtos
- Use o formulário na seção Estoque para gerenciar produtos

### 3. Gerenciamento de Produtos

#### Adicionar Produto
1. Vá para a seção "Estoque"
2. Preencha o formulário "Adicionar Novo Produto"
3. Clique em "Adicionar Produto"

#### Editar Produto
1. Na tabela de estoque, clique no botão "Editar" do produto desejado
2. Modifique as informações no modal
3. Clique em "Salvar Alterações"

#### Excluir Produto
1. Na tabela de estoque, clique no botão "Excluir" do produto desejado
2. Confirme a exclusão

#### Buscar Produto
1. Use o campo "Buscar produto..." na seção de estoque
2. Digite o nome ou categoria do produto

### 4. Backup e Restauração

#### Exportar Dados
1. Clique no ícone de download no cabeçalho
2. Um arquivo JSON será baixado com todos os produtos

#### Importar Dados
1. Clique no ícone de upload no cabeçalho
2. Selecione um arquivo JSON de backup válido

#### Gerar Relatório
1. Clique no ícone de relatório no cabeçalho
2. Um arquivo de texto será baixado com as estatísticas

## 🌐 Hospedagem

### Opção 1: Hospedagem Gratuita
- **GitHub Pages**: Faça upload para um repositório GitHub e ative o GitHub Pages
- **Netlify**: Arraste a pasta do projeto para netlify.com
- **Vercel**: Conecte com GitHub ou faça upload direto

### Opção 2: Servidor Web
- Faça upload dos arquivos para qualquer servidor web
- Certifique-se de que o arquivo `index.html` está na raiz
- Não requer PHP, banco de dados ou configurações especiais

## 💾 Armazenamento de Dados

Os dados são armazenados localmente no navegador usando `localStorage`. Isso significa:
- ✅ Os dados persistem entre sessões
- ✅ Não requer servidor ou banco de dados
- ⚠️ Os dados são específicos do navegador/dispositivo
- ⚠️ Limpar dados do navegador apagará os produtos

**Recomendação**: Faça backups regulares usando a função "Exportar Dados".

## 🎨 Personalização

### Cores e Tema
Edite as variáveis CSS no início do arquivo `style.css`:
```css
:root {
    --primary-color: #2c5530;    /* Verde principal */
    --secondary-color: #4a7c59;  /* Verde secundário */
    --accent-color: #7fb069;     /* Verde destaque */
    --light-green: #a7c957;      /* Verde claro */
    --cream: #f2e8cf;            /* Creme */
}
```

### Logo e Nome
1. Substitua "Mercearia Micten" no arquivo `index.html`
2. Adicione sua logo na pasta `images/` e atualize o HTML

### Informações de Contato
Edite a seção de contato no arquivo `index.html` com suas informações reais.

## 🔧 Requisitos Técnicos

- **Navegador**: Qualquer navegador moderno (Chrome, Firefox, Safari, Edge)
- **JavaScript**: Habilitado
- **Conexão**: Não requer internet após carregamento inicial
- **Servidor**: Não requer servidor especial (funciona com arquivos estáticos)

## 📱 Compatibilidade

- ✅ Desktop (Windows, Mac, Linux)
- ✅ Tablet (iPad, Android)
- ✅ Mobile (iPhone, Android)
- ✅ Todos os navegadores modernos

## 🆘 Suporte

### Problemas Comuns

**Os dados não estão salvando:**
- Verifique se o JavaScript está habilitado
- Certifique-se de que não está em modo privado/incógnito

**O site não carrega:**
- Verifique se todos os arquivos estão na estrutura correta
- Abra o console do navegador (F12) para ver erros

**Layout quebrado:**
- Certifique-se de que o arquivo `style.css` está na pasta `css/`
- Verifique se não há bloqueadores de CSS

### Melhorias Futuras Sugeridas

1. **Integração com banco de dados** para múltiplos usuários
2. **Sistema de login** para segurança
3. **Relatórios avançados** com gráficos
4. **Integração com sistemas de pagamento**
5. **Notificações de estoque baixo**
6. **Código de barras** para produtos
7. **Histórico de vendas**

## 📄 Licença

Este projeto foi desenvolvido especificamente para a Mercearia Micten. Todos os direitos reservados.

---

**Desenvolvido com ❤️ para a Mercearia Micten**

*Versão 1.0 - 2025*


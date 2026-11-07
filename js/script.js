// ============================================================
// PROJETO: Consumo da API Rick and Morty
// Descrição: Busca personagens da API pública, cria cards
//            dinamicamente no DOM via JavaScript puro e
//            permite busca por nome e navegação entre páginas.
// ============================================================

// ============================================================
// CONFIGURAÇÃO E ESTADO GLOBAL
// ============================================================

// URL base da API. Usaremos parâmetros de query para paginação e busca.
const API_BASE = 'https://rickandmortyapi.com/api/character';

// Elementos do DOM que serão manipulados
const container = document.getElementById('container-cards');
const inputBusca = document.getElementById('input-busca');
const btnBuscar = document.getElementById('btn-buscar');
const btnLimpar = document.getElementById('btn-limpar');
const btnAnterior = document.getElementById('btn-anterior');
const btnProximo = document.getElementById('btn-proximo');
const infoPagina = document.getElementById('info-pagina');

// Objeto de estado que guarda a situação atual da listagem.
// Isso é essencial para a paginação funcionar junto com a busca.
let estado = {
    paginaAtual: 1,       // Página que está sendo exibida agora
    termoBusca: '',       // Texto digitado pelo usuário (vazio = sem filtro)
    totalPaginas: 1       // Total de páginas retornado pela API
};

// ============================================================
// FUNÇÃO: montarURL()
// Monta a URL final da API com base no estado atual.
// ============================================================
function montarURL() {
    // Começa com a URL base
    let url = API_BASE;

    // Cria um array para guardar os parâmetros de query
    const params = [];

    // Se houver um termo de busca, adiciona o filtro ?name=
    if (estado.termoBusca) {
        // encodeURIComponent garante que espaços e acentos sejam codificados corretamente
        params.push(`name=${encodeURIComponent(estado.termoBusca)}`);
    }

    // Adiciona o parâmetro de página (sempre presente)
    params.push(`page=${estado.paginaAtual}`);

    // Se houver parâmetros, junta com "?" e "&"
    if (params.length > 0) {
        url += '?' + params.join('&');
    }

    // Retorna a URL completa, por exemplo:
    // https://rickandmortyapi.com/api/character?name=rick&page=2
    return url;
}

// ============================================================
// FUNÇÃO: buscarPersonagens()
// Faz a requisição à API com base no estado atual e renderiza.
// ============================================================
function buscarPersonagens() {
    // Mostra mensagem de carregamento enquanto aguarda a resposta
    container.innerHTML = '<p class="carregando">Carregando personagens...</p>';

    // Monta a URL com os filtros e a página atual
    const url = montarURL();

    // fetch() faz a requisição HTTP
    fetch(url)
        .then(response => {
            // Se a resposta não for OK (ex: 404 quando a busca não retorna nada)
            if (!response.ok) {
                // Lança um erro com o status HTTP para ser tratado no catch
                throw new Error('Nenhum resultado encontrado');
            }
            // Converte a resposta para JSON
            return response.json();
        })
        .then(data => {
            // Limpa o container
            container.innerHTML = '';

            // Atualiza o total de páginas no estado global
            // data.info.pages contém o número total de páginas para o filtro atual
            estado.totalPaginas = data.info.pages;

            // Itera sobre cada personagem do array results
            data.results.forEach(personagem => {
                // Cria o card para cada personagem
                criarCard(personagem);
            });

            // Atualiza a interface dos controles de paginação
            atualizarPaginacao();
        })
        .catch(error => {
            // Se a busca não retornar resultados (404), a API retorna erro
            // Exibimos uma mensagem amigável
            container.innerHTML = '<p class="erro">Nenhum personagem encontrado com esse nome.</p>';

            // Reseta o total de páginas para evitar navegação inválida
            estado.totalPaginas = 1;

            // Atualiza os controles (desabilita botões)
            atualizarPaginacao();

            // Loga o erro real no console para depuração
            console.error('Erro na requisição:', error);
        });
}

// ============================================================
// FUNÇÃO: criarCard(personagem)
// Cria e insere um card de personagem no DOM.
// ============================================================
function criarCard(personagem) {
    // Cria o elemento <div> do card
    const card = document.createElement('div');
    // Adiciona a classe "card" para estilização
    card.classList.add('card');

    // --------------------------------------------------------
    // NOME (h2)
    // --------------------------------------------------------
    const nome = document.createElement('h2');
    // Define o texto do nome com o valor vindo da API
    nome.textContent = personagem.name;
    // Anexa o nome ao card
    card.appendChild(nome);

    // --------------------------------------------------------
    // IMAGEM (img)
    // --------------------------------------------------------
    const imagem = document.createElement('img');
    // Define a URL da imagem vinda da API
    imagem.src = personagem.image;
    // Define o texto alternativo para acessibilidade
    imagem.alt = 'Imagem de ' + personagem.name;
    // Anexa a imagem ao card
    card.appendChild(imagem);

    // --------------------------------------------------------
    // STATUS (p)
    // --------------------------------------------------------
    const status = document.createElement('p');
    // Adiciona classe "status" para destaque visual
    status.classList.add('status');
    // Define o texto com o status (Alive, Dead, unknown)
    status.textContent = 'Status: ' + personagem.status;
    // Anexa ao card
    card.appendChild(status);

    // --------------------------------------------------------
    // ESPÉCIE (p)
    // --------------------------------------------------------
    const especie = document.createElement('p');
    // Define o texto com a espécie
    especie.textContent = 'Espécie: ' + personagem.species;
    // Anexa ao card
    card.appendChild(especie);

    // --------------------------------------------------------
    // ORIGEM (p)
    // --------------------------------------------------------
    const origem = document.createElement('p');
    // A API retorna origem como objeto com propriedade "name"
    origem.textContent = 'Origem: ' + personagem.origin.name;
    // Anexa ao card
    card.appendChild(origem);

    // --------------------------------------------------------
    // INSERÇÃO DO CARD NO CONTAINER
    // --------------------------------------------------------
    // Insere o card completo no container principal da página
    container.appendChild(card);
}

// ============================================================
// FUNÇÃO: atualizarPaginacao()
// Atualiza o texto da página e o estado dos botões.
// ============================================================
function atualizarPaginacao() {
    // Mostra a página atual e o total no formato "Página X de Y"
    infoPagina.textContent = `Página ${estado.paginaAtual} de ${estado.totalPaginas}`;

    // Desabilita o botão Anterior se estiver na primeira página
    btnAnterior.disabled = (estado.paginaAtual <= 1);

    // Desabilita o botão Próxima se estiver na última página
    btnProximo.disabled = (estado.paginaAtual >= estado.totalPaginas);
}

// ============================================================
// EVENTOS DOS CONTROLES
// ============================================================

// Botão Buscar: aplica o filtro e volta para a página 1
btnBuscar.addEventListener('click', () => {
    // Pega o valor digitado, removendo espaços extras nas pontas
    const termo = inputBusca.value.trim();

    // Atualiza o estado com o termo de busca
    estado.termoBusca = termo;

    // Sempre volta para a primeira página ao fazer uma nova busca
    estado.paginaAtual = 1;

    // Dispara a busca
    buscarPersonagens();
});

// Permite buscar pressionando Enter no campo de texto
inputBusca.addEventListener('keypress', (evento) => {
    // Verifica se a tecla pressionada foi Enter
    if (evento.key === 'Enter') {
        // Simula o clique no botão Buscar
        btnBuscar.click();
    }
});

// Botão Limpar: remove o filtro e volta à listagem completa
btnLimpar.addEventListener('click', () => {
    // Limpa o campo de texto
    inputBusca.value = '';
    // Reseta o termo de busca no estado
    estado.termoBusca = '';
    // Volta para a página 1
    estado.paginaAtual = 1;
    // Busca novamente sem filtro
    buscarPersonagens();
});

// Botão Anterior: volta uma página
btnAnterior.addEventListener('click', () => {
    // Só executa se não estiver na primeira página
    if (estado.paginaAtual > 1) {
        // Decrementa a página atual
        estado.paginaAtual--;
        // Busca os dados da nova página
        buscarPersonagens();
    }
});

// Botão Próxima: avança uma página
btnProximo.addEventListener('click', () => {
    // Só executa se não estiver na última página
    if (estado.paginaAtual < estado.totalPaginas) {
        // Incrementa a página atual
        estado.paginaAtual++;
        // Busca os dados da nova página
        buscarPersonagens();
    }
});

// ============================================================
// INICIALIZAÇÃO
// ============================================================
// Quando o DOM estiver pronto, faz a primeira busca (página 1, sem filtro)
document.addEventListener('DOMContentLoaded', buscarPersonagens);
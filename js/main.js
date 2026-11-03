// ============================================================
// LÓGICA PRINCIPAL DA INTERFACE
// ============================================================
// Gerencia paginação (via API), busca e criação dinâmica de cards.
// ============================================================

// ---------- ESTADO GLOBAL ----------
let currentPage = 1;
let hasNextPage = true;
let isSearchMode = false;

// ---------- REFERÊNCIAS DOM ----------
const grid = document.getElementById('characters-grid');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const emptyMessage = document.getElementById('empty-message');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageIndicator = document.getElementById('page-indicator');

// ---------- AUXILIARES DE UI ----------
function showLoading() {
    loading.classList.remove('hidden');
    errorMessage.classList.add('hidden');
    emptyMessage.classList.add('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    hideLoading();
}

function clearGrid() {
    grid.innerHTML = '';
}

function updatePaginationUI() {
    pageIndicator.textContent = `Página ${currentPage}`;
    prevBtn.disabled = currentPage <= 1 || isSearchMode;
    nextBtn.disabled = !hasNextPage || isSearchMode;
}

// ---------- CRIAÇÃO DE CARD (DOM MANIPULATION) ----------
/**
 * Cria um card de personagem com createElement e appendChild.
 * Campos exigidos: nome, imagem, descrição adicional.
 */
function createCharacterCard(character) {
    const card = document.createElement('article');
    card.className = 'character-card';

    // Coração decorativo (conforme layout solicitado)
    const heart = document.createElement('span');
    heart.className = 'card-heart';
    heart.textContent = '♥';
    heart.setAttribute('aria-label', 'Favoritar');
    card.appendChild(heart);

    // Imagem
    const img = document.createElement('img');
    img.className = 'card-image';
    img.src = NarutoAPI.getImageUrl(character);
    img.alt = `Imagem de ${character.name || 'personagem'}`;
    img.loading = 'lazy';
    // Fallback caso a imagem específica falhe
    img.onerror = function() {
        this.onerror = null;
        this.src = 'https://via.placeholder.com/300x300/FF6B35/ffffff?text=Naruto';
    };
    card.appendChild(img);

    // Conteúdo
    const content = document.createElement('div');
    content.className = 'card-content';

    // Nome
    const name = document.createElement('h2');
    name.className = 'card-name';
    name.textContent = character.name || 'Nome desconhecido';
    content.appendChild(name);

    // Descrição adicional: usamos o campo "debut" (primeira aparição)
    // que é um objeto com chaves variáveis (manga, anime, etc.)
    const debut = character.debut;
    if (debut && typeof debut === 'object') {
        // Pega o primeiro valor disponível (ex.: "Naruto Chapter #1")
        const firstDebut = Object.values(debut).find(v => typeof v === 'string' && v.trim());
        if (firstDebut) {
            const desc = document.createElement('p');
            desc.className = 'card-description';
            desc.textContent = `📖 Estreia: ${firstDebut}`;
            content.appendChild(desc);
        }
    }

    // Jutsus (até 3, se houver)
    if (Array.isArray(character.jutsu) && character.jutsu.length > 0) {
        const jutsuList = character.jutsu.slice(0, 3).join(', ');
        const jutsu = document.createElement('p');
        jutsu.className = 'card-jutsu';
        jutsu.textContent = `🌀 ${jutsuList}`;
        content.appendChild(jutsu);
    }

    card.appendChild(content);
    return card;
}

// ---------- RENDERIZAÇÃO ----------
function renderCharacters(characters) {
    clearGrid();

    if (!characters || characters.length === 0) {
        emptyMessage.classList.remove('hidden');
        hideLoading();
        return;
    }

    const fragment = document.createDocumentFragment();
    characters.forEach(char => {
        fragment.appendChild(createCharacterCard(char));
    });
    grid.appendChild(fragment);
    hideLoading();
}

// ---------- CARREGAMENTO DE DADOS (PAGINADO) ----------
async function loadPage(page) {
    showLoading();
    clearGrid();
    emptyMessage.classList.add('hidden');
    isSearchMode = false;

    try {
        const result = await NarutoAPI.fetchCharacters(page);
        currentPage = page;
        hasNextPage = result.hasNext;
        updatePaginationUI();
        renderCharacters(result.characters);
    } catch (error) {
        showError(`Erro ao carregar personagens: ${error.message}`);
    }
}

// ---------- BUSCA ----------
async function handleSearch() {
    const term = searchInput.value.trim();
    if (!term) {
        // Campo vazio: volta ao modo paginado normal
        loadPage(1);
        return;
    }

    showLoading();
    clearGrid();
    emptyMessage.classList.add('hidden');
    isSearchMode = true;

    try {
        const results = await NarutoAPI.searchCharacters(term);
        if (results.length === 0) {
            emptyMessage.classList.remove('hidden');
            hideLoading();
        } else {
            renderCharacters(results);
            pageIndicator.textContent = `Busca: "${term}"`;
            prevBtn.disabled = true;
            nextBtn.disabled = true;
        }
    } catch (error) {
        showError(`Erro na busca: ${error.message}`);
    }
}

// ---------- EVENTOS ----------
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

prevBtn.addEventListener('click', () => {
    if (currentPage > 1 && !isSearchMode) {
        loadPage(currentPage - 1);
    }
});

nextBtn.addEventListener('click', () => {
    if (hasNextPage && !isSearchMode) {
        loadPage(currentPage + 1);
    }
});

// ---------- INICIALIZAÇÃO ----------
document.addEventListener('DOMContentLoaded', () => loadPage(1));
// ============================================================
// MÓDULO DE CONSUMO DA API (Dattebayo API - Naruto)
// ============================================================
// Documentação: https://dattebayo-api.onrender.com
// Características: sem chave, CORS habilitado, imagens em URL absoluta
// ============================================================

const NarutoAPI = (function() {
    // URL base da API
    const BASE_URL = 'https://dattebayo-api.onrender.com';

    /**
     * Busca personagens com paginação (a API exige paginação).
     * @param {number} page - Número da página (1-based)
     * @param {number} limit - Itens por página (padrão: 20)
     * @returns {Promise<{characters: Array, hasNext: boolean}>}
     */
    async function fetchCharacters(page = 1, limit = 20) {
        // Monta URL com paginação: /characters?limit=20&page=1
        const url = `${BASE_URL}/characters?limit=${limit}&page=${page}`;
        console.log('[Naruto API] Requisição:', url);

        try {
            const response = await fetch(url);

            // fetch não rejeita automaticamente em erros HTTP
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();

            // A resposta da Dattebayo API é um objeto com a chave "characters"
            // (o nome da coleção corresponde ao endpoint: /characters → "characters")
            const characters = data.characters || [];

            // Heurística para saber se há próxima página:
            // se retornou menos que o limite, provavelmente é a última página
            const hasNext = characters.length === limit;

            console.log(`[Naruto API] ${characters.length} personagens carregados (página ${page}).`);
            return { characters, hasNext };

        } catch (error) {
            console.error('[Naruto API] Falha na requisição:', error);
            throw error;
        }
    }

    /**
     * Busca personagens por nome usando o parâmetro "name" da API.
     * @param {string} name - Termo de busca
     * @returns {Promise<Array>} Personagens filtrados
     */
    async function searchCharacters(name) {
        const term = name.trim();
        if (!term) return [];

        // A API suporta filtro por nome via query param
        const url = `${BASE_URL}/characters?name=${encodeURIComponent(term)}&limit=50`;
        console.log('[Naruto API] Busca:', url);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const data = await response.json();
            return data.characters || [];
        } catch (error) {
            console.error('[Naruto API] Falha na busca:', error);
            throw error;
        }
    }

    /**
     * Retorna a primeira imagem do personagem.
     * A API retorna um array "images" com URLs absolutas (CDN do Fandom).
     * @param {Object} character - Objeto do personagem
     * @returns {string} URL da imagem ou placeholder
     */
    function getImageUrl(character) {
        const images = character.images;
        if (Array.isArray(images) && images.length > 0 && images[0]) {
            return images[0]; // Já é URL absoluta
        }
        // Placeholder temático Naruto
        return 'https://via.placeholder.com/300x300/FF6B35/ffffff?text=Naruto';
    }

    // API pública do módulo
    return {
        fetchCharacters: fetchCharacters,
        searchCharacters: searchCharacters,
        getImageUrl: getImageUrl
    };
})();
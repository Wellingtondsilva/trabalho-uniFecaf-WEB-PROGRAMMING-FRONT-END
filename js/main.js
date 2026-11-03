<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Naruto Character Explorer | Personagens do Mundo Ninja</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Nunito:wght@400;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="css/style.css">
</head>
<body>
    <header class="header">
        <div class="header-content">
            <h1 class="logo">NARUTO <span>EXPLORER</span></h1>
            <p class="subtitle">Explore os ninjas do mundo shinobi</p>
        </div>
    </header>

    <section class="controls">
        <div class="search-box">
            <input type="text" id="search-input" placeholder="Buscar personagem por nome..." aria-label="Buscar personagem">
            <button id="search-btn" aria-label="Buscar">🔍</button>
        </div>
        <div class="pagination-info">
            <button id="prev-btn" class="page-btn" disabled>◀ Anterior</button>
            <span id="page-indicator">Página 1</span>
            <button id="next-btn" class="page-btn">Próxima ▶</button>
        </div>
    </section>

    <!-- Container vazio: todos os cards são criados via JavaScript -->
    <main id="characters-grid" class="characters-grid" aria-label="Lista de personagens"></main>

    <div id="loading" class="loading hidden">
        <div class="spinner"></div>
        <p>Carregando personagens...</p>
    </div>

    <div id="error-message" class="error-message hidden"></div>
    <div id="empty-message" class="empty-message hidden">
        <p>🍥 Nenhum personagem encontrado. Tente outro nome!</p>
    </div>

    <footer class="footer">
        <p>Dados fornecidos pela <a href="https://dattebayo-api.onrender.com" target="_blank" rel="noopener">Dattebayo API</a></p>
        <p>Projeto acadêmico — Desenvolvimento Front-End</p>
    </footer>

    <script src="js/api.js"></script>
    <script src="js/main.js"></script>
</body>
</html>
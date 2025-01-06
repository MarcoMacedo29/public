

// Função para tocar o som de clique
function playClickSound() {
    const clickSound = document.getElementById('click-sound');
    clickSound.currentTime = 0; // Reinicia o som
    clickSound.play().catch(err => console.error("Erro ao tentar reproduzir o som de clique: ", err));
}

// Forçar a reprodução de áudio após clique
document.body.addEventListener('click', function() {
    const audioElement = document.getElementById('background-music');
    audioElement.play().then(() => {
        console.log("Áudio iniciado após clique.");
    }).catch((err) => {
        console.error("Erro ao tentar reproduzir o áudio:", err);
    });
});

// Controle de visibilidade entre telas
function showLevelScreen() {
    playClickSound();  // Toca o som de clique
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('level-screen').classList.remove('hidden');
}

function showSettingsScreen() {
    playClickSound();  // Toca o som de clique
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('settings-screen').classList.remove('hidden');
}

// Função para retornar à tela principal
function returnToMainMenu() {
    playClickSound();  // Toca o som de clique
    document.getElementById('settings-screen').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
}

// Abre o modal de ranking
function openRanking() {
    loadRanking();  // Carrega o ranking antes de exibir
    const rankingModal = document.getElementById('ranking-modal');
    rankingModal.classList.remove('hidden');  // Remove a classe 'hidden' para mostrar o modal
}

// Fecha o modal de ranking
function closeModal() {
    const rankingModal = document.getElementById('ranking-modal');
    rankingModal.classList.add('hidden');  // Adiciona a classe 'hidden' para esconder o modal
}


function loadRanking() {
    const rankingList = document.getElementById('ranking-list');
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];

    console.log('Ranking carregado:', ranking);  // Verifique o conteúdo do ranking no console

    rankingList.innerHTML = ''; // Limpa a lista de ranking

    // Adiciona os jogadores e pontuações
    ranking.forEach((player, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${player.name} - ${player.score} pontos`;
        rankingList.appendChild(listItem);
    });
}


// Função para adicionar uma pontuação ao ranking (exemplo)
function addScoreToRanking(playerName, score) {
    let ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    ranking.push({ name: playerName, score });

    // Ordena por pontuação decrescente
    ranking.sort((a, b) => b.score - a.score);

    // Mantém apenas os 10 melhores
    ranking = ranking.slice(0, 10);

    // Salva no localStorage
    localStorage.setItem('ranking', JSON.stringify(ranking));
}

function addTestRanking() {
    let ranking = [
        { name: 'Jogador 1', score: 150 },
        { name: 'Jogador 2', score: 120 },
        { name: 'Jogador 3', score: 200 }
    ];

    localStorage.setItem('ranking', JSON.stringify(ranking));
    loadRanking();  // Carregar imediatamente após salvar
}

// Funções do menu principal
function playGame() {
    playClickSound();  // Toca o som de clique
    alert("Starting the game...");
    // Adicione lógica para iniciar o jogo
}

function openSettings() {
    playClickSound();  // Toca o som de clique
    showSettingsScreen();
}

// Função para sair do jogo sem exibir mensagens técnicas
function quitGame() {
    playClickSound();  // Toca o som de clique
    const confirmation = confirm("Are you sure you want to quit the game?");
    if (confirmation) {
        try {
            window.close(); // Tenta fechar a aba/janela
        } catch (error) {
            alert("Thank you for playing! Please close this tab manually.");
        }
    }
}



// Controle de volume do áudio de fundo e efeitos sonoros
function setAudioVolume() {
    const audioElement = document.getElementById('background-music');
    const clickSound = document.getElementById('click-sound');
    
    // Obtendo os volumes dos controles deslizantes
    const musicVolume = document.getElementById('musicVolume').value / 100;
    const mainVolume = document.getElementById('mainVolume').value / 100;
    const effectsVolume = document.getElementById('effectsVolume').value / 100;
    
    // Multiplicando os volumes para ajustar o volume final
    audioElement.volume = musicVolume * mainVolume; // Ajuste da música
    clickSound.volume = effectsVolume * mainVolume; // Ajuste dos efeitos sonoros
}

// Exemplo de como alterar o volume do áudio a partir do controle deslizante
document.getElementById('musicVolume').addEventListener('input', (e) => {
    setAudioVolume();
});

document.getElementById('mainVolume').addEventListener('input', (e) => {
    setAudioVolume();
});

document.getElementById('effectsVolume').addEventListener('input', (e) => {
    setAudioVolume();
});

// Navegação do teclado para o menu principal
const menuItems = document.querySelectorAll('.menu-item');
const arrow = document.getElementById('arrow');

let currentIndex = 0;

// Inicialize a posição da seta
function updateArrowPosition() {
    const currentItem = menuItems[currentIndex];
    const rect = currentItem.getBoundingClientRect();
    arrow.style.top = `${rect.top + window.scrollY - 4}px`;
    arrow.textContent = '🢂';
}

// Adicione eventos de teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        currentIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
        updateArrowPosition()
        playClickSound();
    } else if (e.key === 'ArrowDown') {
        currentIndex = (currentIndex + 1) % menuItems.length;
        updateArrowPosition()
        playClickSound();
    } else if (e.key === 'Enter') {
        menuItems[currentIndex].click()
        playClickSound();
    }
});

// Função para abrir o Learn More com as mensagens
function openLearnMore() {
    playClickSound();  // Toca o som de clique
    const learnMoreMessage = document.getElementById('learn-more-message');
    learnMoreMessage.classList.remove('hidden');  // Exibe a tela de informações
}

// Função para fechar o Learn More
function closeLearnMore() {
    playClickSound();  // Toca o som de clique
    const learnMoreMessage = document.getElementById('learn-more-message');
    learnMoreMessage.classList.add('hidden');  // Esconde a tela de informações
}

// Função para exibir os controles do jogo
function showGameControls() {
    playClickSound();  // Toca o som de clique
    const learnMoreMessage = document.getElementById('learn-more-message');
    const gameControlsMessage = document.getElementById('game-controls-message');

    learnMoreMessage.classList.add('hidden');  // Esconde a tela "Learn More"
    gameControlsMessage.classList.remove('hidden');  // Exibe a tela de controles
}

// Função para exibir o Learn More (BACK)
function BacktoLearnMore() {
    playClickSound();  // Toca o som de clique
    const gameControlsMessage = document.getElementById('game-controls-message');
    const learnMoreMessage = document.getElementById('learn-more-message');
    
    gameControlsMessage.classList.add('hidden');  // Exibe a tela de controles
    learnMoreMessage.classList.remove('hidden');  // Esconde a tela "Learn More"
}

// Função para fechar a tela de controles do jogo
function closeGameControls() {
    playClickSound();  // Toca o som de clique
    const gameControlsMessage = document.getElementById('game-controls-message');
    gameControlsMessage.classList.add('hidden');  // Esconde a tela de controles
}

function startGame() {
    // Elementos da interface
    const mainMenu = document.getElementById('main-menu');
    const transitionScreen = document.getElementById('transition-screen');

    // Esconde o menu principal
    mainMenu.classList.add('hidden');
    // Mostra a tela de transição
    transitionScreen.classList.remove('hidden');

    // Após 3 segundos, iniciar o jogo
    setTimeout(() => {
        // Esconde a tela de transição
        transitionScreen.classList.add('hidden');

        // Redirecionar para o jogo (mudar para o arquivo do jogo)
        window.location.href = 'game/teste.html'; // Substitua pelo caminho correto do jogo
    }, 15000); // 3000ms = 3 segundos
}

// Inicialize a seta na primeira posição
updateArrowPosition();

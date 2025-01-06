// Obtém os elementos DOM que serão manipulados
const energiaValue = document.getElementById('energia-value');
const comidaValue = document.getElementById('comida-value');
const trabalhadoresValue = document.getElementById('trabalhadores-value');
const moedasValue = document.getElementById('moedas-value');
const conhecimentoValue = document.getElementById('conhecimento-value');
const mensagemStatus = document.getElementById('mensagem-status');

// Inicia os valores
let energia = 100;
let comida = 50;
let trabalhadores = 10;
let moedas = 0;
let conhecimento = 0;
let comprasDeConhecimento = 0;
let tempoRestante = 120; // Tempo total do jogo
let limiteMoedas = 1000; // Limite máximo de moedas

// Atualiza o display dos valores na tela
function atualizarValores() {
    energiaValue.textContent = energia;
    comidaValue.textContent = comida;
    trabalhadoresValue.textContent = trabalhadores;
    moedasValue.textContent = moedas;
    conhecimentoValue.textContent = conhecimento;
}

// Função para gerenciar a redução de energia
document.getElementById('gerir-energia').addEventListener('click', () => {
    if (energia > 0 && comida > 0 && trabalhadores > 0) {
        energia -= 5; // Reduz energia ao gerir
        comida -= 2; // Reduz comida ao gerir
        trabalhadores -= 1; // Reduz trabalhadores ao gerir
        if (energia < 0) energia = 0; // Evita energia negativa
        if (comida < 0) comida = 0; // Evita comida negativa
        if (trabalhadores < 0) trabalhadores = 0; // Evita número negativo de trabalhadores
        atualizarValores();
        mostrarMensagem('Energia reduzida, comida consumida, e trabalhador removido!', 'success');
    } else {
        mostrarMensagem('Não há recursos suficientes para esta ação.', 'error');
    }
});

// Função para gerenciar a redução de comida
document.getElementById('gerir-comida').addEventListener('click', () => {
    if (energia > 0 && comida > 0 && trabalhadores > 0) {
        comida -= 5; // Reduz comida ao gerir
        energia -= 3; // Reduz energia ao gerir
        trabalhadores -= 1; // Reduz trabalhadores ao gerir
        if (energia < 0) energia = 0; // Evita energia negativa
        if (comida < 0) comida = 0; // Evita comida negativa
        if (trabalhadores < 0) trabalhadores = 0; // Evita número negativo de trabalhadores
        atualizarValores();
        mostrarMensagem('Comida reduzida, energia consumida e trabalhador removido!', 'success');
    } else {
        mostrarMensagem('Não há recursos suficientes para esta ação.', 'error');
    }
});

// Função para gerenciar a redução de trabalhadores
document.getElementById('gerir-trabalhadores').addEventListener('click', () => {
    if (trabalhadores > 1) {
        trabalhadores -= 1; // Reduz um trabalhador
        energia -= 5; // Reduz energia ao remover trabalhador
        comida -= 3; // Reduz comida ao remover trabalhador
        if (energia < 0) energia = 0; // Evita energia negativa
        if (comida < 0) comida = 0; // Evita comida negativa
        if (trabalhadores < 0) trabalhadores = 0; // Evita número negativo de trabalhadores
        atualizarValores();
        mostrarMensagem('Trabalhador removido. Recursos reduzidos.', 'success');
    } else {
        mostrarMensagem('Não é possível remover mais trabalhadores.', 'error');
    }
});

// Função para comprar conhecimento
document.getElementById('comprar-conhecimento').addEventListener('click', () => {
    if (moedas >= 100 && comprasDeConhecimento < 3) {
        conhecimento += 1; // Aumenta 1 de conhecimento
        moedas -= 100; // Diminui 100 moedas
        comprasDeConhecimento += 1; // Aumenta o número de compras de conhecimento
        atualizarValores();
        mostrarMensagem('Conhecimento adquirido!', 'success');

        // Verifica se o jogo deve terminar após 3 compras de conhecimento
        console.log('Compras de conhecimento:', comprasDeConhecimento); // Debug
        if (comprasDeConhecimento === 3) {
            mostrarMensagem('Você conseguiu consertar a máquina! Parabéns!', 'success');
            setTimeout(() => {
                console.log('Finalizando o jogo...'); // Debug
                alert('Jogo Finalizado!'); // Exibe um alerta de finalização
                finalizarJogo(); // Chama a função que encerra o jogo
            }, 2000); // Delay de 2 segundos para mostrar a mensagem antes de finalizar
        }
    } else if (comprasDeConhecimento >= 3) {
        mostrarMensagem('Você já completou todas as compras de conhecimento.', 'info');
    } else {
        mostrarMensagem('Você precisa de mais moedas para comprar conhecimento.', 'error');
    }
});

// Função para finalizar o jogo
function finalizarJogo() {
    console.log('Finalizando jogo...'); // Debug
    // Reinicia a página para reiniciar o jogo
    location.reload(); // Recarrega a página, reiniciando o jogo
}

// Função para mostrar uma mensagem de status
function mostrarMensagem(msg, tipo) {
    // Cria uma nova mensagem
    const novaMensagem = document.createElement('div');
    novaMensagem.textContent = msg;
    novaMensagem.classList.add(tipo);
    novaMensagem.classList.add('mensagem');
    
    // Adiciona a nova mensagem ao painel de status
    mensagemStatus.appendChild(novaMensagem);
    
    // Remove a mensagem após 3 segundos
    setTimeout(() => {
        novaMensagem.remove();
    }, 3000);
}

// A cada segundo, os trabalhadores geram moedas automaticamente (até o limite de moedas)
setInterval(() => {
    if (tempoRestante > 0) {
        // Trabalhadores geram moedas automaticamente
        if (moedas < limiteMoedas) {
            moedas += trabalhadores; // Gera moedas de acordo com o número de trabalhadores
            if (moedas > limiteMoedas) {
                moedas = limiteMoedas; // Limita as moedas ao valor máximo
            }
            atualizarValores();
        }
    }
}, 1000);

// Decrementa o tempo restante a cada segundo
setInterval(() => {
    if (tempoRestante > 0) {
        tempoRestante--;
        atualizarValores();
    }

    // Verifica se o tempo acabou e finaliza o jogo
    if (tempoRestante <= 0 && comprasDeConhecimento < 3) {
        mostrarMensagem('Tempo esgotado! Você não completou o jogo.', 'error');
        setTimeout(() => {
            alert('Jogo Finalizado por tempo!'); // Alerta de tempo esgotado
            finalizarJogo();
        }, 2000);
    }
}, 1000);

// Inicializa os valores na tela ao carregar a página
atualizarValores();

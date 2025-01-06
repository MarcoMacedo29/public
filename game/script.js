let player = document.getElementById("player");
let gameContainer = document.getElementById("game-container");
let machine = document.getElementById("machine");

let gamePaused = false;
let animationFrameId;  // ID da animação

let playerState = "idle";
let playerPosX = 0;
let playerPosY = 0;
let isJumping = false;
let jumpSpeed = 10;
let gravity = 0.5;
let jumpHeight = 150;
let walkFrame = 1;
let idleFrame = 1;
let jumpFrame = 1;
let lastWalkTime = 0;
let walkFrameDelay = 200;
let idleFrameDelay = 300;
let lastIdleTime = 0;
let lastJumpTime = 0;
let jumpAnimationDelay = 150;
let groundHeight = 0;
let leftLimit = 10;

let walkSprite = "url('walk-sprite.png')";
let walkBackSprite = "url('walkback-sprite.png')";
let jumpSprite = "url('jump-sprite.png')";
let jumpBackSprite = "url('jumpback-sprite.png')";

let movingDirection = "right";
let keysPressed = {};

let gameOver = false;  // Variável para verificar se o jogo acabou

// Função para alternar entre pausar e retomar o jogo
function togglePauseMenu() {
  gamePaused = !gamePaused;
  const pauseMenu = document.getElementById("pauseMenu");

  if (gamePaused) {
    // Exibe o menu de pausa
    pauseMenu.style.display = "flex";
    cancelAnimationFrame(animationFrameId); // Pausa a animação
  } else {
    // Esconde o menu de pausa e retoma a animação
    pauseMenu.style.display = "none";
    animate(); // Retoma a animação
  }
}

// Função para continuar o jogo
function resumeGame() {
  togglePauseMenu(); // Alterna para continuar o jogo
}

// Função para reiniciar o jogo
function restartGame() {
  location.reload(); // Reinicia a página, reiniciando o jogo
}

// Função para sair do jogo (poderia redirecionar para outra página ou menu)
function exitGame() {
  window.location.href = "../jogo.html"; // Redireciona para o menu principal
}

// Função para atualizar a animação do jogador
function updatePlayerAnimation() {
  const currentTime = Date.now();

  if (playerState === "walk") {
    if (currentTime - lastWalkTime > walkFrameDelay) {
      player.style.backgroundImage = movingDirection === "right" ? walkSprite : walkBackSprite;
      player.style.backgroundPosition = `-${walkFrame * 128}px 0`;
      walkFrame = walkFrame % 4 + 1;
      lastWalkTime = currentTime;
    }
  } else if (playerState === "idle") {
    if (currentTime - lastIdleTime > idleFrameDelay) {
      player.style.backgroundImage = "url('idle-sprite.png')";
      player.style.backgroundPosition = `-${idleFrame * 128}px 0`;
      idleFrame = idleFrame % 2 + 1;
      lastIdleTime = currentTime;
    }
  } else if (playerState === "jump") {
    if (currentTime - lastJumpTime > jumpAnimationDelay) {
      player.style.backgroundImage = movingDirection === "right" ? jumpSprite : jumpBackSprite;
      player.style.backgroundPosition = `-${jumpFrame * 128}px 0`;
      jumpFrame = (jumpFrame % 11) + 1;
      lastJumpTime = currentTime;
    }
  }
}

// Função para mover o jogador
function movePlayer(direction) {
  const moveSpeed = 9; // Velocidade do jogador
  const gameContainerWidth = gameContainer.clientWidth;
  const playerWidth = player.offsetWidth;

  const machineX = 2000; // Posição fixa da máquina no mapa
  const machineWidth = machine.offsetWidth; // Largura da máquina
  const machineLimit = machineX + machineWidth; // Final da máquina no mapa

  const rightLimit = machineLimit - playerWidth; // Limite direito ajustado com a máquina

  if (direction === "left") {
    movingDirection = "left";
    if (playerPosX > leftLimit) {
      playerPosX -= moveSpeed;
      playerState = "walk";
    } else {
      playerPosX = leftLimit;
    }
  } else if (direction === "right") {
    movingDirection = "right";
    if (playerPosX + moveSpeed <= rightLimit) {
      playerPosX += moveSpeed;
    } else {
      playerPosX = rightLimit;
    }
    playerState = isJumping ? "jump" : "walk";
  } else {
    if (!isJumping) playerState = "idle";
  }

  updatePlayerAnimation();
  player.style.transform = `translate(${playerPosX}px, ${playerPosY}px)`;
  gameContainer.style.backgroundPosition = `-${playerPosX / 5}px 0`;
}


// Função para fazer o jogador saltar
function jumpPlayer(direction = null) {
  if (!isJumping) {
    isJumping = true;
    playerState = "jump";
    updatePlayerAnimation();
    let jumpHeightReached = 0;
    let fallSpeed = gravity;
    let horizontalSpeed = direction === "right" ? 4 : direction === "left" ? -4 : 0;

    let jumpInterval = setInterval(() => {
      if (jumpHeightReached < jumpHeight) {
        playerPosY -= jumpSpeed;
        jumpHeightReached += jumpSpeed;
        playerPosX += horizontalSpeed;
      } else {
        if (playerPosY < groundHeight) {
          playerPosY += fallSpeed;
          fallSpeed += gravity;
        }
      }
      if (playerPosX < leftLimit) {
        playerPosX = leftLimit;
      }
      player.style.transform = `translate(${playerPosX}px, ${playerPosY}px)`;
      gameContainer.style.backgroundPosition = `-${playerPosX / 5}px 0`;

      if (playerPosY >= groundHeight) {
        clearInterval(jumpInterval);
        playerPosY = groundHeight;
        player.style.transform = `translate(${playerPosX}px, ${groundHeight}px)`;
        playerState = "idle";
        updatePlayerAnimation();
        isJumping = false;
      }
    }, 16);
  }
}

function updateMachinePosition() {
  const machineX = 2000; // Posição fixa no mapa onde a máquina está localizada
  const gameWidth = gameContainer.clientWidth;

  // Calcula a posição da máquina relativa ao jogador
  const machineScreenX = machineX - playerPosX;

  // Exibe a máquina apenas se ela estiver dentro da área visível
  if (machineScreenX >= -machine.offsetWidth && machineScreenX <= gameWidth) {
    machine.style.display = "block";
    machine.style.transform = `translate(${machineScreenX}px, ${groundHeight}px)`;
  } else {
    machine.style.display = "none";
  }
}

let collisionOffset = -45; // Deslocamento para a frente da máquina
let hasCollided = false; // Variável para evitar múltiplos redirecionamentos

function checkCollisionWithMachine() {
  if (hasCollided) return; // Evita redirecionar várias vezes

  const machineRect = machine.getBoundingClientRect(); // Obtem as dimensões da máquina
  const playerRect = player.getBoundingClientRect(); // Obtem as dimensões do jogador

  // Ajusta a área de colisão da máquina com um deslocamento para frente
  const adjustedMachineLeft = machineRect.left - collisionOffset;
  const adjustedMachineRight = machineRect.right - collisionOffset;

  // Verifica se os retângulos do jogador e da máquina se sobrepõem
  if (
    playerRect.right >= adjustedMachineLeft && // Jogador alcança o ponto de colisão ajustado
    playerRect.left <= adjustedMachineRight && // Jogador não ultrapassa o limite ajustado
    playerRect.bottom >= machineRect.top && // Jogador está acima ou na mesma altura da máquina
    playerRect.top <= machineRect.bottom    // Jogador não está abaixo da máquina
  ) {
    hasCollided = true; // Define que a colisão já ocorreu
    window.location.href = 'pages/game.html'; // Redireciona imediatamente
  }
}

// Variável para o controle do áudio
let rainAudio = document.getElementById("rainAudio"); // Referencia o elemento de áudio

// Função para alternar entre os climas e tocar o áudio
let currentWeather = 2; // 0: snow, 1: rain, 2: thunder

function changeWeather() {
  // Esconde todos os efeitos
  document.getElementById("snow").style.display = "none";
  document.getElementById("rain").style.display = "none";
  document.getElementById("thunder").style.display = "none";

  // Controla a exibição dos climas e o áudio
  if (currentWeather === 0) {
    document.getElementById("snow").style.display = "block"; // Exibe neve
    rainAudio.play(); // Toca o áudio da neve
    currentWeather = 1; // Próxima animação será chuva
  } else if (currentWeather === 1) {
    document.getElementById("rain").style.display = "block"; // Exibe chuva
    rainAudio.play(); // Continua tocando o áudio
    currentWeather = 2; // Próxima animação será trovão
  } else {
    document.getElementById("thunder").style.display = "block"; // Exibe trovão
    rainAudio.play(); // Continua tocando o áudio
    currentWeather = 0; // Próxima animação será neve
  }
}

// Inicializa o jogo com a chuva e toca o áudio
document.getElementById("rain").style.display = "block"; // Exibe chuva ao iniciar
rainAudio.play(); // Começa a tocar o áudio de chuva

// Chama a função changeWeather a cada 5 segundos (5000ms)
setInterval(changeWeather, 2500);


function animate() {
  if (gameOver || gamePaused) return;  // Se o jogo estiver pausado ou acabou, não continua a animação
  updatePlayerAnimation();
  updateMachinePosition(); // Atualize a posição da máquina
  checkCollisionWithMachine(); // Verifica se houve colisão com a máquina
  animationFrameId = requestAnimationFrame(animate);  // Chama novamente a animação apenas se o jogo não estiver pausado
}

animate();

// Alterar a função de pausa para garantir que a animação seja pausada corretamente
function togglePauseMenu() {
  gamePaused = !gamePaused;
  const pauseMenu = document.getElementById("pauseMenu");

  if (gamePaused) {
    // Exibe o menu de pausa
    pauseMenu.style.display = "flex";
    cancelAnimationFrame(animationFrameId); // Pausa a animação
  } else {
    // Esconde o menu de pausa e retoma a animação
    pauseMenu.style.display = "none";
    animate(); // Retoma a animação
  }
}

document.addEventListener("keydown", (event) => {
  keysPressed[event.key] = true;

  // Adicionando a funcionalidade de pausar o jogo
  if (event.key === "Escape") {
    togglePauseMenu(); // Alterna entre pausar e continuar o jogo
  }

  if (keysPressed["ArrowRight"] && keysPressed["ArrowUp"]) {
    jumpPlayer("right");
  } else if (keysPressed["ArrowLeft"] && keysPressed["ArrowUp"]) {
    jumpPlayer("left");
  } else if (event.key === "ArrowRight") {
    movePlayer("right");
  } else if (event.key === "ArrowLeft") {
    movePlayer("left");
  } else if (event.key === "Space" || event.key === "ArrowUp") {
    jumpPlayer();
  }
});

document.addEventListener("keyup", (event) => {
  keysPressed[event.key] = false;

  if (!keysPressed["ArrowRight"] && !keysPressed["ArrowLeft"] && !isJumping) {
    playerState = "idle";
    updatePlayerAnimation();
  }
});

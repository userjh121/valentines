let companion = localStorage.getItem('selectedCompanion');
let hp = 100;
let maxHP = 100;
let lastScreen = "sogeti";
let currentScreen = "sogeti";
let hudCollapsed = false;
let userExpandedHUD = false;

const dialogues = {
  Tego: {
    sogeti: "Tego darts ahead, opening chests with reckless abandon. ",
    zoo: "Tego nearly steals the Baileys. Chaos ensues"
  },
  Mona: {
    sogeti: "Mona stands firm, carefully examining each chest.",
    zoo: "Mona growls softly, guarding your Baileys."
  }
};

const music = document.getElementById("bg-music");
const deathAudio = document.getElementById("death-audio");

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
  companion = localStorage.getItem('selectedCompanion');
  
   // Initialize HUD state from localStorage
  const savedCollapsed = localStorage.getItem('hudCollapsed');
  if (savedCollapsed === 'true') {
    hudCollapsed = true;
  } else if (savedCollapsed === 'false') {
    userExpandedHUD = true;
  }

  initHUD();
  updateDialogue('sogeti');
  
  if (music) {
    music.volume = 0.2;
    music.play();
  }
});

function initHUD() {
  updateHP();
  updateCompanionDisplay();
  toggleHUD(true);
}

function toggleHUD(show) {
  const hud = document.getElementById("hud");
  if (hud) {
    if (show) {
      hud.classList.remove('hidden');
      
      // Load saved collapse state
      const savedCollapsed = localStorage.getItem('hudCollapsed');
      if (savedCollapsed === 'true') {
        hud.classList.add('collapsed');
        hudCollapsed = true;
      } else if (savedCollapsed === 'false') {
        hud.classList.remove('collapsed');
        hudCollapsed = false;
        userExpandedHUD = true;
      }
      
      // Adjust HUD position based on screen size
      const screenWidth = window.innerWidth;
      
      
    }}
}


function toggleHUDCollapse() {
  const hud = document.getElementById('hud');
  if (!hud) return;
  
  hudCollapsed = !hudCollapsed;
  userExpandedHUD = true;
  
  if (hudCollapsed) {
    hud.classList.add('collapsed');
    // Save state to localStorage
    localStorage.setItem('hudCollapsed', 'true');
  } else {
    hud.classList.remove('collapsed');
    localStorage.setItem('hudCollapsed', 'false');
  }
}



function updateHP() {
  const hpBar = document.getElementById("hp-bar");
  const hpValue = document.getElementById("hp-value");
  const hpPercentage = Math.round((hp / maxHP) * 100);
  
  if (hpBar) {
    // Update width
    hpBar.style.width = `${hpPercentage}%`;
    
    // Update color based on HP percentage
    if (hpPercentage <= 20) {
      hpBar.style.background = "linear-gradient(90deg, #ff0000 0%, #ff3300 100%)";
      hpBar.classList.add('low');
    } else if (hpPercentage <= 50) {
      hpBar.style.background = "linear-gradient(90deg, #ff6600 0%, #ff9900 100%)";
      hpBar.classList.remove('low');
    } else {
      hpBar.style.background = "linear-gradient(90deg, #00cc00 0%, #66ff66 100%)";
      hpBar.classList.remove('low');
    }
  }
  
  if (hpValue) {
    hpValue.textContent = `${hpPercentage}%`;
  }
}

function updateCompanionDisplay() {
  const companionElement = document.getElementById('current-companion');
  const companionIcon = document.getElementById('companion-icon');
  
  if (companionElement && companion) {
    companionElement.textContent = companion;
    
    // Set companion icon based on selection
    if (companionIcon) {
      const iconSrc = companion === 'Tego' ? 'assets/tego.png' : 'assets/mona.png';
      companionIcon.src = iconSrc;
      companionIcon.classList.remove('hidden');
    }
  }
}


function goTo(id) {
  lastScreen = currentScreen;
  currentScreen = id;

  document.querySelectorAll(".screen").forEach(s => {
    s.classList.remove("active");
    s.classList.add("hidden");
  });

  const screen = document.getElementById(id);
  screen.classList.remove("hidden");
  
  setTimeout(() => {
    screen.classList.add("active");
    
    // Re-initialize HUD for the new screen
    initHUD();
  }, 10);

  updateDialogue(id);
  
  // Initialize specific games based on screen
  if (id === "fnaf") startFnafGame();
  if (id === "bakery") initBakery();
  if (id === "materialists") {
    // Reset heartbeat game when entering cinema
    setTimeout(() => {
      const cinemaStart = document.getElementById('cinema-start');
      const heartbeatGame = document.getElementById('heartbeat-game');
      const outcomeScreen = document.getElementById('cinema-outcome');
      
      if (cinemaStart) cinemaStart.classList.remove('hidden');
      if (heartbeatGame) heartbeatGame.classList.add('hidden');
      if (outcomeScreen) outcomeScreen.classList.add('hidden');
      
      resetHeartbeatGame();
      initHeartbeatGame();
    }, 100);
  }


  setTimeout(function() {
        const screen = document.getElementById(id);
        if (screen) {
            screen.scrollTop = 0;
            window.scrollTo(0, 0);
        }
        
        // Re-initialize mobile support for new screen
        if (id === 'materialists') {
            setTimeout(initMobileSupport, 150);
            setTimeout(setupTouchControls, 250);
        }
    }, 50);
}

function updateDialogue(screenId) {
  const box = document.getElementById("companion-dialogue");
  if (!box || !companion) return;

  if (dialogues[companion][screenId]) {
    box.innerText = dialogues[companion][screenId];
  } else {
    box.innerText = "";
  }
}

// Enhanced damage function
function damage(amount = 50) {
  hp -= amount;
  if (hp <= 0) {
    hp = 0;
    die();
  }
  updateHP();
  
  // Show damage effect
  showDamageEffect();
}

// Enhanced heal function
function heal(amount = 30) {
  hp = Math.min(maxHP, hp + amount);
  updateHP();
  
  // Show heal effect
  showHealEffect();
}



function showDamageEffect() {
  const hpBar = document.getElementById('hp-bar');
  if (hpBar) {
    hpBar.style.transition = 'none';
    hpBar.style.filter = 'brightness(2)';
    
    setTimeout(() => {
      hpBar.style.transition = 'width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      hpBar.style.filter = 'brightness(1)';
    }, 100);
  }
}

function showHealEffect() {
  const hpBar = document.getElementById('hp-bar');
  if (hpBar) {
    hpBar.style.transition = 'none';
    hpBar.style.filter = 'brightness(1.5) saturate(2)';
    
    setTimeout(() => {
      hpBar.style.transition = 'width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      hpBar.style.filter = 'brightness(1) saturate(1)';
    }, 300);
  }
}




/* Death and revival functions */
function die() {
  goTo("death-screen");
  if (deathAudio) deathAudio.play();
}

function revive() {
  hp = 50;
  updateHP();
  goTo(lastScreen);
}

function restart() {
  localStorage.removeItem('companion');
  window.location.href = 'index.html';
}

function win() {
  goTo("victory");
}








/* ---------- FNAF Wordle Game Functions ---------- */
const fnafWords = ["BLACK", "SCARE", "NIGHT", "WATCH"];
let targetWord;
let attempts;
let maxAttempts;

function startFnafGame() {
  targetWord = fnafWords[Math.floor(Math.random() * fnafWords.length)];
  attempts = 0;
  maxAttempts = companion === "Mona" ? 7 : 5;

  document.getElementById("wordle-grid").innerHTML = "";
  document.getElementById("fear-text").innerText = `Fear rising… Attempts left: ${maxAttempts}`;
}

function submitGuess() {
  const input = document.getElementById("wordle-input");
  const guess = input.value.toUpperCase();

  if (guess.length !== 5) return;

  attempts++;
  renderGuess(guess);
  input.value = "";

  if (guess === targetWord) {
    heal(20);
    goTo("pizza");
    return;
  }

  if (attempts >= maxAttempts) {
    die();
    return;
  }

  damage(10);
  document.getElementById("fear-text").innerText = 
    `Fear rising… Attempts left: ${maxAttempts - attempts}`;
}

function renderGuess(guess) {
  const grid = document.getElementById("wordle-grid");

  for (let i = 0; i < 5; i++) {
    const cell = document.createElement("div");
    cell.className = "word-cell";
    cell.innerText = guess[i];

    if (guess[i] === targetWord[i]) {
      cell.classList.add("correct");
    } else if (targetWord.includes(guess[i])) {
      cell.classList.add("present");
    } else {
      cell.classList.add("absent");
    }

    grid.appendChild(cell);
  }
}








//* ---------- Chest Game Functions ---------- */
// Chest game variables
let openedChests = 0;

// Chest functions
function openChest(chestNumber) {
  const chest = document.getElementById(`chest${chestNumber}`);
  const chestClosed = chest.querySelector('.chest-closed');
  const chestContents = chest.querySelector('.chest-contents');
  
  if (chest.classList.contains('opened')) return;
  
  // Add opening animation
  chest.classList.add('opening');
  
  setTimeout(() => {
    chest.classList.remove('opening');
    chest.classList.add('opened');
    chestClosed.classList.add('hidden');
    chestContents.classList.remove('hidden');
    
    // Update opened chests count
    if (!chest.dataset.counted) {
      openedChests++;
      chest.dataset.counted = 'true';
      updateChestsCounter();
      

      
      // Random chance for extra item (30% chance)
      if (Math.random() < 0.4) {
        const extraItems = ["Forgotten coffee mug", "Haribo Strawberries", "Pink Pen"];
        const extraItem = extraItems[Math.floor(Math.random() * extraItems.length)];
        showDescription(`You found an extra item: ${extraItem}! +5 HP`);
        heal(5);
      }
      if (Math.random() < 0.3) {
        const extraItems = ["Forgotten ISTQB exam", "Forgotten DP900 exam", "Expired snack"];
        const extraItem = extraItems[Math.floor(Math.random() * extraItems.length)];
        showDescription(`You found an extra item: ${extraItem}! -5 HP`);
        damage(5);
      }
    }
    
    // Update companion dialogue
    updateCompanionChestReaction(chestNumber);
    
  }, 500);
}

function closeChest(chestNumber) {
  const chest = document.getElementById(`chest${chestNumber}`);
  const chestClosed = chest.querySelector('.chest-closed');
  const chestContents = chest.querySelector('.chest-contents');
  
  chestContents.classList.add('hidden');
  chestClosed.classList.remove('hidden');
  
  // Clear description
  document.getElementById('item-description').textContent = '';
}

function updateChestsCounter() {
  const counter = document.getElementById('chests-opened');
  if (counter) {
    counter.textContent = `${openedChests}/3`;
    
    // Enable continue button when all chests are opened
    if (openedChests >= 3) {
      document.getElementById('continue-btn').disabled = false;
      showDescription("All chests explored! You can continue.");
      
    }
  }
}

function updateCompanionChestReaction(chestNumber) {
  const descriptionBox = document.getElementById('item-description');
  const companionDialogue = document.getElementById('companion-dialogue');
  
  if (companion === 'Tego') {
    const reactions = [
      "Tego jumps into the chest and it closes behind him"
    ];
  } else {
    const reactions = [
      "Mona sniffs the air and watches as you open the chest.",
    ];
  }
}

function showDescription(text) {
  const descriptionBox = document.getElementById('item-description');
  descriptionBox.textContent = text;
  
  // Auto-clear after 5 seconds
  setTimeout(() => {
    if (descriptionBox.textContent === text) {
      descriptionBox.textContent = '';
    }
  }, 5000);
}

// Add click events to work items
document.addEventListener('DOMContentLoaded', function() {
  // Add event listeners to work items
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('work-item')) {
      const description = e.target.getAttribute('data-description');
      showDescription(description);
      
      // Small HP bonus for examining items
      heal(2);
    }
  });
  
  // Initialize chests counter
  updateChestsCounter();
});





/* ---------- Bakery Memory Game ---------- */
// Memory Game Variables
let memoryGame = {
  cards: ['🥐', '🥨', '🥖', '🍩', '🎂', '🍪', '🧁', '🥧'],
  flippedCards: [],
  matchedPairs: 0,
  totalPairs: 6,
  moves: 0,
  timer: 60,
  timerInterval: null,
  gameStarted: false,
  gameCompleted: false,
  hintsRemaining: 3,
  difficulty: 'easy',
  initialTime: 90 // Will be set based on difficulty
};

// Initialize bakery
function initBakery() {
  updateBakeryDialogue();
  setupMemoryGame();
}

// Setup memory game
function setupMemoryGame() {
  const grid = document.getElementById('memory-grid');
  grid.innerHTML = '';
  
  // Create card pairs based on difficulty
  let cardSet = [];
  if (memoryGame.difficulty === 'easy') {
    cardSet = memoryGame.cards.slice(0, 6); // 6 pairs
    memoryGame.totalPairs = 6;
    memoryGame.timer = 90;
    memoryGame.initialTime = 90;
  } else if (memoryGame.difficulty === 'medium') {
    cardSet = memoryGame.cards.slice(0, 8); // 8 pairs
    memoryGame.totalPairs = 8;
    memoryGame.timer = 75;
    memoryGame.initialTime = 75;
  } else {
    cardSet = memoryGame.cards; // 8 pairs
    memoryGame.totalPairs = 8;
    memoryGame.timer = 60;
    memoryGame.initialTime = 60;
  }
  
  // Duplicate cards for pairs and shuffle
  let gameCards = [...cardSet, ...cardSet];
  gameCards = shuffleArray(gameCards);
  
  // Create card elements
  gameCards.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    
    card.innerHTML = `
      <div class="card-back">❓</div>
      <div class="card-front">${emoji}</div>
    `;
    
    card.addEventListener('click', () => flipCard(card));
    grid.appendChild(card);
  });
  
  // Reset game state
  memoryGame.flippedCards = [];
  memoryGame.matchedPairs = 0;
  memoryGame.moves = 0;
  memoryGame.gameStarted = false;
  memoryGame.gameCompleted = false;
  memoryGame.hintsRemaining = 3;
  
  // Update display
  updateGameStats();
  document.getElementById('bakery-outcome').classList.add('hidden');
  document.getElementById('memory-game').classList.remove('hidden');
  document.getElementById('start-btn').disabled = false;
  document.getElementById('reset-btn').disabled = true;
  document.getElementById('hint-btn').disabled = true;
  document.getElementById('hint-btn').innerHTML = '<i class="fas fa-lightbulb"></i> Hint (3 left)';
  
  // Update timer display
  document.getElementById('timer').textContent = memoryGame.timer;
  document.getElementById('timer').className = '';
}

// Shuffle array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Flip card
function flipCard(card) {
  if (!memoryGame.gameStarted || memoryGame.gameCompleted) return;
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
  if (memoryGame.flippedCards.length >= 2) return;
  
  card.classList.add('flipped');
  memoryGame.flippedCards.push(card);
  
  if (memoryGame.flippedCards.length === 2) {
    memoryGame.moves++;
    updateGameStats();
    checkForMatch();
  }
}

// Check for match
function checkForMatch() {
  const [card1, card2] = memoryGame.flippedCards;
  
  if (card1.dataset.emoji === card2.dataset.emoji) {
    // Match found
    setTimeout(() => {
      card1.classList.add('matched');
      card2.classList.add('matched');
      memoryGame.matchedPairs++;
      memoryGame.flippedCards = [];
      
      showMessage('Perfect match!', 'success');
      updateGameStats();
      
      if (memoryGame.matchedPairs === memoryGame.totalPairs) {
        completeMemoryGame();
      }
    }, 500);
  } else {
    // No match - minus 5 health
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      memoryGame.flippedCards = [];
      showMessage('Wrong match! -5 HP', 'error');
      damage(5); // Minus 5 health for wrong match
    }, 1000);
  }
}

// Start game
function startGame() {
  memoryGame.gameStarted = true;
  document.getElementById('start-btn').disabled = true;
  document.getElementById('reset-btn').disabled = false;
  document.getElementById('hint-btn').disabled = false;

  // First, show all cards briefly (2 seconds)
  const cards = document.querySelectorAll('.memory-card');
  cards.forEach(card => {
    card.classList.add('flipped');
  });
  
  showMessage('Memorise the pastries!', 'info');

  setTimeout(() => {
    cards.forEach(card => {
      card.classList.remove('flipped');
    });
    
    // Start timer
    memoryGame.timerInterval = setInterval(() => {
      memoryGame.timer--;
      document.getElementById('timer').textContent = memoryGame.timer;
      
      // Update timer color
      const timerElement = document.getElementById('timer');
      if (memoryGame.timer <= 15) {
        timerElement.className = 'danger';
      } else if (memoryGame.timer <= 30) {
        timerElement.className = 'warning';
      }
      
      if (memoryGame.timer <= 0) {
        endGame(false);
      }
    }, 1000);
    
    showMessage('Game started! Find all the pairs!', 'info');
  }, 2000);
}

// Reset game
function resetGame() {
  clearInterval(memoryGame.timerInterval);
  setupMemoryGame();
  showMessage('Game reset!', 'info');
}

// Set difficulty
function setDifficulty(level) {
  memoryGame.difficulty = level;
  
  // Update button states
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  resetGame();
}

// Provide hint
function hint() {
  if (memoryGame.hintsRemaining <= 0 || !memoryGame.gameStarted || memoryGame.gameCompleted) return;
  
  memoryGame.hintsRemaining--;
  
  // Find first unmatched card and flip it briefly
  const cards = document.querySelectorAll('.memory-card:not(.matched):not(.flipped)');
  if (cards.length > 0) {
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    randomCard.classList.add('flipped');
    
    setTimeout(() => {
      randomCard.classList.remove('flipped');
    }, 1000);
  }
  
  document.getElementById('hint-btn').innerHTML = 
    `<i class="fas fa-lightbulb"></i> Hint (${memoryGame.hintsRemaining} left)`;
  
  if (memoryGame.hintsRemaining <= 0) {
    document.getElementById('hint-btn').disabled = true;
  }
  
  showMessage(`Hint used! ${memoryGame.hintsRemaining} hints remaining.`, 'info');
}

// Complete game successfully - UPDATED VERSION
function completeMemoryGame() {
  clearInterval(memoryGame.timerInterval);
  memoryGame.gameCompleted = true;
  
  // Calculate time used
  const timeUsed = memoryGame.initialTime - memoryGame.timer;
  
  // Calculate time bonus: max 10 HP if finished in 30 seconds or less
  let timeBonus = 0;
  if (timeUsed <= 30) {
    timeBonus = 10;
  } else if (timeUsed <= 45) {
    timeBonus = 5;
  }
  
  // Base completion bonus
  const baseBonus = 20;
  
  // Total HP earned
  const totalHP = baseBonus + timeBonus;
  
  // Update outcome screen
  document.getElementById('outcome-title').textContent = 'Pastries Shared!';
  document.getElementById('outcome-text').textContent = 
    `You successfully matched all pastries and shared them equally with ${companion}.`;
  
  // Show stats (matches your HTML)
  document.getElementById('time-bonus').textContent = timeBonus;
  document.getElementById('total-hp').textContent = totalHP;
  
  // Show outcome screen
  document.getElementById('memory-game').classList.add('hidden');
  document.getElementById('bakery-outcome').classList.remove('hidden');
  
  // Award HP
  heal(totalHP);
  
  // Show message based on time
  if (timeBonus === 10) {
    showMessage(`Fast completion! +${totalHP} HP (${baseBonus} base + ${timeBonus} fast bonus)!`, 'success');
  } else if (timeBonus === 5) {
    showMessage(`Good time! +${totalHP} HP (${baseBonus} base + ${timeBonus} time bonus)!`, 'success');
  } else {
    showMessage(`Completed! +${totalHP} HP base reward!`, 'success');
  }
}

// End game (time out)
function endGame(success) {
  clearInterval(memoryGame.timerInterval);
  memoryGame.gameCompleted = true;
  
  if (!success) {
    showMessage('Time\'s up! The pastries burned...', 'error');
    damage(15);
    
    // Show continue option anyway
    setTimeout(() => {
      document.getElementById('memory-game').classList.add('hidden');
      document.getElementById('bakery-outcome').classList.remove('hidden');
      document.getElementById('outcome-title').textContent = 'Pastries Burned!';
      document.getElementById('outcome-text').textContent = 
        `You took too long and the pastries burned. ${companion} looks disappointed.`;
      document.getElementById('time-bonus').textContent = '0';
      document.getElementById('total-hp').textContent = '0';
    }, 1500);
  }
}

// Update game stats
function updateGameStats() {
  document.getElementById('matches').textContent = `${memoryGame.matchedPairs}/${memoryGame.totalPairs}`;
  document.getElementById('moves').textContent = memoryGame.moves;
  document.getElementById('timer').textContent = memoryGame.timer;
}

// Show message
function showMessage(text, type) {
  const messageElement = document.getElementById('game-message');
  messageElement.textContent = text;
  messageElement.className = `game-message ${type}`;
  
  // Clear message after 2 seconds
  setTimeout(() => {
    if (messageElement.textContent === text) {
      messageElement.textContent = '';
      messageElement.className = 'game-message';
    }
  }, 2000);
}

// Complete bakery section
function completeBakery() {
  goTo('materialists');
}

// Update bakery dialogue based on companion
function updateBakeryDialogue() {
  const dialogue = document.getElementById('bakery-dialogue');
  if (!companion || !dialogue) return;
  
  if (companion === 'Tego') {
    dialogue.textContent = "Tego tries to eat all the pastries before you can match them!";
  } else {
    dialogue.textContent = "Mona carefully watches each move, offering strategic advice.";
  }
}
















// ============================================
// POPCORN GAME - SHARED POPCORN MINI-GAME
// ============================================
// ============================================
// SIMPLIFIED POPCORN GAME
// ============================================

// Game Variables
let popcornGameActive = false;
let currentRound = 0;
let totalRounds = 5;
let perfectGrabs = 0;
let totalReactionTime = 0;
let roundStartTime = 0;
let playerReactionTime = 0;
let signalTimeout;
let roundTimeout;

// DOM Elements
let signalLight, signalText, grabBtn, feedbackMessage;
let roundCounter, perfectGrabsDisplay, timingScoreDisplay;
let popcornPieces, startGameBtn, restartBtn;

// Initialize Game
function initPopcornGame() {
    console.log("Initializing simplified popcorn game...");
    
    // Get DOM elements
    signalLight = document.getElementById('signal-light');
    signalText = document.getElementById('signal-text');
    grabBtn = document.getElementById('grab-btn');
    feedbackMessage = document.getElementById('feedback-message');
    roundCounter = document.getElementById('round-counter');
    perfectGrabsDisplay = document.getElementById('perfect-grabs');
    timingScoreDisplay = document.getElementById('timing-score');
    popcornPieces = document.getElementById('popcorn-pieces');
    startGameBtn = document.getElementById('start-game-btn');
    restartBtn = document.getElementById('restart-btn');
    
    // Set up event listeners
    if (grabBtn) {
        grabBtn.addEventListener('click', handleGrabClick);
    }
    
    // Reset game state
    resetPopcornGame();
    
    console.log("Game initialized successfully");
}

// Start game intro
function startPopcornGameIntro() {
    console.log("Starting game intro...");
    const cinemaStart = document.getElementById('cinema-start');
    const popcornGame = document.getElementById('popcorn-game');
    
    if (cinemaStart) cinemaStart.classList.add('hidden');
    if (popcornGame) popcornGame.classList.remove('hidden');
    
    initPopcornGame();
    showFeedback("Click 'Start Game' to begin!", "normal");
}

// Start the game
function startPopcornGame() {
    if (popcornGameActive) return;
    
    console.log("Starting popcorn game...");
    popcornGameActive = true;
    
    // Disable start button, enable restart button
    if (startGameBtn) startGameBtn.disabled = true;
    if (restartBtn) restartBtn.disabled = false;
    
    // Reset stats
    currentRound = 0;
    perfectGrabs = 0;
    totalReactionTime = 0;
    
    // Update displays
    updateStatsDisplay();
    
    // Start first round
    startNextRound();
}

// Start a new round
function startNextRound() {
    if (!popcornGameActive) return;
    
    currentRound++;
    
    if (currentRound > totalRounds) {
        endGame();
        return;
    }
    
    console.log(`Starting round ${currentRound}/${totalRounds}`);
    
    // Update round counter
    if (roundCounter) {
        roundCounter.textContent = `${currentRound}/${totalRounds}`;
    }
    
    // Reset UI for new round
    resetRoundUI();
    
    // Show countdown
    showFeedback(`Round ${currentRound} - Get ready...`, "normal");
    
    // Random delay before signal (1-3 seconds)
    const delay = 1000 + Math.random() * 2000;
    
    // Countdown sequence
    setTimeout(() => {
        signalLight.className = 'signal-light red';
        signalText.textContent = "Ready...";
        showFeedback("Get ready to grab!", "normal");
    }, delay / 2);
    
    // Show yellow warning
    setTimeout(() => {
        signalLight.className = 'signal-light yellow';
        signalText.textContent = "Get set...";
        showFeedback("Almost time...", "normal");
    }, delay - 500);
    
    // Show green signal (GO!)
    signalTimeout = setTimeout(() => {
        signalLight.className = 'signal-light green';
        signalText.textContent = "GRAB NOW!";
        grabBtn.disabled = false;
        grabBtn.classList.add('active');
        roundStartTime = Date.now();
        showFeedback("NOW! Click GRAB!", "good");
    }, delay);
    
    // Auto-fail if player doesn't click (3 seconds)
    roundTimeout = setTimeout(() => {
        if (popcornGameActive) {
            handleRoundEnd(false, 3000); // Too slow
        }
    }, delay + 3000);
}

// Handle grab button click
function handleGrabClick() {
    if (!popcornGameActive || grabBtn.disabled) return;
    
    // Calculate reaction time
    playerReactionTime = Date.now() - roundStartTime;
    
    // Determine if grab was good
    const isPerfect = playerReactionTime < 500; // Less than 0.5 seconds = perfect
    const isGood = playerReactionTime < 1000; // Less than 1 second = good
    
    // Handle round end
    handleRoundEnd(isPerfect || isGood, playerReactionTime);
}

// Handle end of round
function handleRoundEnd(success, reactionTime) {
    // Clear timeouts
    clearTimeout(signalTimeout);
    clearTimeout(roundTimeout);
    
    // Disable grab button
    grabBtn.disabled = true;
    grabBtn.classList.remove('active');
    
    // Remove a popcorn piece
    removePopcornPiece();
    
    if (success) {
        // Good grab
        totalReactionTime += reactionTime;
        
        if (reactionTime < 500) {
            // Perfect grab
            perfectGrabs++;
            signalLight.style.backgroundColor = '#4CAF50';
            signalText.textContent = "PERFECT!";
            showFeedback(`Perfect! ${reactionTime}ms`, "perfect");
        } else {
            // Good grab
            signalLight.style.backgroundColor = '#FFC107';
            signalText.textContent = "Good!";
            showFeedback(`Good! ${reactionTime}ms`, "good");
        }
    } else {
        // Missed or too slow
        signalLight.style.backgroundColor = '#F44336';
        signalText.textContent = "Too slow!";
        showFeedback("Too slow! Try faster next time", "poor");
    }
    
    // Update stats
    updateStatsDisplay();
    
    // Start next round after delay
    setTimeout(startNextRound, 1500);
}

// Remove a popcorn piece
function removePopcornPiece() {
    if (!popcornPieces) return;
    
    // Create popcorn pieces if needed
    const pieces = popcornPieces.querySelectorAll('.popcorn-piece');
    if (pieces.length === 0) {
        generatePopcornPieces();
        return;
    }
    
    // Remove one piece with animation
    const piece = pieces[Math.floor(Math.random() * pieces.length)];
    piece.classList.add('grabbed');
    
    // Remove from DOM after animation
    setTimeout(() => {
        piece.remove();
        
        // Regenerate if running low
        const remaining = popcornPieces.querySelectorAll('.popcorn-piece').length;
        if (remaining < 3) {
            generatePopcornPieces();
        }
    }, 800);
}

// Generate popcorn pieces
function generatePopcornPieces() {
    if (!popcornPieces) return;
    
    // Clear existing pieces
    popcornPieces.innerHTML = '';
    
    // Create 10 popcorn pieces
    for (let i = 0; i < 10; i++) {
        const piece = document.createElement('div');
        piece.className = 'popcorn-piece';
        piece.style.animationDelay = `${Math.random() * 2}s`;
        popcornPieces.appendChild(piece);
    }
}

// Update stats display
function updateStatsDisplay() {
    if (roundCounter) {
        roundCounter.textContent = `${currentRound}/${totalRounds}`;
    }
    
    if (perfectGrabsDisplay) {
        perfectGrabsDisplay.textContent = perfectGrabs;
        
        // Color code
        if (perfectGrabs >= 4) {
            perfectGrabsDisplay.style.color = '#4CAF50';
        } else if (perfectGrabs >= 2) {
            perfectGrabsDisplay.style.color = '#FFC107';
        } else {
            perfectGrabsDisplay.style.color = '#F44336';
        }
    }
    
    if (timingScoreDisplay && perfectGrabs > 0) {
        const avgTime = Math.round(totalReactionTime / perfectGrabs);
        const score = Math.max(0, 100 - Math.floor(avgTime / 10));
        timingScoreDisplay.textContent = `${score}%`;
        
        // Color code
        if (score >= 80) {
            timingScoreDisplay.style.color = '#4CAF50';
        } else if (score >= 60) {
            timingScoreDisplay.style.color = '#FFC107';
        } else if (score >= 40) {
            timingScoreDisplay.style.color = '#FF9800';
        } else {
            timingScoreDisplay.style.color = '#F44336';
        }
    }
}

// Show feedback message
function showFeedback(message, type = "normal") {
    if (!feedbackMessage) return;
    
    feedbackMessage.textContent = message;
    feedbackMessage.className = 'feedback-message';
    
    if (type === "perfect") {
        feedbackMessage.classList.add('perfect');
    } else if (type === "good") {
        feedbackMessage.classList.add('good');
    } else if (type === "poor") {
        feedbackMessage.classList.add('poor');
    }
}

// Reset UI for new round
function resetRoundUI() {
    if (signalLight) {
        signalLight.className = 'signal-light';
        signalLight.style.backgroundColor = '';
    }
    
    if (signalText) {
        signalText.textContent = "Waiting for signal...";
    }
    
    if (grabBtn) {
        grabBtn.disabled = true;
        grabBtn.classList.remove('active');
    }
}

// End the game
function endGame() {
    console.log("Ending game...");
    popcornGameActive = false;
    
    // Calculate final score
    const avgTime = perfectGrabs > 0 ? Math.round(totalReactionTime / perfectGrabs) : 0;
    const finalScore = Math.max(0, 100 - Math.floor(avgTime / 10));
    
    // Show outcome
    showPopcornOutcome(perfectGrabs, finalScore);
}

// Show outcome screen
function showPopcornOutcome(perfectCount, score) {
    console.log("Showing outcome...");
    const popcornGame = document.getElementById('popcorn-game');
    const outcomeScreen = document.getElementById('cinema-outcome');
    const popcornOutcome = document.getElementById('popcorn-outcome');
    const sharedBonus = document.getElementById('shared-bonus');
    const finalPerfectGrabs = document.getElementById('final-perfect-grabs');
    const finalTimingScore = document.getElementById('final-timing-score');
    
    if (!popcornGame || !outcomeScreen || !popcornOutcome || !sharedBonus) return;
    
    popcornGame.classList.add('hidden');
    outcomeScreen.classList.remove('hidden');
    
    // Calculate HP bonus
    let hpBonus = 0;
    let outcomeText = "";
    
    if (perfectCount === 5 && score >= 90) {
        hpBonus = 50;
        outcomeText = "Perfect! Every grab was perfectly timed. The popcorn sharing felt like a synchronized dance. 'I love you' slips out as naturally as reaching for another piece.";
    } else if (perfectCount >= 4) {
        hpBonus = 35;
        outcomeText = "Excellent timing! You shared the popcorn beautifully. The simple act felt intimate, meaningful. The words feel right there, waiting to be said.";
    } else if (perfectCount >= 3) {
        hpBonus = 25;
        outcomeText = "Good job! You found a nice rhythm together. The popcorn sharing was sweet, if a little clumsy. The moment feels warm and comfortable.";
    } else if (perfectCount >= 2) {
        hpBonus = 15;
        outcomeText = "You managed to sync up a couple times. There were some fumbles, but the effort was charming. Sometimes imperfection is more memorable.";
    } else {
        hpBonus = 10;
        outcomeText = "The popcorn sharing was a bit chaotic, but you shared some laughs. Sometimes it's not about perfect timing, but about sharing the moment.";
    }
    
    // Update outcome display
    popcornOutcome.textContent = outcomeText;
    sharedBonus.textContent = `+${hpBonus}`;
    
    if (finalPerfectGrabs) finalPerfectGrabs.textContent = perfectCount;
    if (finalTimingScore) finalTimingScore.textContent = `${score}%`;
    
    // Award HP
    heal(hpBonus);
    
    console.log(`Game ended. Perfect grabs: ${perfectCount}, Score: ${score}%, HP bonus: ${hpBonus}`);
}

// Restart game from game screen
function restartPopcornGame() {
    console.log("Restarting game...");
    
    // Clear any active timeouts
    clearTimeout(signalTimeout);
    clearTimeout(roundTimeout);
    
    // Reset game
    resetPopcornGame();
    
    // Start new game
    startPopcornGame();
}

// Restart game from outcome screen
function restartPopcornGameFromOutcome() {
    console.log("Restarting from outcome screen...");
    
    // Go back to game screen
    const outcomeScreen = document.getElementById('cinema-outcome');
    const popcornGame = document.getElementById('popcorn-game');
    
    if (outcomeScreen) outcomeScreen.classList.add('hidden');
    if (popcornGame) popcornGame.classList.remove('hidden');
    
    // Restart game
    restartPopcornGame();
}

// Skip cinema
function skipCinema() {
    console.log("Skipping cinema...");
    
    // Clear any active timeouts
    clearTimeout(signalTimeout);
    clearTimeout(roundTimeout);
    
    // Show outcome with minimal bonus
    const popcornGame = document.getElementById('popcorn-game');
    const cinemaStart = document.getElementById('cinema-start');
    const outcomeScreen = document.getElementById('cinema-outcome');
    const popcornOutcome = document.getElementById('popcorn-outcome');
    const sharedBonus = document.getElementById('shared-bonus');
    
    if (popcornGame) popcornGame.classList.add('hidden');
    if (cinemaStart) cinemaStart.classList.add('hidden');
    if (outcomeScreen) outcomeScreen.classList.remove('hidden');
    
    if (popcornOutcome) {
        popcornOutcome.textContent = "Sometimes words speak louder than shared snacks. 'I love you' hangs in the air, carried on the scent of buttery popcorn. The moment is quiet, perfect, yours.";
    }
    
    if (sharedBonus) {
        sharedBonus.textContent = "+10";
    }
    
    heal(10);
}

// Reset game state
function resetPopcornGame() {
    console.log("Resetting game...");
    
    popcornGameActive = false;
    currentRound = 0;
    perfectGrabs = 0;
    totalReactionTime = 0;
    roundStartTime = 0;
    playerReactionTime = 0;
    
    // Clear timeouts
    clearTimeout(signalTimeout);
    clearTimeout(roundTimeout);
    
    // Reset UI
    if (signalLight) {
        signalLight.className = 'signal-light';
        signalLight.style.backgroundColor = '';
    }
    
    if (signalText) {
        signalText.textContent = "Waiting for signal...";
    }
    
    if (grabBtn) {
        grabBtn.disabled = true;
        grabBtn.classList.remove('active');
    }
    
    if (startGameBtn) startGameBtn.disabled = false;
    if (restartBtn) restartBtn.disabled = true;
    
    if (roundCounter) roundCounter.textContent = "1/5";
    if (perfectGrabsDisplay) {
        perfectGrabsDisplay.textContent = "0";
        perfectGrabsDisplay.style.color = '';
    }
    
    if (timingScoreDisplay) {
        timingScoreDisplay.textContent = "0%";
        timingScoreDisplay.style.color = '';
    }
    
    // Generate popcorn pieces
    if (popcornPieces) {
        generatePopcornPieces();
    }
    
    showFeedback("Click 'Start Game' to begin!", "normal");
    
    console.log("Game reset complete");
}

// Update goTo function for popcorn game
function goTo(id) {
  lastScreen = currentScreen;
  currentScreen = id;

  document.querySelectorAll(".screen").forEach(s => {
    s.classList.remove("active");
    s.classList.add("hidden");
  });

  const screen = document.getElementById(id);
  screen.classList.remove("hidden");
  
  setTimeout(() => {
    screen.classList.add("active");
    initHUD();
  }, 10);

  updateDialogue(id);
  
  if (id === "fnaf") startFnafGame();
  if (id === "bakery") initBakery();
  if (id === "materialists") {
    setTimeout(() => {
      const cinemaStart = document.getElementById('cinema-start');
      const popcornGame = document.getElementById('popcorn-game');
      const outcomeScreen = document.getElementById('cinema-outcome');
      
      if (cinemaStart) cinemaStart.classList.remove('hidden');
      if (popcornGame) popcornGame.classList.add('hidden');
      if (outcomeScreen) outcomeScreen.classList.add('hidden');
      
      resetPopcornGame();
      initPopcornGame();
    }, 100);
  }
}


// ============================================
// MOBILE SCROLLING & TOUCH SUPPORT
// ============================================

// Initialize mobile-friendly features
function initMobileSupport() {
    console.log("Initializing mobile support...");
    
    // Detect if mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        console.log("Mobile device detected, applying mobile optimizations");
        applyMobileOptimizations();
    }
    
    // Prevent unwanted behaviors
    preventUnwantedBehaviors();
    
    // Ensure proper scrolling
    setupSmoothScrolling();
}

// Apply mobile-specific optimizations
function applyMobileOptimizations() {
    // Add mobile-specific classes
    document.body.classList.add('mobile-device');
    
    // Make sure game area is properly sized
    const gameArea = document.getElementById('popcorn-game');
    if (gameArea) {
        gameArea.classList.add('mobile-game');
    }
    
    // Adjust button sizes for touch
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.classList.add('mobile-touch-target');
    });
    
    // Log viewport info for debugging
    console.log(`Viewport: ${window.innerWidth}x${window.innerHeight}`);
    console.log(`Device Pixel Ratio: ${window.devicePixelRatio}`);
}

// Prevent unwanted mobile behaviors
function preventUnwantedBehaviors() {
    // Prevent zoom on double-tap
    document.addEventListener('dblclick', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    // Prevent pull-to-refresh on game area
    document.addEventListener('touchmove', function(e) {
        const gameArea = document.getElementById('popcorn-game');
        if (gameArea && gameArea.contains(e.target)) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Prevent text selection during gameplay
    document.addEventListener('selectstart', function(e) {
        if (popcornGameActive) {
            e.preventDefault();
        }
    });
}

// Setup smooth scrolling
function setupSmoothScrolling() {
    // Make sure we can scroll to see all content
    window.addEventListener('load', function() {
        setTimeout(scrollToTop, 100);
    });
    
    // Handle orientation changes
    window.addEventListener('orientationchange', function() {
        setTimeout(function() {
            scrollToTop();
            window.scrollTo(0, 0);
        }, 300);
    });
    
    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            scrollToTop();
        }, 250);
    });
}

// Scroll to top of current screen
function scrollToTop() {
    const currentScreen = document.querySelector('.screen.active');
    if (currentScreen) {
        currentScreen.scrollTop = 0;
    }
}

// Update grab button for better touch support
function setupTouchControls() {
    const grabBtn = document.getElementById('grab-btn');
    if (!grabBtn) return;
    
    // Remove any existing listeners
    const newGrabBtn = grabBtn.cloneNode(true);
    grabBtn.parentNode.replaceChild(newGrabBtn, grabBtn);
    
    // Add touch-friendly event listeners
    newGrabBtn.addEventListener('touchstart', function(e) {
        e.preventDefault();
        this.classList.add('touch-active');
        if (typeof handleGrabClick === 'function' && !this.disabled) {
            handleGrabClick();
        }
    }, { passive: false });
    
    newGrabBtn.addEventListener('touchend', function(e) {
        e.preventDefault();
        this.classList.remove('touch-active');
    }, { passive: false });
    
    // Also keep click for desktop
    newGrabBtn.addEventListener('click', function(e) {
        if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            // Only handle click on non-touch devices
            if (typeof handleGrabClick === 'function' && !this.disabled) {
                handleGrabClick();
            }
        }
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initMobileSupport();
    
    // Re-initialize when cinema screen is shown
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.id === 'materialists' && target.classList.contains('active')) {
                    setTimeout(initMobileSupport, 100);
                    setTimeout(setupTouchControls, 200);
                }
            }
        });
    });
    
    const materialistsScreen = document.getElementById('materialists');
    if (materialistsScreen) {
        observer.observe(materialistsScreen, { attributes: true });
    }
});

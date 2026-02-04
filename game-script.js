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
















// ============================================
// LIGHT TRAIL GAME - ZOO LEVEL
// ============================================

// Game Variables
let trailGameActive = false;
let canvas, ctx;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentPattern = 'star';
let currentPath = [];
let allPaths = [];
let guideVisible = false;
let gameStarted = false;
let currentAccuracy = 0;
let currentWarmth = 50; // Starts at 50%

// Pattern Definitions
const patterns = {
  star: {
    name: "Star",
    icon: "⭐",
    points: [
      {x: 200, y: 50},
      {x: 240, y: 180},
      {x: 380, y: 180},
      {x: 260, y: 260},
      {x: 300, y: 390},
      {x: 200, y: 300},
      {x: 100, y: 390},
      {x: 140, y: 260},
      {x: 20, y: 180},
      {x: 160, y: 180},
      {x: 200, y: 50}
    ],
    difficulty: 1.2
  },
  heart: {
    name: "Heart",
    icon: "❤️",
    points: [
      {x: 200, y: 100},
      {x: 260, y: 50},
      {x: 320, y: 100},
      {x: 320, y: 180},
      {x: 200, y: 320},
      {x: 80, y: 180},
      {x: 80, y: 100},
      {x: 140, y: 50},
      {x: 200, y: 100}
    ],
    difficulty: 1.5
  },
  spiral: {
    name: "Spiral",
    icon: "🌀",
    points: [],
    difficulty: 1.8
  },
  snowflake: {
    name: "Snowflake",
    icon: "❄️",
    points: [],
    difficulty: 2.0
  }
};

// Initialize the game
function initTrailGame() {
    console.log("Initializing Light Trail game...");
    
    // Get canvas and context
    canvas = document.getElementById('light-canvas');
    ctx = canvas.getContext('2d');
    
    // Set canvas size (adjust for mobile)
    const container = canvas.parentElement;
    if (container) {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    } else {
        canvas.width = 400;
        canvas.height = 400;
    }
    
    // Set up event listeners for drawing
    setupDrawingEvents();
    
    // Initialize pattern
    generatePatternPoints();
    selectPattern('star');
    
    // Reset game state
    resetDrawing();
    
    console.log("Light Trail game initialized");
}

// Set up drawing event listeners
function setupDrawingEvents() {
    if (!canvas) return;
    
    // Clear existing listeners
    canvas.removeEventListener('mousedown', startDrawingMouse);
    canvas.removeEventListener('mousemove', drawMouse);
    canvas.removeEventListener('mouseup', stopDrawingMouse);
    canvas.removeEventListener('mouseleave', stopDrawingMouse);
    
    canvas.removeEventListener('touchstart', startDrawingTouch);
    canvas.removeEventListener('touchmove', drawTouch);
    canvas.removeEventListener('touchend', stopDrawingTouch);
    
    // Mouse events
    canvas.addEventListener('mousedown', startDrawingMouse);
    canvas.addEventListener('mousemove', drawMouse);
    canvas.addEventListener('mouseup', stopDrawingMouse);
    canvas.addEventListener('mouseleave', stopDrawingMouse);
    
    // Touch events
    canvas.addEventListener('touchstart', startDrawingTouch, { passive: false });
    canvas.addEventListener('touchmove', drawTouch, { passive: false });
    canvas.addEventListener('touchend', stopDrawingTouch);
    
    // Prevent default touch behaviors
    canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    canvas.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
}

// Generate pattern points for spiral and snowflake
function generatePatternPoints() {
    // Generate spiral points
    const spiralPoints = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(canvas.width, canvas.height) * 0.4;
    
    for (let i = 0; i < 720; i += 5) {
        const angle = i * (Math.PI / 180);
        const radius = maxRadius * (i / 720);
        spiralPoints.push({
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        });
    }
    patterns.spiral.points = spiralPoints;
    
    // Generate snowflake points
    const snowflakePoints = [];
    const radius = maxRadius * 0.8;
    const branches = 6;
    
    for (let i = 0; i < 360; i += 30) {
        const angle = i * (Math.PI / 180);
        snowflakePoints.push({
            x: centerX,
            y: centerY
        });
        snowflakePoints.push({
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        });
        snowflakePoints.push({
            x: centerX + radius * 0.6 * Math.cos(angle + 0.3),
            y: centerY + radius * 0.6 * Math.sin(angle + 0.3)
        });
        snowflakePoints.push({
            x: centerX + radius * 0.6 * Math.cos(angle - 0.3),
            y: centerY + radius * 0.6 * Math.sin(angle - 0.3)
        });
    }
    patterns.snowflake.points = snowflakePoints;
}

// Start Zoo Game
function startZooGame() {
    console.log("Starting Zoo game...");
    const startScreen = document.getElementById('zoo-start');
    const trailGame = document.getElementById('trail-game');
    
    if (startScreen) startScreen.classList.add('hidden');
    if (trailGame) trailGame.classList.remove('hidden');
    
    // Initialize the game
    setTimeout(initTrailGame, 100);
    
    // Update dialogue
    updateTrailDialogue("Trace the pattern in the frosty air... I'll watch your hands.");
}

// Start the actual drawing game
function startTrailGame() {
    if (trailGameActive) return;
    
    console.log("Starting Light Trail drawing...");
    trailGameActive = true;
    gameStarted = true;
    
    // Update UI
    const startBtn = document.getElementById('start-game-btn');
    if (startBtn) {
        startBtn.disabled = true;
        startBtn.style.opacity = '0.5';
        startBtn.style.cursor = 'not-allowed';
    }
    document.getElementById('check-btn').disabled = false;
    
    // Clear canvas
    clearCanvas();
    
    // Draw guide if enabled
    if (guideVisible) {
        drawGuidePattern();
    }
    
    // Update instructions
    document.getElementById('draw-instructions').textContent = "Trace the pattern! Take your time...";
    
    // Update dialogue
    updateTrailDialogue("Beautiful... your lines are like light itself.");
}

// Select a pattern
function selectPattern(pattern) {
    if (!patterns[pattern]) return;
    
    currentPattern = pattern;
    const patternInfo = patterns[pattern];
    
    // Update UI
    document.getElementById('pattern-name').textContent = `${patternInfo.icon} ${patternInfo.name} Pattern`;
    
    // Update active button
    document.querySelectorAll('.pattern-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-pattern="${pattern}"]`).classList.add('active');
    
    // Draw preview
    drawPatternPreview(pattern);
    
    // Reset drawing if game is active
    if (trailGameActive) {
        resetDrawing();
    }
    
    console.log(`Selected pattern: ${pattern}`);
}

// Draw pattern preview
function drawPatternPreview(pattern) {
    const preview = document.getElementById('pattern-preview');
    if (!preview) return;
    
    const patternInfo = patterns[pattern];
    
    // Clear preview
    preview.innerHTML = '';
    
    // Create SVG
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 400 400");
    svg.setAttribute("width", "120");
    svg.setAttribute("height", "120");
    
    // Create path
    const path = document.createElementNS(svgNS, "path");
    let pathData = '';
    
    patternInfo.points.forEach((point, index) => {
        if (index === 0) {
            pathData += `M ${point.x} ${point.y}`;
        } else {
            pathData += ` L ${point.x} ${point.y}`;
        }
    });
    
    // Close the path if it's not a spiral
    if (pattern !== 'spiral') {
        pathData += ' Z';
    }
    
    path.setAttribute("d", pathData);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#87CEEB");
    path.setAttribute("stroke-width", "3");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    
    svg.appendChild(path);
    preview.appendChild(svg);
}

// Draw guide pattern on canvas
function drawGuidePattern() {
    if (!ctx || !patterns[currentPattern]) return;
    
    const pattern = patterns[currentPattern];
    ctx.save();
    ctx.beginPath();
    
    pattern.points.forEach((point, index) => {
        const scaledX = point.x * (canvas.width / 400);
        const scaledY = point.y * (canvas.height / 400);
        
        if (index === 0) {
            ctx.moveTo(scaledX, scaledY);
        } else {
            ctx.lineTo(scaledX, scaledY);
        }
    });
    
    if (currentPattern !== 'spiral') {
        ctx.closePath();
    }
    
    ctx.strokeStyle = 'rgba(135, 206, 235, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
}

// Toggle guide visibility
function toggleGuide() {
    guideVisible = !guideVisible;
    const guideBtn = document.getElementById('guide-btn');
    
    if (guideVisible) {
        guideBtn.textContent = '👁️ Hide Guide';
        guideBtn.style.backgroundColor = 'rgba(135, 206, 235, 0.2)';
        if (ctx) {
            clearCanvas();
            drawGuidePattern();
            redrawUserPaths();
        }
    } else {
        guideBtn.textContent = '👁️ Show Guide';
        guideBtn.style.backgroundColor = '';
        if (ctx) {
            clearCanvas();
            redrawUserPaths();
        }
    }
}

// Mouse drawing functions
function startDrawingMouse(e) {
    if (!trailGameActive || !gameStarted) return;
    
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    isDrawing = true;
    
    currentPath = [{x: lastX, y: lastY}];
    allPaths.push(currentPath);
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
}

function drawMouse(e) {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    drawLine(lastX, lastY, currentX, currentY);
    
    lastX = currentX;
    lastY = currentY;
    currentPath.push({x: currentX, y: currentY});
    
    // Increase warmth slightly while drawing
    if (currentWarmth < 100) {
        currentWarmth = Math.min(100, currentWarmth + 0.1);
        updateWarmthDisplay();
    }
}

function stopDrawingMouse() {
    if (!isDrawing) return;
    
    isDrawing = false;
    ctx.closePath();
    
    // Decrease warmth slightly when stopping
    currentWarmth = Math.max(50, currentWarmth - 0.5);
    updateWarmthDisplay();
}

// Touch drawing functions
function startDrawingTouch(e) {
    if (!trailGameActive || !gameStarted) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    
    lastX = touch.clientX - rect.left;
    lastY = touch.clientY - rect.top;
    isDrawing = true;
    
    currentPath = [{x: lastX, y: lastY}];
    allPaths.push(currentPath);
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
}

function drawTouch(e) {
    if (!isDrawing) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    
    const currentX = touch.clientX - rect.left;
    const currentY = touch.clientY - rect.top;
    
    drawLine(lastX, lastY, currentX, currentY);
    
    lastX = currentX;
    lastY = currentY;
    currentPath.push({x: currentX, y: currentY});
    
    // Increase warmth slightly while drawing
    if (currentWarmth < 100) {
        currentWarmth = Math.min(100, currentWarmth + 0.1);
        updateWarmthDisplay();
    }
}

function stopDrawingTouch() {
    if (!isDrawing) return;
    
    isDrawing = false;
    ctx.closePath();
    
    // Decrease warmth slightly when stopping
    currentWarmth = Math.max(50, currentWarmth - 0.5);
    updateWarmthDisplay();
}

// Draw a line between points
function drawLine(x1, y1, x2, y2) {
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = `rgba(135, 206, 235, ${0.7 + Math.random() * 0.3})`;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    // Add a glow effect
    ctx.shadowColor = 'rgba(135, 206, 235, 0.8)';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
}

// Clear canvas
function clearCanvas() {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw a dark background
    ctx.fillStyle = 'rgba(5, 15, 30, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines
    drawGrid();
    
    // Redraw guide if visible
    if (guideVisible) {
        drawGuidePattern();
    }
}

// Draw grid for reference
function drawGrid() {
    ctx.strokeStyle = 'rgba(135, 206, 235, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Redraw all user paths
function redrawUserPaths() {
    if (!ctx || allPaths.length === 0) return;
    
    allPaths.forEach(path => {
        if (path.length < 2) return;
        
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        
        for (let i = 1; i < path.length; i++) {
            ctx.lineTo(path[i].x, path[i].y);
        }
        
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'rgba(135, 206, 235, 0.8)';
        ctx.stroke();
        
        // Glow effect
        ctx.shadowColor = 'rgba(135, 206, 235, 0.5)';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
    });
}

// Undo last stroke
function undoLastStroke() {
    if (allPaths.length === 0) return;
    
    allPaths.pop();
    clearCanvas();
    redrawUserPaths();
    
    // Update dialogue
    updateTrailDialogue("That's okay... try again.");
}

// Clear drawing
function clearDrawing() {
    allPaths = [];
    currentPath = [];
    clearCanvas();
    
    // Update dialogue
    updateTrailDialogue("Fresh start... I believe in you.");
}

// Check drawing accuracy
function checkDrawing() {
    if (allPaths.length === 0) {
        updateTrailDialogue("You haven't drawn anything yet!");
        return;
    }
    
    console.log("Checking drawing accuracy...");
    
    // Calculate accuracy
    const accuracy = calculateAccuracy();
    currentAccuracy = accuracy;
    
    // Update display
    updateAccuracyDisplay(accuracy);
    
    // Calculate warmth gain based on accuracy
    const warmthGain = Math.floor(accuracy / 10);
    currentWarmth = Math.min(100, currentWarmth + warmthGain);
    updateWarmthDisplay();
    
    // Update dialogue based on accuracy
    if (accuracy >= 80) {
        updateTrailDialogue("Perfect! The lights seem to dance in approval.");
    } else if (accuracy >= 60) {
        updateTrailDialogue("Very good! You captured the essence beautifully.");
    } else if (accuracy >= 40) {
        updateTrailDialogue("Not bad! With practice, you'll get even better.");
    } else {
        updateTrailDialogue("A good attempt! The pattern was quite challenging.");
    }
    
    // Enable continue to outcome
    setTimeout(() => {
        document.getElementById('check-btn').textContent = "✨ See Results";
        document.getElementById('check-btn').onclick = finishTrailGame;
    }, 1000);
}

// Calculate accuracy - FIXED VERSION
function calculateAccuracy() {
    const pattern = patterns[currentPattern];
    const patternPoints = pattern.points;
    
    if (patternPoints.length === 0 || allPaths.length === 0) return 0;
    
    // Flatten all user paths into single array
    let userPoints = [];
    allPaths.forEach(path => {
        userPoints = userPoints.concat(path);
    });
    
    if (userPoints.length < 10) return 15; // Too few points drawn
    
    // Scale pattern points to canvas size
    const scaleX = canvas.width / 400;
    const scaleY = canvas.height / 400;
    const scaledPattern = patternPoints.map(p => ({
        x: p.x * scaleX,
        y: p.y * scaleY
    }));
    
    // Calculate average distance from user points to nearest pattern points
    let totalDistance = 0;
    let checkedPoints = Math.min(userPoints.length, 100); // Sample up to 100 points
    let step = Math.max(1, Math.floor(userPoints.length / checkedPoints));
    
    for (let i = 0; i < userPoints.length; i += step) {
        const userPoint = userPoints[i];
        
        // Find nearest pattern point
        let minDist = Infinity;
        for (let j = 0; j < scaledPattern.length; j++) {
            const patternPoint = scaledPattern[j];
            const dx = userPoint.x - patternPoint.x;
            const dy = userPoint.y - patternPoint.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < minDist) {
                minDist = dist;
            }
        }
        
        totalDistance += minDist;
    }
    
    const avgDistance = totalDistance / checkedPoints;
    
    // Calculate accuracy based on average distance
    // Closer = higher accuracy
    const maxAllowedDistance = Math.min(canvas.width, canvas.height) * 0.3;
    let accuracy = Math.max(0, 100 - (avgDistance / maxAllowedDistance) * 100);
    
    // Apply pattern difficulty multiplier
    accuracy = accuracy / pattern.difficulty;
    
    // Add small bonus if they drew enough points
    if (userPoints.length > patternPoints.length * 0.5) {
        accuracy += 10;
    }
    
    // Cap between 0-95
    accuracy = Math.max(0, Math.min(95, accuracy));
    
    return Math.round(accuracy);
}

// Update accuracy display
function updateAccuracyDisplay(accuracy) {
    const accuracyValue = document.getElementById('accuracy-value');
    const accuracyFill = document.getElementById('accuracy-fill');
    
    if (accuracyValue) accuracyValue.textContent = `${accuracy}%`;
    if (accuracyFill) accuracyFill.style.width = `${accuracy}%`;
    
    // Color based on accuracy
    if (accuracy >= 80) {
        accuracyFill.style.background = 'linear-gradient(90deg, #F44336, #FF9800, #4CAF50)';
    } else if (accuracy >= 60) {
        accuracyFill.style.background = 'linear-gradient(90deg, #F44336, #FF9800)';
    } else {
        accuracyFill.style.background = '#F44336';
    }
}

// Update warmth display
function updateWarmthDisplay() {
    const warmthValue = document.getElementById('warmth-value');
    if (warmthValue) {
        warmthValue.textContent = `${Math.round(currentWarmth)}%`;
        
        // Color based on warmth
        if (currentWarmth >= 80) {
            warmthValue.style.color = '#FF9800';
        } else if (currentWarmth >= 60) {
            warmthValue.style.color = '#FFB74D';
        } else {
            warmthValue.style.color = '#87CEEB';
        }
    }
}

// Finish game and show outcome
function finishTrailGame() {
    console.log("Finishing Light Trail game...");
    
    // Calculate final HP bonus
    const accuracyBonus = Math.floor(currentAccuracy / 4); // Up to 25 HP
    const warmthBonus = Math.floor(currentWarmth / 4); // Up to 25 HP
    const totalBonus = accuracyBonus + warmthBonus;
    
    // Show outcome screen
    const trailGame = document.getElementById('trail-game');
    const outcomeScreen = document.getElementById('zoo-outcome');
    
    if (trailGame) trailGame.classList.add('hidden');
    if (outcomeScreen) outcomeScreen.classList.remove('hidden');
    
    // Update outcome display
    document.getElementById('final-accuracy').textContent = `${currentAccuracy}%`;
    document.getElementById('final-warmth').textContent = `+${Math.round(currentWarmth - 50)}%`;
    document.getElementById('chocolate-bonus').textContent = `+${totalBonus} HP`;
    
    // Update outcome text
    const outcomeText = document.getElementById('light-outcome');
    if (outcomeText) {
        if (currentAccuracy >= 80 && currentWarmth >= 80) {
            outcomeText.textContent = "Your drawing was perfect! The lights shimmered in perfect sync with your movements. Your companion's hand finds yours, warmer than any fire.";
        } else if (currentAccuracy >= 60) {
            outcomeText.textContent = "A beautiful attempt! The lights twinkled in appreciation. Your shared warmth makes the cold night feel cozy.";
        } else {
            outcomeText.textContent = "The effort was what mattered most. In the shared laughter over wobbly lines, you found more warmth than any perfect drawing could provide.";
        }
    }
    
    // Draw final pattern in outcome
    drawFinalPattern();
    
    // Award HP
    heal(totalBonus);
    
    console.log(`Game completed. Accuracy: ${currentAccuracy}%, Warmth: ${currentWarmth}%, HP Bonus: ${totalBonus}`);
}

// Draw final pattern in outcome screen
function drawFinalPattern() {
    const finalPattern = document.getElementById('final-pattern-display');
    if (!finalPattern) return;
    
    finalPattern.innerHTML = '';
    
    // Create SVG
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 400 400");
    svg.setAttribute("width", "200");
    svg.setAttribute("height", "200");
    
    // Draw target pattern
    const targetPath = document.createElementNS(svgNS, "path");
    const pattern = patterns[currentPattern];
    let pathData = '';
    
    pattern.points.forEach((point, index) => {
        if (index === 0) {
            pathData += `M ${point.x} ${point.y}`;
        } else {
            pathData += ` L ${point.x} ${point.y}`;
        }
    });
    
    if (currentPattern !== 'spiral') {
        pathData += ' Z';
    }
    
    targetPath.setAttribute("d", pathData);
    targetPath.setAttribute("fill", "none");
    targetPath.setAttribute("stroke", "rgba(135, 206, 235, 0.3)");
    targetPath.setAttribute("stroke-width", "3");
    targetPath.setAttribute("stroke-linecap", "round");
    targetPath.setAttribute("stroke-linejoin", "round");
    
    svg.appendChild(targetPath);
    
    // Draw user's path (simplified)
    const userPath = document.createElementNS(svgNS, "path");
    if (allPaths.length > 0 && allPaths[0].length > 0) {
        let userPathData = `M ${allPaths[0][0].x * (400/canvas.width)} ${allPaths[0][0].y * (400/canvas.height)}`;
        
        allPaths.forEach(path => {
            path.forEach((point, index) => {
                if (index > 0) {
                    userPathData += ` L ${point.x * (400/canvas.width)} ${point.y * (400/canvas.height)}`;
                }
            });
        });
        
        userPath.setAttribute("d", userPathData);
        userPath.setAttribute("fill", "none");
        userPath.setAttribute("stroke", "#87CEEB");
        userPath.setAttribute("stroke-width", "2");
        userPath.setAttribute("stroke-linecap", "round");
        svg.appendChild(userPath);
    }
    
    finalPattern.appendChild(svg);
}

// Update trail dialogue
function updateTrailDialogue(text) {
    const dialogue = document.getElementById('trail-dialogue');
    if (dialogue) {
        dialogue.textContent = `"${text}"`;
    }
}

// Reset drawing state
function resetDrawing() {
    allPaths = [];
    currentPath = [];
    currentAccuracy = 0;
    currentWarmth = 50;
    
    updateAccuracyDisplay(0);
    updateWarmthDisplay();
    clearCanvas();
    
    document.getElementById('check-btn').disabled = true;
    document.getElementById('check-btn').textContent = "✨ Check My Pattern";
    document.getElementById('check-btn').onclick = checkDrawing;
}

// Replay game - REMOVED (no longer used)
// function replayTrailGame() {
//     const outcomeScreen = document.getElementById('zoo-outcome');
//     const trailGame = document.getElementById('trail-game');
//     
//     if (outcomeScreen) outcomeScreen.classList.add('hidden');
//     if (trailGame) trailGame.classList.remove('hidden');
//     
//     restartDrawing();
//     startTrailGame();
// }

// Skip to chocolate
function skipToChocolate() {
    console.log("Skipping to hot chocolate...");
    const startScreen = document.getElementById('zoo-start');
    const outcomeScreen = document.getElementById('zoo-outcome');
    
    if (startScreen) startScreen.classList.add('hidden');
    if (outcomeScreen) outcomeScreen.classList.remove('hidden');
    
    // Give minimal bonus
    heal(15);
    
    // Update outcome for skip
    document.getElementById('final-accuracy').textContent = "Skipped";
    document.getElementById('final-warmth').textContent = "+0%";
    document.getElementById('chocolate-bonus').textContent = "+15 HP";
    
    document.getElementById('light-outcome').textContent = 
        "Sometimes the warmest moments don't need perfect patterns. The simple act of being together, hot chocolates in hand, says everything that needs to be said.";
}

// Just get chocolate
function justGetChocolate() {
    heal(30);
    goTo('fnaf');
}

// Get too cold
function getTooCold() {
    damage(20);
    goTo('fnaf');
}

// Update goTo function for zoo level
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
    if (id === "zoo") {
        setTimeout(() => {
            const zooStart = document.getElementById('zoo-start');
            const trailGame = document.getElementById('trail-game');
            const zooOutcome = document.getElementById('zoo-outcome');
            
            if (zooStart) zooStart.classList.remove('hidden');
            if (trailGame) trailGame.classList.add('hidden');
            if (zooOutcome) zooOutcome.classList.add('hidden');
            
            initTrailGame();
        }, 100);
    }
}

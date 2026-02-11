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
    initHUD();
  }, 10);

  updateDialogue(id);
  
  // Initialize specific games based on screen
  if (id === "fnaf") startFnafGame();
  if (id === "bakery") initBakery();
  
  if (id === "materialists") {
    // Make sure cinema elements exist before using them
    setTimeout(() => {
      const cinemaStart = document.getElementById('cinema-start');
      const popcornGame = document.getElementById('popcorn-game');
      const outcomeScreen = document.getElementById('cinema-outcome');
      
      if (cinemaStart) cinemaStart.classList.remove('hidden');
      if (popcornGame) popcornGame.classList.add('hidden');
      if (outcomeScreen) outcomeScreen.classList.add('hidden');
      
      // Reset popcorn game
      if (typeof resetPopcornGame === 'function') {
        resetPopcornGame();
      }
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
      
      // Reset trail game
      if (canvas) {
        trailGameActive = false;
        allPaths = [];
        guideVisible = false;
      }
    }, 100);
  }
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
    goTo("victory");
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
// Complete game successfully - UPDATED WITH PRETTIER OUTCOME
function completeMemoryGame() {
  clearInterval(memoryGame.timerInterval);
  memoryGame.gameCompleted = true;
  
  // Calculate time used
  const timeUsed = memoryGame.initialTime - memoryGame.timer;
  
  // Calculate time bonus
  let timeBonus = 0;
  if (timeUsed <= 30) timeBonus = 10;
  else if (timeUsed <= 45) timeBonus = 5;
  
  const baseBonus = 20;
  const totalHP = baseBonus + timeBonus;
  
  // Get companion name
  const companionName = companion || 'your companion';
  
  // Outcome title
  document.getElementById('outcome-title').innerHTML = '✦ pastries shared ✦';
  
  // Companion note
  const companionNote = document.getElementById('companion-outcome-note');
  if (companion === 'Tego') {
    companionNote.textContent = `tego: "you still owe me a bite of that strawberry thing."`;
  } else if (companion === 'Mona') {
    companionNote.textContent = `mona: "we should go back. tomorrow?"`;
  } else {
    companionNote.textContent = `the paragliders are still out there, probably.`;
  }
  
  // Update stats
  document.getElementById('time-bonus').textContent = timeBonus;
  document.getElementById('total-hp').textContent = totalHP;
  
  // Show outcome screen
  document.getElementById('memory-game').classList.add('hidden');
  document.getElementById('bakery-outcome').classList.remove('hidden');
  
  // Award HP
  heal(totalHP);
  
  // Optional: show a little message
  if (timeBonus === 10) {
    showMessage(`fast workers! +${timeBonus} bonus hp`, 'success');
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

// ---------- BAKERY SECRET CHEST ----------
function openBakerySecret() {
  const chest = document.getElementById('secret-bakery-chest');
  const chestClosed = chest.querySelector('.secret-chest-closed');
  const chestContents = document.getElementById('bakery-secret-contents');
  const video = document.getElementById('lusk-video');
  
  // Add opening animation
  chest.classList.add('opening');
  
  setTimeout(() => {
    chest.classList.remove('opening');
    chestClosed.classList.add('hidden');
    chestContents.classList.remove('hidden');
    // Play video when chest opens
    if (video) video.play();
  }, 300);
}

function closeBakerySecret() {
  const chest = document.getElementById('secret-bakery-chest');
  const chestClosed = chest.querySelector('.secret-chest-closed');
  const chestContents = document.getElementById('bakery-secret-contents');
  const video = document.getElementById('lusk-video');
  
  // Pause video when closing chest
  if (video) video.pause();
  chestContents.classList.add('hidden');
  chestClosed.classList.remove('hidden');
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
// SIMPLIFIED POPCORN GAME
// ============================================

// Game Variables
let popcornGameActive = false;
let currentRound = 0;
let perfectGrabs = 0;
let greenLightTime = 0;

// DOM Elements
let signalLight, signalText, grabBtn;
let roundCounter, perfectGrabsDisplay;
let startGameBtn;

// Initialize Game
function initPopcornGame() {
    console.log("Initializing popcorn game...");
    
    // Get DOM elements
    signalLight = document.getElementById('signal-light');
    signalText = document.getElementById('signal-text');
    grabBtn = document.getElementById('grab-btn');
    roundCounter = document.getElementById('round-counter');
    perfectGrabsDisplay = document.getElementById('perfect-grabs');
    startGameBtn = document.getElementById('start-game-btn');
    
    // Set up event listeners
    if (grabBtn) {
        grabBtn.addEventListener('click', handleGrabClick);
    }
    
    // Reset game state
    resetPopcornGame();
}

// Start the game
function startPopcornGame() {
    if (popcornGameActive) return;
    
    popcornGameActive = true;
    
    // Disable start button
    if (startGameBtn) startGameBtn.disabled = true;
    
    // Reset stats
    currentRound = 0;
    perfectGrabs = 0;
    
    // Update displays
    updateStatsDisplay();
    
    // Start first round
    startNextRound();
}

// Start a new round
function startNextRound() {
    if (!popcornGameActive) return;
    
    // ❌ REMOVE THIS LINE
    // greenLightTime = Date.now();
    
    // Remove this duplicate line too:
    // signalLight.className = 'signal-light green';
    
    currentRound++;
    
    if (currentRound > 5) {
        endGame();
        return;
    }
    
    // Update round counter
    if (roundCounter) {
        roundCounter.textContent = `${currentRound}/5`;
    }
    
    // Reset UI
    signalLight.className = 'signal-light';
    signalText.textContent = "Get ready...";
    grabBtn.disabled = true;
    grabBtn.textContent = "🍿 WAITING...";
    
    // Random delay (1-2.5 seconds)
    const delay = 1000 + Math.random() * 1500;
    
    // Show green signal after delay
    setTimeout(() => {
        if (!popcornGameActive) return;
        
        greenLightTime = Date.now(); // ✅ SET IT HERE!
        
        signalLight.className = 'signal-light green';
        signalText.textContent = "GRAB NOW!";
        grabBtn.disabled = false;
        grabBtn.textContent = "🍿 GRAB NOW!";
        grabBtn.classList.add('active');
        
        // Auto-fail if too slow (2 seconds)
        setTimeout(() => {
            if (grabBtn.disabled === false && popcornGameActive) {
                handleRoundEnd(false);
            }
        }, 2000);
    }, delay);
}

function handleGrabClick() {
    if (!popcornGameActive || grabBtn.disabled) return;
    
    // Calculate actual reaction time
    const reactionTime = Date.now() - greenLightTime;
    
    // Perfect: < 500ms, Good: < 1000ms, Slow: < 2000ms
    const isPerfect = reactionTime < 500;
    const isGood = reactionTime < 1000;
    const success = reactionTime < 2000;
    
    handleRoundEnd(success, isPerfect);
}

// Handle end of round
function handleRoundEnd(success, isPerfect = false) {
    // Disable grab button
    grabBtn.disabled = true;
    grabBtn.classList.remove('active');
    grabBtn.textContent = "🍿 WAITING...";
    
    if (success) {
        if (isPerfect) {
            // Perfect grab
            perfectGrabs++;
            signalLight.style.backgroundColor = '#4CAF50';
            signalText.textContent = "PERFECT!";
        } else {
            // Good grab
            signalLight.style.backgroundColor = '#FFC107';
            signalText.textContent = "Good!";
        }
    } else {
        // Missed
        signalLight.style.backgroundColor = '#F44336';
        signalText.textContent = "Too slow!";
    }
    
    // Update stats
    updateStatsDisplay();
    
    // Start next round after delay
    setTimeout(startNextRound, 1500);
}

// Update stats display
function updateStatsDisplay() {
    if (roundCounter) {
        roundCounter.textContent = `${currentRound}/5`;
    }
    
    if (perfectGrabsDisplay) {
        perfectGrabsDisplay.textContent = perfectGrabs;
    }
}

// End the game
function endGame() {
    popcornGameActive = false;
    
    // Calculate HP bonus
    let hpBonus = 10;
    let outcomeText = "";
    
    if (perfectGrabs === 5) {
        hpBonus = 50;
        outcomeText = "Perfect! Every grab was perfectly timed.";
    } else if (perfectGrabs >= 3) {
        hpBonus = 25;
        outcomeText = "Great timing! You shared the popcorn beautifully.";
    } else if (perfectGrabs >= 1) {
        hpBonus = 15;
        outcomeText = "Good job! You found a nice rhythm together.";
    } else {
        outcomeText = "The popcorn sharing was fun anyway!";
    }
    
    // Show outcome
    showPopcornOutcome(hpBonus, outcomeText);
}

// Show outcome screen
function showPopcornOutcome(hpBonus, outcomeText) {
    const popcornGame = document.getElementById('popcorn-game');
    const outcomeScreen = document.getElementById('cinema-outcome');
    const popcornOutcome = document.getElementById('popcorn-outcome');
    const sharedBonus = document.getElementById('shared-bonus');
    const finalPerfectGrabs = document.getElementById('final-perfect-grabs');
    
    if (!popcornGame || !outcomeScreen) return;
    
    popcornGame.classList.add('hidden');
    outcomeScreen.classList.remove('hidden');
    
    // Update outcome display
    if (popcornOutcome) popcornOutcome.textContent = outcomeText;
    if (sharedBonus) sharedBonus.textContent = `+${hpBonus}`;
    if (finalPerfectGrabs) finalPerfectGrabs.textContent = perfectGrabs;
    
    // Award HP
    heal(hpBonus);
}

// Restart game
function restartPopcornGame() {
    // Reset game
    resetPopcornGame();
    
    // Start new game
    startPopcornGame();
}


// Reset game state
function resetPopcornGame() {
    popcornGameActive = false;
    currentRound = 0;
    perfectGrabs = 0;
    
    // Reset UI
    if (signalLight) {
        signalLight.className = 'signal-light';
        signalLight.style.backgroundColor = '';
    }
    
    if (signalText) {
        signalText.textContent = "Waiting to start...";
    }
    
    if (grabBtn) {
        grabBtn.disabled = true;
        grabBtn.classList.remove('active');
        grabBtn.textContent = "🍿 WAITING...";
    }
    
    if (startGameBtn) startGameBtn.disabled = false;
    
    if (roundCounter) roundCounter.textContent = "0/5";
    if (perfectGrabsDisplay) perfectGrabsDisplay.textContent = "0";
}

// Start popcorn game from intro
function startPopcornGameIntro() {
    const cinemaStart = document.getElementById('cinema-start');
    const popcornGame = document.getElementById('popcorn-game');
    
    if (cinemaStart) cinemaStart.classList.add('hidden');
    if (popcornGame) popcornGame.classList.remove('hidden');
    
    initPopcornGame();
}

// Restart from outcome
function restartPopcornGameFromOutcome() {
    const outcomeScreen = document.getElementById('cinema-outcome');
    const popcornGame = document.getElementById('popcorn-game');
    
    if (outcomeScreen) outcomeScreen.classList.add('hidden');
    if (popcornGame) popcornGame.classList.remove('hidden');
    
    restartPopcornGame();
}




























// ============================================
// FIXED LIGHT TRAIL GAME
// ============================================

// Game Variables
let trailGameActive = false;
let canvas, ctx;
let isDrawing = false;
let currentPattern = 'star';
let allPaths = [];
let guideVisible = false;
let canvasScale = 1;

// Fixed Pattern Definitions
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
    ]
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
    ]
  }
};

// Initialize the game - FIXED
// Initialize the game - FIXED
function initTrailGame() {
    // Get canvas and context
    canvas = document.getElementById('light-canvas');
    ctx = canvas.getContext('2d');
    
    // FIXED: Set proper canvas size
    const container = document.querySelector('.drawing-area');
    if (container) {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        canvasScale = 400 / canvas.width;
    } else {
        canvas.width = 400;
        canvas.height = 400;
        canvasScale = 1;
    }
    
    // Fix for HiDPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.width * dpr;
    canvas.height = canvas.height * dpr;
    ctx.scale(dpr, dpr);
    
    // Set up event listeners
    setupDrawingEvents();
    
    // Select default pattern
    selectPattern('star');
    
    // Reset game state
    resetDrawing();
    
    // ✅ Make sure game is NOT active yet
    trailGameActive = false;
}
// FIXED: Get correct canvas coordinates
function getCanvasCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    
    if (e.type.includes('touch')) {
        // For touch events
        const touch = e.touches[0] || e.changedTouches[0];
        const x = (touch.clientX - rect.left) * (canvas.width / (rect.width * window.devicePixelRatio));
        const y = (touch.clientY - rect.top) * (canvas.height / (rect.height * window.devicePixelRatio));
        return { x, y };
    } else {
        // For mouse events
        const x = (e.clientX - rect.left) * (canvas.width / (rect.width * window.devicePixelRatio));
        const y = (e.clientY - rect.top) * (canvas.height / (rect.height * window.devicePixelRatio));
        return { x, y };
    }
}

// Set up drawing event listeners - FIXED
function setupDrawingEvents() {
    if (!canvas) return;
    
    // Clear existing listeners
    canvas.removeEventListener('mousedown', startDrawing);
    canvas.removeEventListener('mousemove', draw);
    canvas.removeEventListener('mouseup', stopDrawing);
    canvas.removeEventListener('touchstart', startDrawingTouch);
    canvas.removeEventListener('touchmove', drawTouch);
    canvas.removeEventListener('touchend', stopDrawing);
    
    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    
    // Touch events - fixed to prevent scrolling
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        startDrawingTouch(e);
    }, { passive: false });
    
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        drawTouch(e);
    }, { passive: false });
    
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        stopDrawing();
    }, { passive: false });
}

// Start Zoo Game
// Start Zoo Game
function startZooGame() {
    const startScreen = document.getElementById('zoo-start');
    const trailGame = document.getElementById('trail-game');
    
    if (startScreen) startScreen.classList.add('hidden');
    if (trailGame) trailGame.classList.remove('hidden');
    
    // ✅ Reset game state FIRST
    trailGameActive = false;
    allPaths = [];
    guideVisible = false;
    
    // Initialize the game
    setTimeout(initTrailGame, 100);
}


// Reset drawing state
function resetDrawing() {
    allPaths = [];
    clearCanvas();
    
    document.getElementById('check-btn').disabled = true;
    document.getElementById('check-btn').textContent = "✨ Check My Pattern";
    document.getElementById('check-btn').onclick = checkDrawing;
    
    const startBtn = document.getElementById('start-game-btn');
    if (startBtn) {
        startBtn.disabled = false;
        startBtn.textContent = "Begin Drawing";
        startBtn.style.display = 'inline-block'; // ✅ Show start button
    }
    
    // ✅ Hide redo button when resetting
    const redoBtn = document.getElementById('redo-btn');
    if (redoBtn) {
        redoBtn.style.display = 'none';
    }
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
    
    // Reset drawing if game is active
    if (trailGameActive) {
        resetDrawing();
    }
}

// Draw guide pattern on canvas - FIXED
function drawGuidePattern() {
    if (!ctx || !patterns[currentPattern]) return;
    
    const pattern = patterns[currentPattern];
    ctx.save();
    ctx.beginPath();
    
    // Scale pattern points to current canvas size
    pattern.points.forEach((point, index) => {
        const scaledX = point.x * (canvas.width / (400 * window.devicePixelRatio));
        const scaledY = point.y * (canvas.height / (400 * window.devicePixelRatio));
        
        if (index === 0) {
            ctx.moveTo(scaledX, scaledY);
        } else {
            ctx.lineTo(scaledX, scaledY);
        }
    });
    
    ctx.closePath();
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

// Drawing functions - FIXED
function startDrawing(e) {
    if (!trailGameActive) return;
    
    const { x, y } = getCanvasCoordinates(e);
    isDrawing = true;
    
    allPaths.push([{x, y}]);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function startDrawingTouch(e) {
    if (!trailGameActive) return;
    
    const { x, y } = getCanvasCoordinates(e);
    isDrawing = true;
    
    allPaths.push([{x, y}]);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function draw(e) {
    if (!isDrawing) return;
    
    const { x, y } = getCanvasCoordinates(e);
    
    drawLine(x, y);
    
    allPaths[allPaths.length - 1].push({x, y});
}

function drawTouch(e) {
    if (!isDrawing) return;
    
    const { x, y } = getCanvasCoordinates(e);
    
    drawLine(x, y);
    
    allPaths[allPaths.length - 1].push({x, y});
}

function drawLine(x, y) {
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = `rgba(135, 206, 235, 0.8)`;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Add glow effect
    ctx.shadowColor = 'rgba(135, 206, 235, 0.5)';
    ctx.shadowBlur = 5;
    ctx.stroke();
    ctx.shadowBlur = 0;
}

function stopDrawing() {
    if (!isDrawing) return;
    
    isDrawing = false;
    ctx.closePath();
}

// Clear canvas - FIXED
function clearCanvas() {
    if (!ctx) return;
    
    // Clear with background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw a dark background
    ctx.fillStyle = 'rgba(5, 15, 30, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw subtle grid for reference
    drawGrid();
}

// Draw grid for reference
function drawGrid() {
    ctx.strokeStyle = 'rgba(135, 206, 235, 0.1)';
    ctx.lineWidth = 1;
    
    // Scale grid to canvas
    const stepX = canvas.width / (8 * window.devicePixelRatio);
    const stepY = canvas.height / (8 * window.devicePixelRatio);
    
    // Vertical lines
    for (let x = 0; x <= canvas.width; x += stepX) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvas.height; y += stepY) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Redraw all user paths - FIXED
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
    });
}

// Undo last stroke
function undoLastStroke() {
    if (allPaths.length === 0) return;
    
    allPaths.pop();
    clearCanvas();
    if (guideVisible) drawGuidePattern();
    redrawUserPaths();
}

// Clear drawing
function clearDrawing() {
    allPaths = [];
    clearCanvas();
    if (guideVisible) drawGuidePattern();
}

// Check drawing accuracy - FIXED
function checkDrawing() {
    if (allPaths.length === 0) {
        alert("You haven't drawn anything yet! Try tracing the pattern first.");
        return;
    }
    
    // ✅ Stop the game from allowing more drawing
    trailGameActive = false;
    
    // Calculate accuracy (FIXED - now actually checks pattern)
    const accuracy = calculateAccuracy();
    
    // Update display
    updateAccuracyDisplay(accuracy);
    
    // ✅ Change check button to show results
    const checkBtn = document.getElementById('check-btn');
    checkBtn.textContent = "✨ See Results";
    checkBtn.onclick = function() {
        finishTrailGame(accuracy);
    };
}
// Finish game and show outcome
function finishTrailGame(accuracy) {
    // ✅ Check if accuracy is below 50% - send to death screen
    if (accuracy < 50) {
        // Set HP to 0 and go directly to death screen
        hp = 0;
        updateHP();
        die();
        return; // Stop execution here
    }
    
    // Calculate HP bonus based on accuracy
    const hpBonus = Math.floor(accuracy / 3); // Up to ~30 HP
    
    // Show outcome screen
    const trailGame = document.getElementById('trail-game');
    const outcomeScreen = document.getElementById('zoo-outcome');
    
    if (trailGame) trailGame.classList.add('hidden');
    if (outcomeScreen) outcomeScreen.classList.remove('hidden');
    
    // Update outcome display
    document.getElementById('final-accuracy').textContent = `${accuracy}%`;
    document.getElementById('chocolate-bonus').textContent = `+${hpBonus} HP`;
    
    // Update outcome text
    const outcomeText = document.getElementById('light-outcome');
    if (outcomeText) {
        if (accuracy >= 80) {
            outcomeText.textContent = "Perfect! The lights shimmered in perfect sync with your movements. Your drawing captured the pattern beautifully.";
        } else if (accuracy >= 60) {
            outcomeText.textContent = "Great job! The lights twinkled in appreciation. You traced most of the pattern well.";
        } else {
            outcomeText.textContent = "Good attempt! You captured the essence of the pattern. With practice, you'll get even better.";
        }
    }
    
    // Award HP
    heal(hpBonus);
}

// Start the actual drawing game
function startTrailGame() {
    if (trailGameActive) return;
    
    trailGameActive = true;
    
    // Update UI
    const startBtn = document.getElementById('start-game-btn');
    if (startBtn) {
        startBtn.disabled = true;
        startBtn.textContent = "Drawing Active";
    }
    
    document.getElementById('check-btn').disabled = false;
    
    // Clear canvas
    clearCanvas();
    
    // Draw guide if enabled
    if (guideVisible) {
        drawGuidePattern();
    }
    
    document.getElementById('draw-instructions').textContent = "Trace the pattern! Release to finish.";
}

// Reset drawing state
function resetDrawing() {
    allPaths = [];
    clearCanvas();
    
    document.getElementById('check-btn').disabled = true;
    document.getElementById('check-btn').textContent = "✨ Check My Pattern";
    document.getElementById('check-btn').onclick = checkDrawing;
    
    const startBtn = document.getElementById('start-game-btn');
    if (startBtn) {
        startBtn.disabled = false;
        startBtn.textContent = "Begin Drawing";
    }
}




function calculateAccuracy() {
    const pattern = patterns[currentPattern];
    if (!pattern || allPaths.length === 0) return 0;
    
    // Flatten user points
    let userPoints = [];
    allPaths.forEach(path => {
        userPoints = userPoints.concat(path);
    });
    
    if (userPoints.length < 10) return 20;
    
    // Scale pattern
    const scaledPattern = pattern.points.map(p => ({
        x: p.x * (canvas.width / (400 * window.devicePixelRatio)),
        y: p.y * (canvas.height / (400 * window.devicePixelRatio))
    }));
    
    // Create line segments from pattern
    let patternSegments = [];
    for (let i = 0; i < scaledPattern.length - 1; i++) {
        patternSegments.push({
            start: scaledPattern[i],
            end: scaledPattern[i + 1]
        });
    }
    
    // Check coverage of each segment
    const threshold = 15; // pixels
    let segmentCoverage = new Array(patternSegments.length).fill(0);
    
    userPoints.forEach(point => {
        patternSegments.forEach((segment, idx) => {
            const dist = pointToSegmentDistance(point, segment.start, segment.end);
            if (dist < threshold) {
                segmentCoverage[idx]++;
            }
        });
    });
    
    // Calculate how well each segment was traced
    let totalCoverage = 0;
    segmentCoverage.forEach(coverage => {
        // Each segment should have at least 5 points near it
        totalCoverage += Math.min(100, (coverage / 5) * 100);
    });
    
    let accuracy = totalCoverage / patternSegments.length;
    
    // Cap between 20-95
    return Math.max(20, Math.min(95, Math.round(accuracy)));
}

// Helper: distance from point to line segment
function pointToSegmentDistance(point, segStart, segEnd) {
    const dx = segEnd.x - segStart.x;
    const dy = segEnd.y - segStart.y;
    const lengthSquared = dx * dx + dy * dy;
    
    if (lengthSquared === 0) {
        // Segment is a point
        const pdx = point.x - segStart.x;
        const pdy = point.y - segStart.y;
        return Math.sqrt(pdx * pdx + pdy * pdy);
    }
    
    // Find projection of point onto line
    let t = ((point.x - segStart.x) * dx + (point.y - segStart.y) * dy) / lengthSquared;
    t = Math.max(0, Math.min(1, t)); // Clamp to segment
    
    const projX = segStart.x + t * dx;
    const projY = segStart.y + t * dy;
    
    const distX = point.x - projX;
    const distY = point.y - projY;
    
    return Math.sqrt(distX * distX + distY * distY);
}

// Update accuracy display
function updateAccuracyDisplay(accuracy) {
    const accuracyValue = document.getElementById('accuracy-value');
    const accuracyFill = document.getElementById('accuracy-fill');
    
    if (accuracyValue) accuracyValue.textContent = `${accuracy}%`;
    if (accuracyFill) {
        accuracyFill.style.width = `${accuracy}%`;
        // Color based on accuracy
        if (accuracy >= 80) {
            accuracyFill.style.background = 'linear-gradient(90deg, #F44336, #FF9800, #4CAF50)';
        } else if (accuracy >= 60) {
            accuracyFill.style.background = 'linear-gradient(90deg, #F44336, #FF9800)';
        } else {
            accuracyFill.style.background = '#F44336';
        }
    }
}


// Reset drawing state
function resetDrawing() {
    allPaths = [];
    clearCanvas();
    
    document.getElementById('check-btn').disabled = true;
    document.getElementById('check-btn').textContent = "✨ Check My Pattern";
    document.getElementById('check-btn').onclick = checkDrawing;
    
    const startBtn = document.getElementById('start-game-btn');
    if (startBtn) {
        startBtn.disabled = false;
        startBtn.textContent = "Begin Drawing";
    }
}

// Skip to chocolate
function skipToChocolate() {
    const startScreen = document.getElementById('zoo-start');
    const outcomeScreen = document.getElementById('zoo-outcome');
    
    if (startScreen) startScreen.classList.add('hidden');
    if (outcomeScreen) outcomeScreen.classList.remove('hidden');
    
    // Give minimal bonus
    heal(15);
    
    // Update outcome for skip
    document.getElementById('final-accuracy').textContent = "Skipped";
    document.getElementById('chocolate-bonus').textContent = "+15 HP";
    
    document.getElementById('light-outcome').textContent = 
        "Sometimes the warmest moments don't need perfect patterns. The simple act of being together, hot chocolates in hand, says everything.";
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

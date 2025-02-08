// script.js

document.addEventListener('DOMContentLoaded', () => {
  const gridElement = document.getElementById('grid');
  const historyList = document.getElementById('history-list');
  const playerHpEl = document.getElementById('player-hp');
  const playerExpEl = document.getElementById('player-exp');
  // const playerAttackEl = document.getElementById('player-attack'); // Décommentez si vous affichez la force du joueur

  const gridSize = 10;
  let cells = [];

  // Création de la grille 10x10
  function createGrid() {
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.x = x;
        cell.dataset.y = y;
        gridElement.appendChild(cell);
        cells.push(cell);
      }
    }
  }

  // Algorithme de Fisher-Yates pour mélanger un tableau
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // État initial du jeu
  let gameState = {
    gridSize: gridSize,
    player: { x: 0, y: 0, hp: 100, maxHp: 100, exp: 0, attack: 20 },
    treasure: { x: null, y: null },
    creatures: [] // Chaque créature possède { x, y, hp, attack }
  };

  // Initialisation de la partie
  function initializeGame() {
    gameState.player.hp = gameState.player.maxHp;
    gameState.player.exp = 0;
    gameState.creatures = [];
    enableControls();

    // Réinitialisation des cellules
    cells.forEach(cell => {
      cell.className = 'cell';
      cell.textContent = '';
    });

    // Création d'un tableau de toutes les positions possibles
    let positions = [];
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        positions.push({ x, y });
      }
    }
    shuffleArray(positions);

    // Placement du joueur sur la première position
    let pos = positions.shift();
    gameState.player.x = pos.x;
    gameState.player.y = pos.y;

    // Placement du trésor sur la deuxième position
    pos = positions.shift();
    gameState.treasure.x = pos.x;
    gameState.treasure.y = pos.y;

    // Placement d'un nombre aléatoire de créatures (entre 10 et 50)
    const creatureCount = Math.floor(Math.random() * 41) + 10;
    for (let i = 0; i < creatureCount && positions.length > 0; i++) {
      pos = positions.shift();
      const creature = {
        x: pos.x,
        y: pos.y,
        hp: Math.floor(Math.random() * 21) + 10,     // HP entre 10 et 30
        attack: Math.floor(Math.random() * 11) + 5     // Attaque entre 5 et 15
      };
      gameState.creatures.push(creature);
    }

    updateGrid();
    updateStats();
    addHistory("La partie commence !", "info");
  }

  // Mise à jour de l'affichage de la grille
  function updateGrid() {
    cells.forEach(cell => {
      cell.className = 'cell';
      cell.textContent = '';
    });

    // Affichage du trésor
    const treasureCell = getCell(gameState.treasure.x, gameState.treasure.y);
    treasureCell.classList.add('treasure');
    treasureCell.textContent = '💰';

    // Affichage des créatures
    gameState.creatures.forEach(creature => {
      const creatureCell = getCell(creature.x, creature.y);
      creatureCell.classList.add('creature');
      creatureCell.textContent = '👾';
    });

    // Affichage du joueur avec un GIF
    const playerCell = getCell(gameState.player.x, gameState.player.y);
      playerCell.classList.add('player');
      playerCell.innerHTML = '<img src="../src/joueur.gif" alt="Joueur" class="player-gif">';
    }

  // Récupérer une cellule en fonction de ses coordonnées
  function getCell(x, y) {
    return cells.find(cell => Number(cell.dataset.x) === x && Number(cell.dataset.y) === y);
  }

  // Mise à jour des statistiques du joueur dans le DOM
  function updateStats() {
    playerHpEl.textContent = gameState.player.hp;
    playerExpEl.textContent = gameState.player.exp;
    // playerAttackEl.textContent = gameState.player.attack; // Décommentez si besoin
  }

  /**
   * Ajoute un message à l'historique avec une icône
   * @param {string} message - Le message à afficher.
   * @param {string} type - Le type d'action (ex. "move-up", "move-down", "move-left", "move-right", "attack", "damage", "win", "lose", "treasure", "encounter", "info").
   */
  function addHistory(message, type = "info") {
    const li = document.createElement('li');
    let iconHtml = "";
    switch (type) {
      case "move-up":
        iconHtml = '<i class="bi bi-arrow-up"></i> ';
        break;
      case "move-down":
        iconHtml = '<i class="bi bi-arrow-down"></i> ';
        break;
      case "move-left":
        iconHtml = '<i class="bi bi-arrow-left"></i> ';
        break;
      case "move-right":
        iconHtml = '<i class="bi bi-arrow-right"></i> ';
        break;
      case "attack":
        iconHtml = '<i class="bi bi-lightning"></i> ';
        break;
      case "damage":
        iconHtml = '<i class="bi bi-shield-fill-exclamation"></i> ';
        break;
      case "win":
        iconHtml = '<i class="bi bi-trophy"></i> ';
        break;
      case "lose":
        iconHtml = '<i class="bi bi-emoji-dizzy"></i> ';
        break;
      case "treasure":
        iconHtml = '<i class="bi bi-gem"></i> ';
        break;
      case "encounter":
        iconHtml = '<i class="bi bi-bug"></i> ';
        break;
      case "info":
      default:
        iconHtml = '<i class="bi bi-info-circle"></i> ';
        break;
    }
    li.innerHTML = iconHtml + message;
    li.style.marginBottom = "10px"; // Sépare chaque action par un espace
    historyList.prepend(li);
  }

  // Ajoute un séparateur dans l'historique pour grouper les actions
  function addHistorySeparator() {
    const separator = document.createElement('li');
    separator.innerHTML = "<hr>";
    separator.style.margin = "10px 0";
    historyList.prepend(separator);
  }

  // Gère le déplacement du joueur avec icône adaptée selon la direction
  function movePlayer(dx, dy) {
    const newX = gameState.player.x + dx;
    const newY = gameState.player.y + dy;

    if (newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize) {
      addHistory("Déplacement invalide.", "info");
      return;
    }

    gameState.player.x = newX;
    gameState.player.y = newY;

    // Détermination de l'icône en fonction de la direction
    let moveType = "move";
    if (dx === 0 && dy === -1) moveType = "move-up";
    else if (dx === 0 && dy === 1) moveType = "move-down";
    else if (dx === -1 && dy === 0) moveType = "move-left";
    else if (dx === 1 && dy === 0) moveType = "move-right";

    addHistory(`Déplacement vers (${newX}, ${newY}).`, moveType);

    checkCell();
    updateGrid();
    updateStats();
  }

  // Vérifie le contenu de la case sur laquelle se trouve le joueur
  function checkCell() {
    // Si le joueur trouve le trésor
    if (gameState.player.x === gameState.treasure.x && gameState.player.y === gameState.treasure.y) {
      addHistory("Vous avez trouvé le trésor ! Vous gagnez !", "treasure");
      disableControls();
      return;
    }

    // Vérifier la présence d'une créature sur la case
    const creatureIndex = gameState.creatures.findIndex(creature =>
      creature.x === gameState.player.x && creature.y === gameState.player.y
    );

    if (creatureIndex !== -1) {
      let creature = gameState.creatures[creatureIndex];
      addHistory(`Rencontre avec une créature (HP: ${creature.hp}, ATK: ${creature.attack}).`, "encounter");

      // Combat en échange de dégâts (combat en plusieurs rounds)
      while (gameState.player.hp > 0 && creature.hp > 0) {
        // Le joueur attaque la créature
        creature.hp -= gameState.player.attack;
        addHistory(`Vous attaquez la créature et lui infligez ${gameState.player.attack} dégâts. (HP restant de la créature: ${Math.max(creature.hp, 0)})`, "attack");

        // Si la créature est vaincue
        if (creature.hp <= 0) {
          addHistory("La créature est vaincue !", "win");
          gameState.creatures.splice(creatureIndex, 1);
          gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + 10);
          gameState.player.exp += 1;
          updateStats();
          break;
        }

        // La créature contre-attaque
        gameState.player.hp -= creature.attack;
        addHistory(`La créature vous attaque et vous inflige ${creature.attack} dégâts. (Votre HP restant: ${Math.max(gameState.player.hp, 0)})`, "damage");

        // Si le joueur est mort
        if (gameState.player.hp <= 0) {
          addHistory("Vous êtes mort. La partie va se réinitialiser.", "lose");
          disableControls();
          setTimeout(initializeGame, 2000);
          return;
        }
      }
      // Séparer le groupe d'actions (combat) avec un séparateur
      addHistorySeparator();
    }
  }

  // Désactive les contrôles (boutons)
  function disableControls() {
    document.getElementById('up-btn').disabled = true;
    document.getElementById('down-btn').disabled = true;
    document.getElementById('left-btn').disabled = true;
    document.getElementById('right-btn').disabled = true;
  }

  // Réactive les contrôles (boutons)
  function enableControls() {
    document.getElementById('up-btn').disabled = false;
    document.getElementById('down-btn').disabled = false;
    document.getElementById('left-btn').disabled = false;
    document.getElementById('right-btn').disabled = false;
  }

  // Gestion des événements sur les boutons de déplacement
  document.getElementById('up-btn').addEventListener('click', () => movePlayer(0, -1));
  document.getElementById('down-btn').addEventListener('click', () => movePlayer(0, 1));
  document.getElementById('left-btn').addEventListener('click', () => movePlayer(-1, 0));
  document.getElementById('right-btn').addEventListener('click', () => movePlayer(1, 0));

  // Création de la grille et initialisation de la partie
  function init() {
    createGrid();
    initializeGame();
  }

  init();
});

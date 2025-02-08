// script.js

document.addEventListener('DOMContentLoaded', () => {
    const gridElement = document.getElementById('grid');
    const historyList = document.getElementById('history-list');
    const playerHpEl = document.getElementById('player-hp');
    const playerExpEl = document.getElementById('player-exp');
  
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
  
    // Etat initial du jeu
    let gameState = {
      gridSize: gridSize,
      player: { x: 0, y: 0, hp: 100, maxHp: 100, exp: 0, attack: 20 },
      treasure: { x: null, y: null },
      creatures: [] // chaque créature aura {x, y, hp, attack}
    };
  
    // Initialisation de la partie
    function initializeGame() {
      // Réinitialisation des statistiques
      gameState.player.hp = gameState.player.maxHp;
      gameState.player.exp = 0;
      gameState.creatures = [];
      enableControls();
  
      // Réinitialiser les cellules de la grille
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
          hp: Math.floor(Math.random() * 21) + 10,     // Points de vie entre 10 et 30
          attack: Math.floor(Math.random() * 11) + 5     // Attaque entre 5 et 15
        };
        gameState.creatures.push(creature);
      }
  
      updateGrid();
      updateStats();
      addHistory("La partie commence !");
    }
  
    // Mise à jour de l'affichage de la grille
    function updateGrid() {
      // On réinitialise toutes les cellules
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
  
      // Affichage du joueur
      const playerCell = getCell(gameState.player.x, gameState.player.y);
      playerCell.classList.add('player');
      playerCell.textContent = '🙂';
    }
  
    // Récupérer une cellule en fonction de ses coordonnées
    function getCell(x, y) {
      return cells.find(cell => Number(cell.dataset.x) === x && Number(cell.dataset.y) === y);
    }
  
    // Mise à jour des statistiques du joueur
    function updateStats() {
      playerHpEl.textContent = gameState.player.hp;
      playerExpEl.textContent = gameState.player.exp;
    }
  
    // Ajoute un message à l'historique
    function addHistory(message) {
      const li = document.createElement('li');
      li.textContent = message;
      historyList.prepend(li);
    }
  
    // Gère le déplacement du joueur
    function movePlayer(dx, dy) {
      const newX = gameState.player.x + dx;
      const newY = gameState.player.y + dy;
  
      // Vérification des limites de la grille
      if (newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize) {
        addHistory("Déplacement invalide.");
        return;
      }
  
      gameState.player.x = newX;
      gameState.player.y = newY;
      addHistory(`Déplacement vers (${newX}, ${newY}).`);
  
      checkCell();
      updateGrid();
      updateStats();
    }
  
    // Vérifie le contenu de la case sur laquelle se trouve le joueur
    function checkCell() {
      // Vérifier si le joueur a trouvé le trésor
      if (gameState.player.x === gameState.treasure.x && gameState.player.y === gameState.treasure.y) {
        addHistory("Vous avez trouvé le trésor ! Vous gagnez !");
        disableControls();
        return;
      }
  
      // Vérifier la présence d'une créature
      const creatureIndex = gameState.creatures.findIndex(creature =>
        creature.x === gameState.player.x && creature.y === gameState.player.y
      );
      if (creatureIndex !== -1) {
        const creature = gameState.creatures[creatureIndex];
        addHistory(`Rencontre avec une créature (HP: ${creature.hp}, ATK: ${creature.attack}).`);
  
        // Combat : comparaison entre la force du joueur et les points de vie de la créature
        if (gameState.player.attack >= creature.hp) {
          addHistory("Vous avez vaincu la créature !");
          // Suppression de la créature vaincue
          gameState.creatures.splice(creatureIndex, 1);
          // Le joueur regagne 10 points de vie (sans dépasser le maximum)
          gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + 10);
          gameState.player.exp += 1;
        } else {
          addHistory("La créature résiste et vous attaque !");
          gameState.player.hp -= creature.attack;
          if (gameState.player.hp <= 0) {
            addHistory("Vous êtes mort. La partie va se réinitialiser.");
            setTimeout(initializeGame, 2000);
          }
        }
      }
    }
  
    // Désactive les contrôles en fin de partie (victoire)
    function disableControls() {
      document.getElementById('up-btn').disabled = true;
      document.getElementById('down-btn').disabled = true;
      document.getElementById('left-btn').disabled = true;
      document.getElementById('right-btn').disabled = true;
    }
  
    // Réactive les contrôles (lors d'une réinitialisation)
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
    createGrid();
    initializeGame();
  });
  
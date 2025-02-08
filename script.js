// script.js

document.addEventListener("DOMContentLoaded", () => {
  const gridElement = document.getElementById("grid");
  const historyList = document.getElementById("history-list");
  const playerHpEl = document.getElementById("player-hp");
  const playerExpEl = document.getElementById("player-exp");
  // const playerAttackEl = document.getElementById('player-attack'); // Décommentez si vous affichez la force du joueur

  const gridSize = 10;
  let cells = [];
  let gameTimer;
  let timeLeft = 60; // Temps initial en secondes


  // Création de la grille 10x10
  function createGrid() {
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
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
    creatures: [], // Chaque créature possède { x, y, hp, attack }
  };
  
  // Démarre le temps
  function startTimer() {
    timeLeft = 60; // Réinitialise le temps
    gameTimer = setInterval(() => {
        timeLeft--;

        // Si le temps est écoulé, afficher la modale et stopper le jeu
        if (timeLeft <= 0) {
            clearInterval(gameTimer);
            disableControls();
            addHistory("⏳ Temps écoulé ! Partie terminée.", "lose");

            // Afficher la modale de fin de temps
            let timeUpModal = new bootstrap.Modal(document.getElementById("timeUpModal"));
            timeUpModal.show();

            // Relancer la partie au clic sur "Rejouer"
            document.getElementById("restart-time-btn").addEventListener("click", () => {
                initializeGame();
            });
        }
    }, 1000); // Met à jour chaque seconde
}

  // Initialisation de la partie
  function initializeGame() {
      // Arrête le timer en cours (s'il existe)
  clearInterval(gameTimer);

  // Réinitialisation du timer :
  timeLeft = 60;
  document.getElementById("timer-text").textContent = timeLeft + " sec";

  // Forcer le redémarrage du GIF en modifiant son src avec un paramètre aléatoire
  const timerImg = document.getElementById("timer");
  timerImg.src = "src/sablier.gif?" + new Date().getTime();
  
    gameState.player.hp = gameState.player.maxHp;
    gameState.player.exp = 0;
    gameState.creatures = [];
    enableControls();

    // Réinitialisation complète des cellules
    cells.forEach((cell) => {
      cell.className = "cell";
      cell.textContent = "";
      cell.style.backgroundColor = ""; // Réinitialise la couleur de toutes les cases
    });

    // Réinitialisation complète de l'historique
    historyList.innerHTML = "";

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

    // Types de monstres avec leurs caractéristiques
    const monsterTypes = [
      { color: "green", minHp: 10, maxHp: 20, minAtk: 5, maxAtk: 10, xp: 1 }, // Vert (facile) - 1 XP
      { color: "yellow", minHp: 15, maxHp: 25, minAtk: 7, maxAtk: 12, xp: 2 }, // Jaune (moyen) - 2 XP
      { color: "orange", minHp: 20, maxHp: 30, minAtk: 10, maxAtk: 15, xp: 3 }, // Orange (difficile) - 3 XP
      { color: "red", minHp: 25, maxHp: 35, minAtk: 12, maxAtk: 18, xp: 4 }, // Rouge (très difficile) - 4 XP
      { color: "purple", minHp: 30, maxHp: 40, minAtk: 15, maxAtk: 20, xp: 5 }, // Violet foncé (extrême) - 5 XP
    ];

    // Placement des monstres
    const creatureCount = Math.floor(Math.random() * 41) + 10; // Entre 10 et 50 monstres
    for (let i = 0; i < creatureCount && positions.length > 0; i++) {
      pos = positions.shift();

      // Sélection aléatoire d'un type de monstre
      const monsterType =
        monsterTypes[Math.floor(Math.random() * monsterTypes.length)];

      const creature = {
        x: pos.x,
        y: pos.y,
        hp:
          Math.floor(
            Math.random() * (monsterType.maxHp - monsterType.minHp + 1)
          ) + monsterType.minHp,
        attack:
          Math.floor(
            Math.random() * (monsterType.maxAtk - monsterType.minAtk + 1)
          ) + monsterType.minAtk,
        color: monsterType.color,
        xp: monsterType.xp,
      };
      gameState.creatures.push(creature);
    }

    // Générer entre 1 et 3 épées
    const swordCount = Math.floor(Math.random() * 3) + 1;
    gameState.swords = [];

    for (let i = 0; i < swordCount && positions.length > 0; i++) {
      let pos = positions.shift();
      gameState.swords.push({ x: pos.x, y: pos.y });
    }

    // Générer entre 1 et 3 potions
    const potionCount = Math.floor(Math.random() * 3) + 1;
    gameState.potions = [];

    for (let i = 0; i < potionCount && positions.length > 0; i++) {
      let pos = positions.shift();
      gameState.potions.push({ x: pos.x, y: pos.y });
    }

    // Mise à jour de l'affichage
    updateGrid();
    updateStats();
    addHistory("La partie commence !", "info");
    
  // Démarrer le timer
  startTimer();
    
  }

  // Mise à jour de l'affichage de la grille
  function updateGrid() {
    // Réinitialisation de toutes les cellules
    cells.forEach((cell) => {
      cell.className = "cell";
      cell.textContent = "";
      cell.style.backgroundColor = "";
    });

    // Affichage du trésor
    const treasureCell = getCell(gameState.treasure.x, gameState.treasure.y);
    treasureCell.classList.add("treasure");
    treasureCell.textContent = "💰";

    // Affichage des épées sur la carte
    gameState.swords.forEach((sword) => {
      const swordCell = getCell(sword.x, sword.y);
      swordCell.classList.add("sword");
      swordCell.innerHTML =
        '<img src="src/sword.gif" alt="Épée" class="sword-gif">';
    });

    // Affichage des potions sur la carte
    gameState.potions.forEach((potion) => {
      const potionCell = getCell(potion.x, potion.y);
      potionCell.classList.add("potion");
      potionCell.innerHTML =
        '<img src="src/potion.gif" alt="Potion de soin" class="potion-gif">';
    });

    // Affichage des créatures avec les GIFs animés
    gameState.creatures.forEach((creature) => {
      const creatureCell = getCell(creature.x, creature.y);
      creatureCell.classList.add("creature");
      creatureCell.style.backgroundColor = getMonsterColor(creature.color);

      // Choix du GIF en fonction de la couleur du monstre
      let mobGif = "";
      switch (creature.color) {
        case "green":
          mobGif = "src/mob1.gif";
          break;
        case "yellow":
          mobGif = "src/mob2.gif";
          break;
        case "orange":
          mobGif = "src/mob3.gif";
          break;
        case "red":
          mobGif = "src/mob4.gif";
          break;
        case "purple":
          mobGif = "src/mob5.gif";
          break;
        default:
          mobGif = "src/mob1.gif";
          break;
      }
      // Insertion du GIF dans la cellule
      creatureCell.innerHTML = `<img src="${mobGif}" alt="Monstre ${creature.color}" class="creature-gif">`;
    });

    // Affichage du joueur avec un GIF
    const playerCell = getCell(gameState.player.x, gameState.player.y);
    playerCell.classList.add("player");
    playerCell.innerHTML =
      '<img src="src/joueur.gif" alt="Joueur" class="player-gif">';

    // Fonction locale pour récupérer la couleur associée au monstre
    function getMonsterColor(type) {
      const colors = {
        green: "#fff",
        yellow: "#fff",
        orange: "#fff",
        red: "#fff",
        purple: "#fff",
      };
      return colors[type] || "#F44336"; // Par défaut, rouge
    }
  }

  // Récupérer une cellule en fonction de ses coordonnées
  function getCell(x, y) {
    return cells.find(
      (cell) => Number(cell.dataset.x) === x && Number(cell.dataset.y) === y
    );
  }

  // Mise à jour des statistiques du joueur dans le DOM
  function updateStats() {
    playerHpEl.textContent = gameState.player.hp;
    playerExpEl.textContent = gameState.player.exp;
    document.getElementById("player-attack").textContent =
      gameState.player.attack;
    updateHighscore(); // Met à jour le highscore après chaque gain d'XP
  }

  // Fonction session storage du highscore
  function updateHighscore() {
    let currentXP = gameState.player.exp;
    let storedHighscore = sessionStorage.getItem("highscore") || 0;

    if (currentXP > storedHighscore) {
      sessionStorage.setItem("highscore", currentXP);
      document.getElementById("highscore").textContent = currentXP;
    }
  }

  /**
   * Ajoute un message à l'historique avec une icône
   * @param {string} message - Le message à afficher.
   * @param {string} type - Le type d'action (ex. "move-up", "move-down", "move-left", "move-right", "attack", "damage", "win", "lose", "treasure", "encounter", "info").
   */
  function addHistory(message, type = "info") {
    const li = document.createElement("li");
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
        li.style.color = "blue"; // Change le texte en rouge quand le joueur attaque
        break;
      case "damage":
        iconHtml = '<i class="bi bi-shield-fill-exclamation"></i> ';
        li.style.color = "red"; // Change le texte en rouge quand le joueur prend des dégâts
        break;
      case "win":
        iconHtml = '<i class="bi bi-trophy"></i> ';
        li.style.color = "darkgreen"; // Change le texte en vert foncé quand le joueur gagne un combat
        break;
      case "lose":
        iconHtml = '<i class="bi bi-emoji-dizzy"></i> ';
        li.style.color = "red"; // Rouge aussi pour la mort du joueur
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
    li.style.marginBottom = "10px"; // Espacement entre les messages
    historyList.prepend(li);
  }

  // Ajoute un séparateur dans l'historique pour grouper les actions
  function addHistorySeparator() {
    const separator = document.createElement("li");
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
    if (
      gameState.player.x === gameState.treasure.x &&
      gameState.player.y === gameState.treasure.y
    ) {
      addHistory("Vous avez trouvé le trésor ! 🏆", "treasure");
      disableControls();

      // Afficher la modale de victoire
      let winModal = new bootstrap.Modal(document.getElementById("winModal"));
      winModal.show();

      return; // Évite d'exécuter le reste du code
    }

    // Ajoute l'Event Listener UNE SEULE FOIS après le chargement du DOM
    document.getElementById("restart-win-btn").addEventListener(
      "click",
      () => {
        initializeGame();
      },
      { once: true }
    ); // { once: true } empêche les doublons

    // Vérifier si le joueur ramasse une épée
    const swordIndex = gameState.swords.findIndex(
      (sword) =>
        sword.x === gameState.player.x && sword.y === gameState.player.y
    );

    if (swordIndex !== -1) {
      gameState.swords.splice(swordIndex, 1); // Retire l'épée de la carte
      gameState.player.attack += 2; // Augmente la force du joueur
      addHistory(
        "Vous avez trouvé une épée vorpaline ! ⚔️ Votre attaque augmente de 2.",
        "win"
      );
      updateStats(); // Mise à jour des stats
    }

    // Vérifier si le joueur ramasse une potion
    const potionIndex = gameState.potions.findIndex(
      (potion) =>
        potion.x === gameState.player.x && potion.y === gameState.player.y
    );

    if (potionIndex !== -1) {
      gameState.potions.splice(potionIndex, 1); // Retire la potion de la carte

      // Ajoute 5 PV sans dépasser le maximum
      gameState.player.hp = Math.min(
        gameState.player.hp + 5,
        gameState.player.maxHp
      );

      addHistory("Vous avez bu une potion ! ❤️ +5 PV", "win");
      updateStats(); // Mise à jour des stats
    }

    // Vérifier la présence d'une créature sur la case
    const creatureIndex = gameState.creatures.findIndex(
      (creature) =>
        creature.x === gameState.player.x && creature.y === gameState.player.y
    );

    if (creatureIndex !== -1) {
      let creature = gameState.creatures[creatureIndex];
      addHistory(
        `Rencontre avec une créature (HP: ${creature.hp}, ATK: ${creature.attack}).`,
        "encounter"
      );

      // Ajoute l'effet de tremblement sur la grille
      gridElement.classList.add("shake");
      setTimeout(() => {
        gridElement.classList.remove("shake");
      }, 500);

      // Combat en échange de dégâts (combat en plusieurs rounds)
      while (gameState.player.hp > 0 && creature.hp > 0) {
        // Déclenche un flash sur l'écran au début du combat
        triggerFlashEffect();

        // Le joueur attaque la créature
        creature.hp -= gameState.player.attack;
        addHistory(
          `Vous attaquez la créature et lui infligez ${
            gameState.player.attack
          } dégâts. (HP restant de la créature: ${Math.max(creature.hp, 0)})`,
          "attack"
        );

        // Si la créature est vaincue
        if (creature.hp <= 0) {
          addHistory(
            `La créature (${creature.color}) est vaincue ! Vous gagnez ${creature.xp} XP.`,
            "win"
          );
          gameState.creatures.splice(creatureIndex, 1);
          gameState.player.exp += creature.xp; // Donne de l'XP en fonction du type de monstre
          updateStats();
          break;
        }

        // La créature contre-attaque
        gameState.player.hp -= creature.attack;
        triggerFlashEffect("rgba(255, 0, 0, 0.6)"); // Rouge quand le joueur prend des dégâts
        addHistory(
          `La créature vous attaque et vous inflige ${
            creature.attack
          } dégâts. (Votre HP restant: ${Math.max(gameState.player.hp, 0)})`,
          "damage"
        );
        updateStats(); // Mise à jour de l'affichage des stats

        // Vérifier si le joueur est mort après avoir perdu des HP
        if (gameState.player.hp <= 0) {
          addHistory(
            "💀 Vous êtes mort. La partie va se réinitialiser.",
            "lose"
          );
          disableControls();

          // Afficher la modale Bootstrap
          let deathModal = new bootstrap.Modal(
            document.getElementById("deathModal")
          );
          deathModal.show();

          // Redémarrer la partie quand le joueur clique sur "OK"
          document
            .getElementById("restart-btn")
            .addEventListener("click", () => {
              initializeGame();
            });

          return;
        }
      }
      addHistorySeparator();
    }
  }

  // Désactive contrôles (ze boutons)
  function disableControls() {
    document.getElementById("up-btn").disabled = true;
    document.getElementById("down-btn").disabled = true;
    document.getElementById("left-btn").disabled = true;
    document.getElementById("right-btn").disabled = true;
  }

  // Réactive contrôles (ze boutons)
  function enableControls() {
    document.getElementById("up-btn").disabled = false;
    document.getElementById("down-btn").disabled = false;
    document.getElementById("left-btn").disabled = false;
    document.getElementById("right-btn").disabled = false;
  }

  // Gestion événements sur boutons de déplacement
  document
    .getElementById("up-btn")
    .addEventListener("click", () => movePlayer(0, -1));
  document
    .getElementById("down-btn")
    .addEventListener("click", () => movePlayer(0, 1));
  document
    .getElementById("left-btn")
    .addEventListener("click", () => movePlayer(-1, 0));
  document
    .getElementById("right-btn")
    .addEventListener("click", () => movePlayer(1, 0));

  // Création de la grille et initialisation de la partie
  function init() {
    createGrid();
    initializeGame();

    // Vérifie si c'est le premier lancement du jeu
    if (!sessionStorage.getItem("rulesShown")) {
      let rulesModal = new bootstrap.Modal(
        document.getElementById("rulesModal")
      );
      rulesModal.show();
      sessionStorage.setItem("rulesShown", "true"); // Marque que les règles ont été affichées
    }
  }

  // l’effet d’éclair

  function triggerFlashEffect(color = "rgba(255, 255, 255, 0.8)") {
    const flash = document.createElement("div");
    flash.classList.add("flash");
    flash.style.background = color; // Utilisation de la couleur passée en paramètre
    document.body.appendChild(flash);

    setTimeout(() => {
      flash.remove();
    }, 300);
  }

  init();
  document.getElementById("highscore").textContent =
    sessionStorage.getItem("highscore") || 0;

  // listener pour bouton des règles du jeu
  document.getElementById("rules-btn").addEventListener("click", () => {
    let rulesModal = new bootstrap.Modal(document.getElementById("rulesModal"));
    rulesModal.show();
  });
});

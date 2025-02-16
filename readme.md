🏰 Dungeon Speed 🏰

Deployé sur Netlify à cette adresse : dungeonspeed.netlify.app

Bienvenue dans Dungeon Speed, un mini-jeu de chasse au trésor et de monstres développé en JavaScript, HTML et CSS. Le but : survivre dans un donjon sombre, vaincre des monstres, amasser de l’expérience et trouver le trésor… avant que le temps ne s’écoule!

Présentation du Jeu

Bienvenue dans Dungeon Speed, un jeu de chasse au trésor palpitant mêlant stratégie et exploration !
Objectif : Trouver le trésor et accumuler un maximum d’expérience (XP) en vainquant des monstres.
Temps limité : Vous avez 60 secondes avant de suffoquer à cause de l’air vicié du donjon.
Affrontez des monstres : Plus ils sont puissants, plus vous gagnez d’XP.
Highscore : Faites le meilleur score possible avant de trouver le trésor.
Ce projet rassemble de nombreux éléments : système de combat, timer, collecte d’objets, effets sonores, animations, et plus encore.

Fonctionnalités

Grille 2D : Une map 10×10 dynamique où le joueur peut se déplacer.
Timer : Le joueur dispose de 60 secondes avant de succomber à l’air vicié du donjon.

Système de Combat :

Créatures générées aléatoirement (différentes stats : PV, ATK, XP).
Combat simplifié : le joueur et la créature s’échangent des coups jusqu’à la mort de l’un.

Ramassage d’Objets :
Épées pour augmenter la puissance d’attaque.
Potions pour soigner les PV.

Scoring & Highscore :
Basé sur l’XP acquise.
Le meilleur score est sauvegardé dans sessionStorage.

Évènements Sonores :
Bruitages (déplacement, ramassage, victoire, mort, etc.).
Musique de fond en boucle, activable/désactivable.

UI Responsive :
Ajustée pour écrans desktop et mobiles.
Grille légèrement réduite sur petit écran.

Prérequis
Navigateur web moderne (Chrome, Firefox, Edge, Safari, etc.)
JavaScript activé
(Optionnel) Serveur web local : recommandé pour éviter les soucis de chargement de fichiers via file://.

Installation
Cloner ou télécharger le repo GitHub :
git clone https://github.com/viti-cci-2024/donjonquest.git
Ouvrir index.html dans votre navigateur :

Via un serveur local (recommandé) : par exemple avec Live Server de VSCode, ou un stack WAMP/MAMP/XAMPP.

Ou en double-cliquant sur index.html (selon les navigateurs, cela peut fonctionner directement).

Jouer et tentez de battre le highscore !

Structure du Projet

DungeonSpeed/
├─ src/
│  ├─ background.gif         # Arrière-plan du jeu
│  ├─ coin.gif / coin.mp3    # GIF et son d'explosion de pièces
│  ├─ death.png / death.mp3  # Visuel et son de mort
│  ├─ drinkpotion.mp3        # Son de potion
│  ├─ dungeonzik.mp3         # Musique d'ambiance
│  ├─ haut.png, bas.png...   # Flèches de déplacement
│  ├─ mob1.gif ... mob5.gif  # Animations de monstres
│  ├─ player.gif             # Animation du joueur
│  ├─ potion.gif             # Animation de la potion
│  ├─ sablier.gif            # Timer gif
│  ├─ sword.gif / swordsound.mp3  # Animation et son d'épée
│  ├─ tresor.gif             # Animation du trésor
│  └─ ... (autres assets)
├─ index.html                # Structure HTML du jeu
├─ styles.css                # Styles CSS principaux
├─ script.js                 # Script du gameplay
└─ README.md                 # Fichier de documentation (vous y êtes !)

Instructions de Jeu

Déplacements :

Utilisez les flèches directionnelles du clavier OU les boutons à l’écran.

Ramasser des items :

Épées : améliore l’attaque.

Potions : rend 5 PV.

Combats :

Quand vous entrez dans la case d’un monstre, un combat se déclenche.

Joueur et monstre s’échangent des coups jusqu’à ce que l’un meure.

Si le monstre meurt, vous gagnez son XP.

Si vous mourrez, la partie se termine.

Trouver le trésor :
Met fin à la partie.
Permet de voir votre score et le comparer au highscore.

Timer :
Vous avez 60 secondes pour faire un maximum de combats et récupérer le trésor.
Si le temps arrive à 0, vous mourrez asphyxié !

Score & Highscore :
Le score = l’XP accumulée.
Le highscore est stocké dans sessionStorage.

Scripts et Gameplay
script.js :
Création de la grille (10×10) à l’aide de Fisher-Yates pour la distribution aléatoire de monstres, potions et épées.
Objet gameState : contient la position du joueur, du trésor, des créatures, des potions, des épées, etc.

Combat :
Le joueur et le monstre se battent en tours successifs.
Effets visuels (tremblement, flash) et effets sonores si configurés.

Timer : se décrémente toutes les secondes (60 → 0). Si 0, joueur meurt.

Modales Bootstrap :
deathModal : mort en combat.
timeUpModal : mort par temps écoulé.
winModal : trésor trouvé.
rulesModal : affiche les règles du jeu.

styles.css :
Mise en page en display: grid pour la zone de jeu.

Responsive : breakpoint mobile (max-width: 767px) pour adapter la grille, le logo, etc.

Animations : aura autour du joueur, tremblement, flash, etc.

Boutons : déplacements (haut, bas, gauche, droite), ouverture des règles, activation/désactivation musique.

Personnalisation et Configuration

Musique de fond : dungeonzik.mp3. Volume réglable dans script.js via audio.volume.

Effets sonores :
swoosh.mp3 (déplacement),
drinkpotion.mp3 (potion),
swordsound.mp3 (épée ramassée),
swordslash.mp3 (attaque réussie),
hurt.mp3 (joueur blessé),
victory.mp3 (victoire),
death.mp3 (mort),
coin.mp3 (explosion de pièces).

Difficulté :
Ajustez la fourchette de monstres (10 à 50) dans script.js.
Modifiez les PV/attaque du joueur (début de partie) dans script.js.

Changez la durée du timer dans startTimer() (actuellement 60 secondes).

Roadmap (Améliorations Futures)
🔄 Mode Sans Fin (Survivre le plus longtemps possible)
👾 Plus de types de monstres et boss finaux
🏹 Nouveaux objets et armes spéciales
🌍 Mode multijoueur en ligne (expérimental)

Crédits

Développement : @viti-cci-2024

Technologies : HTML5, CSS3, JavaScript, Bootstrap 5, Bootstrap Icons

Assets :

GIFs de personnages et monstres, trésor, etc.
Images et sons libres de droits (ou provenant de sources indiquées dans le code).

Licence
Ce projet est sous licence MIT.
Reportez-vous au fichier LICENSE (ou insérez directement le texte de licence) pour plus de détails.
Amusez-vous bien dans Dungeon Speed et que la chasse au trésor commence !

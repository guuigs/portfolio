let video;
let angle = 0;
let baseSize = 50;

/* ---------------------------------------------------------------------------
   Archivage 2026 — remise en marche du visualiseur.

   Le code d'origine mesurait le niveau sonore avec `new p5.Amplitude()`. Cette
   classe appartient à p5.sound, qui n'a jamais été chargé par les pages : seul
   p5.js l'était. `setup()` levait donc une exception dès la première ligne du
   visualiseur, le canvas n'était jamais créé, et ce fond ne s'est jamais
   affiché — ni en 2025, ni depuis.

   Il est réparé ici — le niveau est lu avec l'API Web Audio plutôt qu'avec
   p5.sound, pour éviter 200 ko de dépendance pour une seule valeur — mais il
   n'est PAS chargé par les pages. Son `background(0)` recouvrirait le rose du
   body, alors que la maquette du projet montre justement les pages morceau en
   rose et orange : le décor voulu est celui qu'on voit aujourd'hui.

   Pour l'activer et juger sur pièce, remettre dans chopin.html, vangogh.html
   et monalisa.html, juste avant </body> :

       <script src="audiovisualision.js"></script>
   --------------------------------------------------------------------------- */

let analyser = null;
let samples = null;

function attachAnalyser() {
  if (analyser || !video) return;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;

  try {
    const context = new Ctx();
    const source = context.createMediaElementSource(video);
    const node = context.createAnalyser();
    node.fftSize = 1024;

    // Router la vidéo dans Web Audio la débranche des haut-parleurs : il faut
    // reconnecter la destination, sinon la lecture devient muette.
    source.connect(node);
    node.connect(context.destination);
    if (context.state === "suspended") context.resume();

    analyser = node;
    samples = new Uint8Array(node.fftSize);
  } catch {
    // Navigateur qui refuse, ou élément déjà routé. On laisse le losange au
    // repos — jamais au prix de la lecture.
    analyser = null;
  }
}

/** Niveau RMS de l'instant, entre 0 et 1 — la mesure que renvoyait p5. */
function currentLevel() {
  if (!analyser || !video || video.paused || video.ended) return 0;
  analyser.getByteTimeDomainData(samples);
  let sum = 0;
  for (let i = 0; i < samples.length; i += 1) {
    const deviation = (samples[i] - 128) / 128;
    sum += deviation * deviation;
  }
  return Math.sqrt(sum / samples.length);
}

// Initialisation de la scène 3D avec P5.js
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.position(0, 0);
  canvas.style('z-index', '-1'); // Place le canvas derrière le contenu
  frameRate(30);
  angleMode(DEGREES);

  video = document.getElementById('video');
  if (!video) return;
  video.loop = true;

  // createMediaElementSource réclame un geste de l'utilisateur sur la plupart
  // des navigateurs : on attend donc la première lecture pour se brancher.
  video.addEventListener('play', attachAnalyser);
}

// Fonction de dessin pour animer la scène
function draw() {
  background(0);
  rotateY(angle);
  angle += 1; // Rotation continue à 360 degrés

  // Obtenir le niveau d'amplitude de l'audio
  const size = map(currentLevel(), 0, 1, baseSize, 200);

  // Dessiner un losange
  push();
  translate(0, 0, 0);
  rotateX(45); // Incliner le losange pour une meilleure visualisation
  fill(255, 100, 150);
  beginShape();
  vertex(-size / 2, 0, 0);
  vertex(0, -size / 2, 0);
  vertex(size / 2, 0, 0);
  vertex(0, size / 2, 0);
  endShape(CLOSE);
  pop();
}

// Fonction pour redimensionner le canevas lorsque la fenêtre change de taille
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

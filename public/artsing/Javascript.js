var quotes = [];


var s = 'ArtSing';
// Appliquer la police importée
var fontSizeS = 10; // Initialisation avec une valeur par défaut
var fontColorS = [214, 87, 19, 150]; // Ajout de l'opacité (255 pour pleine opacité)
var fontStyleS = 'italic'; // Peut être 'normal' ou 'italic'

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1'); // Place le canvas derrière le contenu
    frameRate(4);
    }

function draw() {
    background(241, 206, 200);
    if (frameCount % 5 === 0) { // Ajoute une nouvelle citation toutes les 10 frames
        var quote = new Quote(random(-600, windowWidth), 20 + random(0, windowHeight));
        quotes.push(quote);
        fontSizeS = Math.floor(Math.random() * (16 - 14 + 1)) + 10; // Met à jour la taille de la police
    }
    for (var i = 0; i < quotes.length; i++) {
        quotes[i].move();
        quotes[i].display();
    }
}

class Quote {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    display() {
        // Contrôler l'esthétique des textes
        fill(fontColorS[0], fontColorS[1], fontColorS[2], fontColorS[3]); // Utilisation des valeurs RGBA
        textSize(fontSizeS);
        text(s, this.x, this.y);
    }

    move() {
        this.x = this.x + random(0, 40);
    }
}

    function windowResized() {
      resizeCanvas(windowWidth, windowHeight); // Ajuste le canvas lorsque la fenêtre est redimensionnée
    }




// -------------------------------------------


const cards = document.querySelectorAll('.card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (event) => {
                const cardRect = card.getBoundingClientRect();
                const cardCenterX = cardRect.left + cardRect.width / 2;
                const cardCenterY = cardRect.top + cardRect.height / 2;

                const mouseX = event.clientX;
                const mouseY = event.clientY;

                const deltaX = mouseX - cardCenterX;
                const deltaY = mouseY - cardCenterY;

                const tiltX = (deltaX / cardRect.width) * 20;
                const tiltY = -(deltaY / cardRect.height) * 20;

                card.style.transform = `perspective(1000px) rotateY(${tiltX}deg) rotateX(${tiltY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
            });
        });



// ------------------------------------------------------


const headerImage = document.getElementById('header-image');
const tooltip = document.getElementById('tooltip');

headerImage.addEventListener('mouseenter', () => {
  tooltip.style.display = 'block';
});

headerImage.addEventListener('mouseleave', () => {
  tooltip.style.display = 'none';
});

headerImage.addEventListener('mousemove', (e) => {
  const rect = headerImage.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  tooltip.style.left = `${e.pageX - tooltip.offsetWidth - 20}px`;
  tooltip.style.top = `${e.pageY - tooltip.offsetHeight / 2}px`;
});
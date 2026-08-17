// ------------------------------------------------------


const video = document.getElementById('video');
const playPauseBtn = document.getElementById('playPauseBtn');
const progress = document.getElementById('progress');
const muteBtn = document.getElementById('muteBtn');
const currentLyricsDiv = document.getElementById('current-lyrics');
const nextLyricsDiv = document.getElementById('next-lyrics');

const lyrics = [
    { time: 0, text: "..." },
    { time: 21, text: "Un peu de bizz, un peu de buzz, un peu de haine" },
    { time: 25, text: "Quand tout est noir, venir parler, c'est plus la peine" },
    { time: 28, text: "Pars au charbon, rentre à la maison et ramène l'oseille" },
    { time: 31, text: "Donc j'suis au stud', je fais des hits et je t'emmerde" },
    { time: 35, text: "Eh, ton avis, on s'en bat les (quoi)," },
    { time: 37, text: "sauf si c'est pour dire : Comment allez-vous ?" },
    { time: 39, text: "Tu prends l'seum sans m'en parler, ouais" },
    { time: 41, text: "en vrai, t'es un fan, tu veux faire le fou (eheh)" },
    { time: 43, text: "La haine, ça rend mauvais, tu parles mal puis tu dis S'te-plaît" },
    { time: 46, text: "Petite puta, respecte-toi" },
    { time: 48, text: "garde ta salive et mes secrets, ouais" },
    { time: 50, text: "Tu perds ton temps à trop parler, ouais" },
    { time: 51.5, text: "faut prendre son biff et se tailler, ouais" },
    { time: 53, text: "Tu jactes trop dans mon dos, j'te baise" },
    { time: 55, text: "ta re-s' , j'la tiens par les couettes (eheh)" },
    { time: 57, text: "J'en ai trop chié pour en arriver là" },
    { time: 59, text: "appelle-moi PLK ou lak-Po"},
    { time: 61, text: "Eux et nous, y a trop d'écart" },
    { time: 62, text: "j'ai l'disque d'or dans l'sac à dos"},
    { time: 64, text: "Un peu de bizz, un peu de buzz, un peu de haine" },
    { time: 68, text: "Quand tout est noir, venir parler, c'est plus la peine" },
    { time: 71, text: "Pars au charbon, rentre à la maison et ramène l'oseille" },
    { time: 74, text: "Donc j'suis au stud', je fais des hits et je t'emmerde" },
    { time: 78, text: "Tu peux parler, j'te baise quand même"},
    { time: 80, text: "tu peux rager, j'te baise quand même"},
    { time: 82, text: "Lundi, mardi, j'te baise quand même"},
    { time: 84, text: "mercredi, jeudi et toute la semaine"},
    { time: 86, text: "Tu peux parler, j'te baise quand même"},
    { time: 88, text: "tu peux rager, j'te baise quand même"},
    { time: 89.5, text: "Lundi, mardi, j'te baise quand même"},
    { time: 91, text: "mercredi, jeudi et toute la semaine"},
    { time: 93, text: "Beaucoup parler peut t'tuer, boy (boy)"},
    { time: 95, text: "c'est comme avec les tchoïs (tchoïs)"},
    { time: 97, text: "Tout part en couilles comme le jour où t'as plus d'école"},
    { time: 100, text: "Avec le buzz, rien qu'ça parle (wouf wouf), rien qu'ça parle"},
    { time: 103, text: "Ça fume le Rif, la patate, (pf-pf), ça tabasse"},
    { time: 107, text: "Ils te souhaitent le mal pour leur faire du bien"},
    { time: 109, text: "qu'est-ce qu'tu veux qu'j'te dise ? C'est comme des chiens"},
    { time: 110.5, text: "Ils font des bêtises mais quand maître revient"},
    { time: 112, text: "ils pleurent à la niche et font genre qu't'aimes bien"},
    { time: 114, text: "Moi, j'reste dans l'tieks, grâce à Dieu j'encaisse"},
    { time: 118, text: "Une équipe solide, j'avais pas l'permis"},
    { time: 119.5, text: "mais j'avais ma caisse (eh, eh)"},
    { time: 121, text: "Un peu de bizz, un peu de buzz, un peu de haine" },
    { time: 125, text: "Quand tout est noir, venir parler, c'est plus la peine" },
    { time: 128, text: "Pars au charbon, rentre à la maison et ramène l'oseille" },
    { time: 131.5, text: "Donc j'suis au stud', je fais des hits et je t'emmerde" },
    { time: 136, text: "Tu peux parler, j'te baise quand même"},
    { time: 138, text: "tu peux rager, j'te baise quand même"},
    { time: 139.5, text: "Lundi, mardi, j'te baise quand même"},
    { time: 141, text: "mercredi, jeudi et toute la semaine"},
    { time: 143, text: "Tu peux parler, j'te baise quand même"},
    { time: 144.5, text: "tu peux rager, j'te baise quand même"},
    { time: 146, text: "Lundi, mardi, j'te baise quand même"},
    { time: 148, text: "mercredi, jeudi et toute la semaine"},
    { time: 150, text: "Un peu de bizz, un peu de buzz, un peu de haine" },
    { time: 154, text: "Quand tout est noir, venir parler, c'est plus la peine" },
    { time: 157, text: "Pars au charbon, rentre à la maison et ramène l'oseille" },
    { time: 161, text: "Donc j'suis au stud', je fais des hits et je t'emmerde" },
    { time: 165, text: "..." },
];




let currentLyricIndex = 0;

function togglePlayPause() {
    if (video.paused) {
        video.play();
        playPauseBtn.innerHTML = '<img src="imgs/pause.svg" alt="Pause">';
    } else {
        video.pause();
        playPauseBtn.innerHTML = '<img src="imgs/play.svg" alt="Play">';
    }
}

function updateProgress() {
    const progressPercent = (video.currentTime / video.duration) * 100;
    progress.style.width = `${progressPercent}%`;
}

function toggleMute() {
    video.muted = !video.muted;
    muteBtn.innerHTML = video.muted
        ? '<img src="imgs/Unmute.svg" alt="Unmute">'
        : '<img src="imgs/mute.svg" alt="Mute">';
}

function updateLyrics() {
    const currentTime = video.currentTime;
    if (currentLyricIndex < lyrics.length && currentTime >= lyrics[currentLyricIndex].time) {
        currentLyricsDiv.innerHTML = lyrics[currentLyricIndex].text;
        nextLyricsDiv.innerHTML = lyrics[currentLyricIndex + 1]?.text || "";
        currentLyricIndex++;
    }
}

function handleKeydown(event) {
    if (event.code === 'Space') {
        event.preventDefault(); // Empêche le défilement de la page
        togglePlayPause();
    }
}

function initializeLyrics() {
    currentLyricsDiv.innerHTML = lyrics[0]?.text || ""; // Affiche la première lyric
    nextLyricsDiv.innerHTML = lyrics[1]?.text || "";   // Affiche la lyric suivante
}
initializeLyrics();


// Event Listeners
playPauseBtn.addEventListener('click', togglePlayPause);
muteBtn.addEventListener('click', toggleMute);
video.addEventListener('timeupdate', () => {
    updateProgress();
    updateLyrics();
});
video.addEventListener('ended', () => {
    playPauseBtn.innerHTML = '<img src="imgs/play.svg" alt="Play">';
});
document.addEventListener('keydown', handleKeydown);




// ------------------------------------------

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
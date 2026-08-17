// ------------------------------------------------------


const video = document.getElementById('video');
const playPauseBtn = document.getElementById('playPauseBtn');
const progress = document.getElementById('progress');
const muteBtn = document.getElementById('muteBtn');
const currentLyricsDiv = document.getElementById('current-lyrics');
const nextLyricsDiv = document.getElementById('next-lyrics');

const lyrics = [
    { time: 0, text: "..." },
    { time: 28, text: "Sunny" },
    { time: 31, text: "Yesterday my life was filled with rain" },
    { time: 36, text: "Sunny" },
    { time: 38.5, text: "You smiled at me and really eased the pain" },
    { time: 43, text: "The dark days are gone and the bright days are here" },
    { time: 47.5, text: "My sunny one shines so sincere" },
    { time: 51.5, text: "Sunny, one so true" },
    { time: 55, text: "I love you" },
    { time: 59, text: "Sunny (Yeah)" },
    { time: 63, text: "Thank you for the sunshine bouquet (That sweet bouquet)" },
    { time: 68, text: "Sunny" },
    { time: 70, text: "Thank you for the love you've brought my way" },
    { time: 75, text: "You gave to me your all and all" },
    { time: 79, text: "And now I feel ten feet tall" },
    { time: 83, text: "Sunny, one so true" },
    { time: 86, text: "I love you" },
    { time: 91, text: "Sunny" },
    { time: 94, text: "Thank you for the truth you let me see" },
    { time: 99, text: "Sunny" },
    { time: 102, text: "Thank you for the facts from A to Z" },
    { time: 106.5, text: "My life was torn like the wind-blown sand" },
    { time: 110, text: "And a rock was formed when you held my hand" },
    { time: 114.5, text: "Sunny, one so true" },
    { time: 117.5, text: "I love you" }, 
    { time: 122, text: "Sunny" },
    { time: 123.5, text: "..." },
    { time: 154, text: "Sunny" },
    { time: 156, text: "Thank you for the smile upon your face" },
    { time: 161.5, text: "Sunny" },
    { time: 165, text: "Thank you for the gleam that shows disgrace" },
    { time: 169.5, text: "You're my part of nature's fire" },
    { time: 173.5, text: "You're my sweet complete desire" },
    { time: 178, text: "Sunny, one so true" },
    { time: 180.5, text: "I love you" },
    { time: 184.5, text: "Sunny (Sunny)" },
    { time: 188.5, text: "Yesterday my life was filled with rain" },
    { time: 193, text: "Sunny (Sunny yeah)" },
    { time: 196, text: "You smiled at me and really eased the pain" },
    { time: 201, text: "The dark days are gone and the bright days are here" },
    { time: 205, text: "My sunny one shines so sincere" },
    { time: 209, text: "Sunny, one so true" },
    { time: 212, text: "I love you (yeah)" },
    { time: 215.5, text: "I love you (Oh my baby)" },
    { time: 220, text: "I love you (2)" },
    { time: 229, text: "..." },
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
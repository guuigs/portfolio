// ------------------------------------------------------


const video = document.getElementById('video');
const playPauseBtn = document.getElementById('playPauseBtn');
const progress = document.getElementById('progress');
const muteBtn = document.getElementById('muteBtn');
const currentLyricsDiv = document.getElementById('current-lyrics');
const nextLyricsDiv = document.getElementById('next-lyrics');

const lyrics = [
    { time: 0, text: "..." },
    { time: 9, text: "Sometimes I feel I've got to" },
    { time: 14, text: "Run away I've got to" },
    { time: 17, text: "Get away From the pain you drive into the heart of me" },
    { time: 22, text: "The love we share" },
    { time: 25, text: "Seems to go nowhere" },
    { time: 29, text: "And I've lost my light" },
    { time: 32, text: "For I toss and turn, I can't sleep at night" },
    { time: 37, text: "Once I ran to you (I ran)" },
    { time: 40, text: "Now, I'll run from you" },
    { time: 43, text: "This tainted love you've given" },
    { time: 46, text: "I give you all a boy could give you" },
    { time: 49, text: "Take my tears and that's not nearly all" },
    { time: 54, text: "Oh, tainted love" },
    { time: 57, text: "tainted love" },
    { time: 59, text: "Now, I know I've got to" },
    { time: 63, text: "Run away I've got to" },
    { time: 67, text: "Get away" },
    { time: 68.5, text: "You don't really want any more from me To make things right" },
    { time: 75, text: "You need someone to hold you tight" },
    { time: 78, text: "And you think love is to pray" },
    { time: 82, text: "But I'm sorry, I don't pray that way" },
    { time: 86, text: "Once I ran to you (I ran)" },
    { time: 90, text: "Now, I'll run from you" },
    { time: 93, text: "This tainted love you've given" },
    { time: 96, text: "I give you all a boy could give you" },
    { time: 99, text: "Take my tears and that's not nearly all" },
    { time: 103.5, text: "Oh, tainted love" },
    { time: 106.5, text: "tainted love" },
    { time: 108, text: "Don't touch me please" },
    { time: 111.5, text: "I cannot stand the way you tease" },
    { time: 115, text: "I love you, though you hurt me so" },
    { time: 118.5, text: "Now, I'm gonna pack my things and go" },
    { time: 123, text: "Tainted love, oh, tainted love, oh (X2)" },
    { time: 136, text: "Touch me, baby, tainted love (X2)" },
    { time: 143, text: "Tainted love, oh(X3)" },
    { time: 152, text: "..." },
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
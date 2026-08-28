const filterButtons = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.project-card');
const commercialGrid = document.querySelector('.commercial-grid');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;

    filterButtons.forEach(item => {
      item.classList.remove('is-active');
    });

    button.classList.add('is-active');

    cards.forEach(card => {
      card.classList.toggle(
        'is-hidden',
        card.dataset.category !== selected
      );
    });

    if (commercialGrid) {
      commercialGrid.classList.toggle(
        'is-hidden',
        selected !== 'commercials'
      );
    }
  });
});


const modal = document.getElementById('videoModal');
const frame = document.getElementById('videoFrame');

document.querySelectorAll('.commercial-grid .video-card[data-platform="vimeo"]').forEach(card => {
  const videoId = card.dataset.video;
  const art = card.querySelector('.project-art');

  fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`)
    .then(response => response.json())
    .then(data => {
      if (data.thumbnail_url && art) {
        art.style.backgroundImage = `url("${data.thumbnail_url}")`;
        art.style.backgroundSize = 'cover';
        art.style.backgroundPosition = 'center';
        art.style.backgroundRepeat = 'no-repeat';
      }
    })
    .catch(error => {
      console.error('Vimeo thumbnail error:', videoId, error);
    });
});
document.querySelectorAll('.video-card').forEach(card => {
card.addEventListener('click', () => {
    if (card.dataset.platform === 'vimeo') {
      frame.src =
        `https://player.vimeo.com/video/${card.dataset.video}?autoplay=1`;
    } else {
      frame.src =
        `https://www.youtube.com/embed/${card.dataset.video}?autoplay=1&rel=0`;
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  });
});


function closeVideo() {
  frame.src = '';
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}


document.querySelectorAll('[data-close-video]').forEach(button => {
  button.addEventListener('click', closeVideo);
});


document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeVideo();
  }
});
// =========================
// CUSTOM GAME MUSIC PLAYER
// =========================

document.querySelectorAll(".music-track").forEach((track) => {
  const audio = track.querySelector("audio");

  if (!audio) return;

  // створюємо кнопку Play/Pause
  const playButton = document.createElement("button");
  playButton.className = "track-play";
  playButton.type = "button";
  playButton.setAttribute("aria-label", "Play track");
  playButton.textContent = "▶";

  // створюємо waveform/progress
  const progress = document.createElement("div");
  progress.className = "track-progress";

  const progressFill = document.createElement("div");
  progressFill.className = "track-progress__fill";

  progress.appendChild(progressFill);

  // створюємо час
  const time = document.createElement("span");
  time.className = "track-time";
  time.textContent = "0:00";

  // вставляємо елементи перед audio
  track.insertBefore(playButton, audio);
  track.insertBefore(progress, audio);
  track.insertBefore(time, audio);

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  audio.addEventListener("loadedmetadata", () => {
    time.textContent = formatTime(audio.duration);
  });

  playButton.addEventListener("click", () => {
    if (audio.paused) {
      // зупиняємо всі інші треки
      document.querySelectorAll(".music-track audio").forEach((otherAudio) => {
        if (otherAudio !== audio) {
          otherAudio.pause();
        }
      });

      audio.play();
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", () => {
    document.querySelectorAll(".music-track").forEach((otherTrack) => {
      if (otherTrack !== track) {
        otherTrack.classList.remove("is-playing");

        const otherButton = otherTrack.querySelector(".track-play");
        if (otherButton) otherButton.textContent = "▶";
      }
    });

    track.classList.add("is-playing");
    playButton.textContent = "Ⅱ";
    playButton.setAttribute("aria-label", "Pause track");
  });

  audio.addEventListener("pause", () => {
    track.classList.remove("is-playing");
    playButton.textContent = "▶";
    playButton.setAttribute("aria-label", "Play track");
  });

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;

    const percentage = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${percentage}%`;

    const remaining = audio.duration - audio.currentTime;
    time.textContent = formatTime(remaining);
  });

  audio.addEventListener("ended", () => {
    progressFill.style.width = "0%";
    time.textContent = formatTime(audio.duration);
  });

  // клік по waveform перемотує трек
  progress.addEventListener("click", (event) => {
    if (!audio.duration) return;

    const rect = progress.getBoundingClientRect();
    const position = (event.clientX - rect.left) / rect.width;

    audio.currentTime = position * audio.duration;
  });
});

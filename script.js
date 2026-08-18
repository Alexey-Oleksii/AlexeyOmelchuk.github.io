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

document.querySelectorAll('.video-card[data-platform="vimeo"]').forEach(card => {
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
document.querySelectorAll('.commercial-grid .video-card[data-platform="vimeo"]').forEach(card => {
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

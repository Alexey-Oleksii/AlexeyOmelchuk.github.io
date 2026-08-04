const filterButtons = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.project-card');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    cards.forEach((card) => {
      card.classList.toggle('is-hidden', card.dataset.category !== selected);
    });
  });
});

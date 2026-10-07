// Guarda quais teclas estão pressionadas neste momento.
const keys = {};

const BLOCKED_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'];

window.addEventListener('keydown', (e) => {
  keys[e.code] = true;
  // Evita que as setas/espaço rolem a página
  if (BLOCKED_KEYS.includes(e.code)) e.preventDefault();
});

window.addEventListener('keyup', (e) => {
  keys[e.code] = false;
});

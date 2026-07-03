/**
 * Animações de slide up + fade in ao entrar no viewport.
 */

const SELETORES = [
  '.biolink-header',
  '.biolink-divider',
  '.biolink-secao--sobre',
  '.biolink-secao--links',
  '.biolink-footer',
];

/**
 * @param {HTMLElement} root
 */
export function inicializarAnimacoesScroll(root) {
  if (!root) {
    return;
  }

  const elementos = SELETORES.flatMap((seletor) =>
    [...root.querySelectorAll(seletor)]
  );

  elementos.forEach((elemento) => {
    elemento.classList.add('biolink-animate');
  });

  if (elementos.length === 0) {
    return;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elementos.forEach((elemento) => {
      elemento.classList.add('biolink-animate--visivel');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('biolink-animate--visivel');
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -24px 0px',
    }
  );

  elementos.forEach((elemento) => observer.observe(elemento));
}

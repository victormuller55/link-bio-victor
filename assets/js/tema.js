/**
 * Gerenciamento de tema claro/escuro.
 */

const CHAVE_STORAGE = 'biolink-tema';
const TEMA_ESCURO = 'escuro';
const TEMA_CLARO = 'claro';

const ICONE_LUA = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

const ICONE_SOL = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;

/**
 * @returns {'claro'|'escuro'}
 */
export function obterTemaAtual() {
  return document.documentElement.getAttribute('data-tema') === TEMA_ESCURO
    ? TEMA_ESCURO
    : TEMA_CLARO;
}

/**
 * @param {'claro'|'escuro'} tema
 */
export function aplicarTema(tema) {
  document.documentElement.setAttribute('data-tema', tema);

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', tema === TEMA_ESCURO ? '#0a0a0a' : '#ffffff');
  }

  try {
    localStorage.setItem(CHAVE_STORAGE, tema);
  } catch {
    /* storage indisponível */
  }

  atualizarBotaoTema();
}

export function alternarTema() {
  const proximo = obterTemaAtual() === TEMA_ESCURO ? TEMA_CLARO : TEMA_ESCURO;
  aplicarTema(proximo);
}

/**
 * Restaura tema salvo ou aplica claro como padrão.
 */
export function inicializarTema() {
  let tema = TEMA_CLARO;

  try {
    const salvo = localStorage.getItem(CHAVE_STORAGE);
    if (salvo === TEMA_ESCURO || salvo === TEMA_CLARO) {
      tema = salvo;
    }
  } catch {
    /* storage indisponível */
  }

  aplicarTema(tema);
}

function atualizarBotaoTema() {
  const botao = document.getElementById('biolink-tema-toggle');
  if (!botao) {
    return;
  }

  const escuro = obterTemaAtual() === TEMA_ESCURO;

  botao.innerHTML = escuro ? ICONE_SOL : ICONE_LUA;
  botao.setAttribute('aria-label', escuro ? 'Alternar para modo claro' : 'Alternar para modo escuro');
  botao.setAttribute('aria-pressed', String(escuro));
  botao.title = escuro ? 'Modo claro' : 'Modo escuro';
}

/**
 * Vincula o botão de alternância de tema.
 */
export function inicializarBotaoTema() {
  const botao = document.getElementById('biolink-tema-toggle');
  if (!botao) {
    return;
  }

  botao.addEventListener('click', alternarTema);
  atualizarBotaoTema();
}

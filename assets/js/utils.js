/**
 * Funções auxiliares reutilizáveis.
 */

/**
 * Identificador fixo do BioLink na API Convertix.
 */
export const SITE_ID = '5';

/**
 * Extrai as iniciais de um nome (máximo 2 caracteres).
 * @param {string} nome
 * @returns {string}
 */
export function getInitials(nome) {
  if (!nome || typeof nome !== 'string') {
    return '?';
  }

  const palavras = nome.trim().split(/\s+/).filter(Boolean);

  if (palavras.length === 0) {
    return '?';
  }

  if (palavras.length === 1) {
    return palavras[0].charAt(0).toUpperCase();
  }

  return (palavras[0].charAt(0) + palavras[palavras.length - 1].charAt(0)).toUpperCase();
}

/**
 * Cria um elemento DOM com atributos e filhos opcionais.
 * @param {string} tag
 * @param {Object} [atributos]
 * @param {Array<string|Node>} [filhos]
 * @returns {HTMLElement}
 */
export function createElement(tag, atributos = {}, filhos = []) {
  const elemento = document.createElement(tag);

  Object.entries(atributos).forEach(([chave, valor]) => {
    if (valor === null || valor === undefined) {
      return;
    }

    if (chave === 'className') {
      elemento.className = valor;
      return;
    }

    if (chave === 'textContent') {
      elemento.textContent = valor;
      return;
    }

    if (chave === 'innerHTML') {
      elemento.innerHTML = valor;
      return;
    }

    if (chave.startsWith('on') && typeof valor === 'function') {
      elemento.addEventListener(chave.slice(2).toLowerCase(), valor);
      return;
    }

    if (chave === 'dataset') {
      Object.entries(valor).forEach(([dataKey, dataVal]) => {
        elemento.dataset[dataKey] = dataVal;
      });
      return;
    }

    elemento.setAttribute(chave, valor);
  });

  filhos.forEach((filho) => {
    if (filho === null || filho === undefined) {
      return;
    }

    if (typeof filho === 'string') {
      elemento.appendChild(document.createTextNode(filho));
      return;
    }

    elemento.appendChild(filho);
  });

  return elemento;
}

/**
 * Limpa o conteúdo de um container e exibe estado de loading.
 * @param {HTMLElement} container
 */
export function showLoading(container) {
  if (!container) {
    return;
  }

  container.className = 'biolink-conteudo';
  container.innerHTML = '';
  container.setAttribute('aria-busy', 'true');
}

/**
 * Remove estado de loading do container.
 * @param {HTMLElement} container
 */
export function hideLoading(container) {
  if (!container) {
    return;
  }

  container.removeAttribute('aria-busy');
}

/**
 * Monta URL completa para foto de perfil.
 * @param {string} caminho
 * @param {string} baseUrl
 * @returns {string}
 */
export function montarUrlFoto(caminho, baseUrl) {
  if (!caminho) {
    return '';
  }

  if (caminho.startsWith('http://') || caminho.startsWith('https://')) {
    return caminho;
  }

  const base = baseUrl.replace(/\/$/, '');
  const caminhoNormalizado = caminho.startsWith('/') ? caminho : `/${caminho}`;

  return `${base}${caminhoNormalizado}`;
}

/**
 * Ordena itens pela propriedade ordem.
 * @param {Array} itens
 * @returns {Array}
 */
export function ordenarItens(itens) {
  if (!Array.isArray(itens)) {
    return [];
  }

  return [...itens].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
}

/**
 * Atualiza metadados SEO da página com dados do perfil.
 * @param {Object} dados
 */
export function atualizarMetadados(dados) {
  if (!dados) {
    return;
  }

  const nome = dados.nome?.trim() || 'Victor Muller';
  const titulo = `${nome} | BioLink Convertix`;

  document.title = titulo;

  const descricao =
    dados.descricao?.trim() ||
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
  const metaDescription = document.querySelector('meta[name="description"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');

  if (metaDescription) {
    metaDescription.setAttribute('content', descricao);
  }

  if (ogTitle) {
    ogTitle.setAttribute('content', titulo);
  }

  if (ogDescription) {
    ogDescription.setAttribute('content', descricao);
  }
}

/**
 * Recarrega a página atual.
 */
export function recarregarPagina() {
  window.location.reload();
}

/**
 * Volta para a página anterior ou redireciona para Convertix.
 */
export function voltarPagina() {
  if (window.history.length > 1) {
    window.history.back();
    return;
  }

  window.location.href = 'https://convertix.net.br';
}

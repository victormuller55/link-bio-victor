/**
 * Renderização da interface do BioLink.
 */

import { API_BASE_URL } from './api.js';
import { obterIcone, obterIconeSeta } from './icons.js';
import {
  createElement,
  getInitials,
  montarUrlFoto,
  ordenarItens,
  recarregarPagina,
  voltarPagina,
  atualizarMetadados,
  hideLoading,
} from './utils.js';
import { inicializarAnimacoesScroll } from './scroll-animate.js';

const NOME_PADRAO = 'Victor Muller';
const USUARIO_PADRAO = 'victor.muller20';

const TEXTO_PLACEHOLDER = {
  descricao: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  sobreTitulo: 'Sobre mim',
  sobre:
    'Gosto de tecnologia, desafios e de transformar ideias em projetos. Também curto Fórmula 1, games e descobrir coisas novas. Estou sempre aprendendo, testando e criando. Se você chegou até aqui, seja muito bem-vindo!',
};

/**
 * Usa o valor da API quando existir; caso contrário, aplica o fallback.
 * @param {string} valor
 * @param {string} fallback
 * @returns {string}
 */
function resolverTexto(valor, fallback) {
  if (valor && typeof valor === 'string' && valor.trim()) {
    return valor.trim();
  }

  return fallback;
}

const ICONE_DIVISOR = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

const ILUSTRACAO_NAO_ENCONTRADO = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none" aria-hidden="true">
    <circle cx="60" cy="60" r="50" stroke="currentColor" stroke-width="2" opacity="0.3"/>
    <path d="M40 45c0-11 9-20 20-20s20 9 20 20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="48" cy="52" r="3" fill="currentColor"/>
    <circle cx="72" cy="52" r="3" fill="currentColor"/>
    <path d="M45 78c5 6 25 6 30 0" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M35 35l50 50M85 35L35 85" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  </svg>
`;

const ILUSTRACAO_ERRO = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none" aria-hidden="true">
    <circle cx="60" cy="60" r="50" stroke="currentColor" stroke-width="2" opacity="0.3"/>
    <path d="M60 35v30" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    <circle cx="60" cy="78" r="3" fill="currentColor"/>
    <path d="M35 85c8-12 52-12 50 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
  </svg>
`;

/**
 * Renderiza skeleton loading enquanto a API responde.
 * @param {HTMLElement} container
 */
export function renderLoading(container) {
  container.className = 'biolink-conteudo';
  container.setAttribute('aria-busy', 'true');
  container.setAttribute('aria-label', 'Carregando BioLink');

  const fragmento = document.createDocumentFragment();

  const skeleton = createElement('div', { className: 'biolink-skeleton' }, [
    createElement('div', { className: 'biolink-skeleton__avatar skeleton-pulse' }),
    createElement('div', { className: 'biolink-skeleton__linha biolink-skeleton__linha--nome skeleton-pulse' }),
    createElement('div', { className: 'biolink-skeleton__linha biolink-skeleton__linha--descricao skeleton-pulse' }),
    createElement('div', { className: 'biolink-skeleton__linha biolink-skeleton__linha--descricao-curta skeleton-pulse' }),
    createElement('div', { className: 'biolink-skeleton__links' }, [
      createElement('div', { className: 'biolink-skeleton__link skeleton-pulse' }),
      createElement('div', { className: 'biolink-skeleton__link skeleton-pulse' }),
      createElement('div', { className: 'biolink-skeleton__link skeleton-pulse' }),
      createElement('div', { className: 'biolink-skeleton__link skeleton-pulse' }),
    ]),
  ]);

  fragmento.appendChild(skeleton);
  container.replaceChildren(fragmento);
}

/**
 * Renderiza estado de erro genérico.
 * @param {HTMLElement} container
 * @param {Object} config
 */
export function renderErro(container, { titulo, texto, ilustracao, rotuloBotao, acaoBotao }) {
  hideLoading(container);
  container.className = 'biolink-conteudo';

  const fragmento = document.createDocumentFragment();

  const estado = createElement('div', { className: 'biolink-estado', role: 'alert' }, [
    createElement('div', {
      className: 'biolink-estado__ilustracao',
      innerHTML: ilustracao,
    }),
    createElement('h1', { className: 'biolink-estado__titulo', textContent: titulo }),
    createElement('p', { className: 'biolink-estado__texto', textContent: texto }),
    createElement('div', { className: 'biolink-estado__acoes' }, [
      createElement('button', {
        className: 'btn btn--primario',
        type: 'button',
        textContent: rotuloBotao,
        onClick: acaoBotao,
      }),
    ]),
  ]);

  fragmento.appendChild(estado);
  container.replaceChildren(fragmento);
}

/**
 * Renderiza erro quando site_id não está presente na URL.
 * @param {HTMLElement} container
 */
export function renderSiteIdAusente(container) {
  renderErro(container, {
    titulo: 'BioLink não encontrado',
    texto: 'Informe um identificador válido na URL. Exemplo: index.html?site_id=4',
    ilustracao: ILUSTRACAO_NAO_ENCONTRADO,
    rotuloBotao: 'Voltar',
    acaoBotao: voltarPagina,
  });
}

/**
 * Renderiza página 404 amigável.
 * @param {HTMLElement} container
 */
export function renderNaoEncontrado(container) {
  renderErro(container, {
    titulo: 'BioLink não encontrado',
    texto: 'Este BioLink não existe ou ainda não foi publicado.',
    ilustracao: ILUSTRACAO_NAO_ENCONTRADO,
    rotuloBotao: 'Voltar',
    acaoBotao: voltarPagina,
  });
}

/**
 * Renderiza erro de conexão com botão de recarregar.
 * @param {HTMLElement} container
 */
export function renderErroConexao(container) {
  renderErro(container, {
    titulo: 'Falha ao carregar os dados.',
    texto: 'Tente novamente.',
    ilustracao: ILUSTRACAO_ERRO,
    rotuloBotao: 'Recarregar',
    acaoBotao: recarregarPagina,
  });
}

/**
 * Renderiza o cabeçalho com foto ou avatar de iniciais.
 * @param {Object} dados
 * @returns {HTMLElement}
 */
export function renderPerfil(dados) {
  const nome = resolverTexto(dados.nome, NOME_PADRAO);
  const usuario = resolverTexto(dados.nome_usuario, USUARIO_PADRAO);
  const descricao = resolverTexto(dados.descricao, TEXTO_PLACEHOLDER.descricao);

  const header = createElement('header', { className: 'biolink-header' });

  const avatarWrap = createElement('div', { className: 'biolink-header__avatar-wrap' });
  const avatar = createElement('div', { className: 'biolink-header__avatar' });

  if (dados.foto_perfil) {
    const urlFoto = montarUrlFoto(dados.foto_perfil, API_BASE_URL);
    const imagem = createElement('img', {
      src: urlFoto,
      alt: `Foto de perfil de ${nome}`,
      loading: 'eager',
      decoding: 'async',
    });

    imagem.addEventListener('error', () => {
      avatar.replaceChildren(
        createElement('span', {
          className: 'biolink-header__iniciais',
          textContent: getInitials(nome),
          'aria-hidden': 'true',
        })
      );
    });

    avatar.appendChild(imagem);
  } else {
    avatar.appendChild(
      createElement('span', {
        className: 'biolink-header__iniciais',
        textContent: getInitials(nome),
        'aria-hidden': 'true',
      })
    );
  }

  avatarWrap.appendChild(avatar);
  header.appendChild(avatarWrap);

  header.appendChild(
    createElement('h1', {
      className: 'biolink-header__nome',
      textContent: nome,
    })
  );

  header.appendChild(
    createElement('p', {
      className: 'biolink-header__descricao',
      textContent: descricao,
    })
  );

  header.appendChild(
    createElement('span', {
      className: 'biolink-header__especialidade',
      textContent: usuario,
    })
  );

  return header;
}

/**
 * Renderiza divisor decorativo abaixo do perfil.
 * @returns {HTMLElement}
 */
function renderDivisor() {
  return createElement('div', { className: 'biolink-divider', 'aria-hidden': 'true' }, [
    createElement('span', {
      className: 'biolink-divider__icone',
      innerHTML: ICONE_DIVISOR,
    }),
  ]);
}

/**
 * Renderiza cabeçalho da seção de links.
 * @returns {HTMLElement}
 */
function renderCabecalhoLinks() {
  return createElement('div', { className: 'biolink-secao__cabecalho' }, [
    createElement('h2', {
      className: 'biolink-secao__titulo',
      textContent: 'Conecte-se',
    }),
    createElement('p', {
      className: 'biolink-secao__subtitulo',
      textContent: 'Minhas redes e contatos',
    }),
  ]);
}

/**
 * Renderiza um único link da lista.
 * @param {Object} item
 * @returns {HTMLElement}
 */
function renderLinkItem(item) {
  const titulo = item.titulo || 'Link';
  const url = item.url || '#';
  const icone = obterIcone(item.icone);

  return createElement('a', {
    className: 'biolink-link',
    href: url,
    target: '_blank',
    rel: 'noopener noreferrer',
    'aria-label': `Abrir ${titulo} em nova aba`,
  }, [
    createElement('span', {
      className: 'biolink-link__icone',
      innerHTML: icone,
    }),
    createElement('span', {
      className: 'biolink-link__titulo',
      textContent: titulo,
    }),
    createElement('span', {
      className: 'biolink-link__seta',
      innerHTML: obterIconeSeta(),
    }),
  ]);
}

/**
 * Renderiza a lista de links ordenada.
 * @param {Array} itens
 * @returns {HTMLElement|null}
 */
export function renderLinks(itens) {
  const itensOrdenados = ordenarItens(itens);

  if (itensOrdenados.length === 0) {
    return null;
  }

  const secao = createElement('section', {
    className: 'biolink-secao biolink-secao--links',
    'aria-label': 'Links',
    dataset: { secao: 'links' },
  });

  secao.appendChild(renderCabecalhoLinks());

  const lista = createElement('nav', {
    className: 'biolink-links',
    'aria-label': 'Lista de links',
  });

  const linksFragmento = document.createDocumentFragment();

  itensOrdenados.forEach((item) => {
    linksFragmento.appendChild(renderLinkItem(item));
  });

  lista.appendChild(linksFragmento);
  secao.appendChild(lista);

  return secao;
}

/**
 * Renderiza a seção "Sobre mim".
 * @param {Object} dados
 * @returns {HTMLElement}
 */
export function renderSobre(dados) {
  const titulo = resolverTexto(dados.sobre_titulo, TEXTO_PLACEHOLDER.sobreTitulo);
  const texto = resolverTexto(dados.sobre, TEXTO_PLACEHOLDER.sobre);

  const secao = createElement('section', {
    className: 'biolink-secao biolink-secao--sobre',
    'aria-label': titulo,
    dataset: { secao: 'sobre' },
  });

  const conteudo = createElement('div', { className: 'biolink-sobre' }, [
    createElement('h2', {
      className: 'biolink-sobre__titulo',
      textContent: titulo,
    }),
    createElement('p', {
      className: 'biolink-sobre__texto',
      textContent: texto,
    }),
  ]);

  secao.appendChild(conteudo);
  return secao;
}

/**
 * Renderiza o rodapé padrão.
 * @returns {HTMLElement}
 */
export function renderFooter() {
  return createElement('footer', { className: 'biolink-footer' }, [
    createElement('p', { className: 'biolink-footer__texto' }, [
      'Powered by ',
      createElement('span', {
        className: 'biolink-footer__marca',
        textContent: 'Convertix',
      }),
    ]),
  ]);
}

/**
 * Container de seções preparado para expansão futura.
 * @param {Array<HTMLElement>} secoes
 * @returns {HTMLElement}
 */
function renderSecoes(secoes) {
  const container = createElement('div', { className: 'biolink-secoes' });
  const fragmento = document.createDocumentFragment();

  secoes.filter(Boolean).forEach((secao) => {
    fragmento.appendChild(secao);
  });

  container.appendChild(fragmento);
  return container;
}

/**
 * Renderiza a página completa com dados da API.
 * @param {HTMLElement} container
 * @param {Object} dados
 */
export function renderPagina(container, dados) {
  hideLoading(container);
  atualizarMetadados(dados);

  container.className = 'biolink-conteudo biolink-conteudo--carregado';

  const fragmento = document.createDocumentFragment();

  fragmento.appendChild(renderPerfil(dados));
  fragmento.appendChild(renderDivisor());

  const secoes = [renderSobre(dados), renderLinks(dados.itens)];
  fragmento.appendChild(renderSecoes(secoes));

  fragmento.appendChild(renderFooter());

  container.replaceChildren(fragmento);
  inicializarAnimacoesScroll(container);
}

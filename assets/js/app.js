/**
 * Fluxo principal da aplicação BioLink Convertix.
 */

import { buscarBioLink, ApiError } from './api.js';
import { getSiteId } from './utils.js';
import { inicializarTema, inicializarBotaoTema } from './tema.js';
import {
  renderLoading,
  renderPagina,
  renderSiteIdAusente,
  renderNaoEncontrado,
  renderErroConexao,
} from './render.js';

const container = document.getElementById('biolink-conteudo');

/**
 * Inicializa a aplicação.
 */
async function iniciar() {
  if (!container) {
    console.error('Container #biolink-conteudo não encontrado.');
    return;
  }

  const siteId = getSiteId();

  if (!siteId) {
    renderSiteIdAusente(container);
    return;
  }

  renderLoading(container);

  try {
    const dados = await buscarBioLink(siteId);
    renderPagina(container, dados);
  } catch (erro) {
    if (erro instanceof ApiError && erro.tipo === 'nao_encontrado') {
      renderNaoEncontrado(container);
      return;
    }

    renderErroConexao(container);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  inicializarTema();
  inicializarBotaoTema();
  iniciar();
});

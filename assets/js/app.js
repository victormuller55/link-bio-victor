/**
 * Fluxo principal da aplicação BioLink Convertix.
 */

import { buscarBioLink, ApiError } from './api.js?v=2';
import { SITE_ID } from './utils.js?v=2';
import { inicializarTema, inicializarBotaoTema } from './tema.js?v=2';
import {
  renderLoading,
  renderPagina,
  renderNaoEncontrado,
  renderErroConexao,
} from './render.js?v=2';

const container = document.getElementById('biolink-conteudo');

/**
 * Inicializa a aplicação.
 */
async function iniciar() {
  if (!container) {
    console.error('Container #biolink-conteudo não encontrado.');
    return;
  }

  renderLoading(container);

  try {
    const dados = await buscarBioLink(SITE_ID);
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

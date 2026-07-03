/**
 * Comunicação com a API pública de BioLinks da Convertix.
 */

export const API_BASE_URL = 'https://api.convertix.net.br';
export const API_ENDPOINT = '/api/v1/biolinks/publico';

export class ApiError extends Error {
  constructor(mensagem, status, tipo) {
    super(mensagem);
    this.name = 'ApiError';
    this.status = status;
    this.tipo = tipo;
  }
}

/**
 * Busca dados públicos de um BioLink pelo site_id.
 * @param {string|number} siteId
 * @returns {Promise<Object>}
 */
export async function buscarBioLink(siteId) {
  const url = `${API_BASE_URL}${API_ENDPOINT}?site_id=${encodeURIComponent(siteId)}`;

  let resposta;

  try {
    resposta = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
  } catch {
    throw new ApiError(
      'Falha ao carregar os dados. Tente novamente.',
      0,
      'conexao'
    );
  }

  if (resposta.status === 404) {
    throw new ApiError(
      'Este BioLink não existe ou ainda não foi publicado.',
      404,
      'nao_encontrado'
    );
  }

  if (!resposta.ok) {
    throw new ApiError(
      'Falha ao carregar os dados. Tente novamente.',
      resposta.status,
      'servidor'
    );
  }

  try {
    return await resposta.json();
  } catch {
    throw new ApiError(
      'Falha ao carregar os dados. Tente novamente.',
      resposta.status,
      'parse'
    );
  }
}

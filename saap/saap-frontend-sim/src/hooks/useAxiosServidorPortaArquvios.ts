import { getConfigLaravel as getConfig } from '../configs/sistemaConfig';
import { urlsServices } from '../configs/urlsConfig';
import axios from 'axios';

const api = axios.create({
  baseURL: urlsServices.BACKENDWS,
  withCredentials: true,
  xsrfCookieName: 'csrf-token',
  xsrfHeaderName: 'X-CSRF-TOKEN',
});

export const useAxiosServidorPortaArquivos = () => ({
  listPortaArquivosPasta: async (filtro: string) => {
    const response = await api.get(
      `get/servidor_list_porta_arquivo_pasta?filtro=${filtro}`,
      getConfig('priv'),
    );
    return response;
  },
  listarServidorPortaArquivos: async (servidor_id: string) => {
    const response = await api.get(
      `get/servidor_list_porta_arquivo?servidor_id=${servidor_id}`,
      getConfig('priv'),
    );
    return response;
  },
  saveServidorPortaArquivo: async (
    servidor_id: string,
    arquivo_id: string,
    user_id: string,
    user_nome: string,
    fileType: string,
    legenda: string,
    numero_sei: string,
    servidor_porta_arquivo_pasta_id: string,
  ) => {
    const response = await api.get(
      `get/servidor_save_porta_arquivo?servidor_id=${servidor_id}&arquivo_id=${arquivo_id}&user_id=${user_id}&user_nome=${user_nome}&fileType=${fileType}&legenda=${legenda}&numero_sei=${numero_sei}&servidor_porta_arquivo_pasta_id=${servidor_porta_arquivo_pasta_id}`,
      getConfig('priv'),
    );
    return response;
  },
  excluirServidorPortaArquivo: async (
    servidor_id: string,
    arquivo_id: string,
    user_id: string,
    user_nome: string,
    pasta: string,
  ) => {
    const response = await api.get(
      `get/servidor_excluir_porta_arquivo?servidor_id=${servidor_id}&arquivo_id=${arquivo_id}&user_id=${user_id}&user_nome=${user_nome}&pasta=${pasta}`,
      getConfig('priv'),
    );
    return response;
  },
  abrirServidorPortaArquivo: async (
    servidor_id: string,
    arquivo_id: string,
    user_id: string,
    user_nome: string,
    pasta: string,
  ) => {
    const response = await api.get(
      `get/servidor_abriu_porta_arquivo?servidor_id=${servidor_id}&arquivo_id=${arquivo_id}&user_id=${user_id}&user_nome=${user_nome}&pasta=${pasta}`,
      getConfig('priv'),
    );
    return response;
  },
  listAuditoriaDossie: async (servidor_id: string) => {
    const response = await api.get(
      `get/servidor_auditoria_porta_arquivo?servidor_id=${servidor_id}`,
      getConfig('priv'),
    );
    return response;
  },
});

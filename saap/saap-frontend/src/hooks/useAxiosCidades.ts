import { getConfigLaravel as getConfig } from '../configs/sistemaConfig';
import { urlsServices } from '../configs/urlsConfig';
import axios from 'axios';

const api = axios.create({
  baseURL: urlsServices.BACKENDWS,
  withCredentials: true,
  xsrfCookieName: 'csrf-token',
  xsrfHeaderName: 'X-CSRF-TOKEN',
});

export const useAxiosCidades = () => ({
  listCidades: async () => {
    const response = await api.get(
      'list/cidade_list',
      getConfig('priv'),
    ); /*?search=${search}*/
    return response;
  },

  listCidadesFiltro: async (zcons_descricao: string) => {
    const response = await api.get(
      `list/cidade_list_filtro?zcons_descricao=${zcons_descricao}`,
      getConfig('priv'),
    );
    return response;
  },
  saveRegional: async (cidade_id: string, drp_id: string, cidade: string) => {
    const response = await api.get(
      `get/regional_save?cidade_id=${cidade_id}&drp_id=${drp_id}&cidade=${cidade}`,
      getConfig('priv'),
    );
    return response;
  },
});

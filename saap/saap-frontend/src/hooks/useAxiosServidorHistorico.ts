import { getConfigLaravel as getConfig } from "../configs/sistemaConfig";
import { urlsServices } from "../configs/urlsConfig";
import axios from "axios";

const api = axios.create({
    baseURL: urlsServices.BACKENDWS,
    withCredentials: true,
    xsrfCookieName: "csrf-token",
    xsrfHeaderName: "X-CSRF-TOKEN",
});

export const useAxiosServidorHistorico = () => ({
  saveServidorHistorico: async (values: any) => {
        const response = await api.post('post/servidor_historico_save', {values}, getConfig('priv'));
        return response;
    },
  listServidorHistorico: async(servidor_cpf: string) => {
      const response = await api.get(`list/servidor_historico_consulta?servidor_cpf=${servidor_cpf}`, getConfig('priv'));
      return response;
  },
  deleteServidorHistorico: async(id: string) => {
        const response = await api.post('delete/servidor_historico_delete', {id}, getConfig('priv'));
        return response;
    },
});



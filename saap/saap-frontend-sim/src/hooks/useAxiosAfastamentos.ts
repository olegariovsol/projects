import { getConfigLaravel as getConfig } from "../configs/sistemaConfig";
import { urlsServices } from "../configs/urlsConfig";
import axios from "axios";

const api = axios.create({
  baseURL: urlsServices.BACKENDWS,
  withCredentials: true,
  xsrfCookieName: "csrf-token",
  xsrfHeaderName: "X-CSRF-TOKEN",
});

export const useAxiosAfastamentos = () => ({
  sincServidoresAfastamentoXLS: async (values: any, additionalParam: any) => {
    const response = await api.post(
      "post/sinc_afastamentos_sicad_observatorio_xls",
      { values, additionalParam },
      getConfig("privF")
    );
    return response;
  },
  listarAfastamentosServidor: async (zservidor_id: string) => {
    const response = await api.get(
      `list/afastamento_servidor_consulta?zservidor_id=${zservidor_id}`,
      getConfig("priv")
    );
    return response;
  },
});

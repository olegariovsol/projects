import { getConfigLaravel as getConfig } from "../configs/sistemaConfig";
import { urlsServices } from "../configs/urlsConfig";
import axios from "axios";

const api = axios.create({
  baseURL: urlsServices.BACKENDWS,
  withCredentials: true,
  xsrfCookieName: "csrf-token",
  xsrfHeaderName: "X-CSRF-TOKEN",
});

export const useAxiosViaturas = () => ({
  listVtrsSaap: async (
    zcons_filtro: string,
    zcons_cidade_id: string,
    zcons_dep_lotacao_id: string,
    zcons_agrupador_lotacao_id: string,
    zcons_servidor_id: string,
    zconfirmacao: string
  ) => {
    const response = await api.get(
      `list/listVtrsSaap?zcons_filtro=${zcons_filtro}&zconfirmacao=${zconfirmacao}&zcons_cidade_id=${zcons_cidade_id}&zcons_dep_lotacao_id=${zcons_dep_lotacao_id}&zcons_agrupador_lotacao_id=${zcons_agrupador_lotacao_id}&zcons_servidor_id=${zcons_servidor_id}`,
      getConfig("priv")
    );
    return response;
  },
  saveVeiculoPortaArquivo: async (
    veiculo_id: string,
    arquivo_id: string,
    user_id: string,
    user_nome: string,
    fileType: string,
    legenda: string
  ) => {
    const response = await api.get(
      `save/vtr_arquivo_save?veiculo_id=${veiculo_id}&arquivo_id=${arquivo_id}&user_id=${user_id}&user_nome=${user_nome}&fileType=${fileType}&legenda=${legenda}`,
      getConfig("priv")
    );
    return response;
  },
  listarVeiculoPortaArquivos: async (veiculo_id: string) => {
    const response = await api.get(
      `list/vtr_arquivo_list?veiculo_id=${veiculo_id}`,
      getConfig("priv")
    );
    return response;
  },
  listAbastecimentos: async (placa: string) => {
    const response = await api.get(
      `list/listAbastecimentos?placa=${placa}`,
      getConfig("priv")
    );
    return response;
  },
  saveViatura: async (values: any) => {
    const response = await api.post(
      "post/saveViatura",
      { values },
      getConfig("priv")
    );
    return response;
  },
  listInfracoes: async (
    zcons_data_tipo: string,
    dtai: string,
    dtaf: string,
    zcons_filtro_and: string,
    zcons_filtro_or: string,
    zcons_filtro: string,
    zorder: string,
    zcons_cidade_id: string,
    zcons_vtr_id: string,
    zcons_dep_lotacao_id: string,
    zcons_agrupador_lotacao_id: string,
    zcons_servidor_id: string
  ) => {
    const response = await api.get(
      `list/infracoes?dtai=${dtai}&dtaf=${dtaf}&zcons_data_tipo=${zcons_data_tipo}&zcons_filtro_and=${zcons_filtro_and}&zcons_filtro_or=${zcons_filtro_or}&zcons_filtro=${zcons_filtro}&zorder=${zorder}&zcons_cidade_id=${zcons_cidade_id}&zcons_vtr_id=${zcons_vtr_id}&zcons_dep_lotacao_id=${zcons_dep_lotacao_id}&zcons_agrupador_lotacao_id=${zcons_agrupador_lotacao_id}&zcons_servidor_id=${zcons_servidor_id}`,
      getConfig("priv")
    );
    return response;
  },
});

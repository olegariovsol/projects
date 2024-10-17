import { getConfigLaravel as getConfig } from '../configs/sistemaConfig';
import { urlsServices } from '../configs/urlsConfig';
import axios from 'axios';

const api = axios.create({
  baseURL: urlsServices.BACKENDWS,
  withCredentials: true,
  xsrfCookieName: 'csrf-token',
  xsrfHeaderName: 'X-CSRF-TOKEN',
});

export const useAxiosDepartamentos = () => ({
  listAuditoriaDepartamento: async (
    zdepartamento_id: string,
    dtai: string,
    dtaf: string,
  ) => {
    const response = await api.get(
      `list/auditoria_departamento_list?zdepartamento_id=${zdepartamento_id}&dtai=${dtai}&dtaf=${dtaf}`,
      getConfig('priv'),
    ); /*?search=${search}*/
    return response;
  },
  listDepartamentos: async (sicad_id: string, filtro: string) => {
    const response = await api.get(
      `list/departamento_list?sicad_id=${sicad_id}&filtro=${filtro}`,
      getConfig('priv'),
    ); /*?search=${search}*/
    return response;
  },
  listGrupos: async (
    zcons_filtro_and: string,
    zcons_filtro_or: string,
    zdp_filtro: string,
    zgrupo: string,
    zdp_id: string,
    zids: string,
    zfiltros_adcionais: string,
    zcons_cidade_id: string,
    zcons_servidor_classificacao: string,
  ) => {
    const response = await api.get(
      `list/grupo_list?zids=${zids}&zfiltros_adcionais=${zfiltros_adcionais}&zdp_id=${zdp_id}&zcons_filtro_and=${zcons_filtro_and}&zcons_filtro_or=${zcons_filtro_or}&zdp_filtro=${zdp_filtro}&zcons_cidade_id=${zcons_cidade_id}&zgrupo_id=${zgrupo}&zcons_servidor_classificacao=${zcons_servidor_classificacao}`,
      getConfig('priv'),
    ); /*?search=${search}*/
    return response;
  },
  GrupoSave: async (values: any) => {
    const response = await api.post(
      'post/grupo_save',
      { values },
      getConfig('priv'),
    );
    return response;
  },
  DepartamentoSave: async (values: any) => {
    const response = await api.post(
      'post/departamento_save',
      { values },
      getConfig('priv'),
    );
    return response;
  },
  listDepartamentosGeral: async (
    zdrp_id: string,
    zcons_filtro_and: string,
    zcons_filtro_or: string,
    zdp_filtro: string,
    zgrupo: string,
    zdp_id: string,
    zorder: string,
    zids: string,
    zfiltros_adcionais: string,
    zcons_cidade_id: string,
    zcons_servidor_classificacao: string,
  ) => {
    const response = await api.get(
      `list/departamento_list_geral?zids=${zids}&zfiltros_adcionais=${zfiltros_adcionais}&zdrp_id=${zdrp_id}&zdp_id=${zdp_id}&zcons_filtro_and=${zcons_filtro_and}&zcons_filtro_or=${zcons_filtro_or}&zdp_filtro=${zdp_filtro}&zgrupo=${zgrupo}&zcons_cidade_id=${zcons_cidade_id}&zorder=${zorder}&zcons_servidor_classificacao=${zcons_servidor_classificacao}`,
      getConfig('priv'),
    ); /*?search=${search}*/
    return response;
  },
  sincSicad: async () => {
    const response = await api.get(
      'create/sinc_sicad',
      getConfig('priv'),
    ); /*?search=${search}*/
    return response;
  },
  /*saveRegional: async(cidade_id:string, drp_id:string, cidade:string) => {
      const response = await api.get(`get/regional_save?cidade_id=${cidade_id}&drp_id=${drp_id}&cidade=${cidade}`, getConfig('priv'));
      return response;
  },*/
  sincCreate: async (values: any) => {
    const response = await api.post(
      'create/table_estructure',
      { values },
      getConfig('priv'),
    );
    return response;
  },
  sincReturn: async (values: any) => {
    const response = await api.post(
      'create/data_return',
      { values },
      getConfig('priv'),
    );
    return response;
  },
  saveDepartamentoPortaArquivo: async (
    departamento_id: string,
    arquivo_id: string,
    user_id: string,
    user_nome: string,
    fileType: string,
    fotos_grupo: string,
  ) => {
    const response = await api.get(
      `get/departamento_save_porta_arquivo?departamento_id=${departamento_id}&arquivo_id=${arquivo_id}&user_id=${user_id}&user_nome=${user_nome}&fileType=${fileType}&fotos_grupo=${fotos_grupo}`,
      getConfig('priv'),
    );
    return response;
  },
  listarDepartamentoPortaArquivos: async (
    departamento_id: string,
    fotos_grupo: string,
  ) => {
    const response = await api.get(
      `get/departamento_list_porta_arquivo?departamento_id=${departamento_id}&fotos_grupo=${fotos_grupo}`,
      getConfig('priv'),
    );
    return response;
  },
  excluirDepartamentoPortaArquivo: async (
    departamento_id: string,
    arquivo_id: string,
    user_id: string,
    user_nome: string,
  ) => {
    const response = await api.get(
      `get/departamento_excluir_porta_arquivo?departamento_id=${departamento_id}&arquivo_id=${arquivo_id}&user_id=${user_id}&user_nome=${user_nome}`,
      getConfig('priv'),
    );
    return response;
  },

  listDepartamentosComparacaoHierarquia: async () => {
    const response = await api.get(
      `list/departamento_list_hierarquia`,
      getConfig('priv'),
    ); /*?search=${search}*/
    return response;
  },
});

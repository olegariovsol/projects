import { getConfigLaravel as getConfig } from "../configs/sistemaConfig";
import { urlsServices } from "../configs/urlsConfig";
import axios from "axios";

const api = axios.create({
  baseURL: urlsServices.BACKENDWS,
  withCredentials: true,
  xsrfCookieName: "csrf-token",
  xsrfHeaderName: "X-CSRF-TOKEN",
});

export const useAxiosServidorAtribuicao = () => ({
  listAuditoriaServidor: async (
    zservidor_id: string,
    dtai: string,
    dtaf: string
  ) => {
    const response = await api.get(
      `list/auditoria_servidor_list?zservidor_id=${zservidor_id}&dtai=${dtai}&dtaf=${dtaf}`,
      getConfig("priv")
    ); /*?search=${search}*/
    return response;
  },
  sincTitularDepartamento: async () => {
    const response = await api.get(
      `sinc/sinc_titular_departamento`,
      getConfig("priv")
    ); /*?search=${search}*/
    return response;
  },
  sincServidoresSicadObservatorio: async (
    zmodo: string,
    sicad_id: string,
    sicad_servidor: string,
    sicad_cpf: string,
    sicad_funcao: string,
    sicad_dtNascimento: string,
    sicad_postoGrad: string,
    sicad_postoSiglaGrad: string,
    sicad_lotacao_id: any,
    sicad_lotacao: string,
    sicad_data_lotacao: string,
    sicad_lotacao_sigla: string,
    sicad_municipio_id: string,
    sicad_municipio: string,
    sicad_status: string,
    sicad_situacao: string,
    sicad_sexo: string,
    sicad_dtPosse: string,
    sicad_matricula_funcional: string,
    lotacao_anterior: any,
    lotacao_anterior_id: any,
    user_nome: string,
    user_id: string
  ) => {
    const response = await api.get(
      `sinc/sinc_servidores_sicad_observatorio?zmodo=${zmodo}&sicad_matricula_funcional=${sicad_matricula_funcional}&sicad_status=${sicad_status}&sicad_situacao=${sicad_situacao}&sicad_sexo=${sicad_sexo}&sicad_dtPosse=${sicad_dtPosse}&sicad_funcao=${sicad_funcao}&sicad_dtNascimento=${sicad_dtNascimento}&sicad_postoGrad=${sicad_postoGrad}&sicad_postoSiglaGrad=${sicad_postoSiglaGrad}&sicad_servidor=${sicad_servidor}&sicad_cpf=${sicad_cpf}&sicad_lotacao_id=${sicad_lotacao_id}&sicad_lotacao=${sicad_lotacao}&sicad_lotacao_sigla=${sicad_lotacao_sigla}&sicad_municipio_id=${sicad_municipio_id}&sicad_municipio=${sicad_municipio}&sicad_data_lotacao=${sicad_data_lotacao}&user_nome=${user_nome}&user_id=${user_id}&sicad_id=${sicad_id}&lotacao_anterior_id=${lotacao_anterior_id}&lotacao_anterior=${lotacao_anterior}`,
      getConfig("priv")
    ); /*?search=${search}*/
    return response;
  },
  sincServidoresSicadObservatorioXLS: async (
    values: any,
    additionalParam: any
  ) => {
    const response = await api.post(
      "post/sinc_servidores_sicad_observatorio_xls",
      { values, additionalParam },
      getConfig("privF")
    );
    return response;
  },
  listServidores: async (
    zcons_data_tipo: string,
    dtai: string,
    dtaf: string,
    zcons_filtro_and: string,
    zcons_filtro_or: string,
    zcons_obs: string,
    zcons_status: string,
    zcons_cpf: string,
    zcons_disposicao: string,
    zcons_dep_lotacao_id: string,
    zcons_agrupador_lotacao_id: string,
    zcons_administracao: string,
    zorder: string,
    zids: string,
    zcps: string,
    zfiltros_adcionais: string,
    zcons_cidade_id: string,
    zcons_servidor_classificacao: string
  ) => {
    const response = await api.get(
      `list/servidor_consulta?zids=${zids}&zcps=${zcps}&zfiltros_adcionais=${zfiltros_adcionais}&dtai=${dtai}&dtaf=${dtaf}&zcons_data_tipo=${zcons_data_tipo}&zcons_filtro_and=${zcons_filtro_and}&zcons_filtro_or=${zcons_filtro_or}&zcons_obs=${zcons_obs}&zcons_status=${zcons_status}&zcons_cpf=${zcons_cpf}&zcons_disposicao=${zcons_disposicao}&zcons_dep_lotacao_id=${zcons_dep_lotacao_id}&zcons_agrupador_lotacao_id=${zcons_agrupador_lotacao_id}&zcons_administracao=${zcons_administracao}&zorder=${zorder}&zcons_cidade_id=${zcons_cidade_id}&zcons_servidor_classificacao=${zcons_servidor_classificacao}`,
      getConfig("priv")
    );
    return response;
  },
  saveServidor: async (values: any) => {
    const response = await api.post(
      "post/servidor_save",
      { values },
      getConfig("priv")
    );
    return response;
  },
  ServidorUpDados: async (values: any) => {
    const response = await api.post(
      "post/servidor_save_updados",
      { values },
      getConfig("priv")
    );
    return response;
  },
});

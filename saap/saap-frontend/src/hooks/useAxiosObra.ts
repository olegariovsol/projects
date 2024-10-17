import { getConfigLaravel as getConfig } from "../configs/sistemaConfig";
import { urlsServices } from "../configs/urlsConfig";
import axios from "axios";

const api = axios.create({
    baseURL: urlsServices.BACKENDWS_OBRAS,
    withCredentials: true,
    xsrfCookieName: "csrf-token",
    xsrfHeaderName: "X-CSRF-TOKEN",
});

export const useAxiosObra = () => ({
    listObra: async(dtai:string, dtaf:string, tipo_data:string, filtro: string, dep_id: string, status: string, regularizacao: string, tipo: string, etapa_id: string, servidor_id: string) => {
        const response = await api.get(`list/obra_consulta?dtai=${dtai}&dtaf=${dtaf}&tipo_data=${tipo_data}&filtro=${filtro}&dep_id=${dep_id}&status=${status}&regularizacao=${regularizacao}&tipo=${tipo}&etapa_id=${etapa_id}&servidor_id=${servidor_id}`, getConfig('priv'));/*?search=${search}*/
        return response;
    },
    DashBoardObrasPorStatus: async(dtai:string, dtaf:string) => {
        const response = await api.get(`dashboard/obra_status?token=${localStorage.getItem('token_sso')}&dtai=${dtai}&dtaf=${dtaf}`, getConfig('priv'));
        return response;
    },
    DashBoardObrasInauguradas: async(dtai:string, dtaf:string) => {
        const response = await api.get(`dashboard/obra_inauguradas?dtai=${dtai}&dtaf=${dtaf}`, getConfig('priv'));
        return response;
    },
    DashBoardObrasTipos: async(dtai:string, dtaf:string) => {
        const response = await api.get(`dashboard/obra_tipos?dtai=${dtai}&dtaf=${dtaf}`, getConfig('priv'));
        return response;
    },
    DashBoardObrasPorInicioTermino: async() => {
        const response = await api.get('dashboard/inicio_termino', getConfig('priv'));
        return response;
    },
    DashBoardCidade: async(dtai:string, dtaf:string) => {
        const response = await api.get(`dashboard/cidade?dtai=${dtai}&dtaf=${dtaf}`, getConfig('priv'));
        return response;
    },
    DashBoardRegularizacao: async(dtai:string, dtaf:string) => {
        const response = await api.get(`dashboard/regularizacao?dtai=${dtai}&dtaf=${dtaf}`, getConfig('priv'));
        return response;
    },
});

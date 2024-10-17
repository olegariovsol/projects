import { getConfigLaravel as getConfig } from "../configs/sistemaConfig";
import { urlsServices } from "../configs/urlsConfig";
import axios from "axios";

const api = axios.create({
    baseURL: urlsServices.BACKENDWS_OBRAS,
    withCredentials: true,
    xsrfCookieName: "csrf-token",
    xsrfHeaderName: "X-CSRF-TOKEN",
});

export const useAxiosObraEtapa = () => ({
    listObraEtapa: async(search:string) => {
        const response = await api.get(`list/obra_etapa_list?obra_id=${search}`, getConfig('priv'));/**/
        return response;
    },
    DashBoardProjeto: async(dtai:string, dtaf:string) => {
        const response = await api.get(`dashboard/projeto?dtai=${dtai}&dtaf=${dtaf}`, getConfig('priv'));
        return response;
    },
    DashBoardRecursos: async(dtai:string, dtaf:string) => {
        const response = await api.get(`dashboard/recurso?dtai=${dtai}&dtaf=${dtaf}`, getConfig('priv'));
        return response;
    },
});

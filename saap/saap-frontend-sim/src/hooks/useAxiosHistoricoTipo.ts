import { getConfigLaravel as getConfig } from "../configs/sistemaConfig";
import { urlsServices } from "../configs/urlsConfig";
import axios from "axios";

const api = axios.create({
    baseURL: urlsServices.BACKENDWS,
    withCredentials: true,
    xsrfCookieName: "csrf-token",
    xsrfHeaderName: "X-CSRF-TOKEN",
});

export const useAxiosHistoricotipo = () => ({
    listHistoricoTipos: async() => {
        const response = await api.get('list/historico_tipos_list', getConfig('priv'));/*?search=${search}*/
        return response;
    }
});







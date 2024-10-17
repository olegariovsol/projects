import { getConfigLaravel as getConfig } from "../configs/sistemaConfig";
import { urlsServices } from "../configs/urlsConfig";
import axios from "axios";

const api = axios.create({
    baseURL: urlsServices.BACKENDWS,
    withCredentials: true,
    xsrfCookieName: "csrf-token",
    xsrfHeaderName: "X-CSRF-TOKEN",
});

export const useAxiosServidor = () => ({
    saveServidor: async(values:any) => {
        const response = await api.post('post/servidor_save', {values}, getConfig('priv'));
        return response;
    },
    listServidorAnexos: async(dtai:string, dtaf:string, tipo_regra:string, filtro: string) => {
        const response = await api.get(`list/servidor_anexos_consulta?dtai=${dtai}&dtaf=${dtaf}&tipo_regra=${tipo_regra}&filtro=${filtro}`, getConfig('priv'));/*?search=${search}*/
        return response;
    },
    getServidor: async(cpf: string) => {
        const response = await api.get(`list/servidor_get?cpf=${cpf}`, getConfig('priv'));/*?search=${search}*/
        return response;
    },
    getServidorAposentadoria: async(cpf: string, regra: string) => {
        const response = await api.get(`list/servidor_aposentadoria_get?cpf=${cpf}&regra=${regra}`, getConfig('priv'));/*?search=${search}*/
        return response;
    },
    graficoGenero: async(dtai:string, dtaf:string) => {
        const response = await api.get(`dashboard/genero?dtai=${dtai}&dtaf=${dtaf}`, getConfig('priv'));
        return response;
    },
    graficoRegra: async(dtai:string, dtaf:string) => {
        const response = await api.get(`dashboard/regra?dtai=${dtai}&dtaf=${dtaf}`, getConfig('priv'));
        return response;
    },
    graficoCargo: async(dtai:string, dtaf:string) => {
        const response = await api.get(`dashboard/cargo?dtai=${dtai}&dtaf=${dtaf}`, getConfig('priv'));
        return response;
    },
    graficoIdade: async(dtai:string, dtaf:string) => {
        const response = await api.get(`dashboard/idade?dtai=${dtai}&dtaf=${dtaf}`, getConfig('priv'));
        return response;
    },
    graficoDtaRequisicao: async(dtai:string, dtaf:string) => {
        const response = await api.get(`dashboard/dta_requisicao?dtai=${dtai}&dtaf=${dtaf}`, getConfig('priv'));
        return response;
    },
});







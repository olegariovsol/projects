import { message } from 'antd';
import axios from 'axios';
import { urlsServices } from '../configs/urlsConfig';
import { getConfigLaravel as getConfig } from '../configs/sistemaConfig';

const apiPortaArquivo = axios.create({
    baseURL: urlsServices.PORTAARQUIVO,
    withCredentials: false,
    xsrfCookieName: "csrf-token",
    xsrfHeaderName: "X-CSRF-TOKEN",
});

export const useAxiosPortaArquivo = () => ({


  post: async (file: any) => {
    const formData = new FormData();
    formData.append('arquivo', file);
    formData.append('tipoPermissao', 'TOKEN');
    formData.append('namespace', 'pc');
    const token = localStorage.getItem('token_sso');
    if (token) {
      formData.append('token', token);
    }
    try {
      const response = await apiPortaArquivo.post(
        '/uploadArquivo',
        formData,
        getConfig('file'),
      );
      //message.success('Upload Realizado com Sucesso');
      return response;
    } catch (error) {
      console.error(`Error: ${error}`);
      return false;
    }
  },

  postPublic: async (file: any) => {
    const formData = new FormData();
    formData.append('arquivo', file);
    formData.append('tipoPermissao', 'PUBLICO');
    formData.append('namespace', 'pc');
    try {
      const response = await apiPortaArquivo.post(
        '/uploadArquivo',
        formData,
        getConfig('file'),
      );
      //message.success('Upload Realizado com Sucesso');
      return response;
    } catch (error) {
      console.error(`Error: ${error}`);
      return false;
    }
  }

});

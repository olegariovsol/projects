import { sistemaNameSSO } from '../../configs/sistemaConfig';
import { urlsServices } from '../../configs/urlsConfig';
import { UserType } from '../../types/UserType';
import { getEncodeAvatarUsuario } from '../../utils/UtilsSistema';

export default class AuthUtils {
  /*static prepareDataUser = (data: UserType) => {
    const dadosUsuario = data;
    if (dadosUsuario && dadosUsuario.cpf) {
      dadosUsuario.icon = `${
        urlsServices.SIGUWS
      }icon?u=${getEncodeAvatarUsuario(dadosUsuario.cpf, '_80')}`;
      if (dadosUsuario.perfis) {
        const thisPerfis: string[] = [];
        dadosUsuario.perfis.forEach((perfil, index) => {
          if (
            perfil.sistema.descricao.toUpperCase() ===
            sistemaNameSSO.toUpperCase()
          ) {
            if (!thisPerfis.includes(perfil.descricao.toUpperCase()))
              thisPerfis.push(perfil.descricao.toUpperCase());
          }
        });
        if (!thisPerfis || thisPerfis.length < 1) {
          dadosUsuario.semPerfilThisSistema = true;
        } else {
          dadosUsuario.perfisSistemaAtual = thisPerfis;
        }
      }
    }
    return dadosUsuario;
  };*/
  static prepareDataUser = (data: UserType): Promise<UserType> => {
    return new Promise((resolve, reject) => {
      const dadosUsuario = data;
      if (dadosUsuario && dadosUsuario.cpf) {
        dadosUsuario.icon = `${urlsServices.SIGUWS}icon?u=${getEncodeAvatarUsuario(
          dadosUsuario.cpf,
          '_80'
        )}`;
        if (dadosUsuario.perfis) {
          const thisPerfis: string[] = [];
          dadosUsuario.perfis.forEach((perfil, index) => {
            if (
              perfil.sistema.descricao.toUpperCase() ===
              sistemaNameSSO.toUpperCase()
            ) {
              if (!thisPerfis.includes(perfil.descricao.toUpperCase()))
                thisPerfis.push(perfil.descricao.toUpperCase());
            }
          });
          if (!thisPerfis || thisPerfis.length < 1) {
            dadosUsuario.semPerfilThisSistema = true;
          } else {
            dadosUsuario.perfisSistemaAtual = thisPerfis;
          }
        }
        resolve(dadosUsuario); // Resolva a Promise com os dados do usuário
      } else {
        reject(new Error('Dados do usuário inválidos')); // Rejeite a Promise se os dados do usuário forem inválidos
      }
    });
  };
}

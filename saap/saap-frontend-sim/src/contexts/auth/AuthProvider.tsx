import React from "react";
import { urlsServices } from "../../configs/urlsConfig";
import { useAxiosSSO } from "../../hooks/useAxiosSSO";
import { UserType } from "../../types/UserType";
import { getParameterUrl } from "../../utils/UtilsSistema";
import { createContext, useContext, useState } from "react";
import AuthUtils from "./AuthUtils";
import { message } from "antd";

type Props = {
  nomeSis: string | null;
  descricaoSis: string | null;
  menus: Menu[] | null;
  children: JSX.Element | null;
};

type Menu = {
  label: string;
  key: string;
  icon: JSX.Element;
  link: string;
  perfis: [];
  children: [];
};

export type AuthContextType = {
  user: UserType | null;
  validado: boolean;
  variaveis: Props | null;
  setVariaveisSis: (props: Props) => void;
  setUserSSO: (us: UserType) => void;
  logoutSSO: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const apiAxios = useAxiosSSO();
  const [user, setUser] = useState<UserType | null>(null);
  const [validado, setValidado] = useState<boolean>(false);

  const [variaveis, setVariaveis] = useState<Props | null>(null);

  const validaToken = async (token: string) => {
    await apiAxios
      .validaTokenSSO(token)
      .then((res: { data: any }) => {
        try {
          const userValidation = AuthUtils.prepareDataUser(res.data);
          localStorage.setItem("token_sso", userValidation.token);
          setUser(userValidation);
          setValidado(true);
        } catch (error) {
          window.location.href = `${
            urlsServices.SSOWS
          }auth?response_type=token_only&client_id=SIMPC&redirect_uri=${encodeURIComponent(
            window.location.href.replace("#", "|").split("/?access_token")[0]
          )}`;
        }
      })
      .catch((err: any) => {
        setUser(null);
        setValidado(false);
        localStorage.removeItem("token_sso");
        window.location.href = `${
          urlsServices.SSOWS
        }auth?response_type=token_only&client_id=SIMPC&redirect_uri=${encodeURIComponent(
          window.location.href.replace("#", "|").split("/?access_token")[0]
        )}`;
        message.error({
          content: "Erro ao tentar validar seu token! Você será redirecionado.",
          //duration: 5,
        });
      });
  };

  const setUserSSO = (us: UserType | null) => {
    setUser(us);
  };

  const setVariaveisSis = (variaveis: Props | null) => {
    console.log("AuthProvider: ", variaveis);
    setVariaveis(variaveis);
  };

  const logoutSSO = async () => {
    await apiAxios.logoutSSO().then((res: any) => {
      setUser(null);
      setValidado(false);
      localStorage.removeItem("token_sso");
    });
  };

  const tokenParam = getParameterUrl("access_token");

  if (
    localStorage.getItem("token_sso") &&
    localStorage.getItem("token_sso") !== "" &&
    localStorage.getItem("token_sso") !== null &&
    localStorage.getItem("token_sso") !== undefined
  ) {
    if (user?.token !== localStorage.getItem("token_sso")!) {
      //validar
      validaToken(localStorage.getItem("token_sso")!);
      //localStorage.removeItem('token_sso');
    }
  } else if (tokenParam) {
    //validar
    validaToken(tokenParam);
  } else {
    window.location.href = `${
      urlsServices.SSOWS
    }auth?response_type=token_only&client_id=SIMPC&redirect_uri=${encodeURIComponent(
      window.location.href.replace("#", "|").split("/?access_token")[0]
    )}`;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        validado,
        variaveis,
        setVariaveisSis,
        setUserSSO,
        logoutSSO,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

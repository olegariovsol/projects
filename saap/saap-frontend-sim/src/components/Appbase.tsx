import React, { Suspense, useEffect, useState } from "react";
import { menuAppBase } from "./MenuAppBase";
import BoasVindas from "../pages/boas_vindas";
import Departamentos from "../pages/departamentos";
import { AuthProvider } from "../contexts/auth/AuthProvider";
import ComponenteOfLine from "../pages/ComponenteOfLine";

const Framework = React.lazy(async () => {
  const host = window.location.host;

  if (host === "sim.policiacivil.go.gov.br") {
    return import("frameworkprod/Framework").catch(() => {
      return {
        default: () => (
          <ComponenteOfLine
            nomeSis={"SAAP"}
            descricaoSis={undefined}
            menus={undefined}
            breadcrumb={undefined}
            children={undefined}
            onChangeMenu={function (itemMenuSelecionado_1: any): void {
              throw new Error("Function not implemented.");
            }}
          />
        ),
      };
    });
  } else if (host === "sim-homo.policiacivil.go.gov.br") {
    return import("frameworkhomo/Framework").catch(() => {
      return {
        default: () => (
          <ComponenteOfLine
            nomeSis={"SAAP-HOMO" + host}
            descricaoSis={undefined}
            menus={undefined}
            breadcrumb={undefined}
            children={undefined}
            onChangeMenu={function (itemMenuSelecionado_1: any): void {
              throw new Error("Function not implemented.");
            }}
          />
        ),
      };
    });
  } else {
    return import("frameworkdesv/Framework").catch(() => {
      return {
        default: () => (
          <ComponenteOfLine
            nomeSis={"SAAP-DESV " + host}
            descricaoSis={undefined}
            menus={undefined}
            breadcrumb={undefined}
            children={undefined}
            onChangeMenu={function (itemMenuSelecionado_1: any): void {
              throw new Error("Function not implemented.");
            }}
          />
        ),
      };
    });
  }
});

export const Appbase = () => {
  const [chave, setChave] = useState("1");
  const menuSelecionado = (itemSelecionado: any) => {
    setChave(itemSelecionado.key);
  };

  const breadcrumb = {
    "1": <span>Bem Vindo</span>,
    "2": <span>.</span>,
  };

  return (
    <Suspense fallback={"Carregando..."}>
      <Framework
        nomeSis={"SAAP"}
        descricaoSis={"Sistema de Apoio à Administração Policial"}
        menus={menuAppBase}
        breadcrumb={breadcrumb}
        onChangeMenu={menuSelecionado}
      >
        <AuthProvider>
          <>
            {
              {
                "1": <BoasVindas />,
                "2": <Departamentos />,
              }[chave]
            }
          </>
        </AuthProvider>
      </Framework>
    </Suspense>
  );
};

export default Appbase;

import React, { useEffect, useState } from "react";
import { Col, Row, Spin } from "antd";
import "dayjs/locale/pt-br";
import { Loading3QuartersOutlined } from "@ant-design/icons";

type Props = {
  nomeSis: string | null | undefined;
  descricaoSis: string | null | undefined;
  menus: Menu[] | undefined;
  breadcrumb: any | undefined;
  children: JSX.Element | null | undefined;
  onChangeMenu: (itemMenuSelecionado: any | null | undefined) => void;
};

type Menu = {
  label: string;
  key: string;
  icon: JSX.Element;
  link: string;
  perfis: [];
  children: [];
};

export const ComponenteOfLine = ({
  nomeSis,
  descricaoSis,
  menus,
  breadcrumb,
  children,
  onChangeMenu,
}: Props) => {
  const estiloPagina: React.CSSProperties = {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    color: "#000",
    backgroundColor: "#fff",
  };

  useEffect(() => {
    const nome = nomeSis;
    const descricao = descricaoSis;
    const menu = menus;
    const breadcrumbLocal: any = breadcrumb;
    const childrenLocal: any = children;
  }, []);

  return (
    <>
      {/*<Spin
      tip='Sistema temporariamente indisponível!'
      size='large'
      style={{ width: "100vw", height: "100vh" }}
      indicator={<Loading3QuartersOutlined style={{ fontSize: 24 }} spin />}
    >*/}
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "10px",
          marginTop: "5%",
        }}
      >
        <Col>
          <Row
            style={{
              justifyContent: "center",
              alignContent: "center",
              paddingBottom: 20,
            }}
          >
            <div className='logo_sim_grande' />
          </Row>
          <Row style={{ justifyContent: "center", alignContent: "center" }}>
            <Row
              style={{
                backgroundColor: "#181818",
                borderRadius: 8,
                width: "400px",
                padding: 15,
                border: "1px dashed",
                boxShadow: "5px 2px 2px gray",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Row>
                <h2>{nomeSis}</h2>
              </Row>
              <Row>
                <h3>
                  Estamos tendo problemas para executar este serviço solicitado.
                </h3>
              </Row>
              <Row>
                <p>
                  Por algum motivo não coseguimos conectar ao serviço
                  solicitado.
                </p>
              </Row>
              <Row>
                <p>Sotilicitamos que tente mais tarde acessar esse serviço.</p>
              </Row>
              <Row>
                <p>
                  Se o problema persistir entre em contato com o suporte já foi
                  avisado desse problema.
                </p>
              </Row>
            </Row>
          </Row>
        </Col>
      </div>
      {/*</Spin>*/}
    </>
  );
};

export default ComponenteOfLine;

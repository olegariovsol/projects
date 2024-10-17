// CardComponent.jsx
import React, { useState } from "react";
import { Card, Badge, Avatar, ProgressProps, Progress } from "antd";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { ClockCircleOutlined, InfoCircleOutlined } from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import { Tooltip } from "antd/lib";

interface DataTypeProcessoItensPendentes {
  processos_ids: string;
  seis: string;
  processos_itens_ids: string;
  departamentos: string;
  item_id: string;
  item: string;
  data_ref: string;
  qtd_sol: number;
  qtd_ok: number;
  qtd_pendente: number;
  img: string;
  processos_desc: string;
  sigla_grupo_departamento: string;
}

declare const require: any;

declare const process: {
  env: {
    PUBLIC_URL: string;
    // Adicione outras variáveis de ambiente que você possa usar aqui
  };
};

interface Props {
  DadosCard?: DataTypeProcessoItensPendentes;
  imagem_item?: string;
}

const CardComponentSolicitacoesProcessos: React.FC<Props> = ({
  DadosCard,
  imagem_item,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const auth = useAuth();

  /*
  let etiqueta = '';
  if (DadosCard?.nome && DadosCard.nome.match(/DRP/)) {
    etiqueta = DadosCard?.cidade;
  }*/

  const conicColors: ProgressProps["strokeColor"] = {
    "0%": "#ff9e94",
    "50%": "#ffe58f",
    "100%": "#87d068",
  };

  return (
    <Badge.Ribbon
      text={DadosCard?.item}
      color="black"
      style={{ fontWeight: "bold" }}
    >
      <Card
        /*onClick={() => handleBadgeClick(DadosCard)}*/
        style={{
          width: 300,
          boxShadow: isHovered ? "0 4px 8px rgba(0, 0, 0, 0.8)" : "none",
          cursor: "pointer",
        }}
        cover={
          <div
            style={{
              backgroundColor: "white",
              display: "flex", // Flexbox para centralização
              justifyContent: "center", // Centraliza horizontalmente
              alignItems: "center", // Opcional: centraliza verticalmente, se necessário
              height: 150, // Define uma altura para o contêiner, se necessário
            }}
          >
            <img
              alt="example"
              src={`${imagem_item}${localStorage.getItem("token_sso")}`}
              style={{
                maxHeight: 100,
              }}
            />
            {/*src={imagem_item ? require(`${imagem_item}`).default : undefined}
            src={`${
                urlsServices.PORTAARQUIVO
              }loadArquivo?id=${DadosCard?.ultima_imagem}&token=${localStorage.getItem(
                "token_sso"
              )}`}
            */}
          </div>
        }
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        actions={[
          <div>
            {/* <Badge count={DadosCard?.qtd_pendente} overflowCount={999}>*/}
            <Tooltip title={`SEIs: ${DadosCard?.seis}`} placement="top">
              <ClockCircleOutlined
                style={{
                  fontSize: "36px",
                  marginLeft: 0,
                  marginTop: 0,
                  color: "black",
                }}
              />
            </Tooltip>
            {/*</Badge>*/}
            <br />
            <span style={{ fontSize: 11 }}>{"Desde: "}</span>
            <select
              style={{ width: 80 }}
              /*onChange={(e) => handleBadgeClick(e.target.value)}*/
            >
              {DadosCard?.processos_desc.split(", ").map((processo, index) => {
                const [dataSei, dataDateRef, dataOrigem] = processo.split("!");
                return (
                  <option key={index} value={dataSei} title={dataSei}>
                    {dataDateRef + " - " + dataOrigem}
                  </option>
                );
              })}
            </select>
          </div>,
          <div>
            <Tooltip
              title={`${DadosCard?.qtd_pendente} Itens pendentes`}
              placement="top"
            >
              <Progress
                type="dashboard"
                percent={
                  DadosCard?.qtd_sol
                    ? Math.round((DadosCard.qtd_ok / DadosCard.qtd_sol) * 100)
                    : 0
                }
                strokeColor={conicColors}
                size={[70, 20]}
                strokeWidth={12}
              />
            </Tooltip>
          </div>,
        ]}
      >
        <Meta
          title={
            <div>
              <span
                style={{ fontWeight: "bold", fontSize: 16, color: "darkred" }}
              >
                {DadosCard?.qtd_pendente} a Entregar
              </span>
              <span
                style={{
                  color: "brown",
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                <InfoCircleOutlined
                  title={`${DadosCard?.qtd_sol} Solicitado(s)`}
                  style={{ marginLeft: 10, color: "darkblue" }}
                />
              </span>
              {(DadosCard?.qtd_ok ?? 0) > 0 ? (
                <span
                  style={{
                    fontSize: "14px",
                    color: "darkgreen",
                    marginLeft: 10,
                  }}
                >
                  {DadosCard?.qtd_ok} Entregue(s)
                </span>
              ) : (
                <span
                  style={{ fontSize: "12px", color: "brown", marginLeft: 10 }}
                >
                  Nenhuma Entrega
                </span>
              )}
            </div>
          }
        />
      </Card>
    </Badge.Ribbon>
  );
};

export default CardComponentSolicitacoesProcessos;

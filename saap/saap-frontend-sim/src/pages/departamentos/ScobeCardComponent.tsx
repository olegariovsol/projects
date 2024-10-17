// ScobeCardComponent.jsx
import React, { useState } from "react";
import { Card, Badge, ProgressProps, Progress, Carousel, Image } from "antd";
import { urlsServices } from "../../configs/urlsConfig";
import { useAuth } from "../../contexts/auth/AuthProvider";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import { Tooltip } from "antd/lib";

declare const require: any;

declare const process: {
  env: {
    PUBLIC_URL: string;
    // Adicione outras variáveis de ambiente que você possa usar aqui
  };
};

interface DataTypeObras {
  key: React.Key;
  obra_id: string;
  valor_obra: number;
  departamento_id: string;
  dep_nome: string;
  dep_telefone: string;
  dep_municipio: string;
  solicitante: string;
  tipo: string;
  tipo_desc: string;
  sei: string;
  dta_previ_br: string;
  dta_prevf_br: string;
  dtai_br: string;
  dtaf_br: string;
  regularizacao: string;
  regularizacao_desc: string;
  status: string;
  status_desc: string;
  obs: string;
  obs_desc: string;
  total_obra: string;
  qtd_etapas: string;
  qtd_etapas_pendentes: number;
  qtd_etapas_finalizadas: string;
  etapas_pendentes: string;
  dtai_etapas_pendentes: string;
  etapas: string;
  etapas_total: string;
  ultima_imagem: string;
  imagens: string;
  departamento_telefone: string;
  conclusao: number;
  titular_id: string;
  titular: string;
  titular_celular: string;
  titular_telefone: string;
  titular_email: string;
  dep_municipioid: string;
  dep_telefone2: string;
  dep_telefone3: string;
  dep_escala: string;
  departamento_grupo_id: string;
  departamento_grupo: string;
  dep_sigla: string;
}

interface Props {
  DadosCard?: DataTypeObras;
}

const ScobeCardComponent: React.FC<Props> = ({ DadosCard }) => {
  const [isHovered, setIsHovered] = useState(false);

  const auth = useAuth();

  const whatsappMessage = encodeURIComponent(
    `${DadosCard?.titular}, tudo bem com você? Aqui quem fala é ${auth?.user?.nome} da ${auth?.user?.unidade?.sigla}`
  );
  const whatsappLink = `https://web.whatsapp.com/send?phone=+55${DadosCard?.titular_celular}&text=${whatsappMessage}`;
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

  const imagens = DadosCard?.imagens ? DadosCard?.imagens.split("|X|") : [];

  return (
    <Badge.Ribbon
      text={DadosCard?.dep_sigla + " - " + DadosCard?.dep_municipio}
      color="black"
      style={{
        fontWeight: "bold",
        whiteSpace: "nowrap", // Impede a quebra de linha
        overflow: "hidden", // Oculta o texto que ultrapassa o limite
        textOverflow: "ellipsis", // Adiciona "..." ao final do texto que não cabe
        width: "100%", // Garante que o Badge ocupe a largura total do Card
      }}
    >
      <Card
        style={{
          width: 240,
          boxShadow: isHovered ? "0 4px 8px rgba(0, 0, 0, 0.8)" : "none",
        }}
        cover={
          <div
            style={{
              backgroundColor: imagens.length > 1 ? "darkgray" : "white",
            }}
            title={DadosCard?.dep_nome}
          >
            {imagens.length == 0 ? (
              <CameraOutlined
                style={{
                  fontSize: "155px",
                  marginLeft: 60,
                  marginTop: 0,
                  color: "darkgray",
                }}
                title="Nenhuma foto incluída"
              />
            ) : (
              <>
                <Carousel autoplay>
                  {imagens.map((imagemNome, index) => (
                    <div key={`imagem-${index}`}>
                      <h3>
                        <Image
                          src={`${
                            urlsServices.PORTAARQUIVO
                          }/loadArquivo?id=${imagemNome}&token=${localStorage.getItem(
                            "token_sso"
                          )}`}
                          style={{
                            maxWidth: "180px",
                            maxHeight: 150,
                          }}
                        />
                      </h3>
                    </div>
                  ))}
                </Carousel>
              </>
            )}
          </div>
        }
        /*onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        actions={[
          <div>
            <span
              style={{
                fontWeight: "bold",
                color: "darkred",
              }}
            >
              <img
                alt={`Logo TESTE`}
                src={require(`./logos_img/DAE.png`).default}
                style={{ maxWidth: "180px", maxHeight: "150px" }}
              />
            </span>
          </div>,
        ]}*/
      >
        <Meta
          title={
            <span style={{ fontSize: "14px" }}>
              {DadosCard?.tipo_desc +
                (DadosCard?.status === "9INA" || DadosCard?.status === "9AIN"
                  ? " Fim: " + DadosCard?.dtaf_br
                  : " Início: " + DadosCard?.dtai_br)}
            </span>
          }
          description={
            <div>
              <span style={{ display: "flex", alignItems: "center" }}>
                {(DadosCard?.status == "9DEF" ||
                  DadosCard?.status == "9AND" ||
                  DadosCard?.status == "9EXE") && (
                  <>
                    {DadosCard?.qtd_etapas_pendentes > 0 ? (
                      <>
                        <Badge
                          count={DadosCard?.qtd_etapas_pendentes}
                          overflowCount={999}
                        >
                          <Tooltip
                            title={`Etapas Pendentes: ${DadosCard?.etapas_pendentes}`}
                            placement="top"
                          >
                            <ClockCircleOutlined
                              style={{
                                fontSize: "36px",
                                marginLeft: 0,
                                marginTop: 0,
                                color: "black",
                              }}
                            />
                          </Tooltip>
                        </Badge>
                        <br />
                        <p style={{ fontSize: 11 }}>
                          {"Desde: " + DadosCard?.dtai_etapas_pendentes}
                        </p>
                      </>
                    ) : (
                      <>
                        <Tooltip
                          title={`Execução/andamento não informado`}
                          placement="top"
                        >
                          <ExclamationCircleOutlined
                            style={{
                              fontSize: "48px",
                              marginLeft: 0,
                              marginTop: 0,
                              color: "orange",
                            }}
                          />
                        </Tooltip>
                      </>
                    )}
                  </>
                )}
                {(DadosCard?.status == "9INA" ||
                  DadosCard?.status == "9AIN") && (
                  <>
                    <Tooltip title={`Obra Concluída`} placement="top">
                      <CheckCircleOutlined
                        style={{
                          fontSize: "36px",
                          marginLeft: 0,
                          marginTop: 0,
                          color: "green",
                        }}
                      />
                    </Tooltip>
                  </>
                )}
                {DadosCard?.status == "9INA" || DadosCard?.status == "9AIN" ? (
                  <Tooltip title={`Progresso da Obra`} placement="top">
                    <Progress
                      type="dashboard"
                      percent={100}
                      strokeColor={conicColors}
                      size={[70, 20]}
                      strokeWidth={12}
                    />
                  </Tooltip>
                ) : (
                  <Tooltip title={`Progresso da Obra`} placement="top">
                    <Progress
                      type="dashboard"
                      percent={DadosCard?.conclusao}
                      strokeColor={conicColors}
                      size={[70, 20]}
                      strokeWidth={12}
                    />
                  </Tooltip>
                )}
              </span>
            </div>
          }
        />
      </Card>
    </Badge.Ribbon>
  );
};

export default ScobeCardComponent;

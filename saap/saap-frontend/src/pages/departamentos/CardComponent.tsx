// CardComponent.jsx
import React, { useState } from 'react';
import { Card, Badge, Avatar } from 'antd';
import { urlsServices } from '../../configs/urlsConfig';
import { useAuth } from '../../contexts/auth/AuthProvider';
import {
  UsergroupAddOutlined,
  CarOutlined,
  AimOutlined,
  BankOutlined,
  EnvironmentOutlined,
  WhatsAppOutlined,
  ShoppingOutlined,
  TableOutlined,
  AlertOutlined,
  MedicineBoxOutlined,
  ImportOutlined,
  SelectOutlined,
  WomanOutlined,
  ManOutlined,
  FrownOutlined,
  ClockCircleOutlined,
  PushpinOutlined,
  SecurityScanOutlined,
  QuestionOutlined,
} from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import { Tooltip } from 'antd/lib';

interface DataTypeGrupo {
  key: React.Key;
  grupo_id: string;
  nome: string;
  descricao: string;
  cidade_id: string;
  cidade: string;
  imagem_grupo: string;
  titular: string;
  titular_contato: string;
  telefone: string;
  telefone2: string;
  telefone3: string;
  fun_cad_id: string;
  fun_cad: string;
  fun_up_id: string;
  fun_up: string;
  dta_registro_br: string;
  dta_alteracao_br: string;
  dep_qtd: number;
  dep_plantao_qtd: number;
  dep_imovel_proprio_qtd: number;
  dep_imovel_alugado_qtd: number;
  dep_imovel_cedido_qtd: number;
  dep_interino_qtd: number;
  servidores_qtd: number;
  servidores_agentes: number;
  servidores_delegados: number;
  servidores_escrivaes: number;
  vtrsQtd?: number;
  obrasQtd?: number;
  qtd_municipios: number;
  municipios: string;
}

interface Props {
  DadosGrupo?: DataTypeGrupo;
  handleBadgeClick: (DadosGrupo?: DataTypeGrupo) => void;
}

const CardComponent: React.FC<Props> = ({ DadosGrupo, handleBadgeClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const auth = useAuth();

  const whatsappMessage = encodeURIComponent(
    `${DadosGrupo?.titular}, tudo bem com você? Aqui quem fala é ${auth?.user?.nome} da ${auth?.user?.unidade?.sigla}`,
  );
  const whatsappLink = `https://web.whatsapp.com/send?phone=+55${DadosGrupo?.titular_contato}&text=${whatsappMessage}`;

  let etiqueta = '';
  if (DadosGrupo?.nome && DadosGrupo.nome.match(/DRP/)) {
    etiqueta = DadosGrupo?.cidade;
  }

  return (
    <Badge.Ribbon text={etiqueta} color="black" style={{ fontWeight: 'bold' }}>
      <Card
        onClick={() => handleBadgeClick(DadosGrupo)}
        style={{
          width: 300,
          boxShadow: isHovered ? '0 4px 8px rgba(0, 0, 0, 0.8)' : 'none',
          cursor: 'pointer',
        }}
        cover={
          <img
            alt="example"
            src={`${process.env.PUBLIC_URL}/${DadosGrupo?.imagem_grupo}`}
          />
        }
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        actions={[
          <Badge count={DadosGrupo?.servidores_qtd} overflowCount={999}>
            <Tooltip
              title={`${
                DadosGrupo?.servidores_delegados +
                ' Delegados - ' +
                DadosGrupo?.servidores_escrivaes +
                ' Escrivães - ' +
                DadosGrupo?.servidores_agentes +
                ' Agentes'
              }`}
              placement="top"
            >
              <div>
                <UsergroupAddOutlined
                  style={{ fontSize: '24px', marginLeft: -20, marginTop: 10 }}
                  title="Servidores"
                />
              </div>
            </Tooltip>
          </Badge>,
          <Badge count={DadosGrupo?.dep_qtd} overflowCount={999}>
            <div title="Delegacias/Departamentos">
              <EnvironmentOutlined
                style={{ fontSize: '24px', marginLeft: -20, marginTop: 10 }}
              />
            </div>
          </Badge>,

          /* <Badge count={DadosGrupo?.vtrsQtd} overflowCount={999}>
            <div title="Viaturas">
              <CarOutlined
                style={{ fontSize: '24px', marginLeft: -20, marginTop: 10 }}
              />
            </div>
          </Badge>,
          <Badge count={DadosGrupo?.obrasQtd} overflowCount={999}>
            <div title="Obras">
              <BankOutlined
                style={{ fontSize: '24px', marginLeft: -20, marginTop: 10 }}
              />
            </div>
            </Badge>,*/
        ]}
      >
        <Meta
          title={DadosGrupo?.nome}
          description={
            <div>
              <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
                {DadosGrupo?.titular_contato &&
                DadosGrupo.titular_contato.length > 7 ? (
                  <Tooltip
                    title={`Clique para falar via WhatsappWeb com ${DadosGrupo?.titular}.`}
                    placement="top"
                  >
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'darkgreen' }}
                    >
                      <WhatsAppOutlined style={{ color: 'green' }} />
                      {DadosGrupo?.titular}
                    </a>
                  </Tooltip>
                ) : (
                  DadosGrupo?.titular
                )}
              </span>
              <br></br>
              <span>
                {DadosGrupo?.nome.includes('DRP') ? (
                  <Tooltip title={`${DadosGrupo?.municipios}.`} placement="top">
                    <span style={{ color: 'darkgray' }}>
                      {DadosGrupo?.qtd_municipios + ' Municípios'}
                    </span>
                  </Tooltip>
                ) : (
                  <span></span>
                )}
              </span>
            </div>
          }
        />
      </Card>
    </Badge.Ribbon>
  );
};

export default CardComponent;

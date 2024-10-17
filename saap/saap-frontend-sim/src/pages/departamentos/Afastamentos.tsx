import React, { useEffect } from "react";
import { useState } from "react";
import { notification, Row, Spin } from "antd";
import { Table } from "antd/lib";
import { ColumnsType } from "antd/es/table";
import {
  HourglassOutlined,
  LogoutOutlined,
  SunOutlined,
} from "@ant-design/icons";

interface DataTypeAfastamentos {
  servidor_afastamento_id: string;
  afastamento_id: string;
  afastamento_desc: string;
  afastamento_status: string;
  servidor_id: string;
  servidor: string;
  dta_inicio_br: string;
  dta_fim_br: string;
}

interface Props {
  AfastamentosDados: DataTypeAfastamentos[]; // Modifiquei o nome da prop para "form" para ser compatível com o restante do código
  Modo: string;
}

const AfastamentosComponent: React.FC<Props> = ({
  AfastamentosDados,
  Modo,
}) => {
  /**************************************************************************
   * **********************************LOAD****************************
   * ************************************************************************/

  const columnsAfastamentos: ColumnsType<DataTypeAfastamentos> = [
    {
      title: "PERÍODO",
      width: 50,
      dataIndex: "dta_inicio_br",
      key: "dta_inicio_br",
      fixed: "left",
      sorter: true,
      render: (text, record) => (
        <div>
          <div>
            <span style={{ fontWeight: "bold", color: "black" }}>
              {"Início: " + record.dta_inicio_br}
            </span>
          </div>
          <div>
            <span style={{ fontWeight: "bold", color: "black" }}>
              {"Fim: " + record.dta_fim_br}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "AFASTAMENTO",
      width: 300,
      dataIndex: "afastamento_desc",
      key: "afastamento_desc",
      fixed: "left",
      sorter: true,
      render: (text, record) => {
        return (
          <div>
            <div>
              {record.afastamento_status === "FÉRIAS" ? (
                <SunOutlined style={{ color: "orange" }} />
              ) : record.afastamento_status === "AFASTAMENTO" ? (
                <LogoutOutlined style={{ color: "red" }} />
              ) : record.afastamento_status === "LICENÇA" ? (
                <HourglassOutlined style={{ color: "red" }} />
              ) : null}
            </div>

            <div>
              <span
                style={{ fontWeight: "bold", color: "black", fontSize: 11 }}
              >
                {record.afastamento_desc}
              </span>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <Row
      style={{
        overflowY: "auto",
        maxHeight: "calc(100vh - 310px)",
        width: "100%",
      }}
    >
      <Table
        columns={columnsAfastamentos}
        dataSource={AfastamentosDados}
        scroll={{ x: "90%" }}
        //onChange={onChangeDepartamentos}
        pagination={{ pageSize: 50 }}
        footer={() => (
          <div style={{ color: "green", fontWeight: "bold" }}>
            Total de Afastamentos: {AfastamentosDados.length}
          </div>
        )}
      />
    </Row>
  );
};

export default AfastamentosComponent;

import React from "react";
import { useRef, useState } from "react";
import { useAxiosSICAD } from "../../hooks/useAxiosSICAD";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Space,
  notification,
  Spin,
  Tooltip,
} from "antd";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { AutoComplete } from "antd/lib";
import dayjs from "dayjs";

interface Props {
  form: any; // Modifiquei o nome da prop para "form" para ser compatível com o restante do código
  index: string;
  xlabel: string;
  xobrigatorio: boolean;
  xplacaPesquisa: boolean;
  xunidade_id: any;
  xtooltip: string;
}

const SeletorVtrSisvtrComponent: React.FC<Props> = ({
  form,
  index,
  xlabel,
  xobrigatorio,
  xplacaPesquisa,
  xunidade_id,
  xtooltip,
}) => {
  const apiSICAD = useAxiosSICAD();

  const [VTRs, setVTRs] = useState<{ id: number; key: number; nome: string }[]>(
    []
  );

  const [showOptionsVTRs, setShowOptionsVTRs] = useState(false);
  const autoCompleteVTR = useRef(null);

  /**************************************************************************
   * **********************************LOAD****************************
   * ************************************************************************/
  const [openLoadSeletor, setOpenLoadSeletor] = useState(false);
  const [messageLoadSeletor, setMessageLoadSeletor] = useState("");

  const onLoadSeletor = (message: string) => {
    setMessageLoadSeletor(message);
    setOpenLoadSeletor(true);
  };

  const exitLoadSeletor = () => {
    setOpenLoadSeletor(false);
    setMessageLoadSeletor("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isLetterOrNumber = /^[A-Za-z0-9]$/.test(e.key);
    const isBackspace = e.key === "Backspace";
    const isDelete = e.key === "Delete";
    const isTab = e.key === "Tab";
    const isArrowKey =
      e.key.startsWith("Arrow") || e.key === "Home" || e.key === "End";

    const inputValue = (e.target as HTMLInputElement).value;
    if (
      inputValue.length >= 10 ||
      (!isLetterOrNumber && !isBackspace && !isDelete && !isTab && !isArrowKey)
    ) {
      e.preventDefault();
    }
  };

  const listVtrsClick = async () => {
    onLoadSeletor(
      "Já vou apresentar As vtrs disponíveis para você escolher. Espere um pouquinho..."
    );

    const responseVtr = await apiSICAD.viaturasAtivasPC();
    const VtrsDados = responseVtr.data;

    const DataMap: Record<string, any> = {};
    const xcategoria = "Viaturas Disponíveis";
    DataMap[xcategoria] = {
      label: xcategoria,
      value: xcategoria,
      id: xcategoria,
      key: xcategoria,
      options: [],
    };

    VtrsDados.forEach(
      (vtrsArray: {
        id: string;
        anoFabricacao: string;
        anoModelo: string;
        marca: string;
        modelo: string;
        cor: string;
        combustivel: string;
        categoria: string;
        identificacao: string;
        numeroSei: string;
        numeroChassi: string;
        condicaoBem: string;
        status: string;
        unidadeId: string;
        unidadeNome: string;
        unidadeSigla: string;
        unidadeIdPai: string;
        unidadeSiglaPai: string;
        unidadeNomePai: string;
        placa: string;
        placaVinculada: string;
        responsavel: string;
        responsavelCpf: string;
        estadoConservacao: string;
        dataAquisicao: string;
        onus: string;
        aplicacao: string;
        potencia: string;
        numeroPatrimonio: string;
        tipoUnidade: string;
      }) => {
        let xretornar = false;
        if (xplacaPesquisa == true) {
          console.log(
            form.getFieldValue("viatura_" + index, "") +
              " == " +
              vtrsArray.placa,
            +" || " + vtrsArray.placaVinculada
          );
          if (
            form.getFieldValue("viatura_" + index, "") === vtrsArray.placa ||
            form.getFieldValue("viatura_" + index, "") ===
              vtrsArray.placaVinculada
          ) {
            xretornar = true;
          }
        }

        if (xretornar == true) {
          if (xunidade_id == -1) {
            DataMap[xcategoria].options.push({
              label: `${vtrsArray.marca} ${vtrsArray.modelo}, ${vtrsArray.placa}, ${vtrsArray.identificacao}`,
              value: `${vtrsArray.marca} ${vtrsArray.modelo}, ${vtrsArray.placa}, ${vtrsArray.identificacao}`,
              id: vtrsArray.id,
              key: vtrsArray.id,
              unidadeId: vtrsArray.unidadeId,
              unidadeNome: vtrsArray.unidadeNome,
              title: `${vtrsArray.marca} ${vtrsArray.modelo}, ${vtrsArray.placa}, ${vtrsArray.identificacao}, ${vtrsArray.unidadeNome}, ${vtrsArray.unidadeNomePai}`,
            });
          } else {
            if (xunidade_id === parseInt(vtrsArray.unidadeId, 10)) {
              // Certifique-se de passar a base (10) para parseInt
              DataMap[xcategoria].options.push({
                label: `${vtrsArray.marca} ${vtrsArray.modelo}, ${vtrsArray.placa}, ${vtrsArray.identificacao}`,
                value: `${vtrsArray.marca} ${vtrsArray.modelo}, ${vtrsArray.placa}, ${vtrsArray.identificacao}`,
                id: vtrsArray.id,
                key: vtrsArray.id,
                unidadeId: vtrsArray.unidadeId,
                unidadeNome: vtrsArray.unidadeNome,
                title: `${vtrsArray.marca} ${vtrsArray.modelo}, ${vtrsArray.placa}, ${vtrsArray.identificacao}, ${vtrsArray.unidadeNome}, ${vtrsArray.unidadeNomePai}`,
              });
            }
          }
        } //retornar no filtro
      }
    );

    // console.log(DataMap);

    const newDados = Object.values(DataMap);
    setVTRs(newDados);

    setShowOptionsVTRs(true);

    if (autoCompleteVTR.current) {
      (autoCompleteVTR.current as HTMLInputElement).focus();
    }

    exitLoadSeletor();
  };

  const onSelectVTR = (data: any) => {
    form.setFieldValue("viatura_id_" + index, data.id);
    form.setFieldValue("viatura_departamento_id_" + index, data.unidadeId);
    form.setFieldValue("viatura_departamento_" + index, data.unidadeNome);
  };

  const handleEnterPressVTR = (e: any) => {
    if (e.key === "Enter") {
      listVtrsClick();
    }
  };

  const ClearVtr = (data: any) => {
    form.setFieldValue("viatura_id_" + index, "");
    form.setFieldValue("viatura_" + index, "");
    form.setFieldValue("viatura_departamento_id_" + index, "");
    form.setFieldValue("viatura_departamento_" + index, "");
  };

  return (
    <Spin spinning={openLoadSeletor} tip={messageLoadSeletor}>
      {/*campos retornados do sicad*/}
      <Form.Item hidden name={`viatura_id_${index}`}>
        <Input />
      </Form.Item>

      <Form.Item hidden name={`viatura_departamento_id_${index}`}>
        <Input />
      </Form.Item>

      <Form.Item hidden name={`viatura_departamento_${index}`}>
        <Input />
      </Form.Item>

      {/*campos retornados do sicad*/}

      <Col span={5} style={{ paddingRight: 5 }}>
        <Tooltip trigger={["hover"]} title={xtooltip} placement='top'>
          <Space.Compact>
            <Form.Item
              name={`viatura_${index}`}
              label={`${xlabel}:`}
              rules={[
                {
                  required: xobrigatorio,
                  message: "Informe a Viatura!",
                },
              ]}
            >
              <AutoComplete
                ref={autoCompleteVTR}
                key={VTRs.length} // Chave única com base no tamanho do array
                options={VTRs}
                style={{ width: 260 }}
                dropdownMatchSelectWidth={false} // Desative o ajuste automático
                dropdownStyle={{ width: 800 }}
                onSelect={(value, option) => {
                  onSelectVTR(option);
                  setShowOptionsVTRs(false); // Fecha a lista após a seleção
                }}
                onKeyDown={handleEnterPressVTR} // Adicione este evento para verificar a tecla Enter
                onDropdownVisibleChange={(visible) =>
                  setShowOptionsVTRs(visible)
                } // Controla a visibilidade da lista
                open={showOptionsVTRs} // Controla a visibilidade da lista
                placeholder='Escolha VTR'
              >
                <Input
                  style={{ fontSize: 11, height: 32 }}
                  maxLength={10}
                  onInput={(e) =>
                    ((e.target as HTMLInputElement).value = (
                      e.target as HTMLInputElement
                    ).value.toUpperCase())
                  }
                  onKeyPress={handleKeyPress}
                  className='bold-text-input'
                />
              </AutoComplete>
            </Form.Item>
            <Button
              type='primary'
              onClick={listVtrsClick}
              style={{ marginTop: 30 }}
              icon={<SearchOutlined />}
            ></Button>
            <Button
              title='Limpar Campo'
              onClick={ClearVtr}
              style={{ marginTop: 30 }}
              icon={<ClearOutlined />}
            ></Button>
          </Space.Compact>
        </Tooltip>
      </Col>
    </Spin>
  );
};

export default SeletorVtrSisvtrComponent;

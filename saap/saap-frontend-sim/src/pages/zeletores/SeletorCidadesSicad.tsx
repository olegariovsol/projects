import React from "react";
import { useRef, useState } from "react";
import { useAxiosSICAD } from "../../hooks/useAxiosSICAD";
import { Form, Input, Button, Row, Col, Space, notification, Spin } from "antd";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Tooltip } from "antd/lib";
import dayjs from "dayjs";

function removerAcentos(texto: string) {
  const mapaAcentos: Record<string, string> = {
    á: "a",
    à: "a",
    â: "a",
    ã: "a",
    ä: "a",
    é: "e",
    è: "e",
    ê: "e",
    ë: "e",
    í: "i",
    ì: "i",
    î: "i",
    ï: "i",
    ó: "o",
    ò: "o",
    ô: "o",
    õ: "o",
    ö: "o",
    ú: "u",
    ù: "u",
    û: "u",
    ü: "u",
    ç: "c",
  };

  return texto.replace(/[áàâãäéèêëíìîïóòôõöúùûüç]/g, function (matched) {
    return mapaAcentos[matched] || matched;
  });
}

interface Props {
  form: any; // Modifiquei o nome da prop para "form" para ser compatível com o restante do código
  index: string;
  xlabel: string;
  xobrigatorio: boolean;
  xtooltip: string;
}

const SeletorCidadeSicadComponent: React.FC<Props> = ({
  form,
  index,
  xlabel,
  xobrigatorio,
  xtooltip,
}) => {
  const apiSICAD = useAxiosSICAD();
  const autoCompleteCidade = useRef(null);
  const [showOptionsCidade, setShowOptionsCidade] = useState(false);
  const [listaCidade, setListaCidade] = useState<
    { id: number; key: number; nome: string }[]
  >([]);

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

  const ListCidades = async (value: string) => {
    onLoadSeletor("Minutinho só por favor...");

    let xsearch = form.getFieldValue("cidade_" + index);

    if (xsearch !== undefined) {
      xsearch = removerAcentos(xsearch.toLowerCase());
    } else {
      // Defina um valor padrão, como uma string vazia, se xsearch for undefined
      xsearch = "";
    }

    await apiSICAD.cidadesPorEstado("GO").then((response: any) => {
      const sortedData = response.data;

      const cidadeMap: Record<string, any> = {};

      sortedData.forEach((item: any) => {
        var xcidade = removerAcentos(item.nome.toLowerCase());
        xsearch = removerAcentos(xsearch.toLowerCase());
        if (xcidade.indexOf(xsearch) !== -1) {
          if (!cidadeMap[item.uf]) {
            cidadeMap[item.uf] = {
              label: item.uf,
              value: item.uf,
              id: item.uf,
              key: item.uf,
              options: [],
            };
            // console.log('Category: '+item.status);
          }

          cidadeMap[item.uf].options.push({
            label: item.nome,
            value: item.nome,
            id: item.id,
            key: item.id,
            uf: item.uf,
          });
        }
      });

      const newCidade = Object.values(cidadeMap);
      setListaCidade(newCidade);

      setShowOptionsCidade(true);

      return true;
    });

    exitLoadSeletor();
  };

  const onSelectCidades = (data: any) => {
    form.setFieldValue("cidade_id_" + index, data.id);
  };

  const handleEnterPressCidade = (e: any) => {
    if (e.key === "Enter") {
      ListCidades(form.getFieldValue("cidade_" + index));
    }
  };

  function listaCidadesClick() {
    ListCidades(form.getFieldValue("cidade_" + index));
  }

  function clearCidade() {
    form.setFieldsValue({
      [`cidade_id_${index}`]: "",
      [`cidade_${index}`]: "",
    });
  }

  return (
    <Spin spinning={openLoadSeletor} tip={messageLoadSeletor}>
      {/*campos retornados do sicad*/}
      <Form.Item hidden name={`cidade_id_${index}`}>
        <Input />
      </Form.Item>

      <Col span={5} style={{ paddingRight: 5 }}>
        <Space.Compact>
          <Form.Item
            name={`cidade_${index}`}
            label={`${xlabel}:`}
            rules={[
              {
                required: xobrigatorio,
                message: "Informe a Cidade!",
              },
            ]}
          >
            <AutoComplete
              ref={autoCompleteCidade}
              key={listaCidade.length} // Chave única com base no tamanho do array
              options={listaCidade}
              style={{ width: 260 }}
              dropdownMatchSelectWidth={false} // Desative o ajuste automático
              dropdownStyle={{ width: 800 }}
              onSelect={(value, option) => {
                onSelectCidades(option);
                setShowOptionsCidade(false); // Fecha a lista após a seleção
              }}
              onKeyDown={handleEnterPressCidade} // Adicione este evento para verificar a tecla Enter
              onDropdownVisibleChange={(visible) =>
                setShowOptionsCidade(visible)
              } // Controla a visibilidade da lista
              open={showOptionsCidade} // Controla a visibilidade da lista
              placeholder="Digite o nome de uma cidade"
            >
              <Input
                style={{ fontSize: 11, height: 32 }}
                onInput={(e) =>
                  ((e.target as HTMLInputElement).value = (
                    e.target as HTMLInputElement
                  ).value.toUpperCase())
                }
                className="bold-text-input"
              />
            </AutoComplete>
          </Form.Item>
          <Button
            type="primary"
            onClick={listaCidadesClick}
            style={{ marginTop: 30 }}
            icon={<SearchOutlined />}
          ></Button>
          <Button
            title="Limpar Campo"
            onClick={clearCidade}
            style={{ marginTop: 30 }}
            icon={<ClearOutlined />}
          ></Button>
        </Space.Compact>
      </Col>
    </Spin>
  );
};

export default SeletorCidadeSicadComponent;

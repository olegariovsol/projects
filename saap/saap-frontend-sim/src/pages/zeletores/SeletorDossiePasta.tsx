import React from "react";
import { useRef, useState } from "react";
import { useAxiosServidorPortaArquivos } from "../../hooks/useAxiosServidorPortaArquvios";
import { Form, Input, Button, Row, Col, Space, notification, Spin } from "antd";
import { ClearOutlined, SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Tooltip } from "antd/lib";
import dayjs from "dayjs";

interface Props {
  form: any; // Modifiquei o nome da prop para "form" para ser compatível com o restante do código
  index: string;
  xlabel: string;
  xobrigatorio: boolean;
  xtooltip: string;
  ClickSeletorDossiePasta: (PastaId?: string) => void;
}

const SeletorDossiePastaComponent: React.FC<Props> = ({
  form,
  index,
  xlabel,
  xobrigatorio,
  xtooltip,
  ClickSeletorDossiePasta,
}) => {
  const apiDados = useAxiosServidorPortaArquivos();
  const autoCompleteCidade = useRef(null);
  const [showOptionsCidade, setShowOptionsCidade] = useState(false);
  const [listacidade, setListaCidade] = useState<
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
    // onLoadSeletor('Minutinho só por favor...');

    await apiDados.listPortaArquivosPasta(value).then((res: any) => {
      const cidadeMap: Record<string, any> = {};

      console.log(res.data);

      cidadeMap[0] = {
        label: "Escolha",
        value: "Escolha",
        id: 0,
        key: 0,
        options: [],
      };

      res.data.forEach((item: any) => {
        cidadeMap[0].options.push({
          label: item.descricao,
          value: item.descricao,
          id: item.id,
          key: item.id,
        });
      });

      const newCidade = Object.values(cidadeMap);
      setListaCidade(newCidade);

      setShowOptionsCidade(true);

      return true;
    });

    exitLoadSeletor();
  };

  const onSelectCidades = (data: any) => {
    form.setFieldValue("servidor_porta_arquivo_pasta_id_" + index, data.id);
    ClickSeletorDossiePasta(data.id);
  };

  const handleEnterPressCidade = (e: any) => {
    if (e.key === "Enter") {
      ListCidades(form.getFieldValue("servidor_porta_arquivo_pasta_" + index));
    }
  };

  function listaCidadesClick() {
    ListCidades(form.getFieldValue("servidor_porta_arquivo_pasta_" + index));
  }

  function clearCidade() {
    form.setFieldsValue({
      [`servidor_porta_arquivo_pasta_id_${index}`]: "",
      [`servidor_porta_arquivo_pasta_${index}`]: "",
    });
    ClickSeletorDossiePasta("");
  }

  return (
    <Spin spinning={openLoadSeletor} tip={messageLoadSeletor}>
      {/*campos retornados do sicad*/}
      <Form.Item hidden name={`servidor_porta_arquivo_pasta_id_${index}`}>
        <Input />
      </Form.Item>

      {/*campos retornados do sicad*/}

      <Col span={5} style={{ paddingRight: 5 }}>
        <Space.Compact>
          <Tooltip trigger={["hover"]} title={xtooltip} placement='top'>
            <Form.Item
              name={`servidor_porta_arquivo_pasta_${index}`}
              label={`${xlabel}:`}
              rules={[
                {
                  required: xobrigatorio,
                  message: "Escolha uma opção!",
                },
              ]}
            >
              <AutoComplete
                ref={autoCompleteCidade}
                key={listacidade.length} // Chave única com base no tamanho do array
                options={listacidade}
                style={{ width: 190 }}
                dropdownMatchSelectWidth={false} // Desative o ajuste automático
                dropdownStyle={{ width: 300 }}
                onSelect={(value, option) => {
                  onSelectCidades(option);
                  setShowOptionsCidade(false); // Fecha a lista após a seleção
                }}
                onKeyDown={handleEnterPressCidade} // Adicione este evento para verificar a tecla Enter
                onDropdownVisibleChange={(visible) =>
                  setShowOptionsCidade(visible)
                } // Controla a visibilidade da lista
                open={showOptionsCidade} // Controla a visibilidade da lista
                placeholder='Nome da Pasta'
              >
                <Input
                  style={{ fontSize: 11, height: 32 }}
                  onInput={(e) =>
                    ((e.target as HTMLInputElement).value = (
                      e.target as HTMLInputElement
                    ).value.toUpperCase())
                  }
                  className='bold-text-input'
                />
              </AutoComplete>
            </Form.Item>
          </Tooltip>
          <Button
            type='primary'
            onClick={listaCidadesClick}
            style={{ marginTop: 30 }}
            icon={<SearchOutlined />}
          ></Button>
          <Button
            title='Limpar Campo'
            onClick={clearCidade}
            style={{ marginTop: 30 }}
            icon={<ClearOutlined />}
          ></Button>
        </Space.Compact>
      </Col>
    </Spin>
  );
};

export default SeletorDossiePastaComponent;
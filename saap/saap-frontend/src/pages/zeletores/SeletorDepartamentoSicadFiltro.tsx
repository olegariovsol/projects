import { useRef, useState } from 'react';
import { useAxiosSICAD } from '../../hooks/useAxiosSICAD';
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
} from 'antd';
import { ClearOutlined, SearchOutlined } from '@ant-design/icons';
import { AutoComplete } from 'antd/lib';
import dayjs from 'dayjs';

function removerAcentos(texto: string) {
  const mapaAcentos: Record<string, string> = {
    á: 'a',
    à: 'a',
    â: 'a',
    ã: 'a',
    ä: 'a',
    é: 'e',
    è: 'e',
    ê: 'e',
    ë: 'e',
    í: 'i',
    ì: 'i',
    î: 'i',
    ï: 'i',
    ó: 'o',
    ò: 'o',
    ô: 'o',
    õ: 'o',
    ö: 'o',
    ú: 'u',
    ù: 'u',
    û: 'u',
    ü: 'u',
    ç: 'c',
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
  xcampo_fone: string;
  xunidade_pai_filtro_id: any;
}

const SeletorDepartamentoSicadComponentFiltro: React.FC<Props> = ({
  form,
  index,
  xlabel,
  xobrigatorio,
  xtooltip,
  xcampo_fone,
  xunidade_pai_filtro_id,
}) => {
  const apiSICAD = useAxiosSICAD();

  const [departamentos, setDepartamentos] = useState<
    { id: number; key: number; nome: string }[]
  >([]);
  const [showOptionsDepartamentos, setShowOptionsDepartamentos] =
    useState(false);
  const autoCompleteDepartamento = useRef(null);

  /**************************************************************************
   * **********************************LOAD****************************
   * ************************************************************************/
  const [openLoadSeletor, setOpenLoadSeletor] = useState(false);
  const [messageLoadSeletor, setMessageLoadSeletor] = useState('');

  const onLoadSeletor = (message: string) => {
    setMessageLoadSeletor(message);
    setOpenLoadSeletor(true);
  };

  const exitLoadSeletor = () => {
    setOpenLoadSeletor(false);
    setMessageLoadSeletor('');
  };

  const ListSICADDepartamentos = async () => {
    onLoadSeletor('Minutinho só por favor...');

    let xsearch = form.getFieldValue('departamento_' + index);

    if (xsearch !== undefined) {
      xsearch = removerAcentos(xsearch.toLowerCase());
    } else {
      // Defina um valor padrão, como uma string vazia, se xsearch for undefined
      xsearch = '';
    }

    await apiSICAD.unidadesPC().then((res: any) => {
      if (res.status === 200) {
        // Ordenar o JSON pelo atributo "superior" e em seguida pelo atributo "nome"
        const sortedData = res.data.sort(
          (a: any, b: any) =>
            (a.superior || '').localeCompare(b.superior || '') ||
            (a.nome || '').localeCompare(b.nome || ''),
        );

        // Objeto para mapear os departamentos pelo valor "superior"
        const departmentMap: Record<string, any> = {}; // Substitua "any" pelo tipo correto se possível

        // Construir a estrutura desejada
        sortedData.forEach((item: any) => {
          // Substitua "any" pelo tipo correto se possível

          var xdepartamento = removerAcentos(item.nome.toLowerCase());
          xsearch = removerAcentos(xsearch.toLowerCase());
          if (xdepartamento.indexOf(xsearch) !== -1) {
            //console.log('Achou '+xsearch+' em: '+xdepartamento);
            if (
              item.idSuperior == xunidade_pai_filtro_id ||
              item.id == xunidade_pai_filtro_id
            ) {
              //Apenas sessões de identificação
              if (!departmentMap[item.idSuperior]) {
                departmentMap[item.idSuperior] = {
                  label: item.superior || '',
                  value: item.superior || '',
                  id: item.idSuperior,
                  key: item.idSuperior,
                  options: [],
                };
                /*console.log('Category: '+item.superior+' - '+item.idSuperior);*/
              }

              departmentMap[item.idSuperior].options.push({
                label: item.nome || '',
                value: item.nome || '',
                telefone: item.telefone,
                municipio: item.endereco ? item.endereco.municipio : '',
                municipio_id: item.endereco ? item.endereco.municipioId : '',
                id: item.id.toString(),
                key: item.id.toString(),
              });
            }
            /*console.log('Item: '+item.nome+' - '+item.id.toString());*/
          }
        });

        // Converter o objeto em um array
        const newDepartamento = Object.values(departmentMap);

        //console.log(newDepartamento);

        setDepartamentos(newDepartamento);

        //console.log('aqui');

        setShowOptionsDepartamentos(true);

        if (autoCompleteDepartamento.current) {
          (autoCompleteDepartamento.current as HTMLInputElement).focus();
        }
      } else {
        notification.error({
          message: 'Erro ao listar departamentos SICAD!',
          description: res.data.message,
        });
      }
    });

    exitLoadSeletor();
  };

  const onSelectDepartamentos = (data: any) => {
    form.setFieldValue('departamento_id_' + index, data.id);
    form.setFieldValue('departamento_cidade_id_' + index, data.municipio_id);
    form.setFieldValue('departamento_cidade_' + index, data.municipio);
    form.setFieldValue('departamento_telefone_' + index, data.telefone);
    if (xcampo_fone != '') {
      form.setFieldValue(xcampo_fone, data.telefone);
    }
  };

  const handleEnterPressDepartamento = (e: any) => {
    if (e.key === 'Enter') {
      ListSICADDepartamentos();
    }
  };

  function clearDepartamento() {
    form.setFieldsValue({
      [`departamento_id_${index}`]: '',
      [`departamento_${index}`]: '',
      [`departamento_cidade_id_${index}`]: '',
      [`departamento_cidade_${index}`]: '',
      [`departamento_telefone_${index}`]: '',
    });
    if (xcampo_fone != '') {
      form.setFieldValue(xcampo_fone, '');
    }
  }

  return (
    <Spin spinning={openLoadSeletor} tip={messageLoadSeletor}>
      {/*campos retornados do sicad*/}
      <Form.Item hidden name={`departamento_id_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`departamento_cidade_id_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`departamento_cidade_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`departamento_telefone_${index}`}>
        <Input />
      </Form.Item>

      {/*campos retornados do sicad*/}

      <Col span={5} style={{ paddingRight: 5 }}>
        <Space.Compact>
          <Tooltip trigger={['hover']} title={xtooltip} placement="top">
            <Form.Item
              name={`departamento_${index}`}
              label={`${xlabel}:`}
              rules={[
                {
                  required: xobrigatorio,
                  message: 'Informe o departamento!',
                },
              ]}
            >
              <AutoComplete
                ref={autoCompleteDepartamento}
                key={departamentos.length} // Chave única com base no tamanho do array
                options={departamentos}
                style={{ width: 260 }}
                dropdownMatchSelectWidth={false} // Desative o ajuste automático
                dropdownStyle={{ width: 800 }}
                onSelect={(value, option) => {
                  onSelectDepartamentos(option);
                  setShowOptionsDepartamentos(false); // Fecha a lista após a seleção
                }}
                onKeyDown={handleEnterPressDepartamento} // Adicione este evento para verificar a tecla Enter
                onDropdownVisibleChange={visible =>
                  setShowOptionsDepartamentos(visible)
                } // Controla a visibilidade da lista
                open={showOptionsDepartamentos} // Controla a visibilidade da lista
                placeholder="Digite um Departamento"
              >
                <Input
                  style={{ fontSize: 11, height: 32 }}
                  onInput={e =>
                    ((e.target as HTMLInputElement).value = (
                      e.target as HTMLInputElement
                    ).value.toUpperCase())
                  }
                />
              </AutoComplete>
            </Form.Item>
          </Tooltip>
          <Button
            type="primary"
            onClick={ListSICADDepartamentos}
            style={{ marginTop: 30 }}
            icon={<SearchOutlined />}
          ></Button>
          <Button
            title="Limpar Campo"
            onClick={clearDepartamento}
            style={{ marginTop: 30 }}
            icon={<ClearOutlined />}
          ></Button>
        </Space.Compact>
      </Col>
    </Spin>
  );
};

export default SeletorDepartamentoSicadComponentFiltro;

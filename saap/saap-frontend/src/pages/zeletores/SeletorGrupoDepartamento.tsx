import { CSSProperties, useRef, useState } from 'react';
import { useAxiosDepartamentos } from '../../hooks/useAxiosDepartamentos';
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
import {
  CalendarOutlined,
  ClearOutlined,
  ClockCircleOutlined,
  FallOutlined,
  LockOutlined,
  MedicineBoxOutlined,
  SearchOutlined,
  TableOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { AutoComplete, Avatar } from 'antd/lib';
import dayjs from 'dayjs';

interface Props {
  form: any; // Modifiquei o nome da prop para "form" para ser compatível com o restante do código
  index: string;
  xlabel: string;
  xobrigatorio: boolean;
  xtooltip: string;
}

const SeletorGrupoDepartamentoComponent: React.FC<Props> = ({
  form,
  index,
  xlabel,
  xobrigatorio,
  xtooltip,
}) => {
  const apiDepartamentos = useAxiosDepartamentos();

  const autoCompleteGrupo = useRef(null);
  const [showOptionsGrupos, setShowOptionsGrupos] = useState(false);
  const [listGrupos, setListGrupos] = useState<
    {
      id: number;
      key: number;
      label: string;
      value: string;
      seletor_ordenacao: string;
      options: {
        id: number;
        label: string;
        value: string;
        title: string;
        seletor_ordenacao: string;
      }[];
    }[]
  >([]);

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

  const ListGrupos = async () => {
    onLoadSeletor('Essas são os grupos a sua disposição...');

    await apiDepartamentos
      .listGrupos('', '', '', '', '', '', '', '', '')
      .then((response: any) => {
        const sortedData = response.data.retorno.sort(
          (a: any, b: any) =>
            (a.seletor_ordenacao || '').localeCompare(
              b.seletor_ordenacao || '',
            ) || (a.nome || '').localeCompare(b.nome || ''),
        );

        const retornoMap: Record<string, any> = {};
        sortedData.map((item: any) => {
          if (!retornoMap[item.seletor_ordenacao]) {
            retornoMap[item.seletor_ordenacao] = {
              label: item.seletor_ordenacao,
              value: item.seletor_ordenacao,
              id: item.seletor_ordenacao,
              key: item.seletor_ordenacao,
              title: item.seletor_ordenacao,
              seletor_ordenacao: item.seletor_ordenacao,
              options: [],
            };
          }

          retornoMap[item.seletor_ordenacao].options.push({
            label: item.nome,
            value: item.nome,
            id: item.grupo_id,
            key: item.grupo_id,
            title: item.descricao,
            seletor_ordenacao: item.seletor_ordenacao,
          });
        });
        const newretorno = Object.values(retornoMap);
        // console.log(newretorno);
        setListGrupos(newretorno);
        setShowOptionsGrupos(true);
      });

    exitLoadSeletor();
  };

  const onSelectGrupos = (data: any) => {
    //alert(data.id);
    form.setFieldValue('departamento_grupo_id_' + index, data.id);
  };
  const handleEnterPressGrupo = (e: any) => {
    if (e.key === 'Enter') {
      ListGrupos();
    }
  };
  function listGruposClick() {
    ListGrupos();
  }

  const ClearGrupo = (data: any) => {
    form.setFieldValue('departamento_grupo_id_' + index, '');
    form.setFieldValue('departamento_grupo_' + index, '');
    ListGrupos();
  };

  const renderItemGruposLabel = (
    xcategoria_id: number,
    xcategoria: string,
    xid: number,
    xkey: number,
    xlabel: string,
    xtitle: string,
    xseletor_ordenacao: string,
  ) => ({
    key: xid,
    id: xid,
    value: xlabel,
    title: xtitle,
    seletor_ordenacao: xseletor_ordenacao,
    label: (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          fontWeight: 'bold',
          color: xseletor_ordenacao === 'REGIONAL' ? 'darkblue' : 'black',
        }}
        title={xtitle}
      >
        {xlabel}
      </div>
    ),
  });

  const renderGrupoTitle = (xseletor_ordenacao: string) => {
    let color = 'black'; // Cor padrão
    let backgroundColor = 'lightgray'; // Cor de fundo padrão
    let title_desc = '';

    // console.log(title + '!');

    // Defina cores diferentes com base nos valores de title
    if (xseletor_ordenacao == 'REGIONAL') {
      color = 'darkblue';
      title_desc = 'Delegacias Regionais';
    } else {
      color = 'darkgreen';
      title_desc = 'Outras Unidades';
    }

    const titleStyle: CSSProperties = {
      color: color,
      fontWeight: 'bold', // Torna o texto em negrito
    };

    const backgroundStyle: CSSProperties = {
      backgroundColor: backgroundColor,
      textAlign: 'center', // Centraliza o texto
    };

    return (
      <div style={backgroundStyle}>
        <span style={titleStyle}>{title_desc}</span>
        {/*<a
        style={{ float: 'right' }}
        href="https://www.google.com/search?q=antd"
        target="_blank"
        rel="noopener noreferrer"
      >
        more
  </a>*/}
      </div>
    );
  };

  const optionsGruposAndamento = listGrupos.map(option => ({
    label: renderGrupoTitle(option.seletor_ordenacao),
    options: option.options.map(subOption => {
      const customItem = renderItemGruposLabel(
        option.id, // xcategoria_id
        option.label, // xcategoria
        subOption.id, // xid
        subOption.id, // xkey
        subOption.label, // xlabel
        subOption.title, // xlabel
        subOption.seletor_ordenacao, // xlabel
      );

      return {
        id: subOption.id,
        key: customItem.key,
        label: customItem.label,
        value: subOption.label,
        title: subOption.title,
        seletor_ordenacao: subOption.seletor_ordenacao, // Passando o item personalizado
      };
    }),
  }));

  return (
    <Spin spinning={openLoadSeletor} tip={messageLoadSeletor}>
      {/*campos retornados do sicad*/}
      <Form.Item hidden name={`departamento_grupo_id_${index}`}>
        <Input />
      </Form.Item>

      {/*campos retornados do sicad*/}

      <Col span={5} style={{ paddingRight: 5 }}>
        <Space.Compact>
          <Tooltip trigger={['hover']} title={xtooltip} placement="top">
            <Form.Item
              name={`departamento_grupo_${index}`}
              label={`${xlabel}:`}
              rules={[
                {
                  required: xobrigatorio,
                  message: 'Informe o Grupo de Departamento!',
                },
              ]}
            >
              <AutoComplete
                ref={autoCompleteGrupo}
                key={listGrupos.length} // Chave única com base no tamanho do array
                //options={listGrupos}
                style={{ width: 200 }}
                dropdownMatchSelectWidth={false} // Desative o ajuste automático
                dropdownStyle={{ width: 800 }}
                onSelect={(value, option) => {
                  onSelectGrupos(option);
                  setShowOptionsGrupos(false); // Fecha a lista após a seleção
                }}
                onKeyDown={handleEnterPressGrupo} // Adicione este evento para verificar a tecla Enter
                onDropdownVisibleChange={visible =>
                  setShowOptionsGrupos(visible)
                } // Controla a visibilidade da lista
                open={showOptionsGrupos} // Controla a visibilidade da lista
                placeholder="Escolha um Grupo de Departamentos"
                options={optionsGruposAndamento}
              ></AutoComplete>
            </Form.Item>
          </Tooltip>
          <Button
            type="primary"
            onClick={listGruposClick}
            style={{ marginTop: 30 }}
            icon={<SearchOutlined />}
          ></Button>
          <Button
            title="Limpar Campo"
            onClick={ClearGrupo}
            style={{ marginTop: 30 }}
            icon={<ClearOutlined />}
          ></Button>
        </Space.Compact>
      </Col>
    </Spin>
  );
};

export default SeletorGrupoDepartamentoComponent;

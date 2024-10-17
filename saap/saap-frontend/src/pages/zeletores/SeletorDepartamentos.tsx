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
  AimOutlined,
  AlertOutlined,
  ApartmentOutlined,
  AppstoreAddOutlined,
  AppstoreOutlined,
  BankOutlined,
  BorderOuterOutlined,
  BugOutlined,
  CarOutlined,
  CheckCircleOutlined,
  ClearOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CloudDownloadOutlined,
  CloudSyncOutlined,
  CloudUploadOutlined,
  ControlOutlined,
  CrownOutlined,
  DashboardOutlined,
  DislikeOutlined,
  DollarOutlined,
  EditOutlined,
  EnvironmentOutlined,
  ExpandOutlined,
  ExperimentOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileUnknownOutlined,
  FileWordOutlined,
  FrownOutlined,
  GlobalOutlined,
  GoldOutlined,
  HeatMapOutlined,
  HomeOutlined,
  IssuesCloseOutlined,
  LikeOutlined,
  LinkOutlined,
  LockOutlined,
  ManOutlined,
  MedicineBoxOutlined,
  MinusOutlined,
  MonitorOutlined,
  PhoneOutlined,
  PictureOutlined,
  QuestionCircleOutlined,
  ReconciliationFilled,
  RedditOutlined,
  RightCircleOutlined,
  SafetyCertificateOutlined,
  SaveOutlined,
  SearchOutlined,
  SettingOutlined,
  SolutionOutlined,
  StopOutlined,
  SyncOutlined,
  TeamOutlined,
  ToolOutlined,
  TrophyOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  UsergroupDeleteOutlined,
  VerticalAlignTopOutlined,
  WhatsAppOutlined,
  WomanOutlined,
  ZoomInOutlined,
} from '@ant-design/icons';
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

const SeletorDepartamentosComponent: React.FC<Props> = ({
  form,
  index,
  xlabel,
  xobrigatorio,
  xtooltip,
  xcampo_fone,
  xunidade_pai_filtro_id,
}) => {
  const apiDepartamentos = useAxiosDepartamentos();

  interface Departamento {
    id: number;
    key: number;
    nome: string;
    label: string;
    title: string;
    hierarquia: string;
    telefone: string;
    departamento_grupo: string;
    departamento_grupo_id: string;
    municipio: string;
    municipio_id: string;
    escala: string;
    grupo_titular_sicad_id: string;
    titular_id: string;
    titular: string;
    titular_celular: string;
    titular_telefone: string;
    titular_email: string;
    titular_interino_id: string;
    titular_interino: string;
    titular_interino_celular: string;
    titular_interino_telefone: string;
    titular_interino_email: string;
    chefe_cartorio_id: string;
    chefe_cartorio: string;
    chefe_cartorio_celular: string;
    chefe_cartorio_telefone: string;
    chefe_cartorio_email: string;
    chefe_cartorio_interino_id: string;
    chefe_cartorio_interino: string;
    chefe_cartorio_interino_celular: string;
    chefe_cartorio_interino_telefone: string;
    chefe_cartorio_interino_email: string;
    grupo_titular_nome: string;
    especializacao: string;
    options: {
      id: number;
      key: number;
      label: string;
      title: string;
      hierarquia: string;
      telefone: string;
      departamento_grupo: string;
      departamento_grupo_id: string;
      municipio: string;
      municipio_id: string;
      escala: string;
      grupo_titular_sicad_id: string;
      titular: string;
      titular_celular: string;
      grupo_titular_nome: string;
      especializacao: string;
    }[];
  }

  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);

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
      xsearch = removerAcentos(xsearch.toUpperCase());
    } else {
      // Defina um valor padrão, como uma string vazia, se xsearch for undefined
      xsearch = '';
    }

    await apiDepartamentos.listDepartamentos('', xsearch).then((res: any) => {
      if (res.status === 200) {
        // Ordenar o JSON pelo atributo "superior" e em seguida pelo atributo "nome"
        /* const sortedData = res.data.sort(
          (a: any, b: any) =>
            (a.tipo || '').localeCompare(b.tipo || '') ||
            (a.nome || '').localeCompare(b.nome || ''),
        );
        */
        const sortedData = res.data;

        // Objeto para mapear os departamentos pelo valor "superior"
        const departmentMap: Record<string, any> = {}; // Substitua "any" pelo tipo correto se possível

        // Construir a estrutura desejada
        sortedData.forEach((item: any) => {
          // Substitua "any" pelo tipo correto se possível

          /* var xdepartamento = removerAcentos(item.nome.toLowerCase());
          xsearch = removerAcentos(xsearch.toLowerCase());

          if (xdepartamento.indexOf(xsearch) !== -1) {*/

          //console.log('Achou '+xsearch+' em: '+xdepartamento);
          // if ((item.idSuperior == xunidade_pai_filtro_id) || (item.id == xunidade_pai_filtro_id)) {//Apenas sessões de identificação
          if (!departmentMap[item.departamento_grupo]) {
            departmentMap[item.departamento_grupo] = {
              label: item.especializacao || '',
              value: item.especializacao || '',
              id: item.departamento_grupo,
              key: item.departamento_grupo,
              departamento_grupo: item.departamento_grupo,
              options: [],
            };
          }

          departmentMap[item.departamento_grupo].options.push({
            label: item.nome || '',
            value: item.nome || '',
            hierarquia: item.hierarquia || '',
            telefone: item.telefone ? item.telefone : '',
            departamento_grupo: item.departamento_grupo
              ? item.departamento_grupo
              : '',
            departamento_grupo_id: item.departamento_grupo_id
              ? item.departamento_grupo_id
              : '',
            municipio: item.municipio ? item.municipio : '',
            municipio_id: item.municipioid ? item.municipioid : '',
            escala: item.escala ? item.escala : '',
            grupo_titular_sicad_id: item.grupo_titular_sicad_id
              ? item.grupo_titular_sicad_id
              : '',
            titular: item.titular ? item.titular : '',
            especializacao: item.especializacao ? item.especializacao : '',
            titular_celular: item.titular_celular ? item.titular_celular : '',
            grupo_titular_nome: item.grupo_titular_nome
              ? item.grupo_titular_nome
              : '',
            id: item.id.toString(),
            key: item.id.toString(),
          });
          // }
          /*console.log('Item: '+item.nome+' - '+item.id.toString());*/
          //}
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
          message: 'Erro ao listar departamentos!',
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
    form.setFieldValue('departamento_hierarquia_' + index, data.hierarquia);
    form.setFieldValue('departamento_telefone_' + index, data.telefone);
    form.setFieldValue(
      'departamento_grupo_id_' + index,
      data.departamento_grupo_id,
    );
    form.setFieldValue('departamento_grupo_' + index, data.departamento_grupo);
    form.setFieldValue('titular_' + index, data.titular);
    form.setFieldValue('titular_celular_' + index, data.titular_celular);
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
      [`departamento_hierarquia_${index}`]: '',
      [`departamento_cidade_${index}`]: '',
      [`departamento_telefone_${index}`]: '',
      [`departamento_grupo_id_${index}`]: '',
      [`departamento_grupo_${index}`]: '',
      [`titular_nome_${index}`]: '',
      [`titular_celular_${index}`]: '',
    });
    if (xcampo_fone != '') {
      form.setFieldValue(xcampo_fone, '');
    }
  }

  const getSpecializationIcon = (specialization: string) => {
    switch (specialization) {
      case 'REGIONAL':
        return <ApartmentOutlined style={{ color: 'brown', fontSize: 18 }} />;
      case 'MULHER':
        return <WomanOutlined style={{ color: 'purple', fontSize: 22 }} />;
      case 'MENOR_INFRATOR':
        return <FrownOutlined style={{ color: 'darkorange', fontSize: 18 }} />;
      case 'MENOR_VITIMA':
        return <RedditOutlined style={{ color: '#00b3b3', fontSize: 18 }} />;
      case 'IDOSO':
        return <CrownOutlined style={{ color: '#684200', fontSize: 18 }} />;
      case 'DEFICIENCIA':
        return (
          <AppstoreAddOutlined style={{ color: '#684200', fontSize: 18 }} />
        );
      case 'RACIAL':
        return (
          <UsergroupDeleteOutlined style={{ color: '#684200', fontSize: 18 }} />
        );
      case 'NECRO':
        return <GoldOutlined style={{ color: '#684200', fontSize: 18 }} />;
      case 'ID':
        return <SolutionOutlined style={{ color: '#684200', fontSize: 18 }} />;
      case 'SAUDE':
        return (
          <MedicineBoxOutlined style={{ color: 'darkred', fontSize: 18 }} />
        );
      case 'DIH':
        return <HeatMapOutlined style={{ color: 'darkred', fontSize: 18 }} />;
      case 'DEIC':
        return <ZoomInOutlined style={{ color: 'darkred', fontSize: 18 }} />;
      case 'DICT':
        return <CarOutlined style={{ color: 'darkred', fontSize: 18 }} />;
      case 'GEPATRI':
        return <HomeOutlined style={{ color: 'darkred', fontSize: 18 }} />;
      case 'DROGAS':
        return (
          <ExperimentOutlined style={{ color: 'darkred', fontSize: 18 }} />
        );
      case 'ORGANIZACIONAL':
        return <ExpandOutlined style={{ color: 'darkgray', fontSize: 18 }} />;
      case 'INTELIGENCIA':
        return <GlobalOutlined style={{ color: '#0051e6', fontSize: 18 }} />;
      default:
        return null;
    }
  };

  const renderItemDepartamentoLabel = (
    xid: number,
    xkey: number,
    xlabel: string,
    xtitle: string,
    xhierarquia: string,
    xtelefone: string,
    xdepartamento_grupo: string,
    xdepartamento_grupo_id: string,
    xmunicipio: string,
    xmunicipio_id: string,
    xescala: string,
    xgrupo_titular_sicad_id: string,
    xtitular: string,
    xtitular_celular: string,
    xgrupo_titular_nome: string,
    xespecializacao: string,
  ) => ({
    key: xid,
    id: xid,
    value: xlabel,
    title: xtitle,
    hierarquia: xhierarquia,
    telefone: xtelefone,
    departamento_grupo: xdepartamento_grupo,
    departamento_grupo_id: xdepartamento_grupo_id,
    municipio: xmunicipio,
    municipio_id: xmunicipio_id,
    escala: xescala,
    grupo_titular_sicad_id: xgrupo_titular_sicad_id,
    titular: xtitular,
    titular_celular: xtitular_celular,
    grupo_titular_nome: xgrupo_titular_nome,
    especializacao: xespecializacao,
    label: (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          fontWeight: 'bold',
          color: xescala === 'PLANTÃO' ? 'red' : 'black',
        }}
        title={xhierarquia + ' - Titular: ' + xtitular}
      >
        {xlabel}
        {
          <span style={{ marginLeft: 10 }}>
            {xespecializacao && getSpecializationIcon(xespecializacao)}
            {xescala === 'PLANTÃO' && (
              <AlertOutlined style={{ color: 'red' }} />
            )}
          </span>
        }
      </div>
    ),
  });

  const renderDepartamentoTitle = (departamento_grupo: string) => {
    let color = 'black'; // Cor padrão
    let backgroundColor = 'lightgray'; // Cor de fundo padrão
    let title_desc = '';

    // console.log(title + '!');

    // Defina cores diferentes com base nos valores de title
    /*switch (escala) {
      case 'EXPEDIENTE':
    color = 'black';
    title_desc = 'EXPEDIENTE';
        break;
      default:
        color = 'red';
        title_desc = 'Plantão';
        break;
    }*/

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
        <span style={titleStyle}>{departamento_grupo}</span>
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

  interface SubOption {
    id: number;
    key: number;
    label: string;
    title: string;
    hierarquia: string;
    telefone: string;
    departamento_grupo: string;
    departamento_grupo_id: string;
    municipio: string;
    municipio_id: string;
    escala: string;
    grupo_titular_sicad_id: string;
    titular: string;
    titular_celular: string;
    grupo_titular_nome: string;
    especializacao: string;
  }

  // Corrigindo a função optionsDepartamentos
  const optionsDepartamentos = departamentos.map(option => ({
    label: renderDepartamentoTitle(option.departamento_grupo),
    options: option.options.map(subOption => {
      const customItem = renderItemDepartamentoLabel(
        option.id, // xcategoria_id
        option.id, // xcategoria_id
        subOption.label, // xcategoria
        subOption.label, // xcategoria
        subOption.hierarquia,
        subOption.telefone,
        subOption.departamento_grupo,
        subOption.departamento_grupo_id,
        subOption.municipio,
        subOption.municipio_id,
        subOption.escala,
        subOption.grupo_titular_sicad_id,
        subOption.titular,
        subOption.titular_celular,
        subOption.grupo_titular_nome,
        subOption.especializacao,
      );

      return {
        id: subOption.id,
        key: customItem.key,
        label: customItem.label,
        value: subOption.label,
        title: subOption.title,
        hierarquia: subOption.hierarquia,
        telefone: subOption.telefone,
        departamento_grupo: subOption.departamento_grupo,
        departamento_grupo_id: subOption.departamento_grupo_id,
        municipio: subOption.municipio,
        municipio_id: subOption.municipio_id,
        escala: subOption.escala,
        grupo_titular_sicad_id: subOption.grupo_titular_sicad_id,
        titular: subOption.titular,
        titular_celular: subOption.titular_celular,
        grupo_titular_nome: subOption.grupo_titular_nome,
        especializacao: subOption.especializacao,
      };
    }),
  }));

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

      <Form.Item hidden name={`departamento_grupo_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`departamento_grupo_id_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`titular_nome_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`titular_celular_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`departamento_hierarquia_${index}`}>
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
                options={optionsDepartamentos}
                style={{ width: 200 }}
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

export default SeletorDepartamentosComponent;

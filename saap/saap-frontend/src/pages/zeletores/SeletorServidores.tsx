import { CSSProperties, useRef, useState } from 'react';
import { useAxiosServidorAtribuicao } from '../../hooks/useAxiosServidorAtribuicao';
import { useAuth } from '../../contexts/auth/AuthProvider';
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
  Badge,
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
  xcampo_celular: string;
  xunidade_pai_filtro_id: any;
  xunidade_agrupador_filtro_id: any;
  xcampo_dep: string;
  xcampo_dep_grupo: string;
}

const SeletorServidoresComponent: React.FC<Props> = ({
  form,
  index,
  xlabel,
  xobrigatorio,
  xtooltip,
  xcampo_fone,
  xcampo_celular,
  xunidade_pai_filtro_id,
  xunidade_agrupador_filtro_id,
  xcampo_dep,
  xcampo_dep_grupo,
}) => {
  const apiServidor = useAxiosServidorAtribuicao();

  interface DataTypeServidores {
    id: number;
    tenant_id: string;
    sicad_id: string;
    nome: string;
    vinculo: string;
    vinculo_desc: string;
    genero: string;
    funcao: string;
    cargo: string;
    atribuicao_id: string;
    origem_id: string;
    celular: string;
    telefone: string;
    email: string;
    cpf: string;
    lotacao: string;
    lotacao_id: number;
    dep_hierarquia_pai: string;
    dep_hierarquia: string;
    dep_tipo: string;
    dep_especializacao: string;
    dep_municipio: string;
    dep_municipioid: string;
    dep_telefone: string;
    dep_escala: string;
    titular_id: string;
    titular: string;
    titular_celular: string;
    titular_telefone: string;
    departamento_grupo_id: string;
    departamento_grupo: string;
    dta_nascimento: string;
    dta_nascimento_br: string;
    idade: number;
    aniversario_hoje: string;
    dtai: string;
    dtai_br: string;
    dtaf: string;
    dtaf_br: string;
    temporario_espirou: string;
    indicacao: string;
    indicacao_obs: string;
    chefia: string;
    chefia_desc: string;
    gratificado: string;
    fun_cad_id: string;
    fun_cad: string;
    fun_up_id: string;
    fun_up: string;
    created_at: string;
    updated_at: string;
    status: string;
    status_desc: string;
    lotacao_sigla: string;
    ac4_prevista: string;
    fc_bruta_prevista: string;
    fc_liquida_prevista: string;
    disposicao: string;
    escala: string;
    escala_grupo: string;
    restricao_arma: string;
    restricao_medica: string;
    restricao_judicial: string;
    restricao_sei: string;
    restricao_obs: string;
    municipio_id_lotacao: string;
    municipio_lotacao: string;
    situacao: string;
    matricula_funcional: string;
    dta_posse: string;
    dta_posse_br: string;
    idade_posse: number;
    idade_lotacao: number;
    options: {
      id: number;
      key: number;
      label: string;
      title: string;
      genero: string;
      cpf: string;
      funcao: string;
      cargo: string;
      dep_hierarquia: string;
      dep_hierarquia_pai: string;
      telefone: string;
      celular: string;
      departamento_grupo: string;
      departamento_grupo_id: string;
      lotacao: string;
      lotacao_id: string;
      dep_municipio: string;
      dep_escala: string;
      titular: string;
      sicad_id: string;
    }[];
  }

  const [servidores, setServidores] = useState<DataTypeServidores[]>([]);

  const [showOptionsServidores, setShowOptionsServidores] = useState(false);
  const autoCompleteServidor = useRef(null);
  const auth = useAuth();

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

  const ListSICADServidores = async () => {
    onLoadSeletor('Buscando os servidores...');

    let xsearch = form.getFieldValue('servidor_' + index);

    if (xsearch !== undefined) {
      xsearch = removerAcentos(xsearch.toUpperCase());
    } else {
      // Defina um valor padrão, como uma string vazia, se xsearch for undefined
      xsearch = '';
    }

    await apiServidor
      .listServidores(
        '',
        '',
        '',
        '',
        '',
        xsearch,
        '-',
        '',
        '-',
        xunidade_pai_filtro_id,
        xunidade_agrupador_filtro_id,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      )
      .then((res: any) => {
        if (res.status === 200) {
          // Ordenar o JSON pelo atributo "superior" e em seguida pelo atributo "nome"
          /* const sortedData = res.data.sort(
          (a: any, b: any) =>
            (a.tipo || '').localeCompare(b.tipo || '') ||
            (a.nome || '').localeCompare(b.nome || ''),
        );
        */
          const sortedData = res.data.retorno;

          // Objeto para mapear os departamentos pelo valor "superior"
          const servidorMap: Record<string, any> = {}; // Substitua "any" pelo tipo correto se possível

          // Construir a estrutura desejada
          sortedData.forEach((item: any) => {
            // Substitua "any" pelo tipo correto se possível

            /* var xdepartamento = removerAcentos(item.nome.toLowerCase());
          xsearch = removerAcentos(xsearch.toLowerCase());

          if (xdepartamento.indexOf(xsearch) !== -1) {*/

            //console.log('Achou '+xsearch+' em: '+xdepartamento);
            // if ((item.idSuperior == xunidade_pai_filtro_id) || (item.id == xunidade_pai_filtro_id)) {//Apenas sessões de identificação
            if (!servidorMap[item.departamento_grupo]) {
              servidorMap[item.departamento_grupo] = {
                label: item.dep_especializacao || '',
                value: item.dep_especializacao || '',
                id: item.departamento_grupo,
                key: item.departamento_grupo,
                departamento_grupo: item.departamento_grupo,
                lotacao: item.lotacao,
                options: [],
              };
            }

            servidorMap[item.departamento_grupo].options.push({
              label: item.nome || '',
              value: item.nome || '',
              genero: item.genero || '',
              cpf: item.cpf || '',
              funcao: item.funcao || '',
              cargo: item.cargo || '',
              dep_hierarquia: item.dep_hierarquia || '',
              dep_hierarquia_pai: item.dep_hierarquia_pai || '',
              telefone: item.telefone ? item.telefone : '',
              celular: item.celular ? item.celular : '',
              departamento_grupo: item.departamento_grupo
                ? item.departamento_grupo
                : '',
              departamento_grupo_id: item.departamento_grupo_id
                ? item.departamento_grupo_id
                : '',
              lotacao: item.lotacao ? item.lotacao : '',
              lotacao_id: item.lotacao_id ? item.lotacao_id : '',
              dep_municipio: item.dep_municipio ? item.dep_municipio : '',
              dep_municipioid: item.dep_municipioid ? item.dep_municipioid : '',
              dep_escala: item.dep_escala ? item.dep_escala : '',
              titular: item.titular ? item.titular : '',
              sicad_id: item.sicad_id ? item.sicad_id : '',
              id: item.id.toString(),
              key: item.id.toString(),
            });
            // }
            /*console.log('Item: '+item.nome+' - '+item.id.toString());*/
            //}
          });

          // Converter o objeto em um array
          const newServidor = Object.values(servidorMap);

          //console.log(newServidor);

          setServidores(newServidor);

          //console.log('aqui');

          setShowOptionsServidores(true);

          if (autoCompleteServidor.current) {
            (autoCompleteServidor.current as HTMLInputElement).focus();
          }
        } else {
          notification.error({
            message: 'Erro ao listar servidores!',
            description: res.data.message,
          });
        }
      });

    exitLoadSeletor();
  };

  const onSelectServidores = (data: any) => {
    form.setFieldValue('servidor_id_' + index, data.id);
    form.setFieldValue('servidor_genero_' + index, data.genero);
    form.setFieldValue('servidor_funcao_' + index, data.funcao);
    form.setFieldValue('servidor_cargo_' + index, data.cargo);
    form.setFieldValue('servidor_cpf_' + index, data.cpf);
    form.setFieldValue('servidor_sicad_id_' + index, data.sicad_id);
    if (xcampo_fone != '') {
      form.setFieldValue(xcampo_fone, data.telefone);
    }
    if (xcampo_celular != '') {
      form.setFieldValue(xcampo_celular, data.celular);
    }
    if (xcampo_dep != '') {
      form.setFieldValue(xcampo_dep + index, data.lotacao);
      form.setFieldValue(xcampo_dep + 'id_' + index, data.lotacao_id);
    }
    if (xcampo_dep_grupo != '') {
      form.setFieldValue(xcampo_dep_grupo + index, data.departamento_grupo);
      form.setFieldValue(
        xcampo_dep_grupo + 'id_' + index,
        data.departamento_grupo_id,
      );
    }
    if (data.celular != '') {
      setWhatsVisivel(true);
      form.setFieldValue('servidor_celular_' + index, data.celular);
    }
    if (data.telefone != '') {
      setWhats2Visivel(true);
      form.setFieldValue('servidor_telefone_' + index, data.telefone);
    }
  };

  const handleEnterPressServidor = (e: any) => {
    if (e.key === 'Enter') {
      ListSICADServidores();
    }
  };

  function clearServidor() {
    form.setFieldsValue({
      [`servidor_id_${index}`]: '',
      [`servidor_${index}`]: '',
      [`servidor_genero_${index}`]: '',
      [`servidor_funcao_${index}`]: '',
      [`servidor_cargo_${index}`]: '',
      [`servidor_cpf_${index}`]: '',
      [`servidor_telefone_${index}`]: '',
      [`servidor_celular_${index}`]: '',
      [`servidor_sicad_id_${index}`]: '',
    });
    if (xcampo_fone != '') {
      form.setFieldValue(xcampo_fone, '');
    }
    if (xcampo_celular != '') {
      form.setFieldValue(xcampo_celular, '');
    }
    setWhatsVisivel(false);
    setWhats2Visivel(false);
  }

  const getSpecializationIcon = (specialization: string) => {
    switch (specialization) {
      case 'MASCULINO':
        return <ManOutlined style={{ color: 'blue', fontSize: 18 }} />;
      case 'FEMININO':
        return <WomanOutlined style={{ color: 'purple', fontSize: 22 }} />;
      default:
        return null;
    }
  };

  const renderItemServidorLabel = (
    xid: number,
    xkey: number,
    xlabel: string,
    xtitle: string,
    xgenero: string,
    xcpf: string,
    xfuncao: string,
    xcargo: string,
    xdep_hierarquia: string,
    xdep_hierarquia_pai: string,
    xtelefone: string,
    xcelular: string,
    xdepartamento_grupo: string,
    xdepartamento_grupo_id: string,
    xlotacao: string,
    xlotacao_id: string,
    xdep_municipio: string,
    xdep_escala: string,
    xtitular: string,
    xsicad_id: string, // Aqui está como xsicad_id
  ) => ({
    key: xid,
    id: xid,
    value: xlabel,
    title: xtitle,
    genero: xgenero,
    cpf: xcpf,
    funcao: xfuncao,
    cargo: xcargo,
    dep_hierarquia: xdep_hierarquia,
    dep_hierarquia_pai: xdep_hierarquia_pai,
    telefone: xtelefone,
    celular: xcelular,
    departamento_grupo: xdepartamento_grupo,
    departamento_grupo_id: xdepartamento_grupo_id,
    lotacao: xlotacao,
    lotacao_id: xlotacao_id,
    dep_municipio: xdep_municipio,
    dep_escala: xdep_escala,
    titular: xtitular,
    sicad_id: xsicad_id, // Deve ser sicad_id
    label: (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          fontWeight: 'bold',
          color: xdep_escala === 'PLANTÃO' ? 'red' : 'black',
        }}
        title={xdep_hierarquia + ' - Titular: ' + xtitular}
      >
        {xlabel}
        {
          <span style={{ marginLeft: 10 }}>
            {xgenero && getSpecializationIcon(xgenero)}
            {xdep_escala === 'PLANTÃO' && (
              <AlertOutlined style={{ color: 'red' }} />
            )}
          </span>
        }
      </div>
    ),
  });

  const renderServidorTitle = (departamento_grupo: string, lotacao: string) => {
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
        <span style={titleStyle}>{departamento_grupo + ' - ' + lotacao}</span>
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
    genero: string;
    cpf: string;
    funcao: string;
    cargo: string;
    dep_hierarquia: string;
    dep_hierarquia_pai: string;
    telefone: string;
    celular: string;
    departamento_grupo: string;
    departamento_grupo_id: string;
    lotacao: string;
    lotacao_id: string;
    dep_municipio: string;
    dep_escala: string;
    titular: string;
    sicad_id: string;
  }

  // Corrigindo a função optionsDepartamentos
  const optionsServidores = servidores.map(option => ({
    label: renderServidorTitle(option.departamento_grupo, option.lotacao),
    options: option.options.map(subOption => {
      const customItem = renderItemServidorLabel(
        option.id, // xcategoria_id
        option.id, // xcategoria_id
        subOption.label, // xcategoria
        subOption.title, // title
        subOption.genero,
        subOption.cpf,
        subOption.funcao,
        subOption.cargo,
        subOption.dep_hierarquia,
        subOption.dep_hierarquia_pai,
        subOption.telefone,
        subOption.celular,
        subOption.departamento_grupo,
        subOption.departamento_grupo_id,
        subOption.lotacao,
        subOption.lotacao_id,
        subOption.dep_municipio,
        subOption.dep_escala,
        subOption.titular,
        subOption.sicad_id,
      );

      return {
        id: subOption.id,
        key: customItem.key,
        label: customItem.label,
        value: subOption.label,
        title: subOption.title,
        genero: subOption.genero,
        cpf: subOption.cpf,
        funcao: subOption.funcao,
        cargo: subOption.cargo,
        dep_hierarquia: subOption.dep_hierarquia,
        dep_hierarquia_pai: subOption.dep_hierarquia_pai,
        telefone: subOption.telefone,
        celular: subOption.celular,
        departamento_grupo: subOption.departamento_grupo,
        departamento_grupo_id: subOption.departamento_grupo_id,
        lotacao: subOption.lotacao,
        lotacao_id: subOption.lotacao_id,
        dep_municipio: subOption.dep_municipio,
        dep_escala: subOption.dep_escala,
        titular: subOption.titular,
        sicad_id: subOption.sicad_id,
      };
    }),
  }));

  const FalarViaWhats = (phone: string) => {
    const nomeUsuario = auth?.user?.nome;
    const siglaUnidade = auth?.user?.unidade?.sigla;

    const url = `https://web.whatsapp.com/send?phone=+55${phone}&text=${form.getFieldValue(
      'servidor_' + index,
    )}, tudo bem com o(a) Senhor(a)? Aqui quem fala é ${nomeUsuario} da ${siglaUnidade}...`;

    window.open(url, '_blank'); // Abrir link em uma nova aba
  };

  const [WhatsVisivel, setWhatsVisivel] = useState(false);
  const [Whats2Visivel, setWhats2Visivel] = useState(false);

  return (
    <Spin spinning={openLoadSeletor} tip={messageLoadSeletor}>
      {/*campos retornados do sicad*/}
      <Form.Item hidden name={`servidor_id_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`servidor_departamento_id_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`servidor_departamento_${index}`}>
        <Input />
      </Form.Item>

      <Form.Item hidden name={`departamento_grupo_id_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`departamento_grupo_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`servidor_genero_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`servidor_funcao_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`servidor_cargo_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`servidor_cpf_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`servidor_telefone_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`servidor_celular_${index}`}>
        <Input />
      </Form.Item>
      <Form.Item hidden name={`servidor_sicad_id_${index}`}>
        <Input />
      </Form.Item>

      {/*campos retornados do sicad*/}

      <Col span={5} style={{ paddingRight: 5 }}>
        <Space.Compact>
          <Tooltip trigger={['hover']} title={xtooltip} placement="top">
            <Form.Item
              name={`servidor_${index}`}
              label={`${xlabel}:`}
              rules={[
                {
                  required: xobrigatorio,
                  message: 'Informe o servidor!',
                },
              ]}
            >
              <AutoComplete
                ref={autoCompleteServidor}
                key={servidores.length} // Chave única com base no tamanho do array
                options={optionsServidores}
                style={{ width: 200 }}
                dropdownMatchSelectWidth={false} // Desative o ajuste automático
                dropdownStyle={{ width: 800 }}
                onSelect={(value, option) => {
                  onSelectServidores(option);
                  setShowOptionsServidores(false); // Fecha a lista após a seleção
                }}
                onKeyDown={handleEnterPressServidor} // Adicione este evento para verificar a tecla Enter
                onDropdownVisibleChange={visible =>
                  setShowOptionsServidores(visible)
                } // Controla a visibilidade da lista
                open={showOptionsServidores} // Controla a visibilidade da lista
                placeholder="Digite um Servidor"
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
            onClick={ListSICADServidores}
            style={{ marginTop: 30 }}
            icon={<SearchOutlined />}
          ></Button>
          <Button
            title="Limpar Campo"
            onClick={clearServidor}
            style={{ marginTop: 30 }}
            icon={<ClearOutlined />}
          ></Button>
          {WhatsVisivel && (
            <Button
              title="Tentar Contato via WhatsApp no Celular do Servidor"
              onClick={() =>
                FalarViaWhats(form.getFieldValue('servidor_celular_' + index))
              }
              style={{ marginTop: 30 }}
              icon={<WhatsAppOutlined style={{ color: 'green' }} />}
            ></Button>
          )}
          {Whats2Visivel && (
            <div>
              <Badge count={2} style={{ marginTop: 25 }}>
                <Button
                  title="Tentar Contato via WhatsApp no Telefone do Servidor"
                  onClick={() =>
                    FalarViaWhats(
                      form.getFieldValue('servidor_telefone_' + index),
                    )
                  }
                  style={{ marginTop: 30 }}
                  icon={<WhatsAppOutlined />}
                ></Button>
              </Badge>
            </div>
          )}
        </Space.Compact>
      </Col>
    </Spin>
  );
};

export default SeletorServidoresComponent;

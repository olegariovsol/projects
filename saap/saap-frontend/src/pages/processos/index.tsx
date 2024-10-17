import React, { useEffect, useRef, useState } from 'react';
import MyChart from '../graficos/MyChart';
import { useAxiosServidor } from '../../hooks/useAxiosServidor';
import { useAuth } from '../../contexts/auth/AuthProvider';
import { useAxiosSICAD } from '../../hooks/useAxiosSICAD';
import {
  AutoComplete,
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Dropdown,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Tooltip,
  message,
  notification,
} from 'antd';
import { Option } from 'antd/es/mentions';
import locale from 'antd/es/date-picker/locale/pt_BR';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import {
  BookOutlined,
  CheckCircleOutlined,
  ClearOutlined,
  ClockCircleOutlined,
  FolderAddOutlined,
  LoadingOutlined,
  LockOutlined,
  SaveOutlined,
  SearchOutlined,
  WhatsAppOutlined,
} from '@ant-design/icons';
import { MenuProps, Modal, Space, Tabs } from 'antd/lib';
import TabPane from 'antd/es/tabs/TabPane';
//import SeletorServidorSicadComponent from '../zeletores/SeletorServidorSicad';

const { RangePicker } = DatePicker;

export const Processos = () => {
  const auth = useAuth();
  const data = dayjs();
  const [form_consulta] = Form.useForm();
  const [form_cadastro] = Form.useForm();

  const [form_processo] = Form.useForm();
  const [form_historico] = Form.useForm();

  const apiServidor = useAxiosServidor();

  /**************************************************************************
   * **********************************VARIÁVEIS****************************
   * ************************************************************************/
  ////////////////////////////////////////////////////////////////////////////////MENSAGENS
  const [messageApi, contextHolder] = message.useMessage();

  type NoticeType = 'info' | 'warning' | 'error' | 'success' | 'loading';

  function msg_aviso(xmsg: string, xtipo: NoticeType) {
    // Certifique-se de que xtipo seja uma das opções válidas
    if (['info', 'warning', 'error', 'success', 'loading'].includes(xtipo)) {
      messageApi.open({
        type: xtipo,
        content: xmsg,
      });
    } else {
      // Se xtipo não for válido, trate como 'info' por padrão ou faça outra lógica de tratamento de erro.
      messageApi.open({
        type: 'info',
        content: xmsg,
      });
    }
  }

  ///////////////////////////////////////////////////////////////////////////spin consulta
  const [openLoadConsulta, setOpenLoadConsulta] = useState(false);
  const [messageLoadConsulta, setMessageLoadConsulta] = useState('');

  const onLoadConsulta = (message: string) => {
    setMessageLoadConsulta(message);
    setOpenLoadConsulta(true);
  };

  const exitLoadConsulta = () => {
    setOpenLoadConsulta(false);
    setMessageLoadConsulta('');
  };

  const [openLoadCadastro, setOpenLoadCadastro] = useState(false);
  const [msgLoadCadastro, setMsgLoadCadastro] = useState('');

  const onLoadCadastro = (message: string) => {
    setMsgLoadCadastro(message);
    setOpenLoadCadastro(true);
  };

  const exitLoadCadastro = () => {
    setMsgLoadCadastro('');
    setOpenLoadCadastro(false);
  };

  const [showDetencaoColumns, setShowDetencaoColumns] = useState(false);

  const handleSelectTipoData = (value: string) => {
    setShowDetencaoColumns(value !== 'EM_ANDAMENTO');
  };
  /**************************************************************************
   * **********************************RELATORIOS****************
   * ************************************************************************/
  /*const ImprimirListaARecolher = async (xmodo: string, DadosParte: DataTypeTriagensAutores[]) => {

        generateLista_a_Recolher_PDF(
            DadosParte,
            auth?.user?.nome,
            auth?.user?.unidade?.nome,
            xmodo
        );

  };*/

  const onMenuClickPrint: MenuProps['onClick'] = e => {
    if (e.key == '1') {
    }
    if (e.key == '2') {
    }
  };

  const items = [
    {
      key: '1',
      label: 'Aguardando Recolhimento',
    },
    {
      key: '2',
      label: 'Termo de Passagem de Carceragem',
    },
    {
      key: '3',
      label: 'Detidos no Intervalo de Data',
    },
    {
      key: '4',
      label: 'Autuados no Intervalo de Data',
    },
  ];
  /**************************************************************************
   * **********************************POR DATA REQUISIÇÃO FIM****************
   * ************************************************************************/
  useEffect(() => {}, []);

  /**************************************************************************
   * **********************************FUNÇÕES SELETORES**************************
   * ************************************************************************/

  ///////////////////////////////////////////////////////////////////////////Servidores
  const apiSICAD = useAxiosSICAD();
  const autoCompleteServidor = useRef(null);
  const [showOptionsServidor, setShowOptionsServidor] = useState(false);
  const [listaServidor, setListaServidor] = useState<
    { id: number; key: number; nome: string }[]
  >([]);

  const ListServidores = async (value: string) => {
    if (value.length < 3) {
      notification.info({
        message:
          'Informe pelo menos 3 caracteres para realizar a pesquisa de servidor.',
      });
    } else {
      onLoadCadastro('Minutinho só por favor...');

      await apiSICAD.servidoresPCPorNome(value).then((response: any) => {
        const sortedData = response.data.sort(
          (a: any, b: any) =>
            a.funcao.localeCompare(b.funcao) || a.nome.localeCompare(b.nome),
        );

        const servidorMap: Record<string, any> = {};

        sortedData.forEach((item: any) => {
          if (!servidorMap[item.funcao]) {
            servidorMap[item.funcao] = {
              label: item.funcao,
              value: item.funcao,
              id: item.funcao,
              key: item.funcao,
              options: [],
            };
            // console.log('Category: '+item.status);
          }

          /*
                            const segundosDesdeEpoca = item.dtNascimento;
                            const milissegundosDesdeEpoca = segundosDesdeEpoca * 1000; // Converta para milissegundos
                            const dataFormatada = dayjs(milissegundosDesdeEpoca).locale('pt-br').format('DD/MM/YYYY');
                            const dataFormatada1 = dayjs(item.dtNascimento / 1000).locale('pt-br').format('DD/MM/YYYY');
                            const dataFormatada0 = dayjs(item.dtNascimento).locale('pt-br').format('DD/MM/YYYY');

                            console.log(dataFormatada0, item.nome);*/

          const dataPosse = dayjs(item.dtPosse)
            .locale('pt-br')
            .format('DD/MM/YYYY');
          const dataLotacao = dayjs(item.dtInicioLotacao)
            .locale('pt-br')
            .format('DD/MM/YYYY');
          const dataNascimento = dayjs(item.dtNascimento)
            .locale('pt-br')
            .format('DD/MM/YYYY');
          //console.log(dataPosse + ' - ' + dataLotacao + ' - ' + dataNascimento, item.nome);

          servidorMap[item.funcao].options.push({
            label: item.nome,
            value: item.nome,
            id: item.id,
            key: item.id,
            funcao: item.funcao,
            cpf: item.cpf,
            title: item.lotacaoSigla,
            cargo_funcao: item.funcao,
            cargo: item.postoGrad,
            sexo: item.sexo,
            lotacao: item.lotacao,
            lotacao_id: item.lotacaoId,
            lotacao_dta: dataLotacao,
            cidade_id: item.municipioIdLotacao,
            cidade: item.municipioLotacao,
            status: item.status,
            situacao: item.situacao,
            posse_dta: dataPosse,
            nascimento: dataNascimento,
          });
        });

        const newServidor = Object.values(servidorMap);
        setListaServidor(newServidor);

        setShowOptionsServidor(true);

        return true;
      });

      exitLoadCadastro();
    }
  };

  const onSelectServidores = (data: any) => {
    form_processo.setFieldValue('servidor_id', data.id);
    if (data.sexo == 'M') {
      form_processo.setFieldValue('genero', 'MASCULINO');
    } else {
      form_processo.setFieldValue('genero', 'FEMININO');
    }
    form_processo.setFieldValue('cpf', data.cpf);
    form_processo.setFieldValue('cargo', data.cargo);
    form_processo.setFieldValue('lotacao', data.lotacao);
    form_processo.setFieldValue('lotacao_id', data.lotacao_id);
    //form_processo.setFieldValue("nascimento", dayjs(data.nascimento));
    form_processo.setFieldValue('dta_nascimento', data.nascimento);
    form_processo.setFieldValue('lotacao_dta', data.lotacao_dta);
    form_processo.setFieldValue('dta_inicio', data.posse_dta);

    // Parse a data de nascimento usando o formato adequado
    const xdta_exp = data.nascimento.split('/'); //gambiarra para funcionar kkkk
    const dataNascimentoFormatada = dayjs(
      xdta_exp[1] + '/' + xdta_exp[0] + '/' + xdta_exp[2],
      { format: 'DD/MM/YYYY' },
    );
    const dataAtual = dayjs();

    const diferenca = dayjs.duration(dataAtual.diff(dataNascimentoFormatada));

    const anos = diferenca.years();
    const meses = diferenca.months();
    const dias = diferenca.days();

    form_processo.setFieldValue(
      'idade',
      anos + ' Anos ' + meses + ' Meses ' + dias + ' Dias',
    );
  };
  const handleEnterPressServidor = (e: any) => {
    if (e.key === 'Enter') {
      ListServidores(form_processo.getFieldValue('servidor'));
    }
  };

  function listaServidoresClick() {
    ListServidores(form_processo.getFieldValue('servidor'));
  }

  function ClearServidor() {
    form_processo.setFieldValue('servidor_id', '');
    form_processo.setFieldValue('servidor', '');
  }

  /**************************************************************************
   * **********************************MODAL****************************
   * ************************************************************************/
  const [ModalViewTitulo, setModalViewTitulo] = useState('teste');
  const [ModalView, setModalView] = useState(false);

  const ModalModalViewHide = () => {
    setModalView(false);
    //ModalesConsulta('');
  };

  const NovoProcesso = () => {
    setModalViewTitulo('Novo Processo');
    setModalView(true);
  };

  //----------------------------------------------------------tabs

  const [activeTabModal, setactiveTabModal] = useState('1');
  const handleTabAutorClick = (key: string) => {
    setactiveTabModal(key);

    if (key === '1') {
      // FotosArquivosList(Xrai_parte_id, 'FOTO');
      //TriagemParteProcedimentosConsulta(form_triagem_autor_tab_adv.getFieldValue("proc_autor_rai_parte_id"));
    }

    if (key === '2') {
      //TriagemParteAdvogadosConsulta(Xrai_parte_id);
    }
  };

  const FormProcessoSubmit = async () => {
    //console.log('id: '+fieldsValue.id+' or id: '+fieldsValue[0].id);
    //alert(fieldsValue.id);
    onLoadCadastro('Atualizando processo...');
    /* const fieldsValue: any = {};
      fieldsValue.user_gio_id = auth?.user?.id;
      fieldsValue.user_gio = auth?.user?.nome;
      fieldsValue.autor_detencao_destino = form_triagem_autor_tab_proc.getFieldValue("autor_detencao_destino");
      fieldsValue.autor_detencao_destino_id = form_triagem_autor_tab_proc.getFieldValue("autor_detencao_destino_id");
      fieldsValue.autor_detencao_fianca = form_triagem_autor_tab_proc.getFieldValue("autor_detencao_fianca");
      fieldsValue.autor_risco_biologico = form_triagem_autor_tab_proc.getFieldValue("risco_biologico");
      fieldsValue.autor_risco_agressivo = form_triagem_autor_tab_proc.getFieldValue("risco_agressivo");
      fieldsValue.autor_risco_faccionado = form_triagem_autor_tab_proc.getFieldValue("risco_faccionado");

      fieldsValue.rai_parte_id = Xrai_parte_id;
      fieldsValue.rai_parte_nome = Xrai_parte_nome;
      fieldsValue.triagem_parte_id = Xtriagem_parte_id;
      fieldsValue.triagem_id = Xtriagem_id;
      fieldsValue.dp_grupo = Xdp_grupo;


  //alert(RaiDadosCompleto[0].delegadoPC.nome+'!');

      await apiTriagemParte.saveTriagemParte(fieldsValue).then((res: any) => {
        if (res.status == 200) {
          notification.info({ message: res.data.message })
        } else {
          notification.error({
            message: "Erro ao Salvar Autor Detenção!",
            description: res.data.message,
          });
        }
      });*/

    exitLoadCadastro();
  };

  const [statusIcon, setStatusIcon] = useState<string>('');

  const handleStatusIconChange = (value: string) => {
    setStatusIcon(value);
  };

  function telefoneWhatsappClick() {
    const telefone = form_processo.getFieldValue('telefone');

    if (telefone.length >= 10) {
      const link = `https://web.whatsapp.com/send?phone=+55${telefone}&text=Bom dia, ${form_processo.getFieldValue(
        'servidor',
      )}, tudo bem com você? Aqui quem fala é ${auth?.user?.nome} da ${auth
        ?.user?.unidade
        ?.sigla}, referente ao seu processo; venho lhe informar: `;

      // Abrir o link no WhatsApp
      window.open(link);
    } else {
      notification.error({
        message: 'Telefone inválido',
        description:
          'Telefone precisa ter pelo menos 10 números! Ex.: 62980001122 ou 6280001122 ou 6232011122',
      });
    }
  }

  function testandoClick() {
    alert(
      form_consulta.getFieldValue('servidor_1') +
        '!' +
        form_consulta.getFieldValue('servidor_2'),
    );
  }

  /**************************************************************************
   * **********************************MODAL FIM****************************
   * ************************************************************************/

  return {
    /*
     <div>
      <Spin spinning={openLoadConsulta} tip={messageLoadConsulta}>
      <Form
        form={form_consulta}
        layout='vertical'
        initialValues={{ servidor: 'GABRIELA', zcons_detencao_destino_id: '', zcons_filtro: '', zcons_detencao_destino: '', zcons_tipo_data: 'EM_ANDAMENTO', zcons_data: [dayjs(), dayjs()] }}
      >
          {contextHolder}



      <Row gutter={[16, 16]}>

        <Col>
          <SeletorServidorSicadComponent form={form_consulta} index={'1'} />
        </Col>

        <Col>
          <SeletorServidorSicadComponent form={form_consulta} index={'2'} />
        </Col>



             <Button
            type="primary"
            title="Remover Servidor"
            onClick={testandoClick}
            style={{ marginTop: 30 }}
            >
              testando
          </Button>
    </Row>
 </Form>


        <Row style={{ width: '100%' }}>
          <Col span={3} style={{ paddingRight: 5 }}>
                <Tooltip
                  trigger={['focus']}
                  title="Escolha a data a ser usada para a consulta"
                  placement="top"
                >
                  <Form.Item
                    name="zcons_tipo_data"
                    label="Por data de:"
                    rules={[
                      {
                        required: true,
                        message: 'Informe a ser usada para a consulta!',
                      },
                    ]}
                  >
                    <Select
                      style={{ width: 200 }}
                      options={[
                        { value: 'EM_ANDAMENTO', label: 'Processos Em Andamento' },
                        { value: 'INICIADOS', label: 'Iniciados' },
                        { value: 'MOVIMENTADOS', label: 'Movimentados' },
                        { value: 'FINALIZADOS', label: 'Finalizados' },
                      ]}
                      onChange={handleSelectTipoData}
                    />
                  </Form.Item>
                </Tooltip>
          </Col>


          <Col span={4.2} style={{paddingRight: 5, display: showDetencaoColumns ? 'block' : 'none'}}>
                  <Tooltip trigger={['focus']} title="Consulta Requisições/Identificações pela data de Requisição" placement="top">
                    <Form.Item name="zcons_data" label="Entre:">
                    <RangePicker style={{ width: 220, fontSize: '10px' }} format="DD/MM/YYYY"/>
                    </Form.Item>
                  </Tooltip>
            </Col>

            <Col span={3} style={{ paddingRight: 5 }}>
                <Tooltip
                  trigger={['focus']}
                  title="Pesquise por nome da parte"
                  placement="top"
                >
                  <Form.Item name="zcons_filtro" label="Filtro:">
                    <Input placeholder="Filtre Aqui" style={{ width: 180 }} />
                  </Form.Item>
                </Tooltip>
              </Col>


            <Col span={2} style={{ paddingRight: 5, marginTop: 30 }}>
                <Button type="primary" style={{backgroundColor: 'darkgreen'}}>
                    <SearchOutlined />Consultar
                </Button>
            </Col>


            <Col span={3} style={{ paddingRight: 5, marginTop: 30 }}>
                <Dropdown.Button menu={{ items, onClick: onMenuClickPrint }}><BookOutlined />Relatórios</Dropdown.Button>
            </Col>




            <Col span={2} style={{ paddingRight: 5, marginTop: 30 }}>
                <Button type="primary" style={{backgroundColor: 'darkblue'}} onClick={() => NovoProcesso()}>
                    <FolderAddOutlined />Cadastrar
                </Button>
            </Col>

        </Row>
        </Form>
      </Spin>





    <Modal
      width="100%"
      title={<div>{ModalViewTitulo}</div>}
        open={ModalView}
        onCancel={ModalModalViewHide}
        footer={[
          <Button key="back" onClick={ModalModalViewHide}>
            Voltar sem Salvar
          </Button>
        ]}
      >

      <Spin spinning={openLoadCadastro} tip={msgLoadCadastro}>
      <Form form={form_cadastro}
          layout='vertical'>

      <Tabs
        defaultActiveKey="1"
        tabPosition="top"
        activeKey={activeTabModal}
        onTabClick={handleTabAutorClick}
          >

        <TabPane tab="Processo" key="1">

              <div style={{ display: activeTabModal === '1' ? 'block' : 'none' }}>
                <Form
                  form={form_processo}
                  layout='vertical'
                  onFinish={FormProcessoSubmit}
                  initialValues={{status: 'PENDENTE', dta_inicio: dayjs(data.format('DD/MM/YYYY'), 'DD/MM/YYYY'), dta_fim: dayjs(data.format('DD/MM/YYYY'), 'DD/MM/YYYY')}}
                  >



                    <Row style={{ width: '100%' }}>



                  <Col span={3} style={{ paddingRight: 5 }}>
                    <Tooltip
                      trigger={['focus']}
                      title="Número do SEI do processo"
                      placement="top"
                    >
                    <Space.Compact>
                      <Form.Item name="sei" label="SEI:"
                        rules={[
                          {
                            required: true,
                            message: 'Informe o Número do SEI!',
                          },
                        ]}>
                        <Input
                          onInput={e =>
                            ((e.target as HTMLInputElement).value = (
                              e.target as HTMLInputElement
                            ).value.toUpperCase())
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace') {
                              return;
                            }

                            const isNumber = e.key >= '0' && e.key <= '9';
                            if (e.key === 'Tab' || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                              return;
                            }
                            if (!isNumber) {
                              e.preventDefault();
                            }
                          }}
                          className="bold-text-input"
                        />
                      </Form.Item>
                    </Space.Compact>
                    </Tooltip>
                      </Col>



                      <Col span={2} style={{ paddingRight: 5 }}>
                      <Tooltip
                        trigger={['focus']}
                        title="Data Início"
                        placement="top"
                      >
                        <Form.Item
                          name="dta_inicio"
                          label="Início:"
                          rules={[
                            {
                              required: true,
                              message: 'Escolha a data de Início!',
                            },
                          ]}
                        >
                          <DatePicker format={'DD/MM/YYYY'} locale={locale} />
                        </Form.Item>
                      </Tooltip>
                    </Col>




                    <Form.Item hidden name="processo_tipo_id"><Input /></Form.Item>

                    <Col span={4} style={{paddingRight: 5}}>
                    <Space.Compact>
                      <Form.Item name="processo_tipo"  label="Tipo:" rules={[
                                    {
                                    required: true,
                                    message: 'Informe o tipo do processo!',
                                    },
                                ]}>



                              </Form.Item>

                      </Space.Compact>

                      </Col>









          <Form.Item hidden name="servidor_id">
            <Input />
          </Form.Item>

          <Form.Item hidden name="lotacao_id">
            <Input />
          </Form.Item>

          <Col span={5} style={{ paddingRight: 5 }}>
            <Space.Compact>
              <Form.Item name="servidor" label="Servidor Atribuído:"
              rules={[
                {
                  required: true,
                  message: 'Informe o servidor que irá atender o processo!',
                },
              ]}>
                <AutoComplete
                  ref={autoCompleteServidor}
                  key={listaServidor.length} // Chave única com base no tamanho do array
                  options={listaServidor}
                  style={{ width: 260 }}
                  dropdownMatchSelectWidth={false} // Desative o ajuste automático
                  dropdownStyle={{ width: 800 }}
                  onSelect={(value, option) => {
                    onSelectServidores(option);
                    setShowOptionsServidor(false); // Fecha a lista após a seleção
                  }}
                  onKeyDown={handleEnterPressServidor} // Adicione este evento para verificar a tecla Enter
                  onDropdownVisibleChange={visible =>
                    setShowOptionsServidor(visible)
                  } // Controla a visibilidade da lista
                  open={showOptionsServidor} // Controla a visibilidade da lista
                  placeholder="Digite o nome de um Servidor"
                >
                  <Input
                    style={{ fontSize: 11, height: 32 }}
                    onInput={e =>
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
                onClick={listaServidoresClick}
                style={{ marginTop: 30 }}
                icon={<SearchOutlined />}
                          ></Button>
                          <Button type="primary" title='Remover Servidor' onClick={ClearServidor} style={{marginTop: 30}} icon={<ClearOutlined />}></Button>
                        </Space.Compact>

        </Col>


          <Col span={3} style={{ paddingRight: 5 }}>
            <Tooltip
              trigger={['focus']}
              title="Contato do Servidor. Clique no botão para tentar contato via Whatsapp"
              placement="top"
            >
            <Space.Compact>
              <Form.Item name="telefone" label="Telefone Servidor:">
                <Input
                  onInput={e =>
                    ((e.target as HTMLInputElement).value = (
                      e.target as HTMLInputElement
                    ).value.toUpperCase())
                  }
                  maxLength={11}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace') {
                      return;
                    }

                    const isNumber = e.key >= '0' && e.key <= '9';
                    if (e.key === 'Tab' || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                      return;
                    }
                    if (!isNumber) {
                      e.preventDefault();
                    }
                  }}
                  className="bold-text-input"
                />
              </Form.Item>

              <Button
                type="primary"
                onClick={telefoneWhatsappClick}
                style={{ marginTop: 30, backgroundColor: 'green' }}
                icon={<WhatsAppOutlined />}
              ></Button>
            </Space.Compact>
            </Tooltip>
          </Col>


        <Col span={2} style={{ paddingRight: 5 }}>
        <Tooltip
          trigger={['focus']}
          title="Data Fim"
          placement="top"
        >
          <Form.Item
            name="dta_fim"
            label="Fim:"
            rules={[
              {
                required: true,
                message: 'Escolha a data de Fim!',
              },
            ]}
          >
            <DatePicker format={'DD/MM/YYYY'} locale={locale} />
          </Form.Item>
        </Tooltip>
      </Col>



            <Col span={3} style={{ paddingRight: 5 }}>
                  <Tooltip
                    trigger={['focus']}
                    title="Status do Processo"
                    placement="top"
                        >
                          <Space.Compact>
                    <Form.Item
                      name="status"
                      label="Status Atual:"
                      rules={[
                        {
                          required: true,
                          message: 'Informe o status do processo!',
                        },
                      ]}
                    >
                      <Select
                        style={{ width: 160 }}
                        options={[
                          { value: 'PENDENTE', label: 'Pendente' },
                          { value: 'FINALIZADO', label: 'Finalizado' },
                        ]}
                        onChange={handleStatusIconChange}
                      />
                          </Form.Item>
                          {statusIcon === 'PENDENTE' ? (
                            <Avatar
                              size={38}
                              style={{ backgroundColor: '#fff', color: '#fab886' }}
                              shape="square"
                              icon={<ClockCircleOutlined />}
                            />
                          ) : (
                            <Avatar
                              size={38}
                              style={{ backgroundColor: '#fff', color: '#008000' }}
                              shape="square"
                              icon={<CheckCircleOutlined />}
                            />
                          )}</Space.Compact>
                  </Tooltip>
            </Col>

          </Row>




            <Row style={{ width: '100%' }}>


          <Form.Item hidden name="servidor_id">
            <Input />
          </Form.Item>

          <Col span={5} style={{ paddingRight: 5 }}>
            <Space.Compact>
              <Form.Item name="servidor" label="Solicitante:">
                <AutoComplete
                  ref={autoCompleteServidor}
                  key={listaServidor.length} // Chave única com base no tamanho do array
                  options={listaServidor}
                  style={{ width: 260 }}
                  dropdownMatchSelectWidth={false} // Desative o ajuste automático
                  dropdownStyle={{ width: 800 }}
                  onSelect={(value, option) => {
                    onSelectServidores(option);
                    setShowOptionsServidor(false); // Fecha a lista após a seleção
                  }}
                  onKeyDown={handleEnterPressServidor} // Adicione este evento para verificar a tecla Enter
                  onDropdownVisibleChange={visible =>
                    setShowOptionsServidor(visible)
                  } // Controla a visibilidade da lista
                  open={showOptionsServidor} // Controla a visibilidade da lista
                  placeholder="Digite o nome de um Servidor"
                >
                  <Input
                    style={{ fontSize: 11, height: 32 }}
                    onInput={e =>
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
                onClick={listaServidoresClick}
                style={{ marginTop: 30 }}
                icon={<SearchOutlined />}
                          ></Button>
                          <Button type="primary" title='Remover Servidor' onClick={ClearServidor} style={{marginTop: 30}} icon={<ClearOutlined />}></Button>
                        </Space.Compact>

        </Col>


          <Col span={3} style={{ paddingRight: 5 }}>
            <Tooltip
              trigger={['focus']}
              title="Contato do Solicitante. Clique no botão para tentar contato via Whatsapp"
              placement="top"
            >
            <Space.Compact>
              <Form.Item name="telefone" label="Telefone Solicitante:">
                <Input
                  onInput={e =>
                    ((e.target as HTMLInputElement).value = (
                      e.target as HTMLInputElement
                    ).value.toUpperCase())
                  }
                  maxLength={11}
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace') {
                      return;
                    }

                    const isNumber = e.key >= '0' && e.key <= '9';
                    if (e.key === 'Tab' || e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                      return;
                    }
                    if (!isNumber) {
                      e.preventDefault();
                    }
                  }}
                  className="bold-text-input"
                />
              </Form.Item>

              <Button
                type="primary"
                onClick={telefoneWhatsappClick}
                style={{ marginTop: 30, backgroundColor: 'green' }}
                icon={<WhatsAppOutlined />}
              ></Button>
            </Space.Compact>
            </Tooltip>
          </Col>



          <Col span={3} style={{ paddingRight: 5 }}>
            <Tooltip
              trigger={['focus']}
              title="Email do Solicitante."
              placement="top"
            >
              <Form.Item name="email" label="Email Solicitante:">
                <Input
                  onInput={e =>
                    ((e.target as HTMLInputElement).value = (
                      e.target as HTMLInputElement
                    ).value.toLowerCase())
                  }
                  style={{ textTransform: 'lowercase' }}
                />
              </Form.Item>
            </Tooltip>
          </Col>


            </Row>


            <Row style={{ width: '100%' }}>

                    <Button
                    style={{marginTop: 30,  }}
                    onClick={form_processo.submit}
                    icon={<FolderAddOutlined />}
                  >
                    Novo Processo
                  </Button>

                    <Button
                    style={{marginTop: 30, marginLeft: 10 }}
                    type="primary"
                    onClick={form_processo.submit}
                    icon={<SaveOutlined />}
                  >
                    Salvar Processo
                  </Button>

            </Row>



          </Form>
                </div>

        </TabPane>
        <TabPane tab="Historico" key="2">

              <div style={{ display: activeTabModal === '2' ? 'block' : 'none' }}>
                <Form
                  form={form_historico}
                  layout='vertical'
                >




                <Row style={{width: '100%'}}>
                  <Divider plain style={{ fontWeight: 'bold', color: 'darkgray' }}>Histórico</Divider>
                </Row>

                <Row style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 420px)', width: '100%' }}>

                </Row>


                </Form>
              </div>

        </TabPane>


      </Tabs>



      </Form>

      </Spin>
    </Modal>



    </div>*/
  };
};

export default Processos;

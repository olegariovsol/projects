import React, { useEffect, useState } from 'react';
import MyChart from '../graficos/MyChart';
import { useAxiosServidor } from '../../hooks/useAxiosServidor';
import { useAxiosDepartamentos } from '../../hooks/useAxiosDepartamentos';
import SeletorGrupoDepartamentoComponent from '../zeletores/SeletorGrupoDepartamento';
import SeletorDepartamentosComponent from '../zeletores/SeletorDepartamentos';
import SeletorServidoresComponent from '../zeletores/SeletorServidores';
import SeletorCidadeSicadComponent from '../zeletores/SeletorCidadesSicad';
import SeletorCidadeComponent from '../zeletores/SeletorCidade';
import { useAxiosPortaArquivo } from '../../hooks/useAxiosPortaArquivo';
import { useAxiosServidorAtribuicao } from '../../hooks/useAxiosServidorAtribuicao';
import { useAxiosServidorPortaArquivos } from '../../hooks/useAxiosServidorPortaArquvios';
import { useAxiosSICAD } from '../../hooks/useAxiosSICAD';
import { useAuth } from '../../contexts/auth/AuthProvider';
import { urlsServices } from '../../configs/urlsConfig';
import CardComponent from './CardComponent';
import { generatePdfDinamico } from '../report/relatorio_dinamico';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Carousel,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Form,
  Image,
  Input,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Spin,
  Table,
  TableColumnsType,
  Tabs,
  Timeline,
  Tooltip,
  Upload,
  message,
  notification,
} from 'antd';
import { Option } from 'antd/es/mentions';
import locale from 'antd/es/date-picker/locale/pt_BR';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import TabPane from 'antd/es/tabs/TabPane';
import {
  AlertOutlined,
  ApartmentOutlined,
  AppstoreAddOutlined,
  BankOutlined,
  BorderOuterOutlined,
  CameraOutlined,
  CarOutlined,
  CheckCircleOutlined,
  ClearOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CloudDownloadOutlined,
  CloudOutlined,
  CloudSyncOutlined,
  CloudUploadOutlined,
  ClusterOutlined,
  CoffeeOutlined,
  ColumnHeightOutlined,
  ColumnWidthOutlined,
  CrownOutlined,
  DashboardOutlined,
  DeleteOutlined,
  DislikeOutlined,
  DollarOutlined,
  EditOutlined,
  EnvironmentOutlined,
  ExpandOutlined,
  ExperimentOutlined,
  ExportOutlined,
  FileExcelOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  FileUnknownOutlined,
  FileWordOutlined,
  FilterOutlined,
  FolderViewOutlined,
  FrownOutlined,
  FullscreenExitOutlined,
  FundViewOutlined,
  GlobalOutlined,
  GoldOutlined,
  HeatMapOutlined,
  HomeOutlined,
  IdcardOutlined,
  IssuesCloseOutlined,
  LikeOutlined,
  LoadingOutlined,
  LockOutlined,
  ManOutlined,
  MedicineBoxOutlined,
  MinusOutlined,
  MonitorOutlined,
  PictureOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  PrinterOutlined,
  QuestionCircleOutlined,
  RedditOutlined,
  SafetyCertificateOutlined,
  SafetyOutlined,
  SaveOutlined,
  ScheduleOutlined,
  SearchOutlined,
  SettingOutlined,
  SolutionOutlined,
  StopOutlined,
  SubnodeOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  ToolOutlined,
  TrophyOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  UsergroupDeleteOutlined,
  UserOutlined,
  VerticalAlignTopOutlined,
  WhatsAppOutlined,
  WomanOutlined,
  ZoomInOutlined,
} from '@ant-design/icons';
import { TableRowSelection } from 'antd/es/table/interface';
import { ColumnsType } from 'antd/lib/table';
import SeletorServidorSicadComponent from '../zeletores/SeletorServidorSicad';
import { DrawerProps } from 'antd/lib';
import TextArea from 'antd/es/input/TextArea';
import SeletorDossiePastaComponent from '../zeletores/SeletorDossiePasta';
import * as XLSX from 'xlsx';

const { RangePicker } = DatePicker;

//Pronto Para Uso, Leilão, Aguardando Definição, Bloqueado para Uso
interface ChartDataDestinacao {
  name: string;
  data: any[];
}

interface ChartDataBar {
  name: string;
  group: any[];
  data: any[];
}
interface ChartOptionsBar {
  series: ChartDataBar[];
  options: {
    [key: string]: any; // Aceita qualquer propriedade
  };
}

interface ChartDataBarHorizontal {
  name: string;
  group: any[];
  data: any[];
}
interface ChartOptionsBarHorizontal {
  series: ChartDataBarHorizontal[];
  options: {
    [key: string]: any; // Aceita qualquer propriedade
  };
}

interface ChartDataPieDunut {
  name: string;
  data: any[];
}
interface ChartOptionsPieDunut {
  series: ChartDataPieDunut[];
  options: {
    [key: string]: any; // Aceita qualquer propriedade
  };
}

interface ChartDataLine {
  name: string;
  data: any[];
}

interface ChartOptionsLine {
  chart: {
    type: string;
    zoom: {
      enabled: boolean;
    };
  };
  title: {
    text: string;
    align: string;
    margin: number;
    floating: boolean;
    style: {
      fontSize: string;
      fontWeight: string;
      color: string;
    };
  };
  dataLabels: {
    enabled: boolean;
  };
  stroke: {
    width: number[]; // Um array de números
    curve: string;
    dashArray: number[];
  };
  tooltip: {
    x: {
      show: boolean;
    };
    y: {
      title: {
        formatter?: (
          val: string,
          {
            seriesIndex,
            dataPointIndex,
          }: { seriesIndex: number; dataPointIndex: number },
        ) => string;
      };
    };
  };
  xaxis: {
    categories: string[];
  };
}

interface DataTypeArquivos {
  key: React.Key;
  url: string;
  departamento_id: string;
  arquivo_id: string;
  dta_upload_br: string;
  user_cad: string;
  arquivo_numero: string;
  arquivo_tipo: string;
  arquivo_tipo_icon: string;
  grupo: string;
}
/**************************************************************************
 * **********************************TABELA CAMPOS**************************
 * ************************************************************************/
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

interface DataTypeTreeDepartamento {
  value: string; //id do departamento usado na tree
  id: number; //id do departamento usado na ligação com outras tabelas
  key: number; //id do departamento usado na grid
  title: React.ReactNode; // Agora aceita qualquer conteúdo de nó
  hierarquia: string;
  sigla: string;
  municipioid: string;
  municipio: string;
  censo_vinte_tres: number;
  tipo: string;
  especializacao: string;
  telefone: string;
  telefone2: string;
  telefone3: string;
  endereco: string;
  id_superior_hierarquia: string;
  nome_superior_hierarquia: string;
  superior_sicad: string;
  idsuperior_sicad: string;
  portaria: string;
  filhos: number;
  servidores_qtd?: number;
  servidores_agentes?: number;
  servidores_delegados?: number;
  servidores_escrivaes?: number;
  servidores_outros?: number;
  qtd_municipios?: number;
  departamento_grupo_id: string;
  departamento_grupo: string;
  grupo_descricao: string;
  grupo_cidade: string;
  grupo_cidade_id: string;
  grupo_titular_sicad_id: string;
  grupo_titular: string;
  grupo_titular_celular: string;
  titular_id: string;
  titular: string;
  titular_abreviado: string;
  interino_abreviado: string;
  chefe_cartorio_interino_abreviado: string;
  chefe_cartorio_abreviado: string;
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
  escala: string;
  imovel_status: string;
  valor_contrato: string;
  ultima_imagem: string;
  imagens: string;
  status: string;
  status_desc: string;
  children?: DataTypeTreeDepartamento[];
}

interface DataTypeServidoresSicad {
  id: string;
  nome: string;
  cpf: string;
  funcao: string;
  dtNascimento: string;
  postoGrad: string;
  postoSiglaGrad: string;
  lotacaoId: number;
  lotacao: string;
  dtInicioLotacao: string;
  lotacaoSigla: string;
  municipioIdLotacao: string;
  municipioLotacao: string;
  status: string;
  situacao: string;
  sexo: string;
  dtPosse: string;
  servidorExterno: boolean;
  telefone: string;
  celular: string;
  email: string;
  //sicadId?: string;
  matriculaFuncional: string;
  /*lotacao_anterior?: string;
  lotacao_anterior_id?: number | null;*/
}

interface DataTypeServidoresSicadSinc {
  acao: string; //MUDOU_LOTACAO ou NAO_EXISTE_EM_OBSERVATORIO ou EXCLUIR_EM_OBSERVATORIO
  sicadId: string; //DataTypeServidoresSicad.sicadId
  nome: string; //DataTypeServidoresSicad.nome
  cpf: string; //DataTypeServidoresSicad.cpf
  funcao: string; //DataTypeServidoresSicad.funcao
  dtNascimento: string; //DataTypeServidoresSicad.dtNascimento
  postoGrad: string; //DataTypeServidoresSicad.postoGrad
  postoSiglaGrad: string; //DataTypeServidoresSicad.postoSiglaGrad
  lotacaoId: number; //DataTypeServidoresSicad.lotacaoId
  lotacao: string; //DataTypeServidoresSicad.lotacao
  dtInicioLotacao: string; //DataTypeServidoresSicad.dtInicioLotacao
  lotacaoSigla: string; //DataTypeServidoresSicad.lotacaoSigla
  municipioIdLotacao: string; //DataTypeServidoresSicad.municipioIdLotacao
  municipioLotacao: string; //DataTypeServidoresSicad.municipioLotacao
  status: string; //DataTypeServidoresSicad.status
  situacao: string; //DataTypeServidoresSicad.situacao
  sexo: string; //DataTypeServidoresSicad.sexo
  dtPosse: string; //DataTypeServidoresSicad.dtPosse
  servidorExterno: boolean; //DataTypeServidoresSicad.servidorExterno
  telefone: string; //DataTypeServidoresSicad.telefone
  celular: string; //DataTypeServidoresSicad.celular
  email: string; //DataTypeServidoresSicad.email
  matriculaFuncional: string; //DataTypeServidoresSicad.matriculaFuncional
  lotacao_anterior?: string; //DataTypeServidores.lotacao
  lotacao_anterior_id?: number | null; //DataTypeServidores.lotacao_id
}

interface DataTypeServidores {
  id: string;
  tenant_id: string;
  sicad_id: number;
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
  dep_telefone2: string;
  dep_telefone3: string;
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
  restricao_arma: boolean;
  restricao_medica: boolean;
  restricao_judicial: boolean;
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
  administracao: string;
  hierarquia_ordenacao: string;
  lotacao_anterior: string;
  lotacao_anterior_id: number;
  classificacao: string;
  classificacao_desc: string;
  qtd_dossie: number;
  nome_mae: string;
  naturalidade: string;
  cor_raca: string;
  escolaridade: string;
  especialidade: string;
  estado_civil: string;
  pne: string;
  sub_judice: string;
  regime_juridico: string;
  dta_nomeacao_br: string;
  punicoes: string;
  dta_inicio_lotacao_br: string;
  nacionalidade: string;
  probatorio: string;
}

/**************************************************************************
 * **********************************TABELA VIATURAS SISVTR************
 * ************************************************************************/
interface DataTypeViaturas {
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
  destinacao: string;
  condutor: string;
  condutorCpf: string;
  cidadeUnidadeNome: string;
}

/**************************************************************************
 * **********************************TABELA CAMPOS**************************
 * ************************************************************************/
interface DataTypeServidorDossie {
  key: React.Key;
  url: string;
  id: string;
  servidor_id: string;
  arquivo_id: string;
  dta_upload_br: string;
  user_cad: string;
  arquivo_numero: string;
  arquivo_tipo: string;
  arquivo_tipo_icon: string;
  legenda: string;
  sei_numero: string;
  pasta_id: string;
  pasta: string;
  excluido: boolean;
}

const Departamentos: React.FC = () => {
  const auth = useAuth();
  const apiDepartamentos = useAxiosDepartamentos();
  const apiServidorAtribuicao = useAxiosServidorAtribuicao();
  const apiServidores = useAxiosSICAD();
  const [messageApi, contextHolder] = message.useMessage();

  ////////////////////////////////////////////////////////////////////////////////MENSAGENS

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

  const [openLoadDados, setopenLoadDados] = useState(false);
  const [messageLoadDados, setmessageLoadDados] = useState('');

  const onLoadDados = (message: string) => {
    setmessageLoadDados(message);
    setopenLoadDados(true);
  };

  const exitLoadDados = () => {
    setopenLoadDados(false);
    setmessageLoadDados('');
  };

  const [form_departamentos] = Form.useForm();

  const [form_servidores] = Form.useForm();
  const data = dayjs();
  const [openServidorLoad, setOpenServidorLoad] = useState(false);
  const [messageServidorLoad, setMessageServidorLoad] = useState('');

  const onServidorLoad = (message: string) => {
    setMessageServidorLoad(message);
    setOpenServidorLoad(true);
  };

  const exitServidorLoad = () => {
    setOpenServidorLoad(false);
    setMessageServidorLoad('');
  };

  const [ModalServidor, setModalServidor] = useState(false);
  const ModalServidorShowNovo = () => {
    setModalServidor(true);
  };

  const ModalServidorHide = () => {
    setModalServidor(false);
    GetDadosDepartamentos();
  };

  const [DepartamentosObservatorioTree, setDepartamentosObservatorioTree] =
    useState<DataTypeTreeDepartamento[]>([]);

  const [DepartamentosObservatorioTable, setDepartamentosObservatorioTable] =
    useState<DataTypeTreeDepartamento[]>([]);

  const [ServidoresObservatorioTable, setServidoresObservatorioTable] =
    useState<DataTypeServidores[]>([]);

  const [
    ServidoresObservatorioInativosTable,
    setServidoresObservatorioInativosTable,
  ] = useState<DataTypeServidores[]>([]);

  const [ServidoresSicadTable, setServidoresSicadTable] = useState<
    DataTypeServidoresSicad[]
  >([]);

  /*let ServidoresObservatorioSinc: DataTypeServidores[] = [];
  let ServidoresSicadSinc: DataTypeServidoresSicad[] = [];*/

  const [ServidoresObservatorioSinc, setServidoresObservatorioSinc] = useState<
    DataTypeServidores[]
  >([]);

  useEffect(() => {
    if (ServidoresObservatorioSinc.length > 0) {
      SincGetServidoresSicad();
    }
  }, [ServidoresObservatorioSinc]);

  const [ServidoresSicad, setServidoresSicad] = useState<
    DataTypeServidoresSicad[]
  >([]);

  useEffect(() => {
    if (ServidoresSicad.length > 0) {
      SincServidoresTestar();
    }
  }, [ServidoresSicad]);

  const [ServidoresSicadSinc, setServidoresSicadSinc] = useState<
    DataTypeServidoresSicadSinc[]
  >([]);

  useEffect(() => {
    if (ServidoresSicadSinc.length > 0) {
      SincServidoresExecutar();
    } else {
      msg_aviso('Nenhuma modificação encontrada no SICAD', 'warning');
      exitLoadDados();
    }
  }, [ServidoresSicadSinc]);

  function LimparGetDadosDepartamentos() {
    form_departamentos.setFieldValue('zdp_opcao_and', '');
    form_departamentos.setFieldValue('zdp_opcao_or', '');
    form_departamentos.setFieldValue('znome_filtro', '');
    form_departamentos.setFieldValue('departamento_grupo_id_1', '');
    form_departamentos.setFieldValue('departamento_grupo_1', '');
    form_departamentos.setFieldValue('departamento_id_1', '');
    form_departamentos.setFieldValue('departamento_hierarquia_1', '');
    form_departamentos.setFieldValue('departamento_1', '');
    form_departamentos.setFieldValue('servidor_id_1', '');
    form_departamentos.setFieldValue('servidor_celular_1', '');
    form_departamentos.setFieldValue('servidor_telefone_1', '');
    form_departamentos.setFieldValue('servidor_cpf_1', '');
    form_departamentos.setFieldValue('servidor_sicad_id_1', '');
    form_departamentos.setFieldValue('servidor_1', '');
    form_departamentos.setFieldValue('zfiltros_adcionais', '');
    form_departamentos.setFieldValue('zdeps_ids', '');
    form_departamentos.setFieldValue('zcpfs', '');
    form_departamentos.setFieldValue('cidade_id_2', '');
    form_departamentos.setFieldValue('cidade_2', '');
    form_departamentos.setFieldValue('zcons_classificacao', '');
    form_departamentos.setFieldValue('zorder', 'HIERARQUIAeCARGOeSERVIDOR');

    // GetDadosDepartamentos();
  }

  function ClearClassificacao() {
    form_departamentos.setFieldValue('zcons_classificacao', '');

    // GetDadosDepartamentos();
  }

  const clearDataInativo = () => {
    // Limpar o campo do RangePicker
    form_departamentos.setFieldsValue({
      inativos_cons_data: [], // Define o valor como um array vazio para limpar o RangePicker
    });
  };

  /**************************************************************************
   * **********************************UPLOAD ARQUIVO**************************
   * ************************************************************************/

  const [DossieLiberarUpload, setDossieLiberarUpload] = useState(false);

  const ClickSeletorDossiePasta = (PastaId?: string) => {
    if (PastaId === '') {
      setDossieLiberarUpload(false);
    } else {
      setDossieLiberarUpload(true);
    }
  };

  const [ServidorNome, setServidorNome] = useState('');

  const [openDrawerUpload, setOpenDrawerUpload] = useState(false);

  const showDrawerUpload = () => {
    setOpenDrawerUpload(true);
  };

  const onCloseDrawerUpload = () => {
    setOpenDrawerUpload(false);
    GetDadosDepartamentos();
  };

  const ArquivoIncluirButton = (record: DataTypeServidores) => {
    setServidorNome(record.nome);
    /*setRequisicaoId(record.identificacao_id);*/

    //alert(record.nome);
    form_departamentos.setFieldValue('arquivo_upload_servidor_id', record.id);
    form_departamentos.setFieldValue('arquivo_upload_dossie_id', '');
    form_departamentos.setFieldValue('legenda_dossie', '');
    form_departamentos.setFieldValue('dossie_numero_sei', '');
    form_departamentos.setFieldValue('servidor_porta_arquivo_pasta_1', '');
    form_departamentos.setFieldValue('servidor_porta_arquivo_pasta_id_1', '');
    DossieArquivosList(record.id);
    setActiveTabDossie('1');
    showDrawerUpload();
  };

  const ApiServidorPortaArquivos = useAxiosServidorPortaArquivos();
  const axiosPortaArquivo = useAxiosPortaArquivo();
  const [servidorPortaArquivoDados, setServidorPortaArquivoDados] = useState<
    DataTypeServidorDossie[]
  >([]);

  const getFileType = (file: File) => {
    const fileName = file.name;
    const fileExtension = fileName.slice(
      ((fileName.lastIndexOf('.') - 1) >>> 0) + 2,
    );

    // Lista de extensões de imagem (pode ser expandida conforme necessário)
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];

    // Verifica se a extensão do arquivo está na lista de extensões de imagem
    if (imageExtensions.includes(fileExtension.toLowerCase())) {
      return 'IMAGEM';
    } else {
      // Se não for uma imagem, retorna a extensão do arquivo
      return fileExtension.toUpperCase();
    }
  };

  const sendFileWsDossie = async (pdfData: File, fileType: string) => {
    let xlegenda = form_departamentos.getFieldValue('legenda_dossie');
    let xteor = '';
    if (xlegenda === '' || !xlegenda) {
      xteor = 'Deseja incluir a Imagem/Arquivo SEM LEGENDA?';
    } else {
      xteor =
        'Deseja incluir a imagem/arquivo com a seguinte Legenda: ' +
        xlegenda +
        '?';
    }

    const shouldFinalizar = window.confirm(xteor);

    if (shouldFinalizar) {
      try {
        onLoadDados('Anexando o arquivo escolhido');

        const res: any = await axiosPortaArquivo.post(pdfData);

        if (res) {
          form_departamentos.setFieldValue(
            'arquivo_upload_dossie_id',
            res.data?.id,
          );

          await ApiServidorPortaArquivos.saveServidorPortaArquivo(
            form_departamentos.getFieldValue('arquivo_upload_servidor_id'),
            res.data?.id,
            auth?.user?.id?.toString() || '', // Converte para string ou fornece uma string vazia
            auth?.user?.nome || '',
            fileType, // Adiciona o novo parâmetro
            form_departamentos.getFieldValue('legenda_dossie'),

            form_departamentos.getFieldValue('dossie_numero_sei'),
            form_departamentos.getFieldValue(
              'servidor_porta_arquivo_pasta_id_1',
            ),
          ).then((res: any) => {
            if (res.status === 200) {
              notification.info({ message: res.data.message });
              //alert(res.data.message);
              form_departamentos.setFieldValue('legenda_dossie', '');
              form_departamentos.setFieldValue('dossie_numero_sei', '');
              form_departamentos.setFieldValue(
                'servidor_porta_arquivo_pasta_1',
                '',
              );
              form_departamentos.setFieldValue(
                'servidor_porta_arquivo_pasta_id_1',
                '',
              );

              setDossieLiberarUpload(false);

              DossieArquivosList(
                form_departamentos.getFieldValue('arquivo_upload_servidor_id'),
              );
            } else {
              notification.error({
                message: 'Erro ao Salvar Dossie!',
                description: res.data.message,
              });
            }
          });
        }

        exitLoadDados();
        // Restante do seu código...
      } catch {
        exitLoadDados();
        message.error('Ocorreu um erro ao receber o arquivo');
      }
    }
  };

  const DossieArquivosList = async (servidorId: string) => {
    // Certifique-se de que a variável de estado está sendo usada corretamente

    setServidorPortaArquivoDados([]);

    if (servidorId !== '') {
      onLoadDados('Vamos ver que arquivos temos anexados a este serviço.');

      await ApiServidorPortaArquivos.listarServidorPortaArquivos(
        servidorId,
      ).then((res: any) => {
        if (res.status === 200) {
          let newretorno: DataTypeServidorDossie[] = [];

          if (res.data && Array.isArray(res.data.retorno)) {
            newretorno = res.data.retorno;
          } else {
            console.error('Resposta inesperada:', res.data);
          }

          if (newretorno.length > 0) {
            const primeiroArquivoId = newretorno[0].arquivo_id;
            form_departamentos.setFieldValue(
              'arquivo_upload_dossie_id',
              primeiroArquivoId,
            );
          } else {
            form_departamentos.setFieldValue('arquivo_upload_dossie_id', '');
          }

          setServidorPortaArquivoDados(newretorno);
        } else {
          notification.error({
            message: 'Erro ao listar dossie Arquivos Anexados!',
            description: res.data.message,
          });
        }
      });

      exitLoadDados();
    }
  };

  const ExcluirDossieClick = async (dados: DataTypeServidorDossie) => {
    //alert('list: '+servidorId);

    if (dados.id != '') {
      const shouldDelete = window.confirm(
        'Tem certeza de que deseja excluir esta imagem/arquivo?',
      );
      if (shouldDelete) {
        onLoadDados('Deixa comigo, estou excluíndo o arquivo que vc pediu.');

        await ApiServidorPortaArquivos.excluirServidorPortaArquivo(
          dados.servidor_id,
          dados.id,
          auth?.user?.id?.toString() || '', // Converte para string ou fornece uma string vazia
          auth?.user?.nome || '',
          dados.pasta,
        ).then((res: any) => {
          if (res.status == 200) {
            DossieArquivosList(dados.servidor_id);
            msg_aviso('Arquivo Removido Com Sucesso.', 'success');
          } else {
            notification.error({
              message: 'Erro ao Excluir Dossie Anexado!',
              description: res.data.message,
            });
          }
        });

        exitLoadDados();
      }
    } //status deve ser Aguardando
  };

  const AbrirDossieClick = async (dados: DataTypeServidorDossie) => {
    //alert('list: '+servidor_id);

    onLoadDados('Abrindo o arquivo.');

    await ApiServidorPortaArquivos.abrirServidorPortaArquivo(
      dados.servidor_id,
      dados.id,
      auth?.user?.id?.toString() || '', // Converte para string ou fornece uma string vazia
      auth?.user?.nome || '',
      dados.pasta,
    ).then((res: any) => {
      if (res.status == 200) {
        window.open(
          `${urlsServices.PORTAARQUIVO}/loadArquivo?id=${
            dados.arquivo_id
          }&token=${localStorage.getItem('token_sso')}`,
          '_blank',
        );
      } else {
        notification.error({
          message: 'Erro ao Registrar a Abertura do Arquivo!',
          description: res.data.message,
        });
      }
    });

    exitLoadDados();
  };

  ////////////////////////////////////////////////////////////////////////////////ARQUIVOS LAUDO CONSULTA
  const columnsLaudoArquivos: ColumnsType<DataTypeServidorDossie> = [
    {
      title: 'ARQUIVOS ANEXADO',
      width: 400,
      dataIndex: 'pasta',
      key: 'pasta',
      fixed: 'left',
      sorter: true,
      render: (text, record) => (
        <div
        /* style={{
            backgroundImage: `url(${urlsServices.PORTAARQUIVO}/loadArquivo?id=${
              record.arquivo_id
            }&token=${localStorage.getItem('token_sso')})`,
            backgroundSize: 'contain',
            backgroundPosition: 'right',
            backgroundRepeat: 'no-repeat',
          }}*/
        >
          <div style={{ fontWeight: 'bold', color: 'blue' }}>
            {record.pasta}
          </div>

          {record.sei_numero && (
            <div style={{ fontWeight: 'bold' }}>
              SEI N.: {record.sei_numero}
            </div>
          )}

          <div
            title={
              'Upload em: ' +
              record.dta_upload_br +
              ' \n Por: ' +
              record.user_cad
            }
            style={{ fontWeight: 'bold', color: 'blue' }}
          >
            <CloudDownloadOutlined style={{ color: 'blue' }} />
            <span style={{ fontWeight: 'normal', color: 'darkgray' }}>
              {' de: ' + record.dta_upload_br}
            </span>
          </div>

          <div style={{ fontSize: '36px', cursor: 'pointer' }}>
            {record.arquivo_tipo_icon === 'FileImageOutlined' && (
              <FileImageOutlined style={{ color: 'darkorange' }} />
              /* <Image
                width={80}
                src={`${urlsServices.PORTAARQUIVO}loadArquivo?id=${
                  record.arquivo_id
                }&token=${localStorage.getItem('token_sso')}`}
              />*/
            )}
            {record.arquivo_tipo_icon === 'FilePdfOutlined' && (
              <FilePdfOutlined style={{ color: 'darkred' }} />
            )}
            {record.arquivo_tipo_icon === 'FileWordOutlined' && (
              <FileWordOutlined style={{ color: 'darkblue' }} />
            )}
            {record.arquivo_tipo_icon === 'FileExcelOutlined' && (
              <FileExcelOutlined style={{ color: 'darkgreen' }} />
            )}
            {record.arquivo_tipo_icon === 'FileUnknownOutlined' && (
              <FileUnknownOutlined style={{ color: 'darkpurple' }} />
            )}

            <a
              style={{ marginLeft: 10 }}
              onClick={() => AbrirDossieClick(record)}
            >
              <Button
                type="primary"
                style={{
                  backgroundColor: 'darkgray',
                  color: 'darkgreen',
                  fontWeight: 'bold',
                }}
              >
                <CloudDownloadOutlined />
                Ver/Baixar
              </Button>
            </a>
          </div>
        </div>
      ),
    },
    {
      title: 'LEGENDA',
      dataIndex: 'legenda',
      key: 'legenda',
      fixed: 'right',
      width: 400,
      render: (text, record) => (
        <div>
          <div>
            <span
              style={{
                fontWeight: 'bold',
                color: 'darkblue',
              }}
            >
              {record.legenda}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: '',
      key: 'status',
      fixed: 'right',
      width: 50,
      render: (text, record) => (
        <div>
          <div>
            <a
              style={{ fontWeight: 'bold', color: 'red' }}
              onClick={() => ExcluirDossieClick(record)}
            >
              <Button type="primary" style={{ backgroundColor: 'darkorange' }}>
                <DeleteOutlined />
                Excluir
              </Button>
            </a>
          </div>
        </div>
      ),
    },
  ];

  /*
******************************************************************
---------------------AUDITORIA-----------------------------------
******************************************************************
*/

  const [activeTabDossie, setActiveTabDossie] = useState('1');

  const handleTabDossieClick = (key: string) => {
    setActiveTabDossie(key);
  };

  useEffect(() => {
    // Verifica se activeTab é igual a '3' e ServidoresObservatorioTable foi alterado
    if (activeTabDossie === '1') {
      GetOrganograma();
    }
    if (activeTabDossie === '2') {
      DossieLogsAuditoria();
    }
  }, [activeTabDossie]);

  type FuncaoDossie = 'Incluiu' | 'Alterou' | 'Excluiu';

  interface IconMapDossie {
    [key: string]: React.ReactElement;
  }

  const iconMapDossie: IconMapDossie = {
    Incluiu: <PlusCircleOutlined style={{ color: 'green' }} />,
    Alterou: <CheckCircleOutlined style={{ color: 'blue' }} />,
    Excluiu: <CloseCircleOutlined style={{ color: 'red' }} />,
    Abriu: <FolderViewOutlined style={{ color: 'brown' }} />,
  };

  const [ArrayAuditoriasDossie, setArrayAuditoriasDossie] = useState([]);

  const DossieLogsAuditoria = async () => {
    if (form_departamentos.getFieldValue('arquivo_upload_servidor_id') === '') {
      notification.error({
        message: 'Informe o servidor!',
        description:
          'Escolha um servidor para a consulta de Auditória de Dossie.',
      });
    } else {
      onLoadDados('Buscando alterações');

      await ApiServidorPortaArquivos.listAuditoriaDossie(
        form_departamentos.getFieldValue('arquivo_upload_servidor_id'),
      ).then((res: any) => {
        if (res.status === 200) {
          let newretorno: any = [];

          res.data.retorno.forEach((item: any) => {
            const {
              funcao,
              descricao,
              dta_registro_br,
              servidor,
              fun_cad_abreviado,
              descricao_abreviado,
              pasta,
            } = item;
            const color = iconMapDossie[funcao]?.props.style.color || 'black';
            const dot = iconMapDossie[funcao] || (
              <ClockCircleOutlined style={{ fontSize: '16px', color }} />
            );

            newretorno.push({
              dot,
              children: (
                <>
                  <div
                    style={{ fontWeight: 'bold', color }}
                    title={funcao + ' > ' + servidor}
                  >
                    {fun_cad_abreviado}
                  </div>
                  <div title={descricao + ' ' + pasta}>
                    {descricao_abreviado}
                  </div>
                  <div style={{ fontWeight: 'bold' }}>{dta_registro_br}</div>
                </>
              ),
            });
          });

          setArrayAuditoriasDossie(newretorno);

          exitLoadDados();
        } else {
          exitLoadDados();
          notification.error({
            message: 'Erro ao listar Auditorias!',
            description: res.data.message,
          });
        }
      });
    } //id vtr existe
  };
  /*
******************************************************************
---------------------AUDITORIA FIM--------------------------------
******************************************************************
*/

  /******************************************************************
---------------------UPLOAD ARQUIVO FIM-----------------------------
******************************************************************
*/

  const [GruposDadosTodos, setGruposDadosTodos] = useState<DataTypeGrupo[]>([]);

  const [GruposDadosTable, setGruposDadosTable] = useState<DataTypeGrupo[]>([]);

  useEffect(() => {
    GetInicio();
  }, []);

  const GetInicio = async () => {
    onLoadDados('Carregando Dados...');

    const res = await apiDepartamentos.listDepartamentosGeral(
      '',
      '',
      '',
      '',
      '',
      '',
      'HIERARQUIAeCARGOeSERVIDOR',
      '',
      '',
      '',
      '',
    );

    if (res.status === 200) {
      //  console.log(newretornoTree);

      setDepartamentosObservatorioTable(res.data.retorno);

      let xlotacao_id = form_departamentos.getFieldValue('departamento_id_1');
      if (
        form_departamentos.getFieldValue('dep_servidores_modo') === 'HIERARQUIA'
      ) {
        xlotacao_id = form_departamentos.getFieldValue(
          'departamento_hierarquia_1',
        );
      }

      /****************************************SERVIDORES********************************** */

      const resServ = await apiServidorAtribuicao.listServidores(
        '',
        '',
        '',
        form_departamentos.getFieldValue('zdp_opcao_and'),
        form_departamentos.getFieldValue('zdp_opcao_or'),
        '',
        'TODOS_ATIVOS',
        form_departamentos.getFieldValue('servidor_cpf_1'),
        '-',
        xlotacao_id,
        form_departamentos.getFieldValue('departamento_grupo_id_1'),
        '',
        form_departamentos.getFieldValue('zorder'),
        '',
        '',
        '',
        '',
        '',
      );

      if (resServ.status === 200) {
        setServidoresObservatorioTable(resServ.data.retorno);
      }

      /****************************************SERVIDORES FIM********************************** */

      //-------------------------------------------------------------------------------------------------------------GRUPOS
      const responseGrupos = await apiDepartamentos.listGrupos(
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      );
      const GruposDados = responseGrupos.data.retorno;
      setGruposDadosTodos(GruposDados);
      setGruposDadosTable(GruposDados);
    } //houve retorno 200

    exitLoadDados();
  };

  const [linhaSinc, setLinhaSinc] = useState(false);
  const [ModeloRelatorioVisivel, setModeloRelatorioVisivel] =
    useState('SERVIDORES');

  useEffect(() => {
    if (auth?.user?.cpf == '87299372134') {
      setLinhaSinc(true);
    } else {
      setLinhaSinc(false);
    }
    setModeloRelatorioVisivel('SERVIDORES');
  }, []);

  const GetDepartamentosHierarquiaComparacao = async () => {
    onLoadDados('Carregando Dados...');

    /*busca todos departamentos para comparar com organograma impresso e sincronizar*/
    const res = await apiDepartamentos.listDepartamentosComparacaoHierarquia();

    exitLoadDados();
  };

  const GetOrganograma = async () => {
    onLoadDados('Carregando Dados...');

    const res = await apiDepartamentos.listDepartamentosGeral(
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    );

    if (res.status === 200) {
      const data: any[] = res.data.retorno; // Supondo que res.data seja um array de departamentos

      // setDepartamentosObservatorioTable(res.data.retorno);

      let newretornoTree: DataTypeTreeDepartamento[] = [
        {
          //value: '0',
          //key: 0,
          value: '151959',
          key: 151959,
          id: 151959,
          //title: 'POLICIA CIVIL',
          title: 'DELEGACIA-GERAL DA POLÍCIA CIVIL',
          hierarquia: '0.',
          sigla: 'PC',
          municipioid: '',
          municipio: '',
          censo_vinte_tres: 0,
          tipo: '',
          especializacao: '',
          telefone: '',
          telefone2: '',
          telefone3: '',
          endereco: '',
          id_superior_hierarquia: '',
          nome_superior_hierarquia: '',
          superior_sicad: '',
          idsuperior_sicad: '',
          portaria: '',
          departamento_grupo_id: '',
          departamento_grupo: '',
          grupo_descricao: '',
          grupo_cidade: '',
          grupo_cidade_id: '',
          grupo_titular_sicad_id: '',
          grupo_titular: '',
          grupo_titular_celular: '',
          servidores_qtd: 0,
          servidores_agentes: 0,
          servidores_delegados: 0,
          servidores_escrivaes: 0,
          qtd_municipios: 0,
          titular_id: '',
          titular: '',
          titular_celular: '',
          titular_telefone: '',
          titular_email: '',
          titular_interino_id: '',
          titular_interino: '',
          titular_interino_celular: '',
          titular_interino_telefone: '',
          titular_interino_email: '',
          chefe_cartorio_id: '',
          chefe_cartorio: '',
          chefe_cartorio_celular: '',
          chefe_cartorio_telefone: '',
          chefe_cartorio_email: '',
          chefe_cartorio_interino_id: '',
          chefe_cartorio_interino: '',
          chefe_cartorio_interino_celular: '',
          chefe_cartorio_interino_telefone: '',
          chefe_cartorio_interino_email: '',
          escala: '',
          ultima_imagem: '',
          imovel_status: '',
          valor_contrato: '',
          titular_abreviado: '',
          interino_abreviado: '',
          chefe_cartorio_interino_abreviado: '',
          chefe_cartorio_abreviado: '',
          imagens: '',
          status: '',
          status_desc: '',
          //  icon: null,
          filhos: res.data.length,
          children: [],
        },
      ];

      let newretornoDepartamento: any = [];

      // Função para encontrar o nó correspondente ao valor especificado
      const findNode = (
        nodes: DataTypeTreeDepartamento[],
        value: string,
      ): DataTypeTreeDepartamento | undefined => {
        for (const node of nodes) {
          if (node.value === value) return node;
          const found = findNode(node.children || [], value);
          if (found) return found;
        }
        return undefined;
      };

      let xqtd: number = 0;

      // Construir a árvore de departamentos
      for (const item of data) {
        xqtd++;
        newretornoDepartamento.push(item);

        if (item.id_superior_hierarquia === undefined) continue; // Pular se id_superior_hierarquia for undefined

        let currentNode: DataTypeTreeDepartamento | undefined = findNode(
          newretornoTree,
          item.id_superior_hierarquia.toString(),
        );
        if (!currentNode) continue; // Ignorar se não encontrar o nó pai

        if (!currentNode.children) currentNode.children = [];

        let xicon: React.ReactNode;

        // Declarar a variável hasChildren antes de usá-la
        const hasChildren = data.some(
          subItem => subItem.id_superior_hierarquia === item.id,
        );
        const newNode: DataTypeTreeDepartamento = {
          key: item.key,
          id: item.id,
          value: item.value.toString(),
          title: item.title,
          hierarquia: item.hierarquia,
          sigla: item.sigla,
          municipioid: item.municipioid,
          municipio: item.municipio,
          censo_vinte_tres: item.censo_vinte_tres,
          tipo: item.tipo,
          especializacao: item.especializacao,
          telefone: item.telefone,
          telefone2: item.telefone2,
          telefone3: item.telefone3,
          endereco: item.endereco,
          id_superior_hierarquia: item.id_superior_hierarquia,
          nome_superior_hierarquia: item.nome_superior_hierarquia,
          superior_sicad: item.superior_sicad,
          idsuperior_sicad: item.idsuperior_sicad,
          portaria: item.portaria,
          departamento_grupo_id: item.departamento_grupo_id,
          departamento_grupo: item.departamento_grupo,
          grupo_descricao: item.grupo_descricao,
          grupo_cidade: item.grupo_cidade,
          grupo_cidade_id: item.grupo_cidade_id,
          grupo_titular_sicad_id: item.grupo_titular_sicad_id,
          grupo_titular: item.grupo_titular,
          grupo_titular_celular: item.grupo_titular_celular,
          filhos: item.filhos,
          servidores_qtd: item.servidores_qtd,
          servidores_outros: item.servidores_outros,
          servidores_agentes: item.servidores_agentes,
          servidores_delegados: item.servidores_delegados,
          servidores_escrivaes: item.servidores_escrivaes,
          qtd_municipios: item.qtd_municipios,
          titular_id: item.titular_id,
          titular: item.titular,
          titular_celular: item.titular_celular,
          titular_telefone: item.titular_telefone,
          titular_email: item.titular_email,
          titular_interino_id: item.titular_interino_id,
          titular_interino: item.titular_interino,
          titular_interino_celular: item.titular_interino_celular,
          titular_interino_telefone: item.titular_interino_telefone,
          titular_interino_email: item.titular_interino_email,
          chefe_cartorio_id: item.chefe_cartorio_id,
          chefe_cartorio: item.chefe_cartorio,
          chefe_cartorio_celular: item.chefe_cartorio_celular,
          chefe_cartorio_telefone: item.chefe_cartorio_telefone,
          chefe_cartorio_email: item.chefe_cartorio_email,
          chefe_cartorio_interino_id: item.chefe_cartorio_interino_id,
          chefe_cartorio_interino: item.chefe_cartorio_interino,
          chefe_cartorio_interino_celular: item.chefe_cartorio_interino_celular,
          chefe_cartorio_interino_telefone:
            item.chefe_cartorio_interino_telefone,
          chefe_cartorio_interino_email: item.chefe_cartorio_interino_email,
          escala: item.escala,
          imovel_status: item.imovel_status,
          ultima_imagem: item.ultima_imagem,
          valor_contrato: item.valor_contrato,
          titular_abreviado: item.titular_abreviado,
          interino_abreviado: item.interino_abreviado,
          chefe_cartorio_interino_abreviado:
            item.chefe_cartorio_interino_abreviado,
          imagens: item.imagens,
          status: item.status,
          status_desc: item.status_desc,
          chefe_cartorio_abreviado: item.chefe_cartorio_abreviado,
          // icon: xicon,
          children: hasChildren ? [] : undefined, // Adicionar children apenas se houver filhos
        };

        currentNode.children.push(newNode);
      }

      //  console.log(newretornoTree);

      setDepartamentosObservatorioTree(newretornoTree);
    } //houve retorno 200

    exitLoadDados();
  };

  const clearRelatorioModelo = () => {
    form_departamentos.setFieldValue('zrelatorio_colunas', '');
    setSelectedItemsRelatoriosColunasServidores([]);
    setSelectedItemsRelatoriosColunasDepartamentos([]);
  };

  // Este useEffect será acionado sempre que ModeloRelatorioVisivel mudar
  useEffect(() => {
    // Chama a função clearRelatorioModelo sempre que ModeloRelatorioVisivel mudar
    clearRelatorioModelo();
  }, [ModeloRelatorioVisivel]);

  const GetDadosDepartamentos = async () => {
    onLoadDados('Carregando Dados...');

    onCloseDrawerConsulta();

    const res = await apiDepartamentos.listDepartamentosGeral(
      '',
      form_departamentos.getFieldValue('zdp_opcao_and'),
      form_departamentos.getFieldValue('zdp_opcao_or'),
      form_departamentos.getFieldValue('znome_filtro'),
      form_departamentos.getFieldValue('departamento_grupo_id_1'),
      form_departamentos.getFieldValue('departamento_id_1'),
      form_departamentos.getFieldValue('zorder'),
      form_departamentos.getFieldValue('zdeps_ids'),
      form_departamentos.getFieldValue('zfiltros_adcionais'),
      form_departamentos.getFieldValue('cidade_id_2'),
      form_departamentos.getFieldValue('zcons_classificacao'),
    );

    if (res.status === 200) {
      setDepartamentosObservatorioTable(res.data.retorno);
    }

    let xlotacao_id = form_departamentos.getFieldValue('departamento_id_1');
    if (
      form_departamentos.getFieldValue('dep_servidores_modo') === 'HIERARQUIA'
    ) {
      xlotacao_id = form_departamentos.getFieldValue(
        'departamento_hierarquia_1',
      );
    }

    const resServ = await apiServidorAtribuicao.listServidores(
      '',
      '',
      '',
      form_departamentos.getFieldValue('zdp_opcao_and'),
      form_departamentos.getFieldValue('zdp_opcao_or'),
      form_departamentos.getFieldValue('znome_filtro'),
      'TODOS_ATIVOS',
      form_departamentos.getFieldValue('servidor_cpf_1'),
      '-',
      xlotacao_id,
      form_departamentos.getFieldValue('departamento_grupo_id_1'),
      '',
      form_departamentos.getFieldValue('zorder'),
      '',
      form_departamentos.getFieldValue('zcpfs'),
      form_departamentos.getFieldValue('zfiltros_adcionais'),
      form_departamentos.getFieldValue('cidade_id_2'),
      form_departamentos.getFieldValue('zcons_classificacao'),
    );

    if (resServ.status === 200) {
      setServidoresObservatorioTable(resServ.data.retorno);
    }

    //-------------------------------------------------------------------------------------------------------------GRUPOS
    const responseGrupos = await apiDepartamentos.listGrupos(
      form_departamentos.getFieldValue('zdp_opcao_and'),
      form_departamentos.getFieldValue('zdp_opcao_or'),
      form_departamentos.getFieldValue('znome_filtro'),
      form_departamentos.getFieldValue('departamento_grupo_id_1'),
      form_departamentos.getFieldValue('departamento_id_1'),
      form_departamentos.getFieldValue('zdeps_ids'),
      form_departamentos.getFieldValue('zfiltros_adcionais'),
      form_departamentos.getFieldValue('cidade_id_2'),
      form_departamentos.getFieldValue('zcons_classificacao'),
    );
    const GruposDados = responseGrupos.data.retorno;
    setGruposDadosTable(GruposDados);

    exitLoadDados();
  };

  const [progressoVisivel, setProgressoVisivel] = useState(false);
  const [progresso, setProgresso] = useState(0); // Progresso atual da sincronização

  const SincServidores = async () => {
    const shouldDelete = window.confirm(
      'Deseja sincronizar os dados com o SICAD?',
    );
    if (shouldDelete) {
      onLoadDados('Fazendo o sincronismo...');
      const resServ = await apiServidorAtribuicao.listServidores(
        '',
        '',
        '',
        '',
        '',
        '',
        'TODOS_ATIVOS',
        '',
        '-',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      );

      if (resServ.status === 200) {
        setServidoresObservatorioSinc(resServ.data.retorno);
      } else {
        msg_aviso('Erro ao buscar dados do Observatório', 'error');
        exitLoadDados();
      }
    }
  };

  const SincGetServidoresSicad = async () => {
    //console.log('Busca de servidores Observatório CONCLUÍDO');
    //console.log(ServidoresObservatorioSinc);
    const response = await apiServidores.servidoresPCPorFiltrosDiversos();
    if (response.status === 200) {
      setServidoresSicad(response.data);
    } else {
      msg_aviso('Erro ao buscar dados do Sicad', 'error');
      exitLoadDados();
    }
  };

  const SincServidoresTestar = async () => {
    //console.log('Busca de servidores Sicad CONCLUÍDO');
    //console.log(ServidoresSicad);

    // Mapear os servidores do array de referência (ServidoresSicadSinc)
    const servidoresAtualizados: any = ServidoresSicad.map(sicad => {
      // Verificar se o servidor existe no array de observatório
      const matchingObs = ServidoresObservatorioSinc.find(
        obs => obs.cpf === sicad.cpf,
      );

      // Se não existe no Observatório, marcar como NAO_EXISTE_EM_OBSERVATORIO
      if (!matchingObs) {
        if (!sicad.nome.startsWith('ALUNO')) {
          //console.log(sicad.nome + ' NÃO EXISTE??? ' + sicad.cpf);
          return {
            ...sicad,
            acao: 'NAO_EXISTE_EM_OBSERVATORIO',
            sicadId: sicad.id,
          };
        }
      } else {
        // Se existe, verificar se houve mudança de lotação
        if (
          sicad.lotacaoId !== undefined &&
          matchingObs.lotacao_id !== undefined &&
          sicad.lotacaoId !== matchingObs.lotacao_id
        ) {
          console.log(
            sicad.nome +
              ' Sicad_id: ' +
              '<' +
              sicad.lotacaoId +
              '>' +
              '!== Observatorio id: ' +
              '<' +
              matchingObs.lotacao_id +
              '>',
          );
          return {
            ...sicad,
            acao: 'MUDOU_LOTACAO',
            lotacao_anterior: matchingObs.lotacao,
            lotacao_anterior_id: matchingObs.lotacao_id,
            sicadId: sicad.id,
          };
        }
      }

      // Não houve mudança
      return null;
    }).filter(servidor => servidor !== null);

    // Atualizar o estado do array ServidoresSicadSinc com os servidores atualizados
    setServidoresSicadSinc(servidoresAtualizados);
  };

  const SincServidoresExecutar = async () => {
    //console.log('atualizar dados encontrados');

    //console.log(ServidoresSicadSinc);
    setProgressoVisivel(true); // Mostrar o componente de progresso
    setProgresso(0); // Reiniciar o progresso

    const totalServidores = ServidoresSicadSinc.length;
    let servidoresSincronizados = 0;

    for (const servidor of ServidoresSicadSinc) {
      const {
        acao,
        sicadId,
        nome,
        cpf,
        funcao,
        dtNascimento,
        postoGrad,
        postoSiglaGrad,
        lotacaoId,
        lotacao,
        dtInicioLotacao,
        lotacaoSigla,
        municipioIdLotacao,
        municipioLotacao,
        status,
        situacao,
        sexo,
        dtPosse,
        servidorExterno,
        telefone,
        celular,
        email,
        matriculaFuncional,
        lotacao_anterior,
        lotacao_anterior_id,
      } = servidor;

      const resServSinc =
        await apiServidorAtribuicao.sincServidoresSicadObservatorio(
          acao,
          sicadId,
          nome,
          cpf,
          funcao,
          dtNascimento,
          postoGrad,
          postoSiglaGrad,
          lotacaoId,
          lotacao,
          dtInicioLotacao,
          lotacaoSigla,
          municipioIdLotacao,
          municipioLotacao,
          status,
          situacao,
          sexo,
          dtPosse,
          matriculaFuncional,
          lotacao_anterior,
          lotacao_anterior_id,
          auth?.user?.nome || '',
          auth?.user?.id.toString() || '',
        );

      if (resServSinc.status === 200) {
        if (resServSinc.data.resultado === 'OK') {
          msg_aviso(resServSinc.data.message, 'success');
        } else {
          msg_aviso(resServSinc.data.message, 'warning');
        }
      } else {
        msg_aviso('Erro ao tentar sincronizar', 'error');
      }

      servidoresSincronizados++;
      const progressoAtual = Math.floor(
        (servidoresSincronizados / totalServidores) * 100,
      );
      setProgresso(progressoAtual);

      // Simule um pequeno atraso para ver o progresso em ação (remova em produção)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setProgressoVisivel(false);

    form_departamentos.setFieldValue('zdp_opcao_and', '');
    form_departamentos.setFieldValue('zdp_opcao_or', '');
    form_departamentos.setFieldValue('znome_filtro', '');
    form_departamentos.setFieldValue('departamento_grupo_id_1', '');
    form_departamentos.setFieldValue('departamento_grupo_1', '');
    form_departamentos.setFieldValue('departamento_id_1', '');
    form_departamentos.setFieldValue('departamento_hierarquia_1', '');
    form_departamentos.setFieldValue('departamento_1', '');
    form_departamentos.setFieldValue('servidor_id_1', '');
    form_departamentos.setFieldValue('servidor_1', '');
    form_departamentos.setFieldValue('zfiltros_adcionais', '');
    form_departamentos.setFieldValue('zdeps_ids', '');
    form_departamentos.setFieldValue('zcpfs', '');
    form_departamentos.setFieldValue('zorder', 'HIERARQUIAeCARGOeSERVIDOR');
    form_departamentos.setFieldValue(
      'zcpfs',
      ServidoresSicadSinc.map(servidor => servidor.cpf).join(', '),
    );
    form_departamentos.setFieldValue(
      'zdeps_ids',
      ServidoresSicadSinc.map(servidor => servidor.lotacaoId).join(', '),
    );

    GetDadosDepartamentos();
    exitLoadDados();

    onLoadDados('Agora Vamos Verificar desligamento de servidores...');

    const resServ = await apiServidorAtribuicao.listServidores(
      '',
      '',
      '',
      '',
      '',
      '',
      'TODOS_ATIVOS',
      '',
      '-',
      '',
      '',
      'GERAL',
      '',
      '',
      '',
      '',
      '',
      '',
    );

    if (resServ.status === 200) {
      setServidoresObservatorioSincTestAtivos(resServ.data.retorno);
    } else {
      msg_aviso('Erro ao buscar dados do Observatório', 'error');
      exitLoadDados();
    }
  };

  const [
    ServidoresObservatorioSincTestAtivos,
    setServidoresObservatorioSincTestAtivos,
  ] = useState<DataTypeServidores[]>([]);

  useEffect(() => {
    form_departamentos.setFieldValue('zcpfs', '');
    form_departamentos.setFieldValue('zdeps_ids', '');
    if (ServidoresObservatorioSincTestAtivos.length > 0) {
      SincServidoresTestarAtivos();
    }
  }, [ServidoresObservatorioSincTestAtivos]);

  const SincServidoresTestarAtivos = async () => {
    //console.log('Busca de servidores Sicad CONCLUÍDO');
    //console.log(ServidoresSicad);

    // Mapear os servidores do array de referência (ServidoresSicadSinc)
    const servidoresAtualizados: any = ServidoresObservatorioSincTestAtivos.map(
      observatorioAtivo => {
        // Verificar se o servidor existe no array de observatório
        const matchingSicad = ServidoresSicad.find(
          sicad => sicad.cpf === observatorioAtivo.cpf,
        );

        // Se não existe no Observatório, marcar como NAO_EXISTE_EM_OBSERVATORIO
        if (!matchingSicad) {
          console.log(
            observatorioAtivo.nome + ' NÃO EXISTE??? ' + observatorioAtivo.cpf,
          );
          return {
            ...observatorioAtivo,
            acao: 'EXCLUIR_EM_OBSERVATORIO',
          };
        }
        // Não houve mudança
        return null;
      },
    ).filter(servidor => servidor !== null);

    // Atualizar o estado do array ServidoresSicadSinc com os servidores atualizados
    setServidoresInativarPorCPF(servidoresAtualizados);
  };

  const [ServidoresInativarPorCPF, setServidoresInativarPorCPF] = useState<
    DataTypeServidoresSicadSinc[]
  >([]);

  useEffect(() => {
    if (ServidoresInativarPorCPF.length > 0) {
      SincServidoresInativarExecutar();
    } else {
      msg_aviso('Nenhuma modificação encontrada no SICAD', 'warning');
      exitLoadDados();
    }
  }, [ServidoresInativarPorCPF]);

  const SincServidoresInativarExecutar = async () => {
    //console.log('atualizar dados encontrados');

    console.log(ServidoresInativarPorCPF);
    setProgressoVisivel(true); // Mostrar o componente de progresso
    setProgresso(0); // Reiniciar o progresso

    const totalServidores = ServidoresInativarPorCPF.length;
    let servidoresSincronizados = 0;

    for (const servidor of ServidoresInativarPorCPF) {
      const {
        acao,
        sicadId,
        nome,
        cpf,
        funcao,
        dtNascimento,
        postoGrad,
        postoSiglaGrad,
        lotacaoId,
        lotacao,
        dtInicioLotacao,
        lotacaoSigla,
        municipioIdLotacao,
        municipioLotacao,
        status,
        situacao,
        sexo,
        dtPosse,
        servidorExterno,
        telefone,
        celular,
        email,
        matriculaFuncional,
        lotacao_anterior,
        lotacao_anterior_id,
      } = servidor;

      const resServSinc =
        await apiServidorAtribuicao.sincServidoresSicadObservatorio(
          acao,
          sicadId,
          nome,
          cpf,
          funcao,
          dtNascimento,
          postoGrad,
          postoSiglaGrad,
          lotacaoId,
          lotacao,
          dtInicioLotacao,
          lotacaoSigla,
          municipioIdLotacao,
          municipioLotacao,
          status,
          situacao,
          sexo,
          dtPosse,
          matriculaFuncional,
          lotacao_anterior,
          lotacao_anterior_id,
          auth?.user?.nome || '',
          auth?.user?.id.toString() || '',
        );

      if (resServSinc.status === 200) {
        if (resServSinc.data.resultado === 'OK') {
          msg_aviso(resServSinc.data.message, 'success');
        } else {
          msg_aviso(resServSinc.data.message, 'warning');
        }
      } else {
        msg_aviso('Erro ao tentar sincronizar', 'error');
      }

      servidoresSincronizados++;
      const progressoAtual = Math.floor(
        (servidoresSincronizados / totalServidores) * 100,
      );
      setProgresso(progressoAtual);

      // Simule um pequeno atraso para ver o progresso em ação (remova em produção)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setProgressoVisivel(false);
    exitLoadDados();
  };

  /*-------------------------------BUSCA DE SERVIDORES NOVOS SICAD FIM------------------------------------ */

  /*
        //-------------------------------BUSCA DE SERVIDORES NOVOS SICAD------------------------------------
        // Filtrar os registros do ServidoresDadosSicad que não estão no ServidoresDadosObservatorio
        const ServidoresSicadNovos = ServidoresDadosSicad.filter(
          (sicad: DataTypeServidoresSicad) =>
            !ServidoresDadosObservatorio.find(
              (obs: DataTypeServidores) => obs.sicad_id === sicad.id,
            ),
        );
        console.log('SERVIDORS NOVOS SICAD');
        console.log(ServidoresSicadNovos);
        //-------------------------------BUSCA DE SERVIDORES NOVOS SICAD FIM------------------------------------

        //-------------------------------BUSCA DE SERVIDORES QUE MUDARAM DE LOTAÇÃO-----------------------------

        // Filtrar os registros do ServidoresDadosSicad
        const ServidoresSicadFiltrados = ServidoresDadosSicad.filter(
          (sicad: DataTypeServidoresSicad) => {
            // Encontrar o registro correspondente em ServidoresDadosObservatorio
            const obs = ServidoresDadosObservatorio.find(
              (item: DataTypeServidores) => item.sicad_id === sicad.id,
            );

            // Verificar se o registro foi encontrado e se as lotações são diferentes
            return obs && sicad.lotacaoId !== obs.lotacao_id;
          },
        );

        console.log('SERVIDORS QUE MUDARAM LOTAÇÃO');
        console.log(ServidoresSicadFiltrados);
        //-------------------------------BUSCA DE SERVIDORES NOVOS SICAD FIM------------------------------------
        */

  /**************************************************************************
   * **********************************IMPORTAÇÃO POR XLS**********************
   * ************************************************************************/
  const [arquivoXlsSicad, setArquivoXlsSicad] = useState('');

  const [ExibeCarregarXLS, setExibeCarregarXLS] = useState(false);

  /*useEffect(() => {
    console.log('Aqui');
    if (arquivoXlsSicad !== null) {
      if (arquivoXlsSicad !== '') {
        setExibeCarregarXLS(true);
      }
    }
  }, [arquivoXlsSicad]);*/

  const handleFileXlsSicad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //onLoadDados('Preparando o arquivo de Mapa, aguarde...');

    const file = e.target.files?.[0];

    if (file) {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      // Adicione a tipagem para a variável jsonData
      const jsonData: Array<Array<string | number>> = XLSX.utils.sheet_to_json(
        worksheet,
        {
          header: 1,
          defval: '',
        },
      );

      // Filtra apenas as linhas onde a primeira coluna é um número
      /*const filteredData = jsonData.filter(
        (row): row is Array<number> =>
          typeof row[0] === 'number' && !isNaN(row[0]),
      );

      setArquivoAbastecimento(JSON.stringify(filteredData));*/

      setArquivoXlsSicad(JSON.stringify(jsonData));

      setExibeCarregarXLS(true);
      //console.log('aqui');

      // Exibe os dados filtrados no console
      //console.log("Parsed JSON:", filteredData);
    }

    exitLoadDados();
  };

  const sincDadosMapa = async () => {
    //onLoadDados('Carregando XLS SICAD, aguarde...');

    if (arquivoXlsSicad !== null) {
      if (arquivoXlsSicad !== '') {
        let values: any = {};
        let fieldsValue: any = {};
        fieldsValue.importador_id = auth?.user?.id;
        fieldsValue.importador = auth?.user?.nome;

        let xarquivo = form_departamentos.getFieldValue('arquivo_xls_sicad');

        // Verifica se xarquivo está no formato esperado
        if (xarquivo && xarquivo.includes('C:\\fakepath\\')) {
          // Divide a string com base no caractere de barra invertida (\)
          const partes = xarquivo.split('\\');
          // Pega a última parte, que é o nome do arquivo
          xarquivo = partes[partes.length - 1];
        }
        fieldsValue.arquivo_name = xarquivo;

        values.arquivo = arquivoXlsSicad;

        await apiServidorAtribuicao
          .sincServidoresSicadObservatorioXLS(values, fieldsValue)
          .then((res: any) => {
            notification.info({
              message: 'Alerta do servidor!',
              description: res.data.message,
            });
            form_departamentos.setFieldValue('arquivo_xls_sicad', '');
            setExibeCarregarXLS(false);
            //sincAbastecimentoSicad();
            //setPatrimonios([]);
          });

        setArquivoXlsSicad('');

        exitLoadDados();
      }
    }
  };
  /**************************************************************************
   * **********************************IMPORTAÇÃO POR XLS FIM*****************
   * ************************************************************************/

  /**************************************************************************
   * **********************************FILTROS CONSULTA**********************
   * ************************************************************************/
  ////////////////////////////////////////////////////////////////////////////FILTROS PRÉ ESTABELECIDOS COMBO
  const OptionsFiltroPre = [
    'P. Mulher',
    'Menor Infrator',
    'P. Menor',
    'P. Idoso',
    'P. Deficiente',
    'P. Racial',
    'Homicídios',
    'Inv. Crim.',
    'Trânsito',
    'Drogas',
    'Patrimoniais',
    'Inteligência',
    'Identificação',
    'Necropapiloscopia',
    'Regionais',
    'Unidade Adm.',
    'Operacionais',
    'Organizacionais',
    'Plantão',
    'Expediente',
    'Sem Del.',
    'Sem Esc.',
    'Sem Age.',
    'Masculino',
    'Feminino',
    'PNE',
    'Chefe Titular',
    'Chefe Interino',
    'Estágio Probatório',
    'Sub Júdice',
    'Com Punição',
    'Especial',
    '1ª Classe',
    '2ª Classe',
    '3ª Classe',
    'Substituto',
    'Assessor A9',
    'Assessor A8',
    'Assessor A7',
    'Assessor A6',
    'Assessor A5',
    'Assessor A4',
    'Assessor A3',
    'Assessor A2',
    'Assessor A1',
    'ADM SGI',
    'ADM GERAL',
    'Restrição Arma',
    'Restrição Médica',
    'Restrição Judicial',
    'Lotação Externa',
    'Lotação Executivo',
    'Lotação Legislativo',
    'Lotação Judiciário',
    'Lotação Executivo Municipal',
    'Lotação Executivo Estadual',
    'Lotação Executivo Federal',
    'Lotação Legislativo Municipal',
    'Lotação Legislativo Estadual',
    'Lotação Legislativo Federal',
    'Deps. Desativados',
    'Não Biometrico(Provisório)',
  ];

  const [selectedItemsFiltroPre, setSelectedItemsFiltroPre] = useState<
    string[]
  >([]);

  const filteredOptions = OptionsFiltroPre.filter(
    o => !selectedItemsFiltroPre.includes(o),
  );

  const customLabelFiltro = (value: any) => {
    switch (value) {
      /*
      case 'Com Del.':
        return (
          <span style={{ color: 'black', fontWeight: 'bold' }}>
            <BankOutlined
              style={{ color: 'darkgray', marginRight: 10 }}
              title="Filtra apenas dados de departamento"
            />
            {value}
          </span>
        );
      case 'Sem Del.':
        return (
          <span style={{ color: 'black', fontWeight: 'bold' }}>
            <BankOutlined
              style={{ color: 'darkgray', marginRight: 10 }}
              title="Filtra apenas dados de departamento"
            />
            {value}
          </span>
        );
      case 'Com Esc.':
        return (
          <span style={{ color: 'black', fontWeight: 'bold' }}>
            <BankOutlined
              style={{ color: 'darkgray', marginRight: 10 }}
              title="Filtra apenas dados de departamento"
            />
            {value}
          </span>
        );
      case 'Sem Esc.':
        return (
          <span style={{ color: 'black', fontWeight: 'bold' }}>
            <BankOutlined
              style={{ color: 'darkgray', marginRight: 10 }}
              title="Filtra apenas dados de departamento"
            />
            {value}
          </span>
        );
      case 'Com Age.':
        return (
          <span style={{ color: 'black', fontWeight: 'bold' }}>
            <BankOutlined
              style={{ color: 'darkgray', marginRight: 10 }}
              title="Filtra apenas dados de departamento"
            />
            {value}
          </span>
        );
      case 'Sem Age.':
        return (
          <span style={{ color: 'black', fontWeight: 'bold' }}>
            <BankOutlined
              style={{ color: 'darkgray', marginRight: 10 }}
              title="Filtra apenas dados de departamento"
            />
            {value}
          </span>
        );
      */
      /*  case 'Interino':
        return (
          <span style={{ color: 'black', fontWeight: 'bold' }}>
            <BankOutlined
              style={{ color: 'darkgray', marginRight: 10 }}
              title="Filtra apenas dados de departamento"
            />
            {value}
          </span>
        );

      case 'Policial':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <TeamOutlined
              style={{ color: 'darkgreen', marginRight: 10 }}
              title="Filtra dados de servidor"
            />
            {value}
          </span>
        );

      case 'Delegado':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <TeamOutlined
              style={{ color: 'darkgreen', marginRight: 10 }}
              title="Filtra dados de servidor"
            />
            {value}
          </span>
        );

      case 'Escrivão':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <TeamOutlined
              style={{ color: 'darkgreen', marginRight: 10 }}
              title="Filtra dados de servidor"
            />
            {value}
          </span>
        );

      case 'Agente':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <TeamOutlined
              style={{ color: 'darkgreen', marginRight: 10 }}
              title="Filtra dados de servidor"
            />
            {value}
          </span>
        );

      case 'Papiloscopista':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <TeamOutlined
              style={{ color: 'darkgreen', marginRight: 10 }}
              title="Filtra dados de servidor"
            />
            {value}
          </span>
        );

      case 'Administrativo':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <TeamOutlined
              style={{ color: 'darkgreen', marginRight: 10 }}
              title="Filtra dados de servidor"
            />
            {value}
          </span>
        );

      case 'Especial':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <TeamOutlined
              style={{ color: 'darkgreen', marginRight: 10 }}
              title="Filtra dados de servidor"
            />
            {value}
          </span>
        );

      case '1ª Classe':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <TeamOutlined
              style={{ color: 'darkgreen', marginRight: 10 }}
              title="Filtra dados de servidor"
            />
            {value}
          </span>
        );

      case '2ª Classe':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <TeamOutlined
              style={{ color: 'darkgreen', marginRight: 10 }}
              title="Filtra dados de servidor"
            />
            {value}
          </span>
        );

      case '3ª Classe':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <TeamOutlined
              style={{ color: 'darkgreen', marginRight: 10 }}
              title="Filtra dados de servidor"
            />
            {value}
          </span>
        );

      case 'ADM SGI':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <TeamOutlined
              style={{ color: 'darkgreen', marginRight: 10 }}
              title="Filtra dados de servidor"
            />
            {value}
          </span>
        );
*/
      case 'Não Biometrico(Provisório)':
        return (
          <span style={{ color: 'brown', fontWeight: 'bold' }}>
            <ClockCircleOutlined
              style={{ color: 'brown', marginRight: 10 }}
              title="Lista de servidores que não estão no Goiás Biométrico em 09/07/2024 - Provisório"
            />
            {value}
          </span>
        );
      default:
        return (
          <span
            style={{ color: 'darkblue', fontWeight: 'bold' }}
            title="Filtra departamentos e servidores"
          >
            {value}
          </span>
        );
    }
  };

  /**************************************************************************
   * **********************************TABS**********************
   * ************************************************************************/
  const [ActiveTabServidorModal, setActiveTabServidorModal] = useState('1');

  const handleTabServidorModalClick = (key: string) => {
    setActiveTabServidorModal(key);
  };

  const [activeTab, setActiveTab] = useState('1');

  const handleTabClick = (key: string) => {
    setActiveTab(key);
  };

  useEffect(() => {
    // Verifica se activeTab é igual a '3' e ServidoresObservatorioTable foi alterado
    if (activeTab === '4') {
      GetOrganograma();
    }
  }, [activeTab]);

  const [activeTabServidores, setActiveTabServidores] = useState('1');

  const handleTabServidoresClick = (key: string) => {
    setActiveTabServidores(key);
  };

  useEffect(() => {
    // Verifica se activeTab é igual a '3' e ServidoresObservatorioTable foi alterado
    if (activeTabServidores === '2' && ServidoresObservatorioTable.length > 0) {
      GraficoServidorClassificacao(); // Chama a função GraficoServidorCargo()
    }
    if (activeTabServidores === '3' && ServidoresObservatorioTable.length > 0) {
      GraficoServidorCargo(); // Chama a função GraficoServidorCargo()
    }
    if (activeTabServidores === '4' && ServidoresObservatorioTable.length > 0) {
      GraficoServidorClasse(); // Chama a função GraficoServidorCargo()
    }
    if (activeTabServidores === '5' && ServidoresObservatorioTable.length > 0) {
      GraficoServidorSexo(); // Chama a função GraficoServidorCargo()
    }
    if (activeTabServidores === '6' && ServidoresObservatorioTable.length > 0) {
      GraficoServidorIdade(); // Chama a função GraficoServidorCargo()
    }
    if (activeTabServidores === '7' && ServidoresObservatorioTable.length > 0) {
      GraficoServidorPosse(); // Chama a função GraficoServidorCargo()
    }
  }, [activeTabServidores, ServidoresObservatorioTable]); // Executa o efeito sempre que activeTab ou ServidoresObservatorioTable mudar

  ///////////////////////////////////////////////////////////////////////////TRIAGEM AUDITORIAS

  type Funcao = 'Incluiu' | 'Alterou' | 'Excluiu';

  interface IconMap {
    [key: string]: React.ReactElement;
  }

  const iconMap: IconMap = {
    Incluiu: <PlusCircleOutlined style={{ color: 'green' }} />,
    Alterou: <CheckCircleOutlined style={{ color: 'blue' }} />,
    Excluiu: <CloseCircleOutlined style={{ color: 'red' }} />,
  };

  const [DrawerAuditoriaTitulo, setDrawerAuditoriaTitulo] = useState('');
  const [ArrayAuditorias, setArrayAuditorias] = useState([]);

  const GetAuditoria = async (xdep: string) => {
    // ...

    onLoadDados('Averiguando as alterações realizadas...');

    if (xdep === 'DEPARTAMENTO') {
      setDrawerAuditoriaTitulo('Auditória de Departamento');

      if (form_departamentos.getFieldValue('departamento_id_1') === '') {
        exitLoadDados();
        notification.error({
          message: 'Informe o departamento!',
          description: 'Escolha um departamento para a consulta de Auditória.',
        });
      } else {
        showDrawerAuditoria();

        let xdtai = '';
        let xdtaf = '';
        const selectedDateRange = form_departamentos.getFieldValue(
          'zcons_data_auditoria',
        );
        if (selectedDateRange && selectedDateRange.length === 2) {
          const [dataInicial, dataFinal] = selectedDateRange;
          xdtai = dataInicial.format('MM/DD/YYYY');
          xdtaf = dataFinal.format('MM/DD/YYYY');
          //console.log('Data Final:', dataFinal.format('MM/DD/YYYY'));
        }

        await apiDepartamentos
          .listAuditoriaDepartamento(
            form_departamentos.getFieldValue('departamento_id_1'),
            xdtai,
            xdtaf,
          )
          .then((res: any) => {
            if (res.status === 200) {
              let newretorno: any = [];

              res.data.retorno.forEach((item: any) => {
                const {
                  funcao,
                  descricao,
                  dta_registro_br,
                  fun_cad,
                  fun_cad_abreviado,
                  descricao_abreviado,
                } = item;
                const color = iconMap[funcao]?.props.style.color || 'black';
                const dot = iconMap[funcao] || (
                  <ClockCircleOutlined style={{ fontSize: '16px', color }} />
                );

                newretorno.push({
                  dot,
                  children: (
                    <>
                      <div
                        style={{ fontWeight: 'bold', color }}
                        title={fun_cad}
                      >
                        {fun_cad_abreviado}
                      </div>
                      <div title={descricao}>{descricao_abreviado}</div>
                      <div style={{ fontWeight: 'bold' }}>
                        {dta_registro_br}
                      </div>
                    </>
                  ),
                });
              });

              setArrayAuditorias(newretorno);
            } else {
              exitLoadDados();
              notification.error({
                message: 'Erro ao listar Auditorias!',
                description: res.data.message,
              });
            }
          });
      }
    }

    if (xdep === 'SERVIDOR') {
      setDrawerAuditoriaTitulo('Auditória de Servidor');

      if (form_departamentos.getFieldValue('servidor_id_1') === '') {
        exitLoadDados();
        notification.error({
          message: 'Informe o servidor!',
          description: 'Escolha um servidor para a consulta de Auditória.',
        });
      } else {
        showDrawerAuditoria();

        let xdtai = '';
        let xdtaf = '';
        const selectedDateRange = form_departamentos.getFieldValue(
          'zcons_data_auditoria',
        );
        if (selectedDateRange && selectedDateRange.length === 2) {
          const [dataInicial, dataFinal] = selectedDateRange;
          xdtai = dataInicial.format('MM/DD/YYYY');
          xdtaf = dataFinal.format('MM/DD/YYYY');
          //console.log('Data Final:', dataFinal.format('MM/DD/YYYY'));
        }

        await apiServidorAtribuicao
          .listAuditoriaServidor(
            form_departamentos.getFieldValue('servidor_id_1'),
            xdtai,
            xdtaf,
          )
          .then((res: any) => {
            if (res.status === 200) {
              let newretorno: any = [];

              res.data.retorno.forEach((item: any) => {
                const {
                  funcao,
                  descricao,
                  dta_registro_br,
                  fun_cad,
                  fun_cad_abreviado,
                  descricao_abreviado,
                } = item;
                const color = iconMap[funcao]?.props.style.color || 'black';
                const dot = iconMap[funcao] || (
                  <ClockCircleOutlined style={{ fontSize: '16px', color }} />
                );

                newretorno.push({
                  dot,
                  children: (
                    <>
                      <div
                        style={{ fontWeight: 'bold', color }}
                        title={fun_cad}
                      >
                        {fun_cad_abreviado}
                      </div>
                      <div title={descricao}>{descricao_abreviado}</div>
                      <div style={{ fontWeight: 'bold' }}>
                        {dta_registro_br}
                      </div>
                    </>
                  ),
                });
              });

              setArrayAuditorias(newretorno);
            } else {
              exitLoadDados();
              notification.error({
                message: 'Erro ao listar Auditorias!',
                description: res.data.message,
              });
            }
          });
      }
    }

    exitLoadDados();
  };

  /**************************************************************************
   * **********************************GRAFICOS**********************
   * ************************************************************************/
  let FuncaoDados: { label: string; qtd: number }[] = [];
  let ClasseDados: { label: string; qtd: number }[] = [];
  let SexoDados: { label: string; qtd: number }[] = [];
  let IdadeDados: { label: string; qtd: number }[] = [];
  let PosseDados: { label: string; qtd: number }[] = [];
  let ClassificacaoDados: { label: string; qtd: number }[] = [];

  //////////////////////////////////////////////////////////////////////////CARGO
  const [servidoresFuncao, setServidoresFuncao] =
    useState<ChartOptionsBarHorizontal>({
      series: [],
      options: {
        chart: {
          type: 'bar',
        },
        title: {
          text: 'Servidores por Cargo - Sicad',
          align: 'center',
          margin: 10,
          floating: false,
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#263238',
          },
        },
        plotOptions: {
          bar: {
            barHeight: '100%',
            distributed: true,
            horizontal: true,
            dataLabels: {
              position: 'bottom',
            },
          },
        },
        dataLabels: {
          enabled: true,
          textAnchor: 'start',
          style: {
            colors: ['#000'],
          },
          formatter: function (val: any, opt: any) {
            return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val;
          },
          offsetX: 0,
          dropShadow: {
            enabled: true,
            color: '#fff',
          },
        },
        legend: {
          show: false,
        },
        tooltip: {
          x: {
            show: true,
          },
          y: {
            title: {
              formatter: function (val: any) {
                return val + '';
              },
            },
          },
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              fontSize: '12px',
            },
            show: false,
          },
        },
        yaxis: {
          labels: {
            show: false,
          },
        },
      },
    });

  function GraficoServidorCargo() {
    //alert('oi');

    const contagemFuncao: Record<string, number> = {};
    const servidorMap: { value: string; label: string }[] = [];

    //console.log(ServidoresObservatorioTable);

    ServidoresObservatorioTable.forEach(
      (servidorArray: { funcao: string; nome: string }) => {
        let funcaoServ = servidorArray.funcao || 'Sem Função';

        if (!contagemFuncao[funcaoServ]) {
          contagemFuncao[funcaoServ] = 1;
          //console.log('Função BD/Cargo: ' + funcaoServ);
          servidorMap.push({ value: funcaoServ, label: funcaoServ });
        } else {
          contagemFuncao[funcaoServ]++;
        }
      },
    );

    //console.log(contagemFuncao);

    FuncaoDados = Object.entries(contagemFuncao).map(([label, qtd]) => ({
      label,
      qtd,
    }));

    //console.log(FuncaoDados);

    // Mapeie os dados para obter series.data e xaxis.categories
    const seriesData = FuncaoDados.map(item => item.qtd);
    const categories = FuncaoDados.map(item => item.label);
    const hint = FuncaoDados.map(item => item.label);

    // Atualize o estado com os novos dados
    setServidoresFuncao({
      series: [
        {
          name: 'teste',
          group: [],
          data: seriesData,
        },
      ],
      options: {
        ...servidoresFuncao.options,
        tooltip: {
          x: {
            show: true,
          },
          y: {
            title: {
              formatter: function (
                val: any,
                {
                  seriesIndex,
                  dataPointIndex,
                }: { seriesIndex: number; dataPointIndex: number },
              ) {
                // Use a variável 'hint' para exibir o conteúdo no tooltip
                return hint[dataPointIndex];
              },
            },
          },
          fixed: {
            enabled: true,
            position: 'topLeft',
            offsetX: 0,
            offsetY: 0,
          },
          style: {
            fontSize: '10px',
            maxWidth: '200px',
          },
        },
        xaxis: {
          categories: categories,
          labels: {
            style: {
              fontSize: '12px',
            },
            show: false,
          },
        },
        yaxis: {
          labels: {
            show: false,
          },
        },
      },
    });
  }

  //////////////////////////////////////////////////////////////////////////CARGO
  const [servidoresClassificacao, setServidoresClassificacao] =
    useState<ChartOptionsBarHorizontal>({
      series: [],
      options: {
        chart: {
          type: 'bar',
        },
        title: {
          text: 'Servidores por Classificação - SAAP',
          align: 'center',
          margin: 10,
          floating: false,
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#263238',
          },
        },
        plotOptions: {
          bar: {
            barHeight: '100%',
            distributed: true,
            horizontal: true,
            dataLabels: {
              position: 'bottom',
            },
          },
        },
        dataLabels: {
          enabled: true,
          textAnchor: 'start',
          style: {
            colors: ['#000'],
          },
          formatter: function (val: any, opt: any) {
            return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val;
          },
          offsetX: 0,
          dropShadow: {
            enabled: true,
            color: '#fff',
          },
        },
        legend: {
          show: false,
        },
        tooltip: {
          x: {
            show: true,
          },
          y: {
            title: {
              formatter: function (val: any) {
                return val + '';
              },
            },
          },
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              fontSize: '12px',
            },
            show: false,
          },
        },
        yaxis: {
          labels: {
            show: false,
          },
        },
      },
    });

  function GraficoServidorClassificacao() {
    //alert('oi');

    const contagemClassificacao: Record<string, number> = {};
    const servidorMap: { value: string; label: string }[] = [];

    //console.log(ServidoresObservatorioTable);

    ServidoresObservatorioTable.forEach(
      (servidorArray: { classificacao_desc: string; nome: string }) => {
        let funcaoServ =
          servidorArray.classificacao_desc || 'Sem Classificação';

        if (!contagemClassificacao[funcaoServ]) {
          contagemClassificacao[funcaoServ] = 1;
          //console.log('Função BD/Cargo: ' + funcaoServ);
          servidorMap.push({ value: funcaoServ, label: funcaoServ });
        } else {
          contagemClassificacao[funcaoServ]++;
        }
      },
    );

    //console.log(contagemClassificacao);

    ClassificacaoDados = Object.entries(contagemClassificacao).map(
      ([label, qtd]) => ({
        label,
        qtd,
      }),
    );

    //console.log(ClassificacaoDados);

    // Mapeie os dados para obter series.data e xaxis.categories
    const seriesData = ClassificacaoDados.map(item => item.qtd);
    const categories = ClassificacaoDados.map(item => item.label);
    const hint = ClassificacaoDados.map(item => item.label);

    // Atualize o estado com os novos dados
    setServidoresClassificacao({
      series: [
        {
          name: 'teste',
          group: [],
          data: seriesData,
        },
      ],
      options: {
        ...servidoresClassificacao.options,
        tooltip: {
          x: {
            show: true,
          },
          y: {
            title: {
              formatter: function (
                val: any,
                {
                  seriesIndex,
                  dataPointIndex,
                }: { seriesIndex: number; dataPointIndex: number },
              ) {
                // Use a variável 'hint' para exibir o conteúdo no tooltip
                return hint[dataPointIndex];
              },
            },
          },
          fixed: {
            enabled: true,
            position: 'topLeft',
            offsetX: 0,
            offsetY: 0,
          },
          style: {
            fontSize: '10px',
            maxWidth: '200px',
          },
        },
        xaxis: {
          categories: categories,
          labels: {
            style: {
              fontSize: '12px',
            },
            show: false,
          },
        },
        yaxis: {
          labels: {
            show: false,
          },
        },
      },
    });
  }

  //////////////////////////////////////////////////////////////////////////CLASSIFICAÇÃO
  const [servidoresClasse, setServidoresClasse] =
    useState<ChartOptionsBarHorizontal>({
      series: [],
      options: {
        chart: {
          type: 'bar',
        },
        title: {
          text: 'Servidores por Classe - Sicad',
          align: 'center',
          margin: 10,
          floating: false,
          style: {
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#263238',
          },
        },
        plotOptions: {
          bar: {
            barHeight: '100%',
            distributed: true,
            horizontal: true,
            dataLabels: {
              position: 'bottom',
            },
          },
        },
        dataLabels: {
          enabled: true,
          textAnchor: 'start',
          style: {
            colors: ['#000'],
          },
          formatter: function (val: any, opt: any) {
            return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val;
          },
          offsetX: 0,
          dropShadow: {
            enabled: true,
            color: '#fff',
          },
        },
        legend: {
          show: false,
        },
        tooltip: {
          x: {
            show: true,
          },
          y: {
            title: {
              formatter: function (val: any) {
                return val + '';
              },
            },
          },
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              fontSize: '12px',
            },
            show: false,
          },
        },
        yaxis: {
          labels: {
            show: false,
          },
        },
      },
    });

  const GraficoServidorClasse = async () => {
    const contagemClasse: Record<string, number> = {};
    const servidorMap: { value: string; label: string }[] = [];

    //console.log(ServidoresObservatorioTable);

    ServidoresObservatorioTable.forEach(
      (servidorArray: { funcao: string; cargo: string }) => {
        let classeServ = servidorArray.cargo;

        if (
          classeServ != null &&
          classeServ !== undefined &&
          classeServ !== 'NULL' &&
          /CLASSE/.test(classeServ)
        ) {
          /*let classeServ =
            servidorArray.funcao + ' ' + servidorArray.cargo || 'Sem Classe';*/

          let classeServ = servidorArray.cargo || 'Sem Classe';

          if (!contagemClasse[classeServ]) {
            contagemClasse[classeServ] = 1;
            //console.log('Classe/Cargo BD: ' + classeServ);
            servidorMap.push({ value: classeServ, label: classeServ });
          } else {
            contagemClasse[classeServ]++;
          }
        } //tem classe
      },
    );

    //console.log(contagemClasse);

    ClasseDados = Object.entries(contagemClasse)
      .map(([label, qtd]) => ({ label, qtd }))
      .sort((a, b) => {
        if (a.label < b.label) return -1;
        if (a.label > b.label) return 1;
        // Se as labels são iguais, ordene por qtd
        return a.qtd - b.qtd;
      });

    //console.log(ClasseDados);

    // Mapeie os dados para obter series.data e xaxis.categories
    const seriesData = ClasseDados.map(item => item.qtd);
    const categories = ClasseDados.map(item => item.label);
    const hint = ClasseDados.map(item => item.label);

    // Atualize o estado com os novos dados
    setServidoresClasse({
      series: [
        {
          name: 'teste',
          group: [],
          data: seriesData,
        },
      ],
      options: {
        ...servidoresClasse.options,
        tooltip: {
          x: {
            show: true,
          },
          y: {
            title: {
              formatter: function (
                val: any,
                {
                  seriesIndex,
                  dataPointIndex,
                }: { seriesIndex: number; dataPointIndex: number },
              ) {
                // Use a variável 'hint' para exibir o conteúdo no tooltip
                return hint[dataPointIndex];
              },
            },
          },
          fixed: {
            enabled: true,
            position: 'topLeft',
            offsetX: 0,
            offsetY: 0,
          },
          style: {
            fontSize: '10px',
            maxWidth: '200px',
          },
        },
        xaxis: {
          categories: categories,
          labels: {
            style: {
              fontSize: '12px',
            },
            show: false,
          },
        },
        yaxis: {
          labels: {
            show: false,
          },
        },
      },
    });
  };

  //////////////////////////////////////////////////////////////////////////SEXO
  const [servidoresSexo, setServidoresSexo] = useState<ChartOptionsPieDunut>({
    series: [],
    options: {
      chart: {
        type: 'pie',
      },
      colors: ['#1976D2', '#FF5252'],
      title: {
        text: 'Servidores por Sexo',
        align: 'center',
        margin: 10,
        floating: false,
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#263238',
        },
      },
      labels: [],
      responsive: [
        {
          options: {
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
  });

  const GraficoServidorSexo = async () => {
    const contagemSexo: Record<string, number> = {};

    ServidoresObservatorioTable.forEach(
      (servidorArray: { funcao: string; genero: string }) => {
        let funcaoServ = servidorArray.funcao;
        //if ((form_grafico_controler.getFieldValue("zcargo") == 'TODOS') || (form_grafico_controler.getFieldValue("zcargo") == funcaoServ)) {
        let sexo = servidorArray.genero;

        if (sexo == 'MASCULINO') {
          sexo = 'Masculino';
        } else {
          sexo = 'Feminino';
        }

        if (!contagemSexo[sexo]) {
          contagemSexo[sexo] = 1;
        } else {
          contagemSexo[sexo]++;
        }

        //}//FILTRO POR CARGO
      },
    );

    SexoDados = Object.entries(contagemSexo)
      .map(([label, qtd]) => ({ label, qtd }))
      .sort((a, b) => b.qtd - a.qtd);

    try {
      // ... (seu código anterior)

      // Mapeie os dados para obter series.data e xaxis.categories
      const seriesData = SexoDados.map(item => item.qtd);
      const categories = SexoDados.map(item => item.label);

      // Atualize o estado com os novos dados
      setServidoresSexo({
        series: seriesData as unknown as ChartDataPieDunut[], // Coerção de tipo
        options: {
          ...servidoresSexo.options,
          labels: categories,
        },
      });
    } catch (error) {
      console.error('Erro ao obter dados de classe:', error);
    }
  };

  //////////////////////////////////////////////////////////////////////////IDADE
  const [servidoresIdade, setServidoresIdade] = useState<ChartOptionsPieDunut>({
    series: [],
    options: {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Servidores por Idade',
        align: 'center',
        margin: 10,
        floating: false,
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#263238',
        },
      },
      labels: [],
      responsive: [
        {
          options: {
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
  });

  const GraficoServidorIdade = async () => {
    const contagemIdade: Record<string, number> = {};

    ServidoresObservatorioTable.forEach(
      (servidorArray: { funcao: string; idade: number }) => {
        let funcaoServ = servidorArray.funcao;
        let idade = servidorArray.idade;

        //if ((form_grafico_controler.getFieldValue("zcargo") == 'TODOS') || (form_grafico_controler.getFieldValue("zcargo") == funcaoServ)) {
        /* let dtNascimento = servidorArray.dtNascimento;

        // Converter a data de nascimento para um objeto Date
        const dataNascimento = new Date(Number(dtNascimento));

        // Calcular a diferença entre a data atual e a data de nascimento
        const diferencaTempo = Date.now() - dataNascimento.getTime();
        const idade = Math.floor(
          diferencaTempo / (1000 * 60 * 60 * 24 * 365.25),
        );
*/
        let idade_calc;

        switch (true) {
          case idade <= 25:
            idade_calc = 'Até 25 anos';
            break;
          case idade <= 30:
            idade_calc = 'De 26 a 30 anos';
            break;
          case idade <= 40:
            idade_calc = 'De 31 a 40 anos';
            break;
          case idade <= 50:
            idade_calc = 'De 41 a 50 anos';
            break;
          case idade <= 60:
            idade_calc = 'De 51 a 60 anos';
            break;
          case idade <= 70:
            idade_calc = 'De 61 a 70 anos';
            break;
          default:
            idade_calc = 'Acima de 70 anos';
            break;
        }

        if (!contagemIdade[idade_calc]) {
          contagemIdade[idade_calc] = 1;
        } else {
          contagemIdade[idade_calc]++;
        }
        // }
      },
    );

    IdadeDados = Object.entries(contagemIdade)
      .map(([label, qtd]) => ({ label, qtd }))
      .sort((a, b) => b.qtd - a.qtd);

    try {
      // ... (seu código anterior)

      // Mapeie os dados para obter series.data e xaxis.categories
      const seriesData = IdadeDados.map(item => item.qtd);
      const categories = IdadeDados.map(item => item.label);

      // Atualize o estado com os novos dados
      setServidoresIdade({
        series: seriesData as unknown as ChartDataPieDunut[], // Coerção de tipo
        options: {
          ...servidoresIdade.options,
          labels: categories,
        },
      });
    } catch (error) {
      console.error('Erro ao obter dados de idade:', error);
    }
  };

  //////////////////////////////////////////////////////////////////////////POSSE
  const [servidoresPosse, setServidoresPosse] = useState<ChartOptionsPieDunut>({
    series: [],
    options: {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Desde a Posse',
        align: 'center',
        margin: 10,
        floating: false,
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#263238',
        },
      },
      labels: [],
      responsive: [
        {
          options: {
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    },
  });

  const GraficoServidorPosse = async () => {
    const contagemPosse: Record<string, number> = {};

    ServidoresObservatorioTable.forEach(
      (servidorArray: { funcao: string; idade_posse: number }) => {
        let funcaoServ = servidorArray.funcao;
        let idade = servidorArray.idade_posse;

        //if ((form_grafico_controler.getFieldValue("zcargo") == 'TODOS') || (form_grafico_controler.getFieldValue("zcargo") == funcaoServ)) {
        /*let dtPosse = servidorArray.dtPosse;

        // Converter a data de nascimento para um objeto Date
        const dataPosse = new Date(Number(dtPosse));

        // Calcular a diferença entre a data atual e a data de nascimento
        const diferencaTempo = Date.now() - dataPosse.getTime();
        const idade = Math.floor(
          diferencaTempo / (1000 * 60 * 60 * 24 * 365.25),
        );*/

        let TempoTrabalhoCalc;

        switch (true) {
          case idade < 3:
            TempoTrabalhoCalc = 'Até 3 anos';
            break;
          case idade <= 5:
            TempoTrabalhoCalc = 'Até 5 anos';
            break;
          case idade <= 10:
            TempoTrabalhoCalc = 'Até 10 anos';
            break;
          case idade <= 15:
            TempoTrabalhoCalc = 'Até 15 anos';
            break;
          case idade <= 20:
            TempoTrabalhoCalc = 'Até 20 anos';
            break;
          case idade <= 25:
            TempoTrabalhoCalc = 'Até 25 anos';
            break;
          default:
            TempoTrabalhoCalc = 'Acima de 25 anos';
            break;
        }

        if (!contagemPosse[TempoTrabalhoCalc]) {
          contagemPosse[TempoTrabalhoCalc] = 1;
        } else {
          contagemPosse[TempoTrabalhoCalc]++;
        }
        //}
      },
    );

    PosseDados = Object.entries(contagemPosse)
      .map(([label, qtd]) => ({ label, qtd }))
      .sort((a, b) => b.qtd - a.qtd);

    try {
      // ... (seu código anterior)

      // Mapeie os dados para obter series.data e xaxis.categories
      const seriesData = PosseDados.map(item => item.qtd);
      const categories = PosseDados.map(item => item.label);

      // Atualize o estado com os novos dados
      setServidoresPosse({
        series: seriesData as unknown as ChartDataPieDunut[], // Coerção de tipo
        options: {
          ...servidoresPosse.options,
          labels: categories,
        },
      });
    } catch (error) {
      console.error('Erro ao obter dados de idade:', error);
    }
  };

  /**************************************************************************
   * **********************************TABELAS GRIDS**********************
   * ***********************************************************************
  const onChangeDepartamentos = (
    pagination: any,
    filters: any,
    sorter: any,
  ) => {
    // Lógica para atualizar o dataSource com base no sorter
    // Certifique-se de configurar a lógica de ordenação para cada coluna

    // Verifique se existe um campo sorter
    if (sorter && sorter.columnKey) {
      // Aqui você pode implementar a lógica de ordenação para cada coluna
      const { columnKey, order } = sorter;

      // Exemplo de lógica de ordenação (você precisa ajustar isso conforme sua lógica real)
      const sortedData = DepartamentosObservatorioTable.sort((a, b) => {
        const valueA = a[columnKey];
        const valueB = b[columnKey];

        if (order === 'ascend') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });

      // Atualize o dataSource com os dados ordenados
      setDepartamentosObservatorioTable([...sortedData]);
    }
  };
*/
  type DepartamentosSortKeys = keyof DataTypeTreeDepartamento;

  const onChangeDepartamentos = (
    pagination: any,
    filters: any,
    sorter: any,
  ) => {
    // Verifique se existe um campo sorter e se o sorter tem uma chave válida
    if (
      sorter &&
      sorter.columnKey &&
      Object.keys(sorter.columnKey).includes(sorter.columnKey)
    ) {
      const { columnKey, order } = sorter;

      // Use a chave válida para ordenar os dados
      const sortedData = DepartamentosObservatorioTable.sort((a, b) => {
        // Use operador condicional para evitar 'undefined'
        const valueA = a[columnKey as DepartamentosSortKeys] ?? ''; // Valor padrão caso seja undefined
        const valueB = b[columnKey as DepartamentosSortKeys] ?? ''; // Valor padrão caso seja undefined

        if (order === 'ascend') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });

      // Atualize o dataSource com os dados ordenados
      setDepartamentosObservatorioTable([...sortedData]);
    }
  };

  const columnsDepartamentos: ColumnsType<DataTypeTreeDepartamento> = [
    {
      title: 'DEPARTAMENTO',
      width: 120,
      dataIndex: 'title',
      key: 'title',
      fixed: 'left',
      sorter: true,
      render: (text, record) => (
        <div>
          <div>
            <span
              style={{
                fontWeight: 'bold',
                color:
                  record.status_desc === 'INATIVA'
                    ? 'red'
                    : record.especializacao === 'ORGANIZACIONAL'
                    ? 'darkgray'
                    : record.filhos === 0
                    ? 'black'
                    : 'darkblue',
              }}
            >
              <Tooltip
                title={`${record.sigla} - Grupo Observatório: ${record.departamento_grupo}`}
                placement="top"
              >
                <span>
                  {record.status_desc === 'INATIVA' ? 'INATIVA ' + text : text}
                </span>
              </Tooltip>
            </span>
          </div>

          <div>
            <span
              style={{ fontWeight: 'normal', color: 'darkgray', fontSize: 10 }}
            >
              {record.nome_superior_hierarquia}
            </span>
          </div>

          <div>
            {(() => {
              switch (record.especializacao) {
                case 'REGIONAL':
                  return (
                    <ApartmentOutlined
                      style={{ color: 'brown', fontSize: 18 }}
                      title={record.especializacao}
                    />
                  );
                case 'MULHER':
                  return (
                    <WomanOutlined
                      style={{ color: 'purple', fontSize: 22 }}
                      title={record.especializacao}
                    />
                  );
                case 'MENOR_INFRATOR':
                  return (
                    <FrownOutlined
                      style={{ color: 'darkorange', fontSize: 18 }}
                      title={record.especializacao}
                    />
                  );
                case 'MENOR_VITIMA':
                  return (
                    <RedditOutlined
                      style={{ color: '#00b3b3', fontSize: 18 }}
                      title={record.especializacao}
                    />
                  );
                case 'IDOSO':
                  return (
                    <CrownOutlined
                      style={{ color: '#684200', fontSize: 18 }}
                      title={record.especializacao}
                    />
                  );
                case 'DEFICIENCIA':
                  return (
                    <AppstoreAddOutlined
                      style={{ color: '#684200', fontSize: 18 }}
                      title={record.especializacao}
                    />
                  );
                case 'RACIAL':
                  return (
                    <UsergroupDeleteOutlined
                      style={{ color: '#684200', fontSize: 18 }}
                      title={record.especializacao}
                    />
                  );
                case 'NECRO':
                  return (
                    <GoldOutlined
                      style={{ color: '#684200', fontSize: 18 }}
                      title={record.especializacao}
                    />
                  );
                case 'ID':
                  return (
                    <SolutionOutlined
                      style={{ color: '#684200', fontSize: 18 }}
                      title={record.especializacao}
                    />
                  );
                case 'SAUDE':
                  return (
                    <MedicineBoxOutlined
                      style={{ color: 'darkred', fontSize: 18 }}
                      title={record.especializacao}
                    />
                  );
                case 'OPERACIONAL':
                  return (
                    <CheckCircleOutlined
                      style={{ color: 'darkgreen', fontSize: 18 }}
                      title={record.especializacao}
                    />
                  );
                case 'DIH':
                  return (
                    <HeatMapOutlined
                      style={{ color: 'darkred', fontSize: 18 }}
                      title={record.especializacao}
                    />
                  );
                case 'DEIC':
                  return (
                    <ZoomInOutlined
                      style={{ color: 'darkred', fontSize: 18 }}
                      title={record.especializacao}
                    />
                  );
                case 'DICT':
                  return (
                    <CarOutlined
                      style={{ color: 'darkred', fontSize: 18 }}
                      title={record.especializacao}
                    />
                  );
                case 'GEPATRI':
                  return (
                    <HomeOutlined
                      style={{ color: 'darkred', fontSize: 18 }}
                      title={record.especializacao}
                    />
                  );
                case 'DROGAS':
                  return (
                    <ExperimentOutlined
                      style={{ color: 'darkred', fontSize: 18 }}
                      title={record.especializacao}
                    />
                  );
                case 'ORGANIZACIONAL':
                  return (
                    <ExpandOutlined
                      style={{ color: 'darkgray', fontSize: 18 }}
                      title={record.especializacao}
                    />
                  );
                case 'INTELIGENCIA':
                  return (
                    <GlobalOutlined
                      style={{ color: '#0051e6', fontSize: 18 }}
                      title={record.especializacao}
                    />
                  );
                default:
                  return null; // ou qualquer outro ícone padrão, ou null se não houver ícone padrão
              }
            })()}

            <Tooltip title={`${record.portaria}`} placement="left">
              <span
                style={{
                  fontWeight: 'normal',
                  color: 'darkgray',
                  fontSize: 10,
                }}
              >
                {record.hierarquia}
                {record.filhos === 0
                  ? ''
                  : record.filhos === 1
                  ? ' - Possui 1 Departamento'
                  : ' - Possui ' + record.filhos + ' Departamentos'}
              </span>
            </Tooltip>
          </div>
        </div>
      ),
    },
    {
      title: 'TITULAR',
      width: 70,
      dataIndex: 'titular_abreviado',
      key: 'titular_abreviado',
      fixed: 'left',
      sorter: true,
      render: (text, record) => (
        <div>
          <div>
            <span
              style={{
                fontWeight: 'bold',
                color: record.titular_interino !== '' ? 'darkgray' : 'black',
              }}
            >
              {record.titular !== '' && (
                <Tooltip title={`Titular: ${record.titular}`} placement="top">
                  {'Titular: ' + text}
                  {record.titular_celular && (
                    <a
                      href={`https://web.whatsapp.com/send?phone=+55${record.titular_celular}&text=${record.titular}, tudo bem com o(a) Senhor(a)? Aqui quem fala é ${auth?.user?.nome} da ${auth?.user?.unidade?.sigla}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'darkgreen' }}
                    >
                      <WhatsAppOutlined style={{ color: 'green' }} />
                    </a>
                  )}
                </Tooltip>
              )}
            </span>
          </div>

          <div>
            <span style={{ fontWeight: 'bold', color: 'black' }}>
              {record.titular_interino !== '' && (
                <Tooltip
                  title={`Interino: ${record.titular_interino} - Responsável: ${record.titular}`}
                  placement="top"
                >
                  <LoadingOutlined />
                  {'Interino: ' + record.titular_interino}
                  {record.titular_interino_celular && (
                    <a
                      href={`https://web.whatsapp.com/send?phone=+55${record.titular_interino_celular}&text=${record.titular_interino}, tudo bem com o(a) Senhor(a)? Aqui quem fala é ${auth?.user?.nome} da ${auth?.user?.unidade?.sigla}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'darkgreen' }}
                    >
                      <WhatsAppOutlined style={{ color: 'green' }} />
                    </a>
                  )}
                </Tooltip>
              )}
            </span>
          </div>

          <div>
            <span style={{ fontWeight: 'normal', color: 'darkgray' }}>
              {record.chefe_cartorio_interino === '' ? (
                record.chefe_cartorio !== '' ? (
                  <Tooltip
                    title={`Chefe Cartório: ${record.chefe_cartorio}`}
                    placement="top"
                  >
                    {'Esc.: ' + record.chefe_cartorio_abreviado}
                    {record.chefe_cartorio_celular && (
                      <a
                        href={`https://web.whatsapp.com/send?phone=+55${record.chefe_cartorio_celular}&text=${record.chefe_cartorio}, tudo bem com o(a) Senhor(a)? Aqui quem fala é ${auth?.user?.nome} da ${auth?.user?.unidade?.sigla}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'darkgreen' }}
                      >
                        <WhatsAppOutlined style={{ color: 'green' }} />
                      </a>
                    )}
                  </Tooltip>
                ) : null
              ) : (
                <Tooltip
                  title={`Chefe Cartório: ${record.chefe_cartorio} - Respondendo: ${record.chefe_cartorio_interino}`}
                  placement="top"
                >
                  <LoadingOutlined />
                  {'Esc.: ' + record.chefe_cartorio_interino_abreviado}
                  {record.chefe_cartorio_interino_celular && (
                    <a
                      href={`https://web.whatsapp.com/send?phone=+55${record.chefe_cartorio_interino_celular}&text=${record.chefe_cartorio_interino}, tudo bem com o(a) Senhor(a)? Aqui quem fala é ${auth?.user?.nome} da ${auth?.user?.unidade?.sigla}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'darkgreen' }}
                    >
                      <WhatsAppOutlined style={{ color: 'green' }} />
                    </a>
                  )}
                </Tooltip>
              )}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'CIDADE',
      width: 70,
      dataIndex: 'municipio',
      key: 'municipio',
      fixed: 'left',
      sorter: true,
      render: (text, record) => (
        <div>
          {record.especializacao !== 'ORGANIZACIONAL' && (
            <>
              <div>
                <span style={{ fontWeight: 'bold', color: 'black' }}>
                  <Tooltip
                    title={
                      record.qtd_municipios
                        ? record.qtd_municipios > 1
                          ? `Possui ${record.qtd_municipios} Municípios`
                          : text
                        : 'Não possui municípios vinculados'
                    }
                    placement="top"
                  >
                    {record.qtd_municipios
                      ? record.qtd_municipios > 1
                        ? `${text} (x ${record.qtd_municipios})`
                        : text
                      : text}
                  </Tooltip>
                </span>
              </div>

              <div>
                <span style={{ fontWeight: 'normal', color: 'black' }}>
                  {record.tipo === 'OPERACIONAL' ? (
                    <Tooltip title="Dados do Censo 2023" placement="top">
                      <UserAddOutlined style={{ color: 'blue' }} />
                      {record.censo_vinte_tres
                        ? record.censo_vinte_tres.toLocaleString('pt-BR') +
                          ' Habitantes'
                        : '-'}
                    </Tooltip>
                  ) : (
                    <>
                      {(() => {
                        switch (record.tipo) {
                          case 'GT3':
                            return (
                              <SafetyCertificateOutlined
                                style={{ color: '#b82f0b', fontSize: 18 }}
                              />
                            );
                          case 'INTELIGENCIA':
                            return (
                              <GlobalOutlined
                                style={{ color: '#0051e6', fontSize: 18 }}
                              />
                            );
                          case 'ACADEMIA':
                            return (
                              <TrophyOutlined
                                style={{ color: '#b8860b', fontSize: 18 }}
                              />
                            );
                          case 'CORREGEDORIA':
                            return (
                              <BorderOuterOutlined
                                style={{ color: '#e69500', fontSize: 18 }}
                              />
                            );
                          case 'SI':
                            return (
                              <SolutionOutlined
                                style={{ color: '#839a00', fontSize: 18 }}
                              />
                            );
                          case 'ADMINISTRATIVA':
                            return (
                              <SettingOutlined
                                style={{ color: '#cdcdcd', fontSize: 18 }}
                              />
                            );
                          case 'CONSELHO':
                            return (
                              <TeamOutlined
                                style={{ color: '#cccc00', fontSize: 18 }}
                              />
                            );
                          case 'GABINETE':
                            return (
                              <BankOutlined
                                style={{ color: 'darkblue', fontSize: 18 }}
                              />
                            );
                          case 'SUPERVISAO':
                            return (
                              <MonitorOutlined
                                style={{ color: 'darkgreen', fontSize: 18 }}
                              />
                            );
                          default:
                            return null; // ou qualquer outro ícone padrão, ou null se não houver ícone padrão
                        }
                      })()}
                      {record.tipo}
                    </>
                  )}
                </span>
              </div>

              <div>
                {record.telefone ? (
                  <span style={{ fontWeight: 'bold', color: 'black' }}>
                    <Tooltip
                      title={`${record.telefone}. Clique para falar via WhatsappWeb.`}
                      placement="top"
                    >
                      <a
                        href={`https://web.whatsapp.com/send?phone=+55${record.telefone}&text=${record.title}, tudo bem com vcs? Aqui quem fala é ${auth?.user?.nome} da ${auth?.user?.unidade?.sigla}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'darkgreen' }}
                      >
                        <WhatsAppOutlined style={{ color: 'green' }} />{' '}
                        {record.telefone}
                      </a>
                    </Tooltip>
                  </span>
                ) : (
                  <WhatsAppOutlined
                    title="Departamento não possui telefone cadastrado no SICAD"
                    style={{ color: 'darkred' }}
                  />
                )}
              </div>

              <div>
                {record.telefone2 && (
                  <span style={{ fontWeight: 'bold', color: 'black' }}>
                    <Tooltip
                      title={`${record.telefone2}. Clique para falar via WhatsappWeb.`}
                      placement="top"
                    >
                      <a
                        href={`https://web.whatsapp.com/send?phone=+55${record.telefone2}&text=${record.title}, tudo bem com vcs? Aqui quem fala é ${auth?.user?.nome} da ${auth?.user?.unidade?.sigla}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'darkgreen' }}
                      >
                        <WhatsAppOutlined style={{ color: 'green' }} />{' '}
                        {record.telefone2}
                      </a>
                    </Tooltip>
                  </span>
                )}
              </div>

              <div>
                {record.telefone3 && (
                  <span style={{ fontWeight: 'bold', color: 'black' }}>
                    <Tooltip
                      title={`${record.telefone3}. Clique para falar via WhatsappWeb.`}
                      placement="top"
                    >
                      <a
                        href={`https://web.whatsapp.com/send?phone=+55${record.telefone3}&text=${record.title}, tudo bem com vcs? Aqui quem fala é ${auth?.user?.nome} da ${auth?.user?.unidade?.sigla}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'darkgreen' }}
                      >
                        <WhatsAppOutlined style={{ color: 'green' }} />{' '}
                        {record.telefone3}
                      </a>
                    </Tooltip>
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      ),
    },
    {
      title: 'SERVIDORES',
      width: 120,
      dataIndex: 'servidores_qtd',
      key: 'servidores_qtd',
      fixed: 'left',
      sorter: true,
      render: (text, record) => (
        <div>
          {record.especializacao !== 'ORGANIZACIONAL' && (
            <>
              <div>
                <span style={{ fontWeight: 'bold', color: 'blue' }}>
                  <Tooltip title={`${text} Servidores`} placement="top">
                    {text} Servidores
                  </Tooltip>
                </span>
              </div>

              <div>
                <span style={{ fontWeight: 'normal', color: 'black' }}>
                  {record.servidores_delegados} Delegados
                </span>
              </div>

              <div>
                <span style={{ fontWeight: 'normal', color: 'black' }}>
                  {record.servidores_escrivaes} Escrivães
                </span>
              </div>

              <div>
                <span style={{ fontWeight: 'normal', color: 'black' }}>
                  {record.servidores_agentes} Agentes
                </span>
              </div>
            </>
          )}
        </div>
      ),
    },
    {
      title: '',
      key: '',
      fixed: 'right',
      width: 50,
      render: (text, record) => (
        <div>
          <div>
            {record.escala === 'EXPEDIENTE' && (
              <span style={{ color: 'black' }}>Expediente</span>
            )}
            {record.escala === 'EXPEDIENTE' && (
              <ClockCircleOutlined style={{ color: 'darkgray' }} />
            )}
            {record.escala === 'PLANTÃO' && (
              <span style={{ color: 'orange' }}>Plantão</span>
            )}
            {record.escala === 'PLANTÃO' && (
              <AlertOutlined style={{ color: 'orange' }} />
            )}
          </div>
          <div>
            <a onClick={() => EditarDepartamentoClick(record)}>
              <Button type="primary" style={{ backgroundColor: 'darkgreen' }}>
                <EditOutlined />
                Editar
              </Button>
            </a>
          </div>
          <div>
            <a onClick={() => FotosDepartamentoClick(record)}>
              <Button
                type="primary"
                style={{
                  backgroundColor: '#eee8aa',
                  color: 'black',
                  marginTop: 4,
                }}
              >
                <CameraOutlined />
                Fotos
              </Button>
            </a>
          </div>
        </div>
      ),
    },
    {
      title: '',
      width: 50,
      dataIndex: 'ultima_imagem',
      key: 'ultima_imagem',
      fixed: 'left',
      sorter: true,
      render: (text, record) => {
        const imagens = record.imagens ? record.imagens.split('|X|') : [];
        return (
          <div
            style={{
              backgroundColor: imagens.length > 1 ? 'darkgray' : 'white',
            }}
          >
            <Carousel autoplay>
              {imagens.map((imagemNome, index) => (
                <div key={`imagem-${index}`}>
                  <h3>
                    <Image
                      width={100}
                      src={`${
                        urlsServices.PORTAARQUIVO
                      }/loadArquivo?id=${imagemNome}&token=${localStorage.getItem(
                        'token_sso',
                      )}`}
                    />
                  </h3>
                </div>
              ))}
            </Carousel>
          </div>
        );
      },
    },
  ];

  const FotosDepartamentoClick = (record: DataTypeTreeDepartamento) => {
    onLoadDados('Mostrando as Fotos em 3, 2, 1...');
    if (record && record.title != null) {
      const titleString = String(record.title); // ou record.title.toString()
      setDrawerDepartamentoTitulo(titleString);
    }

    form_departamentos.setFieldValue('departamento_id', record.id);

    ArquivosList(
      record.id.toString(),
      form_departamentos.getFieldValue('zcons_fotos_grupo'),
    );

    showDrawerDepartamentoFotos();
    exitLoadDados();
  };

  const [LinhaTituloVisivel, setLinhaTituloVisivel] = useState(false);
  const [DrawerDepartamentoTitulo, setDrawerDepartamentoTitulo] = useState('');

  const EditarDepartamentoClick = (record: DataTypeTreeDepartamento) => {
    onLoadDados('Carregando Dados...');
    //setLinhaTituloVisivel(true);
    if (record && record.title != null) {
      const titleString = String(record.title); // ou record.title.toString()
      setDrawerDepartamentoTitulo(titleString);
    }
    form_departamentos.setFieldValue('departamento_nome_edicao', record.title);
    form_departamentos.setFieldValue('departamento_id', record.id);
    form_departamentos.setFieldValue('dep_telefone', record.telefone);
    form_departamentos.setFieldValue('dep_telefone2', record.telefone2);
    form_departamentos.setFieldValue('dep_telefone3', record.telefone3);
    form_departamentos.setFieldValue('dep_escala', record.escala);
    form_departamentos.setFieldValue('dep_tipo', record.tipo);
    form_departamentos.setFieldValue(
      'dep_especializacao',
      record.especializacao,
    );

    form_departamentos.setFieldValue('servidor_id_2', record.titular_id);
    form_departamentos.setFieldValue('servidor_2', record.titular);
    form_departamentos.setFieldValue('titular_celular', record.titular_celular);
    form_departamentos.setFieldValue(
      'titular_telefone',
      record.titular_telefone,
    );

    form_departamentos.setFieldValue(
      'servidor_id_3',
      record.titular_interino_id,
    );
    form_departamentos.setFieldValue('servidor_3', record.titular_interino);
    form_departamentos.setFieldValue(
      'titular_interino_celular',
      record.titular_interino_celular,
    );
    form_departamentos.setFieldValue(
      'titular_interino_telefone',
      record.titular_interino_telefone,
    );

    form_departamentos.setFieldValue('servidor_id_4', record.chefe_cartorio_id);
    form_departamentos.setFieldValue('servidor_4', record.chefe_cartorio);
    form_departamentos.setFieldValue(
      'chefe_cartorio_celular',
      record.chefe_cartorio_celular,
    );
    form_departamentos.setFieldValue(
      'chefe_cartorio_telefone',
      record.chefe_cartorio_telefone,
    );

    form_departamentos.setFieldValue(
      'servidor_id_5',
      record.chefe_cartorio_interino_id,
    );
    form_departamentos.setFieldValue(
      'servidor_5',
      record.chefe_cartorio_interino,
    );
    form_departamentos.setFieldValue(
      'titular_celular',
      record.chefe_cartorio_interino_celular,
    );
    form_departamentos.setFieldValue(
      'titular_telefone',
      record.chefe_cartorio_interino_telefone,
    );

    form_departamentos.setFieldValue(
      'dep_valor_contrato',
      record.valor_contrato,
    );
    form_departamentos.setFieldValue('dep_imovel_status', record.imovel_status);
    form_departamentos.setFieldValue('dep_portaria', record.portaria);
    form_departamentos.setFieldValue('dep_hierarquia', record.hierarquia);
    form_departamentos.setFieldValue('cidade_id_1', record.municipioid);
    form_departamentos.setFieldValue('cidade_1', record.municipio);
    form_departamentos.setFieldValue(
      'departamento_grupo_id_2',
      record.departamento_grupo_id,
    );
    form_departamentos.setFieldValue(
      'departamento_grupo_2',
      record.departamento_grupo,
    );
    //setActiveTabDepartamento('2');
    showDrawerDepartamento();
    exitLoadDados();
  };

  const DepartamentoSubmit = async () => {
    onLoadDados('Carregando Dados...');
    const fieldsValue: any = {};

    fieldsValue.user_observatorio_id = auth?.user?.id;
    fieldsValue.user_observatorio = auth?.user?.nome;
    fieldsValue.departamento_id =
      form_departamentos.getFieldValue('departamento_id');
    fieldsValue.escala = form_departamentos.getFieldValue('dep_escala');
    fieldsValue.tipo = form_departamentos.getFieldValue('dep_tipo');
    fieldsValue.especializacao =
      form_departamentos.getFieldValue('dep_especializacao');

    fieldsValue.telefone = form_departamentos.getFieldValue('dep_telefone');
    fieldsValue.telefone2 = form_departamentos.getFieldValue('dep_telefone2');
    fieldsValue.telefone3 = form_departamentos.getFieldValue('dep_telefone3');
    fieldsValue.portaria = form_departamentos.getFieldValue('dep_portaria');
    fieldsValue.hierarquia = form_departamentos.getFieldValue('dep_hierarquia');
    fieldsValue.municipioid = form_departamentos.getFieldValue('cidade_id_1');
    fieldsValue.municipio = form_departamentos.getFieldValue('cidade_1');
    fieldsValue.titular_id = form_departamentos.getFieldValue('servidor_id_2');
    fieldsValue.titular_interino_id =
      form_departamentos.getFieldValue('servidor_id_3');
    fieldsValue.chefe_cartorio_id =
      form_departamentos.getFieldValue('servidor_id_4');
    fieldsValue.chefe_cartorio_interino_id =
      form_departamentos.getFieldValue('servidor_id_5');
    fieldsValue.departamento_grupo_id = form_departamentos.getFieldValue(
      'departamento_grupo_id_2',
    );
    fieldsValue.departamento_grupo = form_departamentos.getFieldValue(
      'departamento_grupo_2',
    );
    fieldsValue.imovel_status =
      form_departamentos.getFieldValue('dep_imovel_status');
    fieldsValue.valor_contrato =
      form_departamentos.getFieldValue('dep_valor_contrato');

    if (fieldsValue.valor_contrato === '') {
      fieldsValue.valor_contrato = '0';
    }
    //alert(RaiDadosCompleto[0].delegadoPC.nome+'!');

    await apiDepartamentos.DepartamentoSave(fieldsValue).then((res: any) => {
      if (res.status == 200) {
        notification.info({ message: res.data.message });
      } else {
        notification.error({
          message: 'Erro ao Salvar Departamento!',
          description: res.data.message,
        });
      }
    });
    exitLoadDados();
  };

  /**************************************************************************
   * **********************************UPLOAD ARQUIVO**************************
   * ************************************************************************/

  const [ArquivosSource, setArquivosSource] = useState([]);

  const sendFileWs = async (pdfData: File, fileType: string) => {
    try {
      onLoadDados('Anexando o arquivo escolhido');

      const fotosGrupo = form_departamentos.getFieldValue('fotos_grupo') || '';

      if (fotosGrupo == '') {
        exitLoadDados();
        message.error('Informe o Agrupamento para a foto.');
      } else {
        const res: any = await axiosPortaArquivo.post(pdfData);

        if (res) {
          // Verifica se 'departamento_id' está definido no form_departamentos.values
          const departamentoId =
            form_departamentos.getFieldValue('departamento_id') || '';

          //alert('incluir: '+departamentoId);

          form_departamentos.setFieldValue('arquivo_upload_id', res.data?.id);

          await apiDepartamentos
            .saveDepartamentoPortaArquivo(
              departamentoId,
              res.data?.id,
              auth?.user?.id?.toString() || '', // Converte para string ou fornece uma string vazia
              auth?.user?.nome || '',
              fileType,
              fotosGrupo, // Adiciona o novo parâmetro
            )
            .then((res: any) => {
              if (res.status === 200) {
                const fotosGrupoCons =
                  form_departamentos.getFieldValue('zcons_fotos_grupo') ||
                  'TODAS';
                notification.info({ message: res.data.message });
                ArquivosList(departamentoId, fotosGrupoCons);
              } else {
                notification.error({
                  message: 'Erro ao Salvar Foto!',
                  description: res.data.message,
                });
              }
            });
        }

        exitLoadDados();
        // Restante do seu código...
      }
    } catch {
      exitLoadDados();
      message.error('Ocorreu um erro ao receber o arquivo');
    }
  };

  const ArquivosList = async (departamentoId: string, grupoFotos: string) => {
    setArquivosSource([]);

    //alert('list: '+departamentoId);
    if (departamentoId != '') {
      onLoadDados('Vamos ver que arquivos temos anexados a este departamento.');

      await apiDepartamentos
        .listarDepartamentoPortaArquivos(departamentoId, grupoFotos)
        .then((res: any) => {
          if (res.status == 200) {
            const newretorno: any = [];
            //console.log(res.data.message);
            res.data.retorno.map((item: any) => {
              newretorno.push(item);
            });

            if (newretorno.length > 0) {
              const primeiroArquivoId = newretorno[0].arquivo_id;
              form_departamentos.setFieldValue(
                'arquivo_upload_id',
                primeiroArquivoId,
              );
            } else {
              form_departamentos.setFieldValue('arquivo_upload_id', '');
            }

            setArquivosSource(newretorno);
          } else {
            notification.error({
              message: 'Erro ao listar Identificações Arquivos Anexados!',
              description: res.data.message,
            });
          }
        });

      exitLoadDados();
    }
  };

  const ExcluirImagemClick = async (
    departamentoId: string,
    arquivo_id: string,
    grupo: string,
  ) => {
    //alert('list: '+departamentoId);
    if (arquivo_id != '') {
      const shouldDelete = window.confirm(
        'Tem certeza de que deseja excluir esta imagem?',
      );
      if (shouldDelete) {
        onLoadDados('Deixa comigo, estou excluíndo o arquivo que vc pediu.');

        await apiDepartamentos
          .excluirDepartamentoPortaArquivo(
            departamentoId,
            arquivo_id,
            auth?.user?.id?.toString() || '', // Converte para string ou fornece uma string vazia
            auth?.user?.nome || '',
          )
          .then((res: any) => {
            if (res.status == 200) {
              const fotosGrupoCons =
                form_departamentos.getFieldValue('zcons_fotos_grupo') ||
                'TODAS';
              ArquivosList(departamentoId, fotosGrupoCons);

              msg_aviso('Arquivo Removido Com Sucesso.', 'success');
            } else {
              notification.error({
                message: 'Erro ao listar Identificações Arquivos Anexados!',
                description: res.data.message,
              });
            }
          });

        exitLoadDados();
      }
    }
  };

  const onChangeArquivos = (pagination: any, filters: any, sorter: any) => {
    // Lógica para atualizar o dataSource com base no sorter
    // Certifique-se de configurar a lógica de ordenação para cada coluna

    // Verifique se existe um campo sorter
    if (sorter && sorter.columnKey) {
      // Aqui você pode implementar a lógica de ordenação para cada coluna
      const { columnKey, order } = sorter;

      // Exemplo de lógica de ordenação (você precisa ajustar isso conforme sua lógica real)
      const sortedData = ArquivosSource.sort((a, b) => {
        const valueA = a[columnKey];
        const valueB = b[columnKey];

        if (order === 'ascend') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });

      // Atualize o dataSource com os dados ordenados
      setArquivosSource([...sortedData]);
    }
  };

  ////////////////////////////////////////////////////////////////////////////////ARQUIVOS
  const columnsArquivos: ColumnsType<DataTypeArquivos> = [
    {
      title: 'ARQUIVOS ANEXADO',
      width: 80,
      dataIndex: 'arquivo_id',
      key: 'arquivo_id',
      fixed: 'left',
      sorter: true,
      render: (text, record) => (
        <div>
          <Image
            height={100}
            src={`${urlsServices.PORTAARQUIVO}loadArquivo?id=${
              record.arquivo_id
            }&token=${localStorage.getItem('token_sso')}`}
          />
        </div>
      ),
    },
    {
      title: '',
      key: 'status',
      fixed: 'right',
      width: 80,
      render: (text, record) => (
        <div>
          <div
            title={
              'Upload em: ' +
              record.dta_upload_br +
              ' \n Por: ' +
              record.user_cad
            }
            style={{ fontWeight: 'bold', color: 'black' }}
          >
            {'Arquivo ' + record.arquivo_numero + ' '}
            {record.arquivo_tipo_icon === 'FileImageOutlined' && (
              <CloudDownloadOutlined style={{ color: 'blue' }} />
            )}
            {record.arquivo_tipo_icon === 'FilePdfOutlined' && (
              <FilePdfOutlined style={{ color: 'darkred' }} />
            )}
            {record.arquivo_tipo_icon === 'FileWordOutlined' && (
              <FileWordOutlined style={{ color: 'darkblue' }} />
            )}
            {record.arquivo_tipo_icon === 'FileExcelOutlined' && (
              <FileExcelOutlined style={{ color: 'darkgreen' }} />
            )}
            {record.arquivo_tipo_icon === 'FileUnknownOutlined' && (
              <FileUnknownOutlined style={{ color: 'darkpurple' }} />
            )}

            <span style={{ fontWeight: 'normal', color: 'darkgray' }}>
              {' de: ' + record.dta_upload_br}
            </span>
          </div>

          <div style={{ fontWeight: 'bold' }}>
            <ApartmentOutlined style={{ color: 'darkgray' }} />
            <span style={{ fontWeight: 'normal', color: 'darkgray' }}>
              {record.grupo}
            </span>
          </div>

          <div>
            <a
              style={{ fontWeight: 'bold', color: 'red' }}
              onClick={() =>
                ExcluirImagemClick(
                  record.departamento_id,
                  record.arquivo_id,
                  record.grupo,
                )
              }
            >
              <Button type="primary" style={{ backgroundColor: 'darkorange' }}>
                Excluir
              </Button>
            </a>
          </div>
        </div>
      ),
    },
  ];

  function handleFotosGrupoChange() {
    ArquivosList(
      form_departamentos.getFieldValue('departamento_id'),
      form_departamentos.getFieldValue('zcons_fotos_grupo'),
    );
  }

  /**************************************************************************
   * **********************************SERVIDORES INATIVOS**********************
   * ************************************************************************/
  type ServidoresInativosSortKeys = keyof DataTypeServidores;

  const onChangeServidoresInativos = (
    pagination: any,
    filters: any,
    sorter: any,
  ) => {
    // Verifique se existe um campo sorter e se o sorter tem uma chave válida
    if (
      sorter &&
      sorter.columnKey &&
      Object.keys(sorter.columnKey).includes(sorter.columnKey)
    ) {
      const { columnKey, order } = sorter;

      // Use a chave válida para ordenar os dados
      const sortedData = ServidoresObservatorioInativosTable.sort((a, b) => {
        // Use operador condicional para evitar 'undefined'
        const valueA = a[columnKey as ServidoresInativosSortKeys] ?? ''; // Valor padrão caso seja undefined
        const valueB = b[columnKey as ServidoresInativosSortKeys] ?? ''; // Valor padrão caso seja undefined

        if (order === 'ascend') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });

      // Atualize o dataSource com os dados ordenados
      setServidoresObservatorioInativosTable([...sortedData]);
    }
  };

  const columnsServidoresInativos: ColumnsType<DataTypeServidores> = [
    {
      title: 'SERVIDOR DESLIGADO',
      width: 120,
      dataIndex: 'nome',
      key: 'nome',
      fixed: 'left',
      sorter: true,
      render: (text, record) => {
        // Calcular a idade a partir da data de nascimento
        return (
          <div>
            <div>
              <span>
                <span
                  style={{
                    fontWeight: 'bold',
                    color: 'black',
                  }}
                >
                  {record.genero === 'MASCULINO' ? (
                    <ManOutlined
                      style={{ color: 'darkgray', marginRight: 5 }}
                    />
                  ) : (
                    <WomanOutlined
                      style={{ color: 'darkgray', marginRight: 5 }}
                    />
                  )}
                  {text}
                </span>
              </span>
            </div>

            <div>
              <span style={{ fontWeight: 'bold', color: 'darkred' }}>
                INATIVO{' -> ' + record.situacao}
              </span>
            </div>

            <div>
              <span style={{ fontWeight: 'bold', color: 'red' }}>
                Desde: {record.dtaf_br}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: 'CONTATOS',
      width: 70,
      dataIndex: 'nome',
      key: 'nome',
      fixed: 'left',
      sorter: true,
      render: (text, record) => {
        // Calcular a idade a partir da data de nascimento
        return (
          <div>
            <div>
              <span>
                <span style={{ fontWeight: 'bold', color: 'darkgreen' }}>
                  {record.celular && record.celular.length > 6 ? (
                    <Tooltip
                      title={`Clique para falar Whatsapp web`}
                      placement="top"
                    >
                      <a
                        href={`https://web.whatsapp.com/send?phone=+55${record.celular}&text=${record.nome}, tudo bem com vc? Aqui quem fala é ${auth?.user?.nome} da ${auth?.user?.unidade?.sigla} `}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'darkgreen' }}
                      >
                        <WhatsAppOutlined style={{ color: 'green' }} />{' '}
                        {record.celular}
                      </a>
                    </Tooltip>
                  ) : (
                    '-'
                  )}
                </span>
              </span>
            </div>
            <div>
              <span style={{ fontWeight: 'normal', color: 'black' }}>
                {record.email ? `${record.email}` : '-'}
              </span>
            </div>
            <div>
              <span style={{ fontWeight: 'normal', color: 'black' }}>
                {record.telefone && record.telefone.length > 6 ? (
                  <Tooltip
                    title={`Clique para falar Whatsapp web`}
                    placement="top"
                  >
                    <a
                      href={`https://web.whatsapp.com/send?phone=+55${record.telefone}&text=${record.nome}, tudo bem com vc? Aqui quem fala é ${auth?.user?.nome} da ${auth?.user?.unidade?.sigla} `}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'darkgreen' }}
                    >
                      <WhatsAppOutlined style={{ color: 'green' }} />{' '}
                      {record.telefone}
                    </a>
                  </Tooltip>
                ) : (
                  '-'
                )}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: 'CARGO QUE OCUPAVA',
      width: 100,
      dataIndex: 'funcao',
      key: 'funcao',
      fixed: 'left',
      sorter: true,
      render: (text, record) => (
        <div>
          <div>
            <span>
              <span style={{ fontWeight: 'bold', color: 'black' }}>{text}</span>
            </span>
          </div>

          <div>
            <span style={{ fontWeight: 'normal', color: 'black' }}>
              {record.cargo}
            </span>
          </div>

          <div>
            <span style={{ fontWeight: 'normal', color: 'black' }}>
              {record.administracao != 'SGI' ? (
                <Tooltip title={'Administrado por SPJ/RH'} placement="top">
                  <ExportOutlined style={{ color: 'darkgreen' }} />
                </Tooltip>
              ) : (
                <Tooltip title={'Administrado pela SGI'} placement="top">
                  <SafetyCertificateOutlined style={{ color: 'darkgray' }} />
                </Tooltip>
              )}
              {`${record.disposicao ?? ''} ${record.escala ?? ''} ${
                record.escala_grupo ?? ''
              } ${record.classificacao_desc ?? ''}`}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'LOTAÇÃO NO DESLIGAMENTO',
      width: 120,
      dataIndex: 'lotacao',
      key: 'lotacao',
      fixed: 'left',
      sorter: true,
      render: (text, record) => {
        // Calcular a idade a partir da data de nascimento

        const getTelefoneDepartamento = (
          servidoresArray: DataTypeServidores,
        ) => {
          // Lógica para encontrar o departamento desejado, por exemplo, aqui estou considerando o primeiro departamento do array
          if (servidoresArray.lotacao) {
            const primeiroDepartamento: any = servidoresArray.lotacao;
            return primeiroDepartamento.telefone;
          } else {
            return '?';
          }
        };

        return (
          <div>
            <div>
              {record.lotacao_anterior && record.lotacao_anterior.length > 2 ? (
                <Tooltip
                  title={`Lotação anterior: ${record.lotacao_anterior}`}
                  placement="top"
                >
                  <span style={{ fontWeight: 'bold', color: 'black' }}>
                    {text}
                  </span>
                </Tooltip>
              ) : (
                <span style={{ fontWeight: 'bold', color: 'black' }}>
                  {text}
                </span>
              )}
            </div>

            <div>
              <span style={{ fontWeight: 'normal', color: 'darkgray' }}>
                {record.municipio_lotacao}
              </span>
              {getTelefoneDepartamento(record) ? (
                <span
                  style={{
                    fontWeight: 'bold',
                    color: 'black',
                    marginLeft: 10,
                  }}
                >
                  <Tooltip
                    title={
                      getTelefoneDepartamento(record) +
                      '. Clique para falar via WhatsappWeb.'
                    }
                    placement="top"
                  >
                    <a
                      href={`https://web.whatsapp.com/send?phone=+55${getTelefoneDepartamento(
                        record,
                      )}&text=Falo com ${
                        record.nome
                      }, tudo bem com vcs? Aqui quem fala é ${auth?.user
                        ?.nome} da ${auth?.user?.unidade?.sigla} `}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'darkgreen' }}
                    >
                      <WhatsAppOutlined style={{ color: 'green' }} />{' '}
                      {getTelefoneDepartamento(record)}
                    </a>
                  </Tooltip>
                </span>
              ) : (
                ''
              )}
            </div>

            <div>
              <span style={{ fontWeight: 'normal', color: 'balck' }}>
                {record.idade_lotacao} anos desde a Lotação
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: '',
      key: '',
      fixed: 'right',
      width: 50,
      render: (text, record) => (
        <div>
          <div>
            {record.restricao_arma === true && (
              <span style={{ color: 'black' }}>
                <StopOutlined style={{ color: 'red' }} />
                Arma
              </span>
            )}
            {record.restricao_medica === true && (
              <span style={{ color: 'black' }}>
                <MedicineBoxOutlined style={{ color: 'darkred' }} />
                Saúde
              </span>
            )}
            {record.restricao_judicial === true && (
              <span style={{ color: 'black' }}>
                <FileProtectOutlined style={{ color: 'purple' }} />
                Judicial
              </span>
            )}
          </div>
          <div></div>
        </div>
      ),
    },
  ];

  /**************************************************************************
   * **********************************SERVIDORES**********************
   * ************************************************************************/
  type ServidoresSortKeys = keyof DataTypeServidores;

  const onChangeServidores = (pagination: any, filters: any, sorter: any) => {
    // Verifique se existe um campo sorter e se o sorter tem uma chave válida
    if (
      sorter &&
      sorter.columnKey &&
      Object.keys(sorter.columnKey).includes(sorter.columnKey)
    ) {
      const { columnKey, order } = sorter;

      // Use a chave válida para ordenar os dados
      const sortedData = ServidoresObservatorioTable.sort((a, b) => {
        // Use operador condicional para evitar 'undefined'
        const valueA = a[columnKey as ServidoresSortKeys] ?? ''; // Valor padrão caso seja undefined
        const valueB = b[columnKey as ServidoresSortKeys] ?? ''; // Valor padrão caso seja undefined

        if (order === 'ascend') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });

      // Atualize o dataSource com os dados ordenados
      setServidoresObservatorioTable([...sortedData]);
    }
  };

  const columnsServidores: ColumnsType<DataTypeServidores> = [
    {
      title: 'SERVIDOR',
      width: 120,
      dataIndex: 'nome',
      key: 'nome',
      fixed: 'left',
      sorter: true,
      render: (text, record) => {
        // Calcular a idade a partir da data de nascimento
        return (
          <div>
            <div>
              <span>
                <span
                  style={{
                    fontWeight: 'bold',
                    color:
                      record.genero === 'MASCULINO' ? 'darkblue' : 'darkred',
                  }}
                >
                  {record.genero === 'MASCULINO' ? (
                    <ManOutlined style={{ color: 'blue', marginRight: 5 }} />
                  ) : (
                    <WomanOutlined style={{ color: 'red', marginRight: 5 }} />
                  )}
                  {text}
                </span>
              </span>
            </div>

            <div>
              <span style={{ fontWeight: 'normal', color: 'darkgray' }}>
                <span>
                  {record.chefia != 'NAO' && (
                    <Tooltip
                      title={'Exerce Chefia ' + record.chefia_desc}
                      placement="top"
                    >
                      <CoffeeOutlined style={{ color: 'brown' }} />
                    </Tooltip>
                  )}
                </span>
                {record.idade} anos de idade
              </span>
            </div>

            <div>
              <span style={{ fontWeight: 'normal', color: 'balck' }}>
                {record.probatorio == 'S' && (
                  <Tooltip title={'Em Estágio Probatório'} placement="top">
                    <IssuesCloseOutlined style={{ color: 'orange' }} />
                  </Tooltip>
                )}
                {record.idade_posse} anos desde a Posse
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: 'CONTATOS',
      width: 70,
      dataIndex: 'nome',
      key: 'nome',
      fixed: 'left',
      sorter: true,
      render: (text, record) => {
        // Calcular a idade a partir da data de nascimento
        return (
          <div>
            <div>
              <span>
                <span style={{ fontWeight: 'bold', color: 'darkgreen' }}>
                  {record.celular && record.celular.length > 6 ? (
                    <Tooltip
                      title={`Clique para falar Whatsapp web`}
                      placement="top"
                    >
                      <a
                        href={`https://web.whatsapp.com/send?phone=+55${record.celular}&text=${record.nome}, tudo bem com vc? Aqui quem fala é ${auth?.user?.nome} da ${auth?.user?.unidade?.sigla} `}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'darkgreen' }}
                      >
                        <WhatsAppOutlined style={{ color: 'green' }} />{' '}
                        {record.celular}
                      </a>
                    </Tooltip>
                  ) : (
                    '-'
                  )}
                </span>
              </span>
            </div>
            <div>
              <span style={{ fontWeight: 'normal', color: 'black' }}>
                {record.email ? `${record.email.toLowerCase()}` : '-'}
              </span>
            </div>
            <div>
              <span style={{ fontWeight: 'normal', color: 'black' }}>
                {record.telefone && record.telefone.length > 6 ? (
                  <Tooltip
                    title={`Clique para falar Whatsapp web`}
                    placement="top"
                  >
                    <a
                      href={`https://web.whatsapp.com/send?phone=+55${record.telefone}&text=${record.nome}, tudo bem com vc? Aqui quem fala é ${auth?.user?.nome} da ${auth?.user?.unidade?.sigla} `}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'darkgreen' }}
                    >
                      <WhatsAppOutlined style={{ color: 'green' }} />{' '}
                      {record.telefone}
                    </a>
                  </Tooltip>
                ) : (
                  '-'
                )}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: 'CARGO',
      width: 100,
      dataIndex: 'funcao',
      key: 'funcao',
      fixed: 'left',
      sorter: true,
      render: (text, record) => (
        <div>
          <div>
            <span>
              <span style={{ fontWeight: 'bold', color: 'blue' }}>{text}</span>
            </span>
          </div>

          <div>
            <span style={{ fontWeight: 'normal', color: 'black' }}>
              {record.cargo}
            </span>
          </div>

          <div>
            {!record.classificacao || record.classificacao === '' ? (
              <Tooltip
                title={'Informe a Classificação do Servidor'}
                placement="top"
              >
                <span style={{ fontWeight: 'bold', color: 'darkred' }}>
                  <QuestionCircleOutlined style={{ color: 'red' }} />
                </span>
              </Tooltip>
            ) : (
              <span style={{ fontWeight: 'bold', color: 'black' }}>
                <CheckCircleOutlined style={{ color: 'darkgreen' }} />
                {record.classificacao_desc}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'LOTAÇÃO',
      width: 120,
      dataIndex: 'lotacao',
      key: 'lotacao',
      fixed: 'left',
      sorter: true,
      render: (text, record) => {
        // Calcular a idade a partir da data de nascimento

        const getTelefoneDepartamento = (
          servidoresArray: DataTypeServidores,
        ) => {
          // Lógica para encontrar o departamento desejado, por exemplo, aqui estou considerando o primeiro departamento do array
          if (servidoresArray.lotacao) {
            const primeiroDepartamento: any = servidoresArray.lotacao;
            return primeiroDepartamento.telefone;
          } else {
            return '?';
          }
        };

        return (
          <div>
            <div>
              {record.lotacao_anterior && record.lotacao_anterior.length > 2 ? (
                <Tooltip
                  title={`Lotação anterior: ${record.lotacao_anterior}`}
                  placement="top"
                >
                  <span style={{ fontWeight: 'bold', color: 'black' }}>
                    {text}
                  </span>
                </Tooltip>
              ) : (
                <span style={{ fontWeight: 'bold', color: 'black' }}>
                  {text}
                </span>
              )}
            </div>

            <div>
              <span style={{ fontWeight: 'normal', color: 'darkgray' }}>
                {record.municipio_lotacao}
              </span>
              {getTelefoneDepartamento(record) ? (
                <span
                  style={{
                    fontWeight: 'bold',
                    color: 'black',
                    marginLeft: 10,
                  }}
                >
                  <Tooltip
                    title={
                      getTelefoneDepartamento(record) +
                      '. Clique para falar via WhatsappWeb.'
                    }
                    placement="top"
                  >
                    <a
                      href={`https://web.whatsapp.com/send?phone=+55${getTelefoneDepartamento(
                        record,
                      )}&text=Falo com ${
                        record.nome
                      }, tudo bem com vcs? Aqui quem fala é ${auth?.user
                        ?.nome} da ${auth?.user?.unidade?.sigla} `}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'darkgreen' }}
                    >
                      <WhatsAppOutlined style={{ color: 'green' }} />{' '}
                      {getTelefoneDepartamento(record)}
                    </a>
                  </Tooltip>
                </span>
              ) : (
                ''
              )}
            </div>

            <div>
              <span style={{ fontWeight: 'normal', color: 'black' }}>
                {record.administracao != 'SGI' ? (
                  <Tooltip title={'Administrado por SPJ/RH'} placement="top">
                    <ExportOutlined style={{ color: 'darkgreen' }} />
                  </Tooltip>
                ) : (
                  <Tooltip title={'Administrado pela SGI'} placement="top">
                    <SafetyCertificateOutlined style={{ color: 'darkgray' }} />
                  </Tooltip>
                )}
                {`${record.disposicao ?? ''} ${record.escala ?? ''} ${
                  record.escala_grupo ?? ''
                } ${record.idade_lotacao} anos desde a Lotação`}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      title: '',
      key: '',
      fixed: 'right',
      width: 50,
      render: (text, record) => (
        <div>
          <div>
            {record.restricao_arma === true && (
              <span style={{ color: 'black' }}>
                <StopOutlined style={{ color: 'red' }} />
                Arma
              </span>
            )}
            {record.restricao_medica === true && (
              <span style={{ color: 'black' }}>
                <MedicineBoxOutlined style={{ color: 'darkred' }} />
                Saúde
              </span>
            )}
            {record.restricao_judicial === true && (
              <span style={{ color: 'black' }}>
                <FileProtectOutlined style={{ color: 'purple' }} />
                Judicial
              </span>
            )}
          </div>
          <div>
            <a onClick={() => EditarServidorClick(record)}>
              <Button type="primary" style={{ backgroundColor: 'darkgreen' }}>
                <EditOutlined />
                Editar
              </Button>
            </a>
          </div>
          <div>
            {Array.isArray(auth?.user?.perfisSistemaAtual) &&
            auth?.user?.perfisSistemaAtual.includes('ADMIN') ? null : (
              <Button
                type="primary"
                onClick={() => ArquivoIncluirButton(record)}
                style={{
                  backgroundColor:
                    record.qtd_dossie === 0 ? '#909090' : '#4168c4',
                  marginTop: 10,
                }}
              >
                <CloudUploadOutlined />
                {record.qtd_dossie === 0
                  ? 'Dossiê'
                  : 'Dossiê (' + record.qtd_dossie + ')'}
              </Button>
            )}
          </div>
        </div>
      ),
    },
  ];

  /**************************************************************************
   * **********************************SERVIDORES MODAL**********************
   * ************************************************************************/
  const getSituacaoColor = (situacao: string | undefined): string => {
    if (!situacao) return 'black'; // default color if situacao is empty

    if (situacao.includes('DISPOSI') || situacao.includes('VAC')) {
      return 'darkgreen';
    }
    if (situacao.includes('EXERC')) {
      return 'darkblue';
    }
    if (situacao.includes('APOSENTA')) {
      return 'darkgray';
    }
    if (situacao.includes('FALECIM')) {
      return 'gray';
    }
    if (situacao.includes('AFASTAMEN')) {
      return 'brown';
    }
    if (
      situacao.includes('EXCLUS') ||
      situacao.includes('EXONERA') ||
      situacao.includes('RESCIS') ||
      situacao.includes('DEMISS') ||
      situacao.includes('CASSA')
    ) {
      return 'red';
    }
    return 'black'; // default color for any other value
  };

  const EditarServidorClick = (record: DataTypeServidores) => {
    let xgenero = 'darkblue';
    if (record.genero === 'FEMININO') {
      xgenero = 'darkred';
    }
    setModalServidorTitulo(`
      <span style="font-weight: bold; color: ${xgenero};">
        ${record.nome}
      </span>
      <span style="font-weight: bold; color: black; margin-left: 15px;">
        ${record.cargo}
      </span>
    `);

    form_servidores.setFieldValue('servidor_id', record.id);
    form_servidores.setFieldValue('servidor', record.nome);
    form_servidores.setFieldValue('classificacao', record.classificacao);
    //form_servidores.setFieldValue('departamento_id_2', record.lotacao_id);
    //form_servidores.setFieldValue('departamento_2', record.lotacao);
    form_servidores.setFieldValue('cpf', record.cpf);
    form_servidores.setFieldValue('sicad_id', record.sicad_id);
    form_servidores.setFieldValue('celular', record.celular);
    form_servidores.setFieldValue('telefone', record.telefone);
    form_servidores.setFieldValue('email', record.email);
    form_servidores.setFieldValue('lotacao_atual', record.lotacao);
    form_servidores.setFieldValue('serv_escala', record.escala);
    form_servidores.setFieldValue('escala_grupo', record.escala_grupo);
    form_servidores.setFieldValue('chefia', record.chefia);
    form_servidores.setFieldValue('restricao_sei', record.restricao_sei);
    form_servidores.setFieldValue('restricao_arma', record.restricao_arma);
    form_servidores.setFieldValue('restricao_medica', record.restricao_medica);

    form_servidores.setFieldValue('nome_mae', record.nome_mae);
    form_servidores.setFieldValue('regime_juridico', record.regime_juridico);
    form_servidores.setFieldValue('naturalidade', record.naturalidade);
    form_servidores.setFieldValue('cor_raca', record.cor_raca);
    form_servidores.setFieldValue('escolaridade', record.escolaridade);
    form_servidores.setFieldValue('especialidade', record.especialidade);
    form_servidores.setFieldValue('estado_civil', record.estado_civil);
    form_servidores.setFieldValue('situacao', record.situacao);
    form_servidores.setFieldValue('pne', record.pne);
    form_servidores.setFieldValue('sub_judice', record.sub_judice);
    form_servidores.setFieldValue('probatorio', record.probatorio);
    form_servidores.setFieldValue('dta_posse', record.dta_posse_br);
    form_servidores.setFieldValue('dta_nomeacao', record.dta_nomeacao_br);
    form_servidores.setFieldValue(
      'dta_inicio_lotacao',
      record.dta_inicio_lotacao_br,
    );

    form_servidores.setFieldValue(
      'restricao_judicial',
      record.restricao_judicial,
    );
    form_servidores.setFieldValue('restricao_obs', record.restricao_obs);
    form_servidores.setFieldValue(
      'dta_posse',
      record.dta_posse_br + ' (' + record.idade_posse + ')',
    );
    form_servidores.setFieldValue(
      'dta_lotacao',
      record.dtai_br + ' (' + record.idade_lotacao + ')',
    );
    setlabelServidorDoc(
      'CPF: ' +
        record.cpf +
        ' - Matrícula Funcional: ' +
        record.matricula_funcional,
    );
    form_servidores.setFieldValue(
      'dta_nascimento',
      record.dta_nascimento_br + ' (' + record.idade + ' Anos)',
    );

    form_servidores.setFieldValue('funcao', record.funcao);
    ModalServidorShowNovo();
  };

  const [labelServidorDoc, setlabelServidorDoc] = useState('');
  const [ModalServidorTitulo, setModalServidorTitulo] = useState('');

  ///////////////////////////////////////////////////////////////////////////COMBO BOX PERSONALIZADO

  const customLabel = (value: any) => {
    switch (value) {
      case 'ATIVO':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            {value}
          </span>
        );
      case 'DESLIGADO':
        return (
          <span style={{ color: 'red', fontWeight: 'bold' }}>{value}</span>
        );
      case 'AFASTADO':
        return (
          <span style={{ color: 'red', fontWeight: 'bold' }}>{value}</span>
        );
      case 'ATESTADO MÉDICO':
        return (
          <span style={{ color: 'orange', fontWeight: 'bold' }}>{value}</span>
        );
      case 'LICENÇA MÉDICA':
        return (
          <span style={{ color: 'orange', fontWeight: 'bold' }}>{value}</span>
        );
      case 'OMP NESTA DP':
        return (
          <span style={{ color: 'blue', fontWeight: 'bold' }}>{value}</span>
        );
      case 'OMP OUTRA DP':
        return (
          <span style={{ color: 'blue', fontWeight: 'bold' }}>{value}</span>
        );
      default:
        return (
          <span style={{ color: 'brown', fontWeight: 'bold' }}>{value}</span>
        );
    }
  };

  const customLabel2 = (value: any) => {
    switch (value) {
      case 'LOCAL':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            {value}
          </span>
        );
      case 'EXTERNO':
        return (
          <span style={{ color: 'darkred', fontWeight: 'bold' }}>{value}</span>
        );
    }
  };

  const customLabelArma = (value: any) => {
    switch (value) {
      case false:
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>NÃO</span>
        );
      case true:
        return (
          <span style={{ color: 'darkred', fontWeight: 'bold' }}>
            Sim
            <StopOutlined style={{ color: 'red' }} />
          </span>
        );
    }
  };

  ////////////////////////////////////////////////////////////////////////////FILTROS PRÉ ESTABELECIDOS COMBO

  const customLabelRelatorioModelo = (value: any) => {
    switch (value) {
      case 'SERVIDORES':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <TeamOutlined style={{ color: 'darkgreen', marginRight: 10 }} />
            Servidores
          </span>
        );
      case 'DEPARTAMENTOS':
        return (
          <span style={{ color: 'darkred', fontWeight: 'bold' }}>
            <BankOutlined style={{ color: 'darkgray', marginRight: 10 }} />
            Departamentos
          </span>
        );
    }
  };

  /*const OptionsFiltroRelatoriosColunas = [
    'SER_nome',
    'SER_lotacao',
    'SER_cargo',
    'SER_funcao',
    'SER_genero',
    'SER_vinculo',
    'SER_vinculo_desc',
    'SER_celular',
    'SER_telefone',
    'SER_email',
    'SER_cpf',
    'SER_dta_nascimento_br',
    'SER_idade',
    'SER_dtai_br',
    'SER_dtaf_br',
    'SER_temporario_espirou',
    'SER_indicacao',
    'SER_indicacao_obs',
    'SER_chefia',
    'SER_chefia_desc',
    'SER_fun_cad',
    'SER_status_desc',
    'SER_disposicao',
    'SER_escala',
    'SER_escala_grupo',
    'SER_restricao_arma',
    'SER_restricao_medica',
    'SER_restricao_judicial',
    'SER_restricao_sei',
    'SER_restricao_obs',
    'SER_municipio_lotacao',
    'SER_situacao',
    'SER_matricula_funcional',
    'SER_dta_posse_br',
    'SER_idade_posse',
    'SER_idade_lotacao',
    'SER_administracao',
    'DEP_title',
    'DEP_hierarquia',
    'DEP_sigla',
    'DEP_municipio',
    'DEP_censo_vinte_tres',
    'DEP_tipo',
    'DEP_especializacao',
    'DEP_telefone',
    'DEP_telefone2',
    'DEP_telefone3',
    'DEP_endereco',
    'DEP_nome_superior_hierarquia',
    'DEP_superior_sicad',
    'DEP_portaria',
    'DEP_servidores_qtd',
    'DEP_servidores_agentes',
    'DEP_servidores_delegados',
    'DEP_servidores_escrivaes',
    'DEP_servidores_outros',
    'DEP_qtd_municipios',
    'DEP_departamento_grupo',
    'DEP_grupo_cidade',
    'DEP_grupo_titular',
    'DEP_grupo_titular_celular',
    'DEP_titular',
    'DEP_titular_abreviado',
    'DEP_interino_abreviado',
    'DEP_chefe_cartorio_interino_abreviado',
    'DEP_chefe_cartorio_abreviado',
    'DEP_titular_celular',
    'DEP_titular_telefone',
    'DEP_titular_email',
    'DEP_titular_interino',
    'DEP_titular_interino_celular',
    'DEP_titular_interino_telefone',
    'DEP_titular_interino_email',
    'DEP_chefe_cartorio',
    'DEP_chefe_cartorio_celular',
    'DEP_chefe_cartorio_telefone',
    'DEP_chefe_cartorio_email',
    'DEP_chefe_cartorio_interino',
    'DEP_chefe_cartorio_interino_celular',
    'DEP_chefe_cartorio_interino_telefone',
    'DEP_chefe_cartorio_interino_email',
    'DEP_escala',
  ];*/

  const OptionsFiltroRelatoriosColunasServidores = [
    'REL_nome',
    'REL_classificacao',
    'REL_cargo',
    'REL_funcao',
    'REL_lotacao',
    'REL_lotacao_sigla',
    'REL_dep_hierarquia',
    'REL_dep_tipo',
    'REL_dep_especializacao',
    'REL_dep_telefone',
    'REL_dep_telefone2',
    'REL_dep_telefone3',
    'REL_dep_escala',
    'REL_departamento_grupo',
    'REL_titular',
    'REL_titular_celular',
    'REL_titular_telefone',
    'REL_genero',
    'REL_vinculo',
    'REL_vinculo_desc',
    'REL_celular',
    'REL_telefone',
    'REL_email',
    'REL_cpf',
    'REL_dta_nascimento_br',
    'REL_idade',
    'REL_dtai_br',
    'REL_dtaf_br',
    'REL_temporario_espirou',
    'REL_indicacao',
    'REL_indicacao_obs',
    'REL_chefia',
    'REL_chefia_desc',
    'REL_fun_cad',
    'REL_status_desc',
    'REL_disposicao',
    'REL_escala',
    'REL_escala_grupo',
    'REL_restricao_arma',
    'REL_restricao_medica',
    'REL_restricao_judicial',
    'REL_restricao_sei',
    'REL_restricao_obs',
    'REL_municipio_lotacao',
    'REL_situacao',
    'REL_matricula_funcional',
    'REL_dta_posse_br',
    'REL_idade_posse',
    'REL_idade_lotacao',
    'REL_administracao',
    'REL_id',
  ];

  const [
    selectedItemsRelatoriosColunasServidores,
    setSelectedItemsRelatoriosColunasServidores,
  ] = useState<string[]>([]);

  const filteredOptionsReletoriosColunasServidores =
    OptionsFiltroRelatoriosColunasServidores.filter(
      o => !selectedItemsRelatoriosColunasServidores.includes(o),
    );

  const customLabelFiltroRelatoriosColunasServidores = (value: any) => {
    let IconComponent = TeamOutlined; // Componente do ícone a ser usado dinamicamente

    // Configuração dinâmica do ícone
    let xiconConfig = {
      color: 'darkgreen',
      marginRight: 10,
      title: 'Campo do Servidor',
    };

    switch (value) {
      // Tabela Servidor
      case 'REL_nome':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Nome'}
          </span>
        );

      case 'REL_classificacao':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Classificação/Cargo'}
          </span>
        );

      case 'REL_cargo':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Cargo Sicad'}
          </span>
        );
      case 'REL_funcao':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Função Sicad'}
          </span>
        );
      case 'REL_lotacao':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Lotação'}
          </span>
        );
      case 'REL_lotacao_sigla':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Lotação Sigla'}
          </span>
        );
      case 'REL_dep_hierarquia':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Dep. Hierarquia'}
          </span>
        );
      case 'REL_dep_tipo':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Dep. Tipo'}
          </span>
        );
      case 'REL_dep_especializacao':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Dep. Especialização'}
          </span>
        );
      case 'REL_dep_telefone':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Dep. Telefone'}
          </span>
        );
      case 'REL_dep_telefone2':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Dep. Telefone 2'}
          </span>
        );
      case 'REL_dep_telefone3':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Dep. Telefone 3'}
          </span>
        );
      case 'REL_dep_escala':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Dep. Escala'}
          </span>
        );
      case 'REL_departamento_grupo':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Dep. Grupo'}
          </span>
        );
      case 'REL_titular':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Dep. Titular'}
          </span>
        );
      case 'REL_titular_celular':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Dep. Titular Celular'}
          </span>
        );
      case 'REL_titular_telefone':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Dep. Titular telefone'}
          </span>
        );
      case 'REL_genero':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Genero'}
          </span>
        );
      case 'REL_vinculo':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Vínculo'}
          </span>
        );
      case 'REL_vinculo_desc':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Descrição do Vínculo'}
          </span>
        );
      case 'REL_celular':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Celular'}
          </span>
        );
      case 'REL_telefone':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Telefone Fixo'}
          </span>
        );
      case 'REL_email':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Email'}
          </span>
        );
      case 'REL_cpf':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'CPF'}
          </span>
        );
      case 'REL_dta_nascimento_br':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Data de Nascimento'}
          </span>
        );
      case 'REL_idade':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Idade'}
          </span>
        );
      case 'REL_dtai_br':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Início da Lotação'}
          </span>
        );
      case 'REL_dtaf_br':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Fim da Lotação'}
          </span>
        );
      case 'REL_temporario_espirou':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Contrato Expirado'}
          </span>
        );
      case 'REL_indicacao':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Indicação'}
          </span>
        );
      case 'REL_indicacao_obs':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Observação de Indicação'}
          </span>
        );
      case 'REL_chefia':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Chefe?'}
          </span>
        );
      case 'REL_chefia_desc':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Descrição da Chefia'}
          </span>
        );
      case 'REL_fun_cad':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Função de Cadastro'}
          </span>
        );
      case 'REL_status_desc':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Descrição de Status'}
          </span>
        );
      case 'REL_ac4_prevista':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'AC4 Prevista'}
          </span>
        );
      case 'REL_disposicao':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Disposição'}
          </span>
        );
      case 'REL_escala':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Escala'}
          </span>
        );
      case 'REL_escala_grupo':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Escala de Grupo'}
          </span>
        );
      case 'REL_restricao_arma':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Restrição à arma'}
          </span>
        );
      case 'REL_restricao_medica':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Restrição Médica'}
          </span>
        );
      case 'REL_restricao_judicial':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Restrição Judicial'}
          </span>
        );
      case 'REL_restricao_sei':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Restrição SEI'}
          </span>
        );
      case 'REL_restricao_obs':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Observação da Restrição'}
          </span>
        );
      case 'REL_municipio_lotacao':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Município de Lotação'}
          </span>
        );
      case 'REL_situacao':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Situção'}
          </span>
        );
      case 'REL_matricula_funcional':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Matrícula Funcional'}
          </span>
        );
      case 'REL_dta_posse_br':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Data da Posse'}
          </span>
        );
      case 'REL_idade_posse':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Anos de Instituição'}
          </span>
        );
      case 'REL_idade_lotacao':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Anos na Lotação'}
          </span>
        );
      case 'REL_administracao':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Administração'}
          </span>
        );
      case 'REL_id':
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />
            {'Id'}
          </span>
        );
      default:
        return (
          <span
            style={{ color: 'darkblue', fontWeight: 'bold' }}
            title="Filtra departamentos e servidores"
          >
            {value}
          </span>
        );
    }
  };

  const OptionsFiltroRelatoriosColunasDepartamentos = [
    'REL_title',
    'REL_hierarquia',
    'REL_sigla',
    'REL_municipio',
    'REL_censo_vinte_tres',
    'REL_tipo',
    'REL_especializacao',
    'REL_telefone',
    'REL_telefone2',
    'REL_telefone3',
    'REL_endereco',
    'REL_nome_superior_hierarquia',
    'REL_superior_sicad',
    'REL_portaria',
    'REL_servidores_qtd',
    'REL_servidores_agentes',
    'REL_servidores_delegados',
    'REL_servidores_escrivaes',
    'REL_servidores_outros',
    'REL_qtd_municipios',
    'REL_departamento_grupo',
    'REL_grupo_cidade',
    'REL_grupo_titular',
    'REL_grupo_titular_celular',
    'REL_titular',
    'REL_titular_abreviado',
    'REL_interino_abreviado',
    'REL_chefe_cartorio_interino_abreviado',
    'REL_chefe_cartorio_abreviado',
    'REL_titular_celular',
    'REL_titular_telefone',
    'REL_titular_email',
    'REL_titular_interino',
    'REL_titular_interino_celular',
    'REL_titular_interino_telefone',
    'REL_titular_interino_email',
    'REL_chefe_cartorio',
    'REL_chefe_cartorio_celular',
    'REL_chefe_cartorio_telefone',
    'REL_chefe_cartorio_email',
    'REL_chefe_cartorio_interino',
    'REL_chefe_cartorio_interino_celular',
    'REL_chefe_cartorio_interino_telefone',
    'REL_chefe_cartorio_interino_email',
    'REL_escala',
    'REL_id',
  ];

  const [
    selectedItemsRelatoriosColunasDepartamentos,
    setSelectedItemsRelatoriosColunasDepartamentos,
  ] = useState<string[]>([]);

  const filteredOptionsReletoriosColunasDepartamentos =
    OptionsFiltroRelatoriosColunasDepartamentos.filter(
      o => !selectedItemsRelatoriosColunasDepartamentos.includes(o),
    );

  const customLabelFiltroRelatoriosColunasDepartamentos = (value: any) => {
    let IconComponent = BankOutlined; // Componente do ícone a ser usado dinamicamente

    // Configuração dinâmica do ícone
    let xiconConfig = {
      color: 'darkgray',
      marginRight: 10,
      title: 'Campo do Servidor',
    };

    switch (value) {
      // Tabela Servidor
      case 'REL_title':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Nome'}
          </span>
        );
      case 'REL_hierarquia':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Hierarquia'}
          </span>
        );
      case 'REL_telefone':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Telefone'}
          </span>
        );
      case 'REL_sigla':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Sigla'}
          </span>
        );
      case 'REL_municipio':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Município'}
          </span>
        );
      case 'REL_censo_vinte_tres':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Censo de 2023'}
          </span>
        );
      case 'REL_tipo':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Tipo'}
          </span>
        );
      case 'REL_especializacao':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Especialização'}
          </span>
        );
      case 'REL_telefone2':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Telefone 2'}
          </span>
        );
      case 'REL_telefone3':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Telefone 3'}
          </span>
        );
      case 'REL_endereco':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Endereço'}
          </span>
        );
      case 'REL_nome_superior_hierarquia':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Nome Superior Hierarquia'}
          </span>
        );
      case 'REL_superior_sicad':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Superior Sicad'}
          </span>
        );
      case 'REL_portaria':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Portaria Hierarquia'}
          </span>
        );
      case 'REL_servidores_qtd':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Quantidade Servidores'}
          </span>
        );
      case 'REL_servidores_agentes':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Qde. Agentes'}
          </span>
        );
      case 'REL_servidores_delegados':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Qtde. Delegados'}
          </span>
        );
      case 'REL_servidores_escrivaes':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Qtde Escrivães'}
          </span>
        );
      case 'REL_servidores_outros':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Qtde Outros Servidores'}
          </span>
        );
      case 'REL_qtd_municipios':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Qtde Municípios'}
          </span>
        );
      case 'REL_departamento_grupo':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Nome do Grupo Departamento'}
          </span>
        );
      case 'REL_grupo_cidade':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Grrupo Cidade Departamento'}
          </span>
        );
      case 'REL_grupo_titular':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Nome do Grupo Titular'}
          </span>
        );
      case 'REL_grupo_titular_celular':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Celular do Titular do Grupo'}
          </span>
        );
      case 'REL_titular':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Nome Titular do Departamento'}
          </span>
        );
      case 'REL_titular_abreviado':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Nome abreviado do Titular'}
          </span>
        );
      case 'REL_interino_abreviado':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Nome do Interino abreviado'}
          </span>
        );
      case 'REL_chefe_cartorio_interino_abreviado':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Chefe de Cartorio Interino Abreviado'}
          </span>
        );
      case 'REL_chefe_cartorio_abreviado':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Chefe Cartorio Abreviado'}
          </span>
        );
      case 'REL_titular_celular':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Celular do Titular'}
          </span>
        );
      case 'REL_titular_telefone':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Telefone Fixo do Titular'}
          </span>
        );
      case 'REL_titular_email':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Email do Titular'}
          </span>
        );
      case 'REL_titular_interino':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Titular Interino'}
          </span>
        );
      case 'REL_titular_interino_celular':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Celular do Titular Interino'}
          </span>
        );
      case 'REL_titular_interino_telefone':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Telefone do Titular Interino'}
          </span>
        );
      case 'REL_titular_interino_email':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Email do Titular Interino'}
          </span>
        );
      case 'REL_chefe_cartorio':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Chefe de Cartorio'}
          </span>
        );
      case 'REL_chefe_cartorio_celular':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Celular do Chefe de Cartorio'}
          </span>
        );
      case 'REL_chefe_cartorio_telefone':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Telefone do Chefe de Cartorio'}
          </span>
        );
      case 'REL_chefe_cartorio_email':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Email do Chefe de Cartorio'}
          </span>
        );
      case 'REL_chefe_cartorio_interino':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Nome do Chefe Interino do Cartorio'}
          </span>
        );
      case 'REL_chefe_cartorio_interino_celular':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Celular do Chefe de Cartorio Interino'}
          </span>
        );
      case 'REL_chefe_cartorio_interino_telefone':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Telefone fixo do Chefe de Cartório Interino'}
          </span>
        );
      case 'REL_chefe_cartorio_interino_email':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Email do Chefe de Cartório Interino'}
          </span>
        );
      case 'REL_escala':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Escala'}
          </span>
        );
      case 'REL_id':
        return (
          <span style={{ color: 'darkblue', fontWeight: 'bold' }}>
            <IconComponent {...xiconConfig} style={{ marginRight: 10 }} />

            {'Id'}
          </span>
        );
      default:
        return (
          <span
            style={{ color: 'darkblue', fontWeight: 'bold' }}
            title="Filtra departamentos e servidores"
          >
            {value}
          </span>
        );
    }
  };

  const customLabelRelatorioOrientacao = (value: any) => {
    switch (value) {
      case 'landscape':
        return (
          <span style={{ color: 'darkgreen' }}>
            <ColumnWidthOutlined
              style={{ color: 'darkgreen', marginRight: 10 }}
            />
            Paisagem
          </span>
        );
      case 'portrait':
        return (
          <span style={{ color: 'darkblue' }}>
            <ColumnHeightOutlined
              style={{ color: 'darkblue', marginRight: 10 }}
            />
            Retrato
          </span>
        );
    }
  };

  const customLabelDepHierarquia = (value: any) => {
    switch (value) {
      case 'HIERARQUIA':
        return (
          <span
            style={{ color: 'darkgreen', fontWeight: 'bold' }}
            title="Realiza a consulta de servidores retornando os servidores do departamento escolhido e das unidades hierarquicamente abaixo"
          >
            <ApartmentOutlined style={{ color: 'darkgreen' }} />
            Hierarquia
          </span>
        );
      case 'DEPARTAMENTO':
        return (
          <span
            style={{ color: 'darkblue', fontWeight: 'bold' }}
            title="Realiza a consulta de servidores retornando os servidores do departamento escolhido"
          >
            <EnvironmentOutlined style={{ color: 'darkblue' }} />
            Departamento
          </span>
        );
    }
  };

  const customLabelSaude = (value: any) => {
    switch (value) {
      case false:
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>NÃO</span>
        );
      case true:
        return (
          <span style={{ color: 'darkred', fontWeight: 'bold' }}>
            Sim
            <MedicineBoxOutlined style={{ color: 'darkred' }} />
          </span>
        );
    }
  };

  const customLabelJudice = (value: any) => {
    switch (value) {
      case 'S':
        return (
          <span style={{ color: 'orange', fontWeight: 'bold' }}>
            Sim
            <FileSearchOutlined style={{ color: 'orange' }} />
          </span>
        );
      case 'N':
        return <span style={{ color: 'black', fontWeight: 'bold' }}>Não</span>;
    }
  };

  const customLabelProbatorio = (value: any) => {
    switch (value) {
      case 'S':
        return (
          <span style={{ color: 'orange', fontWeight: 'bold' }}>
            Sim
            <IssuesCloseOutlined style={{ color: 'orange' }} />
          </span>
        );
      case 'N':
        return <span style={{ color: 'black', fontWeight: 'bold' }}>Não</span>;
    }
  };

  const customLabelJudicial = (value: any) => {
    switch (value) {
      case false:
        return (
          <span style={{ color: 'darkgreen', fontWeight: 'bold' }}>NÃO</span>
        );
      case true:
        return (
          <span style={{ color: 'darkred', fontWeight: 'bold' }}>
            Sim
            <FileProtectOutlined style={{ color: 'purple' }} />
          </span>
        );
    }
  };

  const handleVinculoChange = () => {
    // Atualize o estado com o novo valor selecionado
    if (form_servidores.getFieldValue('vinculo') != 'EFETIVO') {
      if (form_servidores.getFieldValue('funcao') == '') {
        form_servidores.setFieldValue('funcao', '-');
      }
      if (form_servidores.getFieldValue('cargo') == '') {
        form_servidores.setFieldValue('cargo', '-');
      }
    }
  };

  /**************************************************************************
   * **********************************FUNÇÕES SALVAR**************************
   * ************************************************************************/

  const FormServidoresSubmit = async (fieldsValue: any) => {
    //onServidorLoad('salvando seus dados, tenha fé...');

    fieldsValue.user_id = auth?.user?.id;
    fieldsValue.user_nome = auth?.user?.nome;
    fieldsValue.classificacao = form_servidores.getFieldValue('classificacao');
    fieldsValue.serv_escala = form_servidores.getFieldValue('serv_escala');
    fieldsValue.escala_grupo = form_servidores.getFieldValue('escala_grupo');
    fieldsValue.restricao_sei = form_servidores.getFieldValue('restricao_sei');
    fieldsValue.restricao_arma =
      form_servidores.getFieldValue('restricao_arma');
    fieldsValue.restricao_medica =
      form_servidores.getFieldValue('restricao_medica');
    fieldsValue.restricao_obs = form_servidores.getFieldValue('restricao_obs');
    fieldsValue.restricao_judicial =
      form_servidores.getFieldValue('restricao_judicial');
    fieldsValue.chefia = form_servidores.getFieldValue('chefia');
    fieldsValue.escala_grupo = form_servidores.getFieldValue('escala_grupo');
    //fieldsValue.lotacao_id = form_servidores.getFieldValue('departamento_id_2');
    //fieldsValue.lotacao = form_servidores.getFieldValue('departamento_2');

    //fieldsValue.chefia = chefiachk;
    //alert(form_servidores.getFieldValue('classificacao'));

    await apiServidorAtribuicao
      .ServidorUpDados(fieldsValue)
      .then((res: any) => {
        if (res.status == 200) {
          form_servidores.setFieldValue('servidor_id', res.data.id);
          //onConsultaObraAndamento();
          notification.info({ message: res.data.message });
          exitServidorLoad();
        } else {
          exitServidorLoad();
          notification.error({
            message: 'Erro ao salvar Servidor!',
            description: res.data.message,
          });
        }
      });
    //onConsultaObra();
  };

  /**************************************************************************
   * **********************************ORGANOGRAMA**********************
   * ************************************************************************/

  const rowSelectionGrid: TableRowSelection<DataTypeTreeDepartamento> = {
    onChange: (selectedRowKeys, selectedRows) => {
      /*console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows,
      );*/
    },
    onSelect: (record, selected, selectedRows) => {
      //console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      //console.log(selected, selectedRows, changeRows);
    },
  };

  const columnsDepartamentosTree: TableColumnsType<DataTypeTreeDepartamento> = [
    {
      title: 'DEPARTAMENTO',
      width: 120,
      dataIndex: 'title',
      key: 'title',
      fixed: 'left',
      render: (text, record) => (
        <div>
          <div>
            <span>
              <span
                style={{
                  fontWeight: 'bold',
                  color: record.filhos === 0 ? 'black' : 'darkblue',
                }}
              >
                <Tooltip
                  title={`${
                    record.sigla +
                    ' - ' +
                    record.hierarquia +
                    ' Conforme ' +
                    record.portaria +
                    ' - id Sicad ' +
                    record.id
                  }`}
                  placement="top"
                >
                  {record.title}
                </Tooltip>
              </span>
            </span>
          </div>

          <div>
            {/* <a onClick={() => EditarDepartamentoClick(record)}>
              <EditOutlined
                title="Clique aqui para editar o departamento"
                style={{ color: 'darkgreen', cursor: 'pointer' }}
              />
                </a>*/}
          </div>

          <div>
            <span
              style={{ fontWeight: 'normal', color: '#e6e6e6' }}
              title="Quantidade de unidades pertencentes a este departamento."
            >
              {record.filhos === 0 ? '' : record.filhos}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'CIDADE/GRUPO',
      width: 70,
      dataIndex: 'municipio',
      key: 'municipio',
      fixed: 'left',
      //sorter: true,
      render: (text, record) => (
        <div>
          <div>
            <span>
              <span style={{ fontWeight: 'normal', color: 'black' }}>
                <Tooltip title={`${text}`} placement="top">
                  {text}
                </Tooltip>
              </span>
            </span>
          </div>

          <div>
            <span style={{ fontWeight: 'normal', color: 'darkgray' }}>
              {record.tipo === 'OPERACIONAL' ? (
                <Tooltip title={`Dados do Censo 2023`} placement="top">
                  <UserAddOutlined style={{ color: 'blue' }} />
                  {record.censo_vinte_tres
                    ? record.censo_vinte_tres.toLocaleString('pt-BR') +
                      ' Habitantes'
                    : '-'}
                </Tooltip>
              ) : (
                record.tipo
              )}
            </span>
          </div>

          <div>
            {record.telefone ? (
              <span style={{ fontWeight: 'bold', color: 'black' }}>
                <Tooltip
                  title={
                    record.telefone + '. Clique para falar via WhatsappWeb.'
                  }
                  placement="top"
                >
                  <a
                    href={`https://web.whatsapp.com/send?phone=+55${record.telefone}&text=${record.title}, tudo bem com vcs? Aqui quem fala é ${auth?.user?.nome} da ${auth?.user?.unidade?.sigla} `}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'darkgreen' }}
                  >
                    <WhatsAppOutlined style={{ color: 'green' }} />{' '}
                    {record.telefone}
                  </a>
                </Tooltip>
              </span>
            ) : (
              ''
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'SUPERIOR/RESPONSÁVEL',
      width: 70,
      dataIndex: 'nome_superior_hierarquia',
      key: 'nome_superior_hierarquia',
      fixed: 'left',
      //sorter: true,
      render: (text, record) => (
        <div>
          <div>
            <span
              style={{
                fontWeight: 'normal',
                color:
                  record.id_superior_hierarquia === record.idsuperior_sicad
                    ? 'black'
                    : 'darkred',
              }}
            >
              <Tooltip
                title={`Departamento Superior no Sicad: ${record.superior_sicad}`}
                placement="top"
              >
                {text}
              </Tooltip>
            </span>
          </div>

          <div>
            <span
              style={{
                fontWeight: 'normal',
                color:
                  record.id_superior_hierarquia === record.idsuperior_sicad
                    ? 'black'
                    : 'darkred',
              }}
            >
              <Tooltip
                title={`Titular do Departamento Agrupador: ${record.grupo_titular}`}
                placement="top"
              >
                {record.departamento_grupo}
              </Tooltip>
            </span>
          </div>

          <div>
            {record.titular_celular ? (
              <span style={{ fontWeight: 'bold', color: 'black' }}>
                <Tooltip
                  title={
                    record.titular_celular +
                    '. Clique para falar via WhatsappWeb.'
                  }
                  placement="top"
                >
                  <a
                    href={`https://web.whatsapp.com/send?phone=+55${record.titular_celular}&text=${record.titular}, tudo bem com o(a) Senhor(a)? Aqui quem fala é ${auth?.user?.nome} da ${auth?.user?.unidade?.sigla} `}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'darkgreen' }}
                  >
                    <WhatsAppOutlined style={{ color: 'green' }} />
                  </a>
                </Tooltip>
              </span>
            ) : (
              <span
                style={{
                  fontWeight: 'normal',
                  color:
                    record.id_superior_hierarquia === record.idsuperior_sicad
                      ? 'black'
                      : 'darkred',
                }}
              >
                <Tooltip
                  title={`Responsável pelo Departamento`}
                  placement="top"
                >
                  {record.titular}
                </Tooltip>
              </span>
            )}
          </div>
        </div>
      ),
    },
  ];

  const FalarViaWhats = (recebedor: string, phone: string) => {
    const nomeUsuario = auth?.user?.nome;
    const siglaUnidade = auth?.user?.unidade?.sigla;

    const url = `https://web.whatsapp.com/send?phone=+55${phone}&text=${recebedor}, tudo bem com o(a) Senhor(a)? Aqui quem fala é ${nomeUsuario} da ${siglaUnidade}...`;

    window.open(url, '_blank'); // Abrir link em uma nova aba
  };

  const [openDrawerDepartamento, setOpenDrawerDepartamento] = useState(false);

  const showDrawerDepartamento = () => {
    setOpenDrawerDepartamento(true);
  };

  const onCloseDrawerDepartamento = () => {
    setOpenDrawerDepartamento(false);
    GetDadosDepartamentos();
  };

  const [openDrawerDepartamentoFotos, setOpenDrawerDepartamentoFotos] =
    useState(false);

  const showDrawerDepartamentoFotos = () => {
    setOpenDrawerDepartamentoFotos(true);
  };

  const onCloseDrawerDepartamentoFotos = () => {
    setOpenDrawerDepartamentoFotos(false);
    GetDadosDepartamentos();
  };

  const [openDrawerAuditoria, setOpenDrawerAuditoria] = useState(false);

  const showDrawerAuditoria = () => {
    setOpenDrawerAuditoria(true);
  };

  const onCloseDrawerAuditoria = () => {
    setOpenDrawerAuditoria(false);
  };

  const [openDrawerImprimir, setOpenDrawerImprimir] = useState(false);

  const showDrawerImprimir = () => {
    setOpenDrawerImprimir(true);
  };

  const onCloseDrawerImprimir = () => {
    setOpenDrawerImprimir(false);
  };

  const [openDrawerConsulta, setOpenDrawerConsulta] = useState(false);

  const showDrawerConsulta = () => {
    setOpenDrawerConsulta(true);
  };

  const onCloseDrawerConsulta = () => {
    setOpenDrawerConsulta(false);
  };

  const [isButtonTodosGruposVisible, setisButtonTodosGruposVisible] =
    useState(false);

  const handleBadgeClick = (DadosGrupo?: DataTypeGrupo) => {
    if (DadosGrupo && DadosGrupo.grupo_id) {
      LimparGetDadosDepartamentos();
      form_departamentos.setFieldValue(
        'departamento_grupo_id_1',
        DadosGrupo.grupo_id,
      );
      form_departamentos.setFieldValue('departamento_grupo_1', DadosGrupo.nome);

      GetDadosDepartamentos();

      setisButtonTodosGruposVisible(true);

      msg_aviso('Filtrando pelo agrupador ' + DadosGrupo.nome, 'loading');
    }
    //alert('oi');
  };

  function LimparGetDadosDepartamentosComConsulta() {
    LimparGetDadosDepartamentos();
    GetDadosDepartamentos();
    setisButtonTodosGruposVisible(false);
  }

  const ImprimirClick = async () => {
    /* console.log(
      form_departamentos.getFieldValue('zrelatorio_orientacao') +
        ' - ' +
        form_departamentos.getFieldValue('zrelatorio_titulo') +
        ' - ' +
        form_departamentos.getFieldValue('zrelatorio_modelo') +
        ' - ' +
        form_departamentos.getFieldValue('zrelatorio_colunas') +
        ' - ' +
        form_departamentos.getFieldValue('zrelatorio_contador_linhas') +
        ' - ' +
        form_departamentos.getFieldValue('zrelatorio_totalizacao') +
        ' - ' +
        form_departamentos.getFieldValue('zrelatorio_dep_agrupar') +
        ' - ' +
        auth?.user?.unidade?.nome +
        ' - ' +
        auth?.user?.nome +
        ' - ' +
        auth?.user?.cpf,
    );
    */
    generatePdfDinamico(
      form_departamentos.getFieldValue('zrelatorio_orientacao'),
      form_departamentos.getFieldValue('zrelatorio_titulo'),
      form_departamentos.getFieldValue('zrelatorio_modelo'),
      form_departamentos.getFieldValue('zrelatorio_colunas'),
      form_departamentos.getFieldValue('zrelatorio_contador_linhas'),
      form_departamentos.getFieldValue('zrelatorio_totalizacao'),
      form_departamentos.getFieldValue('zrelatorio_dep_agrupar'),
      GruposDadosTable,
      DepartamentosObservatorioTable,
      ServidoresObservatorioTable,
      auth?.user?.unidade?.nome,
      auth?.user?.nome,
      auth?.user?.cpf,
    );
  };

  const ConsultaInativos = async () => {
    onLoadDados('Matando a saudade de quem já partiu...');

    let xdtai = '';
    let xdtaf = '';

    const selectedDateRange =
      form_departamentos.getFieldValue('inativos_cons_data');
    if (selectedDateRange && selectedDateRange.length === 2) {
      const [dataInicial, dataFinal] = selectedDateRange;
      xdtai = dataInicial.format('MM/DD/YYYY');
      xdtaf = dataFinal.format('MM/DD/YYYY');
      //console.log('Data Final:', dataFinal.format('MM/DD/YYYY'));
    }

    await apiServidorAtribuicao
      .listServidores(
        'FIM',
        xdtai,
        xdtaf,
        '',
        '',
        form_departamentos.getFieldValue('inativos_nome_filtro'),
        form_departamentos.getFieldValue('inativos_situacao'),
        '',
        '-',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      )
      .then((res: any) => {
        if (res.status == 200) {
          setServidoresObservatorioInativosTable(res.data.retorno);
        } else {
          notification.error({
            message: 'Erro ao listar Identificações!',
            description: res.data.message,
          });
        }
      });
    exitLoadDados();
  };

  /**************************************************************************
   * **********************************PAGINA RETORNO********************** maxHeight: 'calc(100vh - 150px)',
   * ************************************************************************/
  return (
    <div
      style={{
        overflowY: 'auto',
        marginTop: -40,
      }}
    >
      <Form
        form={form_departamentos}
        layout="vertical"
        initialValues={{
          zcons_data_auditoria: [dayjs(), dayjs()],
          //inativos_cons_data: [dayjs(), dayjs()],
          inativos_cons_data: [],
          inativos_situacao: 'XTODOS_INATIVOS',
          inativos_nome_filtro: '',
          departamento_grupo_id_1: '',
          departamento_grupo_1: '',
          departamento_id_1: '',
          departamento_hierarquia_1: '',
          departamento_1: '',
          departamento_nome_edicao: '',
          dep_telefone: '',
          dep_telefone2: '',
          dep_telefone3: '',
          servidor_id_1: '',
          servidor_1: '',
          servidor_sicad_id_1: '',
          servidor_genero_1: '',
          servidor_cpf_1: '',
          servidor_cargo_1: '',
          servidor_funcao_1: '',
          znome_filtro: '',
          zdp_opcao_and: '',
          zdp_opcao_or: '',
          zrelatorio_colunas: '',
          zrelatorio_modelo: 'SERVIDORES',
          zrelatorio_contador_linhas: 'SIM',
          zrelatorio_totalizacao: 'SIM',
          zrelatorio_dep_agrupar: 'DEPARTAMENTO',
          zrelatorio_titulo: '',
          zrelatorio_orientacao: 'portrait',
          zorder: 'HIERARQUIAeCARGOeSERVIDOR',
          zcpfs: '',
          zdeps_ids: '',
          zfiltros_adcionais: '',
          zcons_classificacao: '',
          departamento_id: '',
          departamento_grupo_id_2: '',
          departamento_grupo_2: '',
          dep_portaria: '',
          dep_hierarquia: '',
          cidade_id_1: '',
          cidade_1: '',
          cidade_id_2: '',
          cidade_2: '',
          dep_escala: '',
          dep_tipo: '',
          dep_especializacao: '',
          servidor_id_2: '',
          servidor_2: '',
          titular_celular: '',
          titular_telefone: '',
          servidor_id_3: '',
          servidor_3: '',
          titular_interino_celular: '',
          titular_interino_telefone: '',
          servidor_id_4: '',
          servidor_4: '',
          chefe_cartorio_celular: '',
          chefe_cartorio_telefone: '',
          servidor_id_5: '',
          servidor_5: '',
          chefe_cartorio_interino_celular: '',
          chefe_cartorio_interino_telefone: '',
          dep_valor_contrato: '0',
          dep_imovel_status: 'PROPRIO',
          zcons_fotos_grupo: 'TODAS',
          fotos_grupo: '',
          arquivo_upload_id: '',
          dep_servidores_modo: 'DEPARTAMENTO',
          legenda_dossie: '',
          arquivo_upload_dossie_id: '',
          arquivo_upload_servidor_id: '',
          dossie_numero_sei: '',
          servidor_porta_arquivo_pasta_1: '',
          servidor_porta_arquivo_pasta_id_1: '',
          arquivo_xls_sicad: '',
        }}
      >
        {progressoVisivel && (
          <Progress
            type="dashboard"
            steps={8}
            percent={progresso}
            trailColor="rgba(0, 0, 0, 0.06)"
            strokeWidth={20}
          />
        )}
        <Spin spinning={openLoadDados} tip={messageLoadDados}>
          <Row style={{ width: '100%', marginTop: 10 }} justify="start">
            <Button type="primary" onClick={() => showDrawerConsulta()}>
              <FilterOutlined />
              Filtrar
            </Button>

            <Button
              style={{
                marginLeft: 30,
              }}
              onClick={showDrawerImprimir}
            >
              <PrinterOutlined />
              Imprimir
            </Button>

            <Button
              style={{
                marginLeft: 30,
                color: 'darkorangeh',
              }}
              onClick={() => SincServidores()}
            >
              <CloudSyncOutlined />
              Atualizar com o Sicad
            </Button>
            {/*linhaSinc && (
              <Button
                style={{
                  marginLeft: 30,
                }}
                onClick={() => GetDepartamentosHierarquiaComparacao()}
              >
                <FullscreenExitOutlined />
                Teste Hierarquia
              </Button>
            )*/}
            <Col
              span={3}
              style={{ marginLeft: 30, paddingRight: 5, cursor: 'pointer' }}
            >
              <Space size="large">
                <Tooltip title={`Total de Agrupadores.`} placement="top">
                  <Badge count={GruposDadosTable.length} overflowCount={9999}>
                    <Avatar
                      shape="square"
                      size="large"
                      icon={<ClusterOutlined />}
                    />
                  </Badge>
                </Tooltip>

                <Tooltip
                  title={`Total de Departamentos/Delegacias.`}
                  placement="top"
                >
                  <Badge
                    count={DepartamentosObservatorioTable.length}
                    overflowCount={9999}
                  >
                    <Avatar
                      shape="square"
                      size="large"
                      icon={<EnvironmentOutlined />}
                    />
                  </Badge>
                </Tooltip>

                <Tooltip title={`Total de Servidores.`} placement="top">
                  <div>
                    <Badge
                      count={ServidoresObservatorioTable.length}
                      overflowCount={9999}
                    >
                      <Avatar
                        shape="square"
                        size="large"
                        icon={<UsergroupAddOutlined />}
                      />
                    </Badge>
                  </div>
                </Tooltip>
              </Space>
            </Col>
          </Row>

          <Tabs
            defaultActiveKey="1"
            activeKey={activeTab}
            style={{
              maxHeight: 'calc(100vh - 150px)',
            }}
            onTabClick={handleTabClick}
          >
            <TabPane
              tab={
                <span style={{ fontWeight: 'bold' }}>
                  <ClusterOutlined style={{ color: 'blue' }} />
                  AGRUPADORES
                </span>
              }
              key="1"
            >
              <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                {GruposDadosTable.map(grupoDado => (
                  <Col key={grupoDado.grupo_id} style={{ paddingRight: 10 }}>
                    {/* Passando os atributos da posição atual do map para o componente CardComponent */}
                    <CardComponent
                      DadosGrupo={grupoDado}
                      handleBadgeClick={handleBadgeClick}
                    />
                  </Col>
                ))}

                {isButtonTodosGruposVisible && (
                  <Button
                    style={{ marginLeft: 30 }}
                    onClick={LimparGetDadosDepartamentosComConsulta}
                  >
                    <ClearOutlined />
                    Exibir Todos os Grupos
                  </Button>
                )}
              </Row>
            </TabPane>

            <TabPane
              tab={
                <span style={{ fontWeight: 'bold' }}>
                  <EnvironmentOutlined style={{ color: 'blue' }} />
                  DEPARTAMENTOS
                </span>
              }
              key="2"
            >
              {LinhaTituloVisivel && (
                <div>
                  <Row
                    style={{
                      overflowY: 'auto',
                      width: '100%',
                    }}
                  >
                    <Col span={16} style={{ paddingRight: 5 }}>
                      <Form.Item
                        name="departamento_nome_edicao"
                        label="Departamento"
                        className="exibition-text-bold"
                      >
                        <Input
                          className="exibition-text"
                          placeholder=""
                          bordered={false}
                          style={{ color: 'darkgreen', fontWeight: 'bold' }}
                          readOnly
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              )}

              <Row
                style={{
                  overflowY: 'auto',
                  maxHeight: 'calc(100vh - 310px)',
                  width: '100%',
                }}
              >
                <Table
                  columns={columnsDepartamentos}
                  dataSource={DepartamentosObservatorioTable}
                  scroll={{ x: '90%' }}
                  onChange={onChangeDepartamentos}
                  pagination={{ pageSize: 50 }}
                  footer={() => (
                    <div style={{ color: 'green', fontWeight: 'bold' }}>
                      Total de Departamentos:{' '}
                      {DepartamentosObservatorioTable.length}
                    </div>
                  )}
                />
              </Row>
            </TabPane>

            <TabPane
              tab={
                <span style={{ fontWeight: 'bold' }}>
                  <UsergroupAddOutlined style={{ color: 'blue' }} />
                  SERVIDORES
                </span>
              }
              key="3"
            >
              <Tabs
                defaultActiveKey="1"
                tabPosition="top"
                activeKey={activeTabServidores}
                onTabClick={handleTabServidoresClick}
              >
                <TabPane
                  tab={<span style={{ fontWeight: 'bold' }}>LISTA</span>}
                  key="1"
                >
                  <Row
                    style={{
                      overflowY: 'auto',
                      maxHeight: 'calc(100vh - 310px)',
                      width: '100%',
                    }}
                  >
                    <Table
                      columns={columnsServidores}
                      dataSource={ServidoresObservatorioTable}
                      scroll={{ x: '90%' }}
                      onChange={onChangeServidores}
                      pagination={{ pageSize: 50 }}
                      footer={() => (
                        <div style={{ color: 'green', fontWeight: 'bold' }}>
                          Total de Servidores:{' '}
                          {ServidoresObservatorioTable.length}
                        </div>
                      )}
                    />
                  </Row>
                </TabPane>

                <TabPane
                  tab={
                    <span style={{ fontWeight: 'bold' }}>CLASSIFICAÇÃO</span>
                  }
                  key="2"
                >
                  <Row
                    style={{
                      overflowY: 'auto',
                      maxHeight: 'calc(100vh - 310px)',
                      width: '100%',
                    }}
                  >
                    <Col>
                      <Card style={{ width: 900 }}>
                        <MyChart
                          options={servidoresClassificacao.options}
                          series={servidoresClassificacao.series}
                          type={'bar'}
                        />
                      </Card>
                    </Col>
                  </Row>
                </TabPane>

                <TabPane
                  tab={<span style={{ fontWeight: 'bold' }}>CARGOS</span>}
                  key="3"
                >
                  <Row
                    style={{
                      overflowY: 'auto',
                      maxHeight: 'calc(100vh - 310px)',
                      width: '100%',
                    }}
                  >
                    <Col>
                      <Card style={{ width: 900 }}>
                        <MyChart
                          options={servidoresFuncao.options}
                          series={servidoresFuncao.series}
                          type={'bar'}
                        />
                      </Card>
                    </Col>
                  </Row>
                </TabPane>

                <TabPane
                  tab={<span style={{ fontWeight: 'bold' }}>CLASSE</span>}
                  key="4"
                >
                  <Row
                    style={{
                      overflowY: 'auto',
                      maxHeight: 'calc(100vh - 310px)',
                      width: '100%',
                    }}
                  >
                    <Col>
                      <Card style={{ width: 900 }}>
                        <MyChart
                          options={servidoresClasse.options}
                          series={servidoresClasse.series}
                          type={'bar'}
                        />
                      </Card>
                    </Col>
                  </Row>
                </TabPane>

                <TabPane
                  tab={<span style={{ fontWeight: 'bold' }}>GÊNERO</span>}
                  key="5"
                >
                  <Row
                    style={{
                      overflowY: 'auto',
                      maxHeight: 'calc(100vh - 310px)',
                      width: '100%',
                    }}
                  >
                    <Col>
                      <Card style={{ width: 700 }}>
                        <MyChart
                          options={servidoresSexo.options}
                          series={servidoresSexo.series}
                          type={'pie'}
                        />
                      </Card>
                    </Col>
                  </Row>
                </TabPane>

                <TabPane
                  tab={<span style={{ fontWeight: 'bold' }}>IDADE</span>}
                  key="6"
                >
                  <Row
                    style={{
                      overflowY: 'auto',
                      maxHeight: 'calc(100vh - 310px)',
                      width: '100%',
                    }}
                  >
                    <Col>
                      <Card style={{ width: 720 }}>
                        <MyChart
                          options={servidoresIdade.options}
                          series={servidoresIdade.series}
                          type={'pie'}
                        />
                      </Card>
                    </Col>
                  </Row>
                </TabPane>

                <TabPane
                  tab={<span style={{ fontWeight: 'bold' }}>POSSE</span>}
                  key="7"
                >
                  <Row
                    style={{
                      overflowY: 'auto',
                      maxHeight: 'calc(100vh - 310px)',
                      width: '100%',
                    }}
                  >
                    <Col>
                      <Card style={{ width: 720 }}>
                        <MyChart
                          options={servidoresPosse.options}
                          series={servidoresPosse.series}
                          type={'pie'}
                        />
                      </Card>
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </TabPane>
            <TabPane
              tab={
                <span style={{ fontWeight: 'bold' }}>
                  <ApartmentOutlined style={{ color: 'blue' }} />
                  ORGANOGRAMA GERAL
                </span>
              }
              key="4"
            >
              <Row
                style={{
                  overflowY: 'auto',
                  maxHeight: 'calc(100vh - 270px)',
                  width: '100%',
                }}
              >
                <Table
                  columns={columnsDepartamentosTree}
                  dataSource={DepartamentosObservatorioTree}
                  scroll={{ x: 1300 }}
                  footer={() => (
                    <div style={{ color: 'green', fontWeight: 'bold' }}>
                      Total de Departamentos:{' '}
                      {DepartamentosObservatorioTree.length}
                    </div>
                  )}
                />
              </Row>
            </TabPane>

            <TabPane
              tab={
                <span style={{ fontWeight: 'bold' }}>
                  <UsergroupDeleteOutlined style={{ color: 'darkred' }} />
                  INATIVOS
                </span>
              }
              key="5"
            >
              <Row
                style={{
                  overflowY: 'auto',
                  width: '100%',
                }}
              >
                <Col span={4.2} style={{ paddingRight: 5 }}>
                  <Space.Compact>
                    <Tooltip
                      trigger={['focus']}
                      title="Consulta por data de inativação"
                      placement="top"
                    >
                      <Form.Item
                        name="inativos_cons_data"
                        label="Desligado entre:"
                      >
                        <RangePicker
                          style={{ width: 220, fontSize: '10px' }}
                          format="DD/MM/YYYY"
                        />
                      </Form.Item>
                    </Tooltip>
                    <Button
                      title="Limpar Campo"
                      onClick={clearDataInativo}
                      style={{ marginTop: 30 }}
                      icon={<ClearOutlined />}
                    ></Button>
                  </Space.Compact>
                </Col>

                <Col lg={4} xl={4} xxl={4}>
                  <Form.Item
                    name="inativos_situacao"
                    label="Situação"
                    rules={[
                      {
                        required: true,
                        message: 'Informe a situação desejada!',
                      },
                    ]}
                  >
                    <Select
                      options={[
                        { value: 'XTODOS_INATIVOS', label: 'Todos Inativos' },
                        { value: 'XAPOSENTADORIA', label: 'Aposentadoria' },
                        { value: 'XDEMISSAO', label: 'Demissão/Exoneração' },
                        { value: 'XFALECIMENTO', label: 'Falecimento' },
                        { value: 'XRESCISAO', label: 'Rescisão' },
                        { value: 'XCASSACAO', label: 'Cassação' },
                        { value: 'XOUTROS', label: 'Outros' },
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col lg={4} xl={4} xxl={4}>
                  <Tooltip
                    trigger={['hover']}
                    title="Parte do nome do servidor."
                    placement="top"
                  >
                    <Form.Item
                      name="inativos_nome_filtro"
                      label="Pesquisar por"
                    >
                      <Input
                        style={{ fontSize: '12px' }}
                        onInput={e =>
                          ((e.target as HTMLInputElement).value = (
                            e.target as HTMLInputElement
                          ).value.toUpperCase())
                        }
                        className="bold-text-input"
                      />
                    </Form.Item>
                  </Tooltip>
                </Col>

                <Button
                  type="primary"
                  style={{
                    backgroundColor: 'darkgreen',
                    marginLeft: 30,
                    marginTop: 30,
                  }}
                  onClick={ConsultaInativos}
                >
                  <SearchOutlined />
                  Consultar
                </Button>
              </Row>
              <Row
                style={{
                  overflowY: 'auto',
                  maxHeight: 'calc(100vh - 310px)',
                  width: '100%',
                }}
              >
                <Table
                  columns={columnsServidoresInativos}
                  dataSource={ServidoresObservatorioInativosTable}
                  scroll={{ x: '90%' }}
                  onChange={onChangeServidoresInativos}
                  pagination={{ pageSize: 50 }}
                  footer={() => (
                    <div style={{ color: 'red', fontWeight: 'bold' }}>
                      Total de Inativos:{' '}
                      {ServidoresObservatorioInativosTable.length}
                    </div>
                  )}
                />
              </Row>

              {linhaSinc && (
                <>
                  <Row
                    style={{
                      width: '100%',
                    }}
                  >
                    <Form
                      form={form_departamentos}
                      layout="vertical"
                      initialValues={{
                        arquivo_xls_sicad: '',
                      }}
                    >
                      <Row style={{ width: '100%' }}>
                        {!ExibeCarregarXLS && (
                          <Col span={12} style={{ paddingRight: 5 }}>
                            <Form.Item
                              name="arquivo_xls_sicad"
                              label="Selecione .xls do SICAD"
                            >
                              <Input
                                type="file"
                                onChange={handleFileXlsSicad}
                                accept=".xlsx, .xls, .odt, .xlt"
                              />
                            </Form.Item>
                          </Col>
                        )}
                      </Row>

                      <Row
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          paddingBottom: 10,
                        }}
                      >
                        {ExibeCarregarXLS && (
                          <Col span={4} style={{ paddingRight: 5 }}>
                            <Space>
                              <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                onClick={sincDadosMapa}
                              >
                                Carregar dados do Xls SICAD
                              </Button>
                            </Space>
                          </Col>
                        )}
                      </Row>
                    </Form>
                  </Row>
                </>
              )}
            </TabPane>
          </Tabs>

          <Drawer
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', color: 'darkgreen' }}>
                  {DrawerDepartamentoTitulo}
                </span>
              </div>
            }
            width={720}
            onClose={onCloseDrawerDepartamento}
            open={openDrawerDepartamento}
            extra={
              <Space>
                <Button
                  type="primary"
                  style={{
                    backgroundColor: 'darkgreen',
                    marginLeft: 30,
                    marginTop: 30,
                  }}
                  onClick={DepartamentoSubmit}
                >
                  <SaveOutlined />
                  Salvar Alterações
                </Button>
              </Space>
            }
          >
            {linhaSinc ? (
              <div>
                <Row gutter={[16, 16]} style={{ width: '100%' }}>
                  <Form.Item hidden name="departamento_id">
                    <Input />
                  </Form.Item>

                  <Col span={10} style={{ paddingRight: 5 }}>
                    <SeletorGrupoDepartamentoComponent
                      form={form_departamentos}
                      index={'2'}
                      xlabel={'Grupo'}
                      xobrigatorio={true}
                      xtooltip={'Grupo de departamento dentro do Observatório'}
                    />{' '}
                    {/* Inclua o componente */}
                  </Col>

                  <Col lg={4} xl={5} xxl={5}>
                    <Tooltip
                      trigger={['hover']}
                      title="Hierarquia estabelecida pela portaria."
                      placement="top"
                    >
                      <Form.Item name="dep_hierarquia" label="Hierarquia">
                        <Input
                          style={{ fontSize: '12px' }}
                          onInput={e =>
                            ((e.target as HTMLInputElement).value = (
                              e.target as HTMLInputElement
                            ).value.toUpperCase())
                          }
                          className="bold-text-input"
                        />
                      </Form.Item>
                    </Tooltip>
                  </Col>
                </Row>

                <Row style={{ width: '100%' }}>
                  <Col lg={9} xl={12} xxl={12}>
                    <Tooltip
                      trigger={['hover']}
                      title="Portaria que estabelece a hieraquia da unidade policial."
                      placement="top"
                    >
                      <Form.Item name="dep_portaria" label="Portaria">
                        <Input
                          style={{ fontSize: '11px' }}
                          onInput={e =>
                            ((e.target as HTMLInputElement).value = (
                              e.target as HTMLInputElement
                            ).value.toUpperCase())
                          }
                          className="bold-text-input"
                        />
                      </Form.Item>
                    </Tooltip>
                  </Col>
                </Row>

                <Row gutter={[16, 16]} style={{ width: '100%' }}>
                  <Col lg={4} xl={6} xxl={6}>
                    <Tooltip
                      trigger={['hover']}
                      title="Usado para classificar a unidade policial"
                      placement="top"
                    >
                      <Form.Item
                        name="dep_tipo"
                        label="Tipo"
                        rules={[
                          {
                            required: true,
                            message: 'Informe o TIPO da unidade!',
                          },
                        ]}
                      >
                        <Select
                          options={[
                            { value: 'ACADEMIA', label: 'Acadêmia' },
                            {
                              value: 'ADMINISTRATIVA',
                              label: 'Administrativa',
                            },
                            { value: 'CONSELHO', label: 'Conselho' },
                            {
                              value: 'CORREGEDORIA',
                              label: 'Corregedoria',
                            },
                            { value: 'GABINETE', label: 'Gabinete' },
                            { value: 'GT3', label: 'GT3' },
                            {
                              value: 'INTELIGENCIA',
                              label: 'Unidades de Inteligência',
                            },
                            { value: 'OPERACIONAL', label: 'Operacional' },
                            { value: 'SAUDE', label: 'Saúde' },
                            { value: 'SI', label: 'Identificação' },
                            { value: 'DROGAS', label: 'Drogas' },
                            {
                              value: 'GEPATRI',
                              label: 'Crimes Patrimoniais',
                            },
                            { value: 'SUPERVISAO', label: 'Supervisão' },
                          ]}
                        />
                      </Form.Item>
                    </Tooltip>
                  </Col>

                  <Col lg={4} xl={6} xxl={6}>
                    <Tooltip
                      trigger={['hover']}
                      title="Usado para organizar as unidades policiais"
                      placement="top"
                    >
                      <Form.Item
                        name="dep_especializacao"
                        label="Especialização"
                        rules={[
                          {
                            required: true,
                            message: 'Informe a Especialização da unidade!',
                          },
                        ]}
                      >
                        <Select
                          options={[
                            { value: 'ACADEMIA', label: 'Acadêmia' },
                            {
                              value: 'ADMINISTRATIVA',
                              label: 'Administrativa',
                            },
                            {
                              value: 'ADM_PUBLICA',
                              label: 'Crimes Adm. Pública',
                            },
                            { value: 'BANCO', label: 'Antiassalto' },
                            { value: 'CARGAS', label: 'Roubo de Cargas' },
                            {
                              value: 'CIBERNETICO',
                              label: 'Crimes Cibernéticos',
                            },
                            {
                              value: 'CONSUMIDOR',
                              label: 'Crimes Contra Consumidor',
                            },
                            {
                              value: 'CORRUPCAO',
                              label: 'Combate a Corrupção',
                            },
                            {
                              value: 'CORREGEDORIA',
                              label: 'Corregedoria',
                            },
                            {
                              value: 'CRIME_ORGANIZADO',
                              label: 'Crime Organizado',
                            },
                            { value: 'CAPTURAS', label: 'CAPTURAS' },
                            {
                              value: 'DEFICIENCIA',
                              label: 'Pessoa Com Deficiência',
                            },
                            { value: 'DEIC', label: 'DEIC e GEIC' },
                            {
                              value: 'INVESTIGACAO',
                              label: 'Repressão Estelionato e Roubos',
                            },
                            {
                              value: 'TORCIDAS',
                              label: 'Proteção ao Torcedor',
                            },
                            { value: 'DROGAS', label: 'DROGAS' },
                            { value: 'VEICULOS', label: 'DERFRVA' },
                            {
                              value: 'DESAPARECIDOS',
                              label: 'DESAPARECIDOS',
                            },
                            { value: 'DICT', label: 'DICT' },
                            { value: 'DIH', label: 'DIH e GIH' },
                            { value: 'GEPATRI', label: 'GEPATRI' },
                            { value: 'GT3', label: 'GT3' },
                            { value: 'ID', label: 'Identificação' },
                            { value: 'IDOSO', label: 'Proteção ao Idoso' },
                            {
                              value: 'MEIO_AMBIENTE',
                              label: 'Meio Ambiente',
                            },
                            {
                              value: 'MENOR_INFRATOR',
                              label: 'Menor Infrator',
                            },
                            {
                              value: 'MENOR_VITIMA',
                              label: 'Proteção Infantil',
                            },
                            { value: 'MULHER', label: 'Proteção a Mulher' },
                            { value: 'NECRO', label: 'Necropapiloscopia' },
                            { value: 'OPERACIONAL', label: 'Operacional' },
                            {
                              value: 'ORGANIZACIONAL',
                              label: 'Organizacional(Não existe fisicamente)',
                            },
                            { value: 'POLINTER', label: 'Polinter' },
                            { value: 'RACIAL', label: 'Crimes Raciais' },
                            {
                              value: 'REGIONAL',
                              label: 'Delegacia Regional',
                            },
                            { value: 'RURAL', label: 'Crimes Rurais' },
                            { value: 'SAUDE', label: 'Saúde' },
                            { value: 'SEQUESTRO', label: 'Anti Sequestro' },
                            { value: 'SI', label: 'Identificação' },
                            { value: 'DROGAS', label: 'Drogas' },
                            {
                              value: 'GEPATRI',
                              label: 'Crimes Patrimoniais',
                            },
                            {
                              value: 'INTELIGENCIA',
                              label: 'Unidades de Inteligência',
                            },
                            { value: 'SUPERVISAO', label: 'Supervisão' },
                            {
                              value: 'TRIBUTARIA',
                              label: 'Crimes Contra Ordem Tributária',
                            },
                          ]}
                        />
                      </Form.Item>
                    </Tooltip>
                  </Col>
                  <Col lg={2} xl={5} xxl={5}>
                    <Tooltip
                      trigger={['hover']}
                      title="Escala de Trabalho da Unidade"
                      placement="top"
                    >
                      <Form.Item
                        name="dep_escala"
                        label="Escala"
                        rules={[
                          {
                            required: true,
                            message: 'Informe a Escala de Trabalho!',
                          },
                        ]}
                      >
                        <Select
                          options={[
                            { value: 'EXPEDIENTE', label: 'Expediente' },
                            { value: 'PLANTÃO', label: 'Plantão' },
                          ]}
                        />
                      </Form.Item>
                    </Tooltip>
                  </Col>
                </Row>
              </div>
            ) : (
              <div>
                <Row gutter={[16, 16]} style={{ width: '100%' }}>
                  <Form.Item hidden name="departamento_id">
                    <Input />
                  </Form.Item>
                  <Form.Item hidden name="departamento_grupo_id_2">
                    <Input />
                  </Form.Item>

                  <Col span={10} style={{ paddingRight: 5 }}>
                    <Form.Item
                      name="departamento_grupo_2"
                      label="Grupo"
                      className="exibition-text-bold"
                    >
                      <Input
                        className="exibition-text"
                        placeholder="Grupo"
                        bordered={false}
                        style={{ color: 'darkgreen', fontWeight: 'bold' }}
                        readOnly
                      />
                    </Form.Item>
                  </Col>

                  <Col lg={4} xl={5} xxl={5}>
                    <Tooltip
                      trigger={['hover']}
                      title="Hierarquia estabelecida pela portaria."
                      placement="top"
                    >
                      <Form.Item
                        name="dep_hierarquia"
                        label="Hierarquia"
                        className="exibition-text-bold"
                      >
                        <Input
                          className="exibition-text"
                          placeholder="Hierarquia"
                          bordered={false}
                          style={{ color: 'darkgreen', fontWeight: 'bold' }}
                          readOnly
                        />
                      </Form.Item>
                    </Tooltip>
                  </Col>
                </Row>

                <Row style={{ width: '100%' }}>
                  <Col lg={9} xl={12} xxl={12}>
                    <Tooltip
                      trigger={['hover']}
                      title="Portaria que estabelece a hieraquia da unidade policial."
                      placement="top"
                    >
                      <Form.Item
                        name="dep_portaria"
                        label="Portaria"
                        className="exibition-text-bold"
                      >
                        <Input
                          className="exibition-text"
                          placeholder="Portaria"
                          bordered={false}
                          style={{ color: 'darkgreen', fontWeight: 'bold' }}
                          readOnly
                        />
                      </Form.Item>
                    </Tooltip>
                  </Col>
                </Row>

                <Row gutter={[16, 16]} style={{ width: '100%' }}>
                  <Col lg={4} xl={6} xxl={6}>
                    <Tooltip
                      trigger={['hover']}
                      title="Usado para classificar a unidade policial"
                      placement="top"
                    >
                      <Form.Item
                        name="dep_tipo"
                        label="Tipo"
                        className="exibition-text-bold"
                      >
                        <Input
                          className="exibition-text"
                          placeholder="Tipo"
                          bordered={false}
                          style={{ color: 'darkgreen', fontWeight: 'bold' }}
                          readOnly
                        />
                      </Form.Item>
                    </Tooltip>
                  </Col>

                  <Col lg={4} xl={6} xxl={6}>
                    <Tooltip
                      trigger={['hover']}
                      title="Usado para organizar as unidades policiais"
                      placement="top"
                    >
                      <Form.Item
                        name="dep_especializacao"
                        label="Especialização"
                        className="exibition-text-bold"
                      >
                        <Input
                          className="exibition-text"
                          placeholder="Especialização"
                          bordered={false}
                          style={{ color: 'darkgreen', fontWeight: 'bold' }}
                          readOnly
                        />
                      </Form.Item>
                    </Tooltip>
                  </Col>
                  <Col lg={2} xl={5} xxl={5}>
                    <Tooltip
                      trigger={['hover']}
                      title="Escala de Trabalho da Unidade"
                      placement="top"
                    >
                      <Form.Item
                        name="dep_escala"
                        label="Escala"
                        rules={[
                          {
                            required: true,
                            message: 'Informe a Escala de Trabalho!',
                          },
                        ]}
                      >
                        <Select
                          options={[
                            { value: 'EXPEDIENTE', label: 'Expediente' },
                            { value: 'PLANTÃO', label: 'Plantão' },
                          ]}
                        />
                      </Form.Item>
                    </Tooltip>
                  </Col>
                </Row>
              </div>
            )}

            <Row gutter={[16, 16]} style={{ width: '100%' }}>
              <Form.Item hidden name="titular_celular">
                <Input />
              </Form.Item>
              <Form.Item hidden name="titular_telefone">
                <Input />
              </Form.Item>

              <Col span={10} style={{ paddingRight: 5 }}>
                <SeletorServidoresComponent
                  form={form_departamentos}
                  index={'2'}
                  xlabel={'Titular'}
                  xobrigatorio={false}
                  xtooltip={''}
                  xcampo_fone={'titular_telefone'}
                  xcampo_celular={'titular_celular'}
                  xunidade_pai_filtro_id={-1}
                  xunidade_agrupador_filtro_id={-1}
                  xcampo_dep={''}
                  xcampo_dep_grupo={''}
                />
              </Col>

              <Form.Item hidden name="titular_interino_celular">
                <Input />
              </Form.Item>
              <Form.Item hidden name="titular_interino_telefone">
                <Input />
              </Form.Item>

              <Col span={5} style={{ paddingRight: 5 }}>
                <SeletorServidoresComponent
                  form={form_departamentos}
                  index={'3'}
                  xlabel={'Titular Interino'}
                  xobrigatorio={false}
                  xtooltip={''}
                  xcampo_fone={'titular_interino_telefone'}
                  xcampo_celular={'titular_interino_celular'}
                  xunidade_pai_filtro_id={-1}
                  xunidade_agrupador_filtro_id={-1}
                  xcampo_dep={''}
                  xcampo_dep_grupo={''}
                />
              </Col>
            </Row>

            <Row style={{ width: '100%' }}>
              <Col span={7} style={{ paddingRight: 5 }}>
                <Space.Compact>
                  <Form.Item name="dep_telefone" label="Telefone">
                    <Input
                      maxLength={11}
                      onInput={e =>
                        ((e.target as HTMLInputElement).value = (
                          e.target as HTMLInputElement
                        ).value.toUpperCase())
                      }
                      className="bold-text-input"
                      onKeyDown={e => {
                        if (e.key === 'Backspace') {
                          return;
                        }

                        const isNumber = e.key >= '0' && e.key <= '9';
                        if (
                          e.key === 'Tab' ||
                          e.key === 'Backspace' ||
                          e.key === 'ArrowLeft' ||
                          e.key === 'ArrowUp' ||
                          e.key === 'ArrowRight' ||
                          e.key === 'ArrowDown' ||
                          e.key === 'Delete' ||
                          e.key === 'c' ||
                          e.key === 'C' ||
                          e.key === 'V' ||
                          e.key === 'v'
                        ) {
                          return;
                        }
                        if (!isNumber) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Form.Item>
                  <Button
                    title="Tentar Contato via WhatsApp no Telefone da Delegacia"
                    onClick={() =>
                      FalarViaWhats(
                        form_departamentos.getFieldValue(
                          'departamento_nome_edicao',
                        ),
                        form_departamentos.getFieldValue('dep_telefone'),
                      )
                    }
                    style={{ marginTop: 32 }}
                    icon={<WhatsAppOutlined style={{ color: 'green' }} />}
                  ></Button>
                </Space.Compact>
              </Col>

              <Col span={7} style={{ paddingRight: 5 }}>
                <Space.Compact>
                  <Form.Item name="dep_telefone2" label="Telefone 2">
                    <Input
                      maxLength={11}
                      onInput={e =>
                        ((e.target as HTMLInputElement).value = (
                          e.target as HTMLInputElement
                        ).value.toUpperCase())
                      }
                      className="bold-text-input"
                      onKeyDown={e => {
                        if (e.key === 'Backspace') {
                          return;
                        }

                        const isNumber = e.key >= '0' && e.key <= '9';
                        if (
                          e.key === 'Tab' ||
                          e.key === 'Backspace' ||
                          e.key === 'ArrowLeft' ||
                          e.key === 'ArrowUp' ||
                          e.key === 'ArrowRight' ||
                          e.key === 'ArrowDown' ||
                          e.key === 'Delete' ||
                          e.key === 'c' ||
                          e.key === 'C' ||
                          e.key === 'V' ||
                          e.key === 'v'
                        ) {
                          return;
                        }
                        if (!isNumber) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Form.Item>

                  <Button
                    title="Tentar Contato via WhatsApp no Celular do Servidor"
                    onClick={() =>
                      FalarViaWhats(
                        form_departamentos.getFieldValue(
                          'departamento_nome_edicao',
                        ),
                        form_departamentos.getFieldValue('dep_telefone2'),
                      )
                    }
                    style={{ marginTop: 32 }}
                    icon={<WhatsAppOutlined style={{ color: 'green' }} />}
                  ></Button>
                </Space.Compact>
              </Col>

              <Col span={7} style={{ paddingRight: 5 }}>
                <Space.Compact>
                  <Form.Item name="dep_telefone3" label="Telefone 3">
                    <Input
                      maxLength={11}
                      onInput={e =>
                        ((e.target as HTMLInputElement).value = (
                          e.target as HTMLInputElement
                        ).value.toUpperCase())
                      }
                      className="bold-text-input"
                      onKeyDown={e => {
                        if (e.key === 'Backspace') {
                          return;
                        }

                        const isNumber = e.key >= '0' && e.key <= '9';
                        if (
                          e.key === 'Tab' ||
                          e.key === 'Backspace' ||
                          e.key === 'ArrowLeft' ||
                          e.key === 'ArrowUp' ||
                          e.key === 'ArrowRight' ||
                          e.key === 'ArrowDown' ||
                          e.key === 'Delete' ||
                          e.key === 'c' ||
                          e.key === 'C' ||
                          e.key === 'V' ||
                          e.key === 'v'
                        ) {
                          return;
                        }
                        if (!isNumber) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </Form.Item>

                  <Button
                    title="Tentar Contato via WhatsApp no Celular do Servidor"
                    onClick={() =>
                      FalarViaWhats(
                        form_departamentos.getFieldValue(
                          'departamento_nome_edicao',
                        ),
                        form_departamentos.getFieldValue('dep_telefone3'),
                      )
                    }
                    style={{ marginTop: 32 }}
                    icon={<WhatsAppOutlined style={{ color: 'green' }} />}
                  ></Button>
                </Space.Compact>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ width: '100%' }}>
              <Form.Item hidden name="chefe_cartorio_celular">
                <Input />
              </Form.Item>
              <Form.Item hidden name="chefe_cartorio_telefone">
                <Input />
              </Form.Item>

              <Col span={10} style={{ paddingRight: 5 }}>
                <SeletorServidoresComponent
                  form={form_departamentos}
                  index={'4'}
                  xlabel={'Chefe de Cartório'}
                  xobrigatorio={false}
                  xtooltip={''}
                  xcampo_fone={'chefe_cartorio_telefone'}
                  xcampo_celular={'chefe_cartorio_celular'}
                  xunidade_pai_filtro_id={-1}
                  xunidade_agrupador_filtro_id={-1}
                  xcampo_dep={''}
                  xcampo_dep_grupo={''}
                />
              </Col>

              <Form.Item hidden name="chefe_cartorio_interino_celular">
                <Input />
              </Form.Item>
              <Form.Item hidden name="chefe_cartorio_interino_telefone">
                <Input />
              </Form.Item>

              <Col span={5} style={{ paddingRight: 5 }}>
                <SeletorServidoresComponent
                  form={form_departamentos}
                  index={'5'}
                  xlabel={'Chefe de Cartório Interino'}
                  xobrigatorio={false}
                  xtooltip={''}
                  xcampo_fone={'chefe_cartorio_interino_telefone'}
                  xcampo_celular={'chefe_cartorio_interino_celular'}
                  xunidade_pai_filtro_id={-1}
                  xunidade_agrupador_filtro_id={-1}
                  xcampo_dep={''}
                  xcampo_dep_grupo={''}
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ width: '100%' }}>
              <Col lg={4} xl={5} xxl={5}>
                <Tooltip
                  trigger={['hover']}
                  title="Situação do imóvel"
                  placement="top"
                >
                  <Form.Item
                    name="dep_imovel_status"
                    label="Imóvel"
                    rules={[
                      {
                        required: true,
                        message: 'Informe a Situação do Imóvel!',
                      },
                    ]}
                  >
                    <Select
                      options={[
                        { value: 'PROPRIO', label: 'Próprio' },
                        {
                          value: 'ALUGADO_ESTADO',
                          label: 'Alugado Estado',
                        },
                        {
                          value: 'ALUGADO_PREFEITURA',
                          label: 'Alugado Prefeitura',
                        },
                        {
                          value: 'CEDIDO_ESTADO',
                          label: 'Cedido Estado',
                        },
                        {
                          value: 'CEDIDO_PREFEITURA',
                          label: 'Cedido Prefeitura',
                        },
                        {
                          value: 'CEDIDO_JUDICIARIO',
                          label: 'Cedido Judiciário',
                        },
                      ]}
                    />
                  </Form.Item>
                </Tooltip>
              </Col>

              <Col lg={4} xl={5} xxl={5} style={{ marginLeft: 10 }}>
                <Tooltip
                  trigger={['hover']}
                  title="Em caso de Alugado qual o valor do contrato."
                  placement="top"
                >
                  <Form.Item
                    name="dep_valor_contrato"
                    label="Valor Contrato R$"
                  >
                    <Input
                      style={{ fontSize: '12px' }}
                      className="bold-text-input"
                    />
                  </Form.Item>
                </Tooltip>
              </Col>

              <Col span={5} style={{ paddingRight: 5 }}>
                <SeletorCidadeSicadComponent
                  form={form_departamentos}
                  index={'1'}
                  xlabel={'Cidade'}
                  xobrigatorio={true}
                  xtooltip={'Cidade do departamento'}
                />{' '}
                {/* Inclua o componente */}
              </Col>
            </Row>
          </Drawer>
          <Drawer
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', color: 'darkgreen' }}>
                  {DrawerDepartamentoTitulo}
                </span>
              </div>
            }
            width={720}
            onClose={onCloseDrawerDepartamentoFotos}
            open={openDrawerDepartamentoFotos}
          >
            <Row style={{ width: '100%' }}>
              <Divider plain style={{ fontWeight: 'bold', color: 'red' }}>
                Upload Imagens do Departamento
              </Divider>

              <Form.Item hidden name="arquivo_upload_id">
                <Input />
                {/*Utilizado para saber se há pelo menos 1 upload*/}
              </Form.Item>

              <Col lg={2} xl={5} xxl={4}>
                <Form.Item
                  name="fotos_grupo"
                  label="Agrupamento"
                  rules={[
                    {
                      required: true,
                      message: 'Informe o Agrupamento da Foto!',
                    },
                  ]}
                >
                  <Select
                    options={[
                      { value: 'FACHADA', label: 'Fachada' },
                      { value: 'ESTRUTURA', label: 'Estrutura' },
                      { value: 'CELA', label: 'Cela' },
                      { value: 'CARTORIO', label: 'Cartório' },
                      {
                        value: 'SALA DELEGADO',
                        label: 'Sala Delegado',
                      },
                      { value: 'RECEPCAO', label: 'Recepção' },
                      { value: 'COPA', label: 'Copa' },
                      { value: 'DORMITORIO', label: 'Dormitório' },
                      { value: 'VIATURA', label: 'Viatura' },
                      { value: 'ESTACIONAMENTO', label: 'Estacionamento' },
                      {
                        value: 'EQUIPAMENTOS',
                        label: 'Equipamentos',
                      },
                      { value: 'OUTROS', label: 'Outros' },
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col>
                <Upload
                  name="file"
                  action="/upload"
                  showUploadList={false}
                  beforeUpload={File => {
                    const fileType = getFileType(File); // Função para determinar o tipo do arquivo
                    sendFileWs(File, fileType);
                    return false;
                  }}
                  //maxCount={1}
                  //disabled={hasArquivo !== false}
                  //showUploadList={false} // Adicione esta linha
                >
                  <Button
                    icon={
                      //isUploading ? (
                      <CloudUploadOutlined />
                      /*) : hasArquivo ? (
                                      <CheckCircleOutlined />
                                    ) : (
                                      <UploadOutlined />
                                    )*/
                    }
                    //disabled={hasArquivo !== false || isUploading}
                    style={{ marginTop: 30, marginLeft: 10 }}
                  >
                    {
                      /*isUploading
                                    ? 'Enviando...'
                                    : hasArquivo
                                    ? 'Arquivo Anexado'
                                    : */ 'Anexar Arquivo'
                    }
                  </Button>
                </Upload>
              </Col>
            </Row>

            <Row style={{ width: '100%' }}>
              <Divider plain style={{ fontWeight: 'bold', color: 'darkgray' }}>
                Fotos Anexadas ao Departamento
              </Divider>
            </Row>

            <Row style={{ width: '100%' }}>
              <Col lg={3} xl={5} xxl={6}>
                <Form.Item name="zcons_fotos_grupo" label="Exibir Fotos de">
                  <Select
                    options={[
                      { value: 'TODAS', label: 'Todas as Fotos' },
                      { value: 'FACHADA', label: 'Fachada' },
                      { value: 'ESTRUTURA', label: 'Estrutura' },
                      { value: 'CELA', label: 'Cela' },
                      { value: 'CARTORIO', label: 'Cartório' },
                      {
                        value: 'SALA DELEGADO',
                        label: 'Sala Delegado',
                      },
                      { value: 'RECEPCAO', label: 'Recepção' },
                      { value: 'COPA', label: 'Copa' },
                      { value: 'DORMITORIO', label: 'Dormitório' },
                      { value: 'VIATURA', label: 'Viatura' },
                      {
                        value: 'EQUIPAMENTOS',
                        label: 'Equipamentos',
                      },
                      { value: 'OUTROS', label: 'Outros' },
                    ]}
                    style={{ width: 200 }}
                    onChange={handleFotosGrupoChange}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row style={{ width: '100%' }}>
              <Col>
                <Table
                  columns={columnsArquivos}
                  dataSource={ArquivosSource}
                  scroll={{ x: 600 }}
                  style={{
                    border: '4px outset lightgray',
                  }}
                  onChange={onChangeArquivos}
                />
              </Col>
            </Row>
          </Drawer>
          <Drawer
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', color: 'darkred' }}>
                  {DrawerAuditoriaTitulo}
                </span>
              </div>
            }
            width={720}
            onClose={onCloseDrawerAuditoria}
            open={openDrawerAuditoria}
            extra={
              <Space>
                <Button onClick={onCloseDrawerAuditoria} type="primary">
                  <SubnodeOutlined /> Consultar
                </Button>
              </Space>
            }
          >
            <Row style={{ width: '100%' }}>
              <Col span={4.2} style={{ paddingRight: 5 }}>
                <Tooltip
                  trigger={['hover']}
                  title="Consulta Requisições/Identificações pela data de Requisição"
                  placement="top"
                >
                  <Form.Item
                    name="zcons_data_auditoria"
                    label="Alterações entre:"
                  >
                    <RangePicker
                      style={{ width: 220, fontSize: '10px' }}
                      format="DD/MM/YYYY"
                    />
                  </Form.Item>
                </Tooltip>
              </Col>
            </Row>

            <Row
              style={{
                overflowY: 'auto',
                maxHeight: '100%',
                width: '100%',
              }}
            >
              <Timeline
                mode="alternate"
                items={ArrayAuditorias}
                style={{ width: '95%', marginTop: 20 }}
              />
            </Row>
          </Drawer>

          <Drawer
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', color: 'darkblue' }}>
                  Central de Impressão
                </span>
              </div>
            }
            width={720}
            onClose={onCloseDrawerImprimir}
            open={openDrawerImprimir}
            extra={
              <Space>
                <Button onClick={ImprimirClick} type="primary">
                  <PrinterOutlined /> Imprimir
                </Button>
              </Space>
            }
          >
            <Row style={{ width: '100%' }}>
              <Col span={9} style={{ paddingRight: 5 }}>
                <Tooltip
                  trigger={['hover']}
                  title="Escolha a orientação do papel"
                  placement="right"
                >
                  <Form.Item name="zrelatorio_orientacao" label="Orientação">
                    <Select
                      options={[
                        {
                          value: 'landscape',
                          label: customLabelRelatorioOrientacao('landscape'),
                        },
                        {
                          value: 'portrait',
                          label: customLabelRelatorioOrientacao('portrait'),
                        },
                      ]}
                      style={{ width: 400 }}
                    />
                  </Form.Item>
                </Tooltip>
              </Col>
            </Row>

            <Row style={{ width: '100%' }}>
              <Col span={9} style={{ paddingRight: 5 }}>
                <Tooltip
                  trigger={['hover']}
                  title="Titulo do Relatório"
                  placement="right"
                >
                  <Form.Item name="zrelatorio_titulo" label="Titulo">
                    <Input style={{ width: 400 }} />
                  </Form.Item>
                </Tooltip>
              </Col>
            </Row>

            <Row style={{ width: '100%' }}>
              <Col span={9} style={{ paddingRight: 5 }}>
                <Space.Compact>
                  <Tooltip
                    trigger={['hover']}
                    title="Escolha o modelo de seu relatório"
                    placement="right"
                  >
                    <Form.Item name="zrelatorio_modelo" label="Relatório de">
                      <Select
                        options={[
                          {
                            value: 'SERVIDORES',
                            label: customLabelRelatorioModelo('SERVIDORES'),
                          },
                          {
                            value: 'DEPARTAMENTOS',
                            label: customLabelRelatorioModelo('DEPARTAMENTOS'),
                          },
                        ]}
                        onChange={setModeloRelatorioVisivel}
                        style={{ width: 300 }}
                      />
                    </Form.Item>
                  </Tooltip>
                </Space.Compact>
              </Col>
            </Row>

            <Row style={{ width: '100%' }}>
              <Col span={9} style={{ paddingRight: 5 }}>
                <Space.Compact>
                  <Tooltip
                    trigger={['hover']}
                    title="Escolha as colunas de seu relatório"
                    placement="right"
                  >
                    <Form.Item
                      name="zrelatorio_colunas"
                      label="Colunas Disponíveis"
                    >
                      {ModeloRelatorioVisivel === 'SERVIDORES' ? (
                        <Select
                          mode="multiple"
                          placeholder=""
                          value={selectedItemsRelatoriosColunasServidores}
                          onChange={setSelectedItemsRelatoriosColunasServidores}
                          style={{ width: 300 }}
                          options={filteredOptionsReletoriosColunasServidores.map(
                            item => ({
                              value: item,
                              label:
                                customLabelFiltroRelatoriosColunasServidores(
                                  item,
                                ),
                            }),
                          )}
                        />
                      ) : (
                        <Select
                          mode="multiple"
                          placeholder=""
                          value={selectedItemsRelatoriosColunasDepartamentos}
                          onChange={
                            setSelectedItemsRelatoriosColunasDepartamentos
                          }
                          style={{ width: 300 }}
                          options={filteredOptionsReletoriosColunasDepartamentos.map(
                            item => ({
                              value: item,
                              label:
                                customLabelFiltroRelatoriosColunasDepartamentos(
                                  item,
                                ),
                            }),
                          )}
                        />
                      )}
                    </Form.Item>
                  </Tooltip>
                  <Button
                    title="Limpar Campo"
                    onClick={clearRelatorioModelo}
                    style={{ marginTop: 32 }}
                    icon={<ClearOutlined />}
                  ></Button>
                </Space.Compact>
              </Col>
            </Row>

            <Row style={{ width: '100%' }}>
              <Col span={4} style={{ paddingRight: 5 }}>
                <Space.Compact>
                  <Tooltip
                    trigger={['hover']}
                    title="Incluir Contador de Linhas"
                    placement="right"
                  >
                    <Form.Item
                      name="zrelatorio_contador_linhas"
                      label="Contador"
                    >
                      <Select
                        options={[
                          { value: 'SIM', label: 'SIM' },
                          { value: 'NÃO', label: 'NÃO' },
                        ]}
                      />
                    </Form.Item>
                  </Tooltip>
                </Space.Compact>
              </Col>

              <Col span={4} style={{ paddingRight: 5 }}>
                <Space.Compact>
                  <Tooltip
                    trigger={['hover']}
                    title="Incluir Totalização para os Campos de Quantidade de Servidores."
                    placement="right"
                  >
                    <Form.Item name="zrelatorio_totalizacao" label="Totalizar">
                      <Select
                        options={[
                          { value: 'SIM', label: 'SIM' },
                          { value: 'NÃO', label: 'NÃO' },
                        ]}
                      />
                    </Form.Item>
                  </Tooltip>
                </Space.Compact>
              </Col>

              {ModeloRelatorioVisivel === 'SERVIDORES' && (
                <Col span={4} style={{ paddingRight: 5 }}>
                  <Space.Compact>
                    <Tooltip
                      trigger={['hover']}
                      title="Agrupar por (Departamento/Cidade)."
                      placement="right"
                    >
                      <Form.Item
                        name="zrelatorio_dep_agrupar"
                        label="Agrupar Dep."
                      >
                        <Select
                          options={[
                            { value: 'DEPARTAMENTO', label: 'Por Dep.' },
                            { value: 'CIDADE', label: 'Por Cidade' },
                            {
                              value: 'CLASSIFICACAO',
                              label: 'Por Classificação(Cargo)',
                            },
                            { value: 'NAO', label: 'NÃO' },
                          ]}
                        />
                      </Form.Item>
                    </Tooltip>
                  </Space.Compact>
                </Col>
              )}
            </Row>
          </Drawer>

          <Drawer
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', color: 'darkgreen' }}>
                  Filtrar Resultados
                </span>
              </div>
            }
            width={720}
            placement={'left'}
            onClose={onCloseDrawerConsulta}
            open={openDrawerConsulta}
            extra={
              <Space>
                <Button
                  style={{
                    backgroundColor: 'darkgreen',
                  }}
                  onClick={() => GetDadosDepartamentos()}
                  type="primary"
                >
                  <SearchOutlined />
                  Consultar
                </Button>

                <Button
                  style={{
                    marginLeft: 30,
                  }}
                  onClick={LimparGetDadosDepartamentos}
                >
                  <ClearOutlined />
                  Limpar Filtros
                </Button>
              </Space>
            }
          >
            <Row style={{ width: '100%' }}>
              <Col span={4} style={{ paddingRight: 5 }}>
                <SeletorGrupoDepartamentoComponent
                  form={form_departamentos}
                  index={'1'}
                  xlabel={'Agrupador'}
                  xobrigatorio={false}
                  xtooltip={''}
                />
              </Col>
            </Row>

            <Row style={{ width: '100%' }}>
              <Col span={11} style={{ paddingRight: 5 }}>
                <Space.Compact>
                  <SeletorDepartamentosComponent
                    form={form_departamentos}
                    index={'1'}
                    xlabel={'Departamento'}
                    xobrigatorio={false}
                    xtooltip={''}
                    xcampo_fone={''}
                    xunidade_pai_filtro_id={-1}
                  />
                  <Button
                    onClick={() => {
                      GetAuditoria('DEPARTAMENTO');
                    }}
                    title="Auditoria"
                    style={{ marginTop: 30, marginLeft: -2 }}
                  >
                    <ThunderboltOutlined style={{ color: '#aa9e22' }} />
                  </Button>
                </Space.Compact>
              </Col>

              <Col span={6} style={{ paddingLeft: 10 }}>
                <Tooltip
                  trigger={['hover']}
                  title="Retornar servidores lotados no departamento escolhido ou lotados no departamento escolhido e em seus departamentos subordinados(hierarquia)"
                  placement="right"
                >
                  <Form.Item name="dep_servidores_modo" label="Servidores por">
                    <Select
                      options={[
                        {
                          value: 'HIERARQUIA',
                          label: customLabelDepHierarquia('HIERARQUIA'),
                        },
                        {
                          value: 'DEPARTAMENTO',
                          label: customLabelDepHierarquia('DEPARTAMENTO'),
                        },
                      ]}
                    />
                  </Form.Item>
                </Tooltip>
              </Col>
            </Row>

            <Row style={{ width: '100%' }}>
              <Space>
                <Col span={11} style={{ paddingRight: 5 }}>
                  <Space.Compact>
                    <SeletorServidoresComponent
                      form={form_departamentos}
                      index={'1'}
                      xlabel={'Servidor'}
                      xobrigatorio={false}
                      xtooltip={''}
                      xcampo_fone={''}
                      xcampo_celular={''}
                      xunidade_pai_filtro_id={-1}
                      xunidade_agrupador_filtro_id={-1}
                      xcampo_dep={'departamento_'}
                      xcampo_dep_grupo={'departamento_grupo_'}
                    />
                    <Button
                      onClick={() => {
                        GetAuditoria('SERVIDOR');
                      }}
                      style={{ marginTop: 30, marginLeft: -2 }}
                      title="Auditoria"
                    >
                      <ThunderboltOutlined style={{ color: '#aa9e22' }} />
                    </Button>
                  </Space.Compact>
                </Col>
              </Space>
            </Row>

            <Row style={{ width: '100%' }}>
              <Col span={5} style={{ paddingRight: 5 }}>
                <Space.Compact>
                  <Form.Item name="zcons_classificacao" label="Classificação:">
                    <Select style={{ width: 200 }}>
                      <Option value="POLICIAL">
                        <span style={{ color: 'darkblue' }}>
                          <AlertOutlined style={{ color: 'red' }} /> É Policial
                        </span>
                      </Option>
                      <Option value="DELEGADO">
                        <span style={{ color: 'darkblue' }}>
                          <AlertOutlined style={{ color: 'red' }} /> Delegado
                        </span>
                      </Option>
                      <Option value="ESCRIVAO">
                        <span style={{ color: 'darkblue' }}>
                          <AlertOutlined style={{ color: 'red' }} /> Escrivão
                        </span>
                      </Option>
                      <Option value="AGENTE">
                        <span style={{ color: 'darkblue' }}>
                          <AlertOutlined style={{ color: 'red' }} /> Agente
                        </span>
                      </Option>
                      <Option value="PAPILOSCOPISTA">
                        <span style={{ color: 'darkblue' }}>
                          <AlertOutlined style={{ color: 'red' }} />{' '}
                          Papiloscopista
                        </span>
                      </Option>
                      <Option value="ADMINISTRATIVO">
                        <span style={{ color: 'black' }}>Assessor ADM</span>
                      </Option>
                      <Option value="CAIXEGO">
                        <span style={{ color: 'bown' }}>Caixego</span>
                      </Option>
                      <Option value="IQUEGO">
                        <span style={{ color: 'bown' }}>Iquego</span>
                      </Option>
                      <Option value="METROBUS">
                        <span style={{ color: 'bown' }}>Metrobus</span>
                      </Option>
                      <Option value="ESTAGIARIO">
                        <span style={{ color: 'bown' }}>Estagiário</span>
                      </Option>
                      <Option value="DIGITADOR">
                        <span style={{ color: 'bown' }}>Digitador</span>
                      </Option>
                      <Option value="NAOPOLICIAL">
                        <span style={{ color: 'black' }}>Não É Policial</span>
                      </Option>
                      <Option value="SEM">
                        <span style={{ color: 'red' }}>
                          <QuestionCircleOutlined style={{ color: 'red' }} />
                          Sem Classificação
                        </span>
                      </Option>
                    </Select>
                  </Form.Item>
                  <Button
                    title="Limpar Campo"
                    onClick={ClearClassificacao}
                    style={{ marginTop: 32 }}
                    icon={<ClearOutlined />}
                  ></Button>
                </Space.Compact>
              </Col>
            </Row>

            <Row style={{ width: '100%' }}>
              <Space>
                <Col span={5} style={{ paddingRight: 5 }}>
                  <SeletorCidadeSicadComponent
                    form={form_departamentos}
                    index={'2'}
                    xlabel={'Cidade'}
                    xobrigatorio={false}
                    xtooltip={'Cidade do departamento/servidor'}
                  />{' '}
                  {/* Inclua o componente */}
                </Col>
              </Space>
            </Row>

            <Row style={{ width: '100%' }}>
              <Col span={10} style={{ paddingRight: 5 }}>
                <Tooltip
                  trigger={['hover']}
                  title="Resultados que coincidam UM dos filtros escolhidos. Ex. Exiba Genero Feminino ou Lotado em Delegacias de Proteção a Mulher"
                  placement="right"
                >
                  <Form.Item
                    name="zdp_opcao_or"
                    label="Que tenha UM deste filtros"
                  >
                    <Select
                      mode="multiple"
                      placeholder="Feminino OU Proteção a Mulher"
                      value={selectedItemsFiltroPre}
                      onChange={setSelectedItemsFiltroPre}
                      style={{ width: 300 }}
                      options={filteredOptions.map(item => ({
                        value: item,
                        label: customLabelFiltro(item),
                      }))}
                    />
                  </Form.Item>
                </Tooltip>
              </Col>
            </Row>
            <Row style={{ width: '100%' }}>
              <Col span={10} style={{ paddingRight: 5 }}>
                <Tooltip
                  trigger={['hover']}
                  title="Resultados que coincidam TODOS dos filtros escolhidos. Ex. Exiba Genero Feminino ou Lotado em Delegacias de Proteção a Mulher"
                  placement="right"
                >
                  <Form.Item
                    name="zdp_opcao_and"
                    label="Que tenha TODOS estes filtros"
                  >
                    <Select
                      mode="multiple"
                      placeholder="Feminino E Proteção a Mulher"
                      value={selectedItemsFiltroPre}
                      onChange={setSelectedItemsFiltroPre}
                      style={{ width: 300 }}
                      options={filteredOptions.map(item => ({
                        value: item,
                        label: customLabelFiltro(item),
                      }))}
                    />
                  </Form.Item>
                </Tooltip>
              </Col>
            </Row>
            <Row style={{ width: '100%' }}>
              <Col lg={6} xl={7} xxl={8}>
                <Tooltip
                  trigger={['hover']}
                  title="Nome da unidade, superior, cidade, titular."
                  placement="right"
                >
                  <Form.Item name="znome_filtro" label="Pesquisar por">
                    <Input
                      style={{ fontSize: '12px' }}
                      onInput={e =>
                        ((e.target as HTMLInputElement).value = (
                          e.target as HTMLInputElement
                        ).value.toUpperCase())
                      }
                      className="bold-text-input"
                    />
                  </Form.Item>
                </Tooltip>
              </Col>

              <Col lg={6} xl={7} xxl={8} style={{ paddingRight: 5 }}>
                <Tooltip
                  trigger={['hover']}
                  title="Escolha como ordenar o resultado dos Departamentos, Servidores e Viaturas"
                  placement="right"
                >
                  <Form.Item name="zorder" label="Ordenar Por">
                    <Select
                      options={[
                        {
                          value: 'SERVIDOReDEPARTAMENTO',
                          label: 'Nome do Servidor, Nome Departamento',
                        },
                        {
                          value: 'HIERARQUIAeSERVIDOR',
                          label: 'Hierarquia, Nome do Servidor',
                        },
                        {
                          value: 'HIERARQUIAeCARGOeSERVIDOR',
                          label: 'Hierarquia, Cargo e Nome do Servidor',
                        },
                      ]}
                    />
                  </Form.Item>
                </Tooltip>
              </Col>
            </Row>
            <Row style={{ width: '100%' }}>
              <Form.Item hidden name="zcpfs">
                <Input />
              </Form.Item>
              <Form.Item hidden name="zdeps_ids">
                <Input />
              </Form.Item>
              <Col lg={11} xl={11} xxl={11}>
                <Form.Item name="zfiltros_adcionais" label="Filtros Adcionais">
                  <Select
                    options={[
                      {
                        value: '',
                        label: '',
                      },
                      {
                        value: 'SEM_SERVIDORES',
                        label: 'Departamentos Sem Servidores',
                      },
                      {
                        value: 'COM_ORGANIZACIONAIS',
                        label: 'Departamentos Organizacionais',
                      },
                    ]}
                    style={{ width: '300px' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Drawer>

          <Drawer
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', color: 'darkgreen' }}>
                  Fazer Upload de Arquivo do Servidor {ServidorNome}
                </span>
              </div>
            }
            width={720}
            placement={'right'}
            onClose={onCloseDrawerUpload}
            open={openDrawerUpload}
          >
            <Row style={{ width: '100%' }}>
              <SeletorDossiePastaComponent
                form={form_departamentos}
                index={'1'}
                xlabel={'Pasta'}
                xobrigatorio={false}
                xtooltip={''}
                ClickSeletorDossiePasta={ClickSeletorDossiePasta}
              />

              <Col span={9}>
                <Form.Item
                  name="dossie_numero_sei"
                  label="Sei"
                  style={{ marginTop: 30 }}
                >
                  <Input
                    maxLength={16}
                    style={{ width: 160, fontSize: '12px' }}
                    onInput={e =>
                      ((e.target as HTMLInputElement).value = (
                        e.target as HTMLInputElement
                      ).value.toUpperCase())
                    }
                    placeholder="Número do SEI"
                    className="bold-text-input"
                    onKeyDown={e => {
                      if (e.key === 'Backspace') {
                        return;
                      }

                      const isNumber = e.key >= '0' && e.key <= '9';
                      if (
                        e.key === 'Backspace' ||
                        e.key === 'Delete' ||
                        e.key === 'Tab' ||
                        e.key === 'ArrowLeft' ||
                        e.key === 'ArrowUp' ||
                        e.key === 'ArrowRight' ||
                        e.key === 'ArrowDown' ||
                        e.key === 'c' ||
                        e.key === 'C' ||
                        e.key === 'V' ||
                        e.key === 'v'
                      ) {
                        return;
                      }
                      if (!isNumber) {
                        e.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {DossieLiberarUpload === true ? (
              <>
                <Row style={{ width: '100%' }}>
                  <Col span={8} style={{ paddingRight: 5 }}>
                    <Tooltip
                      trigger={['focus']}
                      title="Legenda para o arquivo que será anexada"
                      placement="top"
                    >
                      <Form.Item
                        name="legenda_dossie"
                        label="Legenda"
                        className="exibition-text-bold"
                      >
                        <TextArea
                          placeholder="Observações sobre o arquivo"
                          allowClear
                        />
                      </Form.Item>
                    </Tooltip>
                  </Col>

                  <Col>
                    <Form.Item hidden name="arquivo_upload_servidor_id">
                      <Input />
                    </Form.Item>
                    <Form.Item hidden name="arquivo_upload_dossie_id">
                      <Input />
                    </Form.Item>
                    <Upload
                      name="file"
                      action="/upload"
                      showUploadList={false}
                      beforeUpload={file => {
                        const fileType = getFileType(file); // Função para determinar o tipo do arquivo
                        sendFileWsDossie(file, fileType);
                        return false;
                      }}
                    >
                      <Button
                        type="primary"
                        style={{ marginTop: 30 }}
                        icon={<CloudUploadOutlined />}
                      >
                        {'Anexar Arquivo'}
                      </Button>
                    </Upload>
                  </Col>
                </Row>
              </>
            ) : null}

            <Row style={{ width: '100%' }}>
              <Tabs
                defaultActiveKey="1"
                activeKey={activeTabDossie}
                style={{
                  maxHeight: 'calc(100vh - 50px)',
                  maxWidth: 700,
                }}
                onTabClick={handleTabDossieClick}
              >
                <TabPane
                  tab={
                    <span style={{ fontWeight: 'bold' }}>
                      <CloudOutlined style={{ color: 'blue' }} />
                      Arquivos Anexados
                    </span>
                  }
                  key="1"
                >
                  <Table
                    columns={columnsLaudoArquivos}
                    dataSource={servidorPortaArquivoDados}
                    /* scroll={{ x: 600 }}*/
                    style={{ border: '4px outset lightgray' }}
                    pagination={{ pageSize: 50 }}
                    footer={() => (
                      <div style={{ color: 'green', fontWeight: 'bold' }}>
                        Total de arquivos: {servidorPortaArquivoDados.length}
                      </div>
                    )}
                  />
                </TabPane>

                <TabPane
                  tab={
                    <span style={{ fontWeight: 'bold' }}>
                      <FundViewOutlined style={{ color: 'brown' }} />
                      Auditória
                    </span>
                  }
                  key="2"
                >
                  <Timeline
                    mode="alternate"
                    items={ArrayAuditoriasDossie}
                    style={{ width: 700, marginTop: 20 }}
                  />
                </TabPane>
              </Tabs>
            </Row>
          </Drawer>
        </Spin>
      </Form>

      <Modal
        width="90%"
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span dangerouslySetInnerHTML={{ __html: ModalServidorTitulo }} />
          </div>
        }
        open={ModalServidor}
        onCancel={ModalServidorHide}
        footer={[
          <Button key="back" onClick={ModalServidorHide}>
            Voltar sem Salvar
          </Button>,
          <Button key="submit" type="primary" onClick={form_servidores.submit}>
            Salvar Servidor
          </Button>,
        ]}
      >
        <Form
          form={form_servidores}
          onFinish={FormServidoresSubmit}
          layout="vertical"
          initialValues={{
            servidor_id: '',
            servidor: '',
            sicad_id: '',
            celular: '',
            telefone: '',
            email: '',
            lotacao_atual: '',
            dta_lotacao: '',
            dta_nascimento: '',
            funcao: '',
            serv_escala: '',
            escala_grupo: '',
            classificacao: '',
            //departamento_id_2: '',
            //departamento_2: '',
            chefia: 'NAO',
            restricao_sei: '',
            restricao_arma: false,
            restricao_medica: false,
            restricao_judicial: false,
            restricao_obs: '',
            cpf: '',
            dta_posse: '',
            dta_nomeacao: '',
            dta_inicio_lotacao: '',
            pne: 'N',
            sub_judice: 'N',
            probatorio: 'N',
            nome_mae: '',
            regime_juridico: '',
            naturalidade: '',
            cor_raca: '',
            escolaridade: '',
            especialidade: '',
            estado_civil: '',
            situacao: '',
            /*dta_posse: dayjs(data.format('DD/MM/YYYY'), 'DD/MM/YYYY'),
            dta_nomeacao: dayjs(data.format('DD/MM/YYYY'), 'DD/MM/YYYY'),
            dta_inicio_lotacao: dayjs(data.format('DD/MM/YYYY'), 'DD/MM/YYYY'),*/
          }}
        >
          <Spin spinning={openServidorLoad} tip={messageServidorLoad}>
            {contextHolder}

            <Row style={{ width: '100%' }}>
              <Form.Item hidden name="servidor_id">
                <Input />
              </Form.Item>
              <Form.Item hidden name="servidor">
                <Input />
              </Form.Item>
              <Form.Item hidden name="sicad_id">
                <Input />
              </Form.Item>
              <Form.Item hidden name="cargo">
                <Input />
              </Form.Item>
              <Form.Item hidden name="cpf">
                <Input />
              </Form.Item>

              <Col span={1} style={{ paddingRight: 5 }}>
                <Tooltip
                  trigger={['hover']}
                  title={labelServidorDoc}
                  placement="top"
                >
                  <IdcardOutlined style={{ fontSize: 32 }} />
                </Tooltip>
              </Col>

              <Col span={4} style={{ paddingRight: 5 }}>
                <Form.Item
                  name="funcao"
                  label="Função"
                  className="exibition-text-bold"
                >
                  <Input
                    className="exibition-text"
                    bordered={false}
                    style={{ color: 'darkgreen', fontWeight: 'bold' }}
                    readOnly
                  />
                </Form.Item>
              </Col>

              <Col span={3} style={{ paddingRight: 5 }}>
                <Form.Item
                  name="dta_lotacao"
                  label="Data Lotação Atual"
                  className="exibition-text-bold"
                >
                  <Input
                    className="exibition-text"
                    bordered={false}
                    style={{ color: 'darkgreen', fontWeight: 'bold' }}
                    readOnly
                  />
                </Form.Item>
              </Col>
              <Col span={5} style={{ paddingRight: 5 }}>
                <Form.Item
                  name="lotacao_atual"
                  label="Lotado Atualmente em"
                  className="bold-text-input"
                >
                  <Input
                    className="bold-text-input"
                    bordered={false}
                    style={{ color: 'darkgreen', fontWeight: 'bold' }}
                    readOnly
                  />
                </Form.Item>
              </Col>
            </Row>

            <Tabs
              defaultActiveKey="1"
              tabPosition="left"
              activeKey={ActiveTabServidorModal}
              onTabClick={handleTabServidorModalClick}
            >
              <TabPane
                tab={
                  <span
                    style={{
                      fontWeight:
                        ActiveTabServidorModal === '1' ? 'bold' : 'normal',
                      color:
                        ActiveTabServidorModal === '1' ? 'blue' : 'darkblue',
                    }}
                  >
                    <UserOutlined
                      style={{
                        color:
                          ActiveTabServidorModal === '1' ? 'blue' : 'darkblue',
                      }}
                    />
                    Dados Pessoais
                  </span>
                }
                key="1"
              >
                <Row style={{ width: '100%' }}>
                  <Col span={5} style={{ paddingRight: 5 }}>
                    <Form.Item
                      name="nome_mae"
                      label="Nome da Mãe:"
                      className="exibition-text-bold"
                    >
                      <Input
                        className="exibition-text"
                        bordered={false}
                        style={{ color: 'black', fontWeight: 'bold' }}
                        readOnly
                      />
                    </Form.Item>
                  </Col>

                  <Col span={3} style={{ paddingRight: 5 }}>
                    <Form.Item
                      name="estado_civil"
                      label="Estado Civil:"
                      className="exibition-text-bold"
                    >
                      <Input
                        className="exibition-text"
                        bordered={false}
                        style={{ color: 'black', fontWeight: 'bold' }}
                        readOnly
                      />
                    </Form.Item>
                  </Col>

                  <Col span={3} style={{ paddingRight: 5 }}>
                    <Form.Item
                      name="escolaridade"
                      label="Escolaridade:"
                      className="exibition-text-bold"
                    >
                      <Input
                        className="exibition-text"
                        bordered={false}
                        style={{ color: 'darkgreen', fontWeight: 'bold' }}
                        readOnly
                      />
                    </Form.Item>
                  </Col>

                  <Col span={3} style={{ paddingRight: 5 }}>
                    <Form.Item
                      name="especialidade"
                      label="Especialidade:"
                      className="exibition-text-bold"
                    >
                      <Input
                        className="exibition-text"
                        bordered={false}
                        style={{ color: 'darkgreen', fontWeight: 'bold' }}
                        readOnly
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row style={{ width: '100%' }}>
                  <Col span={3} style={{ paddingRight: 5 }}>
                    <Form.Item
                      name="dta_nascimento"
                      label="Nascimento:"
                      className="exibition-text-bold"
                    >
                      <Input
                        className="exibition-text"
                        bordered={false}
                        style={{ fontWeight: 'bold' }}
                        readOnly
                      />
                    </Form.Item>
                  </Col>

                  <Col span={3} style={{ paddingRight: 5 }}>
                    <Form.Item
                      name="naturalidade"
                      label="Naturalidade:"
                      className="exibition-text-bold"
                    >
                      <Input
                        className="exibition-text"
                        bordered={false}
                        style={{ color: 'black', fontWeight: 'bold' }}
                        readOnly
                      />
                    </Form.Item>
                  </Col>

                  <Col span={3} style={{ paddingRight: 5 }}>
                    <Form.Item
                      name="cor_raca"
                      label="Cor/Raça:"
                      className="exibition-text-bold"
                    >
                      <Input
                        className="exibition-text"
                        bordered={false}
                        style={{ color: 'black', fontWeight: 'bold' }}
                        readOnly
                      />
                    </Form.Item>
                  </Col>
                  <Col lg={2} xl={2} xxl={2} style={{ paddingRight: 5 }}>
                    <Form.Item name="pne" label="PNE:">
                      <Select
                        options={[
                          { value: 'N', label: 'Não' },
                          { value: 'S', label: 'Sim' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row style={{ width: '100%' }}>
                  <Col span={3} style={{ paddingRight: 5 }}>
                    <Space.Compact>
                      <Form.Item name="celular" label="Celular:">
                        <Input
                          maxLength={11}
                          onInput={e =>
                            ((e.target as HTMLInputElement).value = (
                              e.target as HTMLInputElement
                            ).value.toUpperCase())
                          }
                          className="bold-text-input"
                          onKeyDown={e => {
                            if (e.key === 'Backspace') {
                              return;
                            }

                            const isNumber = e.key >= '0' && e.key <= '9';
                            if (
                              e.key === 'Tab' ||
                              e.key === 'Backspace' ||
                              e.key === 'ArrowLeft' ||
                              e.key === 'ArrowUp' ||
                              e.key === 'ArrowRight' ||
                              e.key === 'ArrowDown' ||
                              e.key === 'Delete' ||
                              e.key === 'c' ||
                              e.key === 'C' ||
                              e.key === 'V' ||
                              e.key === 'v'
                            ) {
                              return;
                            }
                            if (!isNumber) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </Form.Item>
                      <Button
                        title="Tentar Contato via WhatsApp no Celular do Servidor"
                        onClick={() =>
                          FalarViaWhats(
                            form_servidores.getFieldValue('servidor'),
                            form_servidores.getFieldValue('celular'),
                          )
                        }
                        style={{ marginTop: 30 }}
                        icon={<WhatsAppOutlined style={{ color: 'green' }} />}
                      ></Button>
                    </Space.Compact>
                  </Col>

                  <Col span={3} style={{ paddingRight: 5 }}>
                    <Space.Compact>
                      <Form.Item name="telefone" label="Telefone:">
                        <Input
                          maxLength={11}
                          onInput={e =>
                            ((e.target as HTMLInputElement).value = (
                              e.target as HTMLInputElement
                            ).value.toUpperCase())
                          }
                          className="bold-text-input"
                          onKeyDown={e => {
                            if (e.key === 'Backspace') {
                              return;
                            }

                            const isNumber = e.key >= '0' && e.key <= '9';
                            if (
                              e.key === 'Tab' ||
                              e.key === 'Backspace' ||
                              e.key === 'ArrowLeft' ||
                              e.key === 'ArrowUp' ||
                              e.key === 'ArrowRight' ||
                              e.key === 'ArrowDown' ||
                              e.key === 'Delete' ||
                              e.key === 'c' ||
                              e.key === 'C' ||
                              e.key === 'V' ||
                              e.key === 'v'
                            ) {
                              return;
                            }
                            if (!isNumber) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </Form.Item>

                      <Button
                        title="Tentar Contato via WhatsApp no Celular do Servidor"
                        onClick={() =>
                          FalarViaWhats(
                            form_servidores.getFieldValue('telefone'),
                            form_servidores.getFieldValue('celular'),
                          )
                        }
                        style={{ marginTop: 30 }}
                        icon={<WhatsAppOutlined style={{ color: 'green' }} />}
                      ></Button>
                    </Space.Compact>
                  </Col>

                  <Col span={5} style={{ paddingRight: 5 }}>
                    <Tooltip
                      trigger={['hover']}
                      title="Email do Servidor."
                      placement="top"
                    >
                      <Form.Item name="email" label="Email:">
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
              </TabPane>
              <TabPane
                tab={
                  <span
                    style={{
                      fontWeight:
                        ActiveTabServidorModal === '2' ? 'bold' : 'normal',
                      color:
                        ActiveTabServidorModal === '2' ? 'blue' : 'darkblue',
                    }}
                  >
                    <SafetyOutlined
                      style={{
                        color:
                          ActiveTabServidorModal === '2' ? 'blue' : 'darkblue',
                      }}
                    />
                    Cargo/Função
                  </span>
                }
                key="2"
              >
                <Row style={{ width: '100%' }}>
                  {/*
              <Col span={5} style={{ paddingRight: 5 }}>
                <SeletorDepartamentosComponent
                  form={form_servidores}
                  index={'2'}
                  xlabel={'Departamento'}
                  xobrigatorio={true}
                  xtooltip={'Departamento de lotação do servidor'}
                  xcampo_fone={''}
                  xunidade_pai_filtro_id={-1}
                />
              </Col>
                    */}

                  <Col span={4} style={{ paddingRight: 5 }}>
                    <Form.Item
                      name="classificacao"
                      label="Classificação:"
                      rules={[
                        {
                          required: true,
                          message: 'Informe a Classificação do servidor!',
                        },
                      ]}
                    >
                      <Select style={{ width: 160 }}>
                        <Option value="DELEGADO">
                          <span style={{ color: 'darkblue' }}>
                            <AlertOutlined style={{ color: 'red' }} /> Delegado
                          </span>
                        </Option>
                        <Option value="ESCRIVAO">
                          <span style={{ color: 'darkblue' }}>
                            <AlertOutlined style={{ color: 'red' }} /> Escrivão
                          </span>
                        </Option>
                        <Option value="AGENTE">
                          <span style={{ color: 'darkblue' }}>
                            <AlertOutlined style={{ color: 'red' }} /> Agente
                          </span>
                        </Option>
                        <Option value="PAPILOSCOPISTA">
                          <span style={{ color: 'darkblue' }}>
                            <AlertOutlined style={{ color: 'red' }} />{' '}
                            Papiloscopista
                          </span>
                        </Option>
                        <Option value="ADMINISTRATIVO">
                          <span style={{ color: 'black' }}>Assessor ADM</span>
                        </Option>
                        <Option value="CAIXEGO">
                          <span style={{ color: 'bown' }}>Caixego</span>
                        </Option>
                        <Option value="IQUEGO">
                          <span style={{ color: 'bown' }}>Iquego</span>
                        </Option>
                        <Option value="METROBUS">
                          <span style={{ color: 'bown' }}>Metrobus</span>
                        </Option>
                        <Option value="ESTAGIARIO">
                          <span style={{ color: 'bown' }}>Estagiário</span>
                        </Option>
                        <Option value="DIGITADOR">
                          <span style={{ color: 'bown' }}>Digitador</span>
                        </Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col lg={2} xl={2} xxl={2} style={{ paddingRight: 5 }}>
                    <Tooltip
                      trigger={['hover']}
                      title="Escala de Trabalho do servidor"
                      placement="top"
                    >
                      <Form.Item name="serv_escala" label="Escala:">
                        <Select
                          options={[
                            { value: '', label: '-' },
                            { value: 'EXPEDIENTE', label: 'Expediente' },
                            { value: 'PLANTÃO', label: 'Plantão' },
                          ]}
                        />
                      </Form.Item>
                    </Tooltip>
                  </Col>

                  <Col span={2} style={{ paddingRight: 5 }}>
                    <Tooltip
                      trigger={['hover']}
                      title="Em caso de plantão, qual grupo: A, B, C ou D. Em caso de Cartório Qual: 1, 2, 3, 4."
                      placement="top"
                    >
                      <Form.Item name="escala_grupo" label="Grupo/Catório:">
                        <Input />
                      </Form.Item>
                    </Tooltip>
                  </Col>

                  <Col span={3} style={{ paddingRight: 5 }}>
                    <Tooltip
                      trigger={['hover']}
                      title="Exerce posto de chefia"
                      placement="top"
                    >
                      <Space.Compact>
                        <Form.Item name="chefia" label="Chefe?">
                          <Select
                            style={{ width: 160 }}
                            options={[
                              { value: 'NAO', label: 'Não' },
                              { value: 'SECAO', label: 'Seção' },
                              { value: 'DIVISAO', label: 'Divisão' },
                              { value: 'GERENTE', label: 'Gerência' },
                              {
                                value: 'SUPERINTENDENTE',
                                label: 'Superintendente',
                              },
                            ]}
                          />
                          {/*  <Checkbox checked={chefiachk} onChange={handleChefiachkChange}>Chefia</Checkbox>*/}
                        </Form.Item>
                        <CoffeeOutlined
                          style={{ color: 'brown', fontSize: 24 }}
                        />
                      </Space.Compact>
                    </Tooltip>
                  </Col>
                </Row>
                <Row style={{ width: '100%' }}>
                  <Col span={4} style={{ paddingRight: 5 }}>
                    <Form.Item
                      name="regime_juridico"
                      label="Regime Jurídico:"
                      className="exibition-text-bold"
                    >
                      <Input
                        className="exibition-text"
                        bordered={false}
                        style={{ color: 'darkgreen', fontWeight: 'bold' }}
                        readOnly
                      />
                    </Form.Item>
                  </Col>
                  <Col span={4} style={{ paddingRight: 5 }}>
                    <Form.Item
                      name="situacao"
                      label="Situação:"
                      className="exibition-text-bold"
                    >
                      <Input
                        className="exibition-text"
                        bordered={false}
                        style={{
                          color: getSituacaoColor(
                            form_servidores.getFieldValue('situacao'),
                          ),
                          fontWeight: 'bold',
                        }}
                        readOnly
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>
              <TabPane
                tab={
                  <span
                    style={{
                      fontWeight:
                        ActiveTabServidorModal === '3' ? 'bold' : 'normal',
                      color:
                        ActiveTabServidorModal === '3' ? 'blue' : 'darkblue',
                    }}
                  >
                    <ScheduleOutlined
                      style={{
                        color:
                          ActiveTabServidorModal === '3' ? 'blue' : 'darkblue',
                      }}
                    />
                    Nomeação
                  </span>
                }
                key="3"
              >
                <Row style={{ width: '100%' }}>
                  {/*<Col span={3} style={{ paddingRight: 5 }}>
                    <Form.Item name="dta_nomeacao" label="Data Nomeação:">
                      <DatePicker format={'DD/MM/YYYY'} locale={locale} />
                    </Form.Item>
                  </Col>

                  <Col span={3} style={{ paddingRight: 5 }}>
                    <Form.Item name="dta_posse" label="Data Posse:">
                      <DatePicker format={'DD/MM/YYYY'} locale={locale} />
                    </Form.Item>
                  </Col>

                  <Col span={3} style={{ paddingRight: 5 }}>
                    <Form.Item
                      name="dta_inicio_lotacao"
                      label="Data Início Exercício:"
                    >
                      <DatePicker format={'DD/MM/YYYY'} locale={locale} />
                    </Form.Item>
                  </Col>*/}

                  <Col span={3} style={{ paddingRight: 5 }}>
                    <Form.Item
                      name="dta_nomeacao"
                      label="Nomeação:"
                      className="exibition-text-bold"
                    >
                      <Input
                        className="exibition-text"
                        bordered={false}
                        style={{ color: 'darkgreen', fontWeight: 'bold' }}
                        readOnly
                      />
                    </Form.Item>
                  </Col>

                  <Col span={3} style={{ paddingRight: 5 }}>
                    <Form.Item
                      name="dta_posse"
                      label="Posse:"
                      className="exibition-text-bold"
                    >
                      <Input
                        className="exibition-text"
                        bordered={false}
                        style={{ color: 'darkgreen', fontWeight: 'bold' }}
                        readOnly
                      />
                    </Form.Item>
                  </Col>

                  <Col lg={2} xl={2} xxl={2} style={{ paddingRight: 5 }}>
                    <Form.Item name="sub_judice" label="Sub Júdice:">
                      <Select
                        options={[
                          { value: 'N', label: customLabelJudice('N') },
                          { value: 'S', label: customLabelJudice('S') },
                        ]}
                      />
                    </Form.Item>
                  </Col>

                  <Col lg={2} xl={2} xxl={2} style={{ paddingRight: 5 }}>
                    <Form.Item name="probatorio" label="Probatório:">
                      <Select
                        options={[
                          { value: 'N', label: customLabelProbatorio('N') },
                          { value: 'S', label: customLabelProbatorio('S') },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>
              <TabPane
                tab={
                  <span
                    style={{
                      fontWeight:
                        ActiveTabServidorModal === '4' ? 'bold' : 'normal',
                      color:
                        ActiveTabServidorModal === '4' ? 'blue' : 'darkblue',
                    }}
                  >
                    <EnvironmentOutlined
                      style={{
                        color:
                          ActiveTabServidorModal === '4' ? 'blue' : 'darkblue',
                      }}
                    />
                    Restrições
                  </span>
                }
                key="4"
              >
                <Row style={{ width: '100%' }}>
                  <Col lg={2} xl={3} xxl={3} style={{ paddingRight: 5 }}>
                    <Tooltip
                      trigger={['hover']}
                      title="Digite o número do SEI."
                      placement="top"
                    >
                      <Form.Item name="restricao_sei" label="Sei Processo:">
                        <Input
                          maxLength={16}
                          style={{ fontSize: '12px' }}
                          onInput={e =>
                            ((e.target as HTMLInputElement).value = (
                              e.target as HTMLInputElement
                            ).value.toUpperCase())
                          }
                          className="bold-text-input"
                          onKeyDown={e => {
                            if (e.key === 'Backspace') {
                              return;
                            }

                            const isNumber = e.key >= '0' && e.key <= '9';
                            if (
                              e.key === 'Backspace' ||
                              e.key === 'Delete' ||
                              e.key === 'Tab' ||
                              e.key === 'ArrowLeft' ||
                              e.key === 'ArrowUp' ||
                              e.key === 'ArrowRight' ||
                              e.key === 'ArrowDown' ||
                              e.key === 'c' ||
                              e.key === 'C' ||
                              e.key === 'V' ||
                              e.key === 'v'
                            ) {
                              return;
                            }
                            if (!isNumber) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </Form.Item>
                    </Tooltip>
                  </Col>

                  <Col lg={5} xl={5} xxl={6} style={{ paddingRight: 5 }}>
                    <Tooltip
                      trigger={['hover']}
                      title="Em caso de alguma restrição ao porte de arma, informar SEI no campo anteriror"
                      placement="top"
                    >
                      <Form.Item name="restricao_arma" label="Restrição Arma:">
                        <Select
                          options={[
                            { value: false, label: customLabelArma(false) },
                            { value: true, label: customLabelArma(true) },
                          ]}
                        />
                      </Form.Item>
                    </Tooltip>
                  </Col>

                  <Col lg={5} xl={5} xxl={6} style={{ paddingRight: 5 }}>
                    <Tooltip
                      trigger={['hover']}
                      title="Em caso de alguma restrição de saúde, informar SEI no campo anteriror"
                      placement="top"
                    >
                      <Form.Item
                        name="restricao_medica"
                        label="Restrição Médica:"
                      >
                        <Select
                          options={[
                            { value: false, label: customLabelSaude(false) },
                            { value: true, label: customLabelSaude(true) },
                          ]}
                        />
                      </Form.Item>
                    </Tooltip>
                  </Col>

                  <Col lg={5} xl={5} xxl={6} style={{ paddingRight: 5 }}>
                    <Tooltip
                      trigger={['hover']}
                      title="Em caso de alguma restrição judicial, informar SEI no campo anteriror"
                      placement="top"
                    >
                      <Form.Item
                        name="restricao_judicial"
                        label="Restrição Judicial:"
                      >
                        <Select
                          options={[
                            { value: false, label: customLabelJudicial(false) },
                            { value: true, label: customLabelJudicial(true) },
                          ]}
                        />
                      </Form.Item>
                    </Tooltip>
                  </Col>
                </Row>
                <Row style={{ width: '100%' }}>
                  <Col span={4} style={{ paddingRight: 5 }}>
                    <Form.Item
                      name="punicoes"
                      label="Punições:"
                      className="exibition-text-bold"
                    >
                      <Input
                        className="exibition-text"
                        bordered={false}
                        style={{ color: 'darkred', fontWeight: 'bold' }}
                        readOnly
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>

            <Row style={{ width: '100%' }}>
              <Divider plain style={{ fontWeight: 'bold', color: 'darkgray' }}>
                Observações
              </Divider>
            </Row>

            <Row style={{ width: '100%' }}>
              <Tooltip trigger={['hover']} placement="top">
                <Form.Item name="restricao_obs" style={{ width: '100%' }}>
                  <TextArea
                    placeholder="Observações sobre o servidor ou referente as suas restrições"
                    allowClear
                  />
                </Form.Item>
              </Tooltip>
            </Row>
          </Spin>
        </Form>
      </Modal>
    </div>
  );
};

export default Departamentos;

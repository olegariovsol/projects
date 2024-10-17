import React from "react";
import {
  Form,
  Row,
  Tooltip,
  Input,
  Switch,
  Select,
  Button,
  message,
  Space,
  DatePicker,
  Col,
  Divider,
  Table,
  Modal,
  AutoComplete,
  notification,
} from "antd";
import { CSSProperties, useRef, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import locale from "antd/es/date-picker/locale/pt_BR";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useAuth } from "../../contexts/auth/AuthProvider";
import { useAxiosSICAD } from "../../hooks/useAxiosSICAD";
import { useAxiosHistoricotipo } from "../../hooks/useAxiosHistoricoTipo";
import { useAxiosServidor } from "../../hooks/useAxiosServidor";
import { useAxiosServidorHistorico } from "../../hooks/useAxiosServidorHistorico";
import {
  LikeOutlined,
  DislikeOutlined,
  ClearOutlined,
  AlertOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  StarOutlined,
  ShoppingOutlined,
  TeamOutlined,
  SearchOutlined,
  ApiOutlined,
  UserOutlined,
  ClockCircleOutlined,
  PrinterOutlined,
  CheckOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  IssuesCloseOutlined,
  BankOutlined,
  StopOutlined,
  ExclamationOutlined,
  QuestionCircleOutlined,
  VerticalAlignTopOutlined,
  WhatsAppOutlined,
  SaveOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  CarryOutOutlined,
  FolderOpenOutlined,
  WomanOutlined,
  ManOutlined,
} from "@ant-design/icons";
import duration from "dayjs/plugin/duration";
import { generatePDF } from "../report/index_aposentadoria";
import { Spin } from "antd/lib";

dayjs.extend(duration);

const { RangePicker } = DatePicker;

const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

/*TABLE*/
interface DataTypeRegasAposentadoria {
  key: React.Key;
  coluna_a1: string;
  coluna_b1: string;
  coluna_c1: string;
  coluna_d1: string;
  coluna_a2: string;
  coluna_b2: string;
  coluna_c2: string;
  coluna_d2: string;
  coluna_a3: string;
  coluna_b3: string;
  coluna_c3: string;
  coluna_d3: string;
  hint_a1: string;
  hint_a2: string;
  hint_a3: string;
  hint_b1: string;
  hint_b2: string;
  hint_b3: string;
  hint_c1: string;
  hint_c2: string;
  hint_c3: string;
  hint_d1: string;
  hint_d2: string;
  hint_d3: string;
  icon_regra1: string;
  icon_regra2: string;
  icon_regra3: string;
  icon_regra1_hint: string;
  icon_regra2_hint: string;
  icon_regra3_hint: string;
  etiqueta_relatorio: string;
  a1_persona: string;
  b1_persona: string;
  c1_persona: string;
  d1_persona: string;
  a2_persona: string;
  b2_persona: string;
  c2_persona: string;
  d2_persona: string;
  a3_persona: string;
  b3_persona: string;
  c3_persona: string;
  d3_persona: string;
}

interface DataTypeHistorico {
  key: React.Key;
  servidor_historico_id: string;
  historico_tipo_id: string;
  historico_tipo: string;
  carreira: string;
  carreira_desc: string;
  sinal: number;
  label_dtai: string;
  label_dtaf: string;
  dtai_br: string;
  dtaf_br: string;
  dta_cad_br: string;
  user_cad: string;
  dias: number;
  obs_historico: string;
  dta_label_br: string;
}

/**************************************************************************
 * **********************************TABELA CAMPOS**************************
 * ************************************************************************/
interface DataTypeAnexoConsulta {
  key: React.Key;
  servidor_id: string;
  numero: string;
  sicad_id: string;
  cpf: string;
  nome: string;
  genero: string;
  cargo: string;
  telefone: string;
  email: string;
  dp_lotacao: string;
  dp_lotacao_id: string;
  dta_nascimento_br: string;
  dta_inicio_br: string;
  dta_requisicao_br: string;
  dta_ultima_lotacao_br: string;
  idade_requisicao: string;
  regra: string;
  regra_desc: string;
  user_cad: string;
  dta_cad_br: string;
  dta_up_br: string;
  sei: string;
  historico_id: string;
  idade_minima_1035_analise: string;
  idade_minima_10353: string;
  idade_minima_10353_analise: string;
  risco_total: string;
  risco_total_analise: string;
}

/**************************************************************************
 * **********************************FORM GERAL****************************
 * ************************************************************************/
const Aposentadoria = () => {
  const auth = useAuth();
  const data = dayjs();
  /**************************************************************************
   * **********************************VARIÁVEIS****************************
   * ************************************************************************/
  const [form_aposentadoria] = Form.useForm();
  const [form_historico] = Form.useForm();
  const [form_anexos_cons] = Form.useForm();

  /**************************************************************************
   * **********************************FUNÇÕES BD**************************
   * ************************************************************************/

  const apiServidor = useAxiosServidor();

  const FormAposentadoriaCadSubmit = async (fieldsValue: any) => {
    onLoadCadastro("Salvando alterações dos dados do servidor");
    fieldsValue.user_cad_id = auth?.user?.id;
    fieldsValue.user_cad = auth?.user?.nome;

    await apiServidor.saveServidor(fieldsValue).then((res: any) => {
      if (res.status == 200) {
        //onConsultaObraAndamento();
        form_aposentadoria.setFieldValue("aposentadoria_id", res.data[0].id);
        GetServidorAposentadoriaCalculo(
          form_aposentadoria.getFieldValue("cpf"),
          form_aposentadoria.getFieldValue("regra")
        );
        notification.info({ message: res.data.message });
      } else {
        notification.error({
          message: "Erro ao listar Salvar Servidor!",
          description: res.data.message,
        });
      }
    });
    exitLoadCadastro();
    //onConsultaObra();
  };

  const [anexosConsulta, setAnexosConsulta] = useState([]);
  const onConsultaAnexos = async () => {
    onLoadConsulta(
      "Guenta um instantinho que já estou buscando as obras cadastradas."
    );

    var xliberar = false;
    var xdtai = "";
    var xdtaf = "";

    const selectedDateRange = form_anexos_cons.getFieldValue("zcons_data");
    if (selectedDateRange && selectedDateRange.length === 2) {
      const [dataInicial, dataFinal] = selectedDateRange;
      xdtai = dataInicial.format("MM/DD/YYYY");
      xdtaf = dataFinal.format("MM/DD/YYYY");
      console.log("Data Final:", dataFinal.format("MM/DD/YYYY"));
    }
    if (xdtai == "" || xdtaf == "") {
      notification.error({
        message: "Erro!",
        description: "Informe o intervalo de data para pesquisar!",
      });
    } else {
      xliberar = true;
    }

    if (xliberar == true) {
      setAnexosConsulta([]);

      await apiServidor
        .listServidorAnexos(
          xdtai,
          xdtaf,
          form_anexos_cons.getFieldValue("zcons_regra"),
          form_anexos_cons.getFieldValue("zcons_filtro")
        )
        .then((res: any) => {
          if (res.status == 200) {
            let newretorno: any = [];
            console.log(res.data.message);
            res.data.retorno.map((item: any) => {
              newretorno.push(item);
            });
            setAnexosConsulta(newretorno);
          } else {
            notification.error({
              message: "Erro ao listar anexos!",
              description: res.data.message,
            });
          }
        });
    }

    exitLoadConsulta();
  };

  const [dataServidor, setdataServidor] = useState([]);

  const GetServidorFichaAposentadoria = async (xid: string) => {
    setdataServidor([]);

    if (xid == "") {
      xid = form_aposentadoria.getFieldValue("cpf");
    }

    await apiServidor.getServidor(xid).then((res: any) => {
      if (res.status == 200) {
        if (Array.isArray(res.data.retorno) && res.data.retorno.length > 0) {
          const servidor = res.data.retorno[0];
          setdataServidor(servidor);
          form_aposentadoria.setFieldValue("aposentadoria_id", servidor.id);
          form_aposentadoria.setFieldValue("numero", servidor.numero);
          form_aposentadoria.setFieldValue("email", servidor.email);
          form_aposentadoria.setFieldValue("telefone", servidor.telefone);
          form_aposentadoria.setFieldValue("sei", servidor.sei);
          form_aposentadoria.setFieldValue(
            "historico_id",
            servidor.historico_id
          );

          form_aposentadoria.setFieldValue("regra", servidor.regra);
          form_aposentadoria.setFieldValue("idade", servidor.idade_requisicao);
          form_aposentadoria.setFieldValue(
            "dta_requisicao",
            dayjs(servidor.dta_requisicao)
          );

          GetServidorAposentadoriaCalculo(
            xid,
            form_aposentadoria.getFieldValue("regra")
          );

          notification.info({
            message:
              "Ficha do servidor está salva, caso haja alterações, basta fazer e clicar em Salvar Servidor.",
          });
        } else {
          notification.info({
            message:
              "Preencha os campos e clique em salvar para incluir a ficha do servidor.",
          });
        }
      } else {
        notification.error({
          message: "Erro ao buscar ficha do servidor salva na aposentadoria!",
          description: res.data.message,
        });
      }
    });
  };

  const [dataRegrasAposentadoria, setdataRegrasAposentadoria] = useState([]);

  const GetServidorAposentadoriaCalculo = async (
    xid: string,
    xregra: string
  ) => {
    setdataRegrasAposentadoria([]);

    if (xid == "") {
      xid = form_aposentadoria.getFieldValue("cpf");
    }
    if (xregra == "") {
      xregra = form_aposentadoria.getFieldValue("regra");
    }

    await apiServidor.getServidorAposentadoria(xid, xregra).then((res: any) => {
      if (res.status == 200) {
        const newretorno: any = [];
        console.log(res.data.message);
        res.data.retorno.map((item: any) => {
          newretorno.push(item);
        });

        setdataRegrasAposentadoria(newretorno);

        onConsultaHistorico(); //alimenta o array do histórico para a impressão da ficha
      } else {
        notification.error({
          message: "Erro ao buscar calculos de aposentadoria!",
          description: res.data.message,
        });
      }
    });
  };

  const ImprimirLaudo = async () => {
    if (
      form_aposentadoria.getFieldValue("regra") != "ANALISE" &&
      form_aposentadoria.getFieldValue("cpf") != ""
    ) {
      generatePDF(
        dataServidor,
        dataRegrasAposentadoria,
        servidorHistoricoConsulta,
        auth?.user?.nome,
        auth?.user?.cpf
      );
    } else {
      notification.error({
        message: "Erro",
        description:
          "Abra um servidor e escolha uma das regras de aposentadoria!",
      });
    }
  };

  ///////////////////////////////////////////////////////////////////////////Servidores Historicos
  const apiServidorHistorico = useAxiosServidorHistorico();

  const FormHistoricoCadSubmit = async (fieldsValue: any) => {
    fieldsValue.user_cad_id = auth?.user?.id;
    fieldsValue.user_cad = auth?.user?.nome;
    fieldsValue.aposentadoria_id =
      form_aposentadoria.getFieldValue("aposentadoria_id");
    fieldsValue.servidor_cpf = form_aposentadoria.getFieldValue("cpf");

    if (
      fieldsValue.dtai == "" &&
      fieldsValue.dtaf == "" &&
      fieldsValue.dias == ""
    ) {
      notification.error({
        message: "Informe data de início e fim ou número de dias!",
        description: "",
      });
    } else {
      await apiServidorHistorico
        .saveServidorHistorico(fieldsValue)
        .then((res: any) => {
          if (res.status == 200) {
            form_historico.resetFields();
            //form_historico.setFieldValue('servidor_historico_id', res.id);
            onConsultaHistorico();
            notification.info({ message: res.data.message });
          } else {
            notification.error({
              message: "Erro ao listar Salvar Servidor Historico!",
              description: res.data.message,
            });
          }
        });
    }
  };

  const [servidorHistoricoConsulta, setServidorHistoricoConsulta] = useState(
    []
  );

  const onConsultaHistorico = async () => {
    await apiServidorHistorico
      .listServidorHistorico(form_aposentadoria.getFieldValue("cpf"))
      .then((res: any) => {
        if (res.status == 200) {
          const newretorno: any = [];
          console.log(res.data.message);
          res.data.retorno.map((item: any) => {
            newretorno.push(item);
          });
          setServidorHistoricoConsulta(newretorno);
        } else {
          notification.error({
            message: "Erro ao listar histórico!",
            description: res.data.message,
          });
        }
      });
  };

  const [servidorHistoricoExcluirId, setservidorHistoricoExcluirId] =
    useState("");

  const ExcluirHistorico = async (xid: any) => {
    const shouldDelete = window.confirm(
      "Tem certeza de que deseja excluir esta lançamento?"
    );
    if (shouldDelete) {
      try {
        await apiServidorHistorico.deleteServidorHistorico(xid);
        notification.info({ message: "Histórico excluído com sucesso" });
        form_historico.resetFields();
        setservidorHistoricoExcluirId("");
        onConsultaHistorico();
      } catch (error) {
        console.error("Erro ao excluir Histórico:", error);
        notification.error({ message: "Erro ao excluir Histórico" });
      }
    } else {
      // O usuário cancelou a exclusão, não faça nada
    }
  };

  /**************************************************************************
   * **********************************FUNÇÕES BD FIM**************************
   * ************************************************************************/

  /**************************************************************************
   * **********************************LOAD****************************
   * ************************************************************************/
  const [openLoadCadastro, setOpenLoadCadastro] = useState(false);
  const [messageLoadCadastro, setMessageLoadCadastro] = useState("");

  const onLoadCadastro = (message: string) => {
    setMessageLoadCadastro(message);
    setOpenLoadCadastro(true);
  };

  const exitLoadCadastro = () => {
    setOpenLoadCadastro(false);
    setMessageLoadCadastro("");
  };

  const [openLoadConsulta, setOpenLoadConsulta] = useState(false);
  const [messageLoadConsulta, setMessageLoadConsulta] = useState("");

  const onLoadConsulta = (message: string) => {
    setMessageLoadConsulta(message);
    setOpenLoadConsulta(true);
  };

  const exitLoadConsulta = () => {
    setOpenLoadConsulta(false);
    setMessageLoadConsulta("");
  };

  /**************************************************************************
   * **********************************LOAD FIM****************************
   * ************************************************************************/

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
          "Informe pelo menos 3 caracteres para realizar a pesquisa de servidor.",
      });
    } else {
      onLoadCadastro("Minutinho só por favor...");

      await apiSICAD.servidoresPCPorNome(value).then((response: any) => {
        const sortedData = response.data.sort(
          (a: any, b: any) =>
            a.funcao.localeCompare(b.funcao) || a.nome.localeCompare(b.nome)
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
            .locale("pt-br")
            .format("DD/MM/YYYY");
          const dataLotacao = dayjs(item.dtInicioLotacao)
            .locale("pt-br")
            .format("DD/MM/YYYY");
          const dataNascimento = dayjs(item.dtNascimento)
            .locale("pt-br")
            .format("DD/MM/YYYY");
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
    form_aposentadoria.setFieldValue("servidor_id", data.id);
    if (data.sexo == "M") {
      form_aposentadoria.setFieldValue("genero", "MASCULINO");
    } else {
      form_aposentadoria.setFieldValue("genero", "FEMININO");
    }
    form_aposentadoria.setFieldValue("cpf", data.cpf);
    form_aposentadoria.setFieldValue("cargo", data.cargo);
    form_aposentadoria.setFieldValue("lotacao", data.lotacao);
    form_aposentadoria.setFieldValue("lotacao_id", data.lotacao_id);
    //form_aposentadoria.setFieldValue("nascimento", dayjs(data.nascimento));
    form_aposentadoria.setFieldValue("dta_nascimento", data.nascimento);
    form_aposentadoria.setFieldValue("lotacao_dta", data.lotacao_dta);
    form_aposentadoria.setFieldValue("dta_inicio", data.posse_dta);

    // Parse a data de nascimento usando o formato adequado
    const xdta_exp = data.nascimento.split("/"); //gambiarra para funcionar kkkk
    const dataNascimentoFormatada = dayjs(
      xdta_exp[1] + "/" + xdta_exp[0] + "/" + xdta_exp[2],
      { format: "DD/MM/YYYY" }
    );
    const dataAtual = dayjs();

    const diferenca = dayjs.duration(dataAtual.diff(dataNascimentoFormatada));

    const anos = diferenca.years();
    const meses = diferenca.months();
    const dias = diferenca.days();

    form_aposentadoria.setFieldValue(
      "idade",
      anos + " Anos " + meses + " Meses " + dias + " Dias"
    );

    GetServidorFichaAposentadoria(data.cpf);
  };
  const handleEnterPressServidor = (e: any) => {
    if (e.key === "Enter") {
      ListServidores(form_aposentadoria.getFieldValue("servidor"));
    }
  };

  function listaServidoresClick() {
    ListServidores(form_aposentadoria.getFieldValue("servidor"));
  }

  function telefoneWhatsappClick() {
    const telefone = form_aposentadoria.getFieldValue("telefone");

    if (telefone.length >= 10) {
      const link = `https://web.whatsapp.com/send?phone=+55${telefone}&text=Bom dia, ${form_aposentadoria.getFieldValue(
        "servidor"
      )}, tudo bem com você? Aqui quem fala é ${auth?.user?.nome} da ${
        auth?.user?.unidade?.sigla
      }, referente ao seu pedido de aposentadoria; venho lhe informar: `;

      // Abrir o link no WhatsApp
      window.open(link);
    } else {
      notification.error({
        message: "Telefone inválido",
        description:
          "Telefone precisa ter pelo menos 10 números! Ex.: 62980001122 ou 6280001122 ou 6232011122",
      });
    }
  }

  ///////////////////////////////////////////////////////////////////////////Historicos Tipos
  const apiHistoricoTipo = useAxiosHistoricotipo();
  const autoHistoricotipos = useRef(null);
  const [HistoricoTipos, setHistoricoTipos] = useState<
    {
      id: number;
      key: number;
      sinal: number;
      label: string;
      value: string;
      carreira: string;
      options: {
        id: number;
        sinal: number;
        label: string;
        value: string;
        carreira: string;
      }[];
    }[]
  >([]);
  const [showOptionsHistoricoTipos, setShowOptionsHistoricoTipo] =
    useState(false);

  const ListarHistoricoTipos = async () => {
    await apiHistoricoTipo.listHistoricoTipos().then((response: any) => {
      const retornoMap: Record<string, any> = {};

      //console.log(response.data.retorno);

      response.data.map((item: any) => {
        if (!retornoMap[item.carreira]) {
          retornoMap[item.carreira] = {
            label: item.carreira_desc,
            value: item.carreira_desc,
            id: item.carreira,
            key: item.carreira,
            sinal: item.sinal,
            carreira: item.carreira,
            options: [],
          };
          /*console.log('Category: '+item.superior+' - '+item.idSuperior);*/
        }

        retornoMap[item.carreira].options.push({
          label: item.descricao,
          value: item.descricao,
          id: item.id,
          key: item.id,
          sinal: item.sinal,
          carreira: item.carreira,
        });

        //console.log('label: '+item.descricao+' - id: '+item.id+' - sinal: '+item.sinal+' - carreira: '+item.carreira);
      });
      const newretorno = Object.values(retornoMap);
      // console.log(newretorno);
      setHistoricoTipos(newretorno);
      setShowOptionsHistoricoTipo(true);
    });
    return true;
  };

  const onSelectHistoricoTipo = (data: any) => {
    //alert(data.id+' - '+data.label_definitivo+' - '+data.carreira_definitivo);
    form_historico.setFieldValue("historico_tipo_id", data.id);
    form_historico.setFieldValue("historico_tipo", data.label_definitivo);
    form_historico.setFieldValue("historico_tipo_sinal", data.sinal);
    form_historico.setFieldValue("carreira", data.carreira_definitivo);
  };
  const handleEnterPressHistoricoTipo = (e: any) => {
    if (e.key === "Enter") {
      ListarHistoricoTipos();
    }
  };

  const renderItemHistoricoTipoLabel = (
    xcategoria_id: number,
    xcategoria: string,
    xid: number,
    xkey: number,
    xlabel: string,
    xsinal: number,
    xcarreira: string
  ) => ({
    key: xid,
    id: xid,
    value: xlabel,
    sinal: xsinal,
    carreira: xcategoria,
    label: (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          /*color: xstatus ? 'green' : 'red'*/
        }}
        title={xcategoria}
      >
        {
          <span>
            {xsinal === -1 && <MinusCircleOutlined style={{ color: "red" }} />}
            {xsinal === 1 && <PlusCircleOutlined style={{ color: "green" }} />}
          </span>
        }
        {xlabel}
      </div>
    ),
  });

  const renderHistoricoTipoTitle = (title: string) => {
    let color = "black"; // Cor padrão
    const backgroundColor = "lightgray"; // Cor de fundo padrão
    let title_desc = "";

    // Defina cores diferentes com base nos valores de title
    switch (title) {
      case "PCGO":
        color = "blue";
        title_desc = "Cargo Atual PC-GO";
        break;
      case "CLT":
        color = "brown";
        title_desc = "Serviço CLT";
        break;
      case "PUB":
        color = "darkorange";
        title_desc = "Serviço Público sem Risco Policial";
        break;
      case "POL":
        color = "purple";
        title_desc = "Atividade de Risco Policial";
        break;
      default:
        break;
    }

    const titleStyle: CSSProperties = {
      color: color,
      fontWeight: "bold", // Torna o texto em negrito
    };

    const backgroundStyle: CSSProperties = {
      backgroundColor: backgroundColor,
      textAlign: "center", // Centraliza o texto
    };

    return (
      <div style={backgroundStyle}>
        <span>
          {title === "PCGO" && <AlertOutlined style={{ color: "blue" }} />}
          {title === "CLT" && <ShoppingOutlined style={{ color: "brown" }} />}
          {title === "PUB" && <TeamOutlined style={{ color: "orange" }} />}
          {title === "POL" && <StarOutlined style={{ color: "purple" }} />}
        </span>
        <span style={titleStyle}>{" " + title_desc}</span>
      </div>
    );
  };

  const optionsHistoricoTipo = HistoricoTipos.map((option) => ({
    label: renderHistoricoTipoTitle(option.carreira),
    carreira: option.carreira,
    options: option.options.map((subOption) => {
      const customItem = renderItemHistoricoTipoLabel(
        option.id, // xcategoria_id (correto)
        option.label, // xcategoria (correto)
        subOption.id, // xid (correto)
        subOption.id, // xkey (correto)
        subOption.label, // xlabel (correto)
        subOption.sinal, // xsinal (correto)
        subOption.carreira // xcarreira (correto)
      );

      return {
        id: customItem.id,
        key: customItem.id,
        label: customItem.label,
        value: customItem.label,
        sinal: customItem.sinal,
        carreira: customItem.carreira,
        label_definitivo: subOption.label,
        carreira_definitivo: subOption.carreira, //tem que usar outra variável quando o label é customizado se não há modificação dos dados dos demais atributos
      };
    }),
  }));

  const ClearHistoricoTipo = (data: any) => {
    form_historico.setFieldValue("historico_tipo_id", "");
    form_historico.setFieldValue("historico_tipo_sinal", "");
    form_historico.setFieldValue("carreira", "");
    form_historico.setFieldValue("historico_tipo", "");
    ListarHistoricoTipos();
  };

  /**************************************************************************
   * **********************************FUNÇÕES SELETORES FIM*******************
   * ************************************************************************/

  /**************************************************************************
   * **********************************OUTRAS FUNÇÕES***********************
   * ************************************************************************/

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

  const NovaAposentadoria = async (fieldsValue: any) => {
    const shouldNovo = window.confirm(
      "Limpar formulário para cadastrar nova Solicitação?"
    );

    if (shouldNovo) {
      setdataRegrasAposentadoria([]);
      form_aposentadoria.resetFields();
      //onConsultaObraAndamento();
    }
  };

  const NovoHistorico = async (fieldsValue: any) => {
    const shouldNovo = window.confirm(
      "Limpar formulário para cadastrar novo Histórico?"
    );

    if (shouldNovo) {
      form_historico.resetFields();
      //onConsultaObraAndamento();
    }
  };

  /**************************************************************************
   * **********************************OUTRAS FUNÇÕES fim*******************
   * ************************************************************************/

  /**************************************************************************
   * **********************************FUNÇÕES MODAL***************************
   * ************************************************************************/
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ModalTitle, setModalTitle] = useState("");

  const handleOperationClickNovo = () => {
    if (form_aposentadoria.getFieldValue("aposentadoria_id") != "") {
      setModalTitle(
        "Lançamento do Histórico para Aposentadoria de " +
          form_aposentadoria.getFieldValue("servidor")
      );
      setIsModalVisible(true);
      onConsultaHistorico();
    } else {
      notification.info({ message: "Escolha um Servidor!" });
    }
  };

  const handleModalOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsModalVisible(false);
    }, 3000);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    GetServidorAposentadoriaCalculo(
      form_aposentadoria.getFieldValue("cpf"),
      form_aposentadoria.getFieldValue("regra")
    );
  };

  const [messageApi, contextHolder] = message.useMessage();

  function msg_test(xmsg: string) {
    messageApi.open({
      type: "warning",
      content: xmsg,
    });
  }

  const rangeConfig = {
    rules: [{ type: "array" as const }],
  };

  /*MODAL CADASTRO*/
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };

  /*TABELA*/
  const columnsRegrasAposentadoria: ColumnsType<DataTypeRegasAposentadoria> = [
    {
      title: "Avaliação",
      width: "24%",
      dataIndex: "coluna_a1",
      key: "coluna_a1",
      fixed: "left",
      render: (text, record) => (
        <div>
          <div
            title={record.hint_a1}
            style={{ color: "black", fontWeight: "bold" }}
          >
            {text}
          </div>
          <div title={record.hint_a2}>
            <span style={{ color: "black", fontWeight: "bold" }}>
              {record.coluna_a2}
            </span>
          </div>
          <div title={record.hint_a3}>
            <span style={{ color: "black", fontWeight: "bold" }}>
              {record.coluna_a3}
            </span>
          </div>
        </div>
      ),
    },

    {
      title:
        form_aposentadoria.getFieldValue("regra") === "1035" ||
        form_aposentadoria.getFieldValue("regra") === "ANALISE"
          ? "EC Nº 103, Art. 5º, CAPUT"
          : "",
      width: "24%",
      dataIndex: "coluna_b1",
      key: "coluna_b1",
      render: (text, record) =>
        form_aposentadoria.getFieldValue("regra") === "1035" ||
        form_aposentadoria.getFieldValue("regra") === "ANALISE" ? (
          <div
            style={{
              border:
                record.coluna_a3 === "CONCLUSÃO" && record.icon_regra1 === "S"
                  ? "3px outset #3fd880"
                  : record.coluna_a3 === "CONCLUSÃO" &&
                    record.icon_regra1 === "N"
                  ? "3px inset #d8803f"
                  : "none",
            }}
          >
            <div style={{ color: "black", fontWeight: "normal" }}>
              {record.b1_persona === "TEMPO_AVERBAR" && (
                <PlusCircleOutlined
                  style={{ color: "darkgreen", marginLeft: 10 }}
                />
              )}
              <span
                title={record.hint_b1}
                style={{
                  color:
                    record.b1_persona === "TEMPO_AVERBAR"
                      ? "darkgreen"
                      : "black",
                }}
              >
                {record.coluna_b1}
              </span>
              {record.icon_regra1 === "S" && (
                <LikeOutlined
                  title={record.icon_regra1_hint}
                  style={{ color: "green", marginLeft: 10 }}
                />
              )}
              {record.icon_regra1 === "N" && (
                <DislikeOutlined
                  title={record.icon_regra1_hint}
                  style={{ color: "red", marginLeft: 10 }}
                />
              )}
            </div>

            <div title={record.hint_b2}>
              <span
                style={{
                  fontWeight:
                    record.coluna_a2 === "Análise" ||
                    record.b2_persona === "TEMPO_PCGO"
                      ? "bold"
                      : "regular",
                  color:
                    record.b2_persona === "TEMPO_DEDUZIR"
                      ? "darkorange"
                      : "black",
                }}
              >
                {record.b2_persona === "TEMPO_DEDUZIR" && (
                  <MinusCircleOutlined
                    style={{ color: "darkorange", marginLeft: 10 }}
                  />
                )}
                {record.b2_persona === "TEMPO_PCGO" && (
                  <AlertOutlined
                    style={{ color: "darkblue", marginLeft: 10 }}
                  />
                )}
                {record.coluna_b2}
              </span>
            </div>

            <div title={record.hint_b3}>
              <span
                style={{
                  color: "black",
                  fontWeight:
                    record.b3_persona === "TEMPO_GERAL" ? "bold" : "normal",
                }}
              >
                {record.coluna_b3}
              </span>
            </div>
          </div>
        ) : null,
    },

    {
      title:
        form_aposentadoria.getFieldValue("regra") === "10353" ||
        form_aposentadoria.getFieldValue("regra") === "ANALISE"
          ? "EC Nº 103, Art. 5º, §3º"
          : "",
      width: "24%",
      dataIndex: "coluna_c1",
      key: "coluna_c1",
      sorter: true,
      render: (text, record) =>
        form_aposentadoria.getFieldValue("regra") === "10353" ||
        form_aposentadoria.getFieldValue("regra") === "ANALISE" ? (
          <div
            style={{
              border:
                record.coluna_a3 === "CONCLUSÃO" && record.icon_regra2 === "S"
                  ? "3px outset #3fd880"
                  : record.coluna_a3 === "CONCLUSÃO" &&
                    record.icon_regra2 === "N"
                  ? "3px inset #d8803f"
                  : "none",
            }}
          >
            <div style={{ color: "black", fontWeight: "normal" }}>
              {record.c1_persona === "TEMPO_AVERBAR" && (
                <PlusCircleOutlined
                  style={{ color: "darkgreen", marginLeft: 10 }}
                />
              )}
              <span
                title={record.hint_c1}
                style={{
                  color:
                    record.c1_persona === "TEMPO_AVERBAR"
                      ? "darkgreen"
                      : "black",
                }}
              >
                {record.coluna_c1}
              </span>
              {record.icon_regra2 === "S" && (
                <LikeOutlined
                  title={record.icon_regra2_hint}
                  style={{ color: "green", marginLeft: 10 }}
                />
              )}
              {record.icon_regra2 === "N" && (
                <DislikeOutlined
                  title={record.icon_regra2_hint}
                  style={{ color: "red", marginLeft: 10 }}
                />
              )}
            </div>

            <div title={record.hint_c2}>
              <span
                style={{
                  fontWeight:
                    record.coluna_a2 === "Análise" ||
                    record.c2_persona === "TEMPO_PCGO"
                      ? "bold"
                      : "regular",
                  color:
                    record.c2_persona === "TEMPO_DEDUZIR"
                      ? "darkorange"
                      : "black",
                }}
              >
                {record.c2_persona === "TEMPO_DEDUZIR" && (
                  <MinusCircleOutlined
                    style={{ color: "darkorange", marginLeft: 10 }}
                  />
                )}
                {record.c2_persona === "TEMPO_PCGO" && (
                  <AlertOutlined
                    style={{ color: "darkblue", marginLeft: 10 }}
                  />
                )}
                {record.coluna_c2}
              </span>
            </div>

            <div title={record.hint_c3}>
              <span
                style={{
                  color: "black",
                  fontWeight:
                    record.c3_persona === "TEMPO_GERAL" ? "bold" : "normal",
                }}
              >
                {record.coluna_c3}
              </span>
            </div>
          </div>
        ) : null,
    },

    {
      title:
        form_aposentadoria.getFieldValue("regra") === "59" ||
        form_aposentadoria.getFieldValue("regra") === "ANALISE"
          ? "LC Nº 59/2006"
          : "",
      width: "24%",
      dataIndex: "coluna_d1",
      key: "coluna_d1",
      fixed: "left",
      sorter: true,
      render: (text, record) =>
        form_aposentadoria.getFieldValue("regra") === "59" ||
        form_aposentadoria.getFieldValue("regra") === "ANALISE" ? (
          <div
            style={{
              border:
                record.coluna_a3 === "CONCLUSÃO" && record.icon_regra3 === "S"
                  ? "3px outset #3fd880"
                  : record.coluna_a3 === "CONCLUSÃO" &&
                    record.icon_regra3 === "N"
                  ? "3px inset #d8803f"
                  : "none",
            }}
          >
            <div style={{ color: "black", fontWeight: "normal" }}>
              {record.d1_persona === "TEMPO_AVERBAR" && (
                <PlusCircleOutlined
                  style={{ color: "darkgreen", marginLeft: 10 }}
                />
              )}
              <span
                title={record.hint_d1}
                style={{
                  color:
                    record.d1_persona === "TEMPO_AVERBAR"
                      ? "darkgreen"
                      : "black",
                }}
              >
                {text}
              </span>
              {record.icon_regra3 === "S" && (
                <LikeOutlined
                  title={record.icon_regra3_hint}
                  style={{ color: "green", marginLeft: 10 }}
                />
              )}
              {record.icon_regra3 === "N" && (
                <DislikeOutlined
                  title={record.icon_regra3_hint}
                  style={{ color: "red", marginLeft: 10 }}
                />
              )}
            </div>

            <div title={record.hint_d2}>
              <span
                style={{
                  fontWeight:
                    record.coluna_a2 === "Análise" ||
                    record.d2_persona === "TEMPO_PCGO"
                      ? "bold"
                      : "regular",
                  color:
                    record.d2_persona === "TEMPO_DEDUZIR"
                      ? "darkorange"
                      : "black",
                }}
              >
                {record.d2_persona === "TEMPO_DEDUZIR" && (
                  <MinusCircleOutlined
                    style={{ color: "darkorange", marginLeft: 10 }}
                  />
                )}
                {record.d2_persona === "TEMPO_PCGO" && (
                  <AlertOutlined
                    style={{ color: "darkblue", marginLeft: 10 }}
                  />
                )}
                {record.coluna_d2}
              </span>
            </div>

            <div title={record.hint_d3}>
              <span
                style={{
                  color: "black",
                  fontWeight:
                    record.d3_persona === "TEMPO_GERAL" ? "bold" : "normal",
                }}
              >
                {record.coluna_d3}
              </span>
            </div>
          </div>
        ) : null,
    },
  ];

  const onChangeHistorico = (pagination: any, filters: any, sorter: any) => {
    // Lógica para atualizar o dataSource com base no sorter
    // Certifique-se de configurar a lógica de ordenação para cada coluna

    // Verifique se existe um campo sorter
    if (sorter && sorter.columnKey) {
      // Aqui você pode implementar a lógica de ordenação para cada coluna
      const { columnKey, order } = sorter;

      // Exemplo de lógica de ordenação (você precisa ajustar isso conforme sua lógica real)
      const sortedData = servidorHistoricoConsulta.sort((a, b) => {
        const valueA = a[columnKey];
        const valueB = b[columnKey];

        if (order === "ascend") {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });

      // Atualize o dataSource com os dados ordenados
      setServidorHistoricoConsulta([...sortedData]);
    }
  };

  /*TABELA HISTÓRICO*/
  const columnsServidorHistoricoConsulta: ColumnsType<DataTypeHistorico> = [
    {
      title: "HISTÓRICO",
      width: 130,
      dataIndex: "carreira_desc",
      key: "carreira_desc",
      fixed: "left",
      render: (text, record) => (
        <div>
          <div>
            <span
              style={{
                fontWeight: "bold",
                color:
                  record.carreira === "PCGO"
                    ? "blue"
                    : record.carreira === "CLT"
                    ? "brown"
                    : record.carreira === "PUB"
                    ? "darkorange"
                    : "purple",
              }}
            >
              {text}
              {record.carreira === "PCGO" && (
                <AlertOutlined style={{ color: "blue", marginLeft: 10 }} />
              )}
              {record.carreira === "CLT" && (
                <ShoppingOutlined style={{ color: "brown", marginLeft: 10 }} />
              )}
              {record.carreira === "PUB" && (
                <TeamOutlined style={{ color: "orange", marginLeft: 10 }} />
              )}
              {record.carreira === "POL" && (
                <StarOutlined style={{ color: "purple", marginLeft: 10 }} />
              )}
            </span>
          </div>
          <div>
            <span
              style={{
                fontWeight: "bold",
                color: record.sinal === 1 ? "green" : "red",
              }}
            >
              {record.historico_tipo}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "PERÍODO",
      width: 130,
      dataIndex: "dias",
      key: "dias",
      fixed: "left",
      render: (text, record) => (
        <div>
          <div>
            <span style={{ fontWeight: "bold" }}>
              Total em Dias: {text}
              {record.sinal === 1 && (
                <PlusCircleOutlined
                  style={{ color: "green", marginLeft: 10 }}
                />
              )}
              {record.sinal === -1 && (
                <MinusCircleOutlined style={{ color: "red", marginLeft: 10 }} />
              )}
            </span>
          </div>
          <div>
            <span>{record.dta_label_br}</span>
          </div>
        </div>
      ),
    },
    {
      title: "OBSERVAÇÕES",
      width: 130,
      dataIndex: "obs_historico",
      key: "obs_historico",
      fixed: "left",
      render: (text, record) => (
        <div>
          <div>
            <a
              style={{ fontWeight: "bold", color: "blue" }}
              onClick={() => EditarHistoricoClick(record)}
            >
              <Button type='primary' style={{ backgroundColor: "darkgreen" }}>
                Editar Histórico
              </Button>
            </a>
          </div>
          <div>
            <span>&nbsp;</span>
          </div>
          <div>
            <a
              style={{ fontWeight: "bold", color: "blue" }}
              onClick={() => ExcluirHistoricoClick(record)}
            >
              <Button type='primary' style={{ backgroundColor: "darkred" }}>
                Excluir Histórico
              </Button>
            </a>
          </div>
        </div>
      ),
    },
    {
      title: "OBSERVAÇÕES",
      width: 130,
      dataIndex: "obs_historico",
      key: "obs_historico",
      fixed: "left",
      render: (text, record) => (
        <div>
          <div>{text}</div>
        </div>
      ),
    },
  ];
  /*TABELA FIM*/

  const ExcluirHistoricoClick = (record: DataTypeHistorico) => {
    ExcluirHistorico(record.servidor_historico_id);
  };

  const EditarHistoricoClick = (record: DataTypeHistorico) => {
    form_historico.setFieldValue(
      "servidor_historico_id",
      record.servidor_historico_id
    );
    form_historico.setFieldValue("carreira", record.carreira);
    form_historico.setFieldValue("historico_tipo_id", record.historico_tipo_id);
    form_historico.setFieldValue("historico_tipo_sinal", record.sinal);
    form_historico.setFieldValue("historico_tipo", record.historico_tipo);
    form_historico.setFieldValue("dias", record.dias);
    form_historico.setFieldValue("obs_historico", record.obs_historico);

    if (record.dtai_br != "") {
      form_historico.setFieldValue("dtai", dayjs(record.dtai_br, "DD/MM/YYYY"));
    } else {
      form_historico.setFieldValue("dtai", "");
    }

    if (record.dtaf_br != "") {
      form_historico.setFieldValue("dtaf", dayjs(record.dtaf_br, "DD/MM/YYYY"));
    } else {
      form_historico.setFieldValue("dtaf", "");
    }
  };

  /**************************************************************************
   * **********************************MODAL CONSULTA ANEXOS*****************
   * ************************************************************************/
  const [ModalAnexosConsulta, setModalAnexosConsulta] = useState(false);
  const ModalAnexosConsultarShow = () => {
    setModalAnexosConsulta(true);
    //onConsultaObra();
  };
  const ModalAnexosConsultarHide = () => {
    setModalAnexosConsulta(false);
  };

  ////////////////////////////////////////////////////////////////////////////////ANXEOS CONSULTA
  const onChangeAnexos = (pagination: any, filters: any, sorter: any) => {
    // Lógica para atualizar o dataSource com base no sorter
    // Certifique-se de configurar a lógica de ordenação para cada coluna

    // Verifique se existe um campo sorter
    if (sorter && sorter.columnKey) {
      // Aqui você pode implementar a lógica de ordenação para cada coluna
      const { columnKey, order } = sorter;

      // Exemplo de lógica de ordenação (você precisa ajustar isso conforme sua lógica real)
      const sortedData = anexosConsulta.sort((a, b) => {
        const valueA = a[columnKey];
        const valueB = b[columnKey];

        if (order === "ascend") {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });

      // Atualize o dataSource com os dados ordenados
      setAnexosConsulta([...sortedData]);
    }
  };

  const columnsAnexos: ColumnsType<DataTypeAnexoConsulta> = [
    {
      title: "SERVIDOR",
      width: 100,
      dataIndex: "nome",
      key: "nome",
      fixed: "left",
      sorter: true,
      render: (text, record) => (
        <div
          title={
            "Iniciado em: " +
            record.dta_cad_br +
            " Por: " +
            record.user_cad +
            "\n Última alteração em:" +
            record.dta_up_br
          }
        >
          <div
            style={{
              fontWeight: "bold",
              color: record.genero === "MASCULINO" ? "darkblue" : "darkred",
            }}
          >
            {text}
          </div>
          <div>
            <span style={{ fontWeight: "normal" }}>{record.cargo}</span>
          </div>
          <div>
            <span style={{ fontWeight: "normal", color: "darkgray" }}>
              {record.dp_lotacao}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "HISTORICO",
      width: 40,
      dataIndex: "sei",
      key: "sei",
      fixed: "left",
      sorter: true,
      render: (text, record) => (
        <div
          title={
            "Iniciado em: " +
            record.dta_cad_br +
            " Por: " +
            record.user_cad +
            "\n Última alteração em:" +
            record.dta_up_br
          }
        >
          <div>
            <span style={{ fontWeight: "normal", color: "black" }}>
              {record.historico_id}
            </span>
          </div>
          <div>
            <span style={{ fontWeight: "normal", color: "darkgray" }}>
              Anexo: {record.numero}
            </span>
          </div>
          <div>
            <span style={{ fontWeight: "normal" }}>SEI: {record.sei}</span>
          </div>
        </div>
      ),
    },
    {
      title: "REGRA",
      width: 50,
      dataIndex: "regra",
      key: "regra",
      fixed: "left",
      sorter: true,
      render: (text, record) => (
        <div
          title={
            "Iniciado em: " +
            record.dta_cad_br +
            " Por: " +
            record.user_cad +
            "\n Última alteração em:" +
            record.dta_up_br
          }
        >
          <div>
            <span
              style={{
                fontWeight: "bold",
                color: record.regra === "ANALISE" ? "darkorange" : "darkgreen",
              }}
            >
              {record.regra != "ANALISE" && (
                <CarryOutOutlined style={{ color: "green" }} />
              )}
              {record.regra === "ANALISE" && (
                <ExclamationCircleOutlined style={{ color: "orange" }} />
              )}
              {record.regra_desc}
            </span>
          </div>
          <div>
            <Tooltip title={"Idade no dia da requisição"} placement='top'>
              <span style={{ fontWeight: "normal", color: "darkgray" }}>
                Idade: {record.idade_requisicao} Anos
              </span>
            </Tooltip>
          </div>
          <div>
            <br></br>
          </div>
        </div>
      ),
    },
    {
      title: "",
      key: "regra",
      fixed: "right",
      width: 35,
      render: (text, record) => (
        <div>
          <div>
            <a
              style={{ fontWeight: "bold", color: "blue" }}
              onClick={() => EditarAnexoClick(record)}
            >
              <Button type='primary' icon={<FolderOpenOutlined />}>
                Abrir Anexo
              </Button>
            </a>
          </div>
          <div>
            <br></br>
          </div>
          <div>
            {record.regra != "ANALISE" && (
              <a
                style={{ fontWeight: "bold", color: "blue" }}
                onClick={() => ImprimirAnexoClick(record)}
              >
                <Button
                  type='primary'
                  style={{ backgroundColor: "darkgreen" }}
                  icon={<PrinterOutlined />}
                >
                  Imprimir
                </Button>
              </a>
            )}
            {record.regra === "ANALISE" && <br></br>}
          </div>
        </div>
      ),
    },
    {
      title: "IDADE MÍNIMA",
      width: 35,
      dataIndex: "sei",
      key: "sei",
      fixed: "left",
      sorter: true,
      render: (text, record) => (
        <div
          title={
            "Iniciado em: " +
            record.dta_cad_br +
            " Por: " +
            record.user_cad +
            "\n Última alteração em:" +
            record.dta_up_br
          }
        >
          <div>
            {record.regra === "ANALISE" || record.regra === "1035" ? (
              <Tooltip
                title={"EC Nº 103, Art. 5º, CAPUT - Idade Mínima"}
                placement='top'
              >
                <span style={{ fontWeight: "normal", color: "black" }}>
                  55 Anos
                  {record.idade_minima_1035_analise === "OK" && (
                    <CarryOutOutlined style={{ color: "green" }} />
                  )}
                  {record.idade_minima_1035_analise === "X" && (
                    <ExclamationCircleOutlined style={{ color: "red" }} />
                  )}
                </span>
              </Tooltip>
            ) : (
              <br />
            )}
          </div>
          <div>
            {record.regra === "ANALISE" || record.regra === "10353" ? (
              <Tooltip
                title={"EC Nº 103, Art. 5º, §3º - Idade Mínima"}
                placement='top'
              >
                <span style={{ fontWeight: "normal", color: "black" }}>
                  {record.idade_minima_10353}
                  {record.idade_minima_10353_analise === "OK" && (
                    <CarryOutOutlined style={{ color: "green" }} />
                  )}
                  {record.idade_minima_10353_analise === "X" && (
                    <ExclamationCircleOutlined style={{ color: "red" }} />
                  )}
                </span>
              </Tooltip>
            ) : (
              <br />
            )}
          </div>
          <div>
            {record.regra === "ANALISE" || record.regra === "59" ? (
              <Tooltip title={"3)	LC Nº 59/2006 - Idade Mínima"} placement='top'>
                <span style={{ fontWeight: "normal" }}>Não exige</span>
              </Tooltip>
            ) : (
              <br />
            )}
          </div>
        </div>
      ),
    },
    {
      title: "ATIVIDADE RISCO",
      width: 35,
      dataIndex: "sei",
      key: "sei",
      fixed: "left",
      sorter: true,
      render: (text, record) => (
        <div
          title={
            "Iniciado em: " +
            record.dta_cad_br +
            " Por: " +
            record.user_cad +
            "\n Última alteração em:" +
            record.dta_up_br
          }
        >
          <div>
            {record.genero === "FEMININO" ? (
              <Tooltip
                title={
                  "No Mínimo 15 Anos de Atividade de Risco, Vale Para Todas as Regras"
                }
                placement='top'
              >
                <span style={{ fontWeight: "normal", color: "black" }}>
                  15 Anos
                  <WomanOutlined style={{ color: "darkpink" }} />
                </span>
              </Tooltip>
            ) : (
              <Tooltip
                title={
                  "No Mínimo 20 Anos de Atividade de Risco, Vale Para Todas as Regras"
                }
                placement='top'
              >
                <span style={{ fontWeight: "normal", color: "black" }}>
                  20 Anos
                  <ManOutlined style={{ color: "darkblue" }} />
                </span>
              </Tooltip>
            )}
          </div>
          <div>
            <Tooltip
              title={
                "Tempo Total em Atividade de Risco na PCGO e Outras Averbações de Forças Policiais"
              }
              placement='top'
            >
              <span style={{ fontWeight: "normal", color: "black" }}>
                {record.risco_total} Anos
                {record.risco_total_analise === "OK" && (
                  <CarryOutOutlined style={{ color: "green" }} />
                )}
                {record.risco_total_analise === "X" && (
                  <ExclamationCircleOutlined style={{ color: "red" }} />
                )}
              </span>
            </Tooltip>
          </div>
          <div>
            <br />
          </div>
        </div>
      ),
    },
  ];

  const EditarAnexoClick = (record: DataTypeAnexoConsulta) => {};

  const ImprimirAnexoClick = (record: DataTypeAnexoConsulta) => {};

  /**************************************************************************
   * **********************************MODAL CONSULTA ANEXOS FIM*************
   * ************************************************************************/

  return (
    <>
      {" "}
      <Form
        form={form_aposentadoria}
        onFinish={FormAposentadoriaCadSubmit}
        layout='vertical'
        initialValues={{
          numero: "",
          aposentadoria_id: "",
          servidor_id: "",
          servidor: "",
          telefone: "",
          email: "",
          sei: "",
          historico_id: "",
          regra: "ANALISE",
          genero: "",
          dta_nascimento: "",
          idade: "",
          cpf: "",
          dta_inicio: "",
          cargo: "",
          lotacao_id: "",
          lotacao: "",
          lotacao_dta: "",
          dta_requisicao: dayjs(data.format("DD/MM/YYYY"), "DD/MM/YYYY"),
        }}
      >
        {contextHolder}

        <Spin spinning={openLoadCadastro} tip={messageLoadCadastro}>
          <Row style={{ width: "100%" }}>
            <Col span={2} style={{ paddingRight: 5 }}>
              <Tooltip
                trigger={["focus"]}
                title='ANEXO 1 DO HISTÓRICO FUNCIONAL N°'
                placement='top'
              >
                <Form.Item name='numero' label='Número:'>
                  <Input
                    className='bold-text-input'
                    readOnly
                    style={{ border: "none", background: "none" }}
                  />
                </Form.Item>
              </Tooltip>
            </Col>

            <Form.Item hidden name='aposentadoria_id'>
              <Input />
            </Form.Item>
            {/*id do calculo de aposentadoria na tabela servidors*/}
            <Form.Item hidden name='servidor_id'>
              <Input />
            </Form.Item>
            {/*id do servidor no sicad*/}
            <Form.Item hidden name='lotacao_id'>
              <Input />
            </Form.Item>

            <Col span={5} style={{ paddingRight: 5 }}>
              <Space.Compact>
                <Form.Item name='servidor' label='Servidor Atribuído:'>
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
                    onDropdownVisibleChange={(visible) =>
                      setShowOptionsServidor(visible)
                    } // Controla a visibilidade da lista
                    open={showOptionsServidor} // Controla a visibilidade da lista
                    placeholder='Digite o nome de um Servidor'
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

                <Button
                  type='primary'
                  onClick={listaServidoresClick}
                  style={{ marginTop: 30 }}
                  icon={<SearchOutlined />}
                ></Button>
              </Space.Compact>
            </Col>

            <Col span={3} style={{ paddingRight: 5 }}>
              <Tooltip
                trigger={["focus"]}
                title='Contato do Servidor. Clique no botão para tentar contato via Whatsapp'
                placement='top'
              >
                <Space.Compact>
                  <Form.Item name='telefone' label='Telefone:'>
                    <Input
                      onInput={(e) =>
                        ((e.target as HTMLInputElement).value = (
                          e.target as HTMLInputElement
                        ).value.toUpperCase())
                      }
                      maxLength={11}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace") {
                          return;
                        }

                        const isNumber = e.key >= "0" && e.key <= "9";
                        if (
                          e.key === "Tab" ||
                          e.key === "Backspace" ||
                          e.key === "ArrowLeft" ||
                          e.key === "ArrowUp" ||
                          e.key === "ArrowRight" ||
                          e.key === "ArrowDown"
                        ) {
                          return;
                        }
                        if (!isNumber) {
                          e.preventDefault();
                        }
                      }}
                      className='bold-text-input'
                    />
                  </Form.Item>

                  <Button
                    type='primary'
                    onClick={telefoneWhatsappClick}
                    style={{ marginTop: 30, backgroundColor: "green" }}
                    icon={<WhatsAppOutlined />}
                  ></Button>
                </Space.Compact>
              </Tooltip>
            </Col>

            <Col span={3} style={{ paddingRight: 5 }}>
              <Tooltip
                trigger={["focus"]}
                title='Email do Servidor.'
                placement='top'
              >
                <Form.Item name='email' label='Email:'>
                  <Input
                    onInput={(e) =>
                      ((e.target as HTMLInputElement).value = (
                        e.target as HTMLInputElement
                      ).value.toLowerCase())
                    }
                    style={{ textTransform: "lowercase" }}
                  />
                </Form.Item>
              </Tooltip>
            </Col>

            <Col span={2} style={{ paddingRight: 5 }}>
              <Tooltip
                trigger={["focus"]}
                title='Data de Requisição'
                placement='top'
              >
                <Form.Item
                  name='dta_requisicao'
                  label='Requisição:'
                  rules={[
                    {
                      required: true,
                      message: "Escolha a data de Requisição!",
                    },
                  ]}
                >
                  <DatePicker format={"DD/MM/YYYY"} locale={locale} />
                </Form.Item>
              </Tooltip>
            </Col>

            <Col span={5} style={{ paddingRight: 5 }}>
              <Tooltip
                trigger={["focus"]}
                title='Regra escolhida após a análise'
                placement='top'
              >
                <Form.Item name='regra' label='Regra Escolhida:'>
                  <Select
                    defaultValue='ANALISE'
                    style={{ width: 200 }}
                    options={[
                      { value: "1035", label: "EC Nº 103, Art. 5º, CAPUT" },
                      { value: "10353", label: "EC Nº 103, Art. 5º, §3º" },
                      { value: "59", label: "LC Nº 59/2006" },
                      { value: "ANALISE", label: "Em Análise" },
                    ]}
                  />
                </Form.Item>
              </Tooltip>
            </Col>
          </Row>

          <Row style={{ width: "100%" }}>
            <Col span={3} style={{ paddingRight: 5 }}>
              <Tooltip
                trigger={["focus"]}
                title='Gênero conforme nascimento/decisão judicial'
                placement='top'
              >
                <Form.Item name='genero' label='Gênero:'>
                  <Input
                    className='bold-text-input'
                    readOnly
                    style={{ border: "none", background: "none" }}
                  />
                </Form.Item>
              </Tooltip>
            </Col>

            <Col span={3} style={{ paddingRight: 5 }}>
              <Tooltip
                trigger={["focus"]}
                title='Data de nascimento'
                placement='top'
              >
                <Form.Item name='dta_nascimento' label='Nascimento:'>
                  <Input
                    className='bold-text-input'
                    readOnly
                    style={{ border: "none", background: "none" }}
                  />
                </Form.Item>
              </Tooltip>
            </Col>

            <Col span={4} style={{ paddingRight: 5 }}>
              <Tooltip trigger={["focus"]} title='Idade' placement='top'>
                <Form.Item name='idade' label='idade:'>
                  <Input
                    className='bold-text-input'
                    readOnly
                    style={{ border: "none", background: "none" }}
                  />
                </Form.Item>
              </Tooltip>
            </Col>

            <Col span={3} style={{ paddingRight: 5 }}>
              <Tooltip trigger={["focus"]} title='CPF' placement='top'>
                <Form.Item name='cpf' label='CPF:'>
                  <Input
                    className='bold-text-input'
                    readOnly
                    style={{ border: "none", background: "none" }}
                  />
                </Form.Item>
              </Tooltip>
            </Col>

            <Col span={3} style={{ paddingRight: 5 }}>
              <Tooltip
                trigger={["focus"]}
                title='Número do SEI do processo'
                placement='top'
              >
                <Space.Compact>
                  <Form.Item
                    name='sei'
                    label='SEI:'
                    rules={[
                      {
                        required: true,
                        message: "Informe o Número do SEI!",
                      },
                    ]}
                  >
                    <Input
                      onInput={(e) =>
                        ((e.target as HTMLInputElement).value = (
                          e.target as HTMLInputElement
                        ).value.toUpperCase())
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Backspace") {
                          return;
                        }

                        const isNumber = e.key >= "0" && e.key <= "9";
                        if (
                          e.key === "Tab" ||
                          e.key === "Backspace" ||
                          e.key === "ArrowLeft" ||
                          e.key === "ArrowUp" ||
                          e.key === "ArrowRight" ||
                          e.key === "ArrowDown"
                        ) {
                          return;
                        }
                        if (!isNumber) {
                          e.preventDefault();
                        }
                      }}
                      className='bold-text-input'
                    />
                  </Form.Item>
                </Space.Compact>
              </Tooltip>
            </Col>

            <Col span={3} style={{ paddingRight: 5 }}>
              <Tooltip
                trigger={["focus"]}
                title='Número do Histórico Funcional'
                placement='top'
              >
                <Space.Compact>
                  <Form.Item
                    name='historico_id'
                    label='Histórico N.:'
                    rules={[
                      {
                        required: true,
                        message: "Informe o Número do Histórico Funcional!",
                      },
                    ]}
                  >
                    <Input
                      onInput={(e) =>
                        ((e.target as HTMLInputElement).value = (
                          e.target as HTMLInputElement
                        ).value.toUpperCase())
                      }
                      className='bold-text-input'
                    />
                  </Form.Item>
                </Space.Compact>
              </Tooltip>
            </Col>
          </Row>

          <Row style={{ width: "100%" }}>
            <Col span={2} style={{ paddingRight: 5 }}>
              <Tooltip
                trigger={["focus"]}
                title='Data de Exercício ou Posse'
                placement='top'
              >
                <Form.Item name='dta_inicio' label='Início no cargo:'>
                  <Input
                    className='bold-text-input'
                    readOnly
                    style={{ border: "none", background: "none" }}
                  />
                </Form.Item>
              </Tooltip>
            </Col>

            <Col span={4} style={{ paddingRight: 5 }}>
              <Tooltip
                trigger={["focus"]}
                title='Cargo do Servidor'
                placement='top'
              >
                <Form.Item name='cargo' label='Cargo:'>
                  <Input
                    className='bold-text-input'
                    readOnly
                    style={{ border: "none", background: "none" }}
                  />
                </Form.Item>
              </Tooltip>
            </Col>

            <Col span={4} style={{ paddingRight: 5 }}>
              <Tooltip
                trigger={["focus"]}
                title='Lotação do Servidor'
                placement='top'
              >
                <Form.Item name='lotacao' label='Lotação:'>
                  <Input
                    className='bold-text-input'
                    readOnly
                    style={{ border: "none", background: "none" }}
                  />
                </Form.Item>
              </Tooltip>
            </Col>

            <Col span={2} style={{ paddingRight: 5 }}>
              <Tooltip
                trigger={["focus"]}
                title='Lotação desde'
                placement='top'
              >
                <Form.Item name='lotacao_dta' label='Desde:'>
                  <Input
                    className='bold-text-input'
                    readOnly
                    style={{ border: "none", background: "none" }}
                  />
                </Form.Item>
              </Tooltip>
            </Col>
          </Row>

          <Row style={{ width: "100%" }}>
            <Col span={4} style={{ paddingRight: 5 }}>
              <Form.Item>
                <Button
                  type='primary'
                  style={{ backgroundColor: "darkgray" }}
                  onClick={NovaAposentadoria}
                  icon={<PlusOutlined />}
                >
                  Limpar(Nova Requisição)
                </Button>
              </Form.Item>
            </Col>

            <Col span={3} style={{ paddingRight: 5 }}>
              <Form.Item>
                <Button
                  type='primary'
                  onClick={form_aposentadoria.submit}
                  icon={<SaveOutlined />}
                >
                  Salvar Servidor
                </Button>
              </Form.Item>
            </Col>

            <Col span={3} style={{ paddingRight: 5 }}>
              <Form.Item>
                <Button
                  type='primary'
                  style={{ backgroundColor: "darkgreen" }}
                  onClick={handleOperationClickNovo}
                  icon={<ClockCircleOutlined />}
                >
                  Incluir Histórico
                </Button>
              </Form.Item>
            </Col>

            <Col span={3} style={{ paddingRight: 5 }}>
              <Form.Item>
                <Button
                  type='primary'
                  style={{ backgroundColor: "darkgray" }}
                  onClick={ImprimirLaudo}
                  icon={<PrinterOutlined />}
                >
                  Imprimir
                </Button>
              </Form.Item>
            </Col>

            <Col span={3} style={{ paddingRight: 5 }}>
              <Form.Item>
                <Button
                  type='primary'
                  style={{ backgroundColor: "darkgray" }}
                  onClick={ModalAnexosConsultarShow}
                  icon={<SearchOutlined />}
                >
                  Consultar Anexos
                </Button>
              </Form.Item>
            </Col>
          </Row>

          <Row style={{ width: "100%" }}>
            <Divider plain style={{ fontWeight: "bold", color: "darkgray" }}>
              Avaliação das Regras
            </Divider>
          </Row>

          <Row style={{ width: "100%" }}>
            <Table
              columns={columnsRegrasAposentadoria}
              dataSource={dataRegrasAposentadoria}
              scroll={{ x: 1300 }}
              pagination={false}
            />
          </Row>
        </Spin>
      </Form>
      <Modal
        width='90%'
        title={ModalTitle}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        footer={[]}
      >
        <Form
          form={form_historico}
          onFinish={FormHistoricoCadSubmit}
          layout='vertical'
          initialValues={{
            servidor_historico_id: "",
            carreira: "",
            historico_tipo_id: "",
            historico_tipo_sinal: "",
            historico_tipo: "",
            dtai: "",
            dtaf: "",
            dias: "",
            obs_historico: "",
          }}
        >
          <Row style={{ width: "100%" }}>
            <Form.Item hidden name='servidor_historico_id'>
              <Input />
            </Form.Item>

            <Form.Item hidden name='carreira'>
              <Input />
            </Form.Item>

            <Form.Item hidden name='historico_tipo_id'>
              <Input />
            </Form.Item>

            <Form.Item hidden name='historico_tipo_sinal'>
              <Input />
            </Form.Item>

            <Col span={6.2} style={{ paddingRight: 5 }}>
              <Tooltip
                trigger={["focus"]}
                title='Informe o Histórico para inclusão na ficha'
                placement='top'
              >
                <Space.Compact>
                  <Form.Item name='historico_tipo' label='Histórico:'>
                    <AutoComplete
                      ref={autoHistoricotipos}
                      key={HistoricoTipos.length} // Chave única com base no tamanho do array
                      style={{ width: 230 }}
                      dropdownMatchSelectWidth={false} // Desative o ajuste automático
                      dropdownStyle={{ width: 800 }}
                      onSelect={(value, option) => {
                        onSelectHistoricoTipo(option);
                        setShowOptionsHistoricoTipo(false); // Fecha a lista após a seleção
                      }}
                      onKeyDown={handleEnterPressHistoricoTipo} // Adicione este evento para verificar a tecla Enter
                      onDropdownVisibleChange={(visible) =>
                        setShowOptionsHistoricoTipo(visible)
                      } // Controla a visibilidade da lista
                      open={showOptionsHistoricoTipos} // Controla a visibilidade da lista
                      placeholder='Tipo de Histórico'
                      options={optionsHistoricoTipo}
                    >
                      <Input
                        style={{ fontSize: 11, height: 32 }}
                        onInput={(e) =>
                          ((e.target as HTMLInputElement).value = (
                            e.target as HTMLInputElement
                          ).value.toUpperCase())
                        }
                      />
                    </AutoComplete>
                  </Form.Item>

                  <Button
                    type='primary'
                    onClick={ListarHistoricoTipos}
                    style={{ marginTop: 30 }}
                    icon={<SearchOutlined />}
                  ></Button>
                  <Button
                    type='primary'
                    title='Remover Histórico'
                    onClick={ClearHistoricoTipo}
                    style={{ marginTop: 30 }}
                    icon={<ClearOutlined />}
                  ></Button>
                </Space.Compact>
              </Tooltip>
            </Col>

            <Col span={3} style={{ paddingRight: 5 }}>
              <Tooltip trigger={["focus"]} title='Data Início' placement='top'>
                <Form.Item name='dtai' label='Início:'>
                  <DatePicker format={dateFormatList} />
                </Form.Item>
              </Tooltip>
            </Col>

            <Col span={3} style={{ paddingRight: 5 }}>
              <Tooltip trigger={["focus"]} title='Data Término' placement='top'>
                <Form.Item name='dtaf' label='Término:'>
                  <DatePicker format={dateFormatList} />
                </Form.Item>
              </Tooltip>
            </Col>

            <Col span={2} style={{ paddingRight: 5 }}>
              <Tooltip
                trigger={["focus"]}
                title='Dias Computados'
                placement='top'
              >
                <Form.Item name='dias' label='Total em Dias:'>
                  <Input
                    className='bold-text-input'
                    placeholder='dias'
                    maxLength={6}
                    style={{ width: 100 }}
                    pattern='\d{6}'
                    onKeyDown={(e) => {
                      if (e.key === "Backspace") {
                        return;
                      }
                      const isNumber = e.key >= "0" && e.key <= "9";
                      if (
                        e.key === "Backspace" ||
                        e.key === "ArrowLeft" ||
                        e.key === "ArrowUp" ||
                        e.key === "ArrowRight" ||
                        e.key === "ArrowDown"
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
            {/*
        <Col span={2} style={{paddingRight: 5}}>
        <Tooltip trigger={['focus']} title="Calculo até 30/12/2019 para: Dias Trabalhados EC Nº 103, Art. 5º, §3º ou LC Nº 59/2006. Atividade de Risco LC Nº 59/2006." placement="top">
        <Form.Item name="dias_regra" label="Em 30/12/2019:">
        <Input
          className="bold-text-input"
          placeholder="calculo"
          maxLength={6}
          style={{ width: 100, border: 'none' }}
          pattern="\d{6}"
          onKeyDown={(e) => {
          if (e.key === 'Backspace') {
              return;
          }
          const isNumber = e.key >= '0' && e.key <= '9';
          if (e.key === 'Backspace' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowRight' || e.key === 'ArrowDown') {
              return;
          }
          if (!isNumber) {
              e.preventDefault();
          }
          }} readOnly
        />
        </Form.Item>
        </Tooltip>
        </Col>
        */}
          </Row>

          <Row style={{ width: "100%" }}>
            <Col span={24} style={{ paddingRight: 5 }}>
              <Tooltip trigger={["focus"]} title='Observações' placement='top'>
                <Form.Item name='obs_historico' label='Obs:'>
                  <Input
                    className='bold-text-input'
                    placeholder='Observações/Cargo Ocupado na época'
                    style={{ width: 800 }}
                  />
                </Form.Item>
              </Tooltip>
            </Col>
          </Row>

          <Row style={{ width: "100%" }}>
            <Col span={3} style={{ paddingRight: 5 }}>
              <Form.Item>
                <Button
                  type='primary'
                  style={{ backgroundColor: "darkgray" }}
                  onClick={NovoHistorico}
                >
                  Novo Lançamento
                </Button>
              </Form.Item>
            </Col>

            <Col span={3} style={{ paddingRight: 5 }}>
              <Form.Item>
                <Button type='primary' onClick={form_historico.submit}>
                  Salvar Histórico
                </Button>
              </Form.Item>
            </Col>
          </Row>

          <Row style={{ width: "100%" }}>
            <Table
              columns={columnsServidorHistoricoConsulta}
              dataSource={servidorHistoricoConsulta}
              scroll={{ x: 1300 }}
              pagination={false}
              onChange={onChangeHistorico}
            />
          </Row>
        </Form>
      </Modal>
      {/**************************************************************************
       * **********************************MODAL HISTORICOS FIM*******************
       * ************************************************************************/
      /**************************************************************************
       * **********************************MODAL CONSULTA ANEXOS*******************
       * ************************************************************************/}
      <Modal
        width='90%'
        title='Consulta de Anexos Cadastrados'
        open={ModalAnexosConsulta}
        onCancel={ModalAnexosConsultarHide}
        footer={[
          <Button key='back' onClick={ModalAnexosConsultarHide}>
            Voltar Para Cadastro
          </Button>,
          <Button
            key=''
            style={{ backgroundColor: "green" }}
            onClick={onConsultaAnexos}
          >
            Localizar Anexos
          </Button>,
        ]}
      >
        <Form
          form={form_anexos_cons}
          layout='vertical'
          initialValues={{
            zcons_data: [dayjs(), dayjs()],
            zcons_filtro: "",
            zcons_regra: "TODOS",
          }}
        >
          <Spin spinning={openLoadConsulta} tip={messageLoadConsulta}>
            <Row style={{ width: "100%" }}>
              <Col span={4} style={{ paddingRight: 5 }}>
                <Tooltip
                  trigger={["focus"]}
                  title='Consulta por Data de Solicitação'
                  placement='top'
                >
                  <Form.Item name='zcons_data' label='Data:'>
                    <RangePicker style={{ width: 240 }} format='DD/MM/YYYY' />
                  </Form.Item>
                </Tooltip>
              </Col>

              <Col span={3} style={{ paddingRight: 5 }}>
                <Tooltip
                  trigger={["focus"]}
                  title='Pesquise por servidor ou departamento'
                  placement='top'
                >
                  <Form.Item name='zcons_filtro' label='Filtro:'>
                    <Input placeholder='Filtre Aqui' style={{ width: 180 }} />
                  </Form.Item>
                </Tooltip>
              </Col>

              <Col span={5} style={{ paddingRight: 5 }}>
                <Tooltip
                  trigger={["focus"]}
                  title='Regra escolhida após a análise'
                  placement='top'
                >
                  <Form.Item name='zcons_regra' label='Regra Escolhida:'>
                    <Select
                      defaultValue='TODOS'
                      style={{ width: 200 }}
                      options={[
                        { value: "1035", label: "EC Nº 103, Art. 5º, CAPUT" },
                        { value: "10353", label: "EC Nº 103, Art. 5º, §3º" },
                        { value: "59", label: "LC Nº 59/2006" },
                        { value: "ANALISE", label: "Em Análise" },
                        { value: "TODOS", label: "Todas" },
                      ]}
                    />
                  </Form.Item>
                </Tooltip>
              </Col>
            </Row>

            <Row style={{ width: "100%" }}>
              <Table
                columns={columnsAnexos}
                dataSource={anexosConsulta}
                scroll={{ x: 1300 }}
                onChange={onChangeAnexos}
              />
            </Row>
          </Spin>
        </Form>
      </Modal>
      {/**************************************************************************
       * **********************************MODAL CONSULTA ANEXOS********************
       * ************************************************************************/}
    </>
  );
};

export default Aposentadoria;

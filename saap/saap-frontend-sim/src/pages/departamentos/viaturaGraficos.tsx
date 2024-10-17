import React, { useEffect, useState } from "react";

import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Tooltip,
  message,
  notification,
} from "antd";
import { Option } from "antd/es/mentions";
import locale from "antd/es/date-picker/locale/pt_BR";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { Divider } from "antd/lib";
import MyChartHeight from "../graficos/MyChartHeight";

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
          }: { seriesIndex: number; dataPointIndex: number }
        ) => string;
      };
    };
  };
  xaxis: {
    categories: string[];
  };
}

interface DataTypeViaturas {
  key: string;
  id: string;
  id_sisvtr: string;
  departamento_id: string;
  placa: string;
  placa_vinculada: string;
  categoria: string;
  ano_fabricacao: string;
  marca: string;
  modelo: string;
  cor: string;
  prefixo: string;
  chassis: string;
  renavam: string;
  motor: string;
  numero_sei: string;
  numero_nf: string;
  propriedade: string;
  responsavel_id: string;
  motorista_id: string;
  estado_conservacao: string;
  destinacao: string;
  data_aquisicao: string;
  data_aquisicao_br: string;
  onus: boolean;
  aplicacao: string;
  patrimonio: string;
  combustivel: string;
  combustivel_desc: string;
  recurso: string;
  origem: string;
  acessorios_step: string;
  acessorios_macaco: string;
  acessorios_chave_reserva: string;
  numero_cartao_abas: string;
  tombamento_spm: string;
  consumo: string;
  hodometro: string;
  acessorios_triangulo: string;
  acessorios_carpete: string;
  acessorios_chave_roda: string;
  acessorios_tampao: string;
  acessorios_antena: string;
  acessorios_crlv: string;
  acessorios_tapete: string;
  acessorios_comunicador: string;
  acessorios_calota: string;
  acessorios_giroflex: string;
  acessorios_sirene: string;
  acessorios_kojak: string;
  created_at: string;
  updated_at: string;
  status: string;
  obs: string;
  fun_cad_id: string;
  fun_cad: string;
  fun_up_id: string;
  fun_up: string;
  mapa_departamento: string;
  mapa_responsavel: string;
  mapa_motorista: string;
  mapa_conferencia: string;
  status_uso: string;
  contrato: string;
  locadora: string;
  leilao_lote: string;
  tag: string;
  leilao_nf: string;
  leilao_leiloeiro: string;
  titular_externo_id: string;
  titular_externo: string;
  created_at_br: string;
  updated_at_br: string;
  titular: string;
  titular_celular: string;
  titular_telefone: string;
  titular_email: string;
  titular_abreviado: string;
  motorista: string;
  motorista_celular: string;
  motorista_telefone: string;
  motorista_email: string;
  motorista_abreviado: string;
  departamento_nome: string;
  departamento_hierarquia: string;
  departamento_tipo: string;
  departamento_especializacao: string;
  departamento_portaria: string;
  departamento_sigla: string;
  departamento_municipio: string;
  departamento_municipioid: string;
  departamento_censo_vinte_tres: string;
  departamento_telefone: string;
  departamento_telefone2: string;
  departamento_telefone3: string;
  departamento_escala: string;
  departamento_status: string;
  departamento_grupo_id: string;
  imagens: string;
  departamento_provisorio_id: string;
  departamento_provisorio_nome: string;
  veiculo_id_substituicao: string;
  vtr_troca_placa: string;
  vtr_troca_categoria: string;
  vtr_troca_marca: string;
  vtr_troca_modelo: string;
  vtr_troca_prefixo: string;
  vtr_troca_chassis: string;
  vtr_troca_renavam: string;
  vtr_troca_cor: string;
  vtr_troca_locadora: string;
  vtr_troca_combustivel: string;
  vtr_troca_numero_sei: string;
  vtr_troca_ano_fabricacao: string;
  vtr_troca_numero_cartao_abas: string;
  data_substituicao_br: string;
  obs_substituicao: string;
  data_dp_confirmacao_br: string;
  obs_motorista: string;
  data_substituicao: string;
  data_abastecimento_sinc: string;
  data_dp_confirmacao: string;
  motorista_abastecimento_id: string;
}

interface Props {
  VtrsDados?: DataTypeViaturas[] | null;
}

const ViaturaGraficoForm: React.FC<Props> = ({ VtrsDados }) => {
  let CategoriaDados: { label: string; qtd: number }[] = [];
  let CombustivelDados: { label: string; qtd: number }[] = [];
  let StatusUsoDados: { label: string; qtd: number }[] = [];
  let ModalidadeDados: { label: string; qtd: number }[] = [];
  let TipoDepartamentoDados: { label: string; qtd: number }[] = [];
  let EspecializacaoDepartamentoDados: { label: string; qtd: number }[] = [];

  const GetVtrs = async () => {
    if (VtrsDados && Array.isArray(VtrsDados)) {
      /*------------------------------------------------------------------------
                              CATEGORIA DO VEÍCULO
  --------------------------------------------------------------------------*/
      const contagemCategoria: Record<string, number> = {};

      VtrsDados.forEach((viatura: { categoria: string }) => {
        const categor = viatura.categoria;

        if (!contagemCategoria[categor]) {
          contagemCategoria[categor] = 1;
        } else {
          contagemCategoria[categor]++;
        }
      });

      CategoriaDados = Object.entries(contagemCategoria).map(
        ([label, qtd]) => ({
          label,
          qtd,
        })
      );
      GetCategoria();

      /*------------------------------------------------------------------------
                              CATEGORIA DO VEÍCULO FIM
  --------------------------------------------------------------------------*/
      /*------------------------------------------------------------------------
                              COMBUSTÍVEL DO VEÍCULO
  --------------------------------------------------------------------------*/
      const contagemCombustivel: Record<string, number> = {};

      VtrsDados.forEach((viatura: { combustivel: string }) => {
        const combustivelVtr = viatura.combustivel;

        let combustivelVtrMapeada =
          combustivelVtr === "ALCOOL/GASOLINA" ? "FLEX" : combustivelVtr;

        if (!contagemCombustivel[combustivelVtrMapeada]) {
          contagemCombustivel[combustivelVtrMapeada] = 1;
        } else {
          contagemCombustivel[combustivelVtrMapeada]++;
        }
      });

      CombustivelDados = Object.entries(contagemCombustivel)
        .map(([label, qtd]) => ({ label, qtd }))
        .sort((a, b) => b.qtd - a.qtd);

      GetCombustivel();
      /*------------------------------------------------------------------------
                              COMBUSTÍVEL DO VEÍCULO FIM
  --------------------------------------------------------------------------*/

      /*------------------------------------------------------------------------
                            STATUS USO
--------------------------------------------------------------------------*/
      const contagemCondicoes: Record<string, number> = {};

      VtrsDados.forEach((viatura: { status_uso: string }) => {
        const condicao = viatura.status_uso;

        //contar apenas viaturas Pronto Para Uso
        if (!contagemCondicoes[condicao]) {
          contagemCondicoes[condicao] = 1;
        } else {
          contagemCondicoes[condicao]++;
        }
      });

      StatusUsoDados = Object.entries(contagemCondicoes).map(
        ([label, qtd]) => ({
          label,
          qtd,
        })
      );
      GetStatusUso();
      /*------------------------------------------------------------------------
                            STATUS USO FIM
--------------------------------------------------------------------------*/

      /*------------------------------------------------------------------------
                            MODALIDADE
--------------------------------------------------------------------------*/
      const contagemModalidade: Record<string, number> = {};

      VtrsDados.forEach((viatura: { propriedade: string }) => {
        const modalidade = viatura.propriedade;

        //contar apenas viaturas Pronto Para Uso
        if (!contagemModalidade[modalidade]) {
          contagemModalidade[modalidade] = 1;
        } else {
          contagemModalidade[modalidade]++;
        }
      });

      ModalidadeDados = Object.entries(contagemModalidade).map(
        ([label, qtd]) => ({
          label,
          qtd,
        })
      );
      GetModalidade();
      /*------------------------------------------------------------------------
                            MODALIDADE FIM
--------------------------------------------------------------------------*/

      /*------------------------------------------------------------------------
                            TIPO DEPARTAMENTO
--------------------------------------------------------------------------*/
      const contagemTipoDepartamento: Record<string, number> = {};

      VtrsDados.forEach((viatura: { departamento_tipo: string }) => {
        const departamento_tipoVtr = viatura.departamento_tipo;

        if (!contagemTipoDepartamento[departamento_tipoVtr]) {
          contagemTipoDepartamento[departamento_tipoVtr] = 1;
        } else {
          contagemTipoDepartamento[departamento_tipoVtr]++;
        }
      });

      TipoDepartamentoDados = Object.entries(contagemTipoDepartamento)
        .map(([label, qtd]) => ({ label, qtd }))
        .sort((a, b) => b.qtd - a.qtd);

      GetTipoDepartamento();
      /*------------------------------------------------------------------------
                            TIPO DEPARTAMENTO FIM
--------------------------------------------------------------------------*/
      /*------------------------------------------------------------------------
                            Especializacao DEPARTAMENTO
--------------------------------------------------------------------------*/
      const contagemEspecializacaoDepartamento: Record<string, number> = {};

      VtrsDados.forEach((viatura: { departamento_especializacao: string }) => {
        const departamento_especializacaoVtr =
          viatura.departamento_especializacao;

        if (
          !contagemEspecializacaoDepartamento[departamento_especializacaoVtr]
        ) {
          contagemEspecializacaoDepartamento[
            departamento_especializacaoVtr
          ] = 1;
        } else {
          contagemEspecializacaoDepartamento[departamento_especializacaoVtr]++;
        }
      });

      EspecializacaoDepartamentoDados = Object.entries(
        contagemEspecializacaoDepartamento
      )
        .map(([label, qtd]) => ({ label, qtd }))
        .sort((a, b) => b.qtd - a.qtd);

      GetEspecializacaoDepartamento();
      /*------------------------------------------------------------------------
                            Especializacao DEPARTAMENTO FIM
--------------------------------------------------------------------------*/
    }
  };

  /**************************************************************************
   * **********************************POR CATEGORIA****************************
   * AUTOMOVEL, MOTO
   * ************************************************************************/
  const [vtrsCategoria, setvtrsCategoria] = useState<ChartOptionsPieDunut>({
    series: [],
    options: {
      chart: {
        type: "pie",
      },
      title: {
        text: "Categoria do veículo",
        align: "center",
        margin: 10,
        floating: false,
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          color: "#263238",
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any, opts: any) {
          return parseFloat(val).toFixed(1) + "%";
        },
      },
      labels: [],
      responsive: [
        {
          options: {
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  const GetCategoria = async () => {
    try {
      // ... (seu código anterior)

      console.log(CategoriaDados);

      // Mapeie os dados para obter series.data e xaxis.categories
      const seriesData = CategoriaDados.map((item) => item.qtd);
      const categories = CategoriaDados.map((item) => item.label);

      // Atualize o estado com os novos dados
      setvtrsCategoria({
        series: seriesData as unknown as ChartDataPieDunut[], // Coerção de tipo
        options: {
          ...vtrsCategoria.options,
          labels: categories,
        },
      });
    } catch (error) {
      console.error("Erro ao obter dados de categoria:", error);
    }
  };

  /**************************************************************************
   * **********************************POR COMBUSTIVEL***********************
   * ************************************************************************/
  const [vtrsCombustivel, setvtrsCombustivel] =
    useState<ChartOptionsBarHorizontal>({
      series: [],
      options: {
        chart: {
          type: "bar",
        },
        title: {
          text: "Combustível do veículo",
          align: "center",
          margin: 10,
          floating: false,
          style: {
            fontSize: "14px",
            fontWeight: "bold",
            color: "#263238",
          },
        },
        plotOptions: {
          bar: {
            barHeight: "100%",
            distributed: true,
            horizontal: true,
            dataLabels: {
              position: "bottom",
            },
          },
        },
        dataLabels: {
          enabled: true,
          textAnchor: "start",
          style: {
            colors: ["#000"],
          },
          formatter: function (val: any, opt: any) {
            return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
          },
          offsetX: 0,
          dropShadow: {
            enabled: true,
            color: "#fff",
          },
        },
        legend: {
          show: true,
        },
        tooltip: {
          x: {
            show: true,
          },
          y: {
            title: {
              formatter: function (val: any) {
                return val + "";
              },
            },
          },
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              fontSize: "12px",
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

  const GetCombustivel = async () => {
    // Mapeie os dados para obter series.data e xaxis.categories
    const seriesData = CombustivelDados.map((item) => item.qtd);
    const categories = CombustivelDados.map((item) => item.label);
    //const hint = CombustivelDados.map(item => item.label);

    // Atualize o estado com os novos dados
    setvtrsCombustivel({
      series: [
        {
          name: "teste",
          group: [],
          data: seriesData,
        },
      ],
      options: {
        ...vtrsCombustivel.options,
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
                }: { seriesIndex: number; dataPointIndex: number }
              ) {
                // Use a variável 'hint' para exibir o conteúdo no tooltip
                return ""; //hint[dataPointIndex];
              },
            },
          },
          fixed: {
            enabled: true,
            position: "topLeft",
            offsetX: 0,
            offsetY: 0,
          },
          style: {
            fontSize: "10px",
            maxWidth: "200px",
          },
        },
        xaxis: {
          categories: categories,
          labels: {
            style: {
              fontSize: "12px",
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

  /**************************************************************************
   * **********************************POR TIPO DEPARTAMENTO***********************
   * ************************************************************************/
  const [vtrsTipoDepartamento, setvtrsTipoDepartamento] =
    useState<ChartOptionsBarHorizontal>({
      series: [],
      options: {
        chart: {
          type: "bar",
        },
        title: {
          text: "Tipo do Departamento",
          align: "center",
          margin: 10,
          floating: false,
          style: {
            fontSize: "14px",
            fontWeight: "bold",
            color: "#263238",
          },
        },
        plotOptions: {
          bar: {
            barHeight: "100%",
            distributed: true,
            horizontal: true,
            dataLabels: {
              position: "bottom",
            },
          },
        },
        dataLabels: {
          enabled: true,
          textAnchor: "start",
          style: {
            colors: ["#000"],
          },
          formatter: function (val: any, opt: any) {
            return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
          },
          offsetX: 0,
          dropShadow: {
            enabled: true,
            color: "#fff",
          },
        },
        legend: {
          show: true,
        },
        tooltip: {
          x: {
            show: true,
          },
          y: {
            title: {
              formatter: function (val: any) {
                return val + "";
              },
            },
          },
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              fontSize: "12px",
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

  const GetTipoDepartamento = async () => {
    // Mapeie os dados para obter series.data e xaxis.categories
    const seriesData = TipoDepartamentoDados.map((item) => item.qtd);
    const categories = TipoDepartamentoDados.map((item) => item.label);
    //const hint = CombustivelDados.map(item => item.label);

    // Atualize o estado com os novos dados
    setvtrsTipoDepartamento({
      series: [
        {
          name: "teste",
          group: [],
          data: seriesData,
        },
      ],
      options: {
        ...vtrsTipoDepartamento.options,
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
                }: { seriesIndex: number; dataPointIndex: number }
              ) {
                // Use a variável 'hint' para exibir o conteúdo no tooltip
                return ""; //hint[dataPointIndex];
              },
            },
          },
          fixed: {
            enabled: true,
            position: "topLeft",
            offsetX: 0,
            offsetY: 0,
          },
          style: {
            fontSize: "10px",
            maxWidth: "200px",
          },
        },
        xaxis: {
          categories: categories,
          labels: {
            style: {
              fontSize: "12px",
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

  /**************************************************************************
   * **********************************POR ESPECIALIZAÇÃO DEPARTAMENTO***********************
   * ************************************************************************/
  const [vtrsEspecializacaoDepartamento, setvtrsEspecializacaoDepartamento] =
    useState<ChartOptionsBar>({
      series: [],
      options: {
        chart: {
          type: "bar",
        },
        title: {
          text: "Especialização do Departamento",
          align: "center",
          margin: 10,
          floating: false,
          style: {
            fontSize: "14px",
            fontWeight: "bold",
            color: "#263238",
          },
        },
        plotOptions: {
          bar: {
            columnWidth: "55%",
            distributed: true,
          },
        },
        dataLabels: {
          enabled: true,
          style: {
            colors: ["#000"],
          },
          dropShadow: {
            enabled: true,
            color: "#fff",
          },
        },
        legend: {
          show: true,
        },
        tooltip: {
          x: {
            show: true,
          },
          y: {
            title: {
              formatter: function (val: any) {
                return val + ""; // Converta val para string, se necessário
              },
            },
          },
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              fontSize: "12px",
            },
            show: false,
          },
        },
      },
    });

  const GetEspecializacaoDepartamento = async () => {
    // Mapeie os dados para obter series.data e xaxis.categories
    const seriesData = EspecializacaoDepartamentoDados.map((item) => item.qtd);
    const categories = EspecializacaoDepartamentoDados.map(
      (item) => item.label
    );

    const hint = EspecializacaoDepartamentoDados.map((item) => item.label);
    //const hint = CombustivelDados.map(item => item.label);

    // Atualize o estado com os novos dados
    setvtrsEspecializacaoDepartamento({
      series: [
        {
          name: "teste",
          group: hint,
          data: seriesData,
        },
      ],
      options: {
        ...vtrsEspecializacaoDepartamento.options,
        tooltip: {
          x: {
            show: true,
          },
          y: {
            title: {
              formatter: function (
                tooltipVal: any,
                {
                  seriesIndex,
                  dataPointIndex,
                }: { seriesIndex: number; dataPointIndex: number }
              ) {
                // Use a variável 'hint' para exibir o conteúdo no tooltip
                return hint[dataPointIndex];
              },
            },
          },
        },
        xaxis: {
          categories: categories,
          labels: {
            style: {
              fontSize: "12px",
            },
            show: false,
          },
        },
      },
    });
  };

  /**************************************************************************
   * **********************************POR STATUS USO****************************
   * ************************************************************************/
  const [vtrsStatusUso, setvtrsStatusUso] = useState<ChartOptionsPieDunut>({
    series: [],
    options: {
      chart: {
        type: "pie",
      },
      title: {
        text: "Status de Uso",
        align: "center",
        margin: 10,
        floating: false,
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          color: "#263238",
        },
      },
      labels: [],
      responsive: [
        {
          options: {
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  const GetStatusUso = async () => {
    try {
      // ... (seu código anterior)

      // Mapeie os dados para obter series.data e xaxis.categories
      const seriesData = StatusUsoDados.map((item) => item.qtd);
      const categories = StatusUsoDados.map((item) => item.label);

      // Atualize o estado com os novos dados
      setvtrsStatusUso({
        series: seriesData as unknown as ChartDataPieDunut[], // Coerção de tipo
        options: {
          ...vtrsStatusUso.options,
          labels: categories,
        },
      });
    } catch (error) {
      console.error("Erro ao obter dados de status de uso:", error);
    }
  };

  /**************************************************************************
   * **********************************POR TIPO****************************
   * ************************************************************************/
  const [vtrsModalidade, setvtrsModalidade] = useState<ChartOptionsPieDunut>({
    series: [],
    options: {
      chart: {
        type: "pie",
      },
      title: {
        text: "Modalidade",
        align: "center",
        margin: 10,
        floating: false,
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          color: "#263238",
        },
      },
      labels: [],
      responsive: [
        {
          options: {
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  const GetModalidade = async () => {
    try {
      // ... (seu código anterior)

      // Mapeie os dados para obter series.data e xaxis.categories
      const seriesData = ModalidadeDados.map((item) => item.qtd);
      const categories = ModalidadeDados.map((item) => item.label);

      // Atualize o estado com os novos dados
      setvtrsModalidade({
        series: seriesData as unknown as ChartDataPieDunut[], // Coerção de tipo
        options: {
          ...vtrsModalidade.options,
          labels: categories,
        },
      });
    } catch (error) {
      console.error("Erro ao obter dados de status de uso:", error);
    }
  };

  /**************************************************************************
   * **********************************início***********************
   * ************************************************************************/

  useEffect(() => {
    GetVtrs();
  }, [VtrsDados]);

  return (
    <>
      <Row style={{ width: "100%" }}>
        <Col>
          <Card style={{ width: 500, height: 340 }}>
            <MyChartHeight
              options={vtrsModalidade.options}
              series={vtrsModalidade.series}
              type={"donut"}
              height={310}
            />
          </Card>
        </Col>
        <Col>
          <Card style={{ width: 500, height: 340 }}>
            <MyChartHeight
              options={vtrsTipoDepartamento.options}
              series={vtrsTipoDepartamento.series}
              type={"bar"}
              height={310}
            />
          </Card>
        </Col>
      </Row>

      <Row style={{ width: "100%" }}>
        <Col>
          <Card style={{ width: 1000, height: 390, overflowY: "auto" }}>
            <MyChartHeight
              options={vtrsEspecializacaoDepartamento.options}
              series={vtrsEspecializacaoDepartamento.series}
              type={"bar"}
              height={300}
            />
          </Card>
        </Col>
      </Row>

      <Row style={{ width: "100%" }}>
        <Col>
          <Card style={{ width: 500, height: 340 }}>
            <MyChartHeight
              options={vtrsStatusUso.options}
              series={vtrsStatusUso.series}
              type={"pie"}
              height={310}
            />
          </Card>
        </Col>
        <Col>
          <Card style={{ width: 500, height: 340 }}>
            <MyChartHeight
              options={vtrsCombustivel.options}
              series={vtrsCombustivel.series}
              type={"bar"}
              height={310}
            />
          </Card>
        </Col>
        <Col>
          <Card style={{ width: 500, height: 340 }}>
            <MyChartHeight
              options={vtrsCategoria.options}
              series={vtrsCategoria.series}
              type={"donut"}
              height={310}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ViaturaGraficoForm;

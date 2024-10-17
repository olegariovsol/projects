import React, { useEffect, useState } from 'react';
import MyChart from '../graficos/MyChart';
import { useAxiosServidor } from '../../hooks/useAxiosServidor';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Tooltip, message, notification } from 'antd';
import { Option } from 'antd/es/mentions';
import locale from "antd/es/date-picker/locale/pt_BR"
import dayjs from "dayjs";
import "dayjs/locale/pt-br";




interface ChartDataGenero {
  name: string;
  data: any[];
}
interface ChartOptionsGenero {
  chart: {
    type: string;
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
    }
  };
  labels: [];
  responsive: [{
              options: {
                legend: {
                  position: string;
                }
              }
            }]
}



interface ChartDataRegra {
  name: string;
  data: any[];
}
interface ChartOptionsRegra {
  chart: {
    type: string;
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
    }
  };
  labels: [];
  responsive: [{
              options: {
                legend: {
                  position: string;
                }
              }
            }]
}



interface ChartDataCargo {
  name: string;
  data: any[];
}
interface ChartOptionsCargo {
  chart: {
    type: string;
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
    }
  };
  plotOptions: {
    bar: {
      columnWidth: string;
      distributed: boolean;
    };
  };
  dataLabels: {
    enabled: boolean;
  };
  legend: {
    show: boolean;
  };
  xaxis: {
    categories: string[];
    labels: {
              style: {
                fontSize: string
              }
            }
  };
}



interface ChartDataIdade {
  name: string;
  data: any[];
}
interface ChartOptionsIdade {
  chart: {
    type: string;
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
    }
  };
  plotOptions: {
    bar: {
      columnWidth: string;
      distributed: boolean;
    };
  };
  dataLabels: {
    enabled: boolean;
  };
  legend: {
    show: boolean;
  };
  xaxis: {
    categories: string[];
    labels: {
              style: {
                fontSize: string
              }
            }
  };
}



interface ChartDtaRequisicao {
  name: string;
  data: any[];
}

interface ChartOptionsDtaRequisicao {
  chart: {
    type: string;
    zoom: {
      enabled: boolean;
    }
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
    }
  };
  dataLabels: {
    enabled: boolean
  };
  stroke: {
    width: number[]; // Um array de números
    curve: string;
    dashArray: number[];
  },
  xaxis: {
    categories: string[];
  };
}


const Dashboard: React.FC = () => {
  const data = dayjs();
  const [messageApi, contextHolder] = message.useMessage();
  const [form_grafico_controler] = Form.useForm();
  const apiServidor = useAxiosServidor();



  const CarregarDashBoard = () => {
    var xrecarregar = 'SIM';

    const xdtai = form_grafico_controler.getFieldValue("zcons_dtai").format("MM/DD/YYYY");
    if (xdtai.length !== 10) {
      xrecarregar = 'NAO';
      notification.error({ message: 'Informe a data de início.' });
    }

    const xdtaf = form_grafico_controler.getFieldValue("zcons_dtaf").format("MM/DD/YYYY");
    if (xdtaf.length !== 10) {
      xrecarregar = 'NAO';
      notification.error({ message: 'Informe a data de término.' });
    }

    if (xrecarregar === 'SIM') {
      ChartGenero();
      ChartRegra();
      ChartCargo();
      ChartIdade();
      ChartDtaRequisicao();
      // Return some JSX here if needed
      return <div>Your JSX content here</div>;
    }

    // If xrecarregar is not 'SIM', return null or an empty fragment
    return null;
  };





 /**************************************************************************
 * **********************************POR GENERO****************************
 * ************************************************************************/
  const [dadosGraficosGenero, setdadosGraficosGenero] = useState<{
    series: ChartDataGenero[];
    options: ChartOptionsGenero;
  }>({
    series: [],
    options: {
      chart: {
        type: 'donut',
      },
      title: {
          text: 'Quanto ao Genero',
          align: 'center',
          margin: 10,
          floating: false,
          style: {
            fontSize:  '14px',
            fontWeight:  'bold',
            color:  '#263238'
          },
      },
      labels: [],
      responsive: [{
              options: {
                legend: {
                  position: 'bottom'
                }
              }
            }]
    },
  });

const ChartGenero = async () => {

    const xdtai = form_grafico_controler.getFieldValue("zcons_dtai").format("MM/DD/YYYY");
    const xdtaf = form_grafico_controler.getFieldValue("zcons_dtaf").format("MM/DD/YYYY");

    await apiServidor.graficoGenero(xdtai, xdtaf).then((res: any) => {
      // Mapeie os dados para obter series.data e xaxis.categories
      const seriesData = res.data.map((item: any) => item.qtd);
      const categories = res.data.map((item: any) => item.label);

      // Atualize o estado com os novos dados
      setdadosGraficosGenero({
        series: seriesData,
        options: {
          ...dadosGraficosGenero.options,
          labels: categories
        },
      });
    });
  };
 /**************************************************************************
 * **********************************POR GENERO fim*************************
 * ************************************************************************/



 /**************************************************************************
 * **********************************POR REGRA****************************
 * ************************************************************************/
  const [dadosGraficosRegra, setdadosGraficosRegra] = useState<{
    series: ChartDataRegra[];
    options: ChartOptionsRegra;
  }>({
    series: [],
    options: {
      chart: {
        type: 'donut',
      },
      title: {
          text: 'Regra Escolhida',
          align: 'center',
          margin: 10,
          floating: false,
          style: {
            fontSize:  '14px',
            fontWeight:  'bold',
            color:  '#263238'
          },
      },
      labels: [],
      responsive: [{
              options: {
                legend: {
                  position: 'bottom'
                }
              }
            }]
    },
  });

const ChartRegra = async () => {

    const xdtai = form_grafico_controler.getFieldValue("zcons_dtai").format("MM/DD/YYYY");
    const xdtaf = form_grafico_controler.getFieldValue("zcons_dtaf").format("MM/DD/YYYY");

    await apiServidor.graficoRegra(xdtai, xdtaf).then((res: any) => {
      // Mapeie os dados para obter series.data e xaxis.categories
      const seriesData = res.data.map((item: any) => item.qtd);
      const categories = res.data.map((item: any) => item.label);

      // Atualize o estado com os novos dados
      setdadosGraficosRegra({
        series: seriesData,
        options: {
          ...dadosGraficosRegra.options,
          labels: categories
        },
      });
    });
  };
 /**************************************************************************
 * **********************************POR REGRA fim*************************
 * ************************************************************************/


 /**************************************************************************
 * **********************************POR CARGO*************************
 * ************************************************************************/

 const [dadosGraficosCargo, setdadosGraficosCargo] = useState<{
    series: ChartDataCargo[];
    options: ChartOptionsCargo;
  }>({
    series: [],
    options: {
      chart: {
        type: 'bar',
      },
      title: {
          text: 'Por Cargo',
          align: 'center',
          margin: 10,
          floating: false,
          style: {
            fontSize:  '14px',
            fontWeight:  'bold',
            color:  '#263238'
          },
      },
      plotOptions: {
        bar: {
          columnWidth: '55%',
          distributed: true
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false
      },
      xaxis: {
        categories: [],
        labels: {
                  style: {
                    fontSize: '12px'
                  }
                }
      }
    },
  });


  const ChartCargo = async () => {

    const xdtai = form_grafico_controler.getFieldValue("zcons_dtai").format("MM/DD/YYYY");
    const xdtaf = form_grafico_controler.getFieldValue("zcons_dtaf").format("MM/DD/YYYY");

    await apiServidor.graficoCargo(xdtai, xdtaf).then((res: any) => {
      // Mapeie os dados para obter series.data e xaxis.categories
      const seriesData = res.data.map((item: any) => item.qtd);
      const categories = res.data.map((item: any) => item.label);

      // Atualize o estado com os novos dados
      setdadosGraficosCargo({
        series: [
          {
            name: 'Por Cargo',
            data: seriesData,
          },
        ],
        options: {
          ...dadosGraficosCargo.options,
          xaxis: {
            categories: categories,
            labels: {
                      style: {
                        fontSize: '12px'
                      }
                    }
          },
        },
      });
    });
  };
 /**************************************************************************
 * **********************************POR CARGO fim*************************
 * ************************************************************************/


 /**************************************************************************
 * **********************************POR IDADE*************************
 * ************************************************************************/

 const [dadosGraficosIdade, setdadosGraficosIdade] = useState<{
    series: ChartDataIdade[];
    options: ChartOptionsIdade;
  }>({
    series: [],
    options: {
      chart: {
        type: 'bar',
      },
      title: {
          text: 'Quanto a Idade(em anos)',
          align: 'center',
          margin: 10,
          floating: false,
          style: {
            fontSize:  '14px',
            fontWeight:  'bold',
            color:  '#263238'
          },
      },
      plotOptions: {
        bar: {
          columnWidth: '55%',
          distributed: true
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false
      },
      xaxis: {
        categories: [],
        labels: {
                  style: {
                    fontSize: '12px'
                  }
                }
      }
    },
  });


  const ChartIdade = async () => {

    const xdtai = form_grafico_controler.getFieldValue("zcons_dtai").format("MM/DD/YYYY");
    const xdtaf = form_grafico_controler.getFieldValue("zcons_dtaf").format("MM/DD/YYYY");

    await apiServidor.graficoIdade(xdtai, xdtaf).then((res: any) => {
      // Mapeie os dados para obter series.data e xaxis.categories
      const seriesData = res.data.map((item: any) => item.qtd);
      const categories = res.data.map((item: any) => item.label);

      // Atualize o estado com os novos dados
      setdadosGraficosIdade({
        series: [
          {
            name: 'Anos',
            data: seriesData,
          },
        ],
        options: {
          ...dadosGraficosIdade.options,
          xaxis: {
            categories: categories,
            labels: {
                      style: {
                        fontSize: '12px'
                      }
                    }
          },
        },
      });
    });
  };
 /**************************************************************************
 * **********************************POR IDADE fim*************************
 * ************************************************************************/

 /**************************************************************************
 * **********************************POR DATA REQUISIÇÃO********************
 * ************************************************************************/
  const [dadosGraficosDtaRequisicao, setdadosGraficosDtaRequisicao] = useState<{
    series: ChartDtaRequisicao[];
    options: ChartOptionsDtaRequisicao;
  }>({
    series: [],
    options: {
      chart: {
        type: 'line',
        zoom: {
          enabled: false
        },
      },
      title: {
          text: 'Quanto a Data de Requisição do Benefício',
          align: 'center',
          margin: 10,
          floating: false,
          style: {
            fontSize:  '14px',
            fontWeight:  'bold',
            color:  '#263238'
          },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [5, 7, 5],
        curve: 'straight',
        dashArray: [0, 8, 5],
      },
      xaxis: {
        categories: [],
      },
    }
  });

  const ChartDtaRequisicao = async () => {

     const xdtai = form_grafico_controler.getFieldValue("zcons_dtai").format("MM/DD/YYYY");
    const xdtaf = form_grafico_controler.getFieldValue("zcons_dtaf").format("MM/DD/YYYY");

    await apiServidor.graficoDtaRequisicao(xdtai, xdtaf).then((res: any) => {
      const seriesDataIni = res.data.map((item: any) => item.qtd);
      const categories = res.data.map((item: any) => item.label);

      // Atualize o estado com os novos dados
      setdadosGraficosDtaRequisicao({
        series: [
          {
            name: 'Requisições',
            data: seriesDataIni,
          },
        ],
        options: {
          ...dadosGraficosDtaRequisicao.options,
          xaxis: {
            categories: categories,
          },
        },
      });
    })
  }
 /**************************************************************************
 * **********************************POR DATA REQUISIÇÃO FIM****************
 * ************************************************************************/
  useEffect(() => {
    ChartGenero();
    ChartRegra();
    ChartCargo();
    ChartIdade();
    ChartDtaRequisicao();
  }, []);

  // Função para obter o primeiro dia do ano atual
  const getPrimeiroDiaDoAno = () => {
    return dayjs().startOf('year');
  };

  return (
    <div>
      <Form
        form={form_grafico_controler}
        layout='vertical'
        initialValues={{ zcons_dtai: getPrimeiroDiaDoAno(), zcons_dtaf: dayjs(data.format('DD/MM/YYYY'), 'DD/MM/YYYY') }}
      >
        {contextHolder}
        <Row style={{ width: '100%' }}>
          <Col span={3} style={{paddingRight: 5}}>
            <Tooltip trigger={['focus']} title="Data Inicial da Requisição" placement="top">
              <Form.Item name="zcons_dtai" label="Início:">
                <DatePicker format={"DD/MM/YYYY"}
                      locale={locale} />
              </Form.Item>
            </Tooltip>
          </Col>


          <Col span={3} style={{paddingRight: 5}}>
            <Tooltip trigger={['focus']} title="Data Final da Requisição" placement="top">
              <Form.Item name="zcons_dtaf" label="Término:">
                <DatePicker format={"DD/MM/YYYY"}
                      locale={locale} />
              </Form.Item>
            </Tooltip>
          </Col>

          <Button type="primary" style={{backgroundColor: 'darkgreen', marginTop: 30}} onClick={CarregarDashBoard}>
            Carregar DashBoard
          </Button>

        </Row>
      </Form>

       <Row>
          <Col>
            <Card style={{ width: 500, height: 300 }}>
            <MyChart options={dadosGraficosRegra.options} series={dadosGraficosRegra.series} type={"pie"} />
            </Card>
          </Col>
          <Col>
            <Card style={{ width: 500, height: 300 }}>
            <MyChart options={dadosGraficosGenero.options} series={dadosGraficosGenero.series} type={"donut"} />
            </Card>
          </Col>
          <Col>
            <Card style={{ width: 500, height: 300 }}>
            <MyChart options={dadosGraficosCargo.options} series={dadosGraficosCargo.series} type={"bar"} />
            </Card>
          </Col>
      </Row>

       <Row>
          <Col>
            <Card style={{ width: 500, height: 300 }}>
            <MyChart options={dadosGraficosIdade.options} series={dadosGraficosIdade.series} type={"bar"} />
            </Card>
          </Col>
      </Row>

       <Row>
          <Col>
          <Card style={{ width: 1000, height: 300 }}>
          <MyChart options={dadosGraficosDtaRequisicao.options} series={dadosGraficosDtaRequisicao.series} type={"line"} />
          </Card>
      </Col>
      </Row>

    </div>
  );
};

export default Dashboard;

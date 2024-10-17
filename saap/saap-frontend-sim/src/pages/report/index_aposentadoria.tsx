import React from "react";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content } from 'pdfmake/interfaces';
import moment from 'moment-timezone';
import { logoPcBase64, logoSspBase64, logoICBase64 } from '../Image';
//import { fetchStates } from '../Services/Axios/serverServices';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function substituirEspacosPorUnderscores(texto:string) {
  return texto.replace(/ /g, '_');
}
function removerAcentos(texto:string) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
function formatarNumeroMilhar(numero:string) {
  return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

const generatePDF = async (
  dataServidor: any,
  dataRegraEscolhida: any,
  dataHistorico: any,
  user_nome: any,
  user_cpf: any
) => {
  const content: Content[] = [];

  const dateHoraAtual = moment.parseZone(new Date()).local(true).format('DD/MM/YYYY HH:mm');

  //console.log('report :',dataServidor);
  //console.log('nome_entrada: ', dataServidor.nome_entrada);

  const footer = function (currentPage: number, pageCount: number): Content[] {
  return [
    {
      columns: [
        {
          text: `Impresso por: ${user_nome}\n em: ${dateHoraAtual}`,
          fontSize: 8,
          alignment: 'left',
          italics: true,
          margin: [20, 10, 0, 0],
        },
        {
          text: `SEI: ${dataServidor.sei}\nPágina ${currentPage} de ${pageCount}`,
          fontSize: 8,
          alignment: 'right',
          italics: true,
          margin: [0, 10, 20, 0],
        },
      ],
    },
  ];
};

  let zgenero_artigo = '';
  let zgenero_artigo2 = 'o';
  let zgenero_artigo3 = 'O';
  let zgenero_artigo4 = '';
  if (dataServidor.genero == 'FEMININO') {
    zgenero_artigo = 'a';
    zgenero_artigo2 = 'a';
    zgenero_artigo3 = 'A';
    zgenero_artigo4 = 'A';
  }

  let zregra_data = '';
  if (dataServidor.Regra != '1035') {
    zregra_data = ' (31/12/2019)';
  }

  content.push({
    stack: [
     /* {
        image: logoICBase64,
        width: 100,
        margin: [-40, -40, 0, 0],
      },
      {
        image: logoPcBase64,
        width: 64,
        alignment: 'right',
        margin: [0, -90, -15, 0], //superior, direita, inferior, esquerda
      },*/
      {
        image: logoPcBase64,
        width: 64,
        alignment: 'right',
        margin: [0, -30, -15, 0], //superior, direita, inferior, esquerda
      },
      /*{
        text: 'ESTADO DE GOIÁS',
        fontSize: 14,
        bold: true,
        alignment: 'center',
        margin: [0, -70, 0, 10],
      },*/
      {
        text: 'Secretaria de Estado da Segurança Pública',
        fontSize: 14,
        bold: true,
        alignment: 'center',
        margin: [0, -70, 0, 10],
      },
      {
        text: 'Polícia Civil do Estado de Goiás',
        fontSize: 14,
        bold: true,
        alignment: 'center',
        margin: [0, -5, 0, 10],
      },
      {
        text: 'Superintendência de Gestão Integrada',
        fontSize: 14,
        bold: true,
        alignment: 'center',
        margin: [0, -5, 0, 10],
      },
      {
        text: 'Seção de Direitos e Deveres',
        fontSize: 14,
        bold: true,
        alignment: 'center',
        margin: [0, -5, 0, 10],
      },
      {
        text: '-',
        fontSize: 14,
        bold: true,
        color: 'white',
        alignment: 'center',
        margin: [0, -5, 0, 10],
      },
      /*{
        text: `Seção de Direitos e Deveres`,
        fontSize: 14,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10],
      },*/
      { text: `${dataServidor.dta_requisicao_br}`, fontSize: 10, alignment: 'right' },
      {
  // Texto "RELATÓRIO DE VERIFICAÇÃO DE IDENTIDADE" com linha sublinhada abaixo
        stack: [
          {
            text: `ANEXO 1 DO HISTÓRICO FUNCIONAL nº ${dataServidor.historico_id}`,
            fontSize: 14,
            bold: true,
            alignment: 'center',
            margin: [0, 10, 0, 0], // Espaçamento superior (ajuste conforme necessário)
          },
          {
            canvas: [
              {
                type: 'line',
                x1: 115,
                y1: 0,
                x2: 402, // Ajuste o tamanho da linha conforme necessário
                y2: 0,
                lineWidth: 1, // Largura da linha
                lineColor: 'darkgray', // Cor da linha (ajuste conforme necessário)
              },
            ],
            margin: [0, 5], // Espaçamento superior da linha (ajuste conforme necessário)
          },
        ],
      },
      {
        canvas: [
          {
            type: 'rect',
            x: 34,
            y: 14,
            w: 494, // Ajuste a largura do retângulo conforme necessário
            h: 18, // Ajuste a altura do retângulo conforme necessário
            color: '#f2f2f2', // Cor de fundo (cinza claro)
          },
        ],
      },
      {
        text: [{ text: `Servidor${zgenero_artigo}:`, fontSize: 12 },
          { text:  ` ${dataServidor.nome}`, fontSize: 14, bold: true },
        ],
        alignment: 'left',
        margin: [0, 20, 0, 0],
        absolutePosition: { x: 20, y: 200 }, // Ajuste a posição do texto conforme necessário
      },

/*
fim push stack
*/
    ],
  });




  /*DADOS PESSOAIS*/
  const tableHeaderDados = [
    { text: 'GÊNERO', alignment: 'center', border: [] },
    { text: 'CPF', alignment: 'center', border: [] },
    { text: 'TELEFONE', alignment: 'center', border: [] },
    { text: 'EMAIL', alignment: 'center', border: [] },
  ];

  const colWidthsDados = [98, 98, 158, 159]; // Exemplo de larguras em pontos


  let cpf = '';
  if (dataServidor.cpf.length == 11) {
      cpf = dataServidor.cpf.substr(0, 3) + '.' + dataServidor.cpf.substr(3, 3) + '.' + dataServidor.cpf.substr(6, 3) + '-' + dataServidor.cpf.substr(9, 2);
  }

  const tableDataDados = [
  [
    { text:  `${dataServidor.genero}`, alignment: 'center',  bold: true, fillColor: '#f2f2f2', border: [] },
    { text:  `${cpf}`, alignment: 'center', bold: true, fillColor: '#f2f2f2', border: [] },
    { text:  dataServidor.telefone ? dataServidor.telefone : '', alignment: 'center', bold: true, fillColor: '#f2f2f2', border: [] },
    { text:  dataServidor.email ? dataServidor.email : '', alignment: 'center', bold: true, fillColor: '#f2f2f2', border: [] },
  ]
];

// ...

content.push({
  table: {
    headerRows: 1,
    widths: colWidthsDados,
    body: [tableHeaderDados, ...tableDataDados],
  },
  fontSize: 10,
  margin: [-20, -10, 0, 0],
});

  /*DADOS PESSOAIS FIM*/

   /*DADOS LOTAÇÃO*/
  const tableHeaderDadosLotacao = [
    { text: 'CARGO', alignment: 'center', border: [] },
    { text: 'LOTAÇÃO', alignment: 'center', border: [] },
  ];

  const colWidthsDadosLotacao = [200, 322]; // Exemplo de larguras em pontos

  const tableDataDadosLotacao = [
  [
    { text:  `${dataServidor.cargo}`, alignment: 'center',  border: [] },
    { text:  `${dataServidor.dp_lotacao}`, alignment: 'center', border: [] },
  ]
];

// ...

content.push({
  table: {
    headerRows: 1,
    widths: colWidthsDadosLotacao,
    body: [tableHeaderDadosLotacao, ...tableDataDadosLotacao],
  },
  fontSize: 8,
  margin: [-20, 10, 0, 0],
});

  /*DADOS LOTAÇÃO FIM*/


  /*REGRA ESCOLHIDA FIM*/
content.push({
      stack: [
        {
        canvas: [
          {
            type: 'rect',
            x: 67,
            y: 37,
            w: 458, // Ajuste a largura do retângulo conforme necessário
            h: 18, // Ajuste a altura do retângulo conforme necessário
            color: '#f2f2f2', // Cor de fundo (cinza claro)
          },
        ],
      },
      {
        text: [{ text: 'Regra Aplicável: ', fontSize: 12 },
          { text:  `${dataServidor.regra_desc}`, fontSize: 14, bold: true },
        ],
        alignment: 'left',
        margin: [0, 30, 0, 0],
        absolutePosition: { x: 20, y: 340 }, // Ajuste a posição do texto conforme necessário
      }
    ]
  });


  /*REGRA ESCOLHIDA FIM*/

 /*HISTORICO FIM*/
  //etiqueta_relatorio
  //TEMPO_GERAL
  //AVERBACAO_DESCONTOS
  //PEDAGIO_E_TEMPO_TOTAL 1
  //TEMPO_CONTRIBUICAO 2
  //ATIVIDADE_RISCO 3
  //IDADE_MINIMA 4
  //CONCLUSAO
      let ztempo_pcgo_liquido = '';//abatendo descontos e com averbações
      let ztempo_pcgo_total_dias_liquido = '';//abatendo descontos e com averbações
      let ztempo_pcgo = '';
      let ztempo_pcgo_total_dias = '';
      let ztempo_acrescentar = '';
      let ztempo_acrescentar_total_dias = '';
      let ztempo_deduzir = '';
      let ztempo_deduzir_total_dias = '';
      let ztempo_pedagio = '';
      let ztempo_total = '';
      let zquesito_pedagio = '';
      let ztempo_minimo = '';
      let zquesito_tempo = '';
      let zquesito_risco = '';
      let zrisco_minimo = '';
      let zrisco_tempo = '';
      let zrisco_definicao = '';
      let zquesito_idade = '';
      let zidade_data = '';
      let ztempo_pcgo_resumido = '';
      let ztempo_total_resumo = '';
      let zrisco_tempo_resumo = '';
      let ztempo_deduzir_resumo = '';
  let ztempo_acrescentar_resumo = '';
  let ztempo_pcgo_liquido_resumo = '';
  let ztempo_pedagio_total_dias = '';
  let ztempo_pedagio_resumo = '';
  let zrisco_total_dias = '';


   dataRegraEscolhida.map((regra_array: any) => {

     //console.log(dataServidor.regra+' >> '+regra_array.etiqueta_relatorio+' '+regra_array.icon_regra1);
        if (regra_array.etiqueta_relatorio == 'RELATORIO') {
          ztempo_pcgo = regra_array.rel_tempo_pcgo;
          ztempo_pcgo_resumido = regra_array.rel_tempo_pcgo_resumo;
          ztempo_pcgo_total_dias = regra_array.rel_dias_pcgo;
          ztempo_acrescentar=regra_array.rel_tempo_acrescentar;

          ztempo_acrescentar_total_dias = regra_array.rel_tempo_acrescentar_total_dias;
          ztempo_deduzir=regra_array.rel_tempo_deduzir;
          ztempo_deduzir_total_dias=regra_array.rel_tempo_deduzir_total_dias;
          ztempo_pcgo_liquido=regra_array.rel_tempo_pcgo_liquido;
          ztempo_pcgo_total_dias_liquido = regra_array.rel_tempo_pcgo_total_dias_liquido;

          ztempo_pedagio=regra_array.rel_tempo_pedagio;
          ztempo_total=regra_array.rel_tempo_total;
          zquesito_pedagio=regra_array.rel_quesito_pedagio;
          ztempo_minimo=regra_array.rel_tempo_minimo;
          zquesito_tempo=regra_array.rel_quesito_tempo;
          zrisco_minimo = regra_array.rel_risco_minimo;
          zrisco_total_dias = regra_array.rel_risco_total_dias;
          zrisco_tempo=regra_array.rel_risco_tempo;
          zrisco_definicao=regra_array.rel_risco_definicao;
          zquesito_risco=regra_array.rel_quesito_risco;
          zquesito_idade=regra_array.rel_quesito_idade;
          zidade_data = regra_array.rel_idade_data;

          ztempo_total_resumo = regra_array.rel_tempo_total_resumo;
          zrisco_tempo_resumo = regra_array.rel_risco_tempo_resumo;
          ztempo_acrescentar_resumo = regra_array.rel_tempo_acrescentar_resumo;
          ztempo_deduzir_resumo = regra_array.rel_tempo_deduzir_resumo;
          ztempo_pcgo_liquido_resumo = regra_array.rel_tempo_pcgo_liquido_resumo;
          ztempo_pedagio_resumo = regra_array.rel_tempo_pedagio_resumo;
            ztempo_pedagio_total_dias = regra_array.rel_tempo_pedagio_total_dias;
        }


   });//FIM LOOP ANALISE REGRA




  /*DATAS*/
  const tableHeaderDados2 = [
    { text: 'NASCIMENTO', alignment: 'center', border: [] },
    { text: 'POSSE', alignment: 'center', border: [] },
    { text: 'HISTÓRICO', alignment: 'center', border: [] },
    { text: 'REQUISITO IDADE', alignment: 'center', bold: true, border: [] },
  ];

  const colWidthsDados2 = [64, 64, 64, 315]; // Exemplo de larguras em pontos

  const resultadoStyleIdade = {
        bold: true,
        fillColor: '#f2f2f2',
        alignment: 'center',
        color: zquesito_idade === 'S' ? 'darkgreen' : 'darkred',
  };

  const tableDataDados2 = [
  [
    { text:  `${dataServidor.dta_nascimento_br+' '+dataServidor.idade_atual+' anos'}`, alignment: 'center',  bold: true, border: [] },
    { text:  `${dataServidor.dta_inicio_br+' '+dataServidor.idade_posse+' anos'}`, alignment: 'center', bold: true, border: [] },
    { text:  `${dataServidor.dta_requisicao_br2+' '+dataServidor.idade_requisicao+' anos'}`, style: resultadoStyleIdade, border: [] },
    { text:  `${zidade_data}`, style: resultadoStyleIdade, border: [] },
  ]
];

// ...

content.push({
  table: {
    headerRows: 1,
    widths: colWidthsDados2,
    body: [tableHeaderDados2, ...tableDataDados2],
  },
  fontSize: 10,
  margin: [-20, 10, 0, 0],
});

  /*DATAS FIM*/














/*TABELA TEMPO 1*/
  const tableHeaderTempo = [
    { text: 'TEMPO NA PCGO', alignment: 'center',  border: [] },
    { text: 'TEMPO A ACRESCENTAR', alignment: 'center', border: [] },
    { text: 'TEMPO A DEDUZIR', alignment: 'center', border: [] },
  ];

  const colWidthsTempo = [171, 171, 171]; // Exemplo de larguras em pontos

 const tableDataTempo = [
  [
    { text:  ztempo_pcgo, alignment: 'center', border: [] },
    { text:  ztempo_acrescentar, alignment: 'center', border: [] },
    { text:  ztempo_deduzir, alignment: 'center', border: [] },
  ]
];

// Adicione a tabela ao conteúdo com as larguras definidas
  content.push({
    table: {
      headerRows: 1,
      widths: colWidthsTempo,
      body: [tableHeaderTempo, ...tableDataTempo],
    },
    fontSize: 10,
    margin: [-20, 30, 0, 0],
  });
  /*TABELA TEMPO 1 FIM*/



/*TABELA PEDAGIO E TEMPO TOTAL*/
  const tableHeaderTempo2 = [
    { text: 'PEDÁGIO', alignment: 'center',  bold: true, border: [] },
    { text: 'TEMPO CONTRIBUIÇÃO', alignment: 'center', border: [] },
    { text: 'TEMPO TOTAL', alignment: 'center', bold: true, border: [] },
  ];

  const colWidthsTempo2 = [171, 171, 171]; // Exemplo de larguras em pontos261

  const resultadoStylePedagio = {
        bold: true,
        fillColor: '#f2f2f2',
        alignment: 'center',
        color: zquesito_pedagio === 'S' ? 'darkgreen' : 'darkred',
  };

  const resultadoStyleContribuicao = {
        bold: true,
        fillColor: '#f2f2f2',
        alignment: 'center',
        color: zquesito_tempo === 'S' ? 'darkgreen' : 'darkred',
    };

 const tableDataTempo2 = [
  [
    { text:  ztempo_pedagio, style: resultadoStylePedagio, border: [] },
    { text:  ztempo_minimo, alignment: 'center', border: [] },
    { text:  ztempo_total, style: resultadoStyleContribuicao, border: [] },
  ]
];

// Adicione a tabela ao conteúdo com as larguras definidas
  content.push({
    table: {
      headerRows: 1,
      widths: colWidthsTempo2,
      body: [tableHeaderTempo2, ...tableDataTempo2],
    },
    fontSize: 10,
    margin: [-20, 30, 0, 0],
  });
  /*TABELA PEDAGIO E TEMPO TOTAL FIM*/






/*TABELA RISCO*/
  const tableHeaderRisco = [
    { text: 'ESTRITAMENTE POLICIAL', alignment: 'center',  bold: true, border: [] },
    { text: 'CUMPRIDO', alignment: 'center', border: [] },
    { text: 'ATIVIDADE RISCO', alignment: 'center', bold: true, border: [] },
  ];

  const colWidthsRisco = [171, 171, 171]; // Exemplo de larguras em pontos261

  const resultadoStyleRisco = {
        bold: true,
        fillColor: '#f2f2f2',
        alignment: 'center',
        color: zquesito_risco === 'S' ? 'darkgreen' : 'darkred',
  };

 const tableDataRisco = [
  [
    { text:  zrisco_minimo+' no mínimo', alignment: 'center', fillColor: '#f2f2f2', border: [] },
    { text:  zrisco_tempo, alignment: 'center', border: [] },
    { text:  zrisco_definicao, style: resultadoStyleRisco, border: [] },
  ]
];

// Adicione a tabela ao conteúdo com as larguras definidas
  content.push({
    table: {
      headerRows: 1,
      widths: colWidthsRisco,
      body: [tableHeaderRisco, ...tableDataRisco],
    },
    fontSize: 10,
    margin: [-20, 30, 0, 0],
  });
  /*TABELA RISCO FIM*/



  let zquesito_final = 'N';
  let zconclusao = '';
  let zconclusao_pedagio = '';
  let zconclusao_idade = '';

  if ((zquesito_idade == 'S') && (zquesito_tempo == 'S') && (zquesito_risco == 'S') && (zquesito_pedagio == 'S')) {

    zquesito_final = 'S';

    if ((zquesito_pedagio == 'S') && (ztempo_pedagio != 'Não Exigido')) {
      zconclusao_pedagio = '(Pedágio Não Exigido), com tempo total de: '+ztempo_total;
    } else {
      zconclusao_pedagio = ' e Pedágio Exigido, com tempo total de: '+ztempo_total;
    }

    if (dataServidor.regra == '59') {
      zconclusao_idade = 'Requisito Idade não aplicável';
    } else {
      if (dataServidor.regra == '1035') {
        zconclusao_idade = 'Requisito Idade dispondo de ' + dataServidor.idade_requisicao + ' anos dos 55 anos exigidos';
      } else {
        if (dataServidor.genero == 'FEMININO') {
          zconclusao_idade = 'Requisito Idade dispondo de ' + dataServidor.idade_requisicao + ' anos dos 52 anos exigidos';
        } else {
          zconclusao_idade = 'Requisito Idade dispondo de ' + dataServidor.idade_requisicao + ' anos dos 55 anos exigidos';
        }
      }
    }

    zconclusao = 'A simulação apresentada nos quadros acima indica que '+zgenero_artigo2+' servidor'+zgenero_artigo+' implementa, salvo melhor juízo, os requisitos de Tempo de Contribuição'+zconclusao_pedagio+'; Tempo na Atividade de Risco de '+zrisco_tempo+'; e '+zconclusao_idade+', enfim, que cumpre todos os requisitos legais necessários e exigidos na '+dataServidor.regra_desc+', a partir de '+dataServidor.dta_requisicao_br+'.';
  } else {
    zconclusao = 'NÃO Implementou o(s) requisito(s).';
  }


  /*TABELA CONCLUSÃO*/
                  const resultadoStyleConclusao = {
                        bold: true,
                        fillColor: '#f2f2f2',
                        alignment: 'center',
                        color: zquesito_final === 'S' ? 'darkgreen' : 'darkred',
                  };

                  const tableHeaderConclusao = [
                    { text: 'CONCLUSÃO', style: resultadoStyleConclusao },
                  ];

                  const colWidthsConclusao = [530]; // Exemplo de larguras em pontos261

                const tableDataConclusao = [
                  [
                    { text:  zconclusao, alignment: 'left', bold: true },
                  ]
                ];

                // Adicione a tabela ao conteúdo com as larguras definidas
                  content.push({
                    table: {
                      headerRows: 1,
                      widths: colWidthsConclusao,
                      body: [tableHeaderConclusao, ...tableDataConclusao],
                    },
                    fontSize: 10,
                    margin: [-20, 50, 0, 0],
                  });
                  /*TABELA CONCLUSÃO*/



  /*PÁGINA 2*/


  // Adicionar quebra de página antes do cabeçalho personalizado
content.push({ text: '', pageBreak: 'before' });

      // Adicionar cabeçalho personalizado
    content.push( {
        canvas: [
          {
            type: 'rect',
            x: -20,
            y: 5,
            w: 542, // Ajuste a largura do retângulo conforme necessário
            h: 18, // Ajuste a altura do retângulo conforme necessário
            color: '#f2f2f2', // Cor de fundo (cinza claro)
          },
        ],
    },
      {
      text: 'DETALHAMENTO DO HISTÓRICO FUNCIONAL',
      alignment: 'center',
      bold: true,
      fontSize: 12,
      margin: [0, 20, 0, 0],
      absolutePosition: { x: 0, y: 47 },
    });


  /*HISTORICO*/
  const tableHeader = [
    { text: 'Histórico', alignment: 'center',  bold: true },
    { text: 'Ocorrência', alignment: 'center', bold: true },
    { text: 'Período', alignment: 'center', bold: true },
    { text: 'Dias', alignment: 'center', bold: true },
  ];

  const colWidths = [190, 190, 80, 45]; // Exemplo de larguras em pontos

 const tableData = dataHistorico.map((historico_array: any) => {
    const resultadoStyle = {
      bold: true,
      color: historico_array.sinal === 1 ? 'darkgreen' : 'darkred',
    };

   const diasSinalFormatado = formatarNumeroMilhar(historico_array.dias_sinal);

    return [
      { text: historico_array.carreira_desc, alignment: 'left', bold: true },
      { text: historico_array.historico_tipo, alignment: 'left', style: resultadoStyle },
      { text: historico_array.dta_label_br, alignment: 'center', style: resultadoStyle },
      { text: diasSinalFormatado, alignment: 'center', style: resultadoStyle },
    ];
  });

// Adicione a tabela ao conteúdo com as larguras definidas
  content.push({
    table: {
      headerRows: 1,
      widths: colWidths,
      body: [tableHeader, ...tableData],
    },
    fontSize: 10,
    margin: [-20, -20, 0, 0],
  });
/*HISTORICO FIM*/



    content.push({
      stack: [
        {
        text: [
          { text: '_______', color: 'white' },
          'Atenciosamente, '
        ],
        lineHeight: 1.3,
        fontSize: 12,
        alignment: 'justify',
        margin: [0, 20, 0, 0],
      },
      {
        text: [
          { text: `${user_nome}`, fontSize: 12, bold: true },
        ],
        lineHeight: 1.3,
        alignment: 'center',
        margin: [0, 30, 0, 0],
      },
      {
        text: [
          { text: 'Seção de Direitos e Deveres', fontSize: 12, bold: true },
        ],
        lineHeight: 1.3,
        alignment: 'center',
        margin: [0, 0, 0, 0],
      },
    ]
    });







  /*PÁGINA 2*/


  // Adicionar quebra de página antes do cabeçalho personalizado
  content.push({ text: '', pageBreak: 'before' });

content.push({
      stack: [
      {
        text: [
          { text: 'VII - TEMPO DE SERVIÇO/CONTRIBUIÇÃO, CONFORME ANEXO 1, QUE INTEGRA ESTE HISTÓRICO FUNCIONAL, ATENDO-SE AOS REQUISITOS ESPECÍFICOS DA REGRA APLICÁVEL AO CASO D'+zgenero_artigo3+' SERVIDOR'+zgenero_artigo4+' QUALIFICAD'+zgenero_artigo3+' ACIMA NA REGRA: '+dataServidor.regra_desc+'.', fontSize: 12, bold: true },
        ],
        lineHeight: 1.3,
        alignment: 'justify',
        margin: [0, 0, 0, 0],
      },
    ]
    });







  const colWidthsTabelaItensTitulos     = [460, 55]; // Exemplo de larguras em pontos
  const colWidthsTabelaItensTitulosSub = [274, 53, 53, 53, 55]; // Exemplo de larguras em pontos


    /**************************************************************************
   * **********************************ITEM 1*******************
   * ************************************************************************/

// Função para criar uma célula personalizada com background color
const createCell = (text: string, alignment: string, bgColor: string, isBold?: boolean, border?: [boolean, boolean, boolean, boolean]) => {
  return {
    text,
    alignment,
    fillColor: bgColor,
    bold: isBold || false,
    border: border || [false, false, false, false], // [top, right, bottom, left]
  };
};

const tableHeaderItem1 = [
  createCell('ITEM 1 - ANÁLISE DO TEMPO GERAL', 'center', '#f2f2f2', true, [true, true, true, true]),
  createCell('Dias', 'center', '#f2f2f2', true, [true, true, true, true]),
];

// Adicione a tabela ao conteúdo com as larguras definidas
content.push({
  table: {
    headerRows: 1,
    widths: colWidthsTabelaItensTitulos,
    body: [tableHeaderItem1],
  },
  fontSize: 10,
  margin: [-20, 10, 0, 0],
});




const tableHeaderSubItem1 = [
  createCell('', 'center', '#fff', true, [true, false, false, false]),
  createCell('ANOS', 'center', '#f2f2f2', true, [true, false, true, true]),
  createCell('MESES', 'center', '#f2f2f2', true, [true, false, true, true]),
  createCell('DIAS', 'center', '#f2f2f2', true, [true, false, true, true]),
  createCell('', 'center', '#fff', true, [false, false, true, false]),
];

// Adicione a tabela ao conteúdo com as larguras definidas
content.push({
  table: {
    headerRows: 1,
    widths: colWidthsTabelaItensTitulosSub,
    body: [tableHeaderSubItem1],
  },
  fontSize: 10,
  margin: [-20, 0, 0, 0],
});




  /*linha 1*/
  const pcgo_resumido = ztempo_pcgo_resumido.split('!');

  const tableItensLinhas1 = [
    createCell('1º - Da posse à '+dataServidor.regra_desc+zregra_data+', exceto averbação e afastamentos(Anexo 1, Quadro 1.1, item 1):', 'justify', '#fff', true, [true, false, true, true]),
    createCell(pcgo_resumido[0], 'center', '#fff', true, [true, false, true, true]),
    createCell(pcgo_resumido[1], 'center', '#fff', true, [true, false, true, true]),
    createCell(pcgo_resumido[2], 'center', '#fff', true, [true, false, true, true]),
    createCell(ztempo_pcgo_total_dias, 'center', '#fff', true, [true, false, true, true]),
  ];

// Adicione a tabela ao conteúdo com as larguras definidas
content.push({
  table: {
    headerRows: 1,
    widths: colWidthsTabelaItensTitulosSub,
    body: [tableItensLinhas1],
  },
  fontSize: 10,
  margin: [-20, 0, 0, 0],
});
  /*linha 1*/


  /*linha 2*/
  const acrescentar_resumido = ztempo_acrescentar_resumo.split('!');
  const tableItensLinhas2 = [
  createCell('2º - Averbações(Anexo 1, Quadro 1.1, item 2):', 'justify', '#fff', true, [true, false, true, true]),
  createCell(acrescentar_resumido[0], 'center', '#fff', true, [true, false, true, true]),
  createCell(acrescentar_resumido[1], 'center', '#fff', true, [true, false, true, true]),
  createCell(acrescentar_resumido[2], 'center', '#fff', true, [true, false, true, true]),
  createCell(ztempo_acrescentar_total_dias, 'center', '#fff', true, [true, false, true, true]),
];

// Adicione a tabela ao conteúdo com as larguras definidas
content.push({
  table: {
    headerRows: 1,
    widths: colWidthsTabelaItensTitulosSub,
    body: [tableItensLinhas2],
  },
  fontSize: 10,
  margin: [-20, 0, 0, 0],
});
/*linha 2*/


  /*linha 3*/
  const deduzir_resumido = ztempo_deduzir_resumo.split('!');

 const tableItensLinhas3 = [
  createCell('3º - Afastamentos não remunerados(Anexo 1, Quadro 1.1, item 3):', 'justify', '#fff', true, [true, false, true, true]),
  createCell(deduzir_resumido[0], 'center', '#fff', true, [true, false, true, true]),
  createCell(deduzir_resumido[1], 'center', '#fff', true, [true, false, true, true]),
  createCell(deduzir_resumido[2], 'center', '#fff', true, [true, false, true, true]),
  createCell(ztempo_deduzir_total_dias, 'center', '#fff', true, [true, false, true, true]),
];

// Adicione a tabela ao conteúdo com as larguras definidas
content.push({
  table: {
    headerRows: 1,
    widths: colWidthsTabelaItensTitulosSub,
    body: [tableItensLinhas3],
  },
  fontSize: 10,
  margin: [-20, 0, 0, 0],
});
/*linha 3*/


  /*linha 4*/
  const pcgo_liquido_resumido = ztempo_pcgo_liquido_resumo.split('!');



 const tableItensLinhas4 = [
  createCell('4º - Da posse à '+dataServidor.regra_desc+zregra_data+', Mais averbações e afastamentos(Anexo 1, Quadro 1.1, item 4):', 'justify', '#fff', true, [true, false, true, true]),
  createCell(pcgo_liquido_resumido[0], 'center', '#fff', true, [true, false, true, true]),
  createCell(pcgo_liquido_resumido[1], 'center', '#fff', true, [true, false, true, true]),
  createCell(pcgo_liquido_resumido[2], 'center', '#fff', true, [true, false, true, true]),
  createCell(ztempo_pcgo_total_dias_liquido, 'center', '#fff', true, [true, false, true, true]),
];

// Adicione a tabela ao conteúdo com as larguras definidas
content.push({
  table: {
    headerRows: 1,
    widths: colWidthsTabelaItensTitulosSub,
    body: [tableItensLinhas4],
  },
  fontSize: 10,
  margin: [-20, 0, 0, 0],
});
/*linha 4*/


    /**************************************************************************
   * **********************************ITEM 1.1*******************
   * ************************************************************************/


      const tableHeaderItem11 = [
        createCell('ITEM 1.1 - ANÁLISE DO PEDÁGIO', 'center', '#f2f2f2', true, [true, false, true, true]),
        createCell('Dias', 'center', '#f2f2f2', true, [true, false, true, true]),
      ];

      // Adicione a tabela ao conteúdo com as larguras definidas
      content.push({
        table: {
          headerRows: 1,
          widths: colWidthsTabelaItensTitulos,
          body: [tableHeaderItem11],
        },
        fontSize: 10,
        margin: [-20, 0, 0, 0],
      });



    if (dataServidor.regra != '10353') {

      const tableHeaderItem11 = [
        createCell(dataServidor.regra_desc+' Não Exige Pedágio.', 'center', '#fff', true, [true, false, false, true]),
        createCell('', 'center', '#fff', true, [false, false, true, true]),
      ];

      // Adicione a tabela ao conteúdo com as larguras definidas
      content.push({
        table: {
          headerRows: 1,
          widths: colWidthsTabelaItensTitulos,
          body: [tableHeaderItem11],
        },
        fontSize: 10,
        margin: [-20, 0, 0, 0],
      });

    } else {

      const tableHeaderSubItem11 = [
        createCell('', 'center', '#fff', true, [true, false, false, false]),
        createCell('ANOS', 'center', '#f2f2f2', true, [true, false, true, true]),
        createCell('MESES', 'center', '#f2f2f2', true, [true, false, true, true]),
        createCell('DIAS', 'center', '#f2f2f2', true, [true, false, true, true]),
        createCell('', 'center', '#fff', true, [false, false, true, false]),
      ];

      // Adicione a tabela ao conteúdo com as larguras definidas
      content.push({
        table: {
          headerRows: 1,
          widths: colWidthsTabelaItensTitulosSub,
          body: [tableHeaderSubItem11],
        },
        fontSize: 10,
        margin: [-20, 0, 0, 0],
      });


        /*linha 1*/
      const pedagio_resumido = ztempo_pedagio_resumo.split('!');

      const tableItens11Linhas1 = [
        createCell('1º - Tempo que faltava para completar '+dataServidor.regra_desc+zregra_data+', exceto averbação e afastamentos(Anexo 1, Quadro 1.1, item 1):', 'justify', '#fff', true, [true, false, true, true]),
        createCell(pedagio_resumido[0], 'center', '#fff', true, [true, false, true, true]),
        createCell(pedagio_resumido[1], 'center', '#fff', true, [true, false, true, true]),
        createCell(pedagio_resumido[2], 'center', '#fff', true, [true, false, true, true]),
        createCell(ztempo_pedagio_total_dias, 'center', '#fff', true, [true, false, true, true]),
      ];

      // Adicione a tabela ao conteúdo com as larguras definidas
      content.push({
        table: {
          headerRows: 1,
          widths: colWidthsTabelaItensTitulosSub,
          body: [tableItens11Linhas1],
        },
        fontSize: 10,
        margin: [-20, 0, 0, 0],
      });
  /*linha 1*/

    }










    /**************************************************************************
   * **********************************ITEM 1.2*******************
   * ************************************************************************/
      const tableHeaderItem12 = [
        createCell('ITEM 1.2 - ANÁLISE DO TEMPO GERAL + PEDÁGIO', 'center', '#f2f2f2', true, [true, false, true, true]),
        createCell('Dias', 'center', '#f2f2f2', true, [true, false, true, true]),
      ];

      // Adicione a tabela ao conteúdo com as larguras definidas
      content.push({
        table: {
          headerRows: 1,
          widths: colWidthsTabelaItensTitulos,
          body: [tableHeaderItem12],
        },
        fontSize: 10,
        margin: [-20, 0, 0, 0],
      });


  if (dataServidor.regra != '10353') {
    const tableHeaderItem11 = [
      createCell(dataServidor.regra_desc + ' Não Exige Pedágio.', 'center', '#fff', true, [true, false, false, true]),
      createCell('', 'center', '#fff', true, [false, false, true, true]),
    ];

    // Adicione a tabela ao conteúdo com as larguras definidas
    content.push({
      table: {
        headerRows: 1,
        widths: colWidthsTabelaItensTitulos,
        body: [tableHeaderItem11],
      },
      fontSize: 10,
      margin: [-20, 0, 0, 0],
    });

  } else {
    const tableHeaderSubItem12 = [
      createCell('', 'center', '#fff', true, [true, false, false, false]),
      createCell('ANOS', 'center', '#f2f2f2', true, [true, false, true, true]),
      createCell('MESES', 'center', '#f2f2f2', true, [true, false, true, true]),
      createCell('DIAS', 'center', '#f2f2f2', true, [true, false, true, true]),
      createCell('', 'center', '#fff', true, [false, false, true, false]),
    ];

    // Adicione a tabela ao conteúdo com as larguras definidas
    content.push({
      table: {
        headerRows: 1,
        widths: colWidthsTabelaItensTitulosSub,
        body: [tableHeaderSubItem12],
      },
      fontSize: 10,
      margin: [-20, 0, 0, 0],
    });
  }

    /**************************************************************************
   * **********************************ITEM 2*******************
   * ************************************************************************/
      const tableHeaderItem2 = [
        createCell('ITEM 2 - TEMPO NA ATIVIDADE DE RISCO/ESTRITAMENTE POLICIAL. '+zrisco_minimo+' no mínimo.', 'center', '#f2f2f2', true, [true, false, true, true]),
        createCell('Dias', 'center', '#f2f2f2', true, [true, false, true, true]),
      ];

      // Adicione a tabela ao conteúdo com as larguras definidas
      content.push({
        table: {
          headerRows: 1,
          widths: colWidthsTabelaItensTitulos,
          body: [tableHeaderItem2],
        },
        fontSize: 10,
        margin: [-20, 0, 0, 0],
      });




      const tableHeaderSubItem2 = [
        createCell('', 'center', '#fff', true, [true, false, false, false]),
        createCell('ANOS', 'center', '#f2f2f2', true, [true, false, true, true]),
        createCell('MESES', 'center', '#f2f2f2', true, [true, false, true, true]),
        createCell('DIAS', 'center', '#f2f2f2', true, [true, false, true, true]),
        createCell('', 'center', '#fff', true, [false, false, true, false]),
      ];

      // Adicione a tabela ao conteúdo com as larguras definidas
      content.push({
        table: {
          headerRows: 1,
          widths: colWidthsTabelaItensTitulosSub,
          body: [tableHeaderSubItem2],
        },
        fontSize: 10,
        margin: [-20, 0, 0, 0],
      });



    /*linha 1*/
      const risco_resumido = zrisco_tempo_resumo.split('!');

      const tableItens2Linhas1 = [
        createCell('1º - Da posse ao Histórico Funcional, exeto averbações e afastamentos. (Anexo 1, qadro 2.1, Item 1):', 'justify', '#fff', true, [true, false, true, true]),
        createCell(risco_resumido[0], 'center', '#fff', true, [true, false, true, true]),
        createCell(risco_resumido[1], 'center', '#fff', true, [true, false, true, true]),
        createCell(risco_resumido[2], 'center', '#fff', true, [true, false, true, true]),
        createCell(zrisco_total_dias, 'center', '#fff', true, [true, false, true, true]),
      ];

    // Adicione a tabela ao conteúdo com as larguras definidas
    content.push({
      table: {
        headerRows: 1,
        widths: colWidthsTabelaItensTitulosSub,
        body: [tableItens2Linhas1],
      },
      fontSize: 10,
      margin: [-20, 0, 0, 0],
    });
      /*linha 1*/



    /**************************************************************************
   * **********************************ITEM 3*******************
   * ************************************************************************/
      const tableHeaderItem3 = [
        createCell('ITEM 3 - DATAS DE INTEGRALIZAÇÃO DOS REQUISITOS', 'center', '#f2f2f2', true, [true, false, true, true]),
        createCell('Dias', 'center', '#f2f2f2', true, [true, false, true, true]),
      ];

      // Adicione a tabela ao conteúdo com as larguras definidas
      content.push({
        table: {
          headerRows: 1,
          widths: colWidthsTabelaItensTitulos,
          body: [tableHeaderItem3],
        },
        fontSize: 10,
        margin: [-20, 0, 0, 0],
      });




      const tableHeaderSubItem3 = [
        createCell('', 'center', '#fff', true, [true, false, false, false]),
        createCell('ANOS', 'center', '#f2f2f2', true, [true, false, true, true]),
        createCell('MESES', 'center', '#f2f2f2', true, [true, false, true, true]),
        createCell('DIAS', 'center', '#f2f2f2', true, [true, false, true, true]),
        createCell('', 'center', '#fff', true, [false, false, true, false]),
      ];

      // Adicione a tabela ao conteúdo com as larguras definidas
      content.push({
        table: {
          headerRows: 1,
          widths: colWidthsTabelaItensTitulosSub,
          body: [tableHeaderSubItem3],
        },
        fontSize: 10,
        margin: [-20, 0, 0, 0],
      });

      /**************************************************************************
   * **********************************FIM ITENS*******************
   * ************************************************************************/


  const nomeSemAcentos = 'OI';
  //const nomeSemEspacos = substituirEspacosPorUnderscores(dataServidor.nome_identificado);
  //const nomeSemAcentos = removerAcentos(nomeSemEspacos);

  //Create document definition
  const documentDefinition = {
  content,
  footer: function (currentPage: number, pageCount: number) {
    return footer(currentPage, pageCount);
  },
  filename: `anexo_aposentadoria_${dataServidor.cpf}.pdf`,
};


  // Generate PDF and open in new window
  pdfMake.createPdf(documentDefinition).open();
};
//mudar para o print()

export { generatePDF };

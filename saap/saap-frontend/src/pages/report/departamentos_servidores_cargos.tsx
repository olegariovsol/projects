import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content } from 'pdfmake/interfaces';
import moment from 'moment-timezone';
import {
  logoPcBase64,
  logoSspBase64,
  logoICBase64,
  legendaBase64,
} from '../Image';
//import { fetchStates } from '../Services/Axios/serverServices';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

function substituirEspacosPorUnderscores(texto: string) {
  return texto.replace(/ /g, '_');
}
function removerAcentos(texto: string) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function formatarRGCivil(rgCivil: string) {
  // Converte para string e remove possíveis pontos existentes
  const rgSemPontos = String(rgCivil).replace(/\./g, '');
  // Aplica a formatação com pontos a cada 3 caracteres, da direita para a esquerda
  return rgSemPontos.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}

const generatePDF_DepartamentosServidoresCargos = async (
  titulo_relatorio: any,
  dataGrupos: any,
  dataDepartamentos: any,
  dataServidores: any,
  unidade_trabalho: any,
  user_nome: any,
  user_cpf: any,
) => {
  const content: Content[] = [];
  const dateHoraAtual = moment
    .parseZone(new Date())
    .local(true)
    .format('DD/MM/YYYY HH:mm');

  console.log('report :', unidade_trabalho);
  //console.log('nome_entrada: ', dataIdentificacao.nome_entrada);

  const footer = function (currentPage: number, pageCount: number): Content[] {
    return [
      {
        columns: [
          {
            text: `Impresso por: ${user_nome}\nem: ${dateHoraAtual}`,
            fontSize: 8,
            alignment: 'left',
            italics: true,
            margin: [20, 5, 0, 0],
          },
          {
            text: `Recebido em ____/____/____ por: ____________________________ Página ${currentPage} de ${pageCount}`,
            fontSize: 8,
            alignment: 'right',
            italics: true,
            margin: [0, 10, 20, 0],
          },
        ],
      },
    ];
  };

  let watermarkContent: Content = {
    text: '',
  };
  /*
  if (dataIdentificacao.status !== 'FINALIZADA') {
    watermarkContent = {
      canvas: [
        {
          type: 'rect',
          x: 0,
          y: 0,
          w: 600,
          h: 800,
          r: 0,
          opacity: 0.3,
          color: 'red',
        },
      ] as any,
      text: ['Laudo em andamento', 'Documento sem valor'].join('\n'),
      fontSize: 60,
      color: 'lightgray',
      alignment: 'center',
      margin: [0, 300, 0, 0],
    };
  }

  let pais = '';
  let sexo = 'o';
  let sexoMauisculo = 'O';
  let nascido = '';

  if (dataIdentificacao.genero == 'FEMININO') {
    sexo = 'a';
    sexoMauisculo = 'A';
  }

  if (dataIdentificacao.nome_mae != '' || dataIdentificacao.nome_pai != '') {
    if (dataIdentificacao.nome_mae != '' && dataIdentificacao.nome_pai != '') {
      pais =
        ', filh' +
        sexo +
        ' de ' +
        dataIdentificacao.nome_mae +
        ' e ' +
        dataIdentificacao.nome_pai;
    } else {
      if (dataIdentificacao.nome_mae != '') {
        pais = ', filh' + sexo + ' de ' + dataIdentificacao.nome_mae;
      }
      if (dataIdentificacao.nome_pai != '') {
        pais = ', filh' + sexo + ' de ' + dataIdentificacao.nome_pai;
      }
    }
  }

  if (
    dataIdentificacao.dta_nascimento_br != '' &&
    dataIdentificacao.naturalidade != ''
  ) {
    nascido =
      ', nascid' +
      sexo +
      ' em ' +
      dataIdentificacao.dta_nascimento_br +
      ', natural de ' +
      dataIdentificacao.naturalidade;
  } else {
    if (dataIdentificacao.dta_nascimento_br != '') {
      nascido =
        ', nascid' + sexo + ' em ' + dataIdentificacao.dta_nascimento_br;
    }
    if (dataIdentificacao.naturalidade != '') {
      nascido = ', natural de ' + dataIdentificacao.naturalidade;
    }
  }

  let cpf = '';
  if (dataIdentificacao.cpf.length == 11) {
    cpf =
      dataIdentificacao.cpf.substr(0, 3) +
      '.' +
      dataIdentificacao.cpf.substr(3, 3) +
      '.' +
      dataIdentificacao.cpf.substr(6, 3) +
      '-' +
      dataIdentificacao.cpf.substr(9, 2);
  }

  let xandamentoLabel = 'RELATÓRIO DE VERIFICAÇÃO DE IDENTIDADE';

  if (dataIdentificacao.laudo_tipo === 'IC') {
    xandamentoLabel = 'RELATÓRIO DE IDENTIFICAÇÃO CRIMINAL';
  }
  if (dataIdentificacao.status !== 'FINALIZADA') {
    xandamentoLabel = 'IMPRESSÃO DE TESTE(Sem validade)';
  }

  let rgCivilFormatado = dataIdentificacao.rg_civil;
  let rgCivilFormatadoNr = 'nº';
  if (rgCivilFormatado !== null) {
    if (dataIdentificacao.rg_civil_local === 'GOIAS') {
      rgCivilFormatado = formatarRGCivil(dataIdentificacao.rg_civil);
    }
  } else {
    rgCivilFormatado = '';
    rgCivilFormatadoNr = 'de';
  }
*/
  content.push({
    stack: [
      {
        image: logoSspBase64,
        width: 64,
        margin: [-40, -40, 0, 0], //esquerda, superior, inferior, direita ?
      },
      {
        image: logoPcBase64,
        width: 48,
        alignment: 'right',
        margin: [-30, -60, 0, 0], //superior, direita, inferior, esquerda
      },
      {
        text: 'Secretaria de Estado da Segurança Pública',
        fontSize: 14,
        bold: true,
        alignment: 'center',
        margin: [0, -60, 0, 10],
      },
      {
        text: `Polícia Civil do Estado de Goiás`,
        fontSize: 12,
        bold: true,
        alignment: 'center',
        margin: [0, -5, 0, 10],
      },
      {
        text: `${unidade_trabalho}`,
        fontSize: 12,
        bold: true,
        alignment: 'center',
        margin: [0, -5, 0, 10],
      },
      /*{
        text: 'ESTADO DE GOIÁS',
        fontSize: 14,
        bold: true,
        alignment: 'center',
        margin: [0, -70, 0, 10],
      },
      {
        text: 'Secretaria de Estado da Segurança Pública',
        fontSize: 14,
        bold: true,
        alignment: 'center',
        margin: [0, -5, 0, 10],
      },
      {
        text: 'Polícia Civil',
        fontSize: 14,
        bold: true,
        alignment: 'center',
        margin: [0, -5, 0, 10],
      },
      {
        text: 'Gerência de Identificação',
        fontSize: 14,
        bold: true,
        alignment: 'center',
        margin: [0, -5, 0, 10],
      },
      {
        text: `${dataIdentificacao.ic_nome}`,
        fontSize: 12,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10],
      },*/
      {
        text: `${titulo_relatorio}`,
        fontSize: 13,
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 10],
      },
      // { text: `${dataIdentificacao.rel_dta_inicio_br}`, fontSize: 10, alignment: 'right' },
      /*{
        // Texto "RELATÓRIO DE VERIFICAÇÃO DE IDENTIDADE" com linha sublinhada abaixo
        stack: [
          {
            text: xandamentoLabel,
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
      },*/
      /* {
        text: [{ text: '_______', fontSize: 12, color: 'white' },
          'Senhor(a) Delegado(a)',
        ],
        fontSize: 12,
        bold: true,
        alignment: 'left',
        margin: [0, 20, 0, 0],
      },*/
      /*{
        text: [
          { text: '_______', fontSize: 12, color: 'white' },
          'Em atenção a Requisição via sistema GIC ',
          {
            text: `${dataIdentificacao.rel_dta_solicitacao_br}`,
            fontSize: 12,
            bold: true,
          },
          ' oriunda da ',
          { text: `${dataIdentificacao.dp_nome},`, fontSize: 12, bold: true },
          ' encaminhado a essa seção de identificação criminal, informamos que foi realizada a coleta das impressões digitais e dos dados qualificativos ',
          {
            text:
              dataIdentificacao.genero === 'FEMININO'
                ? 'da conduzida'
                : 'do conduzido',
            fontSize: 12,
          },
          ' de suposto nome ',
          {
            text: `${dataIdentificacao.nome_entrada},`,
            fontSize: 13,
            bold: true,
          },
          'e posteriormente pesquisado nos seguintes sistemas e endereços eletrônicos: ',
        ],
        lineHeight: 1.3,
        fontSize: 12,
        alignment: 'justify',
        margin: [0, 20, 0, 0],
      },*/

      /*
fim push stack
*/
    ],
  });

  /*SISTEMAS PESQUISADOS*/
  const tableHeader = [
    { text: 'Departamento', alignment: 'center', bold: true },
    { text: 'Servidor', alignment: 'center', bold: true },
    { text: 'Cargo', alignment: 'center', bold: true },
  ];

  const colWidths = [200, 200, 90]; // Exemplo de larguras em pontos

  const tableData = dataServidores.map((servidor_cursor: any) => {
    const resultadoStyle = {
      bold: false,
      color: servidor_cursor.funcao.includes('DELEGAD')
        ? 'darkblue'
        : servidor_cursor.funcao.includes('ESCRIV')
        ? 'darkgreen'
        : 'black',
    };

    return [
      { text: servidor_cursor.lotacao, alignment: 'left', bold: false },
      {
        text: servidor_cursor.nome,
        alignment: 'left',
        style: resultadoStyle,
      },
      { text: servidor_cursor.cargo, alignment: 'left' },
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
    margin: [0, 10, 0, 0],
  });

  /*

  if (dataIdentificacao.rg_civil_local == 'GOIAS') {
    content.push({
      stack: [
        {
          text: [
            { text: '_______', fontSize: 12, color: 'white' },
            'Realizada pesquisa nominal e por impressões digitais nos arquivos civis deste Instituto de Identificação, foi localizado cadastro para ',
            {
              text: `${dataIdentificacao.nome_identificado}, RG Civil nº ${rgCivilFormatado} ${dataIdentificacao.rg_civil_orgao},`,
              fontSize: 12,
              bold: true,
            },
            ' cujas impressões digitais relacionadas ',
            { text: 'são coincidentes', fontSize: 12, bold: true },
            ' com as colhidas d' +
              sexo +
              ' conduzid' +
              sexo +
              ', conforme prontuário de identificação civil em anexo.',
          ],
          lineHeight: 1.3,
          fontSize: 12,
          alignment: 'justify',
          margin: [0, 20, 0, 0],
        },
      ],
    });
  }
  if (dataIdentificacao.rg_civil_local == 'OUTRO') {
    const rgCivilOrgaoText =
      dataIdentificacao.rg_civil_orgao !== null
        ? `${dataIdentificacao.rg_civil_orgao}`
        : '';

    content.push({
      stack: [
        {
          text: [
            { text: '_______', fontSize: 12, color: 'white' },
            {
              text: 'Realizada pesquisa nominal e por impressões digitais nos arquivos civis deste Instituto de Identificação, ',
            },
            { text: 'NÃO', fontSize: 12, bold: true },
            { text: ' foi localizado cadastro para ' },
            {
              text: `${dataIdentificacao.nome_identificado}`,
              fontSize: 12,
              bold: true,
            },
            {
              text: `${
                pais + nascido
              }, conforme dados informados pel${sexo} própri${sexo} conduzid${sexo}, o que impossibilitou a confirmação da sua identidade civil. ${sexoMauisculo} conduzid${sexo} relata ter `,
              fontSize: 12,
            },
            {
              text: `RG Civil ${
                rgCivilFormatadoNr + ' ' + rgCivilFormatado
              } ${rgCivilOrgaoText}.`,
              fontSize: 12,
              bold: true,
            },
          ],
          lineHeight: 1.3,
          fontSize: 12,
          alignment: 'justify',
          margin: [0, 20, 0, 0],
        },
      ],
    });
  }
  if (dataIdentificacao.rg_civil_local == 'NAO') {
    content.push({
      stack: [
        {
          text: [
            { text: '_______', fontSize: 12, color: 'white' },
            {
              text: 'Realizada pesquisa nominal e por impressões digitais nos arquivos civis deste Instituto de Identificação, ',
            },
            { text: 'NÃO', fontSize: 12, bold: true },
            { text: ' foi localizado cadastro para ' },
            {
              text: `${dataIdentificacao.nome_identificado}`,
              fontSize: 12,
              bold: true,
            },
            {
              text: `${
                pais + nascido
              }, conforme dados informados pel${sexo} própri${sexo} conduzid${sexo}, o que impossibilitou a confirmação da sua identidade civil. `,
              fontSize: 12,
            },
            {
              text: `${sexoMauisculo} conduzid${sexo} relata nunca ter feito RG Civil.`,
              fontSize: 12,
              bold: true,
            },
          ],
          lineHeight: 1.3,
          fontSize: 12,
          alignment: 'justify',
          margin: [0, 20, 0, 0],
        },
      ],
    });
  }
  if (dataIdentificacao.rg_civil_local == 'PASSAGEM') {
    content.push({
      stack: [
        {
          text: [
            { text: '_______', fontSize: 12, color: 'white' },
            {
              text: 'Realizada pesquisa nominal e por impressões digitais nos arquivos civis deste Instituto de Identificação, ',
            },
            { text: 'NÃO', fontSize: 12, bold: true },
            { text: ' foi localizado cadastro para ' },
            {
              text: `${dataIdentificacao.nome_entrada}`,
              fontSize: 12,
              bold: true,
            },
            {
              text: `${
                pais + nascido
              }, conforme dados informados pel${sexo} própri${sexo} conduzid${sexo}, o que impossibilitou a confirmação da sua identidade civil. `,
              fontSize: 12,
            },
            { text: 'Porém', fontSize: 12, bold: true },
            {
              text: ` em pesquisa no arquivo de prontuários de outros Estados da ${dataIdentificacao.ic_nome}, foi localizado cadastro para `,
              fontSize: 12,
            },
            {
              text: `${dataIdentificacao.nome_identificado}, RG Civil nº ${rgCivilFormatado} ${dataIdentificacao.rg_civil_orgao}`,
              fontSize: 12,
              bold: true,
            },
            {
              text: ` cujas impressões digitais relacionadas são coincidentes com as colhidas d${sexo} conduzid${sexo}, conforme Ficha de Dados Cadastrais em anexo.`,
              fontSize: 12,
            },
          ],
          lineHeight: 1.3,
          fontSize: 12,
          alignment: 'justify',
          margin: [0, 20, 0, 0],
        },
      ],
    });
  }

  if (dataIdentificacao.menor_desc === 'Não') {
    // Após o comentário "Sistema de Identificação Criminal GO"
    const sistemaRGCriminal = dataSistemas.find(
      (sistema: any) => sistema.sistema_id === 7,
    );

    if (sistemaRGCriminal) {
      const rgCriminalFormatado = formatarRGCivil(
        sistemaRGCriminal.resultado_desc,
      );

      if (sistemaRGCriminal.resultado_desc !== null) {
        content.push({
          stack: [
            {
              text: [
                { text: '_______', fontSize: 12, color: 'white' },
                'Realizada pesquisa nominal e por impressões digitais nos arquivos criminais deste Instituto de Identificação, foi localizado ',
                {
                  text: `RG CRIMINAL n° ${rgCriminalFormatado}`,
                  fontSize: 12,
                  bold: true,
                },
                '(Folha de Antecedentes Criminais em anexo).',
              ],
              lineHeight: 1.3,
              fontSize: 12,
              alignment: 'justify',
              margin: [0, 20, 0, 0],
            },
          ],
        });
      } else {
        content.push({
          stack: [
            {
              text: [
                { text: '_______', fontSize: 12, color: 'white' },
                'Realizada pesquisa nominal e por impressões digitais nos arquivos criminais do Instituto de Identificação de Goiás, ',
                { text: `NADA `, fontSize: 12, bold: true },
                'foi localizado.',
              ],
              lineHeight: 1.3,
              fontSize: 12,
              alignment: 'justify',
              margin: [0, 20, 0, 0],
            },
          ],
        });
      }
    }
  }

  const sistemaMportalGoiasPen = dataSistemas.find(
    (sistema: any) => sistema.sistema_id === 4,
  );
  if (sistemaMportalGoiasPen) {
    if (sistemaMportalGoiasPen.resultado == 'ENCONTRADO') {
      content.push({
        stack: [
          {
            text: [
              { text: '_______', fontSize: 12, color: 'white' },
              {
                text: `Realizada consulta nominal na rede estadual foi localizado cadastro no sistema GOIASPEN para ${sexo} conduzid${sexo} na situação `,
                fontSize: 12,
              },
              { text: `FORAGIDO/ABANDONO`, fontSize: 12, bold: true },
            ],
            lineHeight: 1.3,
            fontSize: 12,
            alignment: 'justify',
            margin: [0, 20, 0, 0],
          },
        ],
      });
    }
  }

  const sistemaInfoseg = dataSistemas.find(
    (sistema: any) => sistema.sistema_id === 1,
  );
  if (sistemaInfoseg) {
    if (sistemaInfoseg.resultado == 'ENCONTRADO') {
      content.push({
        stack: [
          {
            text: [
              { text: '_______', fontSize: 12, color: 'white' },
              {
                text: `Realizada consulta nominal na rede nacional INFOSEG foi localizado o`,
                fontSize: 12,
              },
              { text: `CPF nº ${cpf} `, fontSize: 12, bold: true },
              {
                text: `com dados biográficos compatíveis com os informados pel${sexo} conduzid${sexo}.`,
                fontSize: 12,
              },
            ],
            lineHeight: 1.3,
            fontSize: 12,
            alignment: 'justify',
            margin: [0, 20, 0, 0],
          },
        ],
      });
    }
  }

  const sistemaBNMP = dataSistemas.find(
    (sistema: any) => sistema.sistema_id === 5,
  );
  if (sistemaBNMP) {
    if (sistemaBNMP.resultado == 'ENCONTRADO') {
      content.push({
        stack: [
          {
            text: [
              { text: '_______', fontSize: 12, color: 'white' },
              {
                text: `Realizada consulta nominal junto ao Banco Nacional de Mandado de Prisão, foi constatada a existência de `,
                fontSize: 12,
              },
              {
                text: `mandado de prisão nº ${sistemaBNMP.resultado_desc} `,
                fontSize: 12,
                bold: true,
              },
              {
                text: `em nome d${sexo} conduzid${sexo}, na situação `,
                fontSize: 12,
              },
              { text: `PENDENTE DE CUMPRIMENTO.`, fontSize: 12, bold: true },
            ],
            lineHeight: 1.3,
            fontSize: 12,
            alignment: 'justify',
            margin: [0, 20, 0, 0],
          },
        ],
      });
    }
  }

  if (dataIdentificacao.rg_civil_local == 'OUTRO') {
    content.push({
      stack: [
        {
          text: [
            { text: '_______', fontSize: 12, color: 'white' },
            {
              text: `Esse caso será encaminhado ao expediente dessa seção, para que seja realizada busca junto ao Instituto de Identificação do Estado em que ${sexo} conduzid${sexo} tenha RG, e será confeccionado relatório complementar atualizando as informações desse documento.`,
            },
          ],
          lineHeight: 1.3,
          fontSize: 12,
          alignment: 'justify',
          margin: [0, 20, 0, 0],
        },
      ],
    });
  }

  if (dataIdentificacao.laudo_tipo != 'IC') {
    content.push({
      stack: [
        {
          text: [
            { text: '_______', fontSize: 12, color: 'white' },
            'Este relatório ',
            { text: 'não', fontSize: 13, bold: true },
            ' substitui a Identificação Criminal.',
          ],
          lineHeight: 1.3,
          fontSize: 12,
          alignment: 'justify',
          margin: [0, 20, 0, 0],
        },
      ],
    });
  }

  if (dataIdentificacao.menor_desc == 'Sim') {
    content.push({
      stack: [
        {
          text: [
            { text: '_______', fontSize: 12, color: 'white' },
            {
              text: `Informamos que não foi realizada a identificação criminal uma vez que ${sexo} conduzid${sexo} não atingiu maioridade penal.`,
            },
          ],
          lineHeight: 1.3,
          fontSize: 12,
          alignment: 'justify',
          margin: [0, 20, 0, 0],
        },
      ],
    });
  } else {
    if (
      dataIdentificacao.procedimento == 3 ||
      dataIdentificacao.procedimento == 5 ||
      dataIdentificacao.procedimento == 8 ||
      dataIdentificacao.procedimento == 7 ||
      dataIdentificacao.procedimento == 12 ||
      dataIdentificacao.procedimento == 6
    ) {
      content.push({
        stack: [
          {
            text: [
              { text: '_______', fontSize: 12, color: 'white' },
              {
                text: `Informamos que o procedimento de identificação criminal foi realizado e será encaminhado ao Instituto de Identificação para inserção no Banco de Dados Criminal da Polícia Civil, o Goiás Biométrico.`,
              },
            ],
            lineHeight: 1.3,
            fontSize: 12,
            alignment: 'justify',
            margin: [0, 20, 0, 0],
          },
        ],
      });
    }
  }

  if (dataIdentificacao.mentiu_dados == true) {
    content.push({
      stack: [
        {
          text: [
            { text: '_______', fontSize: 12, color: 'white' },
            { text: `Informamos ainda que ${sexo} conduzid${sexo} acima ` },
            {
              text: `DISSE SER:  ${dataIdentificacao.nome_entrada}`,
              fontSize: 12,
              bold: true,
            },
            {
              text: `, mas após confronto das impressões digitais ficou comprovado não ser verdade.`,
            },
          ],
          lineHeight: 1.3,
          fontSize: 12,
          alignment: 'justify',
          margin: [0, 20, 0, 0],
        },
      ],
    });
  }

  if (dataIdentificacao.obs?.length > 3) {
    content.push({
      stack: [
        {
          text: [
            { text: '_______', fontSize: 12, color: 'white' },
            { text: `${dataIdentificacao.obs}`, fontSize: 12, bold: true },
          ],
          lineHeight: 1.3,
          fontSize: 12,
          alignment: 'justify',
          margin: [0, 20, 0, 0],
        },
      ],
    });
  }

  {
    /*
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
      }
    ]
  });

*/
  /* }*/

  // ...

  // Split na string de assinaturas
  /* const assinaturasArray = dataIdentificacao.assinaturas.split('!');

  // Mapeia as assinaturas e cria um array com os objetos necessários para cada linha
  const assinaturasRows = assinaturasArray.map((assinatura: string) => [
    {
      text:
        'Documento assinado eletronicamente por ' +
        assinatura +
        ' e autenticação via Aplicativo.',
      alignment: 'justify',
      bold: true,
      fillColor: '#f2f2f2',
    },
  ]);
  */
  // Adicione a tabela ao conteúdo com as larguras definidas
  content.push({
    stack: [
      {
        image: legendaBase64,
        width: 50,
        margin: [-25, -25, 0, 0], //ESQUERDA, SUPERIOR Ajuste o margin conforme necessário para o alinhamento desejado
      },
    ],
  });
  /*
  // Adicione a tabela de assinaturas após a imagem da legenda
  content.push({
    table: {
      headerRows: 1,
      widths: [475], // Coloque a largura desejada para a coluna
      body: [...assinaturasRows],
    },
    fontSize: 8,
    margin: [30, -70, 0, 0],
  });

  const nomeSemEspacos = substituirEspacosPorUnderscores(
    dataIdentificacao.nome_identificado,
  );
  const nomeSemAcentos = removerAcentos(nomeSemEspacos);*/

  //Create document definition
  const documentDefinition = {
    content,
    background: [watermarkContent],
    footer: function (currentPage: number, pageCount: number) {
      return footer(currentPage, pageCount);
    },
    filename: `${titulo_relatorio}.pdf`,
  };

  // Generate PDF and open in new window
  pdfMake.createPdf(documentDefinition).open();
};
//mudar para o print()

export { generatePDF_DepartamentosServidoresCargos };

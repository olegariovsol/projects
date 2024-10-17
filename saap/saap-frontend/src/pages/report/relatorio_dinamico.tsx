import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, TableCell } from 'pdfmake/interfaces';
import moment from 'moment-timezone';
import {
  logoPcBase64,
  logoSspBase64,
  logoICBase64,
  legendaBase64,
} from '../Image';
import { backgroundClip } from 'html2canvas/dist/types/css/property-descriptors/background-clip';
//import { fetchStates } from '../Services/Axios/serverServices';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  children?: DataTypeTreeDepartamento[];
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
  dep_municipioid: number;
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
  classificacao: string;
  classificacao_desc: string;
}

interface ServidoresDepartamento {
  lotacao: string;
  lotacao_id: number;
  dep_hierarquia_pai: string;
  dep_hierarquia: string;
  dep_tipo: string;
  dep_especializacao: string;
  dep_municipio: string;
  dep_municipioid: number;
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
  classificacao: string;
  classificacao_desc: string;
}

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

const generatePdfDinamico = async (
  orientacao_relatorio: any,
  titulo_relatorio: any,
  modelo_relatorio: any,
  colunas_dinamicas_relatorio: string[],
  contador_linhas: any,
  totalizar: any,
  agrupar_departamento: any,
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

  // Verifica se o primeiro elemento do array é ''
  function primeiroElementoVazio(array: any) {
    return array.length > 0 && array[0] === '';
  }

  //TRATAMENTO PARA QUE O CONTADOR DE LINHAS FUNCIONE COM AS COLUNAS DINAMICAS
  // Função para ajustar o array de colunas dinâmicas com base no contador_linhas
  function ajustarArrayColunas(
    contador_linhas: any,
    colunas_dinamicas_relatorio: any,
  ) {
    // Verifica se o contador_linhas é SIM e o primeiro elemento do array não é ''
    if (
      contador_linhas === 'SIM' &&
      !primeiroElementoVazio(colunas_dinamicas_relatorio)
    ) {
      // Adiciona o primeiro elemento vazio ao array de colunas dinâmicas
      colunas_dinamicas_relatorio.unshift('');
    }
    // Verifica se o contador_linhas é NAO e o primeiro elemento do array é ''
    else if (
      contador_linhas === 'NÃO' &&
      primeiroElementoVazio(colunas_dinamicas_relatorio)
    ) {
      // Remove o primeiro elemento do array de colunas dinâmicas
      colunas_dinamicas_relatorio.shift();
    }
    // Retorna o array ajustado
    return colunas_dinamicas_relatorio;
  }
  //TRATAMENTO PARA QUE O CONTADOR DE LINHAS FUNCIONE COM AS COLUNAS DINAMICAS

  // Exemplo de uso

  //console.log('Array inicial:', colunas_dinamicas_relatorio);
  colunas_dinamicas_relatorio = ajustarArrayColunas(
    contador_linhas,
    colunas_dinamicas_relatorio,
  );
  //console.log('Array ajustado:', colunas_dinamicas_relatorio);

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

  /*SISTEMAS PESQUISADOS
  const tableHeader = [
    { text: 'Departamento', alignment: 'center', bold: true },
    { text: 'Servidor', alignment: 'center', bold: true },
    { text: 'Cargo', alignment: 'center', bold: true },
  ];*/
  type Coluna = string; // Tipo Coluna é uma string
  type ColunasRelatorio = Coluna[]; // Tipo ColunasRelatorio é um array de strings (Coluna)
  let numColunas = 0;

  // Função para criar o array de colunas dinâmico
  // Função para criar o array de colunas dinâmico e contar o número de colunas
  const criarColunasDinamicas = (
    colunasRelatorio: ColunasRelatorio,
    contadorLinhas: string,
  ): any[] => {
    // Adiciona a coluna '#' se contadorLinhas for 'SIM'
    const colunasComContador =
      contadorLinhas === 'SIM' ? ['#', ...colunasRelatorio] : colunasRelatorio;

    // Filtra colunas vazias e conta o número de colunas
    numColunas = colunasComContador.filter(
      (coluna: Coluna) => coluna !== '',
    ).length;

    // Cria as colunas dinâmicas usando switch case para mapear os rótulos
    const colunasDinamicas = colunasComContador
      .filter((coluna: Coluna) => coluna !== '') // Filtra colunas vazias
      .map((coluna: Coluna) => {
        let text = '';

        // Mapeia os rótulos usando switch case
        switch (coluna) {
          case 'REL_nome':
            text = 'Servidor';
            break;
          case 'REL_lotacao':
            text = 'Lotação';
            break;
          case 'REL_lotacao_sigla':
            text = 'Lotação Sigla';
            break;
          case 'REL_dep_hierarquia':
            text = 'Dep. Hierarquia';
            break;
          case 'REL_dep_tipo':
            text = 'Dep. Tipo';
            break;
          case 'REL_dep_especializacao':
            text = 'Dep. Especialização';
            break;
          case 'REL_dep_telefone':
            text = 'Dep. Telefone';
            break;
          case 'REL_dep_telefone2':
            text = 'Dep. Telefone 2';
            break;
          case 'REL_dep_telefone3':
            text = 'Dep. Telefone 3';
            break;
          case 'REL_dep_escala':
            text = 'Dep. Escala';
            break;
          case 'REL_departamento_grupo':
            text = 'Dep. Grupo';
            break;
          case 'REL_titular':
            text = 'Dep. Titular';
            break;
          case 'REL_titular_celular':
            text = 'Dep. Titular Celular';
            break;
          case 'REL_titular_telefone':
            text = 'Dep. Titular telefone';
            break;
          case 'REL_cargo':
            text = 'Cargo';
            break;
          case 'REL_classificacao':
            text = 'Classificação';
            break;
          case 'REL_funcao':
            text = 'Função';
            break;
          case 'REL_genero':
            text = 'Genero';
            break;
          case 'REL_vinculo':
            text = 'Vínculo';
            break;
          case 'REL_vinculo_desc':
            text = 'Descrição do Vínculo';
            break;
          case 'REL_celular':
            text = 'Celular';
            break;
          case 'REL_telefone':
            text = 'Telefone Fixo';
            break;
          case 'REL_email':
            text = 'Email';
            break;
          case 'REL_cpf':
            text = 'CPF';
            break;
          case 'REL_dta_nascimento_br':
            text = 'Data de Nascimento';
            break;
          case 'REL_idade':
            text = 'Idade';
            break;
          case 'REL_dtai_br':
            text = 'Início da Lotação';
            break;
          case 'REL_dtaf_br':
            text = 'Fim da Lotação';
            break;
          case 'REL_temporario_espirou':
            text = 'Contrato Expirado';
            break;
          case 'REL_indicacao':
            text = 'Indicação';
            break;
          case 'REL_indicacao_obs':
            text = 'Observação de Indicação';
            break;
          case 'REL_chefia':
            text = 'Chefe?';
            break;
          case 'REL_chefia_desc':
            text = 'Descrição da Chefia';
            break;
          case 'REL_fun_cad':
            text = 'Função de Cadastro';
            break;
          case 'REL_status_desc':
            text = 'Descrição de Status';
            break;
          case 'REL_ac4_prevista':
            text = 'AC4 Prevista';
            break;
          case 'REL_disposicao':
            text = 'Disposição';
            break;
          case 'REL_escala':
            text = 'Escala';
            break;
          case 'REL_escala_grupo':
            text = 'Escala de Grupo';
            break;
          case 'REL_restricao_arma':
            text = 'Restrição à arma';
            break;
          case 'REL_restricao_medica':
            text = 'Restrição Médica';
            break;
          case 'REL_restricao_judicial':
            text = 'Restrição Judicial';
            break;
          case 'REL_restricao_sei':
            text = 'Restrição SEI';
            break;
          case 'REL_restricao_obs':
            text = 'Observação da Restrição';
            break;
          case 'REL_municipio_lotacao':
            text = 'Município de Lotação';
            break;
          case 'REL_situacao':
            text = 'Situção';
            break;
          case 'REL_matricula_funcional':
            text = 'Matrícula Funcional';
            break;
          case 'REL_dta_posse_br':
            text = 'Data da Posse';
            break;
          case 'REL_idade_posse':
            text = 'Anos de Instituição';
            break;
          case 'REL_idade_lotacao':
            text = 'Anos na Lotação';
            break;
          case 'REL_administracao':
            text = 'Administração';
            break;
          case 'REL_title':
            text = 'Unidade';
            break;
          case 'REL_hierarquia':
            text = 'Hierarquia';
            break;
          case 'REL_sigla':
            text = 'Sigla';
            break;
          case 'REL_municipio':
            text = 'Município';
            break;
          case 'REL_censo_vinte_tres':
            text = 'Censo de 2023';
            break;
          case 'REL_tipo':
            text = 'Tipo';
            break;
          case 'REL_especializacao':
            text = 'Especialização';
            break;
          case 'REL_telefone2':
            text = 'Telefone 2';
            break;
          case 'REL_telefone3':
            text = 'Telefone 3';
            break;
          case 'REL_endereco':
            text = 'Endereço';
            break;
          case 'REL_nome_superior_hierarquia':
            text = 'Nome Superior Hierarquia';
            break;
          case 'REL_superior_sicad':
            text = 'Superior Sicad';
            break;
          case 'REL_portaria':
            text = 'Portaria Hierarquia';
            break;
          case 'REL_servidores_qtd':
            text = 'Quantidade Servidores';
            break;
          case 'REL_servidores_agentes':
            text = 'Qde. Agentes';
            break;
          case 'REL_servidores_delegados':
            text = 'Qtde. Delegados';
            break;
          case 'REL_servidores_escrivaes':
            text = 'Qtde Escrivães';
            break;
          case 'REL_servidores_outros':
            text = 'Qtde Outros Servidores';
            break;
          case 'REL_qtd_municipios':
            text = 'Qtde Municípios';
            break;
          case 'REL_grupo_cidade':
            text = 'Grrupo Cidade Departamento';
            break;
          case 'REL_grupo_titular':
            text = 'Nome do Grupo Titular';
            break;
          case 'REL_grupo_titular_celular':
            text = 'Celular do Titular do Grupo';
            break;
          case 'REL_titular_abreviado':
            text = 'Nome abreviado do Titular';
            break;
          case 'REL_interino_abreviado':
            text = 'Nome do Interino abreviado';
            break;
          case 'REL_chefe_cartorio_interino_abreviado':
            text = 'Chefe de Cartorio Interino Abreviado';
            break;
          case 'REL_chefe_cartorio_abreviado':
            text = 'Chefe Cartorio Abreviado';
            break;
          case 'REL_titular_email':
            text = 'Email do Titular';
            break;
          case 'REL_titular_interino':
            text = 'Titular Interino';
            break;
          case 'REL_titular_interino_celular':
            text = 'Celular do Titular Interino';
            break;
          case 'REL_titular_interino_telefone':
            text = 'Telefone do Titular Interino';
            break;
          case 'REL_titular_interino_email':
            text = 'Email do Titular Interino';
            break;
          case 'REL_chefe_cartorio':
            text = 'Chefe de Cartorio';
            break;
          case 'REL_chefe_cartorio_celular':
            text = 'Celular do Chefe de Cartorio';
            break;
          case 'REL_chefe_cartorio_telefone':
            text = 'Telefone do Chefe de Cartorio';
            break;
          case 'REL_chefe_cartorio_email':
            text = 'Email do Chefe de Cartorio';
            break;
          case 'REL_chefe_cartorio_interino':
            text = 'Nome do Chefe Interino do Cartorio';
            break;
          case 'REL_chefe_cartorio_interino_celular':
            text = 'Celular do Chefe de Cartorio Interino';
            break;
          case 'REL_chefe_cartorio_interino_telefone':
            text = 'Telefone fixo do Chefe de Cartório Interino';
            break;
          case 'REL_chefe_cartorio_interino_email':
            text = 'Email do Chefe de Cartório Interino';
            break;
          // Outros cases aqui...
          default:
            // Caso não encontre correspondência, mantém o valor original
            text = coluna;
            break;
        }

        return {
          text,
          alignment: 'center',
          bold: true,
        };
      });

    return colunasDinamicas;
  };

  // Cria o array de colunas dinâmico usando a função
  let tableHeader = criarColunasDinamicas(
    colunas_dinamicas_relatorio,
    contador_linhas,
  );

  // Função para criar o array de dados dinâmico
  const criarDadosDinamicos = (
    colunasRelatorio: ColunasRelatorio,
    data: any[],
    contadorLinhas: string,
  ): any[] => {
    const dadosDinamicos = data.map((item, index) => {
      const dadosItem: any[] = [];

      // Adicionar contador de linhas, se necessário
      if (contadorLinhas === 'SIM') {
        dadosItem.push({
          text: (index + 1).toString(), // Número da linha
          alignment: 'center',
          bold: false,
        });
      }

      // Iterar pelas colunas a partir da segunda coluna (índice 1) se contadorLinhas for 'SIM'
      const startIndex = contadorLinhas === 'SIM' ? 1 : 0;
      for (
        let columnIndex = startIndex;
        columnIndex < colunasRelatorio.length;
        columnIndex++
      ) {
        const coluna = colunasRelatorio[columnIndex];
        let valorColuna = item[coluna.replace('REL_', '')] || ''; // Valor padrão vazio

        // Se contadorLinhas for 'SIM' e estamos na primeira coluna, exiba o número da linha
        if (contadorLinhas === 'SIM' && columnIndex === 0) {
          valorColuna = (index + 1).toString(); // Número da linha
        }

        dadosItem.push({
          text: valorColuna,
          alignment: 'left',
          bold: false,
        });
      }

      return dadosItem;
    });

    return dadosDinamicos;
  };

  let tableData: any[];
  //-----------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------
  //POR SERVIDORES
  //-----------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------------------------------
  // Cria o array de dados dinâmico usando a função
  if (modelo_relatorio === 'SERVIDORES') {
    //cria o array padrão, onde sendo -1 haverá o descarte dos dados
    let servidoresDepartamento: ServidoresDepartamento[] = [];

    let departamento_agrupador = -1;

    //-----------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------
    //TITULO INICIO
    //-----------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------

    if (agrupar_departamento != 'NAO') {
      //reordena o resultado por departamento e servidores
      if (agrupar_departamento === 'DEPARTAMENTO') {
        dataServidores.sort((a: DataTypeServidores, b: DataTypeServidores) => {
          // Convertendo para números e comparando
          const hierarquiaA = parseInt(a.hierarquia_ordenacao);
          const hierarquiaB = parseInt(b.hierarquia_ordenacao);

          if (hierarquiaA !== hierarquiaB) {
            return hierarquiaA - hierarquiaB;
          }
          // Se a.hierarquia_ordenacao for igual a b.hierarquia_ordenacao, ordena pelo nome
          return a.nome.localeCompare(b.nome);
        });
      }
      if (agrupar_departamento === 'CIDADE') {
        dataServidores.sort((a: DataTypeServidores, b: DataTypeServidores) => {
          // Comparando dep_municipio
          if (a.dep_municipio !== b.dep_municipio) {
            return a.dep_municipio.localeCompare(b.dep_municipio);
          }
          // Se dep_municipio for igual, ordena pelo nome
          return a.nome.localeCompare(b.nome);
        });
      }
      if (agrupar_departamento === 'CLASSIFICACAO') {
        dataServidores.sort((a: DataTypeServidores, b: DataTypeServidores) => {
          // Verifica se a.classificacao e b.classificacao não são nulos ou indefinidos
          const classificacaoA = a.classificacao || '';
          const classificacaoB = b.classificacao || '';

          if (classificacaoA !== classificacaoB) {
            return classificacaoA.localeCompare(classificacaoB);
          }

          // Verifica se a.nome e b.nome não são nulos ou indefinidos
          const nomeA = a.nome || '';
          const nomeB = b.nome || '';

          return nomeA.localeCompare(nomeB);
        });
      }

      //agora monta novo array só com os departamentos
      // Função para criar o novo array ServidoresDepartamento
      const criarServidoresDepartamento = () => {
        const novoServidoresDepartamento: ServidoresDepartamento[] = [];
        const lotacaoIdSet = new Set<number>(); // Conjunto para verificar lotacao_id existente
        const classificacaoSet = new Set<string>();

        dataServidores.forEach((servidor: DataTypeServidores) => {
          // Verifica se lotacao_id já existe no conjunto, se não existir, adiciona ao novo array
          if (agrupar_departamento === 'DEPARTAMENTO') {
            if (!lotacaoIdSet.has(servidor.lotacao_id)) {
              novoServidoresDepartamento.push({
                lotacao: servidor.lotacao,
                lotacao_id: servidor.lotacao_id,
                dep_hierarquia_pai: servidor.dep_hierarquia_pai,
                dep_hierarquia: servidor.dep_hierarquia,
                dep_tipo: servidor.dep_tipo,
                dep_especializacao: servidor.dep_especializacao,
                dep_municipio: servidor.dep_municipio,
                dep_municipioid: servidor.dep_municipioid,
                dep_telefone: servidor.dep_telefone,
                dep_telefone2: servidor.dep_telefone2,
                dep_telefone3: servidor.dep_telefone3,
                dep_escala: servidor.dep_escala,
                titular_id: servidor.titular_id,
                titular: servidor.titular,
                titular_celular: servidor.titular_celular,
                titular_telefone: servidor.titular_telefone,
                departamento_grupo_id: servidor.departamento_grupo_id,
                departamento_grupo: servidor.departamento_grupo,
                classificacao: servidor.classificacao,
                classificacao_desc: servidor.classificacao_desc,
              });
              lotacaoIdSet.add(servidor.lotacao_id); // Adiciona lotacao_id ao conjunto
            }
          }

          if (agrupar_departamento === 'CIDADE') {
            if (!lotacaoIdSet.has(servidor.dep_municipioid)) {
              novoServidoresDepartamento.push({
                lotacao: servidor.lotacao,
                lotacao_id: servidor.lotacao_id,
                dep_hierarquia_pai: servidor.dep_hierarquia_pai,
                dep_hierarquia: servidor.dep_hierarquia,
                dep_tipo: servidor.dep_tipo,
                dep_especializacao: servidor.dep_especializacao,
                dep_municipio: servidor.dep_municipio,
                dep_municipioid: servidor.dep_municipioid,
                dep_telefone: servidor.dep_telefone,
                dep_telefone2: servidor.dep_telefone2,
                dep_telefone3: servidor.dep_telefone3,
                dep_escala: servidor.dep_escala,
                titular_id: servidor.titular_id,
                titular: servidor.titular,
                titular_celular: servidor.titular_celular,
                titular_telefone: servidor.titular_telefone,
                departamento_grupo_id: servidor.departamento_grupo_id,
                departamento_grupo: servidor.departamento_grupo,
                classificacao: servidor.classificacao,
                classificacao_desc: servidor.classificacao_desc,
              });
              lotacaoIdSet.add(servidor.dep_municipioid); // Adiciona lotacao_id ao conjunto
            }
          }
          if (agrupar_departamento === 'CLASSIFICACAO') {
            if (!classificacaoSet.has(servidor.classificacao)) {
              novoServidoresDepartamento.push({
                lotacao: servidor.lotacao,
                lotacao_id: servidor.lotacao_id,
                dep_hierarquia_pai: servidor.dep_hierarquia_pai,
                dep_hierarquia: servidor.dep_hierarquia,
                dep_tipo: servidor.dep_tipo,
                dep_especializacao: servidor.dep_especializacao,
                dep_municipio: servidor.dep_municipio,
                dep_municipioid: servidor.dep_municipioid,
                dep_telefone: servidor.dep_telefone,
                dep_telefone2: servidor.dep_telefone2,
                dep_telefone3: servidor.dep_telefone3,
                dep_escala: servidor.dep_escala,
                titular_id: servidor.titular_id,
                titular: servidor.titular,
                titular_celular: servidor.titular_celular,
                titular_telefone: servidor.titular_telefone,
                departamento_grupo_id: servidor.departamento_grupo_id,
                departamento_grupo: servidor.departamento_grupo,
                classificacao: servidor.classificacao,
                classificacao_desc: servidor.classificacao_desc,
              });
              classificacaoSet.add(servidor.classificacao); // Adiciona lotacao_id ao conjunto
            }
          }
        });

        return novoServidoresDepartamento;
      };

      // Remova 'const' para modificar a variável servidoresDepartamento do escopo externo
      servidoresDepartamento = criarServidoresDepartamento();
    } else {
      //NÃO AGRUPAR POR DEPARTAMENTO
      servidoresDepartamento.push({
        lotacao: '',
        lotacao_id: -1,
        dep_hierarquia_pai: '',
        dep_hierarquia: '',
        dep_tipo: '',
        dep_especializacao: '',
        dep_municipio: '',
        dep_municipioid: -1,
        dep_telefone: '',
        dep_telefone2: '',
        dep_telefone3: '',
        dep_escala: '',
        titular_id: '',
        titular: '',
        titular_celular: '',
        titular_telefone: '',
        departamento_grupo_id: '',
        departamento_grupo: '',
        classificacao: '',
        classificacao_desc: '',
      });
    } //NÃO AGRUPAR POR DEPARTAMENTO

    // Defina o array de larguras das colunas para a tabela de títulos
    const colWidthsTitulo = [518]; // Exemplo de larguras em pontos

    // Percorra cada item de servidoresDepartamento para criar a tabela de títulos e dados dinâmicos
    let xlinha_geral = 0;
    let subtotal_servidores = 0;
    let subtotal_agentes = 0;
    let subtotal_delegados = 0;
    let subtotal_escrivaes = 0;
    let subtotal_outros = 0;

    //-----------------------------------------------------------------------------------------------------------INI LOOP
    servidoresDepartamento.forEach(titulo => {
      /*TOTALIZAÇÃO*/
      if (totalizar === 'SIM') {
        //SUBTOTALIZAÇÃO POR FUNÇÃO
        if (xlinha_geral > 0) {
          const tableHeaderTotalizacao2 = [
            {
              text: 'Delegados',
              alignment: 'center',
              bold: true,
              fillColor: '#f2f2f2',
              color: 'darkgreen',
            },
            {
              text: 'Escrivães',
              alignment: 'center',
              bold: true,
              fillColor: '#f2f2f2',
              color: 'darkgreen',
            },
            {
              text: 'Agentes',
              alignment: 'center',
              bold: true,
              fillColor: '#f2f2f2',
              color: 'darkgreen',
            },
            {
              text: 'Outros',
              alignment: 'center',
              bold: true,
              fillColor: '#f2f2f2',
              color: 'darkgreen',
            },
          ];

          const colWidthsTotalizacao2 = [123, 123, 122, 122]; // Exemplo de larguras em pontos

          subtotal_outros =
            subtotal_servidores -
            (subtotal_delegados + subtotal_escrivaes + subtotal_agentes);

          const tableDataTotalizacao2: TableCell[][] = [
            [
              {
                text: subtotal_delegados.toString(),
                alignment: 'center',
                bold: true,
              },
              {
                text: subtotal_escrivaes.toString(),
                alignment: 'center',
                bold: true,
              },
              {
                text: subtotal_agentes.toString(),
                alignment: 'center',
                bold: true,
              },
              {
                text: subtotal_outros.toString(),
                alignment: 'center',
                bold: true,
              },
            ],
          ];

          // console.log('colWidthsTotalizacao2: ' + colWidthsTotalizacao2);

          // Adicione a tabela ao conteúdo com as larguras definidas
          content.push({
            table: {
              headerRows: 1,
              widths: colWidthsTotalizacao2,
              body: [tableHeaderTotalizacao2, ...tableDataTotalizacao2],
            },
            fontSize: 10,
            margin: [0, 0, 0, 0],
          });
        } //SUBTOTALIZAÇÃO POR FUNÇÃO FIM

        //CONTABILIZAR A SUBTOTALIZAÇÃO POR FUNÇÃO

        subtotal_servidores = 0;
        subtotal_agentes = 0;
        subtotal_delegados = 0;
        subtotal_escrivaes = 0;

        // Percorre o array dataDepartamentos para somar as quantidades maiores que zero
        if (agrupar_departamento === 'DEPARTAMENTO') {
          dataServidores.forEach((item: DataTypeServidores) => {
            if (item.lotacao_id && item.lotacao_id === titulo.lotacao_id) {
              subtotal_servidores++;

              if (item.classificacao && item.classificacao.includes('AGENTE')) {
                subtotal_agentes++;
              }
              if (
                item.classificacao &&
                item.classificacao.includes('DELEGADO')
              ) {
                subtotal_delegados++;
              }
              if (
                item.classificacao &&
                item.classificacao.includes('ESCRIVAO')
              ) {
                subtotal_escrivaes++;
              }
            }
          });
        }
        if (agrupar_departamento === 'CIDADE') {
          dataServidores.forEach((item: DataTypeServidores) => {
            if (
              item.dep_municipioid &&
              item.dep_municipioid === titulo.dep_municipioid
            ) {
              subtotal_servidores++;

              if (item.classificacao && item.classificacao.includes('AGENTE')) {
                subtotal_agentes++;
              }
              if (
                item.classificacao &&
                item.classificacao.includes('DELEGADO')
              ) {
                subtotal_delegados++;
              }
              if (
                item.classificacao &&
                item.classificacao.includes('ESCRIVAO')
              ) {
                subtotal_escrivaes++;
              }
            }
          });
        }
        if (agrupar_departamento === 'CLASSIFICACAO') {
          dataServidores.forEach((item: DataTypeServidores) => {
            if (
              item.classificacao &&
              item.classificacao === titulo.classificacao
            ) {
              subtotal_servidores++;

              /*
      if (
        item.funcao &&
        (item.funcao.includes('AGENTE') ||
          item.cargo.includes('AGENTE'))
      ) {
        subtotal_agentes++;
      }
      if (item.funcao && item.funcao.includes('DELEGADO')) {
        subtotal_delegados++;
      }
      if (item.funcao && item.funcao.includes('ESCR')) {
        subtotal_escrivaes++;
      }*/

              if (item.classificacao.includes('AGENTE')) {
                subtotal_agentes++;
              }
              if (item.classificacao.includes('DELEGADO')) {
                subtotal_delegados++;
              }
              if (item.classificacao.includes('ESCRIVAO')) {
                subtotal_escrivaes++;
              }
            }
          });
        }

        xlinha_geral++;
      } /*TOTALIZAÇÃO FIM*/

      //CONTABILIZAR A SUBTOTALIZAÇÃO POR FUNÇÃO FIM

      // Inicialize a tabela de títulos vazia para esta linha de servidoresDepartamento
      let tableDataTitulo = [];

      // Adicione a linha de título à tabela de títulos para esta linha de servidoresDepartamento
      if (agrupar_departamento === 'DEPARTAMENTO') {
        if (titulo.lotacao_id != -1) {
          tableDataTitulo.push([
            {
              text: titulo.lotacao,
              alignment: 'center',
              bold: true,
              fillColor: '#f2f2f2',
              color: 'darkgreen',
              border: [false, false, false, false],
            },
          ]);
        } else {
          tableDataTitulo.push([
            {
              text: 'TODOS',
              alignment: 'center',
              bold: true,
              fillColor: '#f2f2f2',
              color: 'darkgreen',
              border: [false, false, false, false],
            },
          ]);
        }
      }
      if (agrupar_departamento === 'CIDADE') {
        if (titulo.dep_municipioid != -1) {
          tableDataTitulo.push([
            {
              text: titulo.dep_municipio,
              alignment: 'center',
              bold: true,
              fillColor: '#f2f2f2',
              color: 'darkgreen',
              border: [false, false, false, false],
            },
          ]);
        } else {
          tableDataTitulo.push([
            {
              text: 'TODOS',
              alignment: 'center',
              bold: true,
              fillColor: '#f2f2f2',
              color: 'darkgreen',
              border: [false, false, false, false],
            },
          ]);
        }
      }
      if (agrupar_departamento === 'CLASSIFICACAO') {
        if (titulo.classificacao != '') {
          tableDataTitulo.push([
            {
              text: titulo.classificacao_desc,
              alignment: 'center',
              bold: true,
              fillColor: '#f2f2f2',
              color: 'darkgreen',
              border: [false, false, false, false],
            },
          ]);
        } else {
          tableDataTitulo.push([
            {
              text: 'TODOS',
              alignment: 'center',
              bold: true,
              fillColor: '#f2f2f2',
              color: 'darkgreen',
              border: [false, false, false, false],
            },
          ]);
        }
      }

      //-----------------------------------------------------------------------------------------------------------
      //-----------------------------------------------------------------------------------------------------------
      //-----------------------------------------------------------------------------------------------------------
      //TITULO FIM
      //-----------------------------------------------------------------------------------------------------------
      //-----------------------------------------------------------------------------------------------------------
      //-----------------------------------------------------------------------------------------------------------

      // Filtrar dataServidores com base no lotacao_id atual e criar a tabela de dados dinâmicos
      let servidoresFiltrados;
      if (agrupar_departamento === 'DEPARTAMENTO') {
        servidoresFiltrados = dataServidores.filter(
          (servidor: DataTypeServidores) =>
            servidor.lotacao_id === titulo.lotacao_id,
        );
      }
      if (agrupar_departamento === 'CIDADE') {
        servidoresFiltrados = dataServidores.filter(
          (servidor: DataTypeServidores) =>
            servidor.dep_municipioid === titulo.dep_municipioid,
        );
      }
      if (agrupar_departamento === 'CLASSIFICACAO') {
        servidoresFiltrados = dataServidores.filter(
          (servidor: DataTypeServidores) =>
            servidor.classificacao === titulo.classificacao,
        );
      }

      const tableData = criarDadosDinamicos(
        colunas_dinamicas_relatorio,
        servidoresFiltrados,
        contador_linhas,
      );

      // Adicione a tabela de títulos e a tabela de dados dinâmicos ao conteúdo
      content.push({
        table: {
          widths: colWidthsTitulo,
          body: tableDataTitulo,
        },
        fontSize: 10,
        margin: [0, 10, 0, 0],
      });

      // Defina a largura total da tabela (em pontos)
      const larguraTotalTabela = 490; // Exemplo de largura total em pontos

      const larguraColuna = Math.floor(larguraTotalTabela / numColunas);

      // Calcule a diferença que será adicionada à primeira coluna
      const diferenca = larguraTotalTabela - larguraColuna * numColunas;

      // Crie o array de larguras das colunas
      const colWidths = Array(numColunas).fill(larguraColuna);

      // Adicione a diferença à primeira coluna
      colWidths[0] += diferenca;

      //console.log('colWidths: ' + colWidths);

      tableHeader = criarColunasDinamicas(
        colunas_dinamicas_relatorio,
        contador_linhas,
      );

      // Adicione a tabela ao conteúdo com as larguras definidas
      content.push({
        table: {
          headerRows: 1,
          widths: colWidths,
          body: [tableHeader, ...tableData], // Aqui usamos o spread operator (...) para adicionar as linhas da tabela dinamicamente
        },
        fontSize: 10,
        margin: [0, 0, 0, 0],
      });
      //-----------------------------------------------------------------------------------------------------------FIM LOOP
    });

    /*TOTALIZAÇÃO FINAL - ÚLTIMO GRUPO*/
    if (totalizar === 'SIM') {
      //SUBTOTALIZAÇÃO POR FUNÇÃO

      const tableHeaderTotalizacao2 = [
        {
          text: 'Delegados',
          alignment: 'center',
          bold: true,
          fillColor: '#f2f2f2',
          color: 'darkgreen',
        },
        {
          text: 'Escrivães',
          alignment: 'center',
          bold: true,
          fillColor: '#f2f2f2',
          color: 'darkgreen',
        },
        {
          text: 'Agentes',
          alignment: 'center',
          bold: true,
          fillColor: '#f2f2f2',
          color: 'darkgreen',
        },
        {
          text: 'Outros',
          alignment: 'center',
          bold: true,
          fillColor: '#f2f2f2',
          color: 'darkgreen',
        },
      ];

      const colWidthsTotalizacao2 = [123, 123, 122, 122]; // Exemplo de larguras em pontos

      subtotal_outros =
        subtotal_servidores -
        (subtotal_delegados + subtotal_escrivaes + subtotal_agentes);

      const tableDataTotalizacao2: TableCell[][] = [
        [
          {
            text: subtotal_delegados.toString(),
            alignment: 'center',
            bold: true,
          },
          {
            text: subtotal_escrivaes.toString(),
            alignment: 'center',
            bold: true,
          },
          {
            text: subtotal_agentes.toString(),
            alignment: 'center',
            bold: true,
          },
          {
            text: subtotal_outros.toString(),
            alignment: 'center',
            bold: true,
          },
        ],
      ];

      // Adicione a tabela ao conteúdo com as larguras definidas
      content.push({
        table: {
          headerRows: 1,
          widths: colWidthsTotalizacao2,
          body: [tableHeaderTotalizacao2, ...tableDataTotalizacao2],
        },
        fontSize: 10,
        margin: [0, 0, 0, 0],
      });
    } //SUBTOTALIZAÇÃO POR FUNÇÃO FIM
  } else {
    //-----------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------
    //POR DEPARTAMENTO
    //-----------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------
    tableData = criarDadosDinamicos(
      colunas_dinamicas_relatorio,
      dataDepartamentos,
      contador_linhas,
    );

    // Defina a largura total da tabela (em pontos)
    const larguraTotalTabela = 490; // Exemplo de largura total em pontos

    const larguraColuna = Math.floor(larguraTotalTabela / numColunas);

    // Calcule a diferença que será adicionada à primeira coluna
    const diferenca = larguraTotalTabela - larguraColuna * numColunas;

    // Crie o array de larguras das colunas
    const colWidths = Array(numColunas).fill(larguraColuna);

    // Adicione a diferença à primeira coluna
    colWidths[0] += diferenca;

    // Adicione a tabela ao conteúdo com as larguras definidas
    content.push({
      table: {
        headerRows: 1,
        widths: colWidths,
        body: [tableHeader, ...tableData], // Aqui usamos o spread operator (...) para adicionar as linhas da tabela dinamicamente
      },
      fontSize: 10,
      margin: [0, 10, 0, 0],
    });

    /*TOTALIZAÇÃO*/
    if (totalizar === 'SIM') {
      let total_servidores = 0;
      let total_agentes = 0;
      let total_delegados = 0;
      let total_escrivaes = 0;
      let total_outros = 0;
      let total_municipios = 0;

      // Percorre o array dataDepartamentos para somar as quantidades maiores que zero
      dataDepartamentos.forEach((item: DataTypeTreeDepartamento) => {
        if (item.servidores_qtd && item.servidores_qtd > 0) {
          total_servidores += item.servidores_qtd;
        }
        if (item.servidores_agentes && item.servidores_agentes > 0) {
          total_agentes += item.servidores_agentes;
        }
        if (item.servidores_delegados && item.servidores_delegados > 0) {
          total_delegados += item.servidores_delegados;
        }
        if (item.servidores_escrivaes && item.servidores_escrivaes > 0) {
          total_escrivaes += item.servidores_escrivaes;
        }
        if (item.servidores_outros && item.servidores_outros > 0) {
          total_outros += item.servidores_outros;
        }
        if (item.qtd_municipios && item.qtd_municipios > 0) {
          total_municipios += item.qtd_municipios;
        }
      });

      const tableHeaderTotalizacao = [
        {
          text: 'Municipios',
          alignment: 'center',
          bold: true,
          fillColor: '#f2f2f2',
          color: 'darkgreen',
        },
        {
          text: 'Total de Servidores',
          alignment: 'center',
          bold: true,
          fillColor: '#f2f2f2',
          color: 'darkgreen',
        },
      ];

      const colWidthsTotalizacao = [253, 254]; // Exemplo de larguras em pontos

      const tableDataTotalizacao: TableCell[][] = [
        [
          {
            text: total_municipios.toString(),
            alignment: 'center',
            bold: true,
          },
          {
            text: total_servidores.toString(),
            alignment: 'center',
            bold: true,
          },
        ],
      ];

      // Adicione a tabela ao conteúdo com as larguras definidas
      content.push({
        table: {
          headerRows: 1,
          widths: colWidthsTotalizacao,
          body: [tableHeaderTotalizacao, ...tableDataTotalizacao],
        },
        fontSize: 10,
        margin: [0, 10, 0, 0],
      });

      const tableHeaderTotalizacao2 = [
        {
          text: 'Delegados',
          alignment: 'center',
          bold: true,
          fillColor: '#f2f2f2',
          color: 'darkgreen',
        },
        {
          text: 'Escrivães',
          alignment: 'center',
          bold: true,
          fillColor: '#f2f2f2',
          color: 'darkgreen',
        },
        {
          text: 'Agentes',
          alignment: 'center',
          bold: true,
          fillColor: '#f2f2f2',
          color: 'darkgreen',
        },
        {
          text: 'Outros',
          alignment: 'center',
          bold: true,
          fillColor: '#f2f2f2',
          color: 'darkgreen',
        },
      ];

      const colWidthsTotalizacao2 = [123, 123, 122, 122]; // Exemplo de larguras em pontos

      const tableDataTotalizacao2: TableCell[][] = [
        [
          { text: total_delegados.toString(), alignment: 'center', bold: true },
          { text: total_escrivaes.toString(), alignment: 'center', bold: true },
          { text: total_agentes.toString(), alignment: 'center', bold: true },
          { text: total_outros.toString(), alignment: 'center', bold: true },
        ],
      ];

      // Adicione a tabela ao conteúdo com as larguras definidas
      content.push({
        table: {
          headerRows: 1,
          widths: colWidthsTotalizacao2,
          body: [tableHeaderTotalizacao2, ...tableDataTotalizacao2],
        },
        fontSize: 10,
        margin: [0, 10, 0, 0],
      });
    } //TOTALIZAR === SIM
  } //POR DEPARTAMENTO

  //console.log('aqui ' + modelo_relatorio + ' Tot ' + totalizar);

  // Adicione a tabela ao conteúdo com as larguras definidas
  content.push({
    stack: [
      {
        image: legendaBase64,
        width: 50,
        margin: [-25, 1, 0, 0], //ESQUERDA, SUPERIOR Ajuste o margin conforme necessário para o alinhamento desejado
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
    pageOrientation: orientacao_relatorio,
  };

  // Generate PDF and open in new window
  pdfMake.createPdf(documentDefinition).open();
};
//mudar para o print()

export { generatePdfDinamico };

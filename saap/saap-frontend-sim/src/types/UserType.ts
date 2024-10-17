export type UserType = {
  funcao: string;
  cidade: {
    nome: string;
    id: number;
  };
  unidadesLogadas: [];
  dtExtincao: string;
  unidade: {
    id: number;
    nome: string;
    corporacaoId: number;
    corporacao: string;
    sigla: string;
    municipioid: number;
    municipio: string;
    tipo: string;
    hierarquia: string;
    especializacao: string;
    telefone: string;
    endereco: string;
    idsuperior: number;
    superior: string;
    update_at: string;
    portaria: string;
    departamento_grupo_id: number;
    escala: string;
    titular_sicad_id: number;
    titular_nome: string;
    titular_contato: string;
    logradouro: string;
    quadra: string;
    lote: string;
    numero: string;
    bairro: string;
    valor_contrato: string;
    imovel_status: string;
};
  login: string;
  deviceId: number;
  tokenIp: string;
  corporacaoOrigem: {
    nome: string;
    id: number;
  };
  unidadesDeTrabalho: [
    {
      corporacaoNome: string;
      unidadeSigla: string;
      funcoes: [
        {
          nome: string;
          id: number;
        },
      ];
      corporacaoSigla: string;
      unidadeNome: string;
      restrita: boolean;
      origem: string;
      unidadeId: number;
      corregedoria: boolean;
      corporacaoId: number;
      ordemMissao: boolean;
    },
  ];
  corporacaoAtual: {
    nome: string;
    id: number;
  };
  cpf: string;
  id: number;
  email: string;
  servidor: {
    cpf: string;
    nome: string;
    id: number;
  };
  administrador: boolean;
  unidadesResponsaveis: [];
  dtCadastro: string;
  nome: string;
  corporacao: string;
  token: string;
  perfis: [
    {
      sistema: {
        id: number;
        descricao: string;
      };
      id: number;
      descricao: string;
    },
  ];
  semPerfilThisSistema: boolean;
  perfisSistemaAtual: string[] | null;
  dtExpiracaoSenha: string;
  tokenCriptografado: boolean;
  departamento: {
    nome: string;
    id: number;
  };
  icon: string;
};

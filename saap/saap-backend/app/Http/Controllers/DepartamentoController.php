<?php

namespace App\Http\Controllers;
use App\Models\DepartamentoAuditoria;
use App\Models\Departamento;
use App\Models\DepartamentoGrupo;
use App\Models\DepartamentoHistorico;
use App\Models\Servidor;
use App\Models\DepartamentoPortaArquivo;
use App\Models\ProcessoItemProcesso;
use App\Models\ScobeObra;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Mpdf\Mpdf;
use Carbon\Carbon;

class DepartamentoController extends Controller
{


        public function GetDepartamentoDados(Request $req)
        {
            $dep_id = $req->has('zdep_id') ? $req->get('zdep_id') : '-1';
            $zcpf = $req->has('zcpf') ? $req->get('zcpf') : '0';

            $query = Departamento::select(
                'departamentos.id as departamento_id',
                'departamentos.titular_id',
                'departamentos.hierarquia',
                'departamentos.titular_interino_id',
                'departamentos.departamento_grupo_id',
                'departamentos.sigla as departamento_sigla',
                'departamentos.nome as departamento',
                'departamentos.municipio as dep_municipio',
                'departamentos.municipioid as dep_municipio_id',
                'departamento_grupos.descricao as departamento_grupo',
                'departamento_grupos.departamento_correspondente_id as grupo_dep_correspondente_id',
                'departamento_grupo_correspondente.titular_id as grupo_titular_id',
                'departamento_grupo_correspondente.titular_interino_id as grupo_titular_interino_id',
                DB::raw("
                    CASE
                        WHEN departamentos.titular_interino_id IS NULL THEN
                            CASE
                                WHEN servidors.cpf = '{$zcpf}' THEN 'SIM'
                                ELSE 'NAO'
                            END
                        ELSE
                            CASE
                                WHEN dp_interinos.cpf = '{$zcpf}' THEN 'SIM'
                                ELSE 'NAO'
                            END
                    END AS seria_responsavel
                "),
                DB::raw("
                    CASE
                        WHEN departamento_grupos.departamento_correspondente_id=departamentos.id
                            THEN 'SIM'
                                ELSE 'NAO'
                    END AS seria_dep_grupo
                ")
            )
            ->join('departamento_grupos', 'departamento_grupos.id', '=', 'departamentos.departamento_grupo_id')
            ->join('departamentos as departamento_grupo_correspondente', 'departamento_grupo_correspondente.id', '=', 'departamento_grupos.departamento_correspondente_id')
            ->leftJoin('servidors', 'servidors.id', '=', 'departamentos.titular_id')
            ->leftJoin('servidors as dp_interinos', 'dp_interinos.id', '=', 'departamentos.titular_interino_id')
            ->where('departamentos.id', $dep_id);

            $retorno = $query->get();

            return response()->json(['message' => '', 'retorno' => $retorno], 200);
        }

     private function buildWhereClauses($zcons_filtro)
    {
        $whereClauses = [];
        $options = [
            'FEMININO', 'MASCULINO', 'CELETISTA', 'EFETIVO', 'COMISSIONADO', 'TEMPORARIO', 'ESTAGIARIO', 'GRATIFICADOAC4', 'GRATIFICADOFC', 'GRATIFICADOAC4FC', 'NAO_GRATIFICADO', 'CHEFIA_SECAO', 'CHEFIA_DIVISAO', 'CHEFIA_GERENTE', 'CHEFIA_SUPERINTENDENTE', 'NAO_CHEFIA', 'PCGO', 'OUTRA', 'P. Mulher', 'Menor Infrator', 'P. Menor', 'P. Idoso', 'P. Deficiente', 'P. Racial', 'Homicídios', 'Inv. Crim.', 'Trânsito', 'Drogas', 'Patrimoniais', 'Inteligência', 'Identificação', 'Necropapiloscopia', 'Regionais', 'Unidade Adm.', 'Operacionais', 'Organizacionais', 'Sem Del.', 'Sem Esc.', 'Sem Age.', 'Interino', 'Policial', 'Delegado', 'Escrivão', 'Agente', 'Papiloscopista', 'Administrativo', 'Especial', '1ª Classe', '2ª Classe', '3ª Classe', 'ADM SGI', 'ADM GERAL', 'Restrição Arma', 'Restrição Médica', 'Restrição Judicial', 'Substituto', 'Assessor A9', 'Assessor A8', 'Assessor A7', 'Assessor A6', 'Assessor A5', 'Assessor A4', 'Assessor A3', 'Assessor A2', 'Assessor A1', 'Masculino', 'Feminino', 	'Plantão', 'Expediente',
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
            'Estágio Probatório',
            'PNE',
            'Sub Júdice',
            'Com Punição'
        ];

        $selectedOptions = explode(',', $zcons_filtro);

        foreach ($options as $option) {
                if (in_array($option, $selectedOptions)) {
                    switch ($option) {
                        case 'FEMININO':
                        case 'MASCULINO':
                            $whereClauses[] = ['servidors.genero', strtoupper($option)];
                            break;
                        case 'PCGO':
                        case 'OUTRA':
                            $whereClauses[] = ['servidors.indicacao', strtoupper($option)];
                            break;
                        case 'CELETISTA':
                        case 'EFETIVO':
                        case 'COMISSIONADO':
                        case 'TEMPORARIO':
                        case 'ESTAGIARIO':
                            $whereClauses[] = ['servidors.vinculo', strtoupper($option)];
                            break;
                        case 'GRATIFICADOAC4':
                            $whereClauses[] = ['servidors.ac4_prevista', '>', 0];
                            break;
                        case 'GRATIFICADOFC':
                            $whereClauses[] = ['servidors.fc_bruta_prevista', '>', 0];
                            break;
                        case 'GRATIFICADOAC4FC':
                            $whereClauses[] = ['servidors.ac4_prevista', '>', 0];
                            $whereClauses[] = ['servidors.fc_bruta_prevista', '>', 0];
                            break;
                        case 'NAO_GRATIFICADO':
                            $whereClauses[] = ['servidors.gratificado', 0];
                            break;
                        case 'CHEFIA_SECAO':
                            $whereClauses[] = ['servidors.chefia', 'SECAO'];
                            break;
                        case 'CHEFIA_DIVISAO':
                            $whereClauses[] = ['servidors.chefia', 'DIVISAO'];
                            break;
                        case 'CHEFIA_GERENTE':
                            $whereClauses[] = ['servidors.chefia', 'GERENTE'];
                            break;
                        case 'CHEFIA_SUPERINTENDENTE':
                            $whereClauses[] = ['servidors.chefia', 'SUPERINTENDENTE'];
                            break;
                        case 'NAO_CHEFIA':
                            $whereClauses[] = ['servidors.chefia', 'NAO'];
                            break;
                        case 'Feminino':
                            $whereClauses[] = ['servidors.genero', 'FEMININO'];
                            break;
                        case 'Masculino':
                            $whereClauses[] = ['servidors.genero', 'MASCULINO'];
                            break;
                        case 'P. Mulher':
                            $whereClauses[] = ['departamentos.especializacao', 'MULHER'];
                            break;
                        case 'Menor Infrator':
                            $whereClauses[] = ['departamentos.especializacao', 'MENOR_INFRATOR'];
                            break;
                        case 'P. Menor':
                            $whereClauses[] = ['departamentos.especializacao', 'MENOR_VITIMA'];
                            break;
                        case 'P. Idoso':
                            $whereClauses[] = ['departamentos.especializacao', 'IDOSO'];
                            break;
                        case 'P. Deficiente':
                            $whereClauses[] = ['departamentos.especializacao', 'DEFICIENCIA'];
                            break;
                        case 'P. Racial':
                            $whereClauses[] = ['departamentos.especializacao', 'RACIAL'];
                            break;
                        case 'Homicídios':
                            $whereClauses[] = ['departamentos.especializacao', 'DIH'];
                            break;
                        case 'Inv. Crim.':
                            $whereClauses[] = ['departamentos.especializacao', 'DEIC'];
                            break;
                        case 'Trânsito':
                            $whereClauses[] = ['departamentos.especializacao', 'DICT'];
                            break;
                        case 'Inteligência':
                            $whereClauses[] = ['departamentos.especializacao', 'INTELIGENCIA'];
                            break;
                        case 'Identificação':
                            $whereClauses[] = ['departamentos.especializacao', 'ID'];
                            break;
                        case 'Necropapiloscopia':
                            $whereClauses[] = ['departamentos.especializacao', 'NECRO'];
                            break;
                        case 'Unidade Adm.':
                            $whereClauses[] = ['departamentos.especializacao', 'ADMINISTRATIVA'];
                            break;
                        case 'Operacionais':
                            $whereClauses[] = ['departamentos.especializacao', 'OPERACIONAL'];
                            break;
                        case 'Organizacionais':
                            $whereClauses[] = ['departamentos.especializacao', 'ORGANIZACIONAL'];
                            break;
                        case 'Regionais':
                            $whereClauses[] = ['departamentos.especializacao', 'REGIONAL'];
                            break;
                        case 'Plantão':
                            $whereClauses[] = ['departamentos.escala', 'PLANTÃO'];
                            break;
                        case 'Expediente':
                            $whereClauses[] = ['departamentos.escala', 'EXPEDIENTE'];
                            break;
                        case 'Drogas':
                            $whereClauses[] = ['departamentos.especializacao', 'ilike', '%DROGAS%'];
                            break;
                        case 'Patrimoniais':
                            $whereClauses[] = ['departamentos.especializacao', 'ilike', '%GEPATRI%'];
                            break;
                        case 'Sem Del.':
                            $whereClauses[] = ['servidors.classificacao', 'not ilike', 'DELEGADO'];
                            break;
                        case 'Sem Esc.':
                            $whereClauses[] = ['servidors.classificacao', 'not ilike', 'ESCRIVAO'];
                            break;
                        case 'Sem Age.':
                            $whereClauses[] = ['servidors.classificacao', 'not ilike', 'AGENTE'];
                            break;
                        case 'Estágio Probatório':
                            $whereClauses[] = ['servidors.dta_nomeacao', '>', DB::raw("current_date - interval '3 years'")];
                            break;
                        case 'PNE':
                            $whereClauses[] = ['servidors.pne', 'S'];
                            break;
                        case 'Sub Júdice':
                            $whereClauses[] = ['servidors.classificacao', 'S'];
                            break;
                        case 'Com Punição':
                            $whereClauses[] = ['servidors.punicoes', 'not ilike', '%'];
                            $whereClauses[] = ['char_length(servidors.punicoes)', '>', 3];
                            break;
                        case 'Interino':
                            $whereClauses[] = ['servidors.titular_interino_id', '!=', null];
                            $whereClauses[] = ['servidors.chefe_cartorio_interino_id', '!=', null];
                            break;
                        case 'Especial':
                            $whereClauses[] = ['servidors.cargo', 'ilike', '%ESPECIAL%'];
                            break;
                        case '1ª Classe':
                            $whereClauses[] = ['servidors.cargo', 'ilike', '%1ª%'];
                            break;
                        case '2ª Classe':
                            $whereClauses[] = ['servidors.cargo', 'ilike', '%2ª%'];
                            break;
                        case '3ª Classe':
                            $whereClauses[] = ['servidors.cargo', 'ilike', '%3ª%'];
                            break;
                        case 'Substituto':
                            $whereClauses[] = ['servidors.cargo', 'ilike', '%SUBSTITUTO%'];
                            break;
                        case 'Assessor A1':
                            $whereClauses[] = ['servidors.cargo', 'ilike', '%A1%'];
                            break;
                        case 'Assessor A2':
                            $whereClauses[] = ['servidors.cargo', 'ilike', '%A2%'];
                            break;
                        case 'Assessor A3':
                            $whereClauses[] = ['servidors.cargo', 'ilike', '%A3%'];
                            break;
                        case 'Assessor A4':
                            $whereClauses[] = ['servidors.cargo', 'ilike', '%A4%'];
                            break;
                        case 'Assessor A5':
                            $whereClauses[] = ['servidors.cargo', 'ilike', '%A5%'];
                            break;
                        case 'Assessor A6':
                            $whereClauses[] = ['servidors.cargo', 'ilike', '%A6%'];
                            break;
                        case 'Assessor A7':
                            $whereClauses[] = ['servidors.cargo', 'ilike', '%A7%'];
                            break;
                        case 'Assessor A8':
                            $whereClauses[] = ['servidors.cargo', 'ilike', '%A8%'];
                            break;
                        case 'Assessor A9':
                            $whereClauses[] = ['servidors.cargo', 'ilike', '%A9%'];
                            break;
                        case 'ADM SGI':
                            $whereClauses[] = ['servidors.administracao', 'SGI'];
                            break;
                        case 'ADM GERAL':
                            $whereClauses[] = ['servidors.administracao', 'GERAL'];
                            break;
                        case 'Restrição Arma':
                            $whereClauses[] = ['servidors.restricao_arma', true];
                            break;
                        case 'Restrição Médica':
                            $whereClauses[] = ['servidors.restricao_medica', true];
                            break;
                        case 'Restrição Judicial':
                            $whereClauses[] = ['servidors.restricao_judicial', true];
                            break;
                        case 'Lotação Externa':
                            $whereClauses[] = ['departamentos.hierarquia', 'ilike', '99.%'];
                            break;
                        case 'Lotação Executivo':
                            $whereClauses[] = ['departamentos.nome', 'ilike', 'EXECUTIVO %'];
                            break;
                        case 'Lotação Legislativo':
                            $whereClauses[] = ['departamentos.nome', 'ilike', 'PODER LEGISLATIVO %'];
                            break;
                        case 'Lotação Judiciário':
                            $whereClauses[] = ['departamentos.nome', 'PODER JUDICIÁRIO'];
                            break;
                        case 'Lotação Executivo Municipal':
                            $whereClauses[] = ['departamentos.nome', 'EXCUTIVO MUNICIPAL'];
                            break;
                        case 'Lotação Executivo Estadual':
                            $whereClauses[] = ['departamentos.nome', 'EXCUTIVO ESTADUAL'];
                            break;
                        case 'Lotação Executivo Federal':
                            $whereClauses[] = ['departamentos.nome', 'EXCUTIVO FEDERAL'];
                            break;
                        case 'Lotação Legislativo Municipal':
                            $whereClauses[] = ['departamentos.nome', 'PODER LEGISLATIVO MUNICIPAL'];
                            break;
                        case 'Lotação Legislativo Estadual':
                            $whereClauses[] = ['departamentos.nome', 'PODER LEGISLATIVO ESTADUAL'];
                            break;
                        case 'Lotação Legislativo Federal':
                            $whereClauses[] = ['departamentos.nome', 'PODER LEGISLATIVO FEDERAL'];

                        default:
                            // Opção não reconhecida
                            break;
                    }
                }
            }

        return $whereClauses;
    }



public function listGrupos(Request $req) {

    $zgrupo_id = $req->get('zgrupo_id');
    if ($zgrupo_id === null || $zgrupo_id === 'undefined') {
        $zgrupo_id = '';
    }
    $zcons_filtro_and = $req->get('zcons_filtro_and');
    if ($zcons_filtro_and === null || $zcons_filtro_and === 'undefined') {
        $zcons_filtro_and = '';
    }
    $zcons_filtro_or = $req->get('zcons_filtro_or');
    if ($zcons_filtro_or === null || $zcons_filtro_or === 'undefined') {
        $zcons_filtro_or = '';
    }
    $zdp_filtro = $req->get('zdp_filtro');
    if ($zdp_filtro === null || $zdp_filtro === 'undefined') {
        $zdp_filtro = '';
    }
    $zdp_id = $req->get('zdp_id');
    if ($zdp_id === null || $zdp_id === 'undefined') {
        $zdp_id = '';
    }
    $zcons_cidade_id = $req->get('zcons_cidade_id');
    if ($zcons_cidade_id === null || $zcons_cidade_id === 'undefined') {
        $zcons_cidade_id = '';
    }
    $zcons_servidor_classificacao = $req->get('zcons_servidor_classificacao');
    if ($zcons_servidor_classificacao === null || $zcons_servidor_classificacao === 'undefined') {
        $zcons_servidor_classificacao = '';
    }
    $zids = $req->get('zids');
            if ($zids === null || $zids === 'undefined') {
                $zids = '';
            }

            $zfiltros_adcionais = $req->get('zfiltros_adcionais');
            if ($zfiltros_adcionais === null || $zfiltros_adcionais === 'undefined') {
                $zfiltros_adcionais = '';
            }

  //  try {

       $query = DepartamentoGrupo::select(
            DB::raw("departamento_grupos.id as grupo_id"),
            DB::raw("departamento_grupos.nome"),
            DB::raw("case when departamento_grupos.nome like '%DRP%' then 'REGIONAL' else 'DEMAIS UNIDADES' end as seletor_ordenacao"),
            DB::raw("departamento_grupos.descricao"),
            DB::raw("departamento_grupos.imagem_grupo"),
            DB::raw("departamento_grupos.fun_cad_id"),
            DB::raw("departamento_grupos.fun_cad"),
            DB::raw("departamento_grupos.fun_up_id"),
            DB::raw("departamento_grupos.fun_up"),
            DB::raw("departamento_grupos.departamento_correspondente_id"),
            DB::raw("dep_corresp.telefone as telefone"),
            DB::raw("dep_corresp.telefone2 as telefone2"),
            DB::raw("dep_corresp.telefone3 as telefone3"),
            DB::raw("dep_corresp.municipioid as cidade_id"),
            DB::raw("dep_corresp.municipio as cidade"),
            DB::raw("serv_titular.nome as titular"),
            DB::raw("CONCAT_WS(' ', split_part(serv_titular.nome, ' ', 1), split_part(serv_titular.nome, ' ', -1)) as titular_abreviado"),
            DB::raw("serv_titular.celular as titular_contato"),
            DB::raw("TO_CHAR(departamento_grupos.created_at, 'DD/MM/YYYY HH:MI') as dta_registro_br"),
            DB::raw("TO_CHAR(departamento_grupos.updated_at, 'DD/MM/YYYY HH:MI') as dta_alteracao_br"),
            DB::raw("count(distinct departamentos.id) as dep_qtd"),
            DB::raw("count(distinct departamentos.id) FILTER (WHERE departamentos.escala='PLANTÃO') as dep_plantao_qtd"),
            DB::raw("count(distinct departamentos.id) FILTER (WHERE departamentos.imovel_status like '%PROPRIO%') as dep_imovel_proprio_qtd"),
            DB::raw("count(distinct departamentos.id) FILTER (WHERE departamentos.imovel_status like '%ALUGADO%') as dep_imovel_alugado_qtd"),
            DB::raw("count(distinct departamentos.id) FILTER (WHERE departamentos.imovel_status like '%CEDIDO%') as dep_imovel_cedido_qtd"),
            DB::raw("count(distinct departamentos.id) FILTER (WHERE departamentos.titular_interino_id is not null or departamentos.chefe_cartorio_interino_id is not null) as dep_interino_qtd"),
            DB::raw("count(distinct servidors.id) as servidores_qtd"),
            DB::raw("count(distinct servidors.id) FILTER (WHERE servidors.funcao like '%DELEGAD%') as servidores_delegados"),
            DB::raw("count(distinct servidors.id) FILTER (WHERE servidors.funcao like '%ESCR%') as servidores_escrivaes"),
            DB::raw("count(distinct servidors.id) FILTER (WHERE servidors.funcao like '%AGENTE%' or servidors.cargo like '%AGENTE%') as servidores_agentes"),
            DB::raw("count(distinct departamentos.municipioid) as qtd_municipios"),
            DB::raw("string_agg(distinct departamentos.municipio, ', ') as municipios"),
            DB::raw("count(distinct scobe.obras.id) as obras_qtd"),
            DB::raw("count(distinct vtr.veiculos.id) as vtrs_qtd"),
            DB::raw("string_agg(distinct CASE scobe.obras.tipo
                        WHEN 'AMP' THEN 'Ampliação/Reforma'
                        WHEN 'CON' THEN 'Construção'
                        WHEN 'REF' THEN 'Reforma'
                        WHEN 'SER' THEN 'Serviço Engenharia'
                        ELSE scobe.obras.tipo
                        END||' '||dep_obras.nome, ', ') as obras_departamentos"),

            DB::raw("count(distinct processo.processos.id) as solicitacoes_processos_qtd"),
             DB::raw("string_agg(distinct processos_obras.nome, ', ') as solicitacoes_processos_departamentos"),
        )
        ->leftJoin('departamentos', function($join) {
            $join->on('departamentos.departamento_grupo_id', '=', 'departamento_grupos.id')
                ->where('departamentos.status', true);
        })
        ->leftJoin('departamentos as dep_corresp', 'dep_corresp.id', '=', 'departamento_grupos.departamento_correspondente_id')
        ->leftJoin('servidors', 'servidors.lotacao_id', '=', 'departamentos.id')
        ->leftJoin('servidors as serv_titular', 'serv_titular.id', '=', 'dep_corresp.titular_id')

        ->leftJoin('vtr.veiculos', function($join) {
            $join->on('vtr.veiculos.departamento_id', '=', 'departamentos.id')
                ->where('vtr.veiculos.status', '<>', 'INATIVO');
        })
        ->leftJoin('scobe.obras', function($join) {
            $join->on('scobe.obras.departamento_id', '=', 'departamentos.id')
                ->where('scobe.obras.status', '<>', '9INA')
                ->where('scobe.obras.status', '<>', '9CAN');
        })
        ->leftJoin('departamentos as dep_obras', 'dep_obras.id', '=', 'scobe.obras.departamento_id')


        ->leftJoin('processo.processos', function($join) {
            $join->on('processo.processos.dp_origem_id', '=', 'departamentos.id')
                ->where('processo.processos.status_processo', 'PENDENTE')
                ->where('processo.processos.grupo_id', '2');
        })
        ->leftJoin('departamentos as processos_obras', 'processos_obras.id', '=', 'processo.processos.dp_origem_id')

        ->where(function ($query) use ($zcons_servidor_classificacao, $zcons_cidade_id, $zids, $zfiltros_adcionais, $zdp_id, $zcons_filtro_and, $zcons_filtro_or, $zdp_filtro, $zgrupo_id) {


                        if($zids!=''){//Filtro por ids
                            // Converta a string de IDs para um array usando explode
                            $idsArray = explode(',', $zids);

                            // Remova espaços em branco dos IDs no array
                            $idsArray = array_map('trim', $idsArray);

                            // Filtro usando WHERE IN
                            $query->whereIn('departamentos.id', $idsArray);
                        }//Filtro por ids

                        if($zfiltros_adcionais!=='COM_ORGANIZACIONAIS'){
                            $query->whereNot('departamentos.especializacao', 'ORGANIZACIONAL');
                        }else{
                            $query->where('departamentos.especializacao', 'ORGANIZACIONAL');
                        }

                        if ($zgrupo_id!='') {
                            if ($zgrupo_id!='-1') {
                                $query->Where('departamento_grupos.id', $zgrupo_id);
                            }
                        }
                        if ($zdp_id!='') {
                            if ($zdp_id!='-1') {
                                $query->Where('departamentos.id', $zdp_id);
                            }
                        }

                        if ($zcons_cidade_id!='') {
                            $query->Where('dep_corresp.municipioid', $zcons_cidade_id);
                        }


                        if (!empty($zcons_servidor_classificacao)) {
                            switch ($zcons_servidor_classificacao) {
                                case 'SEM':
                                    $query->where(function($query) {
                                        $query->where('servidors.classificacao', '')
                                            ->orWhereNull('servidors.classificacao');
                                    });
                                    break;

                                case 'POLICIAL':
                                    $query->whereIn('servidors.classificacao', ['DELEGADO', 'ESCRIVAO', 'AGENTE', 'PAPILOSCOPISTA']);
                                    break;

                                case 'NAOPOLICIAL':
                                    $query->whereNotIn('servidors.classificacao', ['DELEGADO', 'ESCRIVAO', 'AGENTE', 'PAPILOSCOPISTA']);
                                    break;

                                /*case 'DELEGADO_TITULAR':
                                    $query->whereColumn('departamentos.titular_id', 'servidors.id')
                                        ->where('servidors.classificacao', $zcons_servidor_classificacao);
                                    break;

                                case 'DELEGADO_INTERINO':
                                    $query->whereColumn('departamentos.titular_interino_id', 'servidors.id')
                                        ->where('servidors.classificacao', $zcons_servidor_classificacao);
                                    break;*/

                                default:
                                    $query->where('servidors.classificacao', $zcons_servidor_classificacao);
                                    break;
                            }
                        }




                        if (!empty($zcons_filtro_or)) {
                            $whereClausesOr = $this->buildWhereClauses($zcons_filtro_or);
                            $query->where(function ($query) use ($whereClausesOr) {
                                foreach ($whereClausesOr as $clause) {
                                    $query->orWhere(...$clause);
                                }
                            });
                        }

                        if (!empty($zcons_filtro_and)) {
                            $whereClausesAnd = $this->buildWhereClauses($zcons_filtro_and);
                            $query->where(function ($query) use ($whereClausesAnd) {
                                foreach ($whereClausesAnd as $clause) {
                                    $query->where(...$clause);
                                }
                            });
                        }

                       /* if ($zdp_filtro != '') {
                                $query->where(function ($query) use ($zdp_filtro) {
                                $query->orWhere('departamentos.hierarquia', 'ilike', '%' . strtoupper($zdp_filtro) . '%')
                                    ->orWhere('departamento_grupos.nome', 'ilike', '%' . strtoupper($zdp_filtro) . '%')
                                    ->orWhere('departamentos.nome', 'ilike', '%' . strtoupper($zdp_filtro) . '%')
                                    ->orWhere('dep_corresp.municipio', 'ilike', '%' . strtoupper($zdp_filtro) . '%')
                                    ->orWhere('departamentos.sigla', 'ilike', '%' . strtoupper($zdp_filtro) . '%')
                                    ->orWhere('departamentos.superior', 'ilike', '%' . strtoupper($zdp_filtro) . '%');
                            });
                        }*/



                     if ($zdp_filtro != '') {
                            $filtroSemAcento = strtoupper($zdp_filtro);
                            $query->where(function ($query) use ($filtroSemAcento) {
                                $query->orWhere(\DB::raw('UPPER(departamento_grupos.nome)'), 'ilike', '%' . $filtroSemAcento . '%');
                            });
                        }

                })
        ->groupBy(
            "departamento_grupos.id",
            "departamento_grupos.nome",
            "departamento_grupos.descricao",
            "departamento_grupos.imagem_grupo",
            "departamento_grupos.fun_cad_id",
            "departamento_grupos.fun_cad",
            "departamento_grupos.fun_up_id",
            "departamento_grupos.fun_up",
            "departamento_grupos.created_at",
            "departamento_grupos.updated_at",
            "departamento_grupos.departamento_correspondente_id",
            "dep_corresp.telefone",
            "dep_corresp.telefone2",
            "dep_corresp.telefone3",
            "serv_titular.nome",
            "serv_titular.celular",
            "dep_corresp.municipioid",
            "dep_corresp.municipio",
        )

        ->orderBy('departamento_grupos.id');

        $retorno = $query->get();

        return response()->json(['message' => 'ok', 'sql' => '', 'retorno' => $retorno, ], 200);//query->toSql()
   /* } catch(\Throwable $th) {
        return response()->json(['message' => 'Erro ao tentar buscar Origem! ' . $th->getMessage()], 400);
    }*/
}


public function listGruposSaap(Request $req) {

    $zgrupo_id = $req->get('zgrupo_id');
    if ($zgrupo_id === null || $zgrupo_id === 'undefined') {
        $zgrupo_id = '';
    }
    $zcons_filtro_and = $req->get('zcons_filtro_and');
    if ($zcons_filtro_and === null || $zcons_filtro_and === 'undefined') {
        $zcons_filtro_and = '';
    }
    $zcons_filtro_or = $req->get('zcons_filtro_or');
    if ($zcons_filtro_or === null || $zcons_filtro_or === 'undefined') {
        $zcons_filtro_or = '';
    }
    $zdp_filtro = $req->get('zdp_filtro');
    if ($zdp_filtro === null || $zdp_filtro === 'undefined') {
        $zdp_filtro = '';
    }
    $zdp_id = $req->get('zdp_id');
    if ($zdp_id === null || $zdp_id === 'undefined') {
        $zdp_id = '';
    }
    $zcons_cidade_id = $req->get('zcons_cidade_id');
    if ($zcons_cidade_id === null || $zcons_cidade_id === 'undefined') {
        $zcons_cidade_id = '';
    }
    $zcons_servidor_classificacao = $req->get('zcons_servidor_classificacao');
    if ($zcons_servidor_classificacao === null || $zcons_servidor_classificacao === 'undefined') {
        $zcons_servidor_classificacao = '';
    }
    $zids = $req->get('zids');
            if ($zids === null || $zids === 'undefined') {
                $zids = '';
            }

            $zfiltros_adcionais = $req->get('zfiltros_adcionais');
            if ($zfiltros_adcionais === null || $zfiltros_adcionais === 'undefined') {
                $zfiltros_adcionais = '';
            }


            $zcons_status = $req->get('zcons_status');
            if ($zcons_status === null || $zcons_status === 'undefined') {
                $zcons_status = 'TODOS_ATIVOS';
            }
            $zcons_data_tipo = $req->get('zcons_data_tipo');
            if ($zcons_data_tipo === null || $zcons_data_tipo === 'undefined') {
                $zcons_data_tipo = 'DTA_NENHUMA';
            }
           /* $zcons_datai = $req->get('zcons_datai');
            if ($zcons_datai === null || $zcons_datai === 'undefined') {
                $zcons_datai = '';
            }
            $zcons_dataf = $req->get('zcons_dataf');
            if ($zcons_dataf === null || $zcons_dataf === 'undefined') {
                $zcons_dataf = '';
            }*/

             $zcons_datai = $req->has('zcons_datai') ? $req->get('zcons_datai') : null;

            if ($zcons_datai === null || $zcons_datai === 'undefined') {
                $zcons_datai = '';
            } else {
                $zcons_datai = Carbon::parse($zcons_datai)->format('Y-m-d');
            }

            $zcons_dataf = $req->has('zcons_dataf') ? $req->get('zcons_dataf') : null;

            if ($zcons_dataf === null || $zcons_dataf === 'undefined') {
                $zcons_dataf = '';
            } else {
                $zcons_dataf = Carbon::parse($zcons_dataf)->addDay()->format('Y-m-d');
            }

  //  try {

       $query = DepartamentoGrupo::select(
            DB::raw("departamento_grupos.id as grupo_id"),
            DB::raw("departamento_grupos.nome"),
            DB::raw("case when departamento_grupos.nome like '%DRP%' then 'REGIONAL' else 'DEMAIS UNIDADES' end as seletor_ordenacao"),
            DB::raw("departamento_grupos.descricao"),
            DB::raw("departamento_grupos.imagem_grupo"),
            DB::raw("departamento_grupos.fun_cad_id"),
            DB::raw("departamento_grupos.fun_cad"),
            DB::raw("departamento_grupos.fun_up_id"),
            DB::raw("departamento_grupos.fun_up"),
            DB::raw("departamento_grupos.departamento_correspondente_id"),
            DB::raw("dep_corresp.telefone as telefone"),
            DB::raw("dep_corresp.telefone2 as telefone2"),
            DB::raw("dep_corresp.telefone3 as telefone3"),
            DB::raw("dep_corresp.municipioid as cidade_id"),
            DB::raw("dep_corresp.municipio as cidade"),
            DB::raw("serv_titular.nome as titular"),
            DB::raw("CONCAT_WS(' ', split_part(serv_titular.nome, ' ', 1), split_part(serv_titular.nome, ' ', -1)) as titular_abreviado"),
            DB::raw("serv_titular.celular as titular_contato"),
            DB::raw("TO_CHAR(departamento_grupos.created_at, 'DD/MM/YYYY HH:MI') as dta_registro_br"),
            DB::raw("TO_CHAR(departamento_grupos.updated_at, 'DD/MM/YYYY HH:MI') as dta_alteracao_br"),
            DB::raw("count(distinct departamentos.id) as dep_qtd"),
            DB::raw("count(distinct departamentos.id) FILTER (WHERE departamentos.escala='PLANTÃO') as dep_plantao_qtd"),
            DB::raw("count(distinct departamentos.id) FILTER (WHERE departamentos.imovel_status like '%PROPRIO%') as dep_imovel_proprio_qtd"),
            DB::raw("count(distinct departamentos.id) FILTER (WHERE departamentos.imovel_status like '%ALUGADO%') as dep_imovel_alugado_qtd"),
            DB::raw("count(distinct departamentos.id) FILTER (WHERE departamentos.imovel_status like '%CEDIDO%') as dep_imovel_cedido_qtd"),
            DB::raw("count(distinct departamentos.id) FILTER (WHERE departamentos.titular_interino_id is not null or departamentos.chefe_cartorio_interino_id is not null) as dep_interino_qtd"),
            DB::raw("count(distinct servidors.id) as servidores_qtd"),
            DB::raw("count(distinct servidors.id) FILTER (WHERE servidors.funcao like '%DELEGAD%') as servidores_delegados"),
            DB::raw("count(distinct servidors.id) FILTER (WHERE servidors.funcao like '%ESCR%') as servidores_escrivaes"),
            DB::raw("count(distinct servidors.id) FILTER (WHERE servidors.funcao like '%AGENTE%' or servidors.cargo like '%AGENTE%') as servidores_agentes"),
            DB::raw("count(distinct departamentos.municipioid) as qtd_municipios"),
            DB::raw("string_agg(distinct departamentos.municipio, ', ') as municipios"),
            DB::raw("count(distinct scobe.obras.id) as obras_qtd"),
            DB::raw("viaturas.qtd as vtrs_qtd"),
            DB::raw("string_agg(distinct CASE scobe.obras.tipo
                        WHEN 'AMP' THEN 'Ampliação/Reforma'
                        WHEN 'CON' THEN 'Construção'
                        WHEN 'REF' THEN 'Reforma'
                        WHEN 'SER' THEN 'Serviço Engenharia'
                        ELSE scobe.obras.tipo
                        END||' '||dep_obras.nome, ', ') as obras_departamentos"),

            DB::raw("count(distinct processo.processos.id) as solicitacoes_processos_qtd"),
             DB::raw("string_agg(distinct processos_obras.nome, ', ') as solicitacoes_processos_departamentos"),
        )
        ->leftJoin('departamentos', function($join) {
            $join->on('departamentos.departamento_grupo_id', '=', 'departamento_grupos.id')
                ->where('departamentos.status', true);
        })
        ->leftJoin('departamentos as dep_corresp', 'dep_corresp.id', '=', 'departamento_grupos.departamento_correspondente_id')



        ->leftJoin('servidors', function ($join) use ($zcons_status) {
            $join->on('servidors.lotacao_id', '=', 'departamentos.id');

            // Adiciona a condição somente se $zcons_status não for 'TODOS'
            if ($zcons_status === 'TODOS_ATIVOS') {
                $join->where('servidors.status', '=', 'ATIVO');
            }
            if ($zcons_status === 'INATIVO') {
                $join->where('servidors.status', '=', 'INATIVO');
            }
        })

        ->leftJoin('servidors as serv_titular', 'serv_titular.id', '=', 'dep_corresp.titular_id')


        ->leftJoin('scobe.obras', function($join) {
            $join->on('scobe.obras.departamento_id', '=', 'departamentos.id')
                ->where('scobe.obras.status', '<>', '9INA')
                ->where('scobe.obras.status', '<>', '9CAN');
        })
        ->leftJoin('departamentos as dep_obras', 'dep_obras.id', '=', 'scobe.obras.departamento_id')

        ->leftJoin(
            DB::raw('(SELECT dep.departamento_grupo_id, COUNT(*) as qtd
            FROM vtr.veiculos
            JOIN departamentos dep on dep.id=vtr.veiculos.departamento_id
            WHERE vtr.veiculos.status <> $$INATIVO$$
            GROUP BY dep.departamento_grupo_id) as viaturas'),
            'viaturas.departamento_grupo_id',
            '=',
            'departamento_grupos.id'
        )
        ->leftJoin('processo.processos', function($join) {
            $join->on('processo.processos.dp_origem_id', '=', 'departamentos.id')
                ->where('processo.processos.status_processo', 'PENDENTE')
                ->where('processo.processos.grupo_id', '2');
        })
        ->leftJoin('departamentos as processos_obras', 'processos_obras.id', '=', 'processo.processos.dp_origem_id')

        ->where(function ($query) use ($zcons_data_tipo, $zcons_datai, $zcons_dataf, $zcons_servidor_classificacao, $zcons_cidade_id, $zids, $zfiltros_adcionais, $zdp_id, $zcons_filtro_and, $zcons_filtro_or, $zdp_filtro, $zgrupo_id) {


                        if($zids!=''){//Filtro por ids
                            // Converta a string de IDs para um array usando explode
                            $idsArray = explode(',', $zids);

                            // Remova espaços em branco dos IDs no array
                            $idsArray = array_map('trim', $idsArray);

                            // Filtro usando WHERE IN
                            $query->whereIn('departamentos.id', $idsArray);
                        }else{
                            if($zcons_data_tipo!='DTA_NENHUMA'){
                                if($zcons_data_tipo=='ANIVERSARIO'){
                                    $xwhere_data='servidors.dta_nascimento';
                                }
                                if($zcons_data_tipo=='DTA_NOMEACAO'){
                                    $xwhere_data='servidors.dta_nomeacao';
                                }
                                if($zcons_data_tipo=='DTA_POSSE'){
                                    $xwhere_data='servidors.dta_posse';
                                }
                                if($zcons_data_tipo=='INICIO'){
                                    $xwhere_data='servidors.dtai';
                                }
                                if($zcons_data_tipo=='FIM'){
                                    $xwhere_data='servidors.dtaf';
                                }
                                if($zcons_data_tipo=='ANIVERSARIO'){
                                    $xwhere_data='servidors.dta_nascimento';
                                }

                                $query->Where(function ($query) use ($xwhere_data, $zcons_datai, $zcons_dataf) {
                                    $query->whereRaw("$xwhere_data between ? and ?", [$zcons_datai, $zcons_dataf]);
                                });
                            }
                        }

                        if($zfiltros_adcionais!=='COM_ORGANIZACIONAIS'){
                            $query->whereNot('departamentos.especializacao', 'ORGANIZACIONAL');
                        }else{
                            $query->where('departamentos.especializacao', 'ORGANIZACIONAL');
                        }

                        if ($zgrupo_id!='') {
                            if ($zgrupo_id!='-1') {
                                $query->Where('departamento_grupos.id', $zgrupo_id);
                            }
                        }
                        if ($zdp_id!='') {
                            if ($zdp_id!='-1') {
                                $query->Where('departamentos.id', $zdp_id);
                            }
                        }

                        if ($zcons_cidade_id!='') {
                            $query->Where('dep_corresp.municipioid', $zcons_cidade_id);
                        }


                        if (!empty($zcons_servidor_classificacao)) {
                            switch ($zcons_servidor_classificacao) {
                                case 'SEM':
                                    $query->where(function($query) {
                                        $query->where('servidors.classificacao', '')
                                            ->orWhereNull('servidors.classificacao');
                                    });
                                    break;

                                case 'POLICIAL':
                                    $query->whereIn('servidors.classificacao', ['DELEGADO', 'ESCRIVAO', 'AGENTE', 'PAPILOSCOPISTA']);
                                    break;

                                case 'NAOPOLICIAL':
                                    $query->whereNotIn('servidors.classificacao', ['DELEGADO', 'ESCRIVAO', 'AGENTE', 'PAPILOSCOPISTA']);
                                    break;

                                /*case 'DELEGADO_TITULAR':
                                    $query->whereColumn('departamentos.titular_id', 'servidors.id')
                                        ->where('servidors.classificacao', $zcons_servidor_classificacao);
                                    break;

                                case 'DELEGADO_INTERINO':
                                    $query->whereColumn('departamentos.titular_interino_id', 'servidors.id')
                                        ->where('servidors.classificacao', $zcons_servidor_classificacao);
                                    break;*/

                                default:
                                    $query->where('servidors.classificacao', $zcons_servidor_classificacao);
                                    break;
                            }
                        }




                        if (!empty($zcons_filtro_or)) {
                            $whereClausesOr = $this->buildWhereClauses($zcons_filtro_or);
                            $query->where(function ($query) use ($whereClausesOr) {
                                foreach ($whereClausesOr as $clause) {
                                    $query->orWhere(...$clause);
                                }
                            });
                        }

                        if (!empty($zcons_filtro_and)) {
                            $whereClausesAnd = $this->buildWhereClauses($zcons_filtro_and);
                            $query->where(function ($query) use ($whereClausesAnd) {
                                foreach ($whereClausesAnd as $clause) {
                                    $query->where(...$clause);
                                }
                            });
                        }

                       /* if ($zdp_filtro != '') {
                                $query->where(function ($query) use ($zdp_filtro) {
                                $query->orWhere('departamentos.hierarquia', 'ilike', '%' . strtoupper($zdp_filtro) . '%')
                                    ->orWhere('departamento_grupos.nome', 'ilike', '%' . strtoupper($zdp_filtro) . '%')
                                    ->orWhere('departamentos.nome', 'ilike', '%' . strtoupper($zdp_filtro) . '%')
                                    ->orWhere('dep_corresp.municipio', 'ilike', '%' . strtoupper($zdp_filtro) . '%')
                                    ->orWhere('departamentos.sigla', 'ilike', '%' . strtoupper($zdp_filtro) . '%')
                                    ->orWhere('departamentos.superior', 'ilike', '%' . strtoupper($zdp_filtro) . '%');
                            });
                        }*/



                     if ($zdp_filtro != '') {
                            $filtroSemAcento = strtoupper($zdp_filtro);
                            $query->where(function ($query) use ($filtroSemAcento) {
                                $query->orWhere(\DB::raw('UPPER(departamento_grupos.nome)'), 'ilike', '%' . $filtroSemAcento . '%');
                            });
                        }

                })
        ->groupBy(
            "departamento_grupos.id",
            "departamento_grupos.nome",
            "departamento_grupos.descricao",
            "departamento_grupos.imagem_grupo",
            "departamento_grupos.fun_cad_id",
            "departamento_grupos.fun_cad",
            "departamento_grupos.fun_up_id",
            "departamento_grupos.fun_up",
            "departamento_grupos.created_at",
            "departamento_grupos.updated_at",
            "departamento_grupos.departamento_correspondente_id",
            "dep_corresp.telefone",
            "dep_corresp.telefone2",
            "dep_corresp.telefone3",
            "serv_titular.nome",
            "serv_titular.celular",
            "dep_corresp.municipioid",
            "dep_corresp.municipio",
            'viaturas.qtd'
        )

        ->orderBy('departamento_grupos.id');

        $retorno = $query->get();

        return response()->json(['message' => 'ok', 'sql' => '', 'retorno' => $retorno, ], 200);//query->toSql()
   /* } catch(\Throwable $th) {$query->toSql()
        return response()->json(['message' => 'Erro ao tentar buscar Origem! ' . $th->getMessage()], 400);
    }*/
}

    public function GrupoSave(Request $request) {
        try {
            $new = $request->post('values');

            $DepartamentoGrupo = DepartamentoGrupo::where('id', $new['grupo_id'])->first();
            if ($DepartamentoGrupo) {
                $DepartamentoGrupo->update([
                    'nome' => $new['nome'],
                    'descricao' => !isset($new['descricao']) ? null : $new['descricao'],
                    'titular_sicad_id' => !isset($new['titular_sicad_id']) ? null : $new['titular_sicad_id'],
                    'titular_nome' => !isset($new['titular_nome']) ? null : $new['titular_nome'],
                    'titular_contato' => !isset($new['titular_contato']) ? null : $new['titular_contato'],
                    'updated_at' => now(),
                    'fun_up_id' => $new['user_observatorio_id'],
                    'fun_up' => $new['user_observatorio'],
                    // Outros atributos que você deseja atualizar
                ]);

                $novoID = $DepartamentoGrupo->id;


            } else {
                $DepartamentoGrupo = DepartamentoGrupo::create([
                    'nome' => $new['nome'],
                    'descricao' => !isset($new['descricao']) ? null : $new['descricao'],
                    'titular_sicad_id' => !isset($new['titular_sicad_id']) ? null : $new['titular_sicad_id'],
                    'titular_nome' => !isset($new['titular_nome']) ? null : $new['titular_nome'],
                    'titular_contato' => !isset($new['titular_contato']) ? null : $new['titular_contato'],
                    'fun_cad_id' => $new['user_observatorio_id'],
                    'fun_cad' => $new['user_observatorio'],
                ]);



                $novoID = $DepartamentoGrupo->id;

            }
            $message = 'Alterado com sucesso.';

             return response()->json(['message' => $message, 'id' => $novoID], 200);

        } catch (\Throwable $th) {
            $new = $request->post('values');
            return response()->json(['message' => 'Erro ao tentar gravar. '.$th->getMessage()], 400);
        }
    }




    public function DepartamentoSave(Request $request) {
        try {
            $new = $request->post('values');

            $Departamento = Departamento::where('id', $new['departamento_id'])->first();
            if ($Departamento) {
                $Departamento->update([
                    'nome' => $new['nome'],
                    'sigla' => $new['sigla'],
                    'tipo' => !isset($new['tipo']) ? null : $new['tipo'],
                    'hierarquia' => !isset($new['hierarquia']) ? null : $new['hierarquia'],
                    'especializacao' => !isset($new['especializacao']) ? null : $new['especializacao'],
                    'portaria' => !isset($new['portaria']) ? null : $new['portaria'],
                    'departamento_grupo_id' => !isset($new['departamento_grupo_id']) ? null : $new['departamento_grupo_id'],
                    'escala' => !isset($new['escala']) ? null : $new['escala'],
                    'titular_id' => !isset($new['titular_id']) ? null : $new['titular_id'],
                    'titular_interino_id' => !isset($new['titular_interino_id']) ? null : $new['titular_interino_id'],
                    'chefe_cartorio_id' => !isset($new['chefe_cartorio_id']) ? null : $new['chefe_cartorio_id'],
                    'chefe_cartorio_interino_id' => !isset($new['chefe_cartorio_interino_id']) ? null : $new['chefe_cartorio_interino_id'],
                    'imovel_status' => !isset($new['imovel_status']) ? null : $new['imovel_status'],
                    'valor_contrato' => !isset($new['valor_contrato']) ? 0 : $new['valor_contrato'],
                    'municipioid' => !isset($new['municipioid']) ? null : $new['municipioid'],
                    'municipio' => !isset($new['municipio']) ? null : $new['municipio'],
                    'telefone' => !isset($new['telefone']) ? null : $new['telefone'],
                    'telefone2' => !isset($new['telefone2']) ? null : $new['telefone2'],
                    'telefone3' => !isset($new['telefone3']) ? null : $new['telefone3'],
                    'updated_at' => now(),
                    'fun_up_id' => $new['user_observatorio_id'],
                    'fun_up' => $new['user_observatorio'],
                    // Outros atributos que você deseja atualizar
                ]);

                $novoID = $Departamento->id;

                if ($new['titular_id'] || $new['titular_interino_id']) {
                    // Verifica se há um registro de histórico correspondente
                    $ultimoHistorico = DepartamentoHistorico::where('departamento_id', $new['departamento_id'])
                        ->latest() // Busca o último registro
                        ->first();

                    // Verifica se o último histórico não é igual aos novos dados
                    if (
                        !$ultimoHistorico ||
                        $ultimoHistorico->titular_id !== $new['titular_id'] ||
                        $ultimoHistorico->titular_interino_id !== $new['titular_interino_id']
                    ) {
                        // Cria o histórico se não houver um registro correspondente
                        DepartamentoHistorico::create([
                            'departamento_id' => $new['departamento_id'],
                            'titular_id' => $new['titular_id'],
                            'titular_interino_id' => $new['titular_interino_id'],
                            'fun_cad' => $new['user_observatorio'],
                        ]);
                    }
                }

                $descricao = 'Dados Informados -> ';
                $descricao .= isset($new['nome']) ? $new['nome'].' ' : '';
                $descricao .= isset($new['sigla']) ? $new['sigla'].' ' : '';
                $descricao .= isset($new['tipo']) ? $new['tipo'].' ' : '';
                $descricao .= isset($new['hierarquia']) ? $new['hierarquia'].' ' : '';
                $descricao .= isset($new['especializacao']) ? $new['especializacao'].' ' : '';
                $descricao .= isset($new['portaria']) ? $new['portaria'].' ' : '';
                $descricao .= isset($new['escala']) ? $new['escala'].' ' : '';
                $descricao .= isset($new['municipio']) ? $new['municipio'].' ' : '';
                $descricao .= 'Imovel: '.(isset($new['imovel_status']) ? $new['imovel_status'].' ' : '');
                $descricao .= 'Valor: '.(isset($new['valor_contrato']) ? $new['valor_contrato'].' ' : '');
                $descricao .= 'Grupo Id: '.(isset($new['departamento_grupo_id']) ? $new['departamento_grupo_id'].' ' : '');
                $descricao .= 'Titular Id: '.(isset($new['titular_id']) ? $new['titular_id'].' ' : '');
                $descricao .= 'Interino Id: '.(isset($new['titular_interino_id']) ? $new['titular_interino_id'].' ' : '');
                $descricao .= 'Chefe Id: '.(isset($new['chefe_cartorio_id']) ? $new['chefe_cartorio_id'].' ' : '');
                $descricao .= 'Telefone: '.(isset($new['telefone']) ? $new['telefone'].' ' : '');
                $descricao .= 'Telefone 2: '.(isset($new['telefone2']) ? $new['telefone2'].' ' : '');
                $descricao .= 'Telefone 3: '.(isset($new['telefone3']) ? $new['telefone3'].' ' : '');
                $descricao .= 'Chefe Interino Id: '.(isset($new['chefe_cartorio_interino_id']) ? $new['chefe_cartorio_interino_id'].' ' : '');

                DepartamentoAuditoria::create([
                    'departamento_id' => $Departamento->id,
                    'funcao' => 'Alterou', // Alterou, Excluiu, Incluiu
                    'descricao' => $descricao,
                    'fun_cad_id' => $new['user_observatorio_id'],
                    'fun_cad' => $new['user_observatorio'],
                ]);


                $message = 'Alterado com sucesso.';
                return response()->json(['message' => $message, 'id' => $novoID], 200);

            } else {
                /*$Departamento = Departamento::create([
                    'tipo' => !isset($new['tipo']) ? null : $new['tipo'],
                    'hierarquia' => !isset($new['hierarquia']) ? null : $new['hierarquia'],
                    'especializacao' => !isset($new['especializacao']) ? null : $new['especializacao'],
                    'portaria' => !isset($new['portaria']) ? null : $new['portaria'],
                    'departamento_grupo_id' => !isset($new['departamento_grupo_id']) ? null : $new['departamento_grupo_id'],
                    'escala' => !isset($new['escala']) ? null : $new['escala'],
                    'titular_sicad_id' => !isset($new['titular_sicad_id']) ? null : $new['titular_sicad_id'],
                    'titular_nome' => !isset($new['titular_nome']) ? null : $new['titular_nome'],
                    'titular_contato' => !isset($new['titular_contato']) ? null : $new['titular_contato'],
                    'updated_at' => now(),
                    'fun_up_id' => $new['user_observatorio_id'],
                    'fun_up' => $new['user_observatorio'],
                    'fun_cad_id' => $new['user_observatorio_id'],
                    'fun_cad' => $new['user_observatorio'],
                ]);



                $novoID = $Departamento->id;*/

                $message = 'Departamento não encontrado.';
                return response()->json(['message' => $message], 400);

            }




        } catch (\Throwable $th) {
            $new = $request->post('values');
            return response()->json(['message' => 'Erro ao tentar gravar. '.$th->getMessage()], 400);
        }
    }



public function listDepartamentosGeral(Request $req) {
   // try {


            $zdrp_id = $req->get('zdrp_id');
            if ($zdrp_id === null || $zdrp_id === 'undefined') {
                $zdrp_id = '';
            }
            $zdp_id = $req->get('zdp_id');
            if ($zdp_id === null || $zdp_id === 'undefined') {
                $zdp_id = '';
            }
            $zcons_filtro_and = $req->get('zcons_filtro_and');
            if ($zcons_filtro_and === null || $zcons_filtro_and === 'undefined') {
                $zcons_filtro_and = '';
            }
            $zcons_filtro_or = $req->get('zcons_filtro_or');
            if ($zcons_filtro_or === null || $zcons_filtro_or === 'undefined') {
                $zcons_filtro_or = '';
            }
            $zdp_filtro = $req->get('zdp_filtro');
            if ($zdp_filtro === null || $zdp_filtro === 'undefined') {
                $zdp_filtro = '';
            }
            $zgrupo = $req->get('zgrupo');
            if ($zgrupo === null || $zgrupo === 'undefined') {
                $zgrupo = '';
            }
            $zcons_servidor_classificacao = $req->get('zcons_servidor_classificacao');
            if ($zcons_servidor_classificacao === null || $zcons_servidor_classificacao === 'undefined') {
                $zcons_servidor_classificacao = '';
            }

            $zcons_cidade_id = $req->get('zcons_cidade_id');
            if ($zcons_cidade_id === null || $zcons_cidade_id === 'undefined') {
                $zcons_cidade_id = '';
            }

            $xorder="string_to_array(substring(departamentos.hierarquia, 1, length(departamentos.hierarquia) - 1), '.')::int[]";

            $zorder = $req->get('zorder');
            if ($zorder === null || $zorder === 'undefined') {
                $zorder = '';
            }
            if($zorder!=''){
                $xorder = match ($zorder) {
                    'TESTE' => 'departamentos.hierarquia, servidors.nome',
                    default => "string_to_array(substring(departamentos.hierarquia, 1, length(departamentos.hierarquia) - 1), '.')::int[]",
                };
            }


            $zids = $req->get('zids');
            if ($zids === null || $zids === 'undefined') {
                $zids = '';
            }

            $zfiltros_adcionais = $req->get('zfiltros_adcionais');
            if ($zfiltros_adcionais === null || $zfiltros_adcionais === 'undefined') {
                $zfiltros_adcionais = '';
            }

       $query = Departamento::select(
            DB::raw("departamentos.id"),
            DB::raw("departamentos.id as value"),
            DB::raw("departamentos.id as key"),
            DB::raw("departamentos.nome as title"),
            DB::raw("left(departamentos.hierarquia, length(departamentos.hierarquia) - 1) AS hierarquia_sem_ponto_final"),
            DB::raw("departamentos.hierarquia"),
            DB::raw("LEFT(LEFT(departamentos.hierarquia, LENGTH(departamentos.hierarquia) - 1), LENGTH(LEFT(departamentos.hierarquia, LENGTH(departamentos.hierarquia) - 1)) - POSITION('.' IN REVERSE(LEFT(departamentos.hierarquia, LENGTH(departamentos.hierarquia) - 1))))||'.' AS hierarquia_pai"),
            DB::raw("departamentos.tipo"),
            DB::raw("departamentos.especializacao"),
            DB::raw("departamentos.portaria"),
            DB::raw("departamentos.sigla"),
            DB::raw("coalesce(departamentos.municipio, '-') as municipio"),
            DB::raw("departamentos.municipioid"),
            DB::raw("cid.censo_vinte_tres"),
            DB::raw("departamentos.telefone"),
            DB::raw("departamentos.telefone2"),
            DB::raw("departamentos.telefone3"),
            DB::raw("departamentos.imovel_status"),
            DB::raw("departamentos.valor_contrato"),
            DB::raw("departamentos.escala"),
            DB::raw("departamentos.titular_id"),
            DB::raw("departamentos.status"),
            DB::raw("case when departamentos.status=true then 'ATIVA' else 'INATIVA' end as status_desc"),

            DB::raw("coalesce(serv_titular.nome, '') as titular"),
            DB::raw("CONCAT_WS(' ', split_part(serv_titular.nome, ' ', 1), split_part(serv_titular.nome, ' ', -1)) as titular_abreviado"),
            DB::raw("serv_titular.celular as titular_celular"),
            DB::raw("serv_titular.telefone as titular_telefone"),
            DB::raw("serv_titular.email as titular_email"),

            DB::raw("departamentos.titular_interino_id"),
            DB::raw("coalesce(serv_titular_interino.nome, '') as titular_interino"),
            DB::raw("CONCAT_WS(' ', split_part(serv_titular_interino.nome, ' ', 1), split_part(serv_titular_interino.nome, ' ', -1)) as interino_abreviado"),
            DB::raw("serv_titular_interino.celular as titular_interino_celular"),
            DB::raw("serv_titular_interino.telefone as titular_interino_telefone"),
            DB::raw("serv_titular_interino.email as titular_interino_email"),

            DB::raw("case when departamentos.titular_interino_id is not null then 'INTERINO' else 'TITULAR' end as responsavel_tipo"),
            DB::raw("case when departamentos.titular_interino_id is not null then departamentos.titular_interino_id else departamentos.titular_id end as responsavel_id"),
            DB::raw("case when departamentos.titular_interino_id is not null then serv_titular_interino.nome else serv_titular.nome end as responsavel_nome"),
            DB::raw("case when departamentos.titular_interino_id is not null then CONCAT_WS(' ', split_part(serv_titular_interino.nome, ' ', 1), split_part(serv_titular_interino.nome, ' ', -1)) else CONCAT_WS(' ', split_part(serv_titular.nome, ' ', 1), split_part(serv_titular.nome, ' ', -1)) end as responsavel_abreviado"),
            DB::raw("case when departamentos.titular_interino_id is not null then serv_titular_interino.celular else serv_titular.celular end as responsavel_celular"),
            DB::raw("case when departamentos.titular_interino_id is not null then serv_titular_interino.telefone else serv_titular.telefone end as responsavel_telefone"),
            DB::raw("case when departamentos.titular_interino_id is not null then serv_titular_interino.email else serv_titular.email end as responsavel_email"),

            DB::raw("departamentos.chefe_cartorio_interino_id"),
            DB::raw("coalesce(serv_chefe_interino.nome, '') as chefe_cartorio_interino"),
            DB::raw("CONCAT_WS(' ', split_part(serv_chefe_interino.nome, ' ', 1), split_part(serv_chefe_interino.nome, ' ', -1)) as chefe_cartorio_interino_abreviado"),
            DB::raw("serv_chefe_interino.celular as chefe_cartorio_interino_celular"),
            DB::raw("serv_chefe_interino.telefone as chefe_cartorio_interino_telefone"),
            DB::raw("serv_chefe_interino.email as chefe_cartorio_interino_email"),

            DB::raw("departamentos.chefe_cartorio_id"),
            DB::raw("coalesce(serv_chefe.nome, '') as chefe_cartorio"),
            DB::raw("CONCAT_WS(' ', split_part(serv_chefe.nome, ' ', 1), split_part(serv_chefe.nome, ' ', -1)) as chefe_cartorio_abreviado"),
            DB::raw("serv_chefe.celular as chefe_cartorio_celular"),
            DB::raw("serv_chefe.telefone as chefe_cartorio_telefone"),
            DB::raw("serv_chefe.email as chefe_cartorio_email"),

            DB::raw("departamentos.departamento_grupo_id"),
            DB::raw("departamento_grupos.nome as departamento_grupo"),
            DB::raw("departamento_grupos.descricao as grupo_descricao"),
            DB::raw("departamento_grupos.cidade as grupo_cidade"),
            DB::raw("departamento_grupos.cidade_id as grupo_cidade_id"),
            DB::raw("departamento_grupos.titular_sicad_id as grupo_titular_sicad_id"),
            DB::raw("departamento_grupos.titular_nome as grupo_titular_nome"),
            DB::raw("departamento_grupos.titular_contato as grupo_titular_contato"),
            DB::raw("departamentos.idsuperior as idsuperior_sicad"),
            DB::raw("departamentos.superior as superior_sicad"),
            DB::raw("count(distinct dep_municipio.municipioid) as qtd_municipios"),
            DB::raw("
                count(distinct servidors.id) as servidores_qtd,
                count(distinct case when servidors.funcao like 'DELEGAD%' then servidors.id end) as servidores_delegados,
                count(distinct case when servidors.funcao like 'ESCR%' then servidors.id end) as servidores_escrivaes,
                count(distinct case when servidors.funcao like 'AGENTE%' or servidors.cargo like 'AGENTE%' then servidors.id end) as servidores_agentes,
                count(distinct case when servidors.funcao not like 'AGENTE%' and servidors.cargo not like 'AGENTE%' and servidors.funcao not like 'DELEGAD%' and servidors.funcao not like 'ESCR%' then servidors.id end) as servidores_outros
            "),
            DB::raw("case when length(departamentos.hierarquia)=2 then 151959 else COALESCE(dep_pai.id, 151959) end as id_superior_hierarquia"),
            DB::raw("case when length(departamentos.hierarquia)=2 then 'DELEGACIA-GERAL DA POLÍCIA CIVIL' else COALESCE(dep_pai.nome, 'DELEGACIA-GERAL DA POLÍCIA CIVIL') end as nome_superior_hierarquia"),
          // DB::raw("COALESCE(dep_pai.id, 151959) as id_superior_hierarquia"),
          // DB::raw("COALESCE(dep_pai.nome, 'DELEGACIA-GERAL DA POLÍCIA CIVIL') as nome_superior_hierarquia"),
           DB::raw("( select count(b.*)-1 from departamentos b where b.hierarquia like departamentos.hierarquia||'%') as filhos"),
           DB::raw("CASE
                        WHEN COALESCE(array_to_string((array_agg(departamento_porta_arquivos.arquivo_id ORDER BY departamento_porta_arquivos.id ASC))[1:1], ''), '') = '' THEN 'ECJ43dGrV2TEmRqC8qUwOAgADupWmZxG'
                        ELSE array_to_string((array_agg(departamento_porta_arquivos.arquivo_id ORDER BY departamento_porta_arquivos.id ASC))[1:1], '')
                    END AS ultima_imagem"),
        DB::raw("array_to_string((array_agg(distinct departamento_porta_arquivos_todas.arquivo_id)), '|X|') as imagens"),
       )//y4htBefISsK05Pkj9DjTWZhI2NvHDhaC
        ->leftJoin('departamentos as dep_pai', function($join) {
             $join->on('dep_pai.hierarquia', '=', DB::raw("LEFT(LEFT(departamentos.hierarquia, LENGTH(departamentos.hierarquia) - 1), LENGTH(LEFT(departamentos.hierarquia, LENGTH(departamentos.hierarquia) - 1)) - POSITION('.' IN REVERSE(LEFT(departamentos.hierarquia, LENGTH(departamentos.hierarquia) - 1))))||'.'"));
        })
        ->leftJoin('cidades as cid', function($join) {
            $join->on('cid.id', '=', 'departamentos.municipioid');
        })
        ->leftJoin('departamento_porta_arquivos', function ($join) {
                        $join->on('departamentos.id', '=', 'departamento_porta_arquivos.departamento_id')
                            ->where('departamento_porta_arquivos.arquivo_tipo', '=', 'IMAGEM')
                            ->where('departamento_porta_arquivos.grupo', '=', 'FACHADA')
                            ->where('departamento_porta_arquivos.excluido', '=', FALSE);
                    })

        ->leftJoin('departamento_porta_arquivos as departamento_porta_arquivos_todas', function ($join) {
                        $join->on('departamentos.id', '=', 'departamento_porta_arquivos_todas.departamento_id')
                            ->where('departamento_porta_arquivos_todas.arquivo_tipo', '=', 'IMAGEM')
                            ->where('departamento_porta_arquivos_todas.excluido', '=', FALSE);
                    })
        ->leftJoin('departamento_grupos', 'departamentos.departamento_grupo_id', '=', 'departamento_grupos.id')


        ->join('servidors', function ($join) {
            $join->on('servidors.lotacao_id', '=', 'departamentos.id')
                ->where('servidors.status', 'ATIVO');
        })

        ->leftJoin('servidors as serv_titular', 'serv_titular.id', '=', 'departamentos.titular_id')
        ->leftJoin('servidors as serv_titular_interino', 'serv_titular_interino.id', '=', 'departamentos.titular_interino_id')
        ->leftJoin('servidors as serv_chefe', 'serv_chefe.id', '=', 'departamentos.chefe_cartorio_id')
        ->leftJoin('servidors as serv_chefe_interino', 'serv_chefe_interino.id', '=', 'departamentos.chefe_cartorio_interino_id')
        ->join('departamentos as dep_municipio', function ($join) {
            $join->on('dep_municipio.hierarquia', 'like', \DB::raw("concat(departamentos.hierarquia, '%')"))
                ->where('dep_municipio.status', true);
        })
        ->where(function ($query) use ($zcons_servidor_classificacao, $zcons_cidade_id, $zids, $zfiltros_adcionais, $zcons_filtro_and, $zcons_filtro_or, $zdp_filtro, $zdrp_id, $zdp_id, $zgrupo) {


                        if (strpos($zcons_filtro_and, 'Deps. Desativados') !== false) {
                            $query->where('departamentos.status', false);
                        } else {
                            $query->where('departamentos.status', true);
                        }

                        if($zids!=''){//Filtro por ids
                            // Converta a string de IDs para um array usando explode
                            $idsArray = explode(',', $zids);

                            // Remova espaços em branco dos IDs no array
                            $idsArray = array_map('trim', $idsArray);

                            // Filtro usando WHERE IN
                            $query->whereIn('departamentos.id', $idsArray);
                        }//Filtro por ids

                        if($zfiltros_adcionais==='SEM_SERVIDORES'){
                            $query->whereNull('servidors.id');
                        }


                        if (!empty($zcons_servidor_classificacao)) {
                            switch ($zcons_servidor_classificacao) {
                                case 'SEM':
                                    $query->where(function($query) {
                                        $query->where('servidors.classificacao', '')
                                            ->orWhereNull('servidors.classificacao');
                                    });
                                    break;

                                case 'POLICIAL':
                                    $query->whereIn('servidors.classificacao', ['DELEGADO', 'ESCRIVAO', 'AGENTE', 'PAPILOSCOPISTA']);
                                    break;

                                case 'NAOPOLICIAL':
                                    $query->whereNotIn('servidors.classificacao', ['DELEGADO', 'ESCRIVAO', 'AGENTE', 'PAPILOSCOPISTA']);
                                    break;

                                /*case 'DELEGADO_TITULAR':
                                    $query->whereColumn('departamentos.titular_id', 'servidors.id')
                                        ->where('servidors.classificacao', $zcons_servidor_classificacao);
                                    break;

                                case 'DELEGADO_INTERINO':
                                    $query->whereColumn('departamentos.titular_interino_id', 'servidors.id')
                                        ->where('servidors.classificacao', $zcons_servidor_classificacao);
                                    break;*/

                                default:
                                    $query->where('servidors.classificacao', $zcons_servidor_classificacao);
                                    break;
                            }
                        }


                        if ($zcons_cidade_id!='') {
                            $query->Where('departamentos.municipioid', $zcons_cidade_id);
                        }

                        if($zfiltros_adcionais==='IDENTIFICACAO'){
                             $query->where(function ($query) use ($zfiltros_adcionais) {
                                $query->orWhere('departamentos.especializacao', 'NECRO')
                                    ->orWhere('departamentos.especializacao', 'ID')
                                    ->orWhere('departamentos.departamento_grupo_id', '56');
                            });
                            $query->whereNot('departamentos.especializacao', 'ORGANIZACIONAL');
                        }

                        if($zfiltros_adcionais!=='COM_ORGANIZACIONAIS'){
                            $query->whereNot('departamentos.especializacao', 'ORGANIZACIONAL');
                        }else{
                            $query->where('departamentos.especializacao', 'ORGANIZACIONAL');
                        }

                        if ($zdrp_id!='') {
                            if ($zdrp_id!='-1') {
                                $query->Where('departamentos.idsuperior', $zdrp_id);
                            }
                        }
                        if ($zdp_id!='') {
                            if ($zdp_id!='-1') {
                                $query->Where('departamentos.id', $zdp_id);
                            }
                        }
                        if ($zgrupo!='') {
                            if ($zgrupo!='-1') {
                                $query->Where('departamentos.departamento_grupo_id', $zgrupo);
                            }
                        }

                        if (str_contains($zcons_filtro_or, 'Chefe Titular') || str_contains($zcons_filtro_and, 'Chefe Titular')) {
                            $query->whereNotNull('departamentos.titular_id');
                        }
                        if (str_contains($zcons_filtro_or, 'Chefe Interino') || str_contains($zcons_filtro_and, 'Chefe Interino')) {
                            $query->whereNotNull('departamentos.titular_interino_id');
                        }

                        if (!empty($zcons_filtro_or)) {
                            $whereClausesOr = $this->buildWhereClauses($zcons_filtro_or);
                            $query->where(function ($query) use ($whereClausesOr) {
                                foreach ($whereClausesOr as $clause) {
                                    $query->orWhere(...$clause);
                                }
                            });
                        }

                        if (!empty($zcons_filtro_and)) {
                            $whereClausesAnd = $this->buildWhereClauses($zcons_filtro_and);
                            $query->where(function ($query) use ($whereClausesAnd) {
                                foreach ($whereClausesAnd as $clause) {
                                    $query->where(...$clause);
                                }
                            });
                        }

/*
                        if ($zdp_filtro != '') {
                            $filtroSemAcento = \DB::raw("unaccent('" . strtoupper($zdp_filtro) . "')");
                            $query->where(function ($query) use ($filtroSemAcento) {
                                $query->orWhere(\DB::raw('unaccent(departamentos.nome)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('unaccent(departamentos.municipio)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('unaccent(departamentos.sigla)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('unaccent(departamento_grupos.nome)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('unaccent(departamentos.superior)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('unaccent(departamentos.hierarquia)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('unaccent(serv_titular.nome)'), 'ilike', '%' . $filtroSemAcento . '%');
                            });
                        }*/
                        if ($zdp_filtro != '') {
                            $filtroSemAcento = strtoupper($zdp_filtro);
                            $query->where(function ($query) use ($filtroSemAcento) {
                                $query->orWhere(\DB::raw('UPPER(departamentos.nome)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('UPPER(departamentos.municipio)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('UPPER(departamentos.sigla)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('UPPER(departamento_grupos.nome)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('UPPER(departamentos.superior)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('UPPER(departamentos.hierarquia)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('UPPER(serv_titular.nome)'), 'ilike', '%' . $filtroSemAcento . '%');
                            });
                        }



                })
        ->groupBy(
            "departamentos.id",
            "departamentos.id",
            "departamentos.id",
            "departamentos.nome",
            "departamentos.hierarquia",
            "departamentos.tipo",
            "departamentos.status",
            "departamentos.especializacao",
            "departamentos.portaria",
            "departamentos.sigla",
            "departamentos.municipio",
            "departamentos.municipioid",
            "cid.censo_vinte_tres",
            "departamentos.telefone",
            "departamentos.telefone2",
            "departamentos.telefone3",
            "departamentos.escala",
            "departamentos.imovel_status",
            "departamentos.valor_contrato",
            "departamentos.departamento_grupo_id",
            "departamento_grupos.nome",
            "departamento_grupos.descricao",
            "departamento_grupos.cidade",
            "departamento_grupos.cidade_id",
            "departamento_grupos.titular_sicad_id",
            "departamento_grupos.titular_nome",
            "departamento_grupos.titular_contato",
            "departamentos.idsuperior",
            "departamentos.superior",
            "dep_pai.id",
            "departamentos.titular_id",
            "serv_titular.nome",
            "serv_titular.celular",
            "serv_titular.telefone",
            "serv_titular.email",
            "departamentos.titular_interino_id",
            "serv_titular_interino.nome",
            "serv_titular_interino.celular",
            "serv_titular_interino.telefone",
            "serv_titular_interino.email",
            "departamentos.chefe_cartorio_interino_id",
            "serv_chefe_interino.nome",
            "serv_chefe_interino.celular",
            "serv_chefe_interino.telefone",
            "serv_chefe_interino.email",
            "departamentos.chefe_cartorio_id",
            "serv_chefe.nome",
            "serv_chefe.celular",
            "serv_chefe.telefone",
            "serv_chefe.email",
        )
        ->orderByRaw($xorder);
        //->get();

            $retorno = $query->get();


            /*
                SELECT
                a.id,
                a.nome,
                a.hierarquia,
                coalesce(p.nome, 'DELEGACIAS REGIONAIS DE POLÍCIA') as superior_hierarquico,
                coalesce(p.hierarquia, '2.12.2') as superior_hierarquia

                FROM departamentos a
                left join departamentos p on p.hierarquia=regexp_replace(a.hierarquia, '\.[^.]*$', '')
                where a.nome is not null
                ORDER BY string_to_array(a.hierarquia, '.')::int[];
            */
            //return response()->json($retorno, 200);
        return response()->json(['message' => '',  'retorno' => $retorno], 200);//'sql' => $query->toSql(),
  /*  } catch(\Throwable $th) {
        return response()->json(['message' => 'Erro ao tentar buscar Origem! ' . $th->getMessage()], 400);
    }*/
}




public function listDepartamentosSaap(Request $req) {
   // try {


            $zdrp_id = $req->get('zdrp_id');
            if ($zdrp_id === null || $zdrp_id === 'undefined') {
                $zdrp_id = '';
            }
            $zdp_id = $req->get('zdp_id');
            if ($zdp_id === null || $zdp_id === 'undefined') {
                $zdp_id = '';
            }
            $zcons_filtro_and = $req->get('zcons_filtro_and');
            if ($zcons_filtro_and === null || $zcons_filtro_and === 'undefined') {
                $zcons_filtro_and = '';
            }
            $zcons_filtro_or = $req->get('zcons_filtro_or');
            if ($zcons_filtro_or === null || $zcons_filtro_or === 'undefined') {
                $zcons_filtro_or = '';
            }
            $zdp_filtro = $req->get('zdp_filtro');
            if ($zdp_filtro === null || $zdp_filtro === 'undefined') {
                $zdp_filtro = '';
            }
            $zgrupo = $req->get('zgrupo');
            if ($zgrupo === null || $zgrupo === 'undefined') {
                $zgrupo = '';
            }
            $zcons_servidor_classificacao = $req->get('zcons_servidor_classificacao');
            if ($zcons_servidor_classificacao === null || $zcons_servidor_classificacao === 'undefined') {
                $zcons_servidor_classificacao = '';
            }

            $zcons_cidade_id = $req->get('zcons_cidade_id');
            if ($zcons_cidade_id === null || $zcons_cidade_id === 'undefined') {
                $zcons_cidade_id = '';
            }

            $xorder="string_to_array(substring(departamentos.hierarquia, 1, length(departamentos.hierarquia) - 1), '.')::int[]";

            $zorder = $req->get('zorder');
            if ($zorder === null || $zorder === 'undefined') {
                $zorder = '';
            }
            if($zorder!=''){
                $xorder = match ($zorder) {
                    'TESTE' => 'departamentos.hierarquia, servidors.nome',
                    default => "string_to_array(substring(departamentos.hierarquia, 1, length(departamentos.hierarquia) - 1), '.')::int[]",
                };
            }


            $zids = $req->get('zids');
            if ($zids === null || $zids === 'undefined') {
                $zids = '';
            }

            $zfiltros_adcionais = $req->get('zfiltros_adcionais');
            if ($zfiltros_adcionais === null || $zfiltros_adcionais === 'undefined') {
                $zfiltros_adcionais = '';
            }

            $zcons_status = $req->get('zcons_status');
            if ($zcons_status === null || $zcons_status === 'undefined') {
                $zcons_status = 'TODOS_ATIVOS';
            }
            $zcons_data_tipo = $req->get('zcons_data_tipo');
            if ($zcons_data_tipo === null || $zcons_data_tipo === 'undefined') {
                $zcons_data_tipo = 'DTA_NENHUMA';
            }
            /* $zcons_datai = $req->get('zcons_datai');
            if ($zcons_datai === null || $zcons_datai === 'undefined') {
                $zcons_datai = '';
            }
            $zcons_dataf = $req->get('zcons_dataf');
            if ($zcons_dataf === null || $zcons_dataf === 'undefined') {
                $zcons_dataf = '';
            }*/

             $zcons_datai = $req->has('zcons_datai') ? $req->get('zcons_datai') : null;

            if ($zcons_datai === null || $zcons_datai === 'undefined') {
                $zcons_datai = '';
            } else {
                $zcons_datai = Carbon::parse($zcons_datai)->format('Y-m-d');
            }

            $zcons_dataf = $req->has('zcons_dataf') ? $req->get('zcons_dataf') : null;

            if ($zcons_dataf === null || $zcons_dataf === 'undefined') {
                $zcons_dataf = '';
            } else {
                $zcons_dataf = Carbon::parse($zcons_dataf)->addDay()->format('Y-m-d');
            }

       $query = Departamento::select(
            DB::raw("departamentos.id"),
            DB::raw("departamentos.id as value"),
            DB::raw("departamentos.id as key"),
            DB::raw("departamentos.nome as title"),
            DB::raw("left(departamentos.hierarquia, length(departamentos.hierarquia) - 1) AS hierarquia_sem_ponto_final"),
            DB::raw("departamentos.hierarquia"),
            DB::raw("LEFT(LEFT(departamentos.hierarquia, LENGTH(departamentos.hierarquia) - 1), LENGTH(LEFT(departamentos.hierarquia, LENGTH(departamentos.hierarquia) - 1)) - POSITION('.' IN REVERSE(LEFT(departamentos.hierarquia, LENGTH(departamentos.hierarquia) - 1))))||'.' AS hierarquia_pai"),
            DB::raw("departamentos.tipo"),
            DB::raw("departamentos.especializacao"),
            DB::raw("departamentos.portaria"),
            DB::raw("departamentos.sigla"),
            DB::raw("coalesce(departamentos.municipio, '-') as municipio"),
            DB::raw("departamentos.municipioid"),
            DB::raw("cid.censo_vinte_tres"),
            DB::raw("departamentos.telefone"),
            DB::raw("departamentos.telefone2"),
            DB::raw("departamentos.telefone3"),
            DB::raw("departamentos.imovel_status"),
            DB::raw("departamentos.valor_contrato"),
            DB::raw("departamentos.escala"),
            DB::raw("departamentos.titular_id"),
            DB::raw("departamentos.status"),
            DB::raw("case when departamentos.status=true then 'ATIVA' else 'INATIVA' end as status_desc"),

            DB::raw("coalesce(serv_titular.nome, '') as titular"),
            DB::raw("CONCAT_WS(' ', split_part(serv_titular.nome, ' ', 1), split_part(serv_titular.nome, ' ', -1)) as titular_abreviado"),
            DB::raw("serv_titular.celular as titular_celular"),
            DB::raw("serv_titular.telefone as titular_telefone"),
            DB::raw("serv_titular.email as titular_email"),

            DB::raw("departamentos.titular_interino_id"),
            DB::raw("coalesce(serv_titular_interino.nome, '') as titular_interino"),
            DB::raw("CONCAT_WS(' ', split_part(serv_titular_interino.nome, ' ', 1), split_part(serv_titular_interino.nome, ' ', -1)) as interino_abreviado"),
            DB::raw("serv_titular_interino.celular as titular_interino_celular"),
            DB::raw("serv_titular_interino.telefone as titular_interino_telefone"),
            DB::raw("serv_titular_interino.email as titular_interino_email"),

            DB::raw("case when departamentos.titular_interino_id is not null then 'INTERINO' else 'TITULAR' end as responsavel_tipo"),
            DB::raw("case when departamentos.titular_interino_id is not null then departamentos.titular_interino_id else departamentos.titular_id end as responsavel_id"),
            DB::raw("case when departamentos.titular_interino_id is not null then serv_titular_interino.nome else serv_titular.nome end as responsavel_nome"),
            DB::raw("case when departamentos.titular_interino_id is not null then CONCAT_WS(' ', split_part(serv_titular_interino.nome, ' ', 1), split_part(serv_titular_interino.nome, ' ', -1)) else CONCAT_WS(' ', split_part(serv_titular.nome, ' ', 1), split_part(serv_titular.nome, ' ', -1)) end as responsavel_abreviado"),
            DB::raw("case when departamentos.titular_interino_id is not null then serv_titular_interino.celular else serv_titular.celular end as responsavel_celular"),
            DB::raw("case when departamentos.titular_interino_id is not null then serv_titular_interino.telefone else serv_titular.telefone end as responsavel_telefone"),
            DB::raw("case when departamentos.titular_interino_id is not null then serv_titular_interino.email else serv_titular.email end as responsavel_email"),

            DB::raw("departamentos.chefe_cartorio_interino_id"),
            DB::raw("coalesce(serv_chefe_interino.nome, '') as chefe_cartorio_interino"),
            DB::raw("CONCAT_WS(' ', split_part(serv_chefe_interino.nome, ' ', 1), split_part(serv_chefe_interino.nome, ' ', -1)) as chefe_cartorio_interino_abreviado"),
            DB::raw("serv_chefe_interino.celular as chefe_cartorio_interino_celular"),
            DB::raw("serv_chefe_interino.telefone as chefe_cartorio_interino_telefone"),
            DB::raw("serv_chefe_interino.email as chefe_cartorio_interino_email"),

            DB::raw("departamentos.chefe_cartorio_id"),
            DB::raw("coalesce(serv_chefe.nome, '') as chefe_cartorio"),
            DB::raw("CONCAT_WS(' ', split_part(serv_chefe.nome, ' ', 1), split_part(serv_chefe.nome, ' ', -1)) as chefe_cartorio_abreviado"),
            DB::raw("serv_chefe.celular as chefe_cartorio_celular"),
            DB::raw("serv_chefe.telefone as chefe_cartorio_telefone"),
            DB::raw("serv_chefe.email as chefe_cartorio_email"),

            DB::raw("departamentos.departamento_grupo_id"),
            DB::raw("departamento_grupos.nome as departamento_grupo"),
            DB::raw("departamento_grupos.descricao as grupo_descricao"),
            DB::raw("departamento_grupos.cidade as grupo_cidade"),
            DB::raw("departamento_grupos.cidade_id as grupo_cidade_id"),
            DB::raw("departamento_grupos.titular_sicad_id as grupo_titular_sicad_id"),
            DB::raw("departamento_grupos.titular_nome as grupo_titular_nome"),
            DB::raw("departamento_grupos.titular_contato as grupo_titular_contato"),
            DB::raw("departamentos.idsuperior as idsuperior_sicad"),
            DB::raw("departamentos.superior as superior_sicad"),
            DB::raw("viaturas.qtd as vtrs_qtd"),
            DB::raw("count(distinct dep_municipio.municipioid) as qtd_municipios"),
            DB::raw("
                count(distinct servidors.id) as servidores_qtd,
                count(distinct case when servidors.funcao like 'DELEGAD%' then servidors.id end) as servidores_delegados,
                count(distinct case when servidors.funcao like 'ESCR%' then servidors.id end) as servidores_escrivaes,
                count(distinct case when servidors.funcao like 'AGENTE%' or servidors.cargo like 'AGENTE%' then servidors.id end) as servidores_agentes,
                count(distinct case when servidors.funcao not like 'AGENTE%' and servidors.cargo not like 'AGENTE%' and servidors.funcao not like 'DELEGAD%' and servidors.funcao not like 'ESCR%' then servidors.id end) as servidores_outros
            "),
            DB::raw("case when length(departamentos.hierarquia)=2 then 151959 else COALESCE(dep_pai.id, 151959) end as id_superior_hierarquia"),
            DB::raw("case when length(departamentos.hierarquia)=2 then 'DELEGACIA-GERAL DA POLÍCIA CIVIL' else COALESCE(dep_pai.nome, 'DELEGACIA-GERAL DA POLÍCIA CIVIL') end as nome_superior_hierarquia"),
          // DB::raw("COALESCE(dep_pai.id, 151959) as id_superior_hierarquia"),
          // DB::raw("COALESCE(dep_pai.nome, 'DELEGACIA-GERAL DA POLÍCIA CIVIL') as nome_superior_hierarquia"),
           DB::raw("( select count(b.*)-1 from departamentos b where b.hierarquia like departamentos.hierarquia||'%') as filhos"),
           DB::raw("CASE
                        WHEN COALESCE(array_to_string((array_agg(departamento_porta_arquivos.arquivo_id ORDER BY departamento_porta_arquivos.id ASC))[1:1], ''), '') = '' THEN 'ECJ43dGrV2TEmRqC8qUwOAgADupWmZxG'
                        ELSE array_to_string((array_agg(departamento_porta_arquivos.arquivo_id ORDER BY departamento_porta_arquivos.id ASC))[1:1], '')
                    END AS ultima_imagem"),
        DB::raw("array_to_string((array_agg(distinct departamento_porta_arquivos_todas.arquivo_id)), '|X|') as imagens"),
       )//y4htBefISsK05Pkj9DjTWZhI2NvHDhaC
        ->leftJoin('departamentos as dep_pai', function($join) {
             $join->on('dep_pai.hierarquia', '=', DB::raw("LEFT(LEFT(departamentos.hierarquia, LENGTH(departamentos.hierarquia) - 1), LENGTH(LEFT(departamentos.hierarquia, LENGTH(departamentos.hierarquia) - 1)) - POSITION('.' IN REVERSE(LEFT(departamentos.hierarquia, LENGTH(departamentos.hierarquia) - 1))))||'.'"));
        })
        ->leftJoin('cidades as cid', function($join) {
            $join->on('cid.id', '=', 'departamentos.municipioid');
        })
        ->leftJoin(
            DB::raw('(SELECT vtr.veiculos.departamento_id, COUNT(*) as qtd
            FROM vtr.veiculos WHERE vtr.veiculos.status <> $$INATIVO$$
            GROUP BY vtr.veiculos.departamento_id) as viaturas'),
            'viaturas.departamento_id',
            '=',
            'departamentos.id'
        )
        ->leftJoin('departamento_porta_arquivos', function ($join) {
                        $join->on('departamentos.id', '=', 'departamento_porta_arquivos.departamento_id')
                            ->where('departamento_porta_arquivos.arquivo_tipo', '=', 'IMAGEM')
                            ->where('departamento_porta_arquivos.grupo', '=', 'FACHADA')
                            ->where('departamento_porta_arquivos.excluido', '=', FALSE);
                    })

        ->leftJoin('departamento_porta_arquivos as departamento_porta_arquivos_todas', function ($join) {
                        $join->on('departamentos.id', '=', 'departamento_porta_arquivos_todas.departamento_id')
                            ->where('departamento_porta_arquivos_todas.arquivo_tipo', '=', 'IMAGEM')
                            ->where('departamento_porta_arquivos_todas.excluido', '=', FALSE);
                    })
        ->leftJoin('departamento_grupos', 'departamentos.departamento_grupo_id', '=', 'departamento_grupos.id')

       ->leftJoin('servidors', function ($join) use ($zcons_status) {
            $join->on('servidors.lotacao_id', '=', 'departamentos.id');

            // Adiciona a condição somente se $zcons_status não for 'TODOS'
            if ($zcons_status === 'TODOS_ATIVOS') {
                $join->where('servidors.status', '=', 'ATIVO');
            }
            if ($zcons_status === 'INATIVO') {
                $join->where('servidors.status', '=', 'INATIVO');
            }
        })


        ->leftJoin('servidors as serv_titular', 'serv_titular.id', '=', 'departamentos.titular_id')
        ->leftJoin('servidors as serv_titular_interino', 'serv_titular_interino.id', '=', 'departamentos.titular_interino_id')
        ->leftJoin('servidors as serv_chefe', 'serv_chefe.id', '=', 'departamentos.chefe_cartorio_id')
        ->leftJoin('servidors as serv_chefe_interino', 'serv_chefe_interino.id', '=', 'departamentos.chefe_cartorio_interino_id')
        ->join('departamentos as dep_municipio', function ($join) {
            $join->on('dep_municipio.hierarquia', 'like', \DB::raw("concat(departamentos.hierarquia, '%')"))
                ->where('dep_municipio.status', true);
        })
        ->where(function ($query) use ($zcons_data_tipo, $zcons_datai, $zcons_dataf, $zcons_servidor_classificacao, $zcons_cidade_id, $zids, $zfiltros_adcionais, $zcons_filtro_and, $zcons_filtro_or, $zdp_filtro, $zdrp_id, $zdp_id, $zgrupo) {


                        if (strpos($zcons_filtro_and, 'Deps. Desativados') !== false) {
                            $query->where('departamentos.status', false);
                        } else {
                            $query->where('departamentos.status', true);
                        }

                        if($zids!=''){//Filtro por ids
                            // Converta a string de IDs para um array usando explode
                            $idsArray = explode(',', $zids);

                            // Remova espaços em branco dos IDs no array
                            $idsArray = array_map('trim', $idsArray);

                            // Filtro usando WHERE IN
                            $query->whereIn('departamentos.id', $idsArray);
                        }else{
                            if($zcons_data_tipo!='DTA_NENHUMA'){
                                if($zcons_data_tipo=='ANIVERSARIO'){
                                    $xwhere_data='servidors.dta_nascimento';
                                }
                                if($zcons_data_tipo=='DTA_NOMEACAO'){
                                    $xwhere_data='servidors.dta_nomeacao';
                                }
                                if($zcons_data_tipo=='DTA_POSSE'){
                                    $xwhere_data='servidors.dta_posse';
                                }
                                if($zcons_data_tipo=='INICIO'){
                                    $xwhere_data='servidors.dtai';
                                }
                                if($zcons_data_tipo=='FIM'){
                                    $xwhere_data='servidors.dtaf';
                                }
                                if($zcons_data_tipo=='ANIVERSARIO'){
                                    $xwhere_data='servidors.dta_nascimento';
                                }

                                $query->Where(function ($query) use ($xwhere_data, $zcons_datai, $zcons_dataf) {
                                    $query->whereRaw("$xwhere_data between ? and ?", [$zcons_datai, $zcons_dataf]);
                                });
                            }

                        }//Filtro por ids





                        if($zfiltros_adcionais==='SEM_SERVIDORES'){
                            $query->whereNull('servidors.id');
                        }


                        if (!empty($zcons_servidor_classificacao)) {
                            switch ($zcons_servidor_classificacao) {
                                case 'SEM':
                                    $query->where(function($query) {
                                        $query->where('servidors.classificacao', '')
                                            ->orWhereNull('servidors.classificacao');
                                    });
                                    break;

                                case 'POLICIAL':
                                    $query->whereIn('servidors.classificacao', ['DELEGADO', 'ESCRIVAO', 'AGENTE', 'PAPILOSCOPISTA']);
                                    break;

                                case 'NAOPOLICIAL':
                                    $query->whereNotIn('servidors.classificacao', ['DELEGADO', 'ESCRIVAO', 'AGENTE', 'PAPILOSCOPISTA']);
                                    break;

                                /*case 'DELEGADO_TITULAR':
                                    $query->whereColumn('departamentos.titular_id', 'servidors.id')
                                        ->where('servidors.classificacao', $zcons_servidor_classificacao);
                                    break;

                                case 'DELEGADO_INTERINO':
                                    $query->whereColumn('departamentos.titular_interino_id', 'servidors.id')
                                        ->where('servidors.classificacao', $zcons_servidor_classificacao);
                                    break;*/

                                default:
                                    $query->where('servidors.classificacao', $zcons_servidor_classificacao);
                                    break;
                            }
                        }


                        if ($zcons_cidade_id!='') {
                            $query->Where('departamentos.municipioid', $zcons_cidade_id);
                        }

                        if($zfiltros_adcionais==='IDENTIFICACAO'){
                             $query->where(function ($query) use ($zfiltros_adcionais) {
                                $query->orWhere('departamentos.especializacao', 'NECRO')
                                    ->orWhere('departamentos.especializacao', 'ID')
                                    ->orWhere('departamentos.departamento_grupo_id', '56');
                            });
                            $query->whereNot('departamentos.especializacao', 'ORGANIZACIONAL');
                        }

                        if($zfiltros_adcionais!=='COM_ORGANIZACIONAIS'){
                            $query->whereNot('departamentos.especializacao', 'ORGANIZACIONAL');
                        }else{
                            $query->where('departamentos.especializacao', 'ORGANIZACIONAL');
                        }

                        if ($zdrp_id!='') {
                            if ($zdrp_id!='-1') {
                                $query->Where('departamentos.idsuperior', $zdrp_id);
                            }
                        }
                        if ($zdp_id!='') {
                            if ($zdp_id!='-1') {
                                $query->Where('departamentos.id', $zdp_id);
                            }
                        }
                        if ($zgrupo!='') {
                            if ($zgrupo!='-1') {
                                $query->Where('departamentos.departamento_grupo_id', $zgrupo);
                            }
                        }

                        if (str_contains($zcons_filtro_or, 'Chefe Titular') || str_contains($zcons_filtro_and, 'Chefe Titular')) {
                            $query->whereNotNull('departamentos.titular_id');
                        }
                        if (str_contains($zcons_filtro_or, 'Chefe Interino') || str_contains($zcons_filtro_and, 'Chefe Interino')) {
                            $query->whereNotNull('departamentos.titular_interino_id');
                        }

                        if (!empty($zcons_filtro_or)) {
                            $whereClausesOr = $this->buildWhereClauses($zcons_filtro_or);
                            $query->where(function ($query) use ($whereClausesOr) {
                                foreach ($whereClausesOr as $clause) {
                                    $query->orWhere(...$clause);
                                }
                            });
                        }

                        if (!empty($zcons_filtro_and)) {
                            $whereClausesAnd = $this->buildWhereClauses($zcons_filtro_and);
                            $query->where(function ($query) use ($whereClausesAnd) {
                                foreach ($whereClausesAnd as $clause) {
                                    $query->where(...$clause);
                                }
                            });
                        }

/*
                        if ($zdp_filtro != '') {
                            $filtroSemAcento = \DB::raw("unaccent('" . strtoupper($zdp_filtro) . "')");
                            $query->where(function ($query) use ($filtroSemAcento) {
                                $query->orWhere(\DB::raw('unaccent(departamentos.nome)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('unaccent(departamentos.municipio)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('unaccent(departamentos.sigla)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('unaccent(departamento_grupos.nome)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('unaccent(departamentos.superior)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('unaccent(departamentos.hierarquia)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('unaccent(serv_titular.nome)'), 'ilike', '%' . $filtroSemAcento . '%');
                            });
                        }*/
                        if ($zdp_filtro != '') {
                            $filtroSemAcento = strtoupper($zdp_filtro);
                            $query->where(function ($query) use ($filtroSemAcento) {
                                $query->orWhere(\DB::raw('UPPER(departamentos.nome)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('UPPER(departamentos.municipio)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('UPPER(departamentos.sigla)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('UPPER(departamento_grupos.nome)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('UPPER(departamentos.superior)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('UPPER(departamentos.hierarquia)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('UPPER(serv_titular.nome)'), 'ilike', '%' . $filtroSemAcento . '%');
                            });
                        }



                })
        ->groupBy(
            "departamentos.id",
            "departamentos.id",
            "departamentos.id",
            "departamentos.nome",
            "departamentos.hierarquia",
            "departamentos.tipo",
            "departamentos.status",
            "departamentos.especializacao",
            "departamentos.portaria",
            "departamentos.sigla",
            "departamentos.municipio",
            "departamentos.municipioid",
            "cid.censo_vinte_tres",
            "departamentos.telefone",
            "departamentos.telefone2",
            "departamentos.telefone3",
            "departamentos.escala",
            "departamentos.imovel_status",
            "departamentos.valor_contrato",
            "departamentos.departamento_grupo_id",
            "departamento_grupos.nome",
            "departamento_grupos.descricao",
            "departamento_grupos.cidade",
            "departamento_grupos.cidade_id",
            "departamento_grupos.titular_sicad_id",
            "departamento_grupos.titular_nome",
            "departamento_grupos.titular_contato",
            "departamentos.idsuperior",
            "departamentos.superior",
            "dep_pai.id",
            "departamentos.titular_id",
            "serv_titular.nome",
            "serv_titular.celular",
            "serv_titular.telefone",
            "serv_titular.email",
            "departamentos.titular_interino_id",
            "serv_titular_interino.nome",
            "serv_titular_interino.celular",
            "serv_titular_interino.telefone",
            "serv_titular_interino.email",
            "departamentos.chefe_cartorio_interino_id",
            "serv_chefe_interino.nome",
            "serv_chefe_interino.celular",
            "serv_chefe_interino.telefone",
            "serv_chefe_interino.email",
            "departamentos.chefe_cartorio_id",
            "serv_chefe.nome",
            "serv_chefe.celular",
            "serv_chefe.telefone",
            "serv_chefe.email",
            'viaturas.qtd'
        )
        ->orderByRaw($xorder);
        //->get();

            $retorno = $query->get();


            /*
                SELECT
                a.id,
                a.nome,
                a.hierarquia,
                coalesce(p.nome, 'DELEGACIAS REGIONAIS DE POLÍCIA') as superior_hierarquico,
                coalesce(p.hierarquia, '2.12.2') as superior_hierarquia

                FROM departamentos a
                left join departamentos p on p.hierarquia=regexp_replace(a.hierarquia, '\.[^.]*$', '')
                where a.nome is not null
                ORDER BY string_to_array(a.hierarquia, '.')::int[];
            */
            //return response()->json($retorno, 200);
        return response()->json(['message' => '',  'sql' => '', 'retorno' => $retorno], 200);//'sql' => $query->toSql(),
  /*  } catch(\Throwable $th) {$query->toSql()
        return response()->json(['message' => 'Erro ao tentar buscar Origem! ' . $th->getMessage()], 400);
    }*/
}


public function listDepartamentos(Request $req) {
    //try {

        $filtro = $req->has('filtro') ? $req->get('filtro') : '';
        $sicad_id = $req->has('sicad_id') ? $req->get('sicad_id') : '';

        $zgrupo = $req->get('zgrupo');
            if ($zgrupo === null || $zgrupo === 'undefined') {
                $zgrupo = '';
            }

       $retorno = Departamento::select(
            DB::raw("departamentos.id"),
            DB::raw("departamentos.nome"),
            DB::raw("left(departamentos.hierarquia, length(departamentos.hierarquia) - 1) AS hierarquia_sem_ponto_final"),
            DB::raw("departamentos.hierarquia"),
            DB::raw("LEFT(LEFT(departamentos.hierarquia, LENGTH(departamentos.hierarquia) - 1), LENGTH(LEFT(departamentos.hierarquia, LENGTH(departamentos.hierarquia) - 1)) - POSITION('.' IN REVERSE(LEFT(departamentos.hierarquia, LENGTH(departamentos.hierarquia) - 1))))||'.' AS hierarquia_pai"),
            DB::raw("departamentos.tipo"),
            DB::raw("departamentos.especializacao"),
            DB::raw("departamentos.portaria"),
            DB::raw("departamentos.sigla"),
            DB::raw("departamentos.imovel_status"),
            DB::raw("departamentos.valor_contrato"),
            DB::raw("departamentos.municipio"),
            DB::raw("departamentos.municipioid"),
            DB::raw("departamentos.telefone"),
            DB::raw("departamentos.telefone2"),
            DB::raw("departamentos.telefone3"),
            DB::raw("departamentos.escala"),
            DB::raw("departamentos.departamento_grupo_id"),
            DB::raw("departamento_grupos.nome as departamento_grupo"),
            DB::raw("departamento_grupos.descricao as grupo_descricao"),
            DB::raw("departamento_grupos.cidade as grupo_cidade"),
            DB::raw("departamento_grupos.cidade_id as grupo_cidade_id"),
            DB::raw("departamento_grupos.titular_sicad_id as grupo_titular_sicad_id"),
            DB::raw("departamento_grupos.titular_nome as grupo_titular_nome"),
            DB::raw("departamento_grupos.titular_contato as grupo_titular_contato"),
            DB::raw("departamentos.idsuperior as idsuperior_sicad"),
            DB::raw("departamentos.superior as superior_sicad"),
            DB::raw("departamentos.titular_id"),
            DB::raw("departamentos.status"),
            DB::raw("case when departamentos.status=true then 'ATIVA' else 'INATIVA' end as status_desc"),
            DB::raw("serv_titular.nome as titular"),
            DB::raw("serv_titular.celular as titular_celular"),
            DB::raw("serv_titular.telefone as titular_telefone"),
            DB::raw("serv_titular.email as titular_email"),
            DB::raw("departamentos.titular_interino_id"),
            DB::raw("serv_titular_interino.nome as titular_interino"),
            DB::raw("serv_titular_interino.celular as titular_interino_celular"),
            DB::raw("serv_titular_interino.telefone as titular_interino_telefone"),
            DB::raw("serv_titular_interino.email as titular_interino_email"),
            DB::raw("departamentos.chefe_cartorio_interino_id"),
            DB::raw("serv_chefe_interino.nome as chefe_cartorio_interino"),
            DB::raw("serv_chefe_interino.celular as chefe_cartorio_interino_celular"),
            DB::raw("serv_chefe_interino.telefone as chefe_cartorio_interino_telefone"),
            DB::raw("serv_chefe_interino.email as chefe_cartorio_interino_email"),
            DB::raw("departamentos.chefe_cartorio_id"),
            DB::raw("serv_chefe.nome as chefe_cartorio"),
            DB::raw("serv_chefe.celular as chefe_cartorio_celular"),
            DB::raw("serv_chefe.telefone as chefe_cartorio_telefone"),
            DB::raw("serv_chefe.email as chefe_cartorio_email"),
            DB::raw("case when length(departamentos.hierarquia)=2 then 151959 else COALESCE(dep_pai.id, 151959) end as id_superior_hierarquia"),
            DB::raw("case when length(departamentos.hierarquia)=2 then 'DELEGACIA-GERAL DA POLÍCIA CIVIL' else COALESCE(dep_pai.nome, 'DELEGACIA-GERAL DA POLÍCIA CIVIL') end as nome_superior_hierarquia"),
        )
        ->leftJoin('departamentos as dep_pai', function($join) {
            $join->on('dep_pai.hierarquia', '=', DB::raw("LEFT(LEFT(departamentos.hierarquia, LENGTH(departamentos.hierarquia) - 1), LENGTH(LEFT(departamentos.hierarquia, LENGTH(departamentos.hierarquia) - 1)) - POSITION('.' IN REVERSE(LEFT(departamentos.hierarquia, LENGTH(departamentos.hierarquia) - 1))))||'.'"));
        })
        ->leftJoin('departamento_grupos', 'departamentos.departamento_grupo_id', '=', 'departamento_grupos.id')
        ->leftJoin('servidors as serv_titular', 'serv_titular.id', '=', 'departamentos.titular_id')
        ->leftJoin('servidors as serv_titular_interino', 'serv_titular_interino.id', '=', 'departamentos.titular_interino_id')
        ->leftJoin('servidors as serv_chefe', 'serv_chefe.id', '=', 'departamentos.chefe_cartorio_interino_id')
        ->leftJoin('servidors as serv_chefe_interino', 'serv_chefe_interino.id', '=', 'departamentos.chefe_cartorio_id')
        ->where(function ($query) use ($zgrupo, $filtro, $sicad_id) {


                $query->Where('departamentos.status', true);

                if ($sicad_id != '') {
                    $query->Where('departamentos.id', $sicad_id);
                }else{

                    if ($zgrupo!='') {
                        if ($zgrupo!='-1') {
                            $query->Where('departamentos.departamento_grupo_id', $zgrupo);
                        }
                    }

                       /* if ($filtro != '') {
                            $filtroSemAcento = strtoupper($filtro);
                            $query->where(function ($query) use ($filtroSemAcento) {
                                $query->orWhere(DB::raw('unaccent(departamentos.nome)'), 'ilike', DB::raw("unaccent('%{$filtroSemAcento}%')"))
                                    ->orWhere(DB::raw('unaccent(departamentos.municipio)'), 'ilike', DB::raw("unaccent('%{$filtroSemAcento}%')"))
                                    ->orWhere(DB::raw('unaccent(departamentos.sigla)'), 'ilike', DB::raw("unaccent('%{$filtroSemAcento}%')"))
                                    ->orWhere(DB::raw('unaccent(departamento_grupos.nome)'), 'ilike', DB::raw("unaccent('%{$filtroSemAcento}%')"))
                                    ->orWhere(DB::raw('unaccent(departamentos.superior)'), 'ilike', DB::raw("unaccent('%{$filtroSemAcento}%')"))
                                    ->orWhere(DB::raw('unaccent(serv_titular.nome)'), 'ilike', DB::raw("unaccent('%{$filtroSemAcento}%')"));
                            });
                        }*/

                         if ($filtro != '') {
                            $filtroSemAcento = strtoupper($filtro);
                            $query->where(function ($query) use ($filtroSemAcento) {
                                $query->orWhere(\DB::raw('UPPER(departamentos.nome)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('UPPER(departamentos.municipio)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('UPPER(departamentos.sigla)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('UPPER(departamento_grupos.nome)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('UPPER(departamentos.superior)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('UPPER(departamentos.hierarquia)'), 'ilike', '%' . $filtroSemAcento . '%')
                                    ->orWhere(\DB::raw('UPPER(serv_titular.nome)'), 'ilike', '%' . $filtroSemAcento . '%');
                            });
                        }
                }

        })
       // ->whereNot('departamentos.id', 66239)
        ->orderByRaw("string_to_array(substring(departamentos.hierarquia, 1, length(departamentos.hierarquia) - 1), '.')::int[]")
        ->get();




            /*
                SELECT
                a.id,
                a.nome,
                a.hierarquia,
                coalesce(p.nome, 'DELEGACIAS REGIONAIS DE POLÍCIA') as superior_hierarquico,
                coalesce(p.hierarquia, '2.12.2') as superior_hierarquia

                FROM departamentos a
                left join departamentos p on p.hierarquia=regexp_replace(a.hierarquia, '\.[^.]*$', '')
                where a.nome is not null
                ORDER BY string_to_array(a.hierarquia, '.')::int[];
            */

        return response()->json($retorno, 200);
  /*  } catch(\Throwable $th) {
        return response()->json(['message' => 'Erro ao tentar buscar Origem! ' . $th->getMessage()], 400);
    }*/
}



public function listDepartamentosComparacaoHierarquia(Request $req) {
    try {
       $retorno = Departamento::select(
            DB::raw("departamentos.id"),
            DB::raw("departamentos.nome"),
            DB::raw("departamentos.hierarquia")
        )
        ->Where('departamentos.status', true)
        ->orderByRaw("string_to_array(substring(departamentos.hierarquia, 1, length(departamentos.hierarquia) - 1), '.')::int[]")
        ->get();

        return response()->json($retorno, 200);
    } catch(\Throwable $th) {
        return response()->json(['message' => 'Erro ao tentar buscar Origem! ' . $th->getMessage()], 400);
    }
}


public function saveRegional(Request $req) {

      //  try{

            $Departamento_id=$req->has('Departamento_id') ? $req->get('Departamento_id') : null;
            $drp_id=$req->has('drp_id') ? $req->get('drp_id') : null;
            $Departamento_nome=$req->has('Departamento') ? $req->get('Departamento') : null;

            $DepartamentoBusca = Departamento::find($Departamento_id)->update([
                        'drp_id' => $drp_id
                    ]);

            $message = 'Alterado com sucesso.';

            return response()->json(['message' => $message, 'id' => $Departamento_id], 200);

           /* if ($DepartamentoBusca) {

                    $DepartamentoBusca->update([
                        'drp_id' => $drp_id
                    ]);
                    $message = 'Alterado com sucesso.';

                    return response()->json(['message' => $message, 'id' => $Departamento_id], 200);

            }else{

                $message = 'Não localizada '.$Departamento_id.' - '.$Departamento_nome;

                return response()->json(['message' => $message, 'id' => -1], 200);
            }*/

/*
        }catch (\Throwable $th) {
            return response()->json(['message' => 'Erro ao tentar gravar. '.print_r($req).' - '.$th->getMessage()], 400);
        }
*/

    }


/*
    public function sincCreate(Request $request) {

        $new = $request->post('values');

        try {

            DB::statement($new['sinc_sql']);

            return response()->json($new['sinc_sql'].'; Executado com sucesso. ', 200);
        } catch (\Exception $e) {
            // Lidar com a exceção
            return response()->json(['message' => $e->getMessage()], 200);
        }

    }
*/




public function sincCreate(Request $request) {
    $new = $request->post('values');
    $commands = explode(';', $new['sinc_sql']);
    $results = [];

    try {
        foreach ($commands as $command) {
            $command = trim($command);
            if (empty($command)) {
                continue;
            }

            // Check if the command is a SELECT statement
            if (stripos($command, 'SELECT') === 0) {
                $result = DB::select(DB::raw($command));
                $results[] = $result;
            } else {
                DB::statement($command);
                $results[] = 'Executado com sucesso.';
            }
        }

        return response()->json($results, 200);
    } catch (\Exception $e) {
        // Lidar com a exceção
        return response()->json(['message' => $e->getMessage()], 200);
    }
}

/*
public function sincCreate(Request $request) {
    $new = $request->post('values');

    try {
        // Lógica para criar a função PL/pgSQL
        $trigger1 = "
        CREATE OR REPLACE FUNCTION vtr.veiculos_historicos_sincs ()
        RETURNS trigger LANGUAGE 'plpgsql'
        VOLATILE
        CALLED ON NULL INPUT
        SECURITY INVOKER
        PARALLEL UNSAFE
        COST 100
        AS $$
        DECLARE
            xlinha record;
            xmotorista text;
        BEGIN
            IF TG_OP = 'INSERT' THEN
                SELECT d.nome as departamento, s.nome as responsavel,
                    CASE WHEN d.titular_interino_id IS NOT NULL THEN d.titular_interino_id ELSE d.titular_id END AS responsavel_id
                INTO xlinha
                FROM public.departamentos d
                LEFT JOIN public.servidors s ON CASE WHEN d.titular_interino_id IS NOT NULL THEN d.titular_interino_id ELSE d.titular_id END = s.id
                WHERE d.id = NEW.departamento_id;

                IF NEW.motorista_id IS NOT NULL THEN
                    SELECT nome
                    INTO xmotorista
                    FROM public.servidors
                    WHERE id = NEW.motorista_id;
                END IF;

                INSERT INTO vtr.veiculos_historicos
                (veiculo_id, departamento, departamento_id, responsavel, responsavel_id, motorista, motorista_id)
                VALUES
                (NEW.id, xlinha.departamento, NEW.departamento_id,
                xlinha.responsavel, xlinha.responsavel_id,
                xmotorista, NEW.motorista_id);

            ELSE -- UPDATE

                IF (NEW.departamento_id <> OLD.departamento_id OR NEW.motorista_id <> OLD.motorista_id) THEN
                    SELECT d.nome as departamento, s.nome as responsavel,
                        CASE WHEN d.titular_interino_id IS NOT NULL THEN d.titular_interino_id ELSE d.titular_id END AS responsavel_id
                    INTO xlinha
                    FROM public.departamentos d
                    LEFT JOIN public.servidors s ON CASE WHEN d.titular_interino_id IS NOT NULL THEN d.titular_interino_id ELSE d.titular_id END = s.id
                    WHERE d.id = NEW.departamento_id;

                    IF NEW.motorista_id IS NOT NULL THEN
                        SELECT nome
                        INTO xmotorista
                        FROM public.servidors
                        WHERE id = NEW.motorista_id;
                    END IF;

                    INSERT INTO vtr.veiculos_historicos
                    (veiculo_id, departamento, departamento_id, responsavel, responsavel_id, motorista, motorista_id)
                    VALUES
                    (NEW.id, xlinha.departamento, NEW.departamento_id,
                    xlinha.responsavel, xlinha.responsavel_id,
                    xmotorista, NEW.motorista_id);
                END IF;

            END IF;

            RETURN NEW;
        END;
        $$;
        ";

        DB::statement($trigger1);

        return response()->json($new['sinc_sql'].'; Executado com sucesso. ', 200);
    } catch (\Exception $e) {
        // Lidar com a exceção
        return response()->json(['message' => $e->getMessage()], 200);
    }
}
*/





    public function sincReturn(Request $request) {

        $new = $request->post('values');

        try {

            $retorno = DB::select($new['sinc_sql']);

            return response()->json($retorno, 200);


        } catch (\Exception $e) {
            // Lidar com a exceção
            return response()->json(['message' => $e->getMessage()], 200);
        }

    }



    public function sincSicad(Request $req) {
                   $xteste='';
           try {
                // Recuperar todos os departamentos do banco de dados
               $departamentos = Departamento::get();

                $response = Http::get(env('ENDERECO_LEGADOWS') . '/unidadesPC?token=' . $req->header('Token'));

                $xteste='';

                if ($response->successful()) {
                    $dadosDepartamentos = $response->json();

                    // Iterar sobre cada departamento recuperado
                    foreach ($departamentos as $departamento) {
                        try {
                            // Localizar o departamento correspondente no $dadosDepartamentos usando o ID
                            $dadosDepartamento = collect($dadosDepartamentos)->firstWhere('id', $departamento->id);

                            // Verificar se o departamento correspondente foi encontrado
                            if ($dadosDepartamento) {
                                // Atualizar os dados do departamento
                                $departamento->update([
                                    'nome' => $dadosDepartamento['nome'] ?? null,
                                    'sigla' => $dadosDepartamento['sigla'] ?? $dadosDepartamento['nome'],
                                    'tipo' => $dadosDepartamento['tipo'] ?? 'OPERACIONAL',
                                    'telefone' => $dadosDepartamento['telefone'] ?? null,
                                    'municipioId' => $dadosDepartamento['endereco']['municipioId'] ?? null,
                                    'municipio' => $dadosDepartamento['endereco']['municipio'] ?? null,
                                    'logradouro' => $dadosDepartamento['endereco']['logradouro'] ?? null,
                                    'quadra' => $dadosDepartamento['endereco']['quadra'] ?? null,
                                    'lote' => $dadosDepartamento['endereco']['lote'] ?? null,
                                    'numero' => $dadosDepartamento['endereco']['numero'] ?? null,
                                    'bairro' => $dadosDepartamento['endereco']['bairro'] ?? null,
                                    'idsuperior' => $dadosDepartamento['idSuperior'] ?? null,
                                    'superior' => $dadosDepartamento['superior'] ?? null
                                ]);
                            } else {
                                $xteste.=' - '.$departamento->id.' Não localizado';
                                // O departamento correspondente não foi encontrado
                                // Lidar com isso conforme necessário
                            }
                        } catch (\Exception $e) {
                            // Lidar com a exceção
                            return response()->json(['message' => $e->getMessage()], 200);
                        }
                    }
                } else {
                    // Ocorreu um erro na solicitação HTTP
                    // Lidar com isso conforme necessário
                }


                return response()->json('Dados atualizados com sucesso. '.$xteste, 200);
            } catch (Throwable $th) {
                return response()->json(['message' => 'Erro ao tentar atualizar dados: ' . $th->getMessage()], 400);
            }



    }



    public function saveDepartamentoPortaArquivo(Request $req) {
        try {

                $Departamento_id = $req->has('departamento_id') ? $req->get('departamento_id') : '';
                $arquivo_id = $req->has('arquivo_id') ? $req->get('arquivo_id') : '';
                $user_nome = $req->has('user_nome') ? $req->get('user_nome') : '';
                $user_id = $req->has('user_id') ? $req->get('user_id') : '';
                $fileType = $req->has('fileType') ? $req->get('fileType') : '';
                $fotos_grupo = $req->has('fotos_grupo') ? $req->get('fotos_grupo') : '';

                if($Departamento_id==='' || $arquivo_id==='' || $user_nome==='' || $user_id==='' || $fileType==='' || $fotos_grupo===''){
                    return response()->json(['message' => 'Erro ao tentar gravar arquivo. Ids não informados.'], 400);
                }else{

                    $identificacaoArquivo = DepartamentoPortaArquivo::create([
                        'departamento_id' => $Departamento_id,
                        'arquivo_id' => $arquivo_id,
                        'grupo' => $fotos_grupo,
                        'user_cad' => $user_nome,
                        'arquivo_tipo' => $fileType,
                        'user_cad_id' => $user_id
                    ]);
                    $novoID = $identificacaoArquivo->id;
                    $message = 'Upload Realizado com Sucesso.';

                    DepartamentoAuditoria::create([
                        'departamento_id' => $Departamento_id,
                        'funcao' => 'Incluiu', // Alterou, Excluiu, Incluiu
                        'descricao' => 'Foto de '.$fotos_grupo,
                        'fun_cad_id' => $new['user_observatorio_id'],
                        'fun_cad' => $new['user_observatorio'],
                    ]);

                    return response()->json(['message' => $message, 'id' => $novoID], 200);
                }

        } catch (\Throwable $th) {
            return response()->json(['message' => 'Erro ao tentar gravar arquivo. '.$th->getMessage()], 400);
        }
    }





    public function excluirDepartamentoPortaArquivo(Request $req) {
        try {

                $Departamento_id = $req->has('departamento_id') ? $req->get('departamento_id') : '';
                $arquivo_id = $req->has('arquivo_id') ? $req->get('arquivo_id') : '';
                $user_nome = $req->has('user_nome') ? $req->get('user_nome') : '';
                $user_id = $req->has('user_id') ? $req->get('user_id') : '';

                if($Departamento_id==='' || $arquivo_id==='' || $user_nome==='' || $user_id===''){
                    return response()->json(['message' => 'Erro ao tentar gravar arquivo. Ids não informados.'], 400);
                }else{

                    DepartamentoPortaArquivo::where('departamento_id', $Departamento_id)
                    ->where('arquivo_id', $arquivo_id)
                    ->update([
                        'excluido' => true,
                        'user_exc_id' => $user_id,
                        'user_exc' => $user_nome
                    ]);

                    DepartamentoAuditoria::create([
                        'departamento_id' => $Departamento_id,
                        'funcao' => 'Excluiu', // Alterou, Excluiu, Incluiu
                        'descricao' => 'Foto arquivo id '.$arquivo_id,
                        'fun_cad_id' => $new['user_observatorio_id'],
                        'fun_cad' => $new['user_observatorio'],
                    ]);

                    $message = 'Alterado com Sucesso.';

                    return response()->json(['message' => $message], 200);
                }

        } catch (\Throwable $th) {
            return response()->json(['message' => 'Erro ao tentar gravar arquivo. '.$th->getMessage()], 400);
        }
    }

    public function listarDepartamentoPortaArquivos(Request $req){

        $departamento_id = $req->has('departamento_id') ? $req->get('departamento_id') : '';
        $fotos_grupo = $req->has('fotos_grupo') ? $req->get('fotos_grupo') : '';

        if($departamento_id===''){
            return response()->json(['message' => 'Sem departamento_id ??', 'retorno' => ''], 200);
        }

        try {
            $query=DepartamentoPortaArquivo::select(
                DB::raw("ROW_NUMBER() OVER () as arquivo_numero"),
                'departamento_porta_arquivos.*',
                DB::raw("'https://filews-h.ssp.go.gov.br/loadArquivo?id='||departamento_porta_arquivos.arquivo_id as url"),
                DB::raw("case
                when departamento_porta_arquivos.arquivo_tipo='IMAGEM' then 'FileImageOutlined'
                when departamento_porta_arquivos.arquivo_tipo='PDF' then 'FilePdfOutlined'
                when departamento_porta_arquivos.arquivo_tipo='DOC' or departamento_porta_arquivos.arquivo_tipo='DOCX' then 'FileWordOutlined'
                when departamento_porta_arquivos.arquivo_tipo='XLS' or departamento_porta_arquivos.arquivo_tipo='XLSX' or departamento_porta_arquivos.arquivo_tipo='XLT' or departamento_porta_arquivos.arquivo_tipo='XLTX' then 'FileExcelOutlined'
                else 'FileUnknownOutlined' end arquivo_tipo_icon"),
                DB::raw("TO_CHAR(departamento_porta_arquivos.created_at, 'DD/MM/YYYY HH24:MI') as dta_upload_br")
                )
            ->Where('departamento_porta_arquivos.excluido', false)
            ->Where('departamento_porta_arquivos.departamento_id', $departamento_id);


            if (!empty($fotos_grupo)) {
                if ($fotos_grupo!='TODAS') {
                    $query->where('departamento_porta_arquivos.grupo', $fotos_grupo);
                }
            }

            $query->orderBy('grupo')
            ->orderBy('created_at');

            $retorno = $query->get();

            return response()->json(['message' => 'ok', 'retorno' => $retorno], 200);//'message' => $query->toSql()

        } catch (\Throwable $th) {
            return response()->json(['message' => 'Erro ao tentar buscar Arquivos! '.$th,
                                    'sql' => '', // Adicione o SQL à matriz de retorno$query->toSql()
                                    ], 400);
        }
    }


    public function listAuditoriaDepartamento(Request $req){

        $query = null;

         //return response()->json(['message' => 'ok', 'retorno' => ''], 200);

            $dtai = $req->has('dtai') ? $req->get('dtai') : null;
            if ($dtai === null || $dtai === 'undefined') {
                $dtai = '';
            } else {
                $dtai = Carbon::parse($dtai)->format('Y-m-d');
            }

            $dtaf = $req->has('dtaf') ? $req->get('dtaf') : null;

            if ($dtaf === null || $dtaf === 'undefined') {
                $dtaf = '';
            } else {
                $dtaf = Carbon::parse($dtaf)->addDay()->format('Y-m-d');
            }

        try{

            $xorder='';

            $zdepartamento_id = $req->has('zdepartamento_id') ? $req->get('zdepartamento_id') : null;

            if($zdepartamento_id==''){
                return response()->json(['message' => 'Departamento não encontrado! '.$th], 400);
            }

            //$filtrosArray = explode(', ', $filtros);

           $query = DepartamentoAuditoria::select(
                        'departamento_auditorias.*',
                        DB::raw("TO_CHAR(departamento_auditorias.created_at, 'DD/MM/YYYY HH:MI') as dta_registro_br"),
                        DB::raw("INITCAP(SPLIT_PART(departamento_auditorias.fun_cad, ' ', 1)) as fun_cad_abreviado"),
                        DB::raw("INITCAP(SPLIT_PART(departamento_auditorias.descricao, '->', 1)) as descricao_abreviado")
                    )
                ->where('departamento_auditorias.departamento_id', $zdepartamento_id)
                ->whereBetween('departamento_auditorias.created_at', [$dtai, $dtaf])
                ->orderBy('departamento_auditorias.created_at', 'desc');



            $retorno = $query->get();
/*
                foreach($retorno as $ret){
                    $dp = json_decode( Http::get(env('ENDERECO_LEGADOWS') . 'unidadePorId/'.$ret->dp_id.'?token=' . $req->header('Token')));
                    $ret->dp=$dp->nome;
                }
*/
            return response()->json(['message' => '', 'retorno' => $retorno], 200);//, 'sql' => $query->toSql()


       }catch(\Throwable $th){
            return response()->json(['message' => 'Erro ao tentar buscar! '.$th], 400);//, 'sql' => $query->toSql(),

       }
    }

    public function listarProcessoItensPendentes(Request $req){



            $dep_grupo_id = $req->has('dep_grupo_id') ? $req->get('dep_grupo_id') : '';
            $dep_id = $req->has('dep_id') ? $req->get('dep_id') : '';




                     $query = ProcessoItemProcesso::select(
                        'processo.processo_itens.item_id',
                        'processo.itens.descricao as item',
                        'processo.itens.img',
                        DB::raw("TO_CHAR(min(processo.processos.data_ref), 'DD/MM/YYYY') as data_ref"),
                        DB::raw("COUNT(distinct processo.processo_itens.processo_id) as qtd_seis"),
                        DB::raw("case TRIM(TRAILING '.00' FROM coalesce(SUM(processo.processo_itens.qtd_ok),0)::TEXT) when '' then '0' else TRIM(TRAILING '.00' FROM coalesce(SUM(processo.processo_itens.qtd_ok),0)::TEXT) end as qtd_ok"),
                        DB::raw("TRIM(TRAILING '.00' FROM SUM(processo.processo_itens.qtd_sol)::TEXT) as qtd_sol"),
                        DB::raw("
                            CASE
                                WHEN SUM(processo.processo_itens.qtd_ok) > 0 THEN
                                    COALESCE(TRIM(TRAILING '.00' FROM ((SUM(processo.processo_itens.qtd_sol) - COALESCE(SUM(processo.processo_itens.qtd_ok), 0))::TEXT)), '0')
                                WHEN SUM(processo.processo_itens.qtd_ok) = SUM(processo.processo_itens.qtd_sol) THEN '0'
                                ELSE
                                    TRIM(TRAILING '.00' FROM (COALESCE(SUM(processo.processo_itens.qtd_sol), 0))::TEXT)
                            END AS qtd_pendente
                        "),
                        DB::raw("array_to_string(array_agg(distinct processo.itens.id), ', ') as processos_itens_ids"),
                        DB::raw("string_agg(distinct processo.processos.numero_sei, ', ') as seis"),
                        DB::raw("string_agg(distinct departamento_grupos.sigla_curta||'!'||departamento_grupos.nome||'!'||departamento_grupos.id, ', ') as sigla_grupo_departamento"),
                        DB::raw("string_agg(distinct processo.processos.numero_sei||'!'||TO_CHAR(processo.processos.data_ref, 'DD/MM/YY')||'!'||case when processo.processos.dp_origem_id is null then processo.processos.dp_origem else departamentos.nome end, ', ') as processos_desc"),
                        DB::raw("array_to_string(array_agg(distinct processo.processos.id), ', ') as processos_ids"),
                        DB::raw("string_agg(distinct case when processo.processos.dp_origem_id is null then processo.processos.dp_origem else departamentos.nome end, ', ') as departamentos")
                     )
                     ->join('processo.itens', 'processo.itens.id', '=', 'processo.processo_itens.item_id')
                     ->join('processo.processos', 'processo.processos.id', '=', 'processo.processo_itens.processo_id')
                     ->leftJoin('departamentos', 'departamentos.id', '=', 'processo.processos.dp_origem_id')
                     ->leftJoin('departamento_grupos', 'departamento_grupos.id', '=', 'departamentos.departamento_grupo_id')
                     ->where('processo.processos.grupo_id', '2')
                     ->Where('departamentos.departamento_grupo_id', $dep_grupo_id)
                     ->where('processo.processos.status_processo', 'PENDENTE')
                      ->where(function ($query) use ($dep_id) {


                                if ($dep_id!='') {
                                    $query->Where('processo.processos.dp_origem_id', $dep_id);
                                }

                      })
                      ->groupBy('processo.processo_itens.item_id', 'processo.itens.descricao', 'processo.itens.img')
                     ->havingRaw('SUM(processo.processo_itens.qtd_ok) < SUM(processo.processo_itens.qtd_sol)')
                     ->orderBy('processo.itens.descricao');


                    $retorno = $query->get();

                    return response()->json(['message' => '', 'retorno' => $retorno], 200);//'message' => $query->toSql()



    }



public function ScobeListObra(Request $req){

      //  try{
           // if($req->get('defeitos') != ''){



                $teste='';

                $tipo_data = $req->has('tipo_data') ? $req->get('tipo_data') : null;
                if ($tipo_data === null || $tipo_data === 'undefined') {
                    $tipo_data = '0CAD';
                }
                $dep_id = $req->has('dep_id') ? $req->get('dep_id') : null;
                if ($dep_id === null || $dep_id === 'undefined') {
                    $dep_id = '';
                }

                $grupo_id = $req->has('grupo_id') ? $req->get('grupo_id') : null;
                if ($grupo_id === null || $grupo_id === 'undefined') {
                    $grupo_id = '';
                }

                if(($dep_id==='')&&($grupo_id==='')){
                return response()->json(['message' => 'Sem parametros ??', 'retorno' => ''], 200);
            }

               // $filtrosArray = explode(', ', $filtros);

           $subquery = DB::table('scobe.obra_etapas as x')
                ->select(
                    'x.obra_id',
                    DB::raw('COUNT(DISTINCT x.id) as qtd_etapas'),
                    DB::raw('SUM(x.valor_etapa) as valor_etapas'),
                    DB::raw("MIN(x.dtai) filter (where x.status='PEN') as etapa_pendente_date"),
                    DB::raw("COUNT(DISTINCT x.id) filter (where x.status='PEN') as qtd_etapas_pendentes"),
                    DB::raw("COUNT(DISTINCT x.id) filter (where x.status='FIN') as qtd_etapas_finalizadas")
                )
                ->groupBy('x.obra_id');

                    if ($tipo_data == '0ANI') {
                        $subquery->whereBetween('x.dtai', [$dtai, $dtaf]);
                    }
                    if ($tipo_data == '0ANF') {
                        $subquery->whereBetween('x.dtaf', [$dtai, $dtaf])
                                ->where('x.status', 'FIN');
                    }


            $SQL = ScobeObra::select(
                    'obras.sei',
                    'obras.departamento_id',
                    'obras.tipo',
                    'obras.regularizacao',
                    'obras.departamento_telefone',
                    'obras.solicitante',
                    'obras.obs',
                    'obras.status',
                    'obras.created_at',
                    'obras.updated_at', 'obras.id as obra_id',
                    DB::raw("coalesce(obras.conclusao, 0) as conclusao"),
                    DB::raw("TO_CHAR(obras.dta_previ, 'DD/MM/YYYY') as dta_previ_br"),
                    DB::raw("TO_CHAR(obras.dta_prevf, 'DD/MM/YYYY') as dta_prevf_br"),
                    DB::raw("CASE when obras.dtai is null then '' else TO_CHAR(obras.dtai, 'DD/MM/YYYY') end as dtai_br"),
                    DB::raw("CASE when obras.dtaf is null then '' else TO_CHAR(obras.dtaf, 'DD/MM/YYYY') end as dtaf_br"),
                    DB::raw("CASE when obras.obs is null then '' else 'Obs.: '||obras.obs end as obs_desc"),
                    DB::raw("CASE
                            WHEN obras.dtaf is not null and obras.dtai is not null
                            THEN 'Iníciou em: '||TO_CHAR(obras.dtai, 'DD/MM/YY')||' Concluiu em: '||TO_CHAR(obras.dtaf, 'DD/MM/YY')

                            WHEN obras.dtaf is null and obras.dtai is not null
                            THEN 'Iníciou em: '||TO_CHAR(obras.dtai, 'DD/MM/YY')||' Previsão para: '||TO_CHAR(obras.dta_prevf, 'DD/MM/YY')

                        ELSE 'Previsão de: '||TO_CHAR(obras.dta_previ, 'DD/MM/YY')||' até: '||TO_CHAR(obras.dta_prevf, 'DD/MM/YY')
                        END as dta_desc"),
                    DB::raw("CASE obras.tipo
                        WHEN 'AMP' THEN 'Ampliação/Reforma'
                        WHEN 'CON' THEN 'Construção'
                        WHEN 'REF' THEN 'Reforma'
                        WHEN 'SER' THEN 'Serviço Engenharia'
                        ELSE obras.tipo
                        END as tipo_desc"),
                    DB::raw("CASE obras.regularizacao
                        WHEN '1EST' THEN 'Estado'
                        WHEN '1CES' THEN 'Cessão de Uso'
                        WHEN '1TEE' THEN 'Termo de Entrega'
                        WHEN '1PRO' THEN 'Projeto de Lei'
                        WHEN '1ERE' THEN 'Em Regularização'
                        WHEN '1IRR' THEN 'Irregular'
                        WHEN '1CED' THEN 'Cedido'
                        ELSE obras.regularizacao
                        END as regularizacao_desc"),
                    DB::raw("CASE obras.status
                        WHEN '9AND' THEN 'Em Andamento'
                        WHEN '9EXE' THEN 'Em Execução'
                        WHEN '9AIN' THEN 'Aguardando Inauguração'
                        WHEN '9INA' THEN 'Inaugurada'
                        WHEN '9PAR' THEN 'Paralizada'
                        WHEN '9CAN' THEN 'Cancelada'
                        WHEN '9DEF' THEN 'Aguardando Definição Externa'
                        ELSE obras.status
                        END as status_desc"),
                    DB::raw("case when z.valor_etapas>0 then 'Total Obra R$ ' || TO_CHAR(z.valor_etapas, 'FM999G999G999D00') else '' end as total_obra"),
                    DB::raw("z.qtd_etapas as qtd_etapas"),
                    DB::raw("z.qtd_etapas_pendentes as qtd_etapas_pendentes"),
                    DB::raw("z.qtd_etapas_finalizadas as qtd_etapas_finalizadas"),
                    DB::raw("case when z.etapa_pendente_date is null then '' else TO_CHAR(z.etapa_pendente_date, 'DD/MM/YY') end  as dtai_etapas_pendentes"),
                    DB::raw("string_agg(distinct etapas_andamento.etapa||' '||etapas_andamento.etapa_descricao||' '||INITCAP(SPLIT_PART(serv_etapa.nome, ' ', 1)), ', ') as etapas"),
                    DB::raw("string_agg(distinct etapas_andamento.etapa||' '||etapas_andamento.etapa_descricao||' '||coalesce(INITCAP(SPLIT_PART(serv_etapa.nome, ' ', 1)), ''), ', ') filter(where obra_etapas.status='PEN') as etapas_pendentes"),
                    DB::raw("string_agg(distinct etapas_andamento.etapa||' '||etapas_andamento.etapa_descricao, ', ') filter(where obra_etapas.valor_etapa>0) as etapas_total"),
                    DB::raw("CASE
                        WHEN COALESCE(array_to_string((array_agg(porta_arquivos.arquivo_id ORDER BY porta_arquivos.id DESC))[1:1], ''), '') = '' THEN 'ECJ43dGrV2TEmRqC8qUwOAgADupWmZxG'
                        ELSE array_to_string((array_agg(porta_arquivos.arquivo_id ORDER BY porta_arquivos.id DESC))[1:1], '')
                    END AS ultima_imagem"),

                DB::raw("array_to_string((array_agg(distinct porta_arquivos.arquivo_id)), '|X|') as imagens"),
                DB::raw("departamentos.hierarquia as dep_hierarquia"),
                DB::raw("LEFT(LEFT(departamentos.hierarquia, LENGTH(departamentos.hierarquia) - 1), LENGTH(LEFT(departamentos.hierarquia, LENGTH(departamentos.hierarquia) - 1)) - POSITION('.' IN REVERSE(LEFT(departamentos.hierarquia, LENGTH(departamentos.hierarquia) - 1))))||'.' AS dep_hierarquia_pai"),
                DB::raw("departamentos.tipo as dep_tipo"),
                DB::raw("departamentos.nome as dep_nome"),
                DB::raw("departamentos.sigla as dep_sigla"),
                DB::raw("departamentos.especializacao as dep_especializacao"),
                DB::raw("coalesce(departamentos.municipio, '-') as dep_municipio"),
                DB::raw("departamentos.municipioid as dep_municipioid"),
                DB::raw("departamentos.telefone as dep_telefone"),
                DB::raw("departamentos.telefone2 as dep_telefone2"),
                DB::raw("departamentos.telefone3 as dep_telefone3"),
                DB::raw("departamentos.escala as dep_escala"),
                DB::raw("departamentos.titular_id"),
                DB::raw("serv_titular.nome as titular"),
                DB::raw("serv_titular.celular as titular_celular"),
                DB::raw("serv_titular.telefone as titular_telefone"),
                DB::raw("serv_titular.email as titular_email"),
                DB::raw("coalesce(departamentos.departamento_grupo_id, 999) as departamento_grupo_id"),
                DB::raw("coalesce(departamento_grupos.nome, 'Externo') as departamento_grupo"));
//y4htBefISsK05Pkj9DjTWZhI2NvHDhaC



            if(($tipo_data == '0ANI')||($tipo_data == '0ANF')){
                    $SQL->join('scobe.obra_etapas as obra_etapas', function ($join) use ($dtai, $dtaf, $tipo_data) {
                        $join->on('obras.id', '=', 'obra_etapas.obra_id');
                            if($tipo_data == '0ANI'){
                                $join->whereBetween('obra_etapas.dtai', [$dtai, $dtaf]);
                            }
                            if($tipo_data == '0ANF'){
                                $join->whereBetween('obra_etapas.dtaf', [$dtai, $dtaf])
                                ->where('obra_etapas.status', 'FIN');
                            }
                    });
            }else{
                $SQL->leftJoin('scobe.obra_etapas as obra_etapas', 'obras.id', '=', 'obra_etapas.obra_id');
            }

            $SQL->leftJoinSub($subquery, 'z', function ($join) {
                    $join->on('obras.id', '=', 'z.obra_id');
            });

           // $SQL->leftJoin('scobe.obra_etapas as obra_etapas', 'obras.id', '=', 'obra_etapas.obra_id');

             $SQL->leftJoin('departamentos', 'obras.departamento_id', '=', 'departamentos.id')
                ->leftJoin('departamento_grupos', 'departamentos.departamento_grupo_id', '=', 'departamento_grupos.id')
                ->leftJoin('servidors as serv_titular', 'serv_titular.id', '=', 'departamentos.titular_id')
                ->leftJoin('servidors as serv_etapa', 'serv_etapa.id', '=', 'obra_etapas.servidor_id');

              $SQL->leftJoin('scobe.porta_arquivos as porta_arquivos', function ($join) {
                        $join->on('obras.id', '=', 'porta_arquivos.obra_id')
                            ->where('porta_arquivos.arquivo_tipo', '=', 'IMAGEM')
                            ->where('porta_arquivos.tipo', '<>', 'ETAPA')
                            ->where('porta_arquivos.excluido', '=', FALSE);
                    });

               $SQL->leftJoin('scobe.etapas as etapas_andamento', 'etapas_andamento.id', '=', 'obra_etapas.etapa_id')
                ->where(function ($query) use ($tipo_data, $grupo_id, $dep_id) {


                            //$query->where('obras.status', '<>', '9INA');

                            if ($dep_id!='') {
                                $filtrou='SIM';
                                $query->Where('obras.departamento_id', $dep_id);
                            }
                            if ($grupo_id!='') {
                                $filtrou='SIM';
                                $query->Where('departamentos.departamento_grupo_id', $grupo_id);
                            }


                })

                ->groupBy('obras.sei',
                    'obras.departamento_id',
                    'obras.tipo',
                    'obras.regularizacao',
                    'obras.departamento_telefone',
                    'obras.solicitante',
                    'obras.obs',
                    'obras.status',
                    'obras.created_at',
                    'obras.updated_at',
                    'obras.id',
                    'obras.dtai',
                    'obras.dtaf',
                    'obras.conclusao',
                    'obras.dta_previ',
                    'obras.dta_prevf',
                    'departamentos.hierarquia',
                    'departamentos.tipo',
                    'departamentos.nome',
                    'departamentos.especializacao',
                    'departamentos.municipio',
                    'departamentos.municipioid',
                    'departamentos.telefone',
                    'departamentos.telefone2',
                    'departamentos.telefone3',
                    'departamentos.escala',
                    'departamentos.sigla',
                    'departamentos.titular_id',
                    'serv_titular.nome',
                    'serv_titular.celular',
                    'serv_titular.telefone',
                    'serv_titular.email',
                    'departamentos.departamento_grupo_id',
                    'departamento_grupos.nome',
                    'z.qtd_etapas',
                    'z.valor_etapas',
                    'z.etapa_pendente_date',
                    'z.qtd_etapas_pendentes',
                    'z.qtd_etapas_finalizadas')
                ->orderBy('obras.dtai');

                $retorno=$SQL->get();



                /*foreach($retorno as $ret){
                    try {
                        $departamento = json_decode(Http::get(env('ENDERECO_LEGADOWS') . 'unidadePorId/'.$ret->departamento_id.'?token=' . $req->header('Token')));
                        $ret->departamento = $departamento->nome;
                    } catch (\Exception $e) {
                        // Lidar com a exceção
                     //   echo 'Erro: ' . $e->getMessage();
                    }
                    //$departamento = json_decode( Http::get(env('ENDERECO_LEGADOWS') . 'unidadePorId/'.$ret->departamento_id.'?token=' . $req->header('Token')));
                    //$ret->departamento=$departamento->nome;
                }*/


                //
                return response()->json(['message' => 'teste -> ', 'SQL' => '', 'retorno' => $retorno], 200);//'.$SQL->toSql().'
           /* }else{
                return response()->json(['message' => 'Escolha um produto(patrimonio). '.$th], 400);
            }*/

      /*  }catch(\Throwable $th){
            return response()->json(['message' => 'Erro ao tentar buscar. '.$req->get('patrimonio_id').' ! '.$th], 400);
        }*/
    }

}

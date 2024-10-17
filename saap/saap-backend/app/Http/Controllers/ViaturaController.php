<?php

namespace App\Http\Controllers;
use App\Models\Veiculo;
use App\Models\Servidor;
use App\Models\Departamento;
use App\Models\DepartamentoGrupo;
use App\Models\VtrAbastecimento;
use App\Models\VeiculoHistorico;
use App\Models\VeiculoPortaArquivo;
use App\Models\VeiculoLog;
use App\Models\VeiculoMulta;
use App\Models\VeiculoMultaAutuador;
use App\Models\VeiculoMultaPortaArquivo;
use App\Models\VeiculoMultaInfracaoTipo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Mpdf\Mpdf;

class ViaturaController extends Controller
{




public function listVtrsSaap(Request $req) {
        $query = null;

        //try{

        $zcons_cidade_id = $req->get('zcons_cidade_id');
        if ($zcons_cidade_id === null || $zcons_cidade_id === 'undefined') {
            $zcons_cidade_id = '';
        }

        $zcons_filtro = $req->get('zcons_filtro');
        if ($zcons_filtro === null || $zcons_filtro === 'undefined') {
            $zcons_filtro = '';
        }

        $zcons_dep_lotacao_id = $req->get('zcons_dep_lotacao_id');
        if ($zcons_dep_lotacao_id === null || $zcons_dep_lotacao_id === 'undefined') {
            $zcons_dep_lotacao_id = '';
        }
        $zcons_servidor_id = $req->get('zcons_servidor_id');
        if ($zcons_servidor_id === null || $zcons_servidor_id === 'undefined') {
            $zcons_servidor_id = '';
        }
        $zcons_agrupador_lotacao_id = $req->get('zcons_agrupador_lotacao_id');
        if ($zcons_agrupador_lotacao_id === null || $zcons_agrupador_lotacao_id === 'undefined') {
            $zcons_agrupador_lotacao_id = '';
        }
        $zconfirmacao = $req->get('zconfirmacao');
        if ($zconfirmacao === null || $zconfirmacao === 'undefined') {
            $zconfirmacao = '';
        }



        $query = Veiculo::select(
            'veiculos.*',
            'veiculos.id as key',
            DB::raw("case veiculos.combustivel
                when 'ALCOOL' then 'Álcool'
                when 'DIESEL' then 'Diesel'
                when 'ALCOOL/GASOLINA' then 'Flex'
                when 'GASOLINA' then 'Gasolina'
                when 'GAS' then 'Gás'
                when 'ELETRICO' then 'Elétrico'
                when 'HIBRIDO PLUGIN' then 'Elétrico PlugIn'
                when 'HIBRIDO' then 'Híbrido'
                end as combustivel_desc"),
            DB::raw("TO_CHAR(veiculos.created_at, 'DD/MM/YYYY HH:MI') as created_at_br"),
            DB::raw("TO_CHAR(veiculos.data_dp_confirmacao, 'DD/MM/YYYY HH:MI') as data_dp_confirmacao_br"),
            DB::raw("TO_CHAR(veiculos.data_substituicao, 'DD/MM/YYYY') as data_substituicao_br"),
            DB::raw("case when veiculos.updated_at is null then '' else TO_CHAR(veiculos.updated_at, 'DD/MM/YYYY HH:MI') end as updated_at_br"),
            DB::raw("case when veiculos.data_aquisicao is null then '' else TO_CHAR(veiculos.data_aquisicao, 'DD/MM/YYYY HH:MI') end as data_aquisicao_br"),
            DB::raw("serv_titular.nome as titular"),
            DB::raw("serv_titular.celular as titular_celular"),
            DB::raw("serv_titular.telefone as titular_telefone"),
            DB::raw("serv_titular.email as titular_email"),
            DB::raw("CONCAT_WS(' ', split_part(serv_titular.nome, ' ', 1), split_part(serv_titular.nome, ' ', -1)) as titular_abreviado"),
            DB::raw("motorista.nome as motorista"),
            DB::raw("motorista.celular as motorista_celular"),
            DB::raw("motorista.telefone as motorista_telefone"),
            DB::raw("motorista.email as motorista_email"),
            DB::raw("CONCAT_WS(' ', split_part(motorista.nome, ' ', 1), split_part(motorista.nome, ' ', -1)) as motorista_abreviado"),
            DB::raw("departamentos.nome as departamento_nome"),
            DB::raw("departamentos.hierarquia as departamento_hierarquia"),
            DB::raw("departamentos.tipo  as departamento_tipo"),
            DB::raw("departamentos.especializacao  as departamento_especializacao"),
            DB::raw("departamentos.portaria  as departamento_portaria"),
            DB::raw("departamentos.sigla  as departamento_sigla"),
            DB::raw("coalesce(departamentos.municipio, '-')  as departamento_municipio"),
            DB::raw("departamentos.municipioid  as departamento_municipioid"),
            DB::raw("departamentos.telefone  as departamento_telefone"),
            DB::raw("departamentos.telefone2  as departamento_telefone2"),
            DB::raw("departamentos.telefone3  as departamento_telefone3"),
            DB::raw("departamentos.escala  as departamento_escala"),
            DB::raw("departamentos.status as departamento_status"),
            DB::raw("departamentos.departamento_grupo_id"),
            DB::raw("veiculos.departamento_provisorio_id"),
            DB::raw("dep_provisorio.nome as departamento_provisorio_nome"),
            DB::raw("array_to_string((array_agg(distinct vtr.veiculo_porta_arquivos.arquivo_id)), '|X|') as imagens"),
            DB::raw("vtr_troca.placa as vtr_troca_placa"),
            DB::raw("vtr_troca.categoria as vtr_troca_categoria"),
            DB::raw("vtr_troca.marca as vtr_troca_marca"),
            DB::raw("vtr_troca.modelo as vtr_troca_modelo"),
            DB::raw("vtr_troca.prefixo as vtr_troca_prefixo"),
            DB::raw("vtr_troca.chassis as vtr_troca_chassis"),
            DB::raw("vtr_troca.renavam as vtr_troca_renavam"),
            DB::raw("vtr_troca.cor as vtr_troca_cor"),
            DB::raw("vtr_troca.locadora as vtr_troca_locadora"),
            DB::raw("vtr_troca.combustivel as vtr_troca_combustivel"),
            DB::raw("vtr_troca.numero_sei as vtr_troca_numero_sei"),
            DB::raw("vtr_troca.ano_fabricacao as vtr_troca_ano_fabricacao"),
            DB::raw("vtr_troca.numero_cartao_abas as vtr_troca_numero_cartao_abas"),
        )
        ->leftJoin('departamentos', 'veiculos.departamento_id', '=', 'departamentos.id')
        ->leftJoin('departamentos as dep_provisorio', 'veiculos.departamento_provisorio_id', '=', 'dep_provisorio.id')
        ->leftJoin('servidors as serv_titular', function ($join) {
            $join->on('serv_titular.id', '=', 'departamentos.titular_id')
                ->orOn('serv_titular.id', '=', 'departamentos.titular_interino_id')
                ->whereNull('departamentos.titular_interino_id');
        })
        ->leftJoin('servidors as motorista', 'veiculos.motorista_id', '=', 'motorista.id')
        ->leftJoin('vtr.veiculo_porta_arquivos', function ($join) {
            $join->on('veiculos.id', '=', 'vtr.veiculo_porta_arquivos.veiculo_id')
                ->where('vtr.veiculo_porta_arquivos.arquivo_tipo', '=', 'IMAGEM')
                ->where('vtr.veiculo_porta_arquivos.excluido', '=', FALSE);
        })
        ->leftJoin('vtr.veiculos as vtr_troca', 'veiculos.veiculo_id_substituicao', '=', 'vtr_troca.id')
        ->where(function ($query) use ($zcons_cidade_id, $zconfirmacao, $zcons_filtro, $zcons_servidor_id, $zcons_dep_lotacao_id, $zcons_agrupador_lotacao_id) {

                    $query->where(function ($subquery) {
                        $subquery->where('vtr.veiculos.status', '=', 'ATIVO')
                                ->orWhere('vtr.veiculos.status', '=', 'ATIVO_SEM_MOV');
                    });

                    if ($zcons_cidade_id != '') {
                        $query->Where('departamentos.municipioid', $zcons_cidade_id);
                    }

                    if ($zconfirmacao != '') {
                        if ($zconfirmacao === 'AGUARDANDO') {
                            $query->whereRaw("COALESCE(vtr.veiculos.aplicacao, '') = ''");
                        }
                        if ($zconfirmacao === 'CONFIRMADA_DP') {
                            $query->Where('vtr.veiculos.aplicacao', 'CONFIRMADA_DP');
                        }
                        if ($zconfirmacao === 'NAO_CONFIRMADA_DP') {
                            $query->Where('vtr.veiculos.aplicacao', 'NAO_CONFIRMADA_DP');
                        }
                    }

                    if ($zcons_dep_lotacao_id != '-1' && $zcons_dep_lotacao_id != '') {
                        if (strpos($zcons_dep_lotacao_id, '.') !== false) {
                            $query->Where('departamentos.hierarquia', 'ilike', $zcons_dep_lotacao_id . '%');
                        } else {
                            // Caso contrário, filtrar pelo lotacao_id
                            $query->where('veiculos.departamento_id', $zcons_dep_lotacao_id)
                                ->orWhere('veiculos.departamento_provisorio_id', $zcons_dep_lotacao_id);
                        }
                    }else{
                        if ($zcons_agrupador_lotacao_id != '-1') {
                            if ($zcons_agrupador_lotacao_id != '') {
                                $query->Where('departamentos.departamento_grupo_id', $zcons_agrupador_lotacao_id);
                            }
                        }
                    }

                    if ($zcons_servidor_id != '') {
                        $query->where(function ($query) use ($zcons_servidor_id) {
                            $query->orWhere('veiculos.motorista_id', $zcons_servidor_id)
                            ->orWhere('departamentos.titular_id', $zcons_servidor_id)
                            ->orWhere('departamentos.titular_interino_id', $zcons_servidor_id);
                        });
                    }

                    if ($zcons_filtro != '') {
                        $query->where(function ($query) use ($zcons_filtro) {
                            $query->orWhere('veiculos.placa',  strtoupper($zcons_filtro))
                                ->orWhere('veiculos.placa_vinculada', strtoupper($zcons_filtro))
                                ->orWhere('veiculos.categoria', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('veiculos.marca', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('veiculos.modelo', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('veiculos.cor', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('veiculos.prefixo', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('veiculos.chassis', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('veiculos.renavam', strtoupper($zcons_filtro) )
                                ->orWhere('veiculos.motor', strtoupper($zcons_filtro) )
                                ->orWhere('veiculos.numero_sei', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('veiculos.numero_nf', strtoupper($zcons_filtro) )
                                ->orWhere('veiculos.patrimonio', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('veiculos.leilao_lote', strtoupper($zcons_filtro) )
                                ->orWhere('veiculos.tag', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('veiculos.leilao_leiloeiro', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('veiculos.leilao_nf',strtoupper($zcons_filtro) )
                                ->orWhere('veiculos.numero_cartao_abas',  strtoupper($zcons_filtro))
                                ->orWhere('departamentos.municipio', 'ilike', '%' . strtoupper($zcons_filtro) . '%');
                        });
                    }

            })
        ->groupBy(  'veiculos.id',
                    'veiculos.id_sisvtr',
                    'veiculos.departamento_id',
                    'veiculos.placa',
                    'veiculos.placa_vinculada',
                    'veiculos.categoria',
                    'veiculos.ano_fabricacao',
                    'veiculos.marca',
                    'veiculos.modelo',
                    'veiculos.cor',
                    'veiculos.tombamento_spm',
                    'veiculos.prefixo',
                    'veiculos.chassis',
                    'veiculos.renavam',
                    'veiculos.origem',
                    'veiculos.motor',
                    'veiculos.numero_sei',
                    'veiculos.numero_nf',
                    'veiculos.propriedade',
                    'veiculos.responsavel_id',
                    'veiculos.motorista_id',
                    'veiculos.estado_conservacao',
                    'veiculos.destinacao',
                    'veiculos.data_aquisicao',
                    'veiculos.onus',
                    'veiculos.aplicacao',
                    'veiculos.patrimonio',
                    'veiculos.combustivel',
                    'veiculos.recurso',
                    'veiculos.numero_cartao_abas',
                    'veiculos.consumo',
                    'veiculos.hodometro',
                    'veiculos.acessorios_step',
                    'veiculos.acessorios_macaco',
                    'veiculos.acessorios_chave_reserva',
                    'veiculos.acessorios_triangulo',
                    'veiculos.acessorios_carpete',
                    'veiculos.acessorios_chave_roda',
                    'veiculos.acessorios_tampao',
                    'veiculos.acessorios_antena',
                    'veiculos.acessorios_crlv',
                    'veiculos.acessorios_tapete',
                    'veiculos.acessorios_comunicador',
                    'veiculos.acessorios_calota',
                    'veiculos.acessorios_giroflex',
                    'veiculos.acessorios_sirene',
                    'veiculos.acessorios_kojak',
                    'veiculos.created_at',
                    'veiculos.updated_at',
                    'veiculos.status',
                    'veiculos.obs',
                    'veiculos.fun_cad_id',
                    'veiculos.fun_cad',
                    'veiculos.fun_up_id',
                    'veiculos.fun_up',
                    'veiculos.mapa_departamento',
                    'veiculos.mapa_responsavel',
                    'veiculos.mapa_motorista',
                    'veiculos.mapa_conferencia',
                    'veiculos.status_uso',
                    'veiculos.contrato',
                    'veiculos.locadora',
                    'veiculos.leilao_lote',
                    'veiculos.tag',
                    'veiculos.leilao_nf',
                    'veiculos.leilao_leiloeiro',
                    'veiculos.data_dp_confirmacao',
                    'veiculos.radio_modelo',
                    'veiculos.radio_tei',
                    'veiculos.radio_patrimonio',
                    'veiculos.radio_serial',
                    'serv_titular.nome',
                    'serv_titular.celular',
                    'serv_titular.telefone',
                    'serv_titular.email',
                    'motorista.nome',
                    'motorista.celular',
                    'motorista.telefone',
                    'motorista.email',
                    'departamentos.nome',
                    'departamentos.hierarquia',
                    'departamentos.tipo',
                    'departamentos.especializacao',
                    'departamentos.portaria',
                    'departamentos.sigla',
                    'departamentos.municipioid',
                    'departamentos.municipio',
                    'departamentos.telefone',
                    'departamentos.telefone2',
                    'departamentos.telefone3',
                    'departamentos.escala',
                    'departamentos.status',
                    'departamentos.departamento_grupo_id',
                    'veiculos.departamento_provisorio_id',
                    'dep_provisorio.nome',
                    'veiculos.veiculo_id_substituicao',
                    'veiculos.obs_substituicao',
                    'veiculos.data_substituicao',
                    "vtr_troca.placa",
                    "vtr_troca.categoria",
                    "vtr_troca.marca",
                    "vtr_troca.modelo",
                    "vtr_troca.prefixo",
                    "vtr_troca.chassis",
                    "vtr_troca.renavam",
                    "vtr_troca.cor",
                    "vtr_troca.locadora",
                    "vtr_troca.combustivel",
                    "vtr_troca.numero_sei",
                    "vtr_troca.ano_fabricacao",
                    "vtr_troca.numero_cartao_abas"
                );


        $query->orderByRaw("veiculos.categoria, veiculos.marca, veiculos.modelo");



        $retorno = $query->get();


        return response()->json(['message' => '', 'sql' => '', 'retorno' => $retorno], 200); //, 'sql' => $query->toSql()



}



public function saveVeiculoPortaArquivo(Request $req) {
        try {

                $veiculo_id = $req->has('veiculo_id') ? $req->get('veiculo_id') : '';
                $arquivo_id = $req->has('arquivo_id') ? $req->get('arquivo_id') : '';
                $user_nome = $req->has('user_nome') ? $req->get('user_nome') : '';
                $user_id = $req->has('user_id') ? $req->get('user_id') : '';
                $fileType = $req->has('fileType') ? $req->get('fileType') : '';
                $legenda = $req->has('legenda') ? $req->get('legenda') : '';

                if($veiculo_id==='' || $arquivo_id==='' || $user_nome==='' || $user_id==='' || $fileType===''){
                    return response()->json(['message' => 'Erro ao tentar gravar arquivo. Ids não informados.'], 400);
                }else{

                    $identificacaoArquivo = VeiculoPortaArquivo::create([
                        'veiculo_id' => $veiculo_id,
                        'arquivo_id' => $arquivo_id,
                        'user_cad' => $user_nome,
                        'arquivo_tipo' => $fileType,
                        'legenda' => $legenda,
                        'user_cad_id' => $user_id
                    ]);
                    $novoID = $identificacaoArquivo->id;
                    $message = 'Upload Realizado com Sucesso.';

                    return response()->json(['message' => $message, 'id' => $novoID], 200);
                }

        } catch (\Throwable $th) {
            return response()->json(['message' => 'Erro ao tentar gravar arquivo. '.$th->getMessage()], 400);
        }
    }





    public function excluirVeiculoPortaArquivo(Request $req) {
        try {

                $veiculo_id = $req->has('veiculo_id') ? $req->get('veiculo_id') : '';
                $arquivo_id = $req->has('arquivo_id') ? $req->get('arquivo_id') : '';
                $user_nome = $req->has('user_nome') ? $req->get('user_nome') : '';
                $user_id = $req->has('user_id') ? $req->get('user_id') : '';

                if($veiculo_id==='' || $arquivo_id==='' || $user_nome==='' || $user_id===''){
                    return response()->json(['message' => 'Erro ao tentar gravar arquivo. Ids não informados.'], 400);
                }else{

                    VeiculoPortaArquivo::where('veiculo_id', $veiculo_id)
                    ->where('arquivo_id', $arquivo_id)
                    ->update([
                        'excluido' => true,
                        'user_exc_id' => $user_id,
                        'user_exc' => $user_nome
                    ]);

                    $message = 'Alterado com Sucesso.';

                    return response()->json(['message' => $message], 200);
                }

        } catch (\Throwable $th) {
            return response()->json(['message' => 'Erro ao tentar gravar arquivo. '.$th->getMessage()], 400);
        }
    }

    public function listarVeiculoPortaArquivos(Request $req){

        $veiculo_id = $req->has('veiculo_id') ? $req->get('veiculo_id') : '';

        if($veiculo_id===''){
            return response()->json(['message' => 'Sem veiculo_id ??', 'retorno' => ''], 200);
        }

        try {
            $query=VeiculoPortaArquivo::select(
                DB::raw("ROW_NUMBER() OVER () as arquivo_numero"),
                DB::raw("vtr.veiculo_porta_arquivos.legenda"),
                'vtr.veiculo_porta_arquivos.*',
                DB::raw("'https://filews-h.ssp.go.gov.br/loadArquivo?id='||vtr.veiculo_porta_arquivos.arquivo_id as url"),
                DB::raw("case
                when vtr.veiculo_porta_arquivos.arquivo_tipo='IMAGEM' then 'FileImageOutlined'
                when vtr.veiculo_porta_arquivos.arquivo_tipo='PDF' then 'FilePdfOutlined'
                when vtr.veiculo_porta_arquivos.arquivo_tipo='DOC' or vtr.veiculo_porta_arquivos.arquivo_tipo='DOCX' then 'FileWordOutlined'
                when vtr.veiculo_porta_arquivos.arquivo_tipo='XLS' or vtr.veiculo_porta_arquivos.arquivo_tipo='XLSX' or vtr.veiculo_porta_arquivos.arquivo_tipo='XLT' or vtr.veiculo_porta_arquivos.arquivo_tipo='XLTX' then 'FileExcelOutlined'
                else 'FileUnknownOutlined' end arquivo_tipo_icon"),
                DB::raw("TO_CHAR(vtr.veiculo_porta_arquivos.created_at, 'DD/MM/YYYY HH24:MI') as dta_upload_br")
                )
            ->Where('vtr.veiculo_porta_arquivos.excluido', false)
            ->Where('vtr.veiculo_porta_arquivos.veiculo_id', $veiculo_id)
            ->orderBy('created_at');

            $retorno = $query->get();

            return response()->json(['message' => 'ok', 'retorno' => $retorno], 200);//'message' => $query->toSql()

        } catch (\Throwable $th) {
            return response()->json(['message' => 'Erro ao tentar buscar Arquivos! '.$th,
                                    'sql' => '', // Adicione o SQL à matriz de retorno
                                    ], 400);
        }
    }



    public function saveViatura(Request $request) {
        //try {

            $new = $request->post('values');

                $veiculo = Veiculo::where('id', '=', $new['veiculo_id'])
               // ->where('departamento_id', $new['departamento_id'])
                ->first();

           /* if($veiculo){
                return response()->json(['message' => 'Você não é responsável ou motorista do veículo, logo não pode alterar informações dele.'], 201);
            }*/
            $xdesc_auditoria = '';
            $xatualiza_historico=false;


            if ($new['aplicacao'] === "SIM") {

                    if($veiculo->departamento_id!=$new['departamento_id'] || $veiculo->motorista_id!=$new['motorista_id']){
                        $xatualiza_historico=true;
                    }

                    $veiculo->update([
                        'fun_up_id' => $new['user_id'],
                        'fun_up' => $new['user_nome'],
                        'aplicacao' => 'CONFIRMADA_DP',
                        'status_uso' => $new['status_uso'],
                        'estado_conservacao' => $new['estado_conservacao'],
                        'motorista_id' => !isset($new['motorista_id']) ? null: $new['motorista_id'],
                        'departamento_id' => !isset($new['departamento_id']) ? null: $new['departamento_id'],
                        'data_dp_confirmacao' => now(),
                        'obs_motorista' => !isset($new['obs_motorista']) ? null: $new['obs_motorista'],
                    ]);

                    VeiculoLog::create([
                        'veiculo_id' => $new['veiculo_id'],
                        'acao' => 'Alterou', // Alterou, Excluiu, Incluiu
                        'descricao' => 'Reconhece a lotação da VTR',
                        'servidor_id' => $new['user_id'],
                        'servidor' => $new['user_nome'],
                    ]);


                    if($xatualiza_historico==true){
                        $veiculosHistorico = VeiculoHistorico::where('data_control', today())
                        ->where('veiculo_id', $new['veiculo_id'])
                        ->where('tipo', 'CONFERIDO')
                        ->first();

                        if($veiculosHistorico){
                            $veiculosHistorico->update([
                                'fun_up' => $new['user_nome'],
                                'data_historico' => now(),
                                'motorista_id' => !isset($new['motorista_id']) ? null: $new['motorista_id'],
                                'departamento_id' => !isset($new['departamento_id']) ? null: $new['departamento_id'],
                                'responsavel_id' => !isset($new['departamento_responsavel_id']) ? null: $new['departamento_responsavel_id'],
                                'observacao' => 'Conferido pelo Responsável Regional',
                            ]);
                        }else{
                            VeiculoHistorico::create([
                                'veiculo_id' => $new['veiculo_id'],
                                'fun_up' => $new['user_nome'],
                                'motorista_id' => !isset($new['motorista_id']) ? null: $new['motorista_id'],
                                'departamento_id' => !isset($new['departamento_id']) ? null: $new['departamento_id'],
                                'responsavel_id' => !isset($new['departamento_responsavel_id']) ? null: $new['departamento_responsavel_id'],
                                'tipo' => 'CONFERIDO',
                                'observacao' => 'Conferido pelo Responsável Regional',
                            ]);
                        }
                    }


            }else{//NAO
                    $veiculo->update([
                        'fun_up_id' => $new['user_id'],
                        'fun_up' => $new['user_nome'],
                        'aplicacao' => 'NAO_CONFIRMADA_DP',
                        'status_uso' => $new['status_uso'],
                        'motorista_id' => !isset($new['motorista_id']) ? null: $new['motorista_id'],
                        'departamento_id' => !isset($new['departamento_id']) ? null: $new['departamento_id'],
                        'data_dp_confirmacao' => now(),
                        'obs_motorista' => !isset($new['obs_motorista']) ? null: $new['obs_motorista'],
                    ]);

                    VeiculoLog::create([
                        'veiculo_id' => $new['veiculo_id'],
                        'acao' => 'Alterou', // Alterou, Excluiu, Incluiu
                        'descricao' => 'Não reconhece a lotação da VTR '.!isset($new['obs_motorista']) ? null: $new['obs_motorista'],
                        'servidor_id' => $new['user_id'],
                        'servidor' => $new['user_nome'],
                    ]);

            }//NAO

            return response()->json(['message' => 'Alterado com sucesso'], 200);


            /*
            if ($new['aplicacao'] === "CONFIRMADA_DP") {
                $xdesc_auditoria = 'Motorista: '.$new['motorista'].' - ';

                if (!empty($new['acessorios_crlv'])) {
                    $xdesc_auditoria .= ', CRLV';
                }
                if (!empty($new['acessorios_step'])) {
                    $xdesc_auditoria .= ', Step';
                }
                if (!empty($new['acessorios_macaco'])) {
                    $xdesc_auditoria .= ', Macaco';
                }
                if (!empty($new['acessorios_triangulo'])) {
                    $xdesc_auditoria .= ', Triângulo';
                }
                if (!empty($new['acessorios_chave_roda'])) {
                    $xdesc_auditoria .= ', Chave de Roda';
                }
                if (!empty($new['acessorios_chave_reserva'])) {
                    $xdesc_auditoria .= ', Chave Reserva';
                }
                if (!empty($new['acessorios_tampao'])) {
                    $xdesc_auditoria .= ', Tampão';
                }
                if (!empty($new['acessorios_tapete'])) {
                    $xdesc_auditoria .= ', Tapete';
                }
                if (!empty($new['acessorios_carpete'])) {
                    $xdesc_auditoria .= ', Carpete';
                }
                if (!empty($new['acessorios_calota'])) {
                    $xdesc_auditoria .= ', Calota';
                }
                if (!empty($new['acessorios_antena'])) {
                    $xdesc_auditoria .= ', Antena';
                }
                if (!empty($new['acessorios_comunicador'])) {
                    $xdesc_auditoria .= ', Comunicador';
                }
                if (!empty($new['acessorios_giroflex'])) {
                    $xdesc_auditoria .= ', Giroflex';
                }
                if (!empty($new['acessorios_sirene'])) {
                    $xdesc_auditoria .= ', Sirene';
                }
                if (!empty($new['acessorios_kojak'])) {
                    $xdesc_auditoria .= ', Kojak';
                }

                // Remove a primeira vírgula e espaço, se necessário
                $xdesc_auditoria = ltrim($xdesc_auditoria, ', ');


                if($veiculo->departamento_id!=$new['departamento_id'] || $veiculo->motorista_id!=$new['motorista_id']){
                    $xatualiza_historico=true;
                }


                 $veiculo->update([
                                'fun_up_id' => $new['user_id'],
                                'fun_up' => $new['user_nome'],
                                'aplicacao' => $new['aplicacao'],
                                'data_dp_confirmacao' => now(),
                                'obs_motorista' => !isset($new['obs_motorista']) ? null: $new['obs_motorista'],
                                'acessorios_crlv' => !isset($new['acessorios_crlv']) ? false: $new['acessorios_crlv'],
                                'acessorios_step' => !isset($new['acessorios_step']) ? false: $new['acessorios_step'],
                                'acessorios_macaco' => !isset($new['acessorios_macaco']) ? false: $new['acessorios_macaco'],
                                'acessorios_triangulo' => !isset($new['acessorios_triangulo']) ? false: $new['acessorios_triangulo'],
                                'acessorios_chave_roda' => !isset($new['acessorios_chave_roda']) ? false: $new['acessorios_chave_roda'],
                                'acessorios_chave_reserva' => !isset($new['acessorios_chave_reserva']) ? false: $new['acessorios_chave_reserva'],
                                'acessorios_tampao' => !isset($new['acessorios_tampao']) ? false: $new['acessorios_tampao'],
                                'acessorios_tapete' => !isset($new['acessorios_tapete']) ? false: $new['acessorios_tapete'],
                                'acessorios_carpete' => !isset($new['acessorios_carpete']) ? false: $new['acessorios_carpete'],
                                'acessorios_calota' => !isset($new['acessorios_calota']) ? false: $new['acessorios_calota'],
                                'acessorios_antena' => !isset($new['acessorios_antena']) ? false: $new['acessorios_antena'],
                                'acessorios_comunicador' => !isset($new['acessorios_comunicador']) ? false: $new['acessorios_comunicador'],
                                'acessorios_giroflex' => !isset($new['acessorios_giroflex']) ? false: $new['acessorios_giroflex'],
                                'acessorios_sirene' => !isset($new['acessorios_sirene']) ? false: $new['acessorios_sirene'],
                                'acessorios_kojak' => !isset($new['acessorios_kojak']) ? false: $new['acessorios_kojak'],
                            ]);

                    VeiculoLog::create([
                        'veiculo_id' => $new['veiculo_id'],
                        'acao' => 'Alterou', // Alterou, Excluiu, Incluiu
                        'descricao' => $xdesc_auditoria,
                        'servidor_id' => $new['user_id'],
                        'servidor' => $new['user_nome'],
                    ]);


                if($xatualiza_historico==true){

                            $veiculosHistorico = VeiculoHistorico::where('data_control', today())
                            ->where('veiculo_id', $new['veiculo_id'])
                            ->where('tipo', 'CONFERIDO')
                            ->first();

                            if($veiculosHistorico){
                                $veiculosHistorico->update([
                                    'fun_up' => $new['user_nome'],
                                    'data_historico' => now(),
                                    'motorista_id' => !isset($new['motorista_id']) ? null: $new['motorista_id'],
                                    'departamento_id' => !isset($new['departamento_id']) ? null: $new['departamento_id'],
                                    'responsavel_id' => !isset($new['departamento_responsavel_id']) ? null: $new['departamento_responsavel_id'],
                                    'observacao' => !isset($new['obs_motorista']) ? null: $new['obs_motorista'],
                                ]);
                            }else{
                                VeiculoHistorico::create([
                                    'veiculo_id' => $new['veiculo_id'],
                                    'fun_up' => $new['user_nome'],
                                    'motorista_id' => !isset($new['motorista_id']) ? null: $new['motorista_id'],
                                    'departamento_id' => !isset($new['departamento_id']) ? null: $new['departamento_id'],
                                    'responsavel_id' => !isset($new['departamento_responsavel_id']) ? null: $new['departamento_responsavel_id'],
                                    'observacao' => !isset($new['obs_motorista']) ? null: $new['obs_motorista'],
                                    'tipo' => 'CONFERIDO',
                                ]);
                            }
                }

            }else{//VIATURA NÃO RECONHECIDA
                    $veiculo->update([
                                'fun_up_id' => $new['user_id'],
                                'fun_up' => $new['user_nome'],
                                'aplicacao' => $new['aplicacao'],
                                'data_dp_confirmacao' => now(),
                                'obs_motorista' => !isset($new['obs_motorista']) ? null: $new['obs_motorista'],
                            ]);

                    VeiculoLog::create([
                        'veiculo_id' => $new['veiculo_id'],
                        'acao' => 'Alterou', // Alterou, Excluiu, Incluiu
                        'descricao' => 'Não ENCONTRA-SE no departamento. '.!isset($new['obs_motorista']) ? null: $new['obs_motorista'],
                        'servidor_id' => $new['user_id'],
                        'servidor' => $new['user_nome'],
                    ]);
            }


           // $servidor = Servidor::firstOrNew(['cpf' => $new['cpf']]);


           // $servidor = Servidor::firstOrNew(['cpf' => $new['cpf']]);

            return response()->json(['message' => 'Alterado com sucesso'], 200);
*/
    }



public function listAbastecimentos(Request $req){


            $zcons_placa = $req->has('placa') ? $req->get('placa') : null;


            //$filtrosArray = explode(', ', $filtros);

           $query = VtrAbastecimento::select(
                'vtr_abastecimentos.*',
                DB::raw("substring(posto_combustivel, strpos(posto_combustivel, ' - ') + 3) AS nome_posto"),
                DB::raw("REPLACE(produto, ' COMUM', '') AS nome_produto"),
                DB::raw("TO_CHAR(vtr_abastecimentos.dta_importacao, 'DD/MM/YYYY HH24:MI') as dta_importacao_br"),
                DB::raw("TO_CHAR(vtr_abastecimentos.dta_abastecimento, 'DD/MM/YYYY HH24:MI') as dta_abastecimento_br"),
                DB::raw("departamentos.nome as departamento_nome"),
                DB::raw("departamentos.hierarquia"),
                DB::raw("departamentos.telefone"),
                DB::raw("serv_titular.nome as titular_nome"),
                DB::raw("serv_titular.celular as titular_contato"),
                DB::raw("departamento_grupos.nome as departamento_grupo"),
                DB::raw("serv_grupo_titular.nome as grupo_titular_nome")
            )
            ->leftJoin('departamentos', 'departamentos.id', '=', 'vtr_abastecimentos.departamento_id')
            ->leftJoin('servidors as serv_titular', 'serv_titular.id', '=', 'departamentos.titular_id')
            ->leftJoin('departamento_grupos', 'departamentos.departamento_grupo_id', '=', 'departamento_grupos.id')
            ->leftJoin('departamentos as dep_corresp', 'dep_corresp.id', '=', 'departamento_grupos.departamento_correspondente_id')
            ->leftJoin('servidors as serv_grupo_titular', 'serv_grupo_titular.id', '=', 'dep_corresp.titular_id')
            ->where('vtr_abastecimentos.placa', 'ilike', strtoupper($zcons_placa))
            ->orderBy('vtr_abastecimentos.dta_abastecimento', 'desc')
            ->limit(20); // Aqui está correto


            $retorno = $query->get();
/*
                foreach($retorno as $ret){
                    $dp = json_decode( Http::get(env('ENDERECO_LEGADOWS') . 'unidadePorId/'.$ret->dp_id.'?token=' . $req->header('Token')));
                    $ret->dp=$dp->nome;
                }
*/

            return response()->json(['message' => 'ok', 'retorno' => $retorno], 200);//, 'sql' => $query->toSql()



    }



public function listInfracoes(Request $req) {
        $query = null;

        //try{

        $data_tipo = $req->has('zcons_data_tipo') ? $req->get('zcons_data_tipo') : null;

        $zorder = $req->has('zorder') ? $req->get('zorder') : 'veiculos.prefixo';

        $zorder = $req->get('zorder');
        if ($zorder === null || $zorder === 'undefined') {
            $zorder = '';
        }

        $zcons_cidade_id = $req->get('zcons_cidade_id');
        if ($zcons_cidade_id === null || $zcons_cidade_id === 'undefined') {
            $zcons_cidade_id = '';
        }

        $dtai = $req->has('dtai') ? $req->get('dtai') : null;
        $dtaiBR = $dtai;
        if ($dtai === null || $dtai === 'undefined') {
            $dtai = '';
        } else {
            $dtai = Carbon::parse($dtai)->format('Y-m-d');
        }

        $dtaf = $req->has('dtaf') ? $req->get('dtaf') : null;
        $dtafBR = $dtaf;
        if ($dtaf === null || $dtaf === 'undefined') {
            $dtaf = '';
        } else {
            $dtaf = Carbon::parse($dtaf)->addDay()->format('Y-m-d');
        }

        $zcons_filtro_and = $req->get('zcons_filtro_and');
        if ($zcons_filtro_and === null || $zcons_filtro_and === 'undefined') {
            $zcons_filtro_and = '';
        }
        $zcons_filtro_or = $req->get('zcons_filtro_or');
        if ($zcons_filtro_or === null || $zcons_filtro_or === 'undefined') {
            $zcons_filtro_or = '';
        }
        $zcons_filtro = $req->get('zcons_filtro');
        if ($zcons_filtro === null || $zcons_filtro === 'undefined') {
            $zcons_filtro = '';
        }


        $zcons_vtr_id = $req->get('zcons_vtr_id');
        if ($zcons_vtr_id === null || $zcons_vtr_id === 'undefined') {
            $zcons_vtr_id = '';
        }
        $zcons_dep_lotacao_id = $req->get('zcons_dep_lotacao_id');
        if ($zcons_dep_lotacao_id === null || $zcons_dep_lotacao_id === 'undefined') {
            $zcons_dep_lotacao_id = '';
        }
        $zcons_servidor_id = $req->get('zcons_servidor_id');
        if ($zcons_servidor_id === null || $zcons_servidor_id === 'undefined') {
            $zcons_servidor_id = '';
        }
        $zcons_agrupador_lotacao_id = $req->get('zcons_agrupador_lotacao_id');
        if ($zcons_agrupador_lotacao_id === null || $zcons_agrupador_lotacao_id === 'undefined') {
            $zcons_agrupador_lotacao_id = '';
        }
        $zcons_autuador_id = $req->get('zcons_autuador_id');
        if ($zcons_autuador_id === null || $zcons_autuador_id === 'undefined') {
            $zcons_autuador_id = '';
        }




        $query = VeiculoMulta::select(
            'vtr.multas.*',
            'vtr.multas.id as key',
            'vtr.multas.placa as multa_placa',
            'vtr.veiculos.categoria',
            'vtr.veiculos.marca',
                    'vtr.veiculos.modelo',
                    'vtr.veiculos.cor',
                    'vtr.veiculos.prefixo',
                    'vtr.veiculos.chassis',
                    'vtr.veiculos.renavam',
                    'vtr.veiculos.placa',
                    'vtr.veiculos.placa_vinculada',
                    'vtr.veiculos.propriedade',
                    'vtr.veiculos.numero_sei',
                    'vtr.veiculos.motor',
            DB::raw("case vtr.veiculos.combustivel
                when 'ALCOOL' then 'Álcool'
                when 'DIESEL' then 'Diesel'
                when 'ALCOOL/GASOLINA' then 'Flex'
                when 'GASOLINA' then 'Gasolina'
                when 'GAS' then 'Gás'
                when 'ELETRICO' then 'Elétrico'
                when 'HIBRIDO PLUGIN' then 'Elétrico PlugIn'
                when 'HIBRIDO' then 'Híbrido'
                end as combustivel_desc"),
            DB::raw("vtr.multa_infracao_tipos.descricao as infracao"),
            DB::raw("vtr.multa_infracao_tipos.criminal as infracao_tipo"),
            DB::raw("TO_CHAR(vtr.multas.created_at, 'DD/MM/YYYY HH:MI') as created_at_br"),
            DB::raw("case when vtr.multas.updated_at is null then '' else TO_CHAR(vtr.multas.updated_at, 'DD/MM/YYYY HH:MI') end as updated_at_br"),
            DB::raw("case when vtr.multas.data_multa is null then '' else TO_CHAR(vtr.multas.data_multa, 'DD/MM/YYYY HH:MI') end as data_multa_br"),
            DB::raw("case when vtr.multas.data_vencimento is null then '' else TO_CHAR(vtr.multas.data_vencimento, 'DD/MM/YYYY') end as data_vencimento_br"),
            DB::raw("serv_titular.nome as titular"),
            DB::raw("serv_titular.celular as titular_celular"),
            DB::raw("serv_titular.telefone as titular_telefone"),
            DB::raw("serv_titular.email as titular_email"),
            DB::raw("CONCAT_WS(' ', split_part(serv_titular.nome, ' ', 1), split_part(serv_titular.nome, ' ', -1)) as titular_abreviado"),
            DB::raw("motorista.nome as motorista"),
            DB::raw("motorista.celular as motorista_celular"),
            DB::raw("motorista.telefone as motorista_telefone"),
            DB::raw("motorista.email as motorista_email"),
            DB::raw("CONCAT_WS(' ', split_part(motorista.nome, ' ', 1), split_part(motorista.nome, ' ', -1)) as motorista_abreviado"),
            DB::raw("departamentos.nome as departamento_nome"),
            DB::raw("departamentos.hierarquia as departamento_hierarquia"),
            DB::raw("departamentos.tipo  as departamento_tipo"),
            DB::raw("departamentos.especializacao  as departamento_especializacao"),
            DB::raw("departamentos.portaria  as departamento_portaria"),
            DB::raw("departamentos.sigla  as departamento_sigla"),
            DB::raw("coalesce(departamentos.municipio, '-')  as departamento_municipio"),
            DB::raw("departamentos.municipioid  as departamento_municipioid"),
            DB::raw("departamentos.telefone  as departamento_telefone"),
            DB::raw("departamentos.telefone2  as departamento_telefone2"),
            DB::raw("departamentos.telefone3  as departamento_telefone3"),
            DB::raw("departamentos.escala  as departamento_escala"),
            DB::raw("departamentos.status as departamento_status"),
            DB::raw("vtr.multa_autuadores.descricao as multa_autuador"),
            DB::raw("vtr.multa_autuadores.cabecalho_notificacao as multa_autuador_cabecalho_notificacao"),
            DB::raw("vtr.multa_autuadores.cabecalho_penalidade as multa_autuador_cabecalho_penalidade"),
            DB::raw("
                CASE
                    WHEN vtr.recursos.id IS NOT NULL THEN -1
                    WHEN vtr.recursos.id IS NULL AND vtr.multas.data_vencimento < CURRENT_DATE THEN -2
                    ELSE (vtr.multas.data_vencimento - CURRENT_DATE)::int
                END AS vencimento_analise
            "),
            DB::raw("vtr.recursos.id as recurso_id"),
            DB::raw("vtr.recursos.numero as recurso_numero"),
            DB::raw("vtr.recursos.resultado as recurso_resultado"),
            DB::raw("case when vtr.recursos.data_recurso is null then '' else TO_CHAR(vtr.recursos.data_recurso, 'DD/MM/YYYY') end as data_recurso_br"),
            DB::raw("penalidades.id as penalidade_recurso_id"),
            DB::raw("penalidades.numero as penalidade_recurso_numero"),
            DB::raw("penalidades.resultado as penalidade_recurso_resultado"),
            DB::raw("case when penalidades.data_recurso is null then '' else TO_CHAR(penalidades.data_recurso, 'DD/MM/YYYY') end as data_penalidade_recurso_br"),
            DB::raw("array_to_string((array_agg(distinct porta_arquivos.arquivo_id)), '|X|') as imagens"),
        )
        ->leftJoin('vtr.multa_autuadores', 'vtr.multa_autuadores.id', '=', 'vtr.multas.multa_autuador_id')
        ->leftJoin('vtr.veiculos', 'vtr.veiculos.id', '=', 'vtr.multas.veiculo_id')
        ->leftJoin('departamentos', 'vtr.multas.departamento_id', '=', 'departamentos.id')
        ->leftJoin('servidors as serv_titular', 'vtr.multas.titular_id', '=', 'serv_titular.id')
        ->leftJoin('servidors as motorista', 'vtr.multas.motorista_id', '=', 'motorista.id')
        ->leftJoin('vtr.recursos', 'vtr.recursos.id', '=', 'vtr.multas.recurso_id')
        ->leftJoin('vtr.recursos as penalidades', 'penalidades.id', '=', 'vtr.multas.penalidade_id')
        ->leftJoin('vtr.multa_infracao_tipos', 'vtr.multa_infracao_tipos.id', '=', 'vtr.multas.infracao_id');

        $query->leftJoin('vtr.multa_porta_arquivos as porta_arquivos', function ($join) {
            $join->on('vtr.multas.id', '=', 'porta_arquivos.multa_id')
                ->where('porta_arquivos.arquivo_tipo', '=', 'IMAGEM')
                ->where('porta_arquivos.excluido', '=', false);
        });

        $query->where(function ($query) use ($zcons_autuador_id, $zcons_cidade_id, $data_tipo, $dtai, $dtaiBR, $dtaf, $dtafBR, $zcons_filtro_and, $zcons_filtro_or, $zcons_filtro, $zcons_vtr_id, $zcons_servidor_id, $zcons_dep_lotacao_id, $zcons_agrupador_lotacao_id) {

                    if ($zcons_cidade_id != '') {
                        $query->Where('departamentos.municipioid', $zcons_cidade_id);
                    }

                    if (strpos($zcons_filtro_and, 'Deps. Desativados') !== false) {
                        $query->where('departamentos.status', false);
                    }

                    if ((strlen($dtai) == 10) && (strlen($dtaf) == 10)) {
                        $query->where(function ($query) use ($dtai, $dtaf, $data_tipo) {
                            if ($data_tipo === 'CADASTRO') {
                                $query->orWhereBetween('vtr.multas.created_at', [$dtai, $dtaf]);
                            } elseif ($data_tipo === 'INFRACAO') {
                                $query->whereBetween('vtr.multas.data_multa', [$dtai, $dtaf]);
                            } else {
                                $query->whereBetween('vtr.multas.data_vencimento', [$dtai, $dtaf]);
                            }
                        });
                    }



/*

                    if (!empty($zcons_filtro_or)) {
                        $whereClausesOr = $this->VTRBuildWhereClauses($zcons_filtro_or);
                        $query->where(function ($query) use ($whereClausesOr) {
                            foreach ($whereClausesOr as $clause) {
                                $query->orWhere(...$clause);
                            }
                        });
                    }

                    if (!empty($zcons_filtro_and)) {
                        $whereClausesAnd = $this->VTRBuildWhereClauses($zcons_filtro_and);
                        $query->where(function ($query) use ($whereClausesAnd) {
                            foreach ($whereClausesAnd as $clause) {
                                $query->where(...$clause);
                            }
                        });
                    }
*/
                    if ($zcons_vtr_id != '') {
                        $query->Where('vtr.veiculos.id', $zcons_vtr_id);
                    }


                    if ($zcons_dep_lotacao_id != '-1' && $zcons_dep_lotacao_id != '') {
                        if (strpos($zcons_dep_lotacao_id, '.') !== false) {
                            $query->Where('departamentos.hierarquia', 'ilike', $zcons_dep_lotacao_id . '%');
                        } else {
                            // Caso contrário, filtrar pelo lotacao_id
                            $query->where('vtr.veiculos.departamento_id', $zcons_dep_lotacao_id);
                        }
                    }


                    if ($zcons_agrupador_lotacao_id != '-1') {
                        if ($zcons_agrupador_lotacao_id != '') {
                            $query->Where('departamentos.departamento_grupo_id', $zcons_agrupador_lotacao_id);
                        }
                    }


                    if ($zcons_servidor_id != '') {
                        $query->where(function ($query) use ($zcons_servidor_id) {
                            $query->orWhere('vtr.veiculos.motorista_id', $zcons_servidor_id)
                            ->orWhere('departamentos.titular_id', $zcons_servidor_id)
                            ->orWhere('departamentos.titular_interino_id', $zcons_servidor_id);
                        });
                    }


                    if ($zcons_filtro != '') {
                        $query->where(function ($query) use ($zcons_filtro) {
                            $query->orWhere('vtr.veiculos.placa', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('vtr.multas.contrato', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('vtr.multas.auto', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('vtr.multas.of_autuacao_num', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('vtr.multas.of_penalidade_num', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('vtr.multas.sei_num', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('vtr.multas.of_comunicacao', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('vtr.multas.local_multa', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('vtr.veiculos.placa_vinculada', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('vtr.veiculos.categoria', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('vtr.veiculos.ano_fabricacao', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('vtr.veiculos.marca', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('vtr.veiculos.modelo', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('vtr.veiculos.cor', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('vtr.veiculos.prefixo', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('vtr.veiculos.chassis', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('vtr.veiculos.renavam', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('vtr.veiculos.motor', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('vtr.veiculos.numero_sei', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('vtr.veiculos.numero_nf', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('vtr.veiculos.patrimonio', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('vtr.veiculos.leilao_lote', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('vtr.veiculos.tag', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('vtr.veiculos.leilao_leiloeiro', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('vtr.veiculos.leilao_nf', 'ilike', '%' . strtoupper($zcons_filtro) . '%')
                                ->orWhere('departamentos.municipio', 'ilike', '%' . strtoupper($zcons_filtro) . '%');
                        });
                    }


            });


            $query->groupBy(
                'vtr.multas.id',
                'vtr.multas.auto',
                'vtr.multas.placa',
                'vtr.multas.veiculo_id',
                'vtr.multas.valor',
                'vtr.multas.multa_autuador_id',
                'vtr.multas.fun_cad_id',
                'vtr.multas.fun_cad',
                'vtr.multas.fun_up_id',
                'vtr.multas.fun_up',
                'vtr.multas.created_at',
                'vtr.multas.updated_at',
                'vtr.multas.data_multa',
                'vtr.multas.local_multa',
                'vtr.multas.observacao',
                'vtr.multas.departamento_id',
                'vtr.multas.titular_id',
                'vtr.multas.motorista_id',
                'vtr.multas.data_vencimento',
                'vtr.multas.recurso_id',
                'vtr.multa_autuadores.descricao',
                'vtr.multa_autuadores.cabecalho_notificacao',
                'vtr.multa_autuadores.cabecalho_penalidade',
                'vtr.recursos.id',
                'vtr.recursos.multa_autuador_id',
                'vtr.recursos.numero',
                'vtr.recursos.fun_cad',
                'vtr.recursos.fun_cad_id',
                'vtr.recursos.fun_up',
                'vtr.recursos.fun_up_id',
                'vtr.recursos.data_recurso',
                'vtr.recursos.tipo',
                'vtr.recursos.enviado',
                'vtr.recursos.created_at',
                'vtr.recursos.updated_at',
                'vtr.recursos.resultado',
                'penalidades.id',
                'penalidades.multa_autuador_id',
                'penalidades.numero',
                'penalidades.fun_cad',
                'penalidades.fun_cad_id',
                'penalidades.fun_up',
                'penalidades.fun_up_id',
                'penalidades.data_recurso',
                'penalidades.tipo',
                'penalidades.enviado',
                'penalidades.created_at',
                'penalidades.updated_at',
                'penalidades.resultado',
                'vtr.veiculos.categoria',
                'vtr.veiculos.marca',
                    'vtr.veiculos.modelo',
                    'vtr.veiculos.cor',
                    'vtr.veiculos.prefixo',
                    'vtr.veiculos.chassis',
                    'vtr.veiculos.renavam',
                    'vtr.veiculos.placa',
                    'vtr.veiculos.placa_vinculada',
                    'vtr.veiculos.propriedade',
                    'vtr.veiculos.numero_sei',
                    'vtr.veiculos.motor',
            'vtr.veiculos.combustivel',
            "serv_titular.nome",
            "serv_titular.celular",
            "serv_titular.telefone",
            "serv_titular.email",
            "motorista.nome",
            "motorista.celular",
            "motorista.telefone",
            "motorista.email",
            "departamentos.nome",
            "departamentos.hierarquia",
            "departamentos.tipo",
            "departamentos.especializacao",
            "departamentos.portaria",
            "departamentos.sigla",
            "departamentos.municipio",
            "departamentos.municipioid",
            "departamentos.telefone",
            "departamentos.telefone2",
            "departamentos.telefone3",
            "departamentos.escala",
            "vtr.multa_infracao_tipos.descricao",
            "vtr.multa_infracao_tipos.criminal",
            "departamentos.status");

/*
        if ($zorder != 'veiculos.categoria') {
            $query->orderByRaw($zorder);
        }else{*/
            $query->orderByRaw("vtr.multas.data_vencimento, vtr.multa_autuadores.descricao, vtr.multas.auto");
      //  }


        $retorno = $query->get();


        return response()->json(['message' => '', 'sql' => $query->toSql(), 'retorno' => $retorno], 200); //, 'sql' => $query->toSql()






}

}

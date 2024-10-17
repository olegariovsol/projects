<?php

namespace App\Http\Controllers;
use App\Models\ServidorAposentadoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class ServidorAposentadoriaController extends Controller
{



    public function saveServidor(Request $request) {
        try {
            $new = $request->post('values');
            $dados = ServidorAposentadoria::updateOrInsert(
                ['cpf' => $new['cpf']], // Condições para encontrar o registro
                [
                    'telefone' => !isset($new['telefone']) ? null: $new['telefone'],
                    'email' => !isset($new['email']) ? null: $new['email'],
                    'dta_requisicao' => !isset($new['dta_requisicao']) ? null: $new['dta_requisicao'],
                    'user_cad_id' => $new['user_cad_id'],
                    'user_cad' => $new['user_cad'],
                    'sicad_id' => $new['servidor_id'],//fixo
                    'nome' => $new['servidor'],//fixo
                    'cpf' => $new['cpf'],//fixo
                    'sei' => $new['sei'],//fixo
                    'historico_id' => $new['historico_id'],//fixo
                    'genero' => $new['genero'],//fixo
                    'idade_requisicao' => $new['idade'],//fixo
                    'cargo' => $new['cargo'],//fixo
                    'dp_lotacao' => !isset($new['lotacao']) ? null: $new['lotacao'], //fixos
                    'dp_lotacao_id' => !isset($new['lotacao_id']) ? null: $new['lotacao_id'], //fixos
                    'dta_nascimento' => isset($new['dta_nascimento']) ? \Carbon\Carbon::createFromFormat('d/m/Y', $new['dta_nascimento'])->toDateString() : null,
                    'dta_inicio' => isset($new['dta_inicio']) ? \Carbon\Carbon::createFromFormat('d/m/Y', $new['dta_inicio'])->toDateString() : null,
                    'dta_ultima_lotacao' => isset($new['lotacao_dta']) ? \Carbon\Carbon::createFromFormat('d/m/Y', $new['lotacao_dta'])->toDateString() : null,
                    'regra' => !isset($new['regra']) ? 'ANALISE': $new['regra']
                ]
            );

           // $servidor = ServidorAposentadoria::firstOrNew(['cpf' => $new['cpf']]);

            $message = 'Dados cadastrados com sucesso.';

            $servidor = ServidorAposentadoria::firstOrNew(['cpf' => $new['cpf']]);

            return response()->json(['message' => $message, $servidor], 200);

        } catch (\Throwable $th) {
            $new = $request->post('values');
            return response()->json(['message' => 'Erro ao tentar gravar. '.$th->getMessage()], 400);
        }
    }

    public function getServidor(Request $req){

        $cpf = $req->has('cpf') ? $req->get('cpf') : null;

        if ($cpf === null || $cpf === 'undefined') {
             $new = $request->post('values');
                return response()->json(['message' => 'Informe o Servidor! '.$th
                                    ], 400);
        }else{

            $retorno = ServidorAposentadoria::selectRaw("
                        servidors.*,
                        extract(day from servidors.dta_requisicao) || ' de ' ||
                        case extract(month from servidors.dta_requisicao)
                            when 1 then 'Janeiro'
                            when 2 then 'Fevereiro'
                            when 3 then 'Março'
                            when 4 then 'Abril'
                            when 5 then 'Maio'
                            when 6 then 'Junho'
                            when 7 then 'Julho'
                            when 8 then 'Agosto'
                            when 9 then 'Setembro'
                            when 10 then 'Outubro'
                            when 11 then 'Novembro'
                            when 12 then 'Dezembro'
                        end || ' de ' || extract(year from servidors.dta_requisicao) as dta_requisicao_br,
                        TO_CHAR(servidors.dta_nascimento, 'DD/MM/YYYY') as dta_nascimento_br,
                        TO_CHAR(servidors.dta_requisicao, 'DD/MM/YYYY') as dta_requisicao_br2,
                        TO_CHAR(servidors.dta_inicio, 'DD/MM/YYYY') as dta_inicio_br,
                        case servidors.regra
                        when '1035' then 'Emenda Constitucional Nº 103, Art. 5º, CAPUT'
                        when '10353' then 'Emenda Constitucional Nº 103, Art. 5º, §3º'
                        when '59' then 'Lei Complementar Nº 59/2006'
                        when 'ANALISE' then 'Em Análise'
                        end as regra_desc,
                        EXTRACT(YEAR FROM age(current_date, servidors.dta_nascimento)) as idade_atual,
                        EXTRACT(YEAR FROM age(servidors.dta_requisicao, servidors.dta_nascimento)) as idade_requisicao,
  			            EXTRACT(YEAR FROM age(servidors.dta_inicio, servidors.dta_nascimento)) as idade_posse
                    ")
                    ->where('servidors.cpf', $req->get('cpf'))
                    ->get();


            return response()->json(['message' => 'teste -> !!', 'retorno' => $retorno], 200);

        }


    }


    public function getServidorAposentadoria(Request $req){

        $cpf = $req->has('cpf') ? $req->get('cpf') : null;
        $regra = $req->has('regra') ? $req->get('regra') : null;

        if ($cpf === null || $cpf === 'undefined') {
             $new = $request->post('values');
                return response()->json(['message' => 'Informe o Servidor! '.$th
                                    ], 400);
        }else{

            $retorno = DB::select('SELECT * FROM servidor_aposentadoria(?, ?)', [$cpf, $regra]);


            return response()->json(['message' => 'teste -> !!', 'retorno' => $retorno], 200);

        }


    }

    public function listServidorAnexos(Request $req){

        try{
           // if($req->get('defeitos') != ''){

                $teste='';
                $dtai = $req->has('dtai') ? $req->get('dtai') : null;
                if ($dtai === null || $dtai === 'undefined') {
                    $dtai = '';
                }
                $dtaf = $req->has('dtaf') ? $req->get('dtaf') : null;
                if ($dtaf === null || $dtaf === 'undefined') {
                    $dtaf = '';
                }
                $tipo_regra = $req->has('tipo_regra') ? $req->get('tipo_regra') : null;
                if ($tipo_regra === null || $tipo_regra === 'undefined') {
                    $tipo_regra = 'TODOS';
                }

                $filtro_geral = $req->has('filtro') ? $req->get('filtro') : null;
                if ($filtro_geral === null || $filtro_geral === 'undefined') {
                    $filtro_geral = '';
                }

               // $filtrosArray = explode(', ', $filtros);



            $SQL = ServidorAposentadoria::select(
                    'servidors.id as servidor_id',
                    'servidors.numero',
                    'servidors.sicad_id',
                    'servidors.cpf',
                    'servidors.nome',
                    'servidors.genero',
                    'servidors.cargo',
                    'servidors.telefone',
                    'servidors.email',
                    'servidors.dp_lotacao',
                    'servidors.dp_lotacao_id',
                    'servidors.sei',
                    'servidors.regra',
                    'servidors.historico_id', 'servidors.user_cad',
                    DB::raw("TO_CHAR(servidors.created_at, 'DD/MM/YYYY HH:MI') as dta_cad_br"),
                    DB::raw("TO_CHAR(servidors.updated_at, 'DD/MM/YYYY HH:MI') as dta_up_br"),
                    DB::raw("TO_CHAR(servidors.dta_nascimento, 'DD/MM/YYYY') as dta_nascimento_br"),
                    DB::raw("TO_CHAR(servidors.dta_inicio, 'DD/MM/YYYY') as dta_inicio_br"),
                    DB::raw("TO_CHAR(servidors.dta_requisicao, 'DD/MM/YYYY') as dta_requisicao_br"),
                    DB::raw("TO_CHAR(servidors.dta_ultima_lotacao, 'DD/MM/YYYY') as dta_ultima_lotacao_br"),

                    DB::raw("EXTRACT(YEAR FROM age(servidors.dta_requisicao, servidors.dta_nascimento)) as idade_requisicao"),

                    DB::raw("CASE servidors.regra
                        WHEN '1035' THEN 'EC Nº 103, Art. 5º, CAPUT'
                        WHEN '10353' THEN 'EC Nº 103, Art. 5º, §3º'
                        WHEN '59' THEN 'LC Nº 59/2006'
                        ELSE 'Em Análise'
                        END as regra_desc"),

                    DB::raw("'55 Anos' as idade_minima_1035"),
                    DB::raw("CASE servidors.genero
                        WHEN 'MASCULINO' THEN '53 Anos'
                        ELSE '52 Anos'
                        END as idade_minima_10353"),
                    DB::raw("'-' as idade_minima_59"),

                    DB::raw("CASE
                        WHEN EXTRACT(YEAR FROM age(servidors.dta_requisicao, servidors.dta_nascimento)) < 55
                        THEN 'X'
                        ELSE 'OK'
                        END as idade_minima_1035_analise"),

                    DB::raw("CASE
                        WHEN EXTRACT(YEAR FROM age(servidors.dta_requisicao, servidors.dta_nascimento)) < 53
                             AND servidors.genero = 'MASCULINO'
                        THEN 'X'
                        WHEN EXTRACT(YEAR FROM age(servidors.dta_requisicao, servidors.dta_nascimento)) < 52
                             AND servidors.genero = 'FEMININO'
                        THEN 'X'
                        ELSE 'OK'
                        END as idade_minima_10353_analise"),

                    DB::raw("(SUM(CASE WHEN historico_tipos.carreira in('PCGO', 'POL') and historico_tipos.sinal=1 THEN servidor_historicos.dias ELSE 0 END) -
                            SUM(CASE WHEN historico_tipos.carreira in('PCGO', 'POL') and historico_tipos.sinal=-1 THEN servidor_historicos.dias ELSE 0 END))/365 AS risco_total"),

                    DB::raw("CASE
                        WHEN servidors.genero = 'FEMININO' and
                        (
                            SUM(CASE WHEN historico_tipos.carreira in('PCGO', 'POL') and historico_tipos.sinal=1 THEN servidor_historicos.dias ELSE 0 END) -
                            SUM(CASE WHEN historico_tipos.carreira in('PCGO', 'POL') and historico_tipos.sinal=-1 THEN servidor_historicos.dias ELSE 0 END)
                        )/365 < 15 then 'X'

                        WHEN servidors.genero = 'MASCULINO' and
                        (
                            SUM(CASE WHEN historico_tipos.carreira in('PCGO', 'POL') and historico_tipos.sinal=1 THEN servidor_historicos.dias ELSE 0 END) -
                            SUM(CASE WHEN historico_tipos.carreira in('PCGO', 'POL') and historico_tipos.sinal=-1 THEN servidor_historicos.dias ELSE 0 END)
                        )/365 < 20 then 'X'

                        ELSE 'OK'
                        END as risco_total_analise"),
            );

            $SQL->leftJoin('servidor_historicos', 'servidor_historicos.servidor_id', '=', 'servidors.id');

            $SQL->leftJoin('historico_tipos', 'historico_tipos.id', '=', 'servidor_historicos.historico_tipo_id');

            $SQL->where(function ($query) use ($tipo_regra, $filtro_geral, $dtai, $dtaf) {
                    $filtrou='NAO';
                    if ($filtro_geral!='') {
                        $filtrou='SIM';
                            $query->where(function ($query) use ($filtro_geral) {
                                $query->orWhere('servidors.sei', 'ilike', '%' . $filtro_geral . '%')
                                    ->orWhere('servidors.nome', 'ilike', '%' . $filtro_geral . '%')
                                    ->orWhere('servidors.user_cad', 'ilike', '%' . $filtro_geral . '%')
                                    ->orWhere('servidors.dp_lotacao', 'ilike', '%' . $filtro_geral . '%')
                                    ->orWhere('servidors.historico_id', 'ilike', '%' . $filtro_geral . '%')
                                    ->orWhere('servidors.genero', 'ilike', '%' . $filtro_geral . '%')
                                    ->orWhere('servidors.cargo', 'ilike', '%' . $filtro_geral . '%');
                            });
                    }
                    if ($tipo_regra!='TODOS') {
                        $filtrou='SIM';
                        $query->Where('servidors.regra', $tipo_regra);
                    }
                    if ((strlen($dtai)==10)&&(strlen($dtaf)==10)) {
                        $filtrou='SIM';
                        $dtai = \Carbon\Carbon::createFromFormat('m/d/Y', $dtai)->format('Y-m-d');
                        $dtaf = \Carbon\Carbon::createFromFormat('m/d/Y', $dtaf)->format('Y-m-d');
                        $query->Where(function ($query) use ($dtai, $dtaf) {
                            $query->WhereBetween('servidors.dta_requisicao', [$dtai, $dtaf]);
                        });
                    }

                })
                ->groupBy('servidors.id',
                    'servidors.numero',
                    'servidors.sicad_id',
                    'servidors.cpf',
                    'servidors.nome',
                    'servidors.genero',
                    'servidors.cargo',
                    'servidors.telefone',
                    'servidors.email',
                    'servidors.dp_lotacao',
                    'servidors.dp_lotacao_id',
                    'servidors.sei',
                    'servidors.regra',
                    'servidors.idade_requisicao',
                    'servidors.historico_id',
                    'servidors.user_cad',
                    'servidors.created_at',
                    'servidors.updated_at',
                    'servidors.dta_nascimento',
                    'servidors.dta_inicio',
                    'servidors.dta_requisicao',
                    'servidors.dta_ultima_lotacao')
                ->orderBy('servidors.dta_requisicao');


                $retorno=$SQL->get();

                //
                return response()->json(['message' => 'teste -> !!', 'retorno' => $retorno], 200);
           /* }else{
                return response()->json(['message' => 'Escolha um produto(patrimonio). '.$th], 400);
            }*/

        }catch(\Throwable $th){
            return response()->json(['message' => 'Erro ao tentar buscar. '.$req->get('tipo_regra').' ! '.$th], 400);
        }
    }


    public function graficoGenero(Request $req){



           try{
            $dtai = $req->has('dtai') ? Carbon::createFromFormat('m/d/Y', $req->get('dtai'))->format('Y-m-d') : null;
            $dtaf = $req->has('dtaf') ? Carbon::createFromFormat('m/d/Y', $req->get('dtaf'))->format('Y-m-d') : null;


            $retorno = ServidorAposentadoria::select(
                DB::raw('count(servidors.*) as qtd'), // Use DB::raw para construir a expressão de contagem
                DB::raw("servidors.genero as label")
            )
            ->whereBetween('servidors.dta_requisicao', [$dtai, $dtaf])
            ->where('servidors.regra', '<>', 'ANALISE')
            ->groupBy('servidors.genero')
            ->get();
            /*->whereBetween('servidors.dta_previ', [now()->subYear(), now()])*/

            return response()->json($retorno, 200);


        }catch(\Throwable $th){
            return response()->json(['message' => 'Erro ao tentar buscar.'.$th], 400);
        }

    }


    public function graficoRegra(Request $req){



           try{
            $dtai = $req->has('dtai') ? Carbon::createFromFormat('m/d/Y', $req->get('dtai'))->format('Y-m-d') : null;
            $dtaf = $req->has('dtaf') ? Carbon::createFromFormat('m/d/Y', $req->get('dtaf'))->format('Y-m-d') : null;


            $retorno = ServidorAposentadoria::select(
                DB::raw('count(servidors.*) as qtd'), // Use DB::raw para construir a expressão de contagem
                DB::raw("case servidors.regra
                        when '1035' then 'EC Nº 103, Art. 5º, CAPUT'
                        when '10353' then 'EC Nº 103, Art. 5º, §3º'
                        when '59' then 'LC Nº 59/2006'
                        when 'ANALISE' then 'Análise'
                        end as label")
            )
            ->whereBetween('servidors.dta_requisicao', [$dtai, $dtaf])
            ->groupBy('servidors.regra')
            ->get();
            /*->whereBetween('servidors.dta_previ', [now()->subYear(), now()])*/

            return response()->json($retorno, 200);


        }catch(\Throwable $th){
            return response()->json(['message' => 'Erro ao tentar buscar.'.$th], 400);
        }

    }


    public function graficoCargo(Request $req){



           try{
                $dtai = $req->has('dtai') ? Carbon::createFromFormat('m/d/Y', $req->get('dtai'))->format('Y-m-d') : null;
                $dtaf = $req->has('dtaf') ? Carbon::createFromFormat('m/d/Y', $req->get('dtaf'))->format('Y-m-d') : null;


            $retorno = ServidorAposentadoria::select(
                DB::raw('count(servidors.*) as qtd'), // Use DB::raw para construir a expressão de contagem
                DB::raw("SPLIT_PART(servidors.cargo, ' ', 1) as label")
            )
            ->whereBetween('servidors.dta_requisicao', [$dtai, $dtaf])
            ->where('servidors.regra', '<>', 'ANALISE')
            ->groupBy('label')
            ->get();
            /*->whereBetween('servidors.dta_previ', [now()->subYear(), now()])*/

            return response()->json($retorno, 200);


        }catch(\Throwable $th){
            return response()->json(['message' => 'Erro ao tentar buscar.'.$th], 400);
        }

    }


    public function graficoIdade(Request $req){



           try{
            $dtai = $req->has('dtai') ? Carbon::createFromFormat('m/d/Y', $req->get('dtai'))->format('Y-m-d') : null;
            $dtaf = $req->has('dtaf') ? Carbon::createFromFormat('m/d/Y', $req->get('dtaf'))->format('Y-m-d') : null;


            $retorno = ServidorAposentadoria::select(
                DB::raw('count(servidors.*) as label'), // Use DB::raw para construir a expressão de contagem
                DB::raw("EXTRACT(YEAR FROM AGE(servidors.dta_requisicao, servidors.dta_nascimento)) as qtd")
            )
            ->whereBetween('servidors.dta_requisicao', [$dtai, $dtaf])
            ->where('servidors.regra', '<>', 'ANALISE')
            ->groupBy('qtd')
            ->get();
            /*->whereBetween('servidors.dta_previ', [now()->subYear(), now()])*/

            return response()->json($retorno, 200);


        }catch(\Throwable $th){
            return response()->json(['message' => 'Erro ao tentar buscar.'.$th], 400);
        }

    }



    public function graficoDtaRequisicao(Request $req){



           try{
            $dtai = $req->has('dtai') ? Carbon::createFromFormat('m/d/Y', $req->get('dtai'))->format('Y-m-d') : null;
            $dtaf = $req->has('dtaf') ? Carbon::createFromFormat('m/d/Y', $req->get('dtaf'))->format('Y-m-d') : null;


            $retorno = DB::table(DB::raw('(SELECT generate_series(
                                \'' . $dtai . '\'::date, \'' . $dtaf . '\'::date, \'1 month\'::interval
                            )::date AS mes) AS all_months'))
    ->leftJoin('servidors', function ($join) {
        $join->on(DB::raw('EXTRACT(YEAR FROM servidors.dta_requisicao)'), '=', DB::raw('EXTRACT(YEAR FROM all_months.mes)'))
            ->on(DB::raw('EXTRACT(MONTH FROM servidors.dta_requisicao)'), '=', DB::raw('EXTRACT(MONTH FROM all_months.mes)'))
            ->where('servidors.regra', '<>', 'ANALISE');
    })
    ->select(
        DB::raw('EXTRACT(YEAR FROM all_months.mes) AS year'),
        DB::raw('EXTRACT(MONTH FROM all_months.mes) AS month'),
        DB::raw("TO_CHAR(all_months.mes, 'MM/YYYY') AS label"),
        DB::raw('COUNT(servidors.id) AS qtd')
    )
    ->groupBy('year', 'month', 'label')
    ->orderBy('year')
    ->orderBy('month')
    ->get();



            /*->whereBetween('servidors.dta_previ', [now()->subYear(), now()])*/

            return response()->json($retorno, 200);


        }catch(\Throwable $th){
            return response()->json(['message' => 'Erro ao tentar buscar.'.$th], 400);
        }

    }




}

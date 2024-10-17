<?php

namespace App\Http\Controllers;
use App\Models\ServidorHistorico;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class ServidorHistoricoController extends Controller
{
   public function listServidorHistorico(Request $req){

        $servidor_cpf = $req->has('servidor_cpf') ? $req->get('servidor_cpf') : null;

        if ($servidor_cpf === null || $servidor_cpf === 'undefined') {
             $new = $request->post('values');
                return response()->json(['message' => 'Informe o servidor! '.$th
                                    ], 400);
        }else{

            $retorno = ServidorHistorico::select(
                    'servidor_historicos.*', 'servidor_historicos.id as servidor_historico_id',
                    DB::raw("historico_tipos.descricao as historico_tipo"),
                    DB::raw("historico_tipos.carreira"),
                    DB::raw("historico_tipos.sinal"),
                    DB::raw("historico_tipos.sinal*servidor_historicos.dias as dias_sinal"),
                    DB::raw("historico_tipos.label_dtai"),
                    DB::raw("historico_tipos.label_dtaf"),
                    DB::raw("coalesce(servidor_historicos.obs, '') as obs_historico"),
                    DB::raw("case when servidor_historicos.dtai is null then '' else 'De: '||TO_CHAR(servidor_historicos.dtai, 'DD/MM/YYYY')||' até '||TO_CHAR(servidor_historicos.dtaf, 'DD/MM/YYYY') end as dta_label_br"),
                    DB::raw("case when servidor_historicos.dtai is null then '' else TO_CHAR(servidor_historicos.dtai, 'DD/MM/YYYY') end as dtai_br"),
                    DB::raw("case when servidor_historicos.dtaf is null then '' else TO_CHAR(servidor_historicos.dtaf, 'DD/MM/YYYY') end as dtaf_br"),
                    DB::raw("TO_CHAR(servidor_historicos.dta_cad, 'DD/MM/YYYY HH:MI') as dta_cad_br"),
                    DB::raw("CASE historico_tipos.carreira
                            WHEN 'PCGO' THEN 'Cargo Atual PC-GO'
                            WHEN 'CLT' THEN 'Serviço CLT'
                            WHEN 'PUB' THEN 'Serviço Público sem Risco Policial'
                            WHEN 'POL' THEN 'Atividade de Risco Policial'
                    END as carreira_desc"),
                )
                ->Join('historico_tipos', 'historico_tipos.id', '=', 'servidor_historicos.historico_tipo_id')
                ->where('servidor_historicos.servidor_cpf', $req->get('servidor_cpf'))
                ->orderBy('servidor_historicos.carreira')
                ->orderBy('servidor_historicos.historico_tipo_id')
                ->get();

            return response()->json(['message' => 'teste -> !!', 'retorno' => $retorno], 200);

        }


    }

    public function saveServidorHistorico(Request $request) {
        try {
            $new = $request->post('values');
            if(!isset($new['servidor_historico_id'])){
                //se nao tem o id é um insert
                //'dtai' => !isset($new['dtai']) ? null: $new['dtai'],
                //'dtai' => !isset($new['dtai']) ? null: $new['dtai'],
                $servHistorico = ServidorHistorico::create([
                    'servidor_id' => $new['aposentadoria_id'],
                    'servidor_cpf' => $new['servidor_cpf'],
                    'carreira' => $new['carreira'],
                    'historico_tipo_id' => $new['historico_tipo_id'],
                    'dias' => !isset($new['dias']) ? null: $new['dias'],
                    'dtai' => !isset($new['dtai']) ? null: $new['dtai'],
                    'dtaf' => !isset($new['dtaf']) ? null: $new['dtaf'],
                    'obs' => !isset($new['obs_historico']) ? null: $new['obs_historico'],
                    'user_cad_id' => $new['user_cad_id'],
                    'user_cad' => $new['user_cad'],
                ]);
                $novoID = $servHistorico->id;
                $message = 'Cadastrado com sucesso.';
            }else{
                ServidorHistorico::find($new['servidor_historico_id'])->update([
                    'carreira' => $new['carreira'],
                    'historico_tipo_id' => $new['historico_tipo_id'],
                    'dias' => !isset($new['dias']) ? null: $new['dias'],
                    'dtai' => !isset($new['dtai']) ? null: $new['dtai'],
                    'dtaf' => !isset($new['dtaf']) ? null: $new['dtaf'],
                    'obs' => !isset($new['obs_historico']) ? null: $new['obs_historico'],
                    'user_cad_id' => $new['user_cad_id'],
                    'user_cad' => $new['user_cad'],
                ]);
                $message = 'Alterado com sucesso.';
                $novoID = $new['servidor_historico_id'];
            }
            return response()->json(['message' => $message, 'id' => $novoID], 200);
        } catch (\Throwable $th) {
            $new = $request->post('values');
            return response()->json(['message' => 'Erro ao tentar gravar. '.$th->getMessage()], 400);
        }
    }

    public function deleteServidorHistorico(Request $req) {
        try {
        // Localize o registro pelo ID
        $servHistorico = ServidorHistorico::find($req->post('id'));

        if (!$servHistorico) {
            // Se o registro não for encontrado, retorne uma resposta adequada
            return response()->json(['message' => 'Registro não encontrado'], 404);
        }

        // Exclua o registro
        $servHistorico->delete();

        $message = 'Registro excluído com sucesso.';

        return response()->json(['message' => $message], 200);
    } catch (\Throwable $th) {
        return response()->json(['message' => 'Erro ao tentar excluir. ' . $th->getMessage()], 400);
    }
    }
}

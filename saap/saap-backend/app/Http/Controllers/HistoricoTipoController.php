<?php

namespace App\Http\Controllers;
use App\Models\HistoricoTipo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Mpdf\Mpdf;

class HistoricoTipoController extends Controller
{
   public function listHistoricoTipos(){
        try{
            $retorno=HistoricoTipo::select(
                        'historico_tipos.*',
                        DB::raw("CASE historico_tipos.carreira
                            WHEN 'PCGO' THEN 'Cargo Atual PC-GO'
                            WHEN 'CLT' THEN 'Serviço CLT'
                            WHEN 'PUB' THEN 'Serviço Público sem Risco Policial'
                            WHEN 'POL' THEN 'Atividade de Risco Policial'
                            ELSE historico_tipos.carreira
                            END as carreira_desc")
                            )->orderBy('carreira')->orderByDesc('sinal')->orderBy('descricao')->get();

            return response()->json($retorno, 200);

        }catch(\Throwable $th){
                return response()->json(['message' => 'Erro ao tentar buscar. '.$req->get('patrimonio_id').' ! '.$th], 400);
        }
    }

}

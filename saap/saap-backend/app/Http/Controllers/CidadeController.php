<?php

namespace App\Http\Controllers;
use App\Models\Cidade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Mpdf\Mpdf;

class CidadeController extends Controller
{
   public function listCidades(){
        try{
            $retorno=Cidade::select('cidades.*')->orderBy('municipio')->get();
            return response()->json($retorno, 200);

        }catch(\Throwable $th){
                return response()->json(['message' => 'Erro ao tentar buscar Origem! '.$th], 400);
        }


    }

    public function listCidadesFiltro(Request $req) {
    try {
        $descricao = $req->has('zcons_descricao') ? $req->get('zcons_descricao') : null;

        $query = Cidade::select(
                DB::raw("cidades.*")
            )
            ->where(function ($query) use ($descricao) {
                $query->where('cidades.municipio', 'ilike', $descricao.'%');
            })
            ->orderBy('cidades.municipio')
            ->get();

        return response()->json($query, 200);
    } catch(\Throwable $th) {
        return response()->json(['message' => 'Erro ao tentar buscar Cidades! ' . $th->getMessage()], 400);
    }
}


public function saveRegional(Request $req) {

      //  try{

            $cidade_id=$req->has('cidade_id') ? $req->get('cidade_id') : null;
            $drp_id=$req->has('drp_id') ? $req->get('drp_id') : null;
            $cidade_nome=$req->has('cidade') ? $req->get('cidade') : null;

            $cidadeBusca = Cidade::find($cidade_id)->update([
                        'drp_id' => $drp_id
                    ]);

            $message = 'Alterado com sucesso.';

            return response()->json(['message' => $message, 'id' => $cidade_id], 200);

           /* if ($cidadeBusca) {

                    $cidadeBusca->update([
                        'drp_id' => $drp_id
                    ]);
                    $message = 'Alterado com sucesso.';

                    return response()->json(['message' => $message, 'id' => $cidade_id], 200);

            }else{

                $message = 'Não localizada '.$cidade_id.' - '.$cidade_nome;

                return response()->json(['message' => $message, 'id' => -1], 200);
            }*/

/*
        }catch (\Throwable $th) {
            return response()->json(['message' => 'Erro ao tentar gravar. '.print_r($req).' - '.$th->getMessage()], 400);
        }
*/

    }


}

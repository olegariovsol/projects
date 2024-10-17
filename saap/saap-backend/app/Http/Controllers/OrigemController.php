<?php

namespace App\Http\Controllers;
use App\Models\Origem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Mpdf\Mpdf;

class OrigemController extends Controller
{
   public function listOrigens(){
        try{
            $retorno=Origem::select('origems.*')->orderBy('descricao')->get();
            return response()->json($retorno, 200);

        }catch(\Throwable $th){
                return response()->json(['message' => 'Erro ao tentar buscar Origem! '.$th], 400);
        }
    }


    public function saveOrigem(Request $request) {

        try{
            $new = $request->post('values');
            $id = $new['zorigem_id'];
            $descricao = $new['zorigem'];

            if(!isset($id)){
                //se nao tem o id é um insert
                Origem::create([
                    'descricao' => $descricao
                ]);
                $message = 'Cadastrado com sucesso.';
            }else{
                Origem::find($id)->update([
                    'descricao' => $descricao
                ]);//'status' => $new['status']
                $message = 'Alterado com sucesso.';
            }
            return response()->json(['message' => $message], 200);
        }catch (\Throwable $th) {
            return response()->json(['message' => 'Erro ao tentar gravar. '.print_r($new).' - '.$th->getMessage()], 400);
        }


    }

}

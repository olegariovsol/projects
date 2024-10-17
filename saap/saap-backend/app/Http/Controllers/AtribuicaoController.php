<?php

namespace App\Http\Controllers;
use App\Models\Atribuicao;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Mpdf\Mpdf;

class AtribuicaoController extends Controller
{
   public function listAtribuicaos(Request $req){
        try{
            $retorno=Atribuicao::select('atribuicaos.*')->orderBy('descricao')->get();
            return response()->json($retorno, 200);

        }catch(\Throwable $th){
                return response()->json(['message' => 'Erro ao tentar buscar Origem! '.$th], 400);
        }
/*
        try{

            $descricao = $req->has('atribuicao') ? $req->get('atribuicao') : null;

            if ($descricao === null || $descricao === 'undefined' || $descricao === '') {

                $query=Atribuicao::orderBy('descricao');

                                $retorno=$query->get();

                return response()->json($retorno, 200);


            }else{
                $retorno = Atribuicao::where(function ($query) use ($descricao) {
                    $descricao = Str::lower(Str::ascii($descricao)); // Remove acentos e converte para minúsculas
                    $query->whereRaw('LOWER(descricao) LIKE ?', ['%' . $descricao . '%']);
                })
                ->orderBy('descricao')
                ->get();

                return response()->json($retorno, 200);
            }
        }catch (\Throwable $th) {
                return response()->json(['message' => 'Erro ao consultar. - '.$th->getMessage()], 400);
        }*/
    }


    public function saveAtribuicao(Request $request) {

        try{
            $new = $request->post('values');
            $id = $new['zatribuicao_id'];
            $descricao = $new['zatribuicao'];

            if(!isset($id)){
                //se nao tem o id é um insert
                Atribuicao::create([
                    'descricao' => $descricao
                ]);
                $message = 'Cadastrado com sucesso.';
            }else{
                Atribuicao::find($id)->update([
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

<?php

namespace App\Http\Controllers;
use App\Models\Configuracao;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Mpdf\Mpdf;

class ConfiguracaoController extends Controller
{
   public function getConfiguracao()
    {
        try {
            $retorno = Configuracao::select('configuracaos.*')->get();

            // Obtém o SQL executado
            $sql = Configuracao::toSql();

            // Retorna o SQL junto com os dados
            return response()->json(['data' => $retorno], 200);//'sql' => $sql,

        } catch (\Throwable $th) {
            // Adiciona o SQL no retorno de erro
            return response()->json(['message' => 'Erro ao tentar buscar Configuracao! ' . $th, 'sql' => $sql ?? null], 400);
        }
    }



    public function saveConfiguracao(Request $request) {

        try{
            $new = $request->post('values');
            $id = $new['zConfiguracao_id'];


            if(!isset($id)){
                //se nao tem o id é um insert
                Configuracao::create([
                    'limite_chefe_secao' => $new['zlimite_chefe_secao'],
                    'limite_chefe_divisao' => $new['zlimite_chefe_divisao']
                ]);
                $message = 'Cadastrado com sucesso.';
            }else{
                Configuracao::find($id)->update([
                    'limite_chefe_secao' => $new['zlimite_chefe_secao'],
                    'limite_chefe_divisao' => $new['zlimite_chefe_divisao']
                ]);//'status' => $new['status']
                $message = 'Alterado com sucesso.';
            }
            return response()->json(['message' => $message], 200);
        }catch (\Throwable $th) {
            return response()->json(['message' => 'Erro ao tentar gravar. '.print_r($new).' - '.$th->getMessage()], 400);
        }


    }

}

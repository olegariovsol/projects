<?php

namespace App\Http\Controllers;
use App\Models\Importacao;
use App\Models\Veiculo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Mpdf\Mpdf;

class ImportacaoController extends Controller
{
   public function ImportacaoVtrsSinc(Request $req){
        //try{
            $retorno=Importacao::select(
                DB::raw("case when cast(admin.importacaos.vtrs as date) < current_date then 'SIM' else 'NAO' end as importar")
                )->get();


            $contCad = 0;
            $contUp = 0;

            if ($retorno[0]->importar == 'SIM') {

                $retornoVeiculos=Veiculo::get();

                $responseVtr = Http::get(env('ENDERECO_LEGADOWS') . '/viaturasAtivasPC?token=' . $req->header('Token'));

                    if ($responseVtr->successful()) {
                        $dadosVTRS = $responseVtr->json();

                        foreach ($dadosVTRS as $dadosVtr) {
                            $veiculo = $retornoVeiculos->firstWhere('placa', $dadosVtr['placa']);

                            if ($veiculo) {
                                $contUp++;
                                $veiculo->update([
                                    'marca' => $dadosVtr['marca'] ?? null,
                                    'modelo' => $dadosVtr['modelo'] ?? null,
                                    'cor' => $dadosVtr['cor'] ?? null,
                                    'categoria' => $dadosVtr['categoria'] ?? null,
                                    'identificacao' => $dadosVtr['identificacao'] ?? null,
                                    'anofabricacao' => $dadosVtr['anoFabricacao'] ?? null,
                                    'anomodelo' => $dadosVtr['anoModelo'] ?? null,
                                ]);
                                $message = 'Alterado com sucesso.';
                            } else {
                                $contCad++;
                                $veiculoCad = Veiculo::create([
                                    'placa' => $dadosVtr['placa'],
                                    'marca' => $dadosVtr['marca'] ?? null,
                                    'modelo' => $dadosVtr['modelo'] ?? null,
                                    'cor' => $dadosVtr['cor'] ?? null,
                                    'categoria' => $dadosVtr['categoria'] ?? null,
                                ]);
                                $novoID = $veiculoCad->id;
                                $message = 'Cadastrado com sucesso.';
                            }
                        }
                    }

                return response()->json(['message' => 'Importados '.$contCad.' atualizados '.$contUp.'! '], 200);
            }else{
                return response()->json(['message' => 'Importação já realizada hoje! '], 200);
            }




        /*}catch(\Throwable $th){
            return response()->json(['message' => 'Erro ao tentar sincronizar a importacao! '.$th], 400);
        }*/
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

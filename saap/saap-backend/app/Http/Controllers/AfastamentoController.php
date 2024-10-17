<?php

namespace App\Http\Controllers;
use App\Models\Afastamento;
use App\Models\ServidorAfastamento;
use App\Models\Departamento;
use App\Models\DepartamentoGrupo;
use App\Models\Servidor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Mpdf\Mpdf;

class AfastamentoController extends Controller
{
    public function sincServidoresAfastamentoXLS(Request $request)
    {



        //try {
            $dadosAdicionais = $request->post('additionalParam');
            $importador_id = $dadosAdicionais['importador_id'];
            $importador = $dadosAdicionais['importador'];
            $arquivo_name = $dadosAdicionais['arquivo_name'];


            $dadosXLS = $request->post('values');
            $lista = json_decode($dadosXLS['arquivo']);
            $cont = 1;
            $contInsert = 0;
            $contUpdate = 0;
            $contExiste = 0;
            $contError = 0;
            $contOs = 0;

            $erros='';
            $xinserir=false;

            $message='';
            $servidor_nao_encontrado='';
            $servidor_nao_encontrado_dep='';

            for ($cont=2; $cont < sizeof($lista); $cont++) {
                $linhaXLS=$lista[$cont];

                /*
XLS DE IMPORTAÇÃO
0 = A ->   NOME REGIONAL     1 = B -> NOME UNIDADE      2 = C -> NOME SERVIDOR      3 = D -> CARGO
4 = E -> ESPÉCIE             5 = F -> DTA INÍCIO        6 = G -> DTA FIM

CORRESPONDENTE SAAP-OBSERVATÓRIO DB
0 = A ->   departamento_grupos.nome     1 = B -> departamentos.nome      2 = C -> servidors.nome      3 = D -> servidors.cargo
4 = E -> afastamentos.descricao             5 = F -> afastamentos.dta_inicio        6 = G -> afastamentos.dta_fim
*/

                if ($linhaXLS[2] != '') {
                        $servidor = Servidor::select(
                            'servidors.id',
                            'servidors.nome'
                        )
                        ->where('servidors.nome', $linhaXLS[2])
                        ->where('status', 'ATIVO')
                        ->get();  // Aqui usamos get() para verificar homônimos

                        $atualizar_afastamento = false;

                        if ($servidor->count() === 1) {
                            $servidor = $servidor->first();  // Pega o único registro
                            $atualizar_afastamento = true;
                        } elseif ($servidor->count() > 1) {
                            // Se houver mais de um registro, filtra por lotação
                            $servidor = Servidor::select(
                                'servidors.id',
                                'servidors.nome'
                            )
                            ->where('servidors.nome', $linhaXLS[2])
                            ->where('servidors.lotacao', $linhaXLS[1])
                            ->where('status', 'ATIVO')
                            ->first();  // Tentativa de refinar com lotação

                            if ($servidor) {
                                // Encontrado usando o departamento/lotação
                                $atualizar_afastamento = true;
                            } else {

                                // Se não houver nenhum registro na mesma lotação
                                if ($servidor_nao_encontrado == '') {
                                    $servidor_nao_encontrado = $linhaXLS[2] . '(dep)';
                                } else {
                                    $servidor_nao_encontrado .= ', ' . $linhaXLS[2] . '(dep)';
                                }

                            }
                        } else {

                            $servidor = Servidor::select(
                                'servidors.id',
                                'servidors.nome'
                            )
                            ->where('servidors.nome', $linhaXLS[2])
                            ->where('status', 'INATIVO')
                            ->first();  // Aqui usamos get() para verificar homônimos

                            if ($servidor) {
                                $atualizar_afastamento = true;
                            } else{
                                // Se não houver nenhum registro
                                if ($servidor_nao_encontrado == '') {
                                    $servidor_nao_encontrado = $linhaXLS[2];
                                } else {
                                    $servidor_nao_encontrado .= ', ' . $linhaXLS[2];
                                }
                            }
                        }

                            if ($atualizar_afastamento) {

                                $afastamento = Afastamento::select(
                                    'afastamentos.id'
                                )
                                ->where('descricao', $linhaXLS[4])
                                ->first();  // Pega o primeiro afastamento

                                /*if (!$afastamento) {
                                    $erros .= $afastamento->id . ' -> ' . $servidor->id;
                                } else {
                                    $erros .= 'Afastamento não encontrado para ' . $linhaXLS[2] . '; ';
                                }*/


                                if (!$afastamento) {
                                    $xgrupo = 'OUTROS';

                                    // Verifica se a descrição contém certas palavras e ajusta $xgrupo
                                    if (stripos($linhaXLS[4], 'FÉRIAS') !== false) {
                                        $xgrupo = 'FÉRIAS';
                                    } elseif (stripos($linhaXLS[4], 'LICENÇA') !== false) {
                                        $xgrupo = 'LICENÇA';
                                    } elseif (stripos($linhaXLS[4], 'AFASTAMENTO') !== false) {
                                        $xgrupo = 'AFASTAMENTO';
                                    }

                                    // Cria um novo registro de afastamento
                                    $afastamento = Afastamento::create([
                                        'descricao' => $linhaXLS[4],
                                        'status' => $xgrupo
                                    ]);
                                }


                                $dta_inicio = \Carbon\Carbon::createFromFormat('d/m/Y', $linhaXLS[5])->format('Y-m-d');
                                $dta_fim = \Carbon\Carbon::createFromFormat('d/m/Y', $linhaXLS[6])->format('Y-m-d');

                                $servidorAfastamento = ServidorAfastamento::where('servidor_id', $servidor->id)
                                    ->where('afastamento_id', '=', $afastamento->id) // Condição para o afastamento
                                    ->where('dta_inicio', '=', $dta_inicio)
                                    ->where('dta_fim', '=', $dta_fim)
                                    ->first();  // Usa first() para pegar um único registro

                                if (!$servidorAfastamento) {
                                    // Se não encontrar um afastamento com as datas de início e fim exatas
                                    $servidorAfastamento = ServidorAfastamento::where('servidor_id', $servidor->id)
                                        ->where('afastamento_id', '=', $afastamento->id)
                                        ->where('dta_inicio', '=', $dta_inicio)
                                        ->first();  // Busca novamente para ver se há um afastamento com a mesma data de início

                                    if (!$servidorAfastamento) {
                                        // Se nenhum afastamento for encontrado, cria um novo
                                        ServidorAfastamento::create([
                                            'afastamento_id' => $afastamento->id,
                                            'dta_inicio' => $dta_inicio,
                                            'dta_fim' => $dta_fim,
                                            'servidor_id' => $servidor->id
                                        ]);

                                        $contInsert++;
                                    } else {
                                        // Atualiza o afastamento existente com a nova data de fim
                                        $servidorAfastamento->update([
                                            'dta_fim' => $dta_fim,
                                        ]);
                                        $contUpdate++;
                                    }
                                } else {
                                    // Se já existe um afastamento com as mesmas datas de início e fim, atualiza
                                    $servidorAfastamento->update([
                                        'dta_fim' => $dta_fim,
                                    ]);
                                    $contUpdate++;
                                }


                            }else{//servidor não encontrado
                                $contError++;
                            }
                }//há nome de servidor? não é linha em branco

            }

            $message = "Foram cadastrados {$contInsert} Afastamentos com sucesso. {$contUpdate} Afastamentos Atualizados. {$contError} Afastamentos Não Carregados ".$servidor_nao_encontrado.".";

            return response()->json(['message' => $message], 200);

    }




    public function listarAfastamentosServidor(Request $req){
        try{

            $zservidor_id = $req->has('zservidor_id') ? $req->get('zservidor_id') : '';

                if($zservidor_id===''){
                    return response()->json(['message' => 'Erro ao tentar buscar o zservidor_id.'], 400);
                }else{


                     $query = ServidorAfastamento::select(
                        'servidor_afastamentos.*',
                        'afastamentos.descricao as afastamento_desc',
                        'afastamentos.status as afastamento_status',
                        DB::raw("TO_CHAR(servidor_afastamentos.dta_inicio, 'DD/MM/YYYY') as dta_inicio_br"),
                        DB::raw("TO_CHAR(servidor_afastamentos.dta_fim, 'DD/MM/YYYY') as dta_fim_br"),
                     )
                     ->join('afastamentos', 'afastamentos.id', '=', 'servidor_afastamentos.afastamento_id')
                     ->where('servidor_afastamentos.servidor_id', $zservidor_id)
                     ->orderBy('servidor_afastamentos.dta_inicio');

                     /*
                      ->where(function ($query) use ($zservidor_id) {

                               $query->whereRaw('coalesce(processo.processo_itens.qtd_ok,0) < coalesce(processo.processo_itens.qtd_sol,0)');


                      })
                                ->groupBy('processo.processo_itens.item_id', 'processo.itens.descricao', 'processo.itens.img')
                     ->havingRaw('SUM(processo.processo_itens.qtd_ok) < SUM(processo.processo_itens.qtd_sol)')
                     ->orderBy('processo.itens.descricao');
                     */


                    $retorno = $query->get();

                    return response()->json(['message' => '', 'retorno' => $retorno], 200);//'message' => $query->toSql()
                }

        }catch(\Throwable $th){
                return response()->json(['message' => 'Erro ao tentar buscar Origem! '.$th], 400);
        }
    }
}

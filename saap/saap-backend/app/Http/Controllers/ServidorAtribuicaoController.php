<?php

namespace App\Http\Controllers;

use App\Models\ServidorAuditoria;
use App\Models\Servidor;
use App\Models\Departamento;
use App\Models\DepartamentoGrupo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Mpdf\Mpdf;
use Carbon\Carbon;

class ServidorAtribuicaoController extends Controller
{



    public function sincServidoresSicadObservatorio(Request $req)
    {

        $zmodo = $req->has('zmodo') ? $req->get('zmodo') : null;
        $sicad_cpf = $req->has('sicad_cpf') ? $req->get('sicad_cpf') : null;
        $sicad_lotacao = $req->has('sicad_lotacao') ? $req->get('sicad_lotacao') : null;
        $sicad_lotacao_id = $req->has('sicad_lotacao_id') ? $req->get('sicad_lotacao_id') : null;

        //$lotacao_anterior = $req->has('lotacao_anterior') ? $req->get('lotacao_anterior') : null;
        // Se lotacao_anterior_id estiver presente e não for vazio, atribua seu valor; caso contrário, defina como null
        $lotacao_anterior_id = $req->input('lotacao_anterior_id') ?? null;
        $lotacao_anterior = $req->input('lotacao_anterior') ?? null;


        if ($lotacao_anterior_id == 'undefined') {
            $lotacao_anterior_id = null;
            $lotacao_anterior = '';
        }

        $sicad_lotacao_sigla = $req->has('sicad_lotacao_sigla') ? $req->get('sicad_lotacao_sigla') : null;
        $sicad_municipio_id = $req->has('sicad_municipio_id') ? $req->get('sicad_municipio_id') : null;
        $sicad_municipio = $req->has('sicad_municipio') ? $req->get('sicad_municipio') : null;
        $data_lotacao = $req->has('sicad_data_lotacao') ? $req->get('sicad_data_lotacao') : null;
        $servidor = $req->has('sicad_servidor') ? $req->get('sicad_servidor') : null;
        $sicad_id = $req->has('sicad_id') ? $req->get('sicad_id') : null;
        $sicad_dtNascimento = $req->has('sicad_dtNascimento') ? $req->get('sicad_dtNascimento') : null;
        $sicad_postoGrad = $req->has('sicad_postoGrad') ? $req->get('sicad_postoGrad') : null;
        $cargo_anterior = $req->input('cargo_anterior') ?? '';
        //$sicad_postoSiglaGrad = $req->has('sicad_postoSiglaGrad') ? $req->get('sicad_postoSiglaGrad') : null;
        $sicad_status = $req->has('sicad_status') ? $req->get('sicad_status') : null;
        $sicad_situacao = $req->has('sicad_situacao') ? $req->get('sicad_situacao') : null;
        $sicad_sexo = $req->has('sicad_sexo') ? $req->get('sicad_sexo') : null;
        $sicad_dtPosse = $req->has('sicad_dtPosse') ? $req->get('sicad_dtPosse') : null;
        $sicad_id = $req->has('sicad_id') ? $req->get('sicad_id') : null;
        $sicad_funcao = $req->has('sicad_funcao') ? $req->get('sicad_funcao') : null;
        $sicad_matricula_funcional = $req->has('sicad_matricula_funcional') ? $req->get('sicad_matricula_funcional') : null;

        if ($sicad_municipio === 'undefined') {
            $sicad_municipio = null; // ou qualquer outro valor padrão que você queira usar
        }
        if ($sicad_municipio_id === 'undefined') {
            $sicad_municipio_id = null; // ou qualquer outro valor padrão que você queira usar
        }

        $dataNascimentoFormatada = null;
        $dataPosseFormatada = null;

        // Agora, você pode formatar a data como DD/MM/YYYY
        if ($data_lotacao !== null) {
            $date = Carbon::createFromTimestampMs($data_lotacao); // Cria um objeto Carbon com milissegundos

            // Agora, você pode formatar a data como DD/MM/YYYY
            $dataLotacaoFormatada = $date->format('d/m/Y');
        } else {
            $dataLotacaoFormatada = null; // Ou qualquer valor padrão que você deseja usar se a data for nula
        }

        if ($sicad_dtNascimento !== null) {
            $date = Carbon::createFromTimestampMs($sicad_dtNascimento); // Cria um objeto Carbon com milissegundos

            // Agora, você pode formatar a data como DD/MM/YYYY
            $dataNascimentoFormatada = $date->format('d/m/Y');
        } else {
            $dataNascimentoFormatada = null; // Ou qualquer valor padrão que você deseja usar se a data for nula
        }

        if ($sicad_dtPosse !== null) {
            $date = Carbon::createFromTimestampMs($sicad_dtPosse); // Cria um objeto Carbon com milissegundos

            // Agora, você pode formatar a data como DD/MM/YYYY
            $dataPosseFormatada = $date->format('d/m/Y');
        } else {
            $dataPosseFormatada = null; // Ou qualquer valor padrão que você deseja usar se a data for nula
        }
        //$cargo = str_replace(['DE POLÍCIA ', 'POLICIAL'], '', $sicad_postoGrad);

        $cargo = $sicad_postoGrad;
        $classificacao = 'ADMINISTRATIVO';
                if (strpos($cargo, 'AGENTE DE POL') !== false) {
                    $classificacao = 'AGENTE';
                }
                if (strpos($cargo, 'AGENTE AUXILIAR POLICIAL') !== false) { //Motorista
                    $classificacao = 'AGENTE';
                }
                if (strpos($cargo, 'AGENTE POLICIAL') !== false) { //Motorista
                    $classificacao = 'AGENTE';
                }
                if (strpos($cargo, 'POLICIAL PENAL') !== false) { //Motorista
                    $classificacao = 'AGENTE';
                }
                if (strpos($cargo, 'DELEGADO') !== false) {
                    $classificacao = 'DELEGADO';
                }
                if (strpos($cargo, 'ESCR') !== false) {
                    $classificacao = 'ESCRIVAO';
                }
                if (strpos($cargo, 'PAPILOSCOPISTA') !== false) {
                    $classificacao = 'PAPILOSCOPISTA';
                }
                if (strpos($cargo, 'DACTILOSCOPISTA') !== false) {
                    $classificacao = 'PAPILOSCOPISTA';
                }
                if (strpos($cargo, 'DIGITADOR') !== false) {
                    $classificacao = 'DIGITADOR';
                }
                if (strpos($cargo, 'DIGITADOR') !== false) {
                    $classificacao = 'DIGITADOR';
                }
                if (strpos($cargo, 'ESTAGI') !== false) {
                    $classificacao = 'ESTAGIARIO';
                }
                if (strpos($sicad_funcao, 'ESTAGI') !== false) {
                    $classificacao = 'ESTAGIARIO';
                }
                if (strpos($cargo, 'METROBUS') !== false) {
                    $classificacao = 'METROBUS';
                }



        /*
                        $servidorUpTodos = Servidor::where('cpf', $sicad_cpf)->first();

                        if ($servidorUpTodos) {//ECONTROU SERVIDOR
                            $servidorUpTodos->update([
                                'cargo' => $cargo,
                                // Outros campos que você deseja atualizar
                            ]);
                        }

*/

        if ($zmodo === 'MUDOU_LOTACAO') {


            $servidorLotacaoMudanca = Servidor::where('cpf', $sicad_cpf)->first();

            if ($servidorLotacaoMudanca) { //ECONTROU SERVIDOR
                $servidorLotacaoMudanca->update([
                    'sicad_id' => isset($sicad_id) ? $sicad_id : null,
                    'classificacao' => $classificacao,
                    'funcao' => $sicad_funcao,
                    'cargo' => $cargo,
                    'lotacao' => isset($sicad_lotacao) ? $sicad_lotacao : null,
                    'lotacao_id' => isset($sicad_lotacao_id) ? $sicad_lotacao_id : null,
                    'lotacao_anterior' => isset($lotacao_anterior) ? $lotacao_anterior : null,
                    'lotacao_anterior_id' => isset($lotacao_anterior_id) ? $lotacao_anterior_id : null,
                    'lotacao_sigla' => isset($sicad_lotacao_sigla) ? $sicad_lotacao_sigla : null,
                    'municipio_id_lotacao' => isset($sicad_municipio_id) ? $sicad_municipio_id : null,
                    'municipio_lotacao' => isset($sicad_municipio) ? $sicad_municipio : null,
                    'dtai' => $dataLotacaoFormatada,
                    // Outros campos que você deseja atualizar
                ]);


                ServidorAuditoria::create([
                    'servidor_id' => $servidorLotacaoMudanca->id,
                    'funcao' => 'Alterou', // Alterou, Excluiu, Incluiu
                    'descricao' => $sicad_lotacao . '(' . $sicad_lotacao_id . ') anterior ' . $lotacao_anterior . '(' . $lotacao_anterior_id . ')',
                    'fun_cad_id' => 0,
                    'fun_cad' => 'Sicad',
                ]);

                // $servidorLotacaoMudancaNew = Servidor::where('cpf', $sicad_cpf)->first();

                return response()->json(['message' => $servidor . '(' . $servidorLotacaoMudanca->id . ')' . ' Agora Lotado na ' . $sicad_lotacao . '(' . $sicad_lotacao_id . ') - Antes Lotação era: ' . $lotacao_anterior . ' (' . $lotacao_anterior_id . ') com sucesso', 'resultado' => 'OK'], 200);
            } else { //NÃO ENCONTROU SERVIDOR


                Servidor::create([
                    'sicad_id' => $sicad_id,
                    'nome' => $servidor,
                    'administracao' => 'GERAL',
                    'vinculo' => 'EFETIVO',
                    'classificacao' => $classificacao,
                    'genero' => $sicad_sexo === 'M' ? 'MASCULINO' : 'FEMININO',
                    'funcao' => $sicad_funcao,
                    'cargo' => $cargo,
                    'cpf' => $sicad_cpf,
                    'lotacao' => isset($sicad_lotacao) ? $sicad_lotacao : null,
                    'lotacao_id' => isset($sicad_lotacao_id) ? $sicad_lotacao_id : null,
                    'lotacao_sigla' => isset($sicad_lotacao_sigla) ? $sicad_lotacao_sigla : null,
                    'municipio_id_lotacao' => isset($sicad_municipio_id) ? $sicad_municipio_id : null,
                    'municipio_lotacao' => isset($sicad_municipio) ? $sicad_municipio : null,
                    'matricula_funcional' => isset($sicad_matricula_funcional) ? $sicad_matricula_funcional : null,
                    'dta_nascimento' => $dataNascimentoFormatada,
                    'dta_posse' => $dataPosseFormatada,
                    'dtai' => $dataLotacaoFormatada,
                    'status' => $sicad_status
                ]);

                $servidorLotacaoMudancaNew = Servidor::where('cpf', $sicad_cpf)->first();

                ServidorAuditoria::create([
                    'servidor_id' => $servidorLotacaoMudancaNew->id,
                    'funcao' => 'Incluiu', // Alterou, Excluiu, Incluiu
                    'descricao' => $sicad_lotacao . '(' . $sicad_lotacao_id . ')',
                    'fun_cad_id' => 0,
                    'fun_cad' => 'Sicad',
                ]);


                return response()->json(['message' => 'Servidor Novo: ' . $servidor . '(' . $servidorLotacaoMudancaNew->id . ')' . ' Lotado ' . $sicad_lotacao . '(sicad recebida - ' . $sicad_lotacao_id . ') com sucesso', 'resultado' => 'OK'], 200);
            }

            //'dtai' => $data_lotacao ? $data_lotacao->format('d/m/Y') : null,
        } //MUDOU_LOTACAO




        if ($zmodo === 'MUDOU_CARGO') {


            $servidorCargoMudanca = Servidor::where('cpf', $sicad_cpf)->first();

            if ($servidorCargoMudanca) { //ECONTROU SERVIDOR
                $servidorCargoMudanca->update([
                    'sicad_id' => isset($sicad_id) ? $sicad_id : null,
                    'classificacao' => $classificacao,
                    'funcao' => $sicad_funcao,
                    'cargo' => $cargo,
                    // Outros campos que você deseja atualizar
                ]);


                ServidorAuditoria::create([
                    'servidor_id' => $servidorCargoMudanca->id,
                    'funcao' => 'Alterou', // Alterou, Excluiu, Incluiu
                    'descricao' => 'Cargo '.$cargo . ' - anterior ' .$cargo_anterior,
                    'fun_cad_id' => 0,
                    'fun_cad' => 'Sicad',
                ]);

                // $servidorCargoMudancaNew = Servidor::where('cpf', $sicad_cpf)->first();

                return response()->json(['message' => $servidor . '(' . $servidorCargoMudanca->id . ')' . ' Agora Cargo ' . $cargo . ' - Antes Cargo era: ' . $cargo_anterior . ' com sucesso', 'resultado' => 'OK'], 200);
            } else { //NÃO ENCONTROU SERVIDOR




                Servidor::create([
                    'sicad_id' => $sicad_id,
                    'nome' => $servidor,
                    'administracao' => 'GERAL',
                    'vinculo' => 'EFETIVO',
                    'classificacao' => $classificacao,
                    'genero' => $sicad_sexo === 'M' ? 'MASCULINO' : 'FEMININO',
                    'funcao' => $sicad_funcao,
                    'cargo' => $cargo,
                    'cpf' => $sicad_cpf,
                    'lotacao' => isset($sicad_lotacao) ? $sicad_lotacao : null,
                    'lotacao_id' => isset($sicad_lotacao_id) ? $sicad_lotacao_id : null,
                    'lotacao_sigla' => isset($sicad_lotacao_sigla) ? $sicad_lotacao_sigla : null,
                    'municipio_id_lotacao' => isset($sicad_municipio_id) ? $sicad_municipio_id : null,
                    'municipio_lotacao' => isset($sicad_municipio) ? $sicad_municipio : null,
                    'matricula_funcional' => isset($sicad_matricula_funcional) ? $sicad_matricula_funcional : null,
                    'dta_nascimento' => $dataNascimentoFormatada,
                    'dta_posse' => $dataPosseFormatada,
                    'dtai' => $dataLotacaoFormatada,
                    'status' => $sicad_status
                ]);

                $servidorCargoMudancaNew = Servidor::where('cpf', $sicad_cpf)->first();

                ServidorAuditoria::create([
                    'servidor_id' => $servidorCargoMudancaNew->id,
                    'funcao' => 'Incluiu', // Alterou, Excluiu, Incluiu
                    'descricao' => 'Cargo(incluiu) '.$cargo . ' - anterior ' .$cargo_anterior,
                    'fun_cad_id' => 0,
                    'fun_cad' => 'Sicad',
                ]);


                return response()->json(['message' => 'Servidor Novo: ' . $servidor . '(' . $servidorCargoMudancaNew->id . ')' . ' Cargo ' . $cargo . ' com sucesso', 'resultado' => 'OK'], 200);
            }

            //'dtai' => $data_lotacao ? $data_lotacao->format('d/m/Y') : null,
        } //MUDOU_CARGO

        if ($zmodo === 'NAO_EXISTE_EM_OBSERVATORIO') {

            $servidorNovoObservatorio = Servidor::where('cpf', $sicad_cpf)->first();

            if ($servidorNovoObservatorio) { //ENCONTROU SERVIDOR - NÃO ERA PARA TER ENCONTRADO
                $servidorNovoObservatorio->update([
                    'sicad_id' => isset($sicad_id) ? $sicad_id : null,
                    'lotacao' => isset($sicad_lotacao) ? $sicad_lotacao : null,
                    'lotacao_id' => isset($sicad_lotacao_id) ? $sicad_lotacao_id : null,
                    'lotacao_sigla' => isset($sicad_lotacao_sigla) ? $sicad_lotacao_sigla : null,
                    'municipio_id_lotacao' => isset($sicad_municipio_id) ? $sicad_municipio_id : null,
                    'municipio_lotacao' => isset($sicad_municipio) ? $sicad_municipio : null,
                    'classificacao' => $classificacao,
                    'funcao' => $sicad_funcao,
                    'cargo' => $cargo,
                    'dtai' => $dataLotacaoFormatada,
                    'status' => 'ATIVO',
                    'vinculo' => 'EFETIVO',
                    'administracao' => 'GERAL'
                    // Outros campos que você deseja atualizar
                ]);


                ServidorAuditoria::create([
                    'servidor_id' => $servidorNovoObservatorio->id,
                    'funcao' => 'Alterou', // Alterou, Excluiu, Incluiu
                    'descricao' => $sicad_lotacao . '(' . $sicad_lotacao_id . ')',
                    'fun_cad_id' => 0,
                    'fun_cad' => 'Sicad',
                ]);

                // $servidorNovoObservatorioNew = Servidor::where('cpf', $sicad_cpf)->first();

                return response()->json(['message' => $servidor . '(' . $sicad_cpf . '-' . $sicad_id . ')' . ' Não deveria existir ' . $servidorNovoObservatorio->cpf . ', ' . $servidorNovoObservatorio->nome . ', ' . $servidorNovoObservatorio->funcao . '(' . $servidorNovoObservatorio->id . ') com sucesso', 'resultado' => 'OK'], 200);
            } else { // NÃO ENCONTROU

                Servidor::create([
                    'sicad_id' => $sicad_id,
                    'nome' => $servidor,
                    'administracao' => 'GERAL',
                    'vinculo' => 'EFETIVO',
                    'genero' => $sicad_sexo === 'M' ? 'MASCULINO' : 'FEMININO',
                    'classificacao' => $classificacao,
                    'funcao' => $sicad_funcao,
                    'cargo' => $cargo,
                    'cpf' => $sicad_cpf,
                    'lotacao' => isset($sicad_lotacao) ? $sicad_lotacao : null,
                    'lotacao_id' => isset($sicad_lotacao_id) ? $sicad_lotacao_id : null,
                    'lotacao_sigla' => isset($sicad_lotacao_sigla) ? $sicad_lotacao_sigla : null,
                    'municipio_id_lotacao' => isset($sicad_municipio_id) ? $sicad_municipio_id : null,
                    'municipio_lotacao' => isset($sicad_municipio) ? $sicad_municipio : null,
                    'matricula_funcional' => isset($sicad_matricula_funcional) ? $sicad_matricula_funcional : null,
                    'dta_nascimento' => $dataNascimentoFormatada,
                    'dta_posse' => $dataPosseFormatada,
                    'dtai' => $dataLotacaoFormatada,
                    'status' => 'ATIVO'
                ]);

                $servidorNovoObservatorioNew = Servidor::where('cpf', $sicad_cpf)->first();

                ServidorAuditoria::create([
                    'servidor_id' => $servidorNovoObservatorioNew->id,
                    'funcao' => 'Incluiu', // Alterou, Excluiu, Incluiu
                    'descricao' => $sicad_lotacao . '(' . $sicad_lotacao_id . ')',
                    'fun_cad_id' => 0,
                    'fun_cad' => 'Sicad',
                ]);


                return response()->json(['message' => 'Servidor Novo: ' . $servidor . '(' . $servidorNovoObservatorioNew->id . ')' . ' Lotado ' . $sicad_lotacao . '(sicad recebida - ' . $sicad_lotacao_id . ') com sucesso', 'resultado' => 'OK'], 200);
            }

            //'dtai' => $data_lotacao ? $data_lotacao->format('d/m/Y') : null,
        } //NAO_EXISTE_EM_OBSERVATORIO

        if ($zmodo === 'EXCLUIR_EM_OBSERVATORIO') {


            $servidorInativar = Servidor::where('cpf', $sicad_cpf)
                ->whereNotIn('administracao', ['SGI'])->first();

            if ($servidorInativar) {
                $servidorInativar->update([
                    'status' => 'INATIVO',
                    'situacao' => 'INATIVO',
                    'dtaf' => DB::raw('CURRENT_DATE'),
                    // Outros campos que você deseja atualizar
                ]);

                ServidorAuditoria::create([
                    'servidor_id' => $servidorInativar->id,
                    'funcao' => 'Excluiu', // Alterou, Excluiu, Incluiu
                    'descricao' => 'Não Encontrado em SICAD',
                    'fun_cad_id' => 0,
                    'fun_cad' => 'Sicad',
                ]);

                // $servidorInativarNew = Servidor::where('cpf', $sicad_cpf)->first();

                return response()->json(['message' => $servidor . '(' . $servidorInativar->id . ')' . ' Agora Lotado na ' . $sicad_lotacao . '(' . $sicad_lotacao_id . ') - Antes Lotação era: ' . $lotacao_anterior . ' (' . $lotacao_anterior_id . ') com sucesso', 'resultado' => 'OK'], 200);
            }

            //'dtai' => $data_lotacao ? $data_lotacao->format('d/m/Y') : null,
        } //EXCLUIR_EM_OBSERVATORIO



        //'matricula_funcional' => isset($sicad_matriculaFuncional) ? $sicad_matriculaFuncional : null,



        // Substituir 'DE POLÍCIA ' e 'POLICIAL' por uma string vazia
        // $cargo = str_replace(['DE POLÍCIA ', 'POLICIAL'], '', $dadosServidor['postoGrad']);

        /* if (strpos($dadosServidor['nome'], 'ALUNOPC') === false) {

                                        // Criando um objeto Carbon com o timestamp fornecido
                                        $dataNascimento = null;
                                        $dataPosse = null;
                                        $dataInicioLotacao = null;

                                        if (isset($dadosServidor['dtNascimento'])) {
                                            $timestamp = $dadosServidor['dtNascimento'] / 1000; // Convertendo de milissegundos para segundos
                                            $dataNascimento = Carbon::createFromTimestamp($timestamp);
                                            //$dataFormatada = $dataNascimento->format('d/m/Y');
                                        }

                                        if (isset($dadosServidor['dtPosse'])) {
                                            $timestampPosse = $dadosServidor['dtPosse'] / 1000; // Convertendo de milissegundos para segundos
                                            $dataPosse = Carbon::createFromTimestamp($timestampPosse);
                                            //$dataFormatadaPosse = $dataPosse->format('d/m/Y');
                                        }

                                        if (isset($dadosServidor['dtInicioLotacao'])) {
                                            $timestampInicioLotacao = $dadosServidor['dtInicioLotacao'] / 1000; // Convertendo de milissegundos para segundos
                                            $dataInicioLotacao = Carbon::createFromTimestamp($timestampInicioLotacao);
                                            //$dataFormatadaInicioLotacao = $dataInicioLotacao->format('d/m/Y');
                                        }

                                       // try {

                                            Servidor::create([
                                                    'sicad_id' => $dadosServidor['id'],
                                                    'nome' => $dadosServidor['nome'],
                                                    'administracao' => 'GERAL',
                                                    'vinculo' => 'EFETIVO',
                                                    'genero' => $dadosServidor['sexo']==='M' ? 'MASCULINO' : 'FEMININO',
                                                    'funcao' => $dadosServidor['funcao'],
                                                    'cargo' => $cargo,
                                                    'cpf' => $dadosServidor['cpf'],
                                                    'lotacao' => isset($dadosServidor['lotacao']) ? $dadosServidor['lotacao'] : null,
                                                    'lotacao_id' => isset($dadosServidor['lotacaoId']) ? $dadosServidor['lotacaoId'] : null,
                                                    'lotacao_sigla' => isset($dadosServidor['lotacaoSigla']) ? $dadosServidor['lotacaoSigla'] : null,
                                                    'municipio_id_lotacao' => isset($dadosServidor['municipioIdLotacao']) ? $dadosServidor['municipioIdLotacao'] : null,
                                                    'municipio_lotacao' => isset($dadosServidor['municipioLotacao']) ? $dadosServidor['municipioLotacao'] : null,
                                                    'matricula_funcional' => isset($dadosServidor['matriculaFuncional']) ? $dadosServidor['matriculaFuncional'] : null,
                                                    'dta_nascimento' => $dataNascimento ? $dataNascimento->format('d/m/Y') : null,
                                                    'dta_posse' => $dataPosse ? $dataPosse->format('d/m/Y') : null,
                                                    'dtai' => $dataInicioLotacao ? $dataInicioLotacao->format('d/m/Y') : null,
                                                    'status' => $dadosServidor['status']
                                            ]);



                                            if (isset($dadosServidor['lotacaoId']) && ($dadosServidor['lotacaoId'] != $ServidorObservatorio->lotacao_id || $cargo != $ServidorObservatorio->cargo)) {

                                                // Criando um objeto Carbon com o timestamp fornecido
                                                $dataPosse = null;
                                                $dataInicioLotacao = null;

                                                if (isset($dadosServidor['dtPosse'])) {
                                                    $timestampPosse = $dadosServidor['dtPosse'] / 1000; // Convertendo de milissegundos para segundos
                                                    $dataPosse = Carbon::createFromTimestamp($timestampPosse);
                                                    //$dataFormatadaPosse = $dataPosse->format('d/m/Y');
                                                }

                                                if (isset($dadosServidor['dtInicioLotacao'])) {
                                                    $timestampInicioLotacao = $dadosServidor['dtInicioLotacao'] / 1000; // Convertendo de milissegundos para segundos
                                                    $dataInicioLotacao = Carbon::createFromTimestamp($timestampInicioLotacao);
                                                    //$dataFormatadaInicioLotacao = $dataInicioLotacao->format('d/m/Y');
                                                }

                                                if ($dataInicioLotacao->greaterThan($ServidorObservatorio->dtai)) {

                                                    Servidor::where('sicad_id', $ServidorObservatorio->sicad_id)->update([
                                                        'lotacao' => isset($dadosServidor['lotacao']) ? $dadosServidor['lotacao'] : null,
                                                        'lotacao_id' => isset($dadosServidor['lotacaoId']) ? $dadosServidor['lotacaoId'] : null,
                                                        'lotacao_sigla' => isset($dadosServidor['lotacaoSigla']) ? $dadosServidor['lotacaoSigla'] : null,
                                                        'municipio_id_lotacao' => isset($dadosServidor['municipioIdLotacao']) ? $dadosServidor['municipioIdLotacao'] : null,
                                                        'municipio_lotacao' => isset($dadosServidor['municipioLotacao']) ? $dadosServidor['municipioLotacao'] : null,
                                                        'cargo' => $cargo,
                                                        'dta_posse' => $dataPosse ? $dataPosse->format('d/m/Y') : null,
                                                        'dtai' => $dataInicioLotacao ? $dataInicioLotacao->format('d/m/Y') : null,
                                                        'matricula_funcional' => isset($dadosServidor['matriculaFuncional']) ? $dadosServidor['matriculaFuncional'] : null,
                                                        // Outros campos que você deseja atualizar
                                                    ]);



                            // Obtenha os IDs dos servidores presentes em $dadosServidores
                            $idsServidores = collect($dadosServidores)->pluck('id')->toArray();

                            // Atualize os registros em $responseObservatorio que não estão presentes em $idsServidores
                            Servidor::whereNotIn('sicad_id', $idsServidores)->update([
                                // Defina os campos que você deseja atualizar aqui
                                'status' => 'INATIVO'
                                // Adicione outros campos que deseja atualizar conforme necessário
                            ]);*/
    }

    public function sincTitularDepartamento(Request $req)
    {
        // Criação da subconsulta usando o DB::table
        $subquery = DB::table('public.servidors')
            ->select(DB::raw('(ARRAY_AGG(id ORDER BY id))[1] as novo_titular_id'), 'lotacao_id as departamento_id')
            ->where('funcao', 'DELEGADO DE POLÍCIA')
            ->groupBy('lotacao_id')
            ->havingRaw('COUNT(id) = 1');

        // Cria uma tabela temporária com os resultados da subconsulta
        DB::statement('
            CREATE TEMPORARY TABLE temp_titulares AS
            SELECT * FROM (' . $subquery->toSql() . ') as subquery
        ', $subquery->getBindings());

        // Atualizar departamentos com o novo titular usando a tabela temporária
        DB::statement('
            UPDATE public.departamentos
            SET titular_id = temp_titulares.novo_titular_id
            FROM temp_titulares
            WHERE public.departamentos.id = temp_titulares.departamento_id
            AND public.departamentos.titular_id <> temp_titulares.novo_titular_id
        ');

        // Remover a tabela temporária após a atualização
        DB::statement('DROP TABLE IF EXISTS temp_titulares');

        return response()->json(['message' => 'Departamentos com apenas 1 delegado atualizados'], 200);
    }










    public function sincServidoresSicadObservatorioXLS(Request $request)
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
            $contExiste = 0;
            $contOs = 0;

            $placa='-1';
            $xinserir=false;

            $message='';




            // mapear colunas


            for ($cont=3; $cont < sizeof($lista); $cont++) {

/*
XLS DE IMPORTAÇÃO
0 = A  ->   -                 13 = N  -> TEL. TRABALHO          26 = AA -> CARGO            39 = AN     DATA NOMEAÇÃO
1 = B  ->   NOME              14 = O  -> DATA NASCIMENTO        27 = AB -> CLASSE           40 = AO     DATA POSSE
2 = C  ->   -                 15 = P  -> NACIONALIDADE          28 = AC -> REGIME JU        41 = AP     DATA EXERCÍCIO
3 = D  ->   MÃE               16 = Q  -> NATURALIDADE           29 = AD -> VÍNCULO          42 = AQ     MATRÍCULA FUNCIONAL
4 = E  ->   -                 17 = R  -> NATURALIDADE-UF        30 = AE -> -                43 = AR     AFASTAMENTOS
5 = F  ->   -                 18 = S  -> GENERO/SEXO            31 = AF -> PNE              44 = AS     PUNIÇÕES
6 = G  ->   CPF               19 = T  -> RAÇA/COR               32 = AG -> ESTÁGIO          45 = AT     ORGÃO DESTINO A DISPOSIÇÃO
7 = H  ->   -                 20 = U  -> ESCOLARIDADE           33 = AH -> SUB JUD          46 = AU
8 = I  ->   EMAIL             21 = V  -> ESPECIALIDADE          34 = AI -> ESCALA           47 = AV
9 = J  ->   -                 22 = W  -> ESTADO CIVIL           35 = AJ -> CIDADE LOT       48 = AW
10 = K ->   CELULAR           23 = X  -> STATUS                 36 = AK -> UNIDADE PAI      49 = AX
11 = L ->   -                 24 = Y  -> SITUAÇÃO               37 = AL -> LOTAÇÃO          50 = AY
12 = M ->   TEL. RES          25 = Z  -> GRUPO CARGO            38 = AM -> TIPO DA UNIDADE  51 = AZ

CORRESPONDENTE SAAP-OBSERVATÓRIO DB
0 = A  ->   -                 13 = N  -> -                      26 = AA -> classificacao(cargo)     39 = AN     dta_nomeacao(date)
1 = B  ->   nome              14 = O  -> dta_nascimento(date)   27 = AB -> cargo(classe)            40 = AO     dta_posse(date)
2 = C  ->   -                 15 = P  -> nacionalidade          28 = AC -> regime_juridico(text)    41 = AP     dta_inicio_lotacao(date)
3 = D  ->   nome_mae          16 = Q  -> naturalidade           29 = AD -> vinculo(varchar255)      42 = AQ     matricula_funcional(varchar255)
4 = E  ->   -                 17 = R  -> naturalidade           30 = AE -> -                        43 = AR     ???
5 = F  ->   -                 18 = S  -> genero                 31 = AF -> pne(char1)               44 = AS     punicoes(text)
6 = G  ->   cpf               19 = T  -> cor_raca               32 = AG -> campo dinâmico           45 = AT     ???
7 = H  ->   -                 20 = U  -> escolaridade           33 = AH -> sub_judice(char1)        46 = AU
8 = I  ->   email(var255)     21 = V  -> especialidade          34 = AI -> escala(upper 255)        47 = AV
9 = J  ->   -                 22 = W  -> estado_civil(text)     35 = AJ -> ???                      48 = AW
10 = K ->   celular(var255)   23 = X  -> status(varchar255)     36 = AK -> ???                      49 = AX
11 = L ->   -                 24 = Y  -> status(varchar255)     37 = AL -> lotacao_sigla(255)       50 = AY
12 = M ->   telefone(var255)  25 = Z  -> classificacao          38 = AM -> ???                      51 = AZ
*/

                    $linhaXLS=$lista[$cont];

                    if(strlen($linhaXLS[6])==11){
                        /*$message = 'A ' . $linhaXLS[0] .
                                    '!B ' . $linhaXLS[1] .
                                    '!C ' . $linhaXLS[2] .
                                    '!D ' . $linhaXLS[3] .
                                    '!E ' . $linhaXLS[4] .
                                    '!F ' . $linhaXLS[5] .
                                    '!G ' . $linhaXLS[6] .
                                    '!H ' . $linhaXLS[7] .
                                    '!I ' . $linhaXLS[8] .
                                    '!J ' . $linhaXLS[9] .
                                    '!K ' . $linhaXLS[10] .
                                    '!L ' . $linhaXLS[11] .
                                    '!M ' . $linhaXLS[12] .
                                    '!N ' . $linhaXLS[13] .
                                    '!O ' . $linhaXLS[14] .
                                    '!P ' . $linhaXLS[15] .
                                    '!Q ' . $linhaXLS[16] .
                                    '!R ' . $linhaXLS[17] .
                                    '!S ' . $linhaXLS[18] .
                                    '!T ' . $linhaXLS[19] .
                                    '!U ' . $linhaXLS[20] .
                                    '!V ' . $linhaXLS[21] .
                                    '!W ' . $linhaXLS[22] .
                                    '!X ' . $linhaXLS[23] .
                                    '!Y ' . $linhaXLS[24] .
                                    '!Z ' . $linhaXLS[25] .
                                    '!AA ' . $linhaXLS[26] .
                                    '!AB ' . $linhaXLS[27] .
                                    '!AC ' . $linhaXLS[28] .
                                    '!AD ' . $linhaXLS[29] .
                                    '!AE ' . $linhaXLS[30] .
                                    '!AF ' . $linhaXLS[31] .
                                    '!AG ' . $linhaXLS[32] .
                                    '!AH ' . $linhaXLS[33] .
                                    '!AI ' . $linhaXLS[34] .
                                    '!AJ ' . $linhaXLS[35] .
                                    '!AK ' . $linhaXLS[36] .
                                    '!AL ' . $linhaXLS[37] .
                                    '!AM ' . $linhaXLS[38] .
                                    '!AN ' . $linhaXLS[39] .
                                    '!AO ' . $linhaXLS[40] .
                                    '!AP ' . $linhaXLS[41] .
                                    '!AQ ' . $linhaXLS[42] .
                                    '!AR ' . $linhaXLS[43] .
                                    '!AS ' . $linhaXLS[44] .
                                    '!AT ' . $linhaXLS[45];
                    }*/


                    // ESCALA
                        $escala = '';
                        $escala_grupo = '';

                        if($linhaXLS[24]=='EM EXERCÍCIO'){
                            // Verifique o conteúdo da célula
                            $valor = mb_strtoupper($linhaXLS[34], 'UTF-8');//strtoupper($linhaXLS[34]);

                            if (strpos($valor, 'EXPEDIENTE') !== false) {
                                $escala = 'EXPEDIENTE';
                            } elseif (strpos($valor, 'PLANTÃO') !== false) {
                                $escala = 'PLANTÃO';
                            } elseif ($valor === '') {
                                $escala = 'EXPEDIENTE';
                            } else {
                                $escala = $valor;
                            }

                            // Verifique o grupo se a escala for 'PLANTÃO'
                            if ($escala === 'PLANTÃO') {
                                if (strpos($valor, 'GRUPO A') !== false) {
                                    $escala_grupo = 'A';
                                } elseif (strpos($valor, 'GRUPO B') !== false) {
                                    $escala_grupo = 'B';
                                } elseif (strpos($valor, 'GRUPO C') !== false) {
                                    $escala_grupo = 'C';
                                } elseif (strpos($valor, 'GRUPO D') !== false) {
                                    $escala_grupo = 'D';
                                }
                            }
                        }//situação em exercício
                    // ESCALA FIM


                    //TRABALHA AS DATAS
                    if (strlen(trim($linhaXLS[39])) == 10) {
                        $dataNomeacao = trim($linhaXLS[39]);
                        $dataNomeacaoFormatada = Carbon::createFromFormat('d/m/Y', $dataNomeacao)->toDate();
                        // Agora, você pode formatar a data como DD/MM/YYYY
                        //$dataNomeacaoFormatada = $date->format('d/m/Y');
                    } else {
                        $dataNomeacaoFormatada = null; // Ou qualquer valor padrão que você deseja usar se a data for nula
                    }
                    if (strlen(trim($linhaXLS[40])) == 10) {
                        $dataPosse = trim($linhaXLS[40]);
                        $dataPosseFormatada = Carbon::createFromFormat('d/m/Y', $dataPosse)->toDate();
                        // Agora, você pode formatar a data como DD/MM/YYYY
                       // $dataPosseFormatada = $date->format('d/m/Y');
                    } else {
                        $dataPosseFormatada = null; // Ou qualquer valor padrão que você deseja usar se a data for nula
                    }
                    if (strlen(trim($linhaXLS[41])) == 10) {
                        $dataInicioLotacao = trim($linhaXLS[41]);
                        $dataInicioLotacaoFormatada = Carbon::createFromFormat('d/m/Y', $dataInicioLotacao)->toDate();
                        // Agora, você pode formatar a data como DD/MM/YYYY
                        //$dataInicioLotacaoFormatada = $date->format('d/m/Y');
                    } else {
                        $dataInicioLotacaoFormatada = null; // Ou qualquer valor padrão que você deseja usar se a data for nula
                    }

                    if (isset($linhaXLS[14]) && !is_array($linhaXLS[14])) {
                        $dataNascimento = trim($linhaXLS[14]);
                        // Verifica se a data está no formato DD/MM/YYYY
                        if (strlen($dataNascimento) == 10) {
                            // Converte a data para o formato YYYY-MM-DD
                            $dataNascimentoFormatada = Carbon::createFromFormat('d/m/Y', $dataNascimento)->toDate();
                        } else {
                            $dataNascimentoFormatada = null; // Define um valor padrão caso a data não seja válida
                        }
                    } else {
                        // Tratamento de erro ou valor padrão caso $linhaXLS[14] seja um array ou não esteja definido
                        $dataNascimentoFormatada = null; // Ou algum outro valor padrão
                    }

                    //TRABALHA AS DATAS FIM

                    $xvinculo='EFETIVO';
                            if($linhaXLS[29]=='' || !$linhaXLS[29]){
                                $xvinculo='OUTRO';
                            }else{
                                $xvinculo=$linhaXLS[29];
                            }
                    $xstatus=$linhaXLS[23];
                            if($linhaXLS[23]=='DESLIGADO' || !$linhaXLS[23]){
                                $xstatus='INATIVO';
                            }

                    $cargo=strtoupper($linhaXLS[26]);
                    $classificacao = 'ADMINISTRATIVO';
                            if (strpos($cargo, 'AGENTE DE POL') !== false) {
                                $classificacao = 'AGENTE';
                            }
                            if (strpos($cargo, 'AGENTE AUXILIAR POLICIAL') !== false) { //Motorista
                                $classificacao = 'AGENTE';
                            }
                            if (strpos($cargo, 'AGENTE POLICIAL') !== false) { //Motorista
                                $classificacao = 'AGENTE';
                            }
                            if (strpos($cargo, 'POLICIAL PENAL') !== false) { //Motorista
                                $classificacao = 'AGENTE';
                            }
                            if (strpos($cargo, 'DELEGADO') !== false) {
                                $classificacao = 'DELEGADO';
                            }
                            if (strpos($cargo, 'ESCR') !== false) {
                                $classificacao = 'ESCRIVAO';
                            }
                            if (strpos($cargo, 'PAPILOSCOPISTA') !== false) {
                                $classificacao = 'PAPILOSCOPISTA';
                            }
                            if (strpos($cargo, 'DACTILOSCOPISTA') !== false) {
                                $classificacao = 'PAPILOSCOPISTA';
                            }
                            if (strpos($cargo, 'DIGITADOR') !== false) {
                                $classificacao = 'DIGITADOR';
                            }
                            if (strpos($cargo, 'DIGITADOR') !== false) {
                                $classificacao = 'DIGITADOR';
                            }
                            if (strpos($cargo, 'ESTAGI') !== false) {
                                $classificacao = 'ESTAGIARIO';
                            }
                            if (strpos($linhaXLS[27], 'ESTAGI') !== false) {
                                $classificacao = 'ESTAGIARIO';
                            }
                            if (strpos($cargo, 'METROBUS') !== false) {
                                $classificacao = 'METROBUS';
                            }


                    //if($cont==3){

                        //$dep_nome=str_replace('CIVIL ', '', $linhaXLS[37]);
                        //$dep_nome=str_replace(' DE POLÍCIA', '', $dep_nome);

//BUSCA O SERVIDOR E SUA LOTAÇÃO NAS TABELAS
                        $servidor = Servidor::where('cpf', $linhaXLS[6])->first();

                        //$departamento = Departamento::where('nome', $dep_nome)->first();
//BUSCA O SERVIDOR E SUA LOTAÇÃO NAS TABELAS - FIM

                        if ($servidor) {//ENCONTROU O SERVIDOR

                                $servidor->update([
                                    'nome_mae' => isset($linhaXLS[3]) ? $linhaXLS[3] : '',
                                    'celular' => isset($linhaXLS[10]) && strlen($linhaXLS[10]) >= 8 ? $linhaXLS[10] : $servidor->celular,
                                    'telefone' => isset($linhaXLS[12]) && strlen($linhaXLS[12]) >= 8 ? $linhaXLS[12] : $servidor->telefone,
                                    'email' => (isset($linhaXLS[8]) && strlen($linhaXLS[8]) >= 5 && $linhaXLS[8] !== 'PC@GO.GOV.BR') ? $linhaXLS[8] : '',
                                    'naturalidade' => isset($linhaXLS[16]) ? $linhaXLS[16].'-'.$linhaXLS[17] : '',
                                    'cor_raca' => isset($linhaXLS[19]) ? $linhaXLS[19] : '',
                                    'escolaridade' => isset($linhaXLS[20]) ? $linhaXLS[20] : '',
                                    'especialidade' => isset($linhaXLS[21]) ? $linhaXLS[21] : '',
                                    'estado_civil' => isset($linhaXLS[22]) ? $linhaXLS[22] : '',
                                    'matricula_funcional' => isset($linhaXLS[42]) ? $linhaXLS[42] : '',
                                    'pne' => isset($linhaXLS[31]) ? substr($linhaXLS[31], 0, 1) : 'N',
                                    'sub_judice' => isset($linhaXLS[33]) ? substr($linhaXLS[33], 0, 1) : 'N',
                                    'nacionalidade' => isset($linhaXLS[15]) ? $linhaXLS[15] : 'BRASIL',
                                    'escala' => isset($escala) ? $escala : '',
                                    'escala_grupo' => isset($escala_grupo) ? $escala_grupo : '',
                                    'regime_juridico' => isset($linhaXLS[28]) ? $linhaXLS[28] : '',
                                    'punicoes' => isset($linhaXLS[44]) ? $linhaXLS[44] : '',
                                    'situacao' => isset($linhaXLS[24]) ? $linhaXLS[24] : '',
                                    'dta_nomeacao' => $dataNomeacaoFormatada,
                                    'dta_inicio_lotacao' => $dataInicioLotacaoFormatada,
                                    'dta_posse' => $dataPosseFormatada,
                                    'dta_nomeacao' => $dataInicioLotacaoFormatada,
                                    'dta_nascimento' => $dataNascimentoFormatada,
                                    'status' => $xstatus,
                                    'vinculo' => $xvinculo,
                                ]);

                                $contExiste++;

                        }else{//SERVIDOR NOVO

                            Servidor::create([
                                    'nome_mae' => isset($linhaXLS[3]) ? $linhaXLS[3] : '',
                                    'celular' => isset($linhaXLS[10]) && strlen($linhaXLS[10]) >= 8 ? $linhaXLS[10] : '',
                                    'telefone' => isset($linhaXLS[12]) && strlen($linhaXLS[12]) >= 8 ? $linhaXLS[12] : '',
                                    'email' => (isset($linhaXLS[8]) && strlen($linhaXLS[8]) >= 5 && $linhaXLS[8] !== 'PC@GO.GOV.BR') ? $linhaXLS[8] : '',
                                    'naturalidade' => isset($linhaXLS[16]) ? $linhaXLS[16].'-'.$linhaXLS[17] : '',
                                    'cor_raca' => isset($linhaXLS[19]) ? $linhaXLS[19] : '',
                                    'escolaridade' => isset($linhaXLS[20]) ? $linhaXLS[20] : '',
                                    'especialidade' => isset($linhaXLS[21]) ? $linhaXLS[21] : '',
                                    'estado_civil' => isset($linhaXLS[22]) ? $linhaXLS[22] : '',
                                    'matricula_funcional' => isset($linhaXLS[42]) ? $linhaXLS[42] : '',
                                    'pne' => isset($linhaXLS[31]) ? substr($linhaXLS[31], 0, 1) : 'N',
                                    'sub_judice' => isset($linhaXLS[33]) ? substr($linhaXLS[33], 0, 1) : 'N',
                                    'nacionalidade' => isset($linhaXLS[15]) ? $linhaXLS[15] : 'BRASIL',
                                    'escala' => isset($escala) ? $escala : '',
                                    'escala_grupo' => isset($escala_grupo) ? $escala_grupo : '',
                                    'regime_juridico' => isset($linhaXLS[28]) ? $linhaXLS[28] : '',
                                    'punicoes' => isset($linhaXLS[44]) ? $linhaXLS[44] : '',
                                    'situacao' => isset($linhaXLS[24]) ? $linhaXLS[24] : '',
                                    'dta_nomeacao' => $dataNomeacaoFormatada,
                                    'dta_inicio_lotacao' => $dataInicioLotacaoFormatada,
                                    'dta_posse' => $dataPosseFormatada,
                                    'dta_nomeacao' => $dataInicioLotacaoFormatada,
                                    'dta_nascimento' => $dataNascimentoFormatada,
                                    'status' => $xstatus,
                                    'vinculo' => $xvinculo,
                                'nome' => $linhaXLS[1],
                                'administracao' => 'GERAL',
                                'classificacao' => mb_strtoupper($classificacao, 'UTF-8'),
                                'genero' => $linhaXLS[18] === 'M' ? 'MASCULINO' : 'FEMININO',
                                'funcao' => mb_strtoupper($cargo, 'UTF-8'),
                                'cargo' => str_replace(['DE POLÍCIA ', 'POLICIAL'], '', $linhaXLS[27]),
                                'cpf' => $linhaXLS[6],
                                'municipio_lotacao' => isset($linhaXLS[35]) ? $linhaXLS[35] : '',
                                'lotacao' => isset($linhaXLS[37]) ? $linhaXLS[37] : ''
                                /*'lotacao' => isset($departamento->nome) ? $departamento->nome : $linhaXLS[37],
                                'lotacao_id' => isset($departamento->id) ? $departamento->id : null,
                                'lotacao_sigla' => isset($departamento->sigla) ? $departamento->sigla : null,
                                'municipio_id_lotacao' => isset($departamento->municipioid) ? $departamento->municipioid : null,
                                'municipio_lotacao' => isset($departamento->municipio) ? $departamento->municipio : $linhaXLS[35],*/
                            ]);

                            $contInsert++;

                        }//possui CPF


///1DYENITON GONCALVES FLORES !2!3SHEILA MARIA GONCALVES FLORES!4!5!6-05744298169!7!

                        //$message='Linha 1 = '.$linhaXLS[1].'!'.$linhaXLS[2].'!'.$linhaXLS[3].'!'.$linhaXLS[4].'!'.$linhaXLS[5].'!'.$linhaXLS[6].'!'.$linhaXLS[7];
                    }

            }



            $message = "Foram cadastrados {$contInsert} Servidores com sucesso. {$contExiste} Servidores já existia(m).";

            return response()->json(['message' => $message], 200);

    }


    public function saveServidor(Request $request)
    {

        try {
            $new = $request->post('values');

            $servidor = Servidor::where('cpf', $new['cpf'])->first();

            /*if($new['cidade_id']>-1){
                $xcidade_id = $new['cidade_id'];
                $xcidade=$new['cidade'];
            }else{
                $xcidade_id = 'null';
                $xcidade='';
            }*/
            if ($servidor) {

                $novoID = $servidor->id;


                $zlimite_chefe_secao = isset($new['zlimite_chefe_secao']) ? $new['zlimite_chefe_secao'] : 100000;
                $zlimite_chefe_divisao = isset($new['zlimite_chefe_divisao']) ? $new['zlimite_chefe_divisao'] : 100000;

                $xac4 = isset($new['ac4_prevista']) ? $new['ac4_prevista'] : 0;
                $xfc_bruta = isset($new['fc_bruta_prevista']) ? $new['fc_bruta_prevista'] : 0;
                $xfc = isset($new['fc_liquida_prevista']) ? $new['fc_liquida_prevista'] : 0;

                $xgratificacao = $xac4 + $xfc;

                if (($new['chefia'] == 'SECAO') && ($xgratificacao > $zlimite_chefe_secao)) {
                    $xgratificacao = $zlimite_chefe_secao;
                }

                if (($new['chefia'] == 'DIVISAO') && ($xgratificacao > $zlimite_chefe_divisao)) {
                    $xgratificacao = $zlimite_chefe_divisao;
                }

                $servidor->update([
                    'sicad_id' => isset($new['sicad_id']) ? $new['sicad_id'] : null,
                    'nome' => $new['servidor'],
                    'vinculo' => $new['vinculo'],
                    'classificacao' => $new['classificacao'],
                    'genero' => $new['genero'],
                    'funcao' => $new['funcao'],
                    'cargo' => $new['cargo'],
                    'atribuicao_id' => $new['atribuicao_id'],
                    'origem_id' => $new['origem_id'],
                    'celular' => $new['celular'],
                    'telefone' => $new['telefone'],
                    'email' => $new['email'],
                    'cpf' => $new['cpf'],
                    'lotacao' => $new['lotacao'],
                    'disposicao' => $new['disposicao'],
                    'lotacao_id' => $new['lotacao_id'],
                    'lotacao_sigla' => $new['lotacao_sigla'],
                    'dta_nascimento' => $new['dta_nascimento'],
                    'dtai' => $new['dtai'],
                    'dtaf' => isset($new['dtaf']) ? $new['dtaf'] : null,
                    'indicacao' => $new['indicacao'],
                    'indicacao_obs'  => isset($new['indicacao_obs']) ? $new['indicacao_obs'] : null,
                    'chefia' => $new['chefia'],
                    'ac4_prevista' => $xac4,
                    'fc_bruta_prevista' => $xfc_bruta,
                    'fc_liquida_prevista' => $xfc,
                    'gratificado' => $xgratificacao,
                    'fun_up_id' => $new['user_id'],
                    'fun_up' => $new['user_nome'],
                    'status' => $new['status'],
                    'administracao' => $new['administracao']
                ]);
                $message = 'Alterado com sucesso. ' . $new['status'];

                ServidorAuditoria::create([
                    'servidor_id' => $novoID,
                    'funcao' => 'Alterou', // Alterou, Excluiu, Incluiu
                    'descricao' => $new['servidor'],
                    'fun_cad_id' => $new['user_id'],
                    'fun_cad' => $new['user_nome'],
                ]);
            } else {
                $servidor = Servidor::create([
                    'sicad_id' => isset($new['sicad_id']) ? $new['sicad_id'] : null,
                    'nome' => $new['servidor'],
                    'vinculo' => $new['vinculo'],
                    'classificacao' => $new['classificacao'],
                    'genero' => $new['genero'],
                    'funcao' => $new['funcao'],
                    'cargo' => $new['cargo'],
                    'atribuicao_id' => $new['atribuicao_id'],
                    'origem_id' => $new['origem_id'],
                    'celular' => $new['celular'],
                    'telefone' => $new['telefone'],
                    'email' => $new['email'],
                    'cpf' => $new['cpf'],
                    'lotacao' => $new['lotacao'],
                    'disposicao' => $new['disposicao'],
                    'lotacao_id' => $new['lotacao_id'],
                    'lotacao_sigla' => $new['lotacao_sigla'],
                    'dta_nascimento' => $new['dta_nascimento'],
                    'dtai' => $new['dtai'],
                    'dtaf' => isset($new['dtaf']) ? $new['dtaf'] : null,
                    'indicacao' => $new['indicacao'],
                    'indicacao_obs'  => isset($new['indicacao_obs']) ? $new['indicacao_obs'] : null,
                    'chefia' => $new['chefia'],
                    'ac4_prevista' => isset($new['ac4_prevista']) ? $new['ac4_prevista'] : 0,
                    'fc_bruta_prevista' => isset($new['fc_bruta_prevista']) ? $new['fc_bruta_prevista'] : 0,
                    'fc_liquida_prevista' => isset($new['fc_liquida_prevista']) ? $new['fc_liquida_prevista'] : 0,
                    'gratificado' => isset($new['gratificado']) ? $new['gratificado'] : 0,
                    'fun_cad_id' => $new['user_id'],
                    'fun_cad' => $new['user_nome'],
                    'status' => $new['status'],
                    'administracao' => 'SGI'
                ]);
                $novoID = $servidor->id;



                ServidorAuditoria::create([
                    'servidor_id' => $novoID,
                    'funcao' => 'Incluiu', // Alterou, Excluiu, Incluiu
                    'descricao' => $new['servidor'],
                    'fun_cad_id' => $new['user_id'],
                    'fun_cad' => $new['user_nome'],
                ]);

                $message = 'Cadastrado com sucesso.';
            }

            return response()->json(['message' => $message, 'id' => $novoID], 200);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Erro ao tentar gravar. ' . print_r($new) . ' - ' . $th->getMessage()], 400);
        }
    }




    public function ServidorUpDados(Request $request)
    {

       // try {
            $new = $request->post('values');

            $servidor = Servidor::where('cpf', $new['cpf'])->first();

            /*if($new['cidade_id']>-1){
                $xcidade_id = $new['cidade_id'];
                $xcidade=$new['cidade'];
            }else{
                $xcidade_id = 'null';
                $xcidade='';
            }

            'lotacao_id' => $new['lotacao_id'],
                            'lotacao' => $new['lotacao'],
            */
            if ($servidor) {

                $novoID = $servidor->id;

                $servidor->update([
                    'celular' => $new['celular'],
                    'telefone' => $new['telefone'],
                    'email' => $new['email'],
                    'escala' => isset($new['serv_escala']) ? $new['serv_escala'] : '',
                    'classificacao' => $new['classificacao'],
                    'escala_grupo' => isset($new['escala_grupo']) ? $new['escala_grupo'] : null,
                    'restricao_sei' => isset($new['restricao_sei']) ? $new['restricao_sei'] : null,
                    'restricao_obs' => isset($new['restricao_obs']) ? $new['restricao_obs'] : null,
                    'restricao_arma' => isset($new['restricao_arma']) ? $new['restricao_arma'] : false,
                    'restricao_medica' => isset($new['restricao_medica']) ? $new['restricao_medica'] : false,
                    'restricao_judicial' => isset($new['restricao_judicial']) ? $new['restricao_judicial'] : false,
                    'chefia' => $new['chefia'],
                    'fun_up_id' => $new['user_id'],
                    'fun_up' => $new['user_nome']
                ]);
                $message = 'Alterado com sucesso. ';



                ServidorAuditoria::create([
                    'servidor_id' => $novoID,
                    'funcao' => 'Alterou', // Alterou, Excluiu, Incluiu
                    'descricao' => $new['servidor'],
                    'fun_cad_id' => $new['user_id'],
                    'fun_cad' => $new['user_nome'],
                ]);

                return response()->json(['message' => $message], 200);
            } else {
                return response()->json(['message' => 'Servidor Não encontrado. CPF.: ' . $new['cpf']], 200);
            }
        /*} catch (\Throwable $th) {
            return response()->json(['message' => 'Erro ao tentar gravar. ' . print_r($new) . ' - ' . $th->getMessage()], 400);
        }*/
    }



    private function buildWhereClauses($zcons_filtro)
    {
        $whereClauses = [];
        $options = [
            'FEMININO', 'MASCULINO', 'CELETISTA', 'EFETIVO', 'COMISSIONADO', 'TEMPORARIO', 'ESTAGIARIO', 'GRATIFICADOAC4', 'GRATIFICADOFC', 'GRATIFICADOAC4FC', 'NAO_GRATIFICADO', 'CHEFIA_SECAO', 'CHEFIA_DIVISAO', 'CHEFIA_GERENTE', 'CHEFIA_SUPERINTENDENTE', 'NAO_CHEFIA', 'PCGO', 'OUTRA', 'P. Mulher', 'Menor Infrator', 'P. Menor', 'P. Idoso', 'P. Deficiente', 'P. Racial', 'Homicídios', 'Inv. Crim.', 'Trânsito', 'Drogas', 'Patrimoniais', 'Inteligência', 'Identificação', 'Necropapiloscopia', 'Regionais', 'Unidade Adm.', 'Operacionais', 'Organizacionais', 'Sem Del.', 'Sem Esc.', 'Sem Age.', 'Chefe Titular', 'Chefe Interino', 'Policial', 'Delegado', 'Escrivão', 'Agente', 'Papiloscopista', 'Administrativo', 'Especial', '1ª Classe', '2ª Classe', '3ª Classe', 'ADM SGI', 'ADM GERAL', 'Restrição Arma', 'Restrição Médica', 'Restrição Judicial', 'Substituto', 'Assessor A9', 'Assessor A8', 'Assessor A7', 'Assessor A6', 'Assessor A5', 'Assessor A4', 'Assessor A3', 'Assessor A2', 'Assessor A1', 'Masculino', 'Feminino',     'Plantão', 'Expediente',
            'Lotação Externa',
            'Lotação Executivo',
            'Lotação Legislativo',
            'Lotação Judiciário',
            'Lotação Executivo Municipal',
            'Lotação Executivo Estadual',
            'Lotação Executivo Federal',
            'Lotação Legislativo Municipal',
            'Lotação Legislativo Estadual',
            'Lotação Legislativo Federal',
            'Estágio Probatório',
            'PNE',
            'Sub Júdice',
            'Com Punição'
        ];

        $selectedOptions = explode(',', $zcons_filtro);

        foreach ($options as $option) {
            if (in_array($option, $selectedOptions)) {
                switch ($option) {
                    case 'FEMININO':
                    case 'MASCULINO':
                        $whereClauses[] = ['servidors.genero', strtoupper($option)];
                        break;
                    case 'PCGO':
                    case 'OUTRA':
                        $whereClauses[] = ['servidors.indicacao', strtoupper($option)];
                        break;
                    case 'CELETISTA':
                    case 'EFETIVO':
                    case 'COMISSIONADO':
                    case 'TEMPORARIO':
                    case 'ESTAGIARIO':
                        $whereClauses[] = ['servidors.vinculo', strtoupper($option)];
                        break;
                    case 'GRATIFICADOAC4':
                        $whereClauses[] = ['servidors.ac4_prevista', '>', 0];
                        break;
                    case 'GRATIFICADOFC':
                        $whereClauses[] = ['servidors.fc_bruta_prevista', '>', 0];
                        break;
                    case 'GRATIFICADOAC4FC':
                        $whereClauses[] = ['servidors.ac4_prevista', '>', 0];
                        $whereClauses[] = ['servidors.fc_bruta_prevista', '>', 0];
                        break;
                    case 'NAO_GRATIFICADO':
                        $whereClauses[] = ['servidors.gratificado', 0];
                        break;
                    case 'CHEFIA_SECAO':
                        $whereClauses[] = ['servidors.chefia', 'SECAO'];
                        break;
                    case 'CHEFIA_DIVISAO':
                        $whereClauses[] = ['servidors.chefia', 'DIVISAO'];
                        break;
                    case 'CHEFIA_GERENTE':
                        $whereClauses[] = ['servidors.chefia', 'GERENTE'];
                        break;
                    case 'CHEFIA_SUPERINTENDENTE':
                        $whereClauses[] = ['servidors.chefia', 'SUPERINTENDENTE'];
                        break;
                    case 'NAO_CHEFIA':
                        $whereClauses[] = ['servidors.chefia', 'NAO'];
                        break;
                    case 'Feminino':
                        $whereClauses[] = ['servidors.genero', 'FEMININO'];
                        break;
                    case 'Masculino':
                        $whereClauses[] = ['servidors.genero', 'MASCULINO'];
                        break;
                    case 'P. Mulher':
                        $whereClauses[] = ['departamentos.especializacao', 'MULHER'];
                        break;
                    case 'Menor Infrator':
                        $whereClauses[] = ['departamentos.especializacao', 'MENOR_INFRATOR'];
                        break;
                    case 'P. Menor':
                        $whereClauses[] = ['departamentos.especializacao', 'MENOR_VITIMA'];
                        break;
                    case 'P. Idoso':
                        $whereClauses[] = ['departamentos.especializacao', 'IDOSO'];
                        break;
                    case 'P. Deficiente':
                        $whereClauses[] = ['departamentos.especializacao', 'DEFICIENCIA'];
                        break;
                    case 'P. Racial':
                        $whereClauses[] = ['departamentos.especializacao', 'RACIAL'];
                        break;
                    case 'Homicídios':
                        $whereClauses[] = ['departamentos.especializacao', 'DIH'];
                        break;
                    case 'Inv. Crim.':
                        $whereClauses[] = ['departamentos.especializacao', 'DEIC'];
                        break;
                    case 'Trânsito':
                        $whereClauses[] = ['departamentos.especializacao', 'DICT'];
                        break;
                    case 'Inteligência':
                        $whereClauses[] = ['departamentos.especializacao', 'INTELIGENCIA'];
                        break;
                    case 'Identificação':
                        $whereClauses[] = ['departamentos.especializacao', 'ID'];
                        break;
                    case 'Necropapiloscopia':
                        $whereClauses[] = ['departamentos.especializacao', 'NECRO'];
                        break;
                    case 'Unidade Adm.':
                        $whereClauses[] = ['departamentos.especializacao', 'ADMINISTRATIVA'];
                        break;
                    case 'Operacionais':
                        $whereClauses[] = ['departamentos.especializacao', 'OPERACIONAL'];
                        break;
                    case 'Organizacionais':
                        $whereClauses[] = ['departamentos.especializacao', 'ORGANIZACIONAL'];
                        break;
                    case 'Regionais':
                        $whereClauses[] = ['departamentos.especializacao', 'REGIONAL'];
                        break;
                    case 'Plantão':
                        $whereClauses[] = ['servidors.escala', 'PLANTÃO'];
                        break;
                    case 'Expediente':
                        $whereClauses[] = ['servidors.escala', 'EXPEDIENTE'];
                        break;
                    case 'Drogas':
                        $whereClauses[] = ['departamentos.especializacao', 'ilike', '%DROGAS%'];
                        break;
                    case 'Patrimoniais':
                        $whereClauses[] = ['departamentos.especializacao', 'ilike', '%GEPATRI%'];
                        break;
                    case 'Sem Del.':
                        $whereClauses[] = ['servidors.classificacao', 'not ilike', 'DELEGADO'];
                        break;
                    case 'Sem Esc.':
                        $whereClauses[] = ['servidors.classificacao', 'not ilike', 'ESCRIVAO'];
                        break;
                    case 'Sem Age.':
                        $whereClauses[] = ['servidors.classificacao', 'not ilike', 'AGENTE'];
                        break;
                    case 'Estágio Probatório':
                        $whereClauses[] = ['servidors.dta_nomeacao', '>', DB::raw("current_date - interval '3 years'")];
                        break;
                    case 'PNE':
                        $whereClauses[] = ['servidors.pne', 'S'];
                        break;
                    case 'Sub Júdice':
                        $whereClauses[] = ['servidors.classificacao', 'S'];
                        break;
                    case 'Com Punição':
                        $whereClauses[] = ['servidors.punicoes', 'not ilike', '%'];
                        $whereClauses[] = ['char_length(servidors.punicoes)', '>', 3];
                        break;
                    /*case 'Chefe Titular':
                        $whereClauses[] = ['servidors.titular_interino_id', '!=', null];
                        $whereClauses[] = ['servidors.chefe_cartorio_interino_id', '!=', null];
                        break;
                    case 'Chefe Interino':
                        $whereClauses[] = ['servidors.titular_interino_id', '!=', null];
                        $whereClauses[] = ['servidors.chefe_cartorio_interino_id', '!=', null];
                        break;*/
                    case 'Policial':
                        $whereClauses[] = ['servidors.funcao', 'ilike', '%DELEGAD%'];
                        $whereClauses[] = ['servidors.funcao', 'ilike', '%ESCR%'];
                        $whereClauses[] = ['servidors.funcao', 'ilike', '%PAPIL%'];
                        $whereClauses[] = ['servidors.funcao', 'ilike', '%DACT%'];
                        $whereClauses[] = ['servidors.funcao', 'ilike', '%AGENTE%'];
                        $whereClauses[] = ['servidors.cargo', 'ilike', '%AGENTE%'];
                        break;
                    case 'Especial':
                        $whereClauses[] = ['servidors.cargo', 'ilike', '%ESPECIAL%'];
                        break;
                    case '1ª Classe':
                        $whereClauses[] = ['servidors.cargo', 'ilike', '%1ª%'];
                        break;
                    case '2ª Classe':
                        $whereClauses[] = ['servidors.cargo', 'ilike', '%2ª%'];
                        break;
                    case '3ª Classe':
                        $whereClauses[] = ['servidors.cargo', 'ilike', '%3ª%'];
                        break;
                    case 'Substituto':
                        $whereClauses[] = ['servidors.cargo', 'ilike', '%SUBSTITUTO%'];
                        break;
                    case 'Assessor A1':
                        $whereClauses[] = ['servidors.cargo', 'ilike', '%A1%'];
                        break;
                    case 'Assessor A2':
                        $whereClauses[] = ['servidors.cargo', 'ilike', '%A2%'];
                        break;
                    case 'Assessor A3':
                        $whereClauses[] = ['servidors.cargo', 'ilike', '%A3%'];
                        break;
                    case 'Assessor A4':
                        $whereClauses[] = ['servidors.cargo', 'ilike', '%A4%'];
                        break;
                    case 'Assessor A5':
                        $whereClauses[] = ['servidors.cargo', 'ilike', '%A5%'];
                        break;
                    case 'Assessor A6':
                        $whereClauses[] = ['servidors.cargo', 'ilike', '%A6%'];
                        break;
                    case 'Assessor A7':
                        $whereClauses[] = ['servidors.cargo', 'ilike', '%A7%'];
                        break;
                    case 'Assessor A8':
                        $whereClauses[] = ['servidors.cargo', 'ilike', '%A8%'];
                        break;
                    case 'Assessor A9':
                        $whereClauses[] = ['servidors.cargo', 'ilike', '%A9%'];
                        break;
                    case 'ADM SGI':
                        $whereClauses[] = ['servidors.administracao', 'SGI'];
                        break;
                    case 'ADM GERAL':
                        $whereClauses[] = ['servidors.administracao', 'GERAL'];
                        break;
                    case 'Restrição Arma':
                        $whereClauses[] = ['servidors.restricao_arma', true];
                        break;
                    case 'Restrição Médica':
                        $whereClauses[] = ['servidors.restricao_medica', true];
                        break;
                    case 'Restrição Judicial':
                        $whereClauses[] = ['servidors.restricao_judicial', true];
                        break;
                    case 'Lotação Externa':
                        $whereClauses[] = ['departamentos.hierarquia', 'ilike', '99.%'];
                        break;
                    case 'Lotação Executivo':
                        $whereClauses[] = ['departamentos.nome', 'ilike', 'EXECUTIVO %'];
                        break;
                    case 'Lotação Legislativo':
                        $whereClauses[] = ['departamentos.nome', 'ilike', 'PODER LEGISLATIVO %'];
                        break;
                    case 'Lotação Judiciário':
                        $whereClauses[] = ['departamentos.nome', 'PODER JUDICIÁRIO'];
                        break;
                    case 'Lotação Executivo Municipal':
                        $whereClauses[] = ['departamentos.nome', 'EXCUTIVO MUNICIPAL'];
                        break;
                    case 'Lotação Executivo Estadual':
                        $whereClauses[] = ['departamentos.nome', 'EXCUTIVO ESTADUAL'];
                        break;
                    case 'Lotação Executivo Federal':
                        $whereClauses[] = ['departamentos.nome', 'EXCUTIVO FEDERAL'];
                        break;
                    case 'Lotação Legislativo Municipal':
                        $whereClauses[] = ['departamentos.nome', 'PODER LEGISLATIVO MUNICIPAL'];
                        break;
                    case 'Lotação Legislativo Estadual':
                        $whereClauses[] = ['departamentos.nome', 'PODER LEGISLATIVO ESTADUAL'];
                        break;
                    case 'Lotação Legislativo Federal':
                        $whereClauses[] = ['departamentos.nome', 'PODER LEGISLATIVO FEDERAL'];
                        break;
                    default:
                        // Opção não reconhecida
                        break;
                }
            }
        }

        return $whereClauses;
    }

    public function listServidores(Request $req)
    {

        $query = null;

        //try{

        $data_tipo = $req->has('zcons_data_tipo') ? $req->get('zcons_data_tipo') : null;

        $xorder = "servidors.nome";
        $xwhere_data = '';
        if ($data_tipo == 'INICIO') {
            $xorder = 'servidors.dtai';
            $xwhere_data = 'servidors.dtai';
        }
        if ($data_tipo == 'FIM') {
            $xorder = 'servidors.dtaf';
            $xwhere_data = 'servidors.dtaf';
        }
        if ($data_tipo == 'ALTERACAO') {
            $xorder = 'servidors.updated_at';
            $xwhere_data = 'cast(servidors.updated_at as date)';
        }
        if ($data_tipo == 'CADASTRO') {
            $xorder = 'servidors.created_at';
            $xwhere_data = 'cast(servidors.created_at as date)';
        }
        if ($data_tipo == 'SEM_DATA') {
            $xorder = 'servidors.nome';
            $xwhere_data = '';
        }
        if ($data_tipo == 'ANIVERSARIO') {
            $xorder = 'servidors.dta_nascimento';
            $xwhere_data = 'servidors.dta_nascimento';
        }
        if ($data_tipo == 'DTA_NOMEACAO') {
            $xorder = 'servidors.dta_nomeacao';
            $xwhere_data = 'servidors.dta_nomeacao';
        }
        if ($data_tipo == 'DTA_POSSE') {
            $xorder = 'servidors.dta_posse';
            $xwhere_data = 'servidors.dta_posse';
        }


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
        $zcons_obs = $req->get('zcons_obs');
        if ($zcons_obs === null || $zcons_obs === 'undefined') {
            $zcons_obs = '';
        }
        $zcons_status = $req->get('zcons_status');
        if ($zcons_status === null || $zcons_status === 'undefined') {
            $zcons_status = '';
        }

        $zcons_disposicao = $req->get('zcons_disposicao');
        if ($zcons_disposicao === null || $zcons_disposicao === 'undefined') {
            $zcons_disposicao = '';
        }
        $zcons_dep_lotacao_id = $req->get('zcons_dep_lotacao_id');
        if ($zcons_dep_lotacao_id === null || $zcons_dep_lotacao_id === 'undefined') {
            $zcons_dep_lotacao_id = '';
        }
        $zcons_agrupador_lotacao_id = $req->get('zcons_agrupador_lotacao_id');
        if ($zcons_agrupador_lotacao_id === null || $zcons_agrupador_lotacao_id === 'undefined') {
            $zcons_agrupador_lotacao_id = '';
        }
        $zcons_administracao = $req->get('zcons_administracao');
        if ($zcons_administracao === null || $zcons_administracao === 'undefined') {
            $zcons_administracao = '';
        }
        $zids = $req->get('zids');
        if ($zids === null || $zids === 'undefined') {
            $zids = '';
        }

        $zcps = $req->get('zcps');
        if ($zcps === null || $zcps === 'undefined') {
            $zcps = '';
        }
        $zfiltros_adcionais = $req->get('zfiltros_adcionais');
        if ($zfiltros_adcionais === null || $zfiltros_adcionais === 'undefined') {
            $zfiltros_adcionais = '';
        }


        $zcons_servidor_classificacao = $req->get('zcons_servidor_classificacao');
        if ($zcons_servidor_classificacao === null || $zcons_servidor_classificacao === 'undefined') {
            $zcons_servidor_classificacao = '';
        }

        /*USADO NA TELA DE CADASTRO PARA RECUPERAR OS DADOS*/
        $zcons_cpf = $req->get('zcons_cpf');
        if ($zcons_cpf === null || $zcons_cpf === 'undefined') {
            $zcons_cpf = '';
        }

        //$filtrosArray = explode(', ', $filtros);



        $query = Servidor::select(
            'servidors.*',
            DB::raw("initcap(servidors.vinculo) as vinculo_desc"),
            DB::raw("origems.descricao as origem"),
            DB::raw("atribuicaos.descricao as atribuicao"),
            DB::raw("case servidors.status
                            when 'ATIVO' then 'ATIVO'
                                when 'FE' then 'FÉRIAS'
                                when 'LC' then 'LICENÇA'
                                when 'AM' then 'ATESTADO MÉDICO'
                                when 'LM' then 'LICENÇA MÉDICA'
                                when 'LG' then 'LICENÇA GALA'
                                when 'LP' then 'LICENÇA PATERNIDADE'
                                when 'LN' then 'LICENÇA MATERNIDADE'
                                when 'LL' then 'LICENÇA LUTO'
                                when 'LR' then 'LICENÇA PRÊMIO'
                            when 'AF' then 'AFASTADO'
                            when 'DE' then 'DESLIGADO'
                                when 'OM' then 'OMP NESTA DP'
                                when 'OE' then 'OMP OUTRA DP'
                                when 'INATIVO' then 'INATIVO'
                            end as status_desc"),
            DB::raw("case servidors.chefia
                            when 'NAO' then 'Não'
                                when 'SECAO' then 'Seção'
                                when 'DIVISAO' then 'Divisão'
                                when 'GERENTE' then 'Gerência'
                                when 'SUPERINTENDENTE' then 'Superintendente'
                            end as chefia_desc"),
            DB::raw("case servidors.classificacao
                            when 'DELEGADO' then 'Delegado'
                                when 'ESCRIVAO' then 'Escrivão'
                                when 'AGENTE' then 'Agente'
                                when 'PAPILOSCOPISTA' then 'Papiloscopista'
                                when 'ADMINISTRATIVO' then 'Assessor ADM'
                                when 'CAIXEGO' then 'Caixego'
                                when 'IQUEGO' then 'Iquego'
                                when 'METROBUS' then 'Metrobus'
                                when 'ESTAGIARIO' then 'Estagiário'
                                when 'DIGITADOR' then 'Digitador'
                                else 'Não Classificado'
                            end as classificacao_desc"),
            DB::raw("case when servidors.indicacao='PCGO' then 'PCGO' else 'Outra' end as indicacao_desc"),
            DB::raw("case when servidors.pne='S' then 'SIM' else 'NÃO' end as pne_desc"),
            DB::raw("case when servidors.sub_judice='S' then 'SIM' else 'NÃO' end as sub_judice_desc"),
            DB::raw(" case when servidors.classificacao='DELEGADO' or servidors.classificacao='ESCRIVAO' or servidors.classificacao='AGENTE' or servidors.classificacao='PAPILOSCOPISTA' then
                case when servidors.dta_nomeacao > current_date - interval '3 years' then 'S' else 'N' end
            else 'N' end
            as probatorio"),
            DB::raw(" case when servidors.classificacao='DELEGADO' or servidors.classificacao='ESCRIVAO' or servidors.classificacao='AGENTE' or servidors.classificacao='PAPILOSCOPISTA' then
                case when servidors.dta_nomeacao > current_date - interval '3 years' then 'SIM' else 'NÃO' end
            else 'NÃO' end
            as probatorio_desc"),
            DB::raw("TO_CHAR(servidors.dta_nascimento, 'DD/MM/YYYY') as dta_nascimento_br"),
            DB::raw("EXTRACT(YEAR FROM age(current_date, servidors.dta_nascimento)) as idade"),
            DB::raw("EXTRACT(YEAR FROM age(current_date, servidors.dta_posse)) as idade_posse"),
            DB::raw("EXTRACT(YEAR FROM age(current_date, servidors.dtai)) as idade_lotacao"),
            DB::raw("CASE WHEN EXTRACT(MONTH FROM servidors.dta_nascimento) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(DAY FROM servidors.dta_nascimento) = EXTRACT(DAY FROM CURRENT_DATE) THEN true ELSE false END AS aniversario_hoje"),
            DB::raw("case when servidors.dtai is null then '' else TO_CHAR(servidors.dtai, 'DD/MM/YYYY') end as dtai_br"),
            DB::raw("case when servidors.dta_nomeacao is null then '' else TO_CHAR(servidors.dta_nomeacao, 'DD/MM/YYYY') end as dta_nomeacao_br"),
            DB::raw("case when servidors.dta_inicio_lotacao is null then '' else TO_CHAR(servidors.dta_inicio_lotacao, 'DD/MM/YYYY') end as dta_inicio_lotacao_br"),
            DB::raw("TO_CHAR(servidors.created_at, 'DD/MM/YYYY HH:MI') as created_at_br"),
            DB::raw("case when servidors.updated_at is null then '' else TO_CHAR(servidors.updated_at, 'DD/MM/YYYY HH:MI') end as updated_at_br"),
            DB::raw("case when servidors.dtaf is null then '' else TO_CHAR(servidors.dtaf, 'DD/MM/YYYY') end as dtaf_br"),
            DB::raw("CASE WHEN servidors.dtaf IS NULL THEN '-' WHEN servidors.dtaf <= CURRENT_DATE AND servidors.vinculo IN ('ESTAGIARIO', 'TEMPORARIO') THEN 'x' ELSE '-' END AS temporario_espirou"),
            DB::raw("case when servidors.dta_posse is null then '' else TO_CHAR(servidors.dta_posse, 'DD/MM/YYYY') end as dta_posse_br"),
            DB::raw("departamentos.hierarquia as dep_hierarquia"),
            DB::raw("LEFT(LEFT(departamentos.hierarquia, LENGTH(departamentos.hierarquia) - 1), LENGTH(LEFT(departamentos.hierarquia, LENGTH(departamentos.hierarquia) - 1)) - POSITION('.' IN REVERSE(LEFT(departamentos.hierarquia, LENGTH(departamentos.hierarquia) - 1))))||'.' AS dep_hierarquia_pai"),
            DB::raw("departamentos.tipo as dep_tipo"),
            DB::raw("departamentos.especializacao as dep_especializacao"),
            DB::raw("coalesce(departamentos.municipio, '-') as dep_municipio"),
            DB::raw("departamentos.municipioid as dep_municipioid"),
            DB::raw("departamentos.telefone as dep_telefone"),
            DB::raw("departamentos.telefone2 as dep_telefone2"),
            DB::raw("departamentos.telefone3 as dep_telefone3"),
            DB::raw("departamentos.escala as dep_escala"),
            DB::raw("departamentos.titular_id"),
            DB::raw("serv_titular.nome as titular"),
            DB::raw("serv_titular.celular as titular_celular"),
            DB::raw("serv_titular.telefone as titular_telefone"),
            DB::raw("serv_titular.email as titular_email"),
            DB::raw("coalesce(departamentos.departamento_grupo_id, 999) as departamento_grupo_id"),
            DB::raw("coalesce(departamento_grupos.nome, 'Externo') as departamento_grupo"),
            DB::raw("string_to_array(substring(departamentos.hierarquia, 1, length(departamentos.hierarquia) - 1), '.')::int[] as hierarquia_ordenacao"),
            DB::raw("(select count(servidor_porta_arquivos.*) from servidor_porta_arquivos where servidor_porta_arquivos.servidor_id=servidors.id and servidor_porta_arquivos.excluido=false) as qtd_dossie"),
        )
            ->distinct()
            ->leftJoin('origems', 'origems.id', '=', 'servidors.origem_id')
            ->leftJoin('departamentos', 'servidors.lotacao_id', '=', 'departamentos.id')
            ->leftJoin('departamento_grupos', 'departamentos.departamento_grupo_id', '=', 'departamento_grupos.id')
            ->leftJoin('atribuicaos', 'atribuicaos.id', '=', 'servidors.atribuicao_id')
            ->leftJoin('servidors as serv_titular', 'serv_titular.id', '=', 'departamentos.titular_id');
            if (str_contains($zcons_filtro_or, 'Chefe Titular')||str_contains($zcons_filtro_and, 'Chefe Titular')) {
                $query->join('departamentos as dp_titular', 'dp_titular.titular_id', '=', 'servidors.id');
            }
            if (str_contains($zcons_filtro_or, 'Chefe Interino')||str_contains($zcons_filtro_and, 'Chefe Interino')) {
                $query->join('departamentos as dp_titular', 'dp_titular.titular_interino_id', '=', 'servidors.id');
            }
            /*if (str_contains($zcons_filtro_or, 'Chefe Responsável(Titular ou Interino)')||str_contains($zcons_filtro_and, 'Chefe Responsável(Titular ou Interino)')) {
                $query->join('departamentos as dp_titular', function ($join) {
                    $join->on('dp_titular.titular_interino_id', '=', 'servidors.id')
                        ->orWhere(function ($query) {
                            $query->on('dp_titular.titular_id', '=', 'servidors.id')
                                ->whereNull('dp_titular.titular_interino_id');
                        });
                });
            }*/

            $query->where(function ($query) use ($zcons_servidor_classificacao, $zcons_cidade_id, $zcps, $zids, $zfiltros_adcionais, $zcons_administracao, $zcons_cpf, $data_tipo, $xwhere_data, $dtai, $dtaiBR, $dtaf, $dtafBR, $zcons_filtro_and, $zcons_filtro_or, $zcons_obs, $zcons_status, $zcons_disposicao, $zcons_dep_lotacao_id, $zcons_agrupador_lotacao_id) {



                if (strpos($zcons_filtro_and, 'Deps. Desativados') !== false) {
                    $query->where('departamentos.status', false);
                } else {
                 //   $query->where('departamentos.status', true);
                }

                if (strlen($zcons_cpf) == 11) { //Filtros da Tela de cadastro
                    $query->Where('servidors.cpf', $zcons_cpf);
                } else { //Filtros da Tela de consulta


                    if ($zids != '') { //Filtro por ids
                        // Converta a string de IDs para um array usando explode
                        $idsArray = explode(',', $zids);

                        // Remova espaços em branco dos IDs no array
                        $idsArray = array_map('trim', $idsArray);

                        // Filtro usando WHERE IN
                        $query->whereIn('servidors.id', $idsArray);
                    } //Filtro por ids

                    if ($zcps != '') {
                        // Converta a string de CPFs para um array usando explode
                        $cpfsArray = explode(',', $zcps);

                        // Remova espaços em branco dos CPFs no array
                        $cpfsArray = array_map('trim', $cpfsArray);

                        // Filtro usando WHERE IN
                        $query->whereIn('servidors.cpf', $cpfsArray);
                    }

                    if ($zfiltros_adcionais === 'SEM_SERVIDORES') {
                        $query->whereNull('servidors.id');
                    }

                    if ($zcons_administracao != '') {
                        $query->Where('servidors.administracao', $zcons_administracao);
                    }

                    if ($zcons_cidade_id != '') {
                        $query->Where('departamentos.municipioid', $zcons_cidade_id);
                    }

                    if (!empty($zcons_servidor_classificacao)) {
                        switch ($zcons_servidor_classificacao) {
                            case 'SEM':
                                $query->where(function($query) {
                                    $query->where('servidors.classificacao', '')
                                        ->orWhereNull('servidors.classificacao');
                                });
                                break;

                            case 'POLICIAL':
                                $query->whereIn('servidors.classificacao', ['DELEGADO', 'ESCRIVAO', 'AGENTE', 'PAPILOSCOPISTA']);
                                break;

                            case 'NAOPOLICIAL':
                                $query->whereNotIn('servidors.classificacao', ['DELEGADO', 'ESCRIVAO', 'AGENTE', 'PAPILOSCOPISTA']);
                                break;

                            /*case 'DELEGADO_TITULAR':
                                $query->whereColumn('departamentos.titular_id', 'servidors.id')
                                    ->where('servidors.classificacao', $zcons_servidor_classificacao);
                                break;

                            case 'DELEGADO_INTERINO':
                                $query->whereColumn('departamentos.titular_interino_id', 'servidors.id')
                                    ->where('servidors.classificacao', $zcons_servidor_classificacao);
                                break;*/

                            default:
                                $query->where('servidors.classificacao', $zcons_servidor_classificacao);
                                break;
                        }
                    }



                    if ($zcons_dep_lotacao_id != '-1' && $zcons_dep_lotacao_id != '') {
                        if (strpos($zcons_dep_lotacao_id, '.') !== false) {
                            $query->Where('departamentos.hierarquia', 'ilike', $zcons_dep_lotacao_id . '%');
                        } else {
                            // Caso contrário, filtrar pelo lotacao_id
                            $query->where('servidors.lotacao_id', $zcons_dep_lotacao_id);
                        }
                    }


                    if ($zcons_agrupador_lotacao_id != '-1') {
                        if ($zcons_agrupador_lotacao_id != '') {
                            $query->Where('departamentos.departamento_grupo_id', $zcons_agrupador_lotacao_id);
                        }
                    }


                    if ($data_tipo == 'ANIVERSARIO') {
                        /*$dtaiMonth = date('m', strtotime($dtai));
                                    $dtafMonth = date('m', strtotime($dtaf));
                                    $dtaiDay = date('d', strtotime($dtai));
                                    $dtafDay = date('d', strtotime($dtaf));*/
                        $xdtai = explode('/', $dtaiBR);
                        $xdtaf = explode('/', $dtafBR);

                        $query->whereRaw("EXTRACT(MONTH FROM servidors.dta_nascimento) BETWEEN ? AND ?", [$xdtai[0], $xdtaf[0]])
                            ->whereRaw("EXTRACT(DAY FROM servidors.dta_nascimento) BETWEEN ? AND ?", [$xdtai[1], $xdtaf[1]]);
                    } else {
                        if (($xwhere_data != '')&&($dtai!='')) {
                            $query->Where(function ($query) use ($xwhere_data, $dtai, $dtaf) {
                                $query->whereRaw("$xwhere_data between ? and ?", [$dtai, $dtaf]);
                            });
                        }
                    }

                    if ($zcons_status != '-') {
                        if ($zcons_status != 'TODOS') {
                            if ($zcons_status == 'TODOS_ATIVOS') {
                                $query->where('servidors.status', '!=', 'INATIVO');
                            } else {
                                if (str_starts_with($zcons_status, 'X')) {

                                    $query->where('servidors.status', '!=', 'ATIVO');

                                    switch ($zcons_status) {
                                        case 'XAPOSENTADORIA':
                                            $query->Where('servidors.situacao', 'ilike', 'APOSENTADORIA%');
                                            break;
                                        case 'XDEMISSAO':
                                            $query->Where('servidors.situacao', 'ilike', 'DEMISS%')
                                                ->Where('servidors.situacao', 'ilike', 'EXONERA%');
                                            break;
                                        case 'XFALECIMENTO':
                                            $query->Where('servidors.situacao', 'ilike', 'FALECIM%');
                                            break;
                                        case 'XRESCISAO':
                                            $query->Where('servidors.situacao', 'ilike', 'RESCIS%');
                                            break;
                                        case 'XCASSACAO':
                                            $query->Where('servidors.situacao', 'ilike', 'CASSA%');
                                            break;
                                        case 'XOUTROS':
                                            $query->Where('servidors.situacao', 'not ilike', 'APOSENTADORIA%')
                                                    ->Where('servidors.situacao', 'not ilike', 'DEMISS%')
                                                    ->Where('servidors.situacao', 'not ilike', 'EXONERA%')
                                                    ->Where('servidors.situacao', 'not ilike', 'RESCIS%')
                                                    ->Where('servidors.situacao', 'not ilike', 'FALECIM%')
                                                    ->Where('servidors.situacao', 'not ilike', 'INATIVO')
                                                    ->Where('servidors.situacao', 'not ilike', 'CASSA%');
                                            break;
                                    }

                                } else {
                                    $query->Where('servidors.status', $zcons_status);
                                }
                            }
                        }//<> TODOS
                    }// <> -

                    if ($zcons_disposicao != '-') {
                        $query->Where('servidors.disposicao', $zcons_disposicao);
                    }


                    if( (str_contains($zcons_filtro_or, 'Biometrico')) || (str_contains($zcons_filtro_and, 'Biometrico')) ) {
                        $query->whereNotIn('servidors.cpf', ['54885957168', '43898831191', '96682108168', '43452370178', '50957376120', '51721449191', '00218342292', '37116851100', '06025595100', '34119825191', '26822873104', '29050472168', '96388331149', '54753791149', '21285446100', '41502990130', '94810923134', '28265149115', '46332014172', '51524074691', '64870570106', '12107593817', '01613229801', '47109246191', '38072300172', '19329431100', '54906970168', '98759213191', '02480548139', '84380519104', '89864760106', '70576076104', '00425353109', '03474620142', '57576068191', '47014229168', '59024879191', '50875132120', '86691643100', '76086496153', '41255062134', '53832841172', '95880585115', '01513748130', '85383848134', '89101910159', '49209159187', '78283485172', '81892179172', '48630675187', '02214177108', '49989855153', '44114133100', '30037514172', '38643065153', '59765003153', '08770182191', '81134908172', '97064602172', '03239250144', '24702340182', '53223128115', '57291977134', '19316372100', '39454398172', '68913869420', '62728237620', '19170688168', '00678143102', '00650555600', '69795118153', '88798470159', '71324976187', '51721040110', '96682795149', '90611900106', '56518692120', '82429618168', '79590128149', '00909664650', '83847391100', '53708903153', '18154216817', '78286468104', '03360514173', '02398985164', '80422071153', '85384399104', '04300388601', '26131497877', '11983562866', '79308376100', '03280784174', '71623973104', '91112788115', '87728621149', '70619336153', '00683926136', '77691202172', '87416433134', '07119458612', '79394680144', '83180249315', '57739374687', '02415819158', '02549202767', '75834502172', '00850629101', '16334432800', '88956776172', '43901581120', '53232330100', '00809899183', '79068880144', '82253269115', '02888125650', '06674415650', '82588422187', '88026760115', '00214583163', '02085233163', '90730135187', '01917448163', '79496520120', '82429740125', '92269966104', '97749532153', '03919295188', '70058551166', '01275185177', '82935491149', '64506894120', '19845146104', '59936118120', '23217448120', '03398349196', '89359070149', '05225009786', '94943486134', '87632128115', '47817771120', '88193969120', '72783567172', '03523180155', '54715369168', '84160225187', '04047776190', '01095762176', '95536248120', '00397273193', '19287222886', '01262800617', '88595960178', '89509315168', '00194011160', '93715145153', '03774914117', '00001021214', '00646895141', '47987260100', '18267203168', '02148377183', '61304549100', '01103816101', '09170021643', '72886331104', '04454241686', '86351435153', '56537824168', '65135660534', '82176191153', '01894593103', '82098956134', '69906556153', '56669593104', '73133450115', '99479788187', '00242971199', '00937692107', '02397599155', '98082604115', '26404917840', '37616749100', '60296917168', '04303475700', '98455893168', '56599986153', '80038891115', '77820231149', '58864580182', '72412445168', '98935798649', '82857008104', '93504349115', '02942310138', '80426174100', '46773193168', '01061439135', '00768431140', '91168260191', '69925518172', '70848670159', '82857415168', '65630670182', '47986433191', '82459037104', '42538777100', '05101938467', '95774742172', '00551272155', '85160636153', '76639258153', '28412782801', '06442535681', '46365320159', '15552241134', '09516921191', '15082644149', '13124612760', '61171085168', '04759281134', '00423750100', '99095335100', '89361857134', '02559844133', '05359841702', '19002599153', '25256343149', '60750839104', '30218551134', '00825619580', '34122192153', '56267711820', '32843925134', '71643451120', '02498438114', '41426096100', '62446355153', '85420719134', '53052978187', '14396822839', '64133036115', '83407693168', '61349658120', '24354139120', '00130705179', '89517881134', '13198815134', '03870772190', '70759626120', '92193242100', '00406533156', '49386115115', '43048617604', '44311486120', '71446923134', '82254141104', '97076414104', '03760033679', '96533757172', '58596305149', '11845783204', '86505920153', '80222196149', '64419100125', '00005214181', '02511911175', '23903430153', '41340671115', '01224361130', '19173130125', '77573439172', '07919716780', '22803041120', '08035189603', '51709163100', '53369718120', '22835822100', '33466254191', '00751865192', '00916012158', '85959812134', '02226703128', '69468273172', '92716466149', '75506076134', '00725971193', '02586527135', '73673161172', '02038717150', '04514474177', '04289597173', '84389052187', '01434371190', '89805852172', '01823675174', '72773090144', '82755264187', '00011138106', '86133845104', '01556068166', '81111274568', '13610666790', '00574688188', '02789593183', '03035313555', '27655014833', '76327876153', '00919622186', '02074718195', '97983470134', '95338063115', '00611238110', '01770530118', '80675786134', '73362514120', '78195039200', '06058685907', '02680795105', '96290846191', '80621759104', '02702260101', '44965320182', '40268152187', '42414474149', '46329250120', '51247755134', '43117333134', '83121854615', '46450262168', '00751803162', '71309420297', '88768244134', '70085161187', '03231640130', '00784037159', '37487469115', '00866290184', '51555140106', '49270605191', '64869814153', '05681502104', '02353023843', '71809813115', '01886672105', '33230510178', '00493308105', '84017414168', '02850704105', '01968401121', '72312432153', '03937661107', '02185233513', '75933357120', '85961850110', '57809704168', '76730565187', '00515274135', '00210958170', '00106652184', '36447188149', '09446788153', '90453786120', '41759796115', '36995045149', '21333548168', '91986923134', '96257008115', '21261165810', '00585107106', '79515770149', '94049823187', '15286231187', '25984802287', '70182450104', '03392416169', '49862715120', '22914048149', '76913740115', '61170798187', '56353529104', '44051689115', '38199319100', '30310962153', '23474122134', '83409793100', '46375864100', '52989372172', '59669128153', '93571917120', '44115091134', '38310082134', '69504164153', '38962527120', '43546846168', '56143419191', '92544410159', '81790082153', '21355487153', '04308875153', '53833279168', '95654909134', '03561611613', '90712684115', '98171518168', '77074572187', '00526166142', '58501258172', '83777350168', '84870133172', '81766319149', '89530861168', '76577562172', '05089598100', '91988152100', '00266599133', '03627514637', '82939446172', '03255313155', '02323153102', '43579043153', '27672042149', '76639541149', '08012606712', '12307327134', '30011094168', '44401450191', '56520913120', '00155575619', '70633932191', '85738727134', '07548977611', '89697405115', '70472718134', '85968722134', '80556990110', '08315095706', '78445302191', '80181619172', '00545537177', '03603888170', '01401310192', '09283847644', '01428256113', '00035458143', '79473059272', '43860214187', '36015644168', '00829864105', '30492521115', '30380502100', '32158097884', '33314128134', '02197527100', '98187198591', '03310759113', '04544527139', '09530654723', '02479420140', '28861248187', '05063214606', '58984631191', '64722473153', '09056019473', '00249018144', '00668790350', '05616735191', '58942998100', '49383744120', '00887088104', '26743280100', '03602063100', '80340610182', '69113971115', '35582162100', '79231675168', '37784463120', '58512624191', '45079293187', '89031580163', '04558640129', '56712529115', '02797877152', '08263149614', '01169899129', '83978240149', '70012117102', '03307690140', '99451867104', '46152300100', '31959857134', '80232140120', '36068403149', '71416129120', '99738244153', '00494652101', '90088182134', '91522510397', '00511460104', '40943372100', '89729056153', '69396736104', '58663495153', '23567902172', '33284393153', '28846320182', '58647180178', '19202768153', '11845937104', '32689721104', '51231697172', '34849866115', '36997021115', '21653763191', '25199978187', '19509340120', '31566049172', '69622396100', '03407517114', '71029893187', '33573638104', '02603675168', '44082800115', '83725660115', '28339142100', '56071809134', '93519753120', '02433527198', '21640960880', '43823270168', '51790084172', '29506557187', '19802765104', '35975938104', '12443319709', '01869593111', '37073478187', '52118355149', '43215068168', '45632120163', '32318685134', '40279979134', '01010596128', '80012655104', '82867216168', '83084932115', '69617600153', '57749043187', '19462522120', '31745458115', '79405347187', '21785090100', '71678093149', '26987058172', '79767516115', '30654270104', '77962770163', '41410432149', '95555900104', '02811490116', '96810955100', '01607664194', '72775416187', '37218581153', '85294012120', '01492433160', '42321905115', '97410330600', '03333916169', '71634061187', '00896193152', '75229919191', '44088272153', '71234772191', '08710122788', '78911354104', '53837509168', '80216587549', '84113383120', '02812682159', '64607984191', '01745866124', '81026463149', '45418420178', '31217224840', '93439482120', '97675717104', '01312149183', '66435765120', '90920082149', '59025549187', '37134450104', '01695184181', '45478015172', '42515572200', '50749307153', '03723154107', '18418210982', '03570268101', '89698754172', '93107056120', '83313702104', '94701431168', '00668890142', '71932526153', '42585082172', '77266633168', '90055403115', '59134194134', '33109230100', '70934940134', '76735400100', '95066411100', '79521304120', '01385695170', '01243074183', '00552529150', '00586256156', '53019490120', '02708300148', '83005153134', '44920156120', '06777709878', '63354730110', '04877531190', '28891171115', '02963581696', '25907439807', '02461416117', '87654652100', '00331053160', '01897742150', '00284935166', '63583216172', '84945702187', '83982418100', '00741239124', '28759249153', '65625650144', '85856975120', '27842800120', '32349793168', '53286898104', '95793852115', '80054196191', '43435459115', '00035355174', '84768100163', '32676875191', '90056086172', '33136327187', '00431588112', '59747374153', '00876523157', '19616520130', '53265203115', '31943756104', '31518265120', '71312030178', '72082429172', '62053450134', '41617274100', '66986770197', '76372391104', '77434919191', '00680180109', '02149095149', '71684670187', '81095732153', '01054931046', '93588917187', '72054131172', '03927246697', '89552750130', '75838257172', '89552903149', '87898985168', '70622795104', '25389025172', '03054910164', '61307076149', '71804315168', '94251851153', '86760688104', '53319621149', '00736847162', '04320496140', '76434397100', '77855485104', '01166269175', '02991105160', '04989971116', '25908798819', '83566899100', '87657228172', '91814588191', '14747561153', '69908826115', '00722833199', '03139994141', '70973822104', '97455504187', '04292523150', '02720217174', '97635731149', '71384340149', '91543886191', '02863363166', '32350172830', '95563792153', '83134808153', '01627657118', '85014885187', '88846709187', '61721956115', '02201943192', '05542687954', '88697037115', '77586352100', '81493126172', '00319721108', '69798044134', '03702908609', '34994556172', '26177528104', '32055340182', '01993832190', '19842627187', '98797093149', '00250241161', '83942297191', '00926203100', '03213976148', '00231837135', '00419599576', '00461242176', '89249127120', '04171542162', '61165808153', '41850866104', '82382735104', '54756693172', '86930990191', '01132686105', '72319933115', '83135197115', '42725577187', '79409431115', '80980066115', '71304517187', '56509839172', '60701960159', '32015470182', '04739044625', '57906785134', '48488240104', '28835692822', '31865261831', '32680929187', '91933919191', '88039030110', '02759083136', '71489339191', '12906515744', '55331904149', '41843738104', '03519167174', '19537158187', '89821939104', '04771074194', '01772452122', '03751448110', '06435952108', '00801795176', '99253518120', '89560205153', '02399952286', '37326861838', '02484626100', '58887512191', '02230709127', '03640943112', '38783320172', '52136345168', '31943349134', '69198560182', '27692060100', '00714832332', '71432981234', '77588851104', '00493003185', '46731393134', '07773247684', '04329570149', '54758840130', '26028069191', '34891056134', '77589254134', '03281904114', '22839372134', '12574465172', '50830600191', '79611907168', '05097405617', '58672575172', '22206605830', '40880630663', '57597545134', '08610630153', '48549983187', '10150439172', '43446060197', '35858028187', '11831014149', '46361499120', '36071749115', '43292569168', '51622793153', '83106715120', '55028993149', '98606964115', '39758176153', '81035632187', '43387705115', '27617661134', '98268740191', '73325554172', '93123213153', '78680565172', '03602357198', '68879520172', '86266870100', '85169897120', '80570550149', '99075873115', '24601365104', '63566044172', '04550457120', '06259993803', '00655215107', '90869354191', '01641776633', '98926829120', '95063390153', '96341157134', '94054088104', '01105105180', '02440844160', '06755686689', '01090833180', '85652075104', '79164293149', '53406826172', '89119711115', '98914219100', '70080496172', '03274368164', '04619192147', '00604833180', '04284420135', '70257892168', '87518112191', '89061071100', '00236253174', '62499599120', '01309115184', '01394956142', '83474994387', '87518163187', '33065136104', '03339958130', '69825211334', '26536137191', '57349894104', '55262791115', '83320482149', '49778145172', '00484491130', '77646711187', '21952337100', '01133611141', '19383584149', '47880449191', '41279042168', '51248956168', '00279526148', '25428691115', '01708311165', '89301439115', '37576860120', '79118500200', '58988203100', '00528856154', '26512882172', '02685093109', '37497812149', '96366117187', '76400069100', '00604191138', '61016748191', '17894255300', '28114515104', '03095621124', '36010979153', '87299372134', '78553105172', '04084270199', '31105513149', '08778566134', '25151320149', '54560365172', '83281436153', '03973372136', '02276826100', '07337103603', '39482880110', '01714127109', '71684573149', '19202712875', '83944982134', '69412456115', '48643084115', '05667531461', '98130811120', '76269272149', '26729806168', '40922901104', '26299933100', '11920120890', '97557340159', '00908656181', '03710313112', '16793811134', '83794824172', '77867041168', '32381921168', '57377332115', '42276101172', '26375451191', '81436564115', '85994626104', '30282985115', '02616587190', '02397883112', '02204805165', '29036500125', '02829707117', '06699677187', '51594366187', '14910837191', '71157727115', '63334143104', '70391731157', '04677719101', '03967432181', '41407741187', '80307400344', '00107897156', '50847414191', '04463609100', '32315112168', '62318160104', '12401943153', '12269930100', '03268491650', '04033450149', '05599486540', '53093054168', '50746278187', '99982790110', '52371425168', '00881647136', '19099660880', '28269322172', '34908170100', '02252292180', '73783242134', '00923004130', '36955264168', '78940990153', '12357227168', '16659414134', '38584972153', '01008855197', '35198427187', '17006120187', '46446907168', '84124547153', '84411546191', '01049768108', '89164490149', '02493447182', '03704295167', '01834871174', '72788291191', '30691893187', '39715957153', '96376600115', '98114530120', '04061235192', '16652312115', '01827788194', '00176137106', '06000560400', '37760858191', '28740300153', '36470384153', '36399620104', '41054270163', '64862283187', '05508519173', '97225258168', '32676794191', '30770742149', '63334488187', '12348830159', '36340790100', '56623259104', '36424340106', '33693420149', '13215213168', '61629782904', '25447360110', '61143286120', '14772442120', '96141654134', '32016450100', '29224632149', '84554550125', '19394942149', '30239010159', '01690315199', '04120943127', '00638303109', '04944279140', '00835845109', '02983872122', '01272185133', '04172988113', '64558029187', '81042744149', '13518216104', '41319753353', '11834587115', '29113636120', '11781637172', '02805610164', '78457149172', '13657410104', '55522513187', '50041177134', '01359967168', '75987066115', '13108972120', '90630920168', '27131262153', '79475019120', '30726603104', '05076500181', '80640435149', '02725108152', '01937098133', '01000350193', '77306473115', '71235620115', '05344365101', '03348517184', '97766275791', '00075080184', '81043686134', '07877766610', '95484132134', '31493475134', '39419304191', '47609427187', '01396357009', '93702892591', '72114193187', '43185347153', '60749482168', '28251750300', '21653607149', '23235039104', '12971456153', '01452835187', '00057814180', '99310538104', '05683045606', '02472399170', '58738444100', '59880848187', '80261639153', '98136151415', '32012624120', '04999635631', '27911560110', '92798357187', '85710105104', '04659448177', '07162316387', '78765056191', '88990567149', '39443612100', '56620985149', '19572751115', '02603128191', '23221909187', '24211583115', '83948708134', '13143930144', '23857838191', '37967371100', '60002158191', '16950640110', '53226518100', '48583766134', '00860860140', '43497870110', '30015057100', '03851152107', '85870447100', '85870463149', '85078719172', '29528208134', '31060030144', '23500921191', '27729370115', '70988986191', '41310160104', '19409648149', '07743203115', '03661750178', '01133733174', '04381067177', '95394028168', '04202748638', '41908970197', '86005065149', '54743826187', '82644675120', '27842592187', '86158600172', '61805793187', '00107615193', '03214487159', '03053235129', '03673729160', '63305445300', '71525297104', '00918335159', '03268944116', '91243505168', '00573351929', '11881716740', '95812725187', '95581090106', '00309884110', '00051029103', '07496758965', '01173174117', '00931036119', '03459968443', '76171930172', '00720961106', '43841112153', '36997412149', '76778894172', '32096682134', '96717831120', '54855373168', '73682837191', '00902377140', '61173096191', '74585533168', '58623795172', '61204315191', '27385671187', '41483685187', '01462231101', '16105370172', '08897441149', '98975439100', '69529620187', '86607049168', '99059509153', '95813608168', '00752385194', '65973461149', '00693678178', '94703914115', '04325047107', '83090576104', '03581884151', '83250603104', '73521558134', '03636412116', '49808850120', '82948585104', '82781532304', '77087682172', '00524738130', '86467409191', '02896068104', '00427093180', '85134180130', '00325649103', '76917916153', '00798267178', '80699944104', '03718397188', '00056372108', '41349601187', '02707507113', '40118207172', '15797210100', '14900264873', '03634095130', '32353065104', '04951109140', '02259718108', '27139611149', '98075730178', '70427100100', '00422833100', '03380057142', '05471872622', '69626235187', '01094139114', '70570388104', '79237312172', '01851797114', '03612402102', '89416040100', '03572681138', '04130240161', '00798791101', '01778670199', '00645340146', '79476910100', '84964812120', '81715110153', '02943916145', '70899495168', '54968267134', '53325389104', '85927600115', '69172781149', '83950699104', '69198268104', '01483698122', '81803176172', '05026031609', '58628134115', '69135010134', '38729709172', '73765210110', '90588452149', '88995330163', '01392556643', '99385279149', '85806170144', '02738884121', '02064033130', '86617486668', '83065172100', '71573526134', '70185018149', '09636013187', '24635740110', '23151005187', '80268536104', '02489824350', '86385160106', '81747047104', '03712910118', '03621353127', '00901048119', '33560382149', '55204783172', '69420270149', '88618625191', '59934352168', '00781646138', '59022639134', '71731423187', '02064107193', '03988819603', '82205191187', '00002310104', '58976060130', '43024556168', '59865652153', '30282560106', '63503050191', '46736077168', '76106861153', '02494026105', '00395774144', '84094222120', '00885190157', '89759699168', '03842951183', '00903149133', '01322437173', '04102160116', '03772146120', '01154293106', '85660744168', '02151744108', '13014714100', '90635159104', '72706210125', '83065687100', '02988074160', '83145761153', '92327052149', '01241864160', '02289339199', '06396482665', '05027220103', '03148461150', '01601677103', '03957466121', '06052433604', '03438700107', '95817778149', '93676778120', '63331810134', '89168917104', '80879675187', '84967226191', '61754714153', '80270778187', '04996258110', '77890779100', '88885755100', '52408892104', '82206457172', '30009642153', '00423768158', '89393252149', '93328095187', '90067703100', '01340779110', '44270100168', '89598814149', '88781151187', '81193840163', '01690622105', '92142923100', '90636350100', '34224394120', '48007757104', '58689222120', '07117567759', '11862358702', '80272215104', '02175104184', '01209700158', '19416407100', '83429530172', '26514796168', '78583810168', '04294854170', '16676092115', '80646514172', '62417290120', '30342295187', '90283481153', '32327579104', '63267780268', '04770466650', '02276774479', '02582633186', '48522074100', '78839211187', '11725480646', '59814179191', '12408042100', '30500745153', '01999515196', '95136100206', '32436513104', '19392559100', '54856540106', '02283236142', '84135042104', '81242417168', '60701510110', '04458880160', '09952237774', '91893682153', '07321667642', '16671066191', '26829029104', '70948690100', '55686346100', '30190614153', '23321199149', '00075991101', '00397791143', '95821465168', '63323966104', '10875806767', '62830732120', '76220923120', '00592931102', '58893539187', '99301601168', '03556179199', '51775352153', '63428075153', '80881920134', '70406782172', '66437822104', '58366903168', '79882501168', '92145736115', '85025844134', '86533126172', '91848571704', '52967298115', '45587787168', '75817055104', '53868820310', '80166792187', '34714740130', '47664410100', '78589274187', '26947072115', '42551153115', '27782474833', '48477710104', '01256937100', '63562863187', '02731170174', '38730286115', '81564295168', '70068860900', '40918807115', '35968710187', '76887863120', '46740988153', '01103959131', '02468396197', '89170709149', '14892421120', '02710725126', '02253825123', '71659404134', '33151407153', '21518548172', '31062687191', '38765438191', '63337584187', '31122647115', '85402397104', '02042344176', '31071864149', '16707672134', '69112835153', '76414744115', '27883053892', '02586123123', '78174341153', '88138240172', '03188260113', '58485171187', '02530927790', '63320932187', '00470696192', '00343669110', '53041178168', '23572876168', '47080531187', '48633135191', '00187102120', '15859215134', '50810634104', '78980780125', '92338879520', '40314243100', '03664181140', '33202281100', '34728600149', '84212284120', '19344406120', '91387205315', '91582393168', '50969412134', '77911636168', '04305237180', '70789959100', '02274285101', '03642796133', '71958070106', '00955565162', '34862884822', '31122833172', '62832166172', '96241047191', '99252392149', '98008820144', '70980080100', '62855905168', '29490707104', '42698014172', '44436610187', '43433863172', '71146881134', '40933482191', '97376817115', '30739365134', '40198650191', '36015156104', '01585960136', '04008665102', '04089252130', '21546960821', '65374363549', '33333955172', '08603456100', '25269909120', '35554363172', '11777010144', '60364882115', '98712357120', '80995136149', '29981859168', '92157220178', '88166619172', '03463892162', '07249121693', '02849333174', '64601994187', '80995209120', '94910812172', '00409126128', '69415412100', '02641962799', '90148240178', '00193664186', '00145839176', '16712617120', '01510876103', '28810856104', '81122217153', '06589450684', '01807123146', '71670190110', '90288734149', '26112132168', '93390521534', '89988442149', '46726870159', '09352724100', '30832527149', '14625679168', '41290623104', '50832026115', '02118927185', '16905512168', '66736927315', '30931703115', '29598621120', '59937360110', '89773829120', '70116784172', '03315905142', '02201014183', '00345042140', '23428740149', '87695383104', '60013478168', '51055147187', '08871694651', '73436453153', '02285101120', '02474704140', '84434546104', '02669987125', '01802334165', '51687852120', '00152093184', '20257528814', '01729269125', '38230550115', '86397370100', '05019258130', '92346294187', '58585575115', '03105618171', '02194469117', '02641378175', '01307526144', '01012490122', '03662669188', '03324081165', '02356500138', '00728457164', '23412020125', '13246240191', '34084320153', '82410810144', '76753425187', '38222396153', '27150461115', '41897269153', '26262878149', '69227756191', '88055175187', '80291910149', '31762395134', '16138279115', '00288822102', '30250099187', '30768837120', '10192212168', '54875420153', '35106875153', '43552331115', '59053062149', '63323540115', '45719918191', '43998127100', '23530278149', '00858689146', '62451499168', '04990781104', '82324808153', '00669346136', '80936253134', '87845342149', '18473911253', '76025942153', '05907438134', '29584167120', '02179973179', '21990972187', '38930480144', '82218609134', '40977056104', '01018333185', '14747855149', '24408883115', '46307109149', '00171402189', '24618381191', '03207238106', '36916218134', '39506215120', '56687451120', '05077505608', '79279023187', '89040350159', '01055028129', '76393925191', '70717460100', '51565870387', '82566941149', '93347189000', '84438070163', '98280805168', '86541501149', '03152738102', '70377383104', '70986827134', '03648465180', '03693178151', '01112337121', '33152284187', '05205085134', '82075891168', '26041537187', '52966542187', '01358403171', '73189065187', '09572546104', '96146486191', '02607320100', '34783130310', '68934858168', '58552430100', '21838976191', '00158248104', '76246744168', '13188046120', '14670364120', '27158446115', '34931902120', '01209766175', '52010813120', '41349040134', '51484145100', '43068260159', '82299951172', '75753243134', '60269340149', '06443067185', '04235463179', '04750737119', '22210217890', '33004862115', '02099878129', '73824771187', '02607884144', '02401865160', '01775861171', '01061204170', '93703813172', '03619880107', '18647391268', '94840296120', '11118902777', '37958823894', '95754482191', '01113047178', '00954436148', '71048910130', '02482141109', '00324511132', '07808665681', '02255838109', '08641213694', '85360872187', '02954223197', '98686763120', '00955154103', '30362242895', '06261694613', '04626046169', '01650195141', '01180640101', '01447991117', '01883790107', '96518022191', '92594794287', '01926503198', '03105715100', '00488805155', '00057361100', '02901917186', '03104135169', '02182330194', '01125704101', '38845776115', '26910233115', '52662497149', '02830224507', '03149219159', '10149902115', '27891151172', '34947493100', '09240977104', '01968019154', '94888175187', '84439866115', '01418277185', '03527137122', '00935002111', '53986270159', '03634413107', '15235769104', '56496591172', '02536291103', '97517127187', '01501826190', '77062191191', '85033430106', '61320293115', '88057690100', '09784209187', '39757820130', '03306108138', '03848769190', '33035365890', '91060796104', '89991036172', '46780505153', '25792855803', '02098046103', '86040243104', '83440496104', '01804697117', '01051082196', '71325905100', '58884742404', '02582016144', '87702940115', '59025387187', '72260130100', '00004469127', '00626935148', '87398990120', '01420035142', '02759573141', '89408764153', '01614914133', '83656766134', '36377236387', '35552344120', '02627577107', '08985198610', '62554034168', '34915680134', '27854826897', '50034499172', '83961593191', '88532100104', '34226087100', '72753480125', '71297880110', '00745319130', '57429154115', '88168654153', '05030522646', '02400546100', '58555641187', '02150492172', '19187920115', '49775570182', '27056724191', '15458458168', '57743312100', '77685032104', '82613265191', '79581145168', '04205587643', '76220982134', '94588520130', '89639332100', '30810498812', '07656539662', '00596153112', '39464334134', '89639570125', '70951586149', '79086764134', '73348341191', '00594448000', '87400162187', '71327797100', '01186528184', '81756496153', '69756538104', '66838517191', '83198822149', '99723964104', '73108413104', '87856719168', '93922361234', '96936614191', '00237037173', '03309302148', '89233050149', '36337951115', '53367294187', '91406056120', '01357020112', '76327337104', '70338620168', '00209338199', '46734392104', '30188067191', '86488686100', '34743600197', '76580598115', '57594139100', '72573660125', '80522262104', '79746586149', '60328444120', '07418232845', '00076857182', '57888272134', '30755341880', '05856655168', '77392809172', '81938942191', '77752287172', '50733150144', '29090431187', '02471317170', '57802254191', '37576755172', '33181462187', '28899563187', '60533641187', '99202395187', '34815830100', '37547801234', '08242526168', '84444380144', '55675212191', '99107414153', '01789645140', '87402777120', '05243293628', '40937194115', '83442898153', '06390054629', '43767052172', '42724090187', '46320750197', '66402255149', '34121080149', '39220761149', '81076339115', '03885245108', '05114843133', '02428192140', '34216910106', '00488246156', '08578124677', '30088550168', '45550301172', '09395814187', '36100943115', '37089099172', '79485960115', '36047368115', '73542750182', '30957109172', '00569255147', '86547470130', '73695564687', '01389492125', '50837265134', '50867830115', '00559361130', '86119303120', '99446200172', '03164867875', '76905853100', '41225473187', '62622587104', '00377661120', '78140889172', '51467577472', '03447549106', '38758377115', '84993740182', '21261563115', '35154160134', '88587924168', '85677329134', '26918544187', '03188294107', '06048993609', '63490951115', '35040408153', '95705570368', '53250788104', '55687466134', '90500369100', '46773720125', '83657991115', '05720583220', '32019769115', '78723191104', '45158908168', '71838384120', '50984888187', '29257115100', '37548107234', '88727866149', '70938342134', '75152126168', '02271335108', '00714499145', '02389682197', '34945237115', '70601135172', '01696164109', '02333230150', '60651547172', '83712321104', '25425442807', '94939870197', '00164050132', '57789550659', '86938959153', '93565887168', '66493200130', '00387808108', '91076790178', '85813125191', '06383834630', '89076389187', '95457275191', '11603225706', '90239660153', '08325048662', '00487523121', '24283630187', '00029280192', '01958978116', '83919066120', '71079297120', '02828044122', '02001786107', '29507697802', '03845848103', '73768405168', '00405963114', '03600504177', '95622454115', '87407582149', '00816703116', '01140061135', '00047121106', '04439052908', '07575083677', '71285253191', '01819493180', '03703078103', '92368158120', '70412731134', '04174907129', '29243755846', '89416082104', '93713290172', '95304932153', '00306379104', '02483994113', '06060465692', '02716147140', '00738268127', '04843377341', '95458662172', '01497290147', '00593489179', '71814477187', '30105331104', '43522840178', '96817470110', '04099631192', '38763460106', '59953152187', '47116609172', '31038280125', '30182751104', '28073347172', '34881778153', '37557335104', '37568990125', '82081484153', '95939164153', '94898510191', '29037371850', '61104167115', '58651667191', '00492056170', '12960349172', '19687702168', '51036533115', '28110730191', '48484040100', '51552639134', '49350951134', '03267582164', '79786677153', '00367529165', '01253463107', '33114579191', '59808462120', '02593510757', '28707885172', '78144060130', '75918641149', '01716459109', '57913331100', '33426961172', '02367407177', '83967354172', '01412689139', '01727816129', '85730572115', '02683824173', '00070977194', '00136240674', '83164162120', '01509619100', '84157070100', '04185223161', '93904770187', '11705202861', '72835532153', '33894329653', '63614910130', '01278230181', '01088965105', '65974883187', '33248923172', '02543093990', '33284407120', '62597256120', '26361990125', '02883944105', '50823604187', '51051605172', '02490712152', '89182634149', '77418441134', '87718324168', '78101093168', '73387720106', '60028987357', '01441420150', '01483956199', '00770541135', '77067037115', '19180977120', '19660081120', '12595950134', '09585770130', '16818202187', '82851107100', '64020746168', '47299444100', '70129754153', '02312769158', '02687352128', '69184470178', '89265564172', '01384662111', '01794695176', '75996189100', '21365903168', '42756367168', '31108075134', '97652695104', '48647241134', '29524580144', '82231540134', '88950174120', '00232983160', '01814545131', '61892491168', '77710410197', '80540104191', '05008265954', '06992864769', '37287672120', '43977626191', '77206592104', '38262193172', '84639202172', '34799478168', '95751440153', '76679543134', '61318132134', '73322547191', '64678962115', '22515674100', '61742376134', '58558829187', '58691464100', '61241660115', '88638227191', '03276437147', '00870997130', '00645493139', '45437041187', '59196530197', '31121837115', '95314334100', '45404062134', '63300079187', '56140720630', '01807131165', '33247536191', '37768441168', '57590320110', '31927076153', '79809812191', '15382492867', '26074974187', '77521773187', '79151892120', '34998195620', '04999504103', '80319300153', '05564721799', '37009150125', '65974573153', '77132688120', '88638561172', '66500419120', '84158395100', '89498542104', '02714297129', '03578504165', '04504235650', '42249023115', '22618236149', '95469443191', '78801699115', '79489249149', '22041704888', '41009266187', '05952886183', '11607149168', '19635435134', '24247448153', '27885747115', '29800498168', '21285446100', '03995437168', '85836680191', '46332014172', '23758023300', '56071558115', '15955540172', '78193532104', '02534247123', '78384141649', '59024879191', '02409644384', '06458184107', '03446758151', '06406894189', '35463520178', '48630675187', '02618406141', '04280585156', '70227541103', '84159537120', '02570294276', '97064602172', '08244855134', '69278270130', '19316372100', '39454398172', '19824645187', '19170688168', '04398995161', '78872324149', '05812052786', '65923197120', '86983083172', '93944110110', '79511139134', '69058970191', '18154216817', '82854556100', '00414128184', '01250492181', '08230378606', '07065660508', '00123711142', '94852197172', '90044045115', '64819868187', '46726683120', '83587268134', '96794356104', '36382035149', '33636877100', '71375198149', '86433130178', '03084478163', '88800407153', '06307619570', '76670660197', '01060107198', '79496520120', '74205161115', '04307527178', '07752361445', '12172627682', '09709871455', '92188591100', '16745981149', '27718115100', '23389583149', '29563674120', '03850825175', '34970240159', '03589473169', '50905139100', '72436042187', '95514821153', '04317868105', '05791511159', '03805822103', '02420253159', '02476181102', '04260107100', '75129647149', '04311711140', '75203030120', '88801411120', '05590995175', '05152570106', '03603887280', '29558700134', '03598509103', '93150954134', '04350862196', '05118410940', '70891338187', '13112513673', '05175797158', '10862261783', '04440069150', '02971993159', '04664029101', '25225262864', '80216382149', '04364924580', '14368973780', '07129890134', '07074747106', '05192159156', '05386674196', '10568378610', '01696704146', '13484125187', '01748078135', '02587126193', '02464520136', '40467207860', '05826548150', '01837967130', '15402221790', '02929421177', '92930271191', '81010869191', '03607915148', '23629495168', '47214813149', '05217558164', '02559342111', '21474692893', '90449134172', '05538380599', '03731762102', '88683028100', '78035554115', '02912768144', '00284633151', '70227439163', '01843530171', '09980638435', '04161944195', '01110045190', '38185938172', '23156279153', '02888105110', '98345320163', '02666742164', '02413347135', '03105053131', '69863040134', '02069758133', '75173620110', '52974898149', '04697437195', '00916423107', '03147143163', '71261958187', '02328086195', '26269716187', '08312107100', '76639258153', '19250878168', '16818199100', '26601079120', '13064010115', '19440790172', '15552241134', '26040395168', '54741831191', '08881065134', '11822604621', '14397244740', '19175043149', '13400266191', '43891039115', '23222611149', '69432791149', '81532636172', '00201135361', '78510180130', '64818551104', '13406825168', '03757211189', '02720095125', '52413616187', '49389165172', '64133036115', '24637025168', '03064622145', '70793104157', '60612169120', '26905353191', '16583728168', '53353145168', '37088130149', '01081696184', '43048617604', '82254141104', '01799714179', '03014871117', '07052620499', '70039013154', '04299347188', '03535726328', '00214976130', '06965381990', '08987914992', '05963220114', '75060060144', '01455807176', '22803041120', '02678263118', '02953113126', '38781514115', '33466254191', '05544787140', '05501498138', '70603037151', '08998020106', '35972192845', '02665546108', '02911394186', '01625439130', '06183861146', '03706406160', '75417987115', '06440319132', '04703911116', '04208263199', '70405017162', '02227239204', '04313085190', '94336334153', '04280311102', '05313983156', '00208527117', '01317860160', '16676503786', '75238802153', '70154590193', '02995095169', '00431875103', '70494558148', '03275907182', '90711920168', '04031729936', '01233811185', '54812712653', '03831993106', '02789593183', '02048831133', '03595178114', '05393908105', '09657024480', '06089883328', '05141790150', '88598918172', '05613739145', '03712341156', '00899560105', '71072411172', '92780490187', '03446019197', '05563570193', '06058685907', '02812199156', '00422439126', '05648168764', '05179347106', '04079814119', '03036287159', '83303545120', '06684537457', '73451983168', '41419367153', '00474166104', '42414474149', '43117333134', '41095049704', '07278416108', '89153235134', '00905258177', '18306276191', '08178089149', '10262016168', '84017414168', '47551248838', '02470323100', '09912675673', '04367629198', '13786777730', '03210284148', '00391986180', '70245398287', '44242299800', '01090904118', '05026005195', '02792928131', '02018743180', '70552657115', '63641437253', '05177044980', '70543173194', '23467908187', '39483096120', '48633690187', '13340010650', '04284484966', '28937112191', '02081980169', '13090936798', '00613828178', '84647540197', '00829980199', '91426480172', '97455512104', '06021747321', '06849500147', '35341911881', '00957511140', '14748835168', '81955413134', '00320083179', '07056641989', '37787250178', '43766510100', '38199319100', '32338112172', '63579189115', '14728354172', '85767921172', '89527194172', '04130695673', '96127139104', '04098839130', '26410311168', '34777563120', '25586149168', '04480094555', '78154286149', '04508268137', '03495648682', '02408876117', '70829575138', '77045130104', '54838622104', '53921224187', '01840091118', '00242182194', '06594347179', '00798395176', '21144621100', '12307327134', '04455639152', '70886856124', '00155575619', '13643289766', '42503442153', '04495072110', '02136226100', '72270411153', '00521428173', '03422087133', '05218204137', '91921619104', '85968722134', '99451638172', '02481114183', '58784519134', '04042572162', '02022210166', '95160140204', '00527618195', '85427071172', '04068061106', '05396618302', '01904912567', '65383036253', '03451290162', '95657797191', '00867366125', '06219406150', '06465213141', '33489017153', '97273139149', '00934870101', '30380502100', '08405580158', '42868882153', '01049481160', '03567881302', '03271308144', '00925421154', '88493164100', '03352658129', '82628858134', '02294413199', '03821545178', '04014224104', '07855506403', '02187678113', '05616735191', '00887088104', '04951110156', '78525659134', '50813307104', '00453919120', '36378216134', '32689829134', '37784463120', '03677254108', '00293964173', '02586146174', '01251397131', '75099500153', '01830691538', '13199927149', '00025176129', '76732983172', '71277897115', '03538300542', '01609586107', '28886410115', '03678009182', '04683697165', '27825990110', '08609837149', '34932011172', '21856656187', '23415096149', '32689721104', '34849866115', '15454355100', '40154289191', '02092969250', '03875243129', '04116338133', '71029893187', '02788087195', '15441859792', '02603675168', '09248161120', '05744298169', '51710021187', '12549878191', '64165280100', '93519753120', '41613490178', '36091430106', '28384172153', '52430472104', '87356139120', '95355758134', '43215068168', '34208739134', '09868502683', '83084932115', '45604371149', '58884564115', '39138810182', '21785090100', '79767516115', '70138433186', '70691206139', '77642201168', '30027136191', '00005075122', '10824430697', '07679780994', '42321905115', '80040535134', '02345090154', '51498677304', '05970777110', '80216587549', '05197707305', '88263916100', '82867771153', '05437026188', '31106560191', '94339015172', '32296452191', '72560509172', '19347812153', '12195413115', '90272323187', '03723154107', '71334874115', '29035287134', '78750253115', '01540623165', '49374753120', '90199570159', '04057601163', '05962512626', '54854652187', '16791137711', '21563977168', '53019490120', '71772880159', '33601240149', '02891828160', '15140630770', '00415089204', '01897742150', '04697710118', '05327134350', '30701554134', '04447789183', '02153587328', '03589449101', '24627127120', '46764690120', '33220328172', '82550352149', '04732189172', '16508009834', '23236779187', '32676875191', '90056086172', '18037780163', '46294023149', '87439158172', '04317537176', '01654595144', '41617274100', '95177841200', '24570779824', '00739862162', '61876933100', '34798307149', '10764414917', '51096676168', '01326265199', '81693540134', '01068262125', '64346994172', '02846932190', '81031238115', '02939117110', '04586498137', '57789819100', '78676363153', '27153991115', '99550261115', '05455968319', '69908826115', '02364143136', '12464009792', '04391520974', '03746839130', '75059444104', '04212565161', '01690585145', '03315662142', '04968414161', '08981605610', '00427013178', '03099500313', '04531300114', '70296983128', '53297296100', '72961996104', '05796653130', '00869544152', '71378138104', '07486695154', '02598385195', '04545784151', '03127986106', '83178856153', '00642642117', '57808465100', '05573380699', '02500433196', '85984663104', '03412304131', '34295607134', '43234857865', '83134808153', '05610682169', '75842971100', '61721956115', '01892736152', '70072743158', '92427065153', '34994556172', '26177528104', '33176817134', '73111236153', '19842627187', '90202481115', '02731360119', '76577554153', '13167945630', '18699634587', '41234561115', '85704270182', '89161440191', '06123563378', '07550578303', '60734078153', '02920691384', '03884210106', '52732460168', '00825293103', '93975937300', '16061179120', '06040477385', '28375882100', '49830180182', '32680929187', '91933919191', '56523289168', '02759083136', '00217721184', '01626933111', '71489339191', '90987330187', '07647877305', '19537158187', '07088251680', '02735266184', '05132431194', '04555581164', '06976701125', '75433672115', '62280910349', '05596797189', '14226746732', '08781599404', '70266227490', '07560801692', '70173801188', '03029953157', '75458926153', '05515941101', '13533342794', '75242753153', '05929227152', '04715956160', '04663930166', '38783320172', '90815076134', '85889126512', '54793955134', '04128813141', '70148275109', '06031975157', '34715916134', '62520148187', '09357513191', '09377042100', '08247880601', '13422634134', '63425548115', '80463037120', '35487208115', '86831267149', '70155058193', '43541097191', '40880630663', '57597545134', '30841232172', '03626396126', '31381898149', '49905155104', '57647020110', '00766475280', '03540919139', '04881867148', '02709304180', '09015282692', '92214762191', '34846026191', '03530479101', '38928507120', '14235192647', '10477139698', '04030570194', '99344696187', '13357433168', '06259993803', '34813039120', '64564754149', '02411066139', '22852506149', '06847105364', '12583308149', '02951054106', '04311547161', '70497424142', '62416480120', '01467504114', '02440844160', '03584906180', '02007409038', '03942650681', '01972662660', '07455040601', '03408678090', '05782437170', '04053612110', '75122570159', '18472850153', '03345673193', '03760337112', '86311522187', '95378286115', '98011898191', '03488823199', '03345898195', '06156668179', '03274368164', '71760008168', '89061071100', '19437625115', '23323302168', '31042112134', '08853595507', '11721841601', '86374079191', '01394956142', '96575743153', '99230780197', '01131750195', '77590627100', '26536137191', '55374395572', '36128899153', '04747129154', '70698145186', '00994013124', '19383584149', '21170215149', '95761390159', '21534934120', '04470676136', '12838401629', '70524616175', '71269789104', '01070044105', '02085770177', '03095621124', '09423385613', '03034990103', '02025214197', '03247223118', '50868756172', '92216617172', '03737745161', '73359807120', '04902497107', '33334684172', '70201032198', '41377184153', '83060766134', '00989014193', '02364145180', '04840465193', '03228279146', '02732497118', '06312582647', '02185683128', '69716455100', '04699999182', '13164148763', '82919763172', '05153022102', '04325949143', '55292151149', '06452961128', '04578438104', '52018016172', '00779049900', '38042614187', '05804526545', '01482563177', '70117467146', '75203049149', '75170116187', '04348980152', '75022010178', '08835397480', '75665581100', '06870863105', '75290316191', '04758988501', '06646157596', '91344808115', '06550617545', '06699677187', '01772801151', '05501260158', '13425650106', '04463609100', '05848541370', '70042265142', '62512510182', '05242186178', '52371425168', '28269322172', '72989572104', '73783242134', '56706570125', '35489189134', '29003261172', '55354246172', '16659414134', '19403038187', '01165656167', '01715184114', '97010332215', '11055121420', '82318000182', '01149323108', '41938275187', '13030183149', '21919941134', '24352551104', '02967044318', '03183691418', '09077367187', '02899160117', '47618035172', '33918341100', '26100886120', '04220278125', '02287507175', '06000560400', '02739711158', '36470384153', '03298262129', '04265056113', '04287470192', '05425353197', '03615518195', '11400546605', '11533157693', '74717022149', '02738159117', '03711106102', '04247281178', '10648332683', '31597548120', '03868643141', '01017834180', '03393744119', '71022180282', '37226312115', '30979404134', '03111040100', '18925570106', '34224629100', '37021907168', '70943721164', '02002001197', '32016450100', '11772743100', '01564553230', '85999580110', '04532215137', '02274883181', '90874986168', '08380777573', '23410604120', '00835845109', '09275530661', '10702267694', '13518216104', '70329380192', '03262491179', '27131262153', '30726603104', '60489641377', '31038034191', '72894423187', '06523909603', '03567069152', '06599934145', '88218112120', '05803147150', '05911106108', '05221257351', '07877766610', '95484132134', '42891833104', '82601631104', '33964541893', '05670993187', '08780770738', '13178024115', '08229260168', '03659717150', '06014191895', '09515720168', '17863465320', '01100157115', '16998090110', '26032139115', '40043363172', '04418226818', '99640600172', '32422075134', '16721101149', '19689950487', '52731642149', '11859740758', '47941790149', '04033710159', '37988794191', '13040499149', '16783263134', '07455805489', '32681038120', '46121218134', '98592610168', '21812810172', '39443612100', '32374666115', '36355186115', '37640585104', '37367811134', '59395982772', '02057164152', '05304423100', '07105517115', '15887456191', '21610304187', '41231341149', '14756668100', '05833639115', '23431598153', '89830750159', '43488870120', '97462861100', '22713328187', '85870463149', '31544819153', '00750724161', '19266782300', '86099388168', '04392768104', '07318424998', '08952390431', '04716273130', '01642961159', '02480423190', '02058572130', '34032635846', '03568497166', '70045915148', '70099668181', '72807180191', '02218546140', '01675223106', '01036757102', '12548992861', '57488290100', '69086630197', '80698840100', '43841112153', '71733329900', '96717831120', '63560135168', '12021164187', '73682837191', '47736550115', '14882140187', '02142570100', '79988067887', '36456993172', '00594392110', '04550333154', '01572284102', '02177511135', '03723570160', '01337023167', '70607504102', '01928966101', '03456969139', '02435815131', '03636412116', '16994616789', '15081498602', '05431091948', '70190659106', '70133386139', '01923936182', '03008707106', '87377241187', '04016399165', '95240284172', '03738106103', '00098336177', '02883216266', '02437175121', '01840128640', '00256934177', '82832080120', '70554250187', '03164495129', '34171959187', '41349601187', '54732948120', '02546424033', '33312001153', '04133337107', '94220212272', '04002896102', '18169051789', '93048319204', '01267325151', '11410459667', '35088278870', '50929550153', '83144455172', '00914098101', '03562386109', '05600450184', '16689238741', '82320152172', '13966784769', '05299444133', '00479275181', '03267749123', '02784837122', '96939044272', '70369060148', '71051907101', '02695192118', '05892865100', '03540911154', '75330229120', '59765623100', '03720599108', '03621311122', '19417063120', '05703552656', '72608846149', '87526697187', '86161008149', '77971949120', '44998856120', '38729709172', '73098574100', '04156438139', '06059983618', '86009923115', '03913291113', '02747454100', '92139221168', '14593400783', '03547705002', '03703399163', '01341287106', '09636013187', '02489824350', '02090186151', '41574398806', '03712910118', '11975279662', '87114828187', '04792736188', '02531159142', '33560382149', '35967595104', '71434526100', '00673215180', '59022639134', '49414658149', '03858842141', '04105933116', '46398660110', '34938672120', '13279748780', '88883310187', '11663852723', '71545093172', '09824690638', '28133870100', '03842951183', '02521923117', '05945307173', '00141696141', '64824373115', '03600379178', '03273755156', '02644008107', '02437664165', '27804550120', '12511030144', '04627451393', '02988074160', '06125042120', '70404402100', '13503923675', '02490240129', '03885761114', '46713452850', '44180665867', '75676702168', '03517090107', '70187497192', '04234388165', '10477094651', '05721351144', '14808000741', '05190472140', '05359312122', '04732037151', '03061792104', '03132183237', '08742639999', '06329111316', '06130932162', '11598703730', '02330942109', '00105897167', '02563936136', '70137782144', '04042571190', '96233818168', '01674716192', '06728504192', '00735141363', '49162888153', '01167635159', '91870178149', '89835905134', '01364265141', '05016455945', '71157751172', '10921542640', '05638289780', '40055450172', '51809320178', '33674426153', '04078249108', '92862276120', '42629543153', '03343373567', '04250515958', '46947418100', '44270100168', '83333673134', '02291546112', '02752716176', '13001752149', '03591764108', '71071369172', '77445333134', '08273056643', '06436827404', '95589376149', '08130779153', '01601833598', '30183308115', '87529351168', '26968029120', '15596923168', '69705623104', '07888258603', '51009803115', '12957028786', '09769808601', '84136073534', '42598230191', '13124491793', '04279545170', '09353640130', '03990524100', '06037996121', '03178301127', '95136100206', '05069755170', '02288735171', '34894624168', '14580673786', '44448589153', '45546886153', '75909944134', '02670937136', '04834573370', '11156504678', '05743310181', '02845043198', '45384592168', '26944626187', '16871405100', '13567055100', '46798439187', '30190614153', '23321199149', '95024263120', '63323966104', '75395355120', '16068665755', '61736686100', '50869655191', '74543490134', '03023704805', '73639290178', '34804161104', '08152931942', '80332889572', '80881920134', '03293636110', '79595723215', '51540975134', '85930784191', '03886048675', '26328259115', '61356212387', '80380409100', '02711347206', '27782474833', '02355761159', '58865071168', '37279793134', '07117482176', '40918807115', '76887863120', '11884619827', '57961492100', '35859334168', '43412360163', '75660636187', '02042344176', '06692583187', '20121431649', '89038410182', '02298323186', '88574741191', '01442479175', '06745999692', '01384860185', '00885485114', '00012743178', '70191761192', '04856863177', '00919858112', '26100630168', '43553370149', '14730129709', '59910496100', '36037532168', '26120828168', '27554139134', '09107408951', '07882232599', '04674973112', '01841889113', '01918971676', '33202281100', '04960797193', '97680958149', '42553229100', '19344406120', '19725582187', '06518127392', '05796426150', '03934559123', '00547814186', '02525386175', '95828591134', '03729918150', '04453806167', '02477959174', '00210449101', '02946568636', '98008820144', '48435619168', '04452424180', '21330441168', '44436610187', '37455354134', '77978188191', '99878070115', '34902716100', '36014877134', '02556941561', '01699878170', '05599863190', '12465924605', '02725574129', '00503484180', '70014894173', '03740830107', '05495953177', '05904772181', '13028149664', '06751301154', '10234364939', '06022140170', '15307149743', '60364882115', '22830006100', '29981859168', '15857280125', '84142367153', '04645778102', '03636310119', '04185825137', '89917774149', '43530800163', '00901309109', '03126817122', '16987446172', '04674402123', '85720143149', '70048174157', '81932030115', '11947097610', '70546143130', '04829218118', '03127906196', '02995954129', '06459389128', '10152491406', '11500142450', '81122217153', '01427537186', '03746648114', '12958623793', '26990695153', '05609798191', '01793203008', '70094553173', '02135655104', '06288580198', '30931703115', '04116280119', '04988953190', '08431030437', '09552566908', '01242528180', '04115167106', '02285101120', '02431624137', '76583880172', '02886071129', '20257528814', '01844767124', '02240055103', '41846435153', '92486550178', '95469931153', '07102292597', '31578799104', '90174550120', '00492465185', '70034219170', '01154039145', '70439448131', '08588239426', '01994100117', '06988155643', '70523525168', '02460039107', '75699540172', '03140816154', '70071522107', '70423104110', '03186879175', '33398913890', '05584635502', '02767115130', '05103252112', '00516223194', '02356500138', '02999169108', '73263478168', '13059114153', '30750539100', '32382987120', '32347120182', '02681517923', '38222396153', '14814730187', '49275186120', '16138279115', '01083685139', '75131226104', '30768837120', '00346136172', '43077897172', '33574278187', '43552331115', '03292331145', '78400180178', '11750502100', '00745521126', '98130625172', '01132723167', '84573740104', '59799668115', '73191612149', '11748990187', '38161648115', '08502295616', '12723827100', '23273704187', '32131674600', '30500257191', '34785132191', '86852523187', '00384634150', '10299779688', '04354580195', '10790154692', '06022751136', '69930902104', '73389765115', '08142542684', '95067892153', '65600479115', '01529173140', '03442291143', '87847981149', '02422197485', '99197138134', '02393047131', '00945095147', '03696737194', '99328534100', '99181991134', '01294064061', '89040422168', '24352330191', '39775810159', '15585988808', '56552963149', '00504945114', '02607479126', '74086987104', '70656797134', '57585164149', '96245000106', '03471058150', '00173324193', '70519353137', '25586343134', '04386088105', '46438521191', '10437725707', '19439458100', '00723120170', '26552582153', '40109127153', '19802820130', '04068125198', '66493706149', '02168060118', '11208451650', '02158356111', '09734010956', '05603973137', '70008101140', '02983431185', '06602073117', '03715654139', '22422919120', '05831865134', '42255740168', '10211073440', '32309325104', '04348736162', '75624214120', '02898710180', '06190911692', '00791882144', '05847292198', '52701727120', '06959003580', '00968335136', '02320039120', '04416608195', '02631948505', '01734017163', '03621190155', '02954223197', '71806946149', '30362242895', '01013825101', '70245850139', '03138715150', '02327404100', '07656765670', '00594758114', '05842922100', '02847748121', '94778680197', '03501190239', '44214803809', '89012453100', '06111578103', '12032126664', '38011147838', '02248376480', '95836896100', '26910233115', '03136070100', '03731506106', '99601125191', '70215797132', '01471691195', '00082603111', '10082814686', '70148229182', '69083835120', '58902783120', '64408639168', '12283027748', '21839000163', '04189024104', '70149179197', '01997913178', '05314552116', '03059048177', '78293235268', '03622780240', '11840218134', '00637496884', '60485256134', '39759040115', '16456023890', '79484182100', '73404411153', '04634342189', '90433084120', '88294129100', '46780505153', '03515105166', '01585285145', '01479254100', '05617641310', '05403434127', '01244397130', '02101902133', '03167344113', '70469701145', '02576552129', '09410421110', '02768359130', '05769734329', '26547302806', '87032813100', '53041259168', '11116751712', '01001317190', '81468369172', '77929810100', '01949975100', '57782369134', '68998082187', '06869104190', '03700512112', '05144003150', '70714665134', '00128340177', '00957285116', '80999123149', '58531475104', '03602369285', '36899852187', '00556788150', '01227264135', '02777305110', '01949777146', '09784512602', '82795398168', '72754478191', '08696316673', '01887221140', '04350258132', '81756496153', '03654658520', '01679202197', '03022022697', '01790728118', '60304472115', '02583604104', '84442077134', '36337951115', '53367294187', '01364578190', '16558057115', '37788965120', '16856279191', '80659705168', '05908681369', '08308110100', '11776017455', '02103329139', '95501142104', '04065843626', '07418232845', '03932713583', '79086977120', '02713991129', '69959315134', '05710959170', '06788953333', '78627060134', '00178580112', '03068634130', '29090431187', '42663474134', '00524210152', '42705819134', '52026752168', '89095693287', '37547801234', '01364605180', '76379760172', '26172046187', '18714102153', '28301846100', '05697667108', '19628706187', '01802206590', '05397165107', '38194139104', '80526209100', '03348329183', '02064092145', '06390054629', '01791157157', '61446533336', '43767052172', '00343028085', '11966621698', '01408674149', '00071182101', '04443341307', '03819173129', '07405644716', '27835740125', '45550301172', '04445848115', '30670071153', '16894413134', '27001857149', '24292826153', '19345577149', '30111803187', '55658938104', '29139198120', '30957109172', '04697392663', '33140464134', '60180986600', '30630672881', '03164867875', '69875596191', '95113029149', '95067973153', '14768011187', '36993328100', '82536872149', '13911383762', '00834531135', '35154160134', '37029991168', '92863256572', '04020825165', '82615403168', '95905480168', '62435558104', '59218177168', '59196610115', '09287595712', '64465934653', '43469329168', '03557907180', '16872177187', '02552793100', '04979637108', '04523244162', '04140662190', '03768046109', '89692039153', '75758679100', '17950240709', '70100290167', '91213967104', '13245191774', '83583319168', '75486822120', '01452235236', '03955843106', '70719193133', '02636205144', '02725701171', '03707477126', '14211814796', '91160170134', '03422843124', '03479853196', '08529584473', '05043242175', '05209338185', '03724370105', '01922449148', '95563512304', '70240336143', '04682994166', '00885900111', '03391733195', '05752347173', '02754795103', '04645347128', '05371693505', '04004025303', '10435480413', '05755706522', '01927891124', '04078435157', '03952965529', '05574824108', '03146564130', '01692956132', '01578373190', '02477782142', '04782277105', '70278099157', '02943454184', '12549510674', '04054215165', '01370341130', '05852460680', '04622364123', '04742757106', '71285253191', '92368158120', '47983280149', '70482655151', '04737975184', '32938181884', '39716001827', '05735395963', '02456147103', '01628142162', '01525728130', '85833983134', '09626453621', '40062649841', '02996498224', '03053980169', '11444036777', '02032220679', '38763460106', '29176212149', '37064096153', '30496403168', '52129098134', '43208231172', '23158352168', '05052999178', '33036489134', '39232166100', '00942127161', '48484040100', '01824459173', '70250062119', '46777431187', '49350951134', '57735697104', '02415988189', '00888340184', '02739495196', '06296760116', '37937235187', '02273050194', '77507207153', '04013652129', '04046440155', '10486452662', '00419875190', '06506843110', '06263828153', '33426961172', '05587523144', '02187904148', '01412689139', '70512105138', '89860985120', '48840438807', '10727470736', '04568139180', '00136240674', '02735703150', '01509619100', '81004060149', '00671534106', '03835720295', '02341289177', '04581886112', '05973842150', '06872096179', '07266335183', '05919818158', '03648963104', '02139598105', '01604799161', '87159490100', '33248923172', '33349576168', '24270407115', '35896892187', '32698780100', '02016133104', '02164839137', '01241750157', '60028987357', '00770541135', '80414370104', '01789282594', '91980771120', '43028888149', '41225210330', '04003371186', '73712329172', '83078703134', '02494173167', '89265564172', '04573003100', '42756367168', '34169075153', '85291889187', '42740096100', '56520000159', '82231540134', '55624960115', '25258400115', '01556841167', '06992864769', '38262193172', '10446941654', '48317152120', '72247258115', '02391513135', '03914516186', '36073873115', '84588071149', '00540879100', '03276437147', '01179770129', '66493277191', '95006435100', '39158640134', '45404062134', '58585656115', '06718906115', '11404290940', '05208627167', '13154605134', '41247965104', '00693231190', '06467047109', '81585063134', '45098174104', '04334019153', '48491233172', '04934326120', '29703581153', '26109379115', '21208476149', '26074974187', '33609080159', '04635090132', '29241456191', '56058284104', '12652802666', '09288021400', '83924760187', '70201763133', '70084415177', '01321248156', '03578504165', '02406414183', '17621064773', '50742264149']);
                    }else{


                        if (!empty($zcons_filtro_or)) {
                            $whereClausesOr = $this->buildWhereClauses($zcons_filtro_or);
                            $query->where(function ($query) use ($whereClausesOr) {
                                foreach ($whereClausesOr as $clause) {
                                    $query->orWhere(...$clause);
                                }
                            });
                        }

                        if (!empty($zcons_filtro_and)) {
                            $whereClausesAnd = $this->buildWhereClauses($zcons_filtro_and);
                            $query->where(function ($query) use ($whereClausesAnd) {
                                foreach ($whereClausesAnd as $clause) {
                                    $query->where(...$clause);
                                }
                            });
                        }
                    }

                    if ($zcons_obs != '') {
                        $query->where(function ($query) use ($zcons_obs) {
                            $query->orWhere('origems.descricao', 'ilike', '%' . strtoupper($zcons_obs) . '%')
                                ->orWhere('atribuicaos.descricao', 'ilike', '%' . strtoupper($zcons_obs) . '%')
                                //->orWhere('servidors.lotacao', 'ilike', '%' . strtoupper($zcons_obs) . '%')
                                //->orWhere('servidors.indicacao_obs', 'ilike', '%' . strtoupper($zcons_obs) . '%')
                                ->orWhere('servidors.nome', 'ilike', '%' . strtoupper($zcons_obs) . '%')
                                //->orWhere('servidors.funcao', 'ilike', '%' . strtoupper($zcons_obs) . '%')
                                //->orWhere('servidors.cargo', 'ilike', '%' . strtoupper($zcons_obs) . '%')
                                ->orWhere('servidors.cor_raca', 'ilike', '%' . strtoupper($zcons_obs) . '%')
                                ->orWhere('servidors.escolaridade', 'ilike', '%' . strtoupper($zcons_obs) . '%')
                                ->orWhere('servidors.especialidade', 'ilike', '%' . strtoupper($zcons_obs) . '%')
                                ->orWhere('servidors.estado_civil', 'ilike', '%' . strtoupper($zcons_obs) . '%')
                                ->orWhere('servidors.status_situacao', 'ilike', '%' . strtoupper($zcons_obs) . '%')

                                ->orWhere('servidors.classificacao', 'ilike', '%' . strtoupper($zcons_obs) . '%')
                                ->orWhere('servidors.municipio_lotacao', 'ilike', '%' . strtoupper($zcons_obs) . '%')
                                ->orWhere('servidors.matricula_funcional', 'ilike', '%' . strtoupper($zcons_obs) . '%')
                                ->orWhere('departamentos.municipio', 'ilike', '%' . strtoupper($zcons_obs) . '%');
                        });
                    }
                } //Filtros da Tela de consulta

            });


        if ($zorder === '') {
            $query->orderByRaw($xorder);
        }
        if ($zorder === 'HIERARQUIAeCARGOeSERVIDOR') {
            $query->orderByRaw("string_to_array(substring(departamentos.hierarquia, 1, length(departamentos.hierarquia) - 1), '.')::int[], servidors.cargo, servidors.nome");
        }
        if ($zorder === 'HIERARQUIAeSERVIDOR') {
            $query->orderByRaw("string_to_array(substring(departamentos.hierarquia, 1, length(departamentos.hierarquia) - 1), '.')::int[], servidors.nome");
        }
        if ($zorder === 'SERVIDOReDEPARTAMENTO') {
            $query->orderByRaw("servidors.nome, departamentos.nome");
        }

       // $query->limit(4200);





        $retorno = $query->get();

        // Executar a primeira consulta com limite de 4200 registros
          /*  $query_limit = clone $query;
                    $retorno1 = $query_limit->limit(4200)->get();

                    // Executar a segunda consulta com offset de 4200 e limite de 4200
                    $query_offset = clone $query;
                    $retorno2 = $query_offset->offset(4200)->limit(4200)->get();

                    // Combinar os dois resultados em um único array
                    $retorno = $retorno1->merge($retorno2);

                    // Se precisar de mais registros, continue com o próximo offset
                    $query_offset2 = clone $query;
                    $retorno3 = $query_offset2->offset(8400)->limit(4200)->get();

                    // Combinar o próximo conjunto de resultados
                    $retorno = $retorno->merge($retorno3);
        */

        return response()->json(['message' => '', 'sql' => $query->toSql(), 'retorno' => $retorno], 200); //, 'sql' => $query->toSql()




        /*return response()->json(['message' => 'Teste 7', 'retorno' => $query], 200);
        try {
            $retorno = $query->get();
            return response()->json(['message' => '', 'sql' => $query->toSql(), 'retorno' => $retorno], 200); //, 'sql' => $query->toSql()
        } catch (\Throwable $th) {
            return response()->json(['sql' => '', 'message' => 'Erro ao tentar buscar! ' . $th], 200); //$query->toSql()
        }*/
        /*
                foreach($retorno as $ret){
                    $dp = json_decode( Http::get(env('ENDERECO_LEGADOWS') . 'unidadePorId/'.$ret->dp_id.'?token=' . $req->header('Token')));
                    $ret->dp=$dp->nome;
                }
*/


        /*
       }catch(\Throwable $th){
            return response()->json(['message' => 'Erro ao tentar buscar! '.$th, 'sql' => $query->toSql()], 400);//, 'sql' => $query->toSql(),

       }*/
    }






    public function graficoOrigem(Request $req)
    {

        $query = null;

        try {
            //
            $query = Servidor::select(
                'origems.descricao as label',
                DB::raw("COUNT(distinct servidors.cpf) as qtd"),
                DB::raw("string_agg(distinct servidors.nome, ', ') as descricao")
            )
                ->leftJoin('origems', 'origems.id', '=', 'servidors.origem_id')
                ->whereNotIn('servidors.status', ['DE'])
                ->groupBy('origems.descricao');

            $retorno = $query->get();

            return response()->json($retorno, 200);
        } catch (\Throwable $th) {
            return response()->json(['sql' => '', 'message' => 'Erro ao tentar buscar! ' . $th], 400); //$query->toSql()

        }
    }


    public function graficoAtribuicao(Request $req)
    {

        $query = null;

        try {

            $query = Servidor::select(
                'atribuicaos.descricao as label',
                DB::raw("COUNT(distinct servidors.cpf) as qtd"),
                DB::raw("string_agg(distinct servidors.nome, ', ') as descricao")
            )
                ->leftJoin('atribuicaos', 'atribuicaos.id', '=', 'servidors.atribuicao_id')
                ->whereNotIn('servidors.status', ['DE'])
                ->groupBy('atribuicaos.descricao');

            $retorno = $query->get();

            return response()->json($retorno, 200);
        } catch (\Throwable $th) {
            return response()->json(['sql' => '', 'message' => 'Erro ao tentar buscar! ' . $th], 400); //$query->toSql()

        }
    }



    public function graficoDepartamento(Request $req)
    {

        $query = null;

        try {

            $query = Servidor::select(
                DB::raw("REPLACE(servidors.lotacao_sigla, '/DGPC', '') as label"),
                DB::raw("COUNT(distinct servidors.cpf) as qtd"),
                DB::raw("string_agg(distinct servidors.nome, ', ') as descricao")
            )
                ->whereNotIn('servidors.status', ['DE'])
                ->groupBy('servidors.lotacao_sigla');

            $retorno = $query->get();

            return response()->json($retorno, 200);
        } catch (\Throwable $th) {
            return response()->json(['sql' => '', 'message' => 'Erro ao tentar buscar! ' . $th], 400); //$query->toSql()

        }
    }



    public function graficoFuncao(Request $req)
    {

        $query = null;

        try {

            $query = Servidor::select(
                'servidors.funcao as label',
                DB::raw("COUNT(distinct servidors.cpf) as qtd"),
                DB::raw("string_agg(distinct servidors.nome, ', ') as descricao")
            )
                ->whereNotIn('servidors.status', ['DE'])
                ->groupBy('servidors.funcao');

            $retorno = $query->get();

            return response()->json($retorno, 200);
        } catch (\Throwable $th) {
            return response()->json(['sql' => '', 'message' => 'Erro ao tentar buscar! ' . $th], 400); //$query->toSql()

        }
    }




    public function graficoChefia(Request $req)
    {

        $query = null;

        try {

            $query = Servidor::select(
                DB::raw("case when servidors.chefia='SECAO' then 'Seção'
                 when servidors.chefia='DIVISAO' then 'Divisão'
                 when servidors.chefia='GERENTE' then 'Gerente'
                 when servidors.chefia='SUPERINTENDENTE' then 'Superintendente'
                 else 'NÃO' end as label"),
                DB::raw("COUNT(distinct servidors.cpf) as qtd"),
                DB::raw("string_agg(distinct servidors.nome, ', ') as descricao")
            )
                ->whereNotIn('servidors.status', ['DE'])
                ->groupBy('servidors.chefia');

            $retorno = $query->get();

            return response()->json($retorno, 200);
        } catch (\Throwable $th) {
            return response()->json(['sql' => '', 'message' => 'Erro ao tentar buscar! ' . $th], 400); //$query->toSql()

        }
    }






    public function graficoStatus(Request $req)
    {

        $query = null;

        try {

            $query = Servidor::select(
                DB::raw("case servidors.status
                            when 'ATIVO' then 'ATIVO'
                                when 'FE' then 'FÉRIAS'
                                when 'LC' then 'LICENÇA'
                                when 'AM' then 'ATESTADO MÉDICO'
                                when 'LM' then 'LICENÇA MÉDICA'
                                when 'LG' then 'LICENÇA GALA'
                                when 'LP' then 'LICENÇA PATERNIDADE'
                                when 'LN' then 'LICENÇA MATERNIDADE'
                                when 'LL' then 'LICENÇA LUTO'
                                when 'LR' then 'LICENÇA PRÊMIO'
                            when 'AF' then 'AFASTADO'
                            when 'DE' then 'DESLIGADO'
                            when 'INATIVO' then 'INATIVO'
                                when 'OM' then 'OMP NESTA DP'
                                when 'OE' then 'OMP OUTRA DP'
                            else 'OUTRO'
                            end as label"),
                DB::raw("COUNT(distinct servidors.cpf) as qtd"),
                DB::raw("string_agg(distinct servidors.nome, ', ') as descricao")
            )
                ->whereNotIn('servidors.status', ['DE'])
                ->groupBy('servidors.status');

            $retorno = $query->get();

            return response()->json($retorno, 200);
        } catch (\Throwable $th) {
            return response()->json(['sql' => '', 'message' => 'Erro ao tentar buscar! ' . $th], 400); //$query->toSql()

        }
    }


    public function graficoVinculo(Request $req)
    {

        $query = null;

        try {

            $query = Servidor::select(
                DB::raw("initcap(servidors.vinculo) as label"),
                DB::raw("COUNT(distinct servidors.cpf) as qtd"),
                DB::raw("string_agg(distinct servidors.nome, ', ') as descricao")
            )
                ->whereNotIn('servidors.status', ['DE'])
                ->groupBy('servidors.vinculo');

            $retorno = $query->get();

            return response()->json($retorno, 200);
        } catch (\Throwable $th) {
            return response()->json(['sql' => '', 'message' => 'Erro ao tentar buscar! ' . $th], 400); //$query->toSql()

        }
    }


    public function graficoIndicacao(Request $req)
    {

        $query = null;

        try {

            $query = Servidor::select(
                DB::raw("case when servidors.indicacao='PCGO' then 'PC-GO' else 'Outra' end as label"),
                DB::raw("COUNT(distinct servidors.cpf) as qtd"),
                DB::raw("string_agg(distinct servidors.nome, ', ') as descricao")
            )
                ->whereNotIn('servidors.status', ['DE'])
                ->groupBy('servidors.indicacao');

            $retorno = $query->get();

            return response()->json($retorno, 200);
        } catch (\Throwable $th) {
            return response()->json(['sql' => '', 'message' => 'Erro ao tentar buscar! ' . $th], 400); //$query->toSql()

        }
    }



    public function listAuditoriaServidor(Request $req)
    {
        $query = null;

        // Other code...

        //try {
        $xorder = '';

        $dtai = $req->has('dtai') ? $req->get('dtai') : null;
        if ($dtai === null || $dtai === 'undefined') {
            $dtai = '';
        } else {
            $dtai = Carbon::parse($dtai)->format('Y-m-d');
        }

        $dtaf = $req->has('dtaf') ? $req->get('dtaf') : null;

        if ($dtaf === null || $dtaf === 'undefined') {
            $dtaf = '';
        } else {
            $dtaf = Carbon::parse($dtaf)->addDay()->format('Y-m-d');
        }


        $zservidor_id = $req->has('zservidor_id') ? $req->get('zservidor_id') : null;

        if ($zservidor_id == '') {
            return response()->json(['message' => 'Servidor não encontrado!'], 400);
        }

        $query = ServidorAuditoria::select(
            'servidor_auditorias.*',
            DB::raw("TO_CHAR(servidor_auditorias.created_at, 'DD/MM/YYYY HH:MI') as dta_registro_br"),
            DB::raw("INITCAP(SPLIT_PART(servidor_auditorias.fun_cad, ' ', 1)) as fun_cad_abreviado"),
            DB::raw("INITCAP(SPLIT_PART(servidor_auditorias.descricao, '->', 1)) as descricao_abreviado")
        )
            ->where('servidor_auditorias.servidor_id', $zservidor_id)
            ->whereBetween('servidor_auditorias.created_at', [$dtai, $dtaf])
            ->orderBy('servidor_auditorias.created_at', 'desc')
            ->get();

        $retorno = $query; // No need for another get() call here

        return response()->json(['message' => '', 'retorno' => $retorno], 200);
        /*} catch (\Throwable $th) {
        return response()->json(['message' => 'Erro ao tentar buscar! ' . $th], 400);
    }*/
    }
}

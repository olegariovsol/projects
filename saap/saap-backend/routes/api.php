<?php

use App\Http\Middleware\ValidateSSO;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

/*Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});*/

Route::get('teste', function () {
    echo 'Teste';
});

//Middleware para checagem do token SSO
    Route::controller(\App\Http\Controllers\HistoricoTipoController::class)->group(function () {
        Route::get('list/historico_tipos_list', 'listHistoricoTipos');
    });


    Route::controller(\App\Http\Controllers\ServidorAposentadoriaController::class)->group(function () {
        Route::post('post/servidor_save', 'saveServidor');
        Route::get('list/servidor_anexos_consulta', 'listServidorAnexos');
        Route::get('list/servidor_get', 'getServidor');
        Route::get('list/servidor_aposentadoria_get', 'getServidorAposentadoria');
        Route::get('dashboard/genero', 'graficoGenero');
        Route::get('dashboard/regra', 'graficoRegra');
        Route::get('dashboard/cargo', 'graficoCargo');
        Route::get('dashboard/idade', 'graficoIdade');
        Route::get('dashboard/dta_requisicao', 'graficoDtaRequisicao');
    });

    Route::controller(\App\Http\Controllers\AfastamentoController::class)->group(function () {
        Route::post('post/sinc_afastamentos_sicad_observatorio_xls', 'sincServidoresAfastamentoXLS');
        Route::get('list/afastamento_servidor_consulta', 'listarAfastamentosServidor');
    });

    Route::controller(\App\Http\Controllers\ServidorHistoricoController::class)->group(function () {
        Route::post('post/servidor_historico_save', 'saveServidorHistorico');
        Route::get('list/servidor_historico_consulta', 'listServidorHistorico');
        Route::post('delete/servidor_historico_delete', 'deleteServidorHistorico');
    });

    Route::controller(\App\Http\Controllers\ServidorAtribuicaoController::class)->group(function () {
        Route::get('list/auditoria_servidor_list', 'listAuditoriaServidor');
        Route::post('post/servidor_save', 'saveServidor');//OBSERVATÓRIO
        Route::post('post/servidor_save_updados', 'ServidorUpDados');//SAAP
        Route::get('list/servidor_consulta', 'listServidores');
        /*Route::post('post/servidor_save_updados', function(){
                return response()->json(['message' => 'ok'], 200);
            });*/
        Route::get('dashboard/servidor_grafico_origem', 'graficoOrigem');
        Route::get('dashboard/servidor_grafico_atribuicao', 'graficoAtribuicao');
        Route::get('dashboard/servidor_grafico_departamento', 'graficoDepartamento');
        Route::get('dashboard/servidor_grafico_funcao', 'graficoFuncao');
        Route::get('dashboard/servidor_grafico_chefia', 'graficoChefia');
        Route::get('dashboard/servidor_grafico_status', 'graficoStatus');
        Route::get('dashboard/servidor_grafico_vinculo', 'graficoVinculo');
        Route::get('dashboard/servidor_grafico_indicacao', 'graficoIndicacao');
        Route::get('sinc/sinc_servidores_sicad_observatorio', 'sincServidoresSicadObservatorio');
        Route::post('post/sinc_servidores_sicad_observatorio_xls', 'sincServidoresSicadObservatorioXLS');
        Route::get('sinc/sinc_titular_departamento', 'sincTitularDepartamento');
    });
        Route::controller(\App\Http\Controllers\ImportacaoController::class)->group(function () {
        Route::get('list/importacao_vtrs_get', 'ImportacaoVtrsSinc');
        Route::post('post/configuracao_save', 'saveConfiguracao');
    });
    Route::controller(\App\Http\Controllers\ConfiguracaoController::class)->group(function () {
        Route::get('list/configuracao_get', 'getConfiguracao');
        Route::post('post/configuracao_save', 'saveConfiguracao');
    });
    Route::controller(\App\Http\Controllers\OrigemController::class)->group(function () {
        Route::get('list/origem_list', 'listOrigens');
        Route::post('post/origem_save', 'saveOrigem');
    });
    Route::controller(\App\Http\Controllers\AtribuicaoController::class)->group(function () {
        Route::get('list/atribuicao_list', 'listAtribuicaos');
        Route::post('post/atribuicao_save', 'saveAtribuicao');
    });
    Route::controller(\App\Http\Controllers\ViaturaController::class)->group(function () {
        Route::get('list/listVtrsSaap', 'listVtrsSaap');
        Route::post('post/saveViatura', 'saveViatura');
        Route::get('save/vtr_arquivo_save', 'saveVeiculoPortaArquivo');
        Route::get('list/vtr_arquivo_excluir', 'excluirVeiculoPortaArquivo');
        Route::get('list/vtr_arquivo_list', 'listarVeiculoPortaArquivos');
        Route::get('list/listAbastecimentos', 'listAbastecimentos');
        Route::get('list/infracoes', 'listInfracoes');
    });
    Route::controller(\App\Http\Controllers\CidadeController::class)->group(function () {
        Route::get('list/cidade_list', 'listCidades');
        Route::get('get/regional_save', 'saveRegional');
        Route::get('list/cidade_list_filtro', 'listCidadesFiltro');
    });
    Route::controller(\App\Http\Controllers\DepartamentoController::class)->group(function () {
        Route::get('list/dados_meu_departamento', 'GetDepartamentoDados');
        /*Route::get('list/dados_meu_departamento', function(){
                return response()->json(['message' => 'ok'], 200);
            });*/
        Route::get('list/auditoria_departamento_list', 'listAuditoriaDepartamento');
       // Route::get('list/departamento_list_id', 'listDepartamentosId');
        Route::get('list/departamento_list', 'listDepartamentos');
        Route::get('list/departamento_list_hierarquia', 'listDepartamentosComparacaoHierarquia');
        Route::get('list/departamento_list_geral', 'listDepartamentosGeral');
        /*Route::get('list/departamento_list_geral', function(){
                return response()->json(['message' => 'ok'], 200);
            });*/
        Route::get('list/departamento_list_saap', 'listDepartamentosSaap');
        Route::get('list/grupo_list', 'listGrupos');
        Route::get('list/grupo_list_saap', 'listGruposSaap');
        /*Route::get('list/grupo_list_saap', function(){
                return response()->json(['message' => 'ok'], 200);
            });*/
        Route::get('create/sinc_sicad', 'sincSicad');
        Route::post('create/table_estructure', 'sincCreate');
        Route::post('create/data_return', 'sincReturn');
        Route::post('post/grupo_save', 'GrupoSave');
        Route::post('post/departamento_save', 'DepartamentoSave');
        Route::get('get/departamento_save_porta_arquivo', 'saveDepartamentoPortaArquivo');
        Route::get('get/departamento_list_porta_arquivo', 'listarDepartamentoPortaArquivos');
        Route::get('get/departamento_excluir_porta_arquivo', 'excluirDepartamentoPortaArquivo');
        Route::get('list/processo_itens_pendentes', 'listarProcessoItensPendentes');
        Route::get('list/scobe_list_obra', 'ScobeListObra');
    });
    Route::controller(\App\Http\Controllers\ServidorPortaArquivoController::class)->group(function () {
        Route::get('get/servidor_list_porta_arquivo_pasta', 'listPortaArquivosPasta');
        Route::get('get/servidor_list_porta_arquivo', 'listarServidorPortaArquivos');
        Route::get('get/servidor_excluir_porta_arquivo', 'excluirServidorPortaArquivo');
        Route::get('get/servidor_save_porta_arquivo', 'saveServidorPortaArquivo');
        Route::get('get/servidor_abriu_porta_arquivo', 'abrirServidorPortaArquivo');
        Route::get('get/servidor_auditoria_porta_arquivo', 'listAuditoriaDossie');
    });


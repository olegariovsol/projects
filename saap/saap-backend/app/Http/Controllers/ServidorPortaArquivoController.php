<?php

namespace App\Http\Controllers;
use App\Models\ServidorPortaArquivoAuditoria;
use App\Models\ServidorPortaArquivoPasta;
use App\Models\ServidorPortaArquivo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class ServidorPortaArquivoController extends Controller
{

    public function listPortaArquivosPasta(){
        try{
            $retorno=ServidorPortaArquivoPasta::select('servidor_porta_arquivo_pastas.*')->orderBy('descricao')->get();
            return response()->json($retorno, 200);

        }catch(\Throwable $th){
                return response()->json(['message' => 'Erro ao tentar buscar Pasta de Arquivo de Dossie! '.$th], 400);
        }


    }

  public function saveServidorPortaArquivo(Request $req) {
        try {

                $servidor_id = $req->has('servidor_id') ? $req->get('servidor_id') : '';
                $arquivo_id = $req->has('arquivo_id') ? $req->get('arquivo_id') : '';
                $user_nome = $req->has('user_nome') ? $req->get('user_nome') : '';
                $fileType = $req->has('fileType') ? $req->get('fileType') : '';
                $legenda = $req->has('legenda') ? $req->get('legenda') : '';
                $numero_sei = $req->has('numero_sei') ? $req->get('numero_sei') : '';
                $servidor_porta_arquivo_pasta_id = $req->has('servidor_porta_arquivo_pasta_id') ? $req->get('servidor_porta_arquivo_pasta_id') : '';

                if($servidor_id==='' || $arquivo_id==='' || $user_nome==='' || $fileType==='' || $servidor_porta_arquivo_pasta_id===''){
                    return response()->json(['message' => 'Erro ao tentar gravar arquivo. Ids não informados.'], 400);
                }else{

                    $identificacaoArquivo = ServidorPortaArquivo::create([
                        'servidor_id' => $servidor_id,
                        'arquivo_id' => $arquivo_id,
                        'user_cad' => $user_nome,
                        'arquivo_tipo' => $fileType,
                        'legenda' => $legenda,
                        'sei_numero' => $numero_sei,
                        'pasta_id' => $servidor_porta_arquivo_pasta_id
                    ]);
                    $novoID = $identificacaoArquivo->id;
                    $message = 'Upload Realizado com Sucesso.';


                    ServidorPortaArquivoAuditoria::create([
                        'servidor_id' => $servidor_id,
                        'servidor_porta_arquivo_id' => $novoID,
                        'funcao' => 'Incluiu', // Alterou, Excluiu, Incluiu
                        'descricao' => '.'.$fileType.' '.$numero_sei.' '.$legenda,
                        'fun_cad' => $user_nome,
                    ]);

                    return response()->json(['message' => $message, 'id' => $novoID], 200);
                }

        } catch (\Throwable $th) {
            return response()->json(['message' => 'Erro ao tentar gravar arquivo. '.$th->getMessage()], 400);
        }
    }


    public function excluirServidorPortaArquivo(Request $req) {
        try {

                $servidor_id = $req->has('servidor_id') ? $req->get('servidor_id') : '';
                $arquivo_id = $req->has('arquivo_id') ? $req->get('arquivo_id') : '';
                $user_nome = $req->has('user_nome') ? $req->get('user_nome') : '';
                $pasta = $req->has('pasta') ? $req->get('pasta') : '';

                if($servidor_id==='' || $arquivo_id==='' || $user_nome===''){
                    return response()->json(['message' => 'Erro ao tentar gravar arquivo. Ids não informados.'], 400);
                }else{

                    ServidorPortaArquivo::where('servidor_id', $servidor_id)
                    ->where('id', $arquivo_id)
                    ->update([
                        'excluido' => true,
                        'user_exc' => $user_nome
                    ]);

                    $message = 'Alterado com Sucesso.';


                    ServidorPortaArquivoAuditoria::create([
                        'servidor_id' => $servidor_id,
                        'servidor_porta_arquivo_id' => $arquivo_id,
                        'funcao' => 'Excluiu', // Alterou, Excluiu, Incluiu
                        'descricao' => $pasta,
                        'fun_cad' => $user_nome,
                    ]);

                    return response()->json(['message' => $message], 200);
                }

        } catch (\Throwable $th) {
            return response()->json(['message' => 'Erro ao tentar gravar arquivo. '.$th->getMessage()], 400);
        }
    }

        public function abrirServidorPortaArquivo(Request $req) {
        try {

                $servidor_id = $req->has('servidor_id') ? $req->get('servidor_id') : '';
                $arquivo_id = $req->has('arquivo_id') ? $req->get('arquivo_id') : '';
                $user_nome = $req->has('user_nome') ? $req->get('user_nome') : '';
                $pasta = $req->has('pasta') ? $req->get('pasta') : '';

                if($servidor_id==='' || $arquivo_id==='' || $user_nome===''){
                    return response()->json(['message' => 'Erro ao tentar abrir arquivo. Ids não informados.'], 400);
                }else{

                    $message = 'Alterado com Sucesso.';


                    ServidorPortaArquivoAuditoria::create([
                        'servidor_id' => $servidor_id,
                        'servidor_porta_arquivo_id' => $arquivo_id,
                        'funcao' => 'Abriu', // Alterou, Excluiu, Incluiu
                        'descricao' => $pasta,
                        'fun_cad' => $user_nome,
                    ]);

                    return response()->json(['message' => $message], 200);
                }

        } catch (\Throwable $th) {
            return response()->json(['message' => 'Erro ao tentar gravar arquivo. '.$th->getMessage()], 400);
        }
    }

    public function listarServidorPortaArquivos(Request $req)
        {
            $servidor_id = $req->get('servidor_id', '');

            if ($servidor_id === '') {
                return response()->json(['message' => 'Sem servidor_id ??', 'retorno' => []], 200); // Retorno como array vazio
            }

            try {
                $query = ServidorPortaArquivo::select(
                    DB::raw("ROW_NUMBER() OVER () as arquivo_numero"),
                    DB::raw("servidor_porta_arquivos.legenda"),
                    DB::raw("servidor_porta_arquivos.sei_numero"),
                    DB::raw("servidor_porta_arquivos.pasta_id"),
                    DB::raw("servidor_porta_arquivos.excluido"),
                    DB::raw("servidor_porta_arquivo_pastas.descricao as pasta"),
                    'servidor_porta_arquivos.*',
                    DB::raw("'https://filews-h.ssp.go.gov.br/loadArquivo?id='||servidor_porta_arquivos.arquivo_id as url"),
                    DB::raw("case
                        when servidor_porta_arquivos.arquivo_tipo='IMAGEM' then 'FileImageOutlined'
                        when servidor_porta_arquivos.arquivo_tipo='PDF' then 'FilePdfOutlined'
                        when servidor_porta_arquivos.arquivo_tipo='DOC' or servidor_porta_arquivos.arquivo_tipo='DOCX' then 'FileWordOutlined'
                        when servidor_porta_arquivos.arquivo_tipo='XLS' or servidor_porta_arquivos.arquivo_tipo='XLSX' or servidor_porta_arquivos.arquivo_tipo='XLT' or servidor_porta_arquivos.arquivo_tipo='XLTX' then 'FileExcelOutlined'
                        else 'FileUnknownOutlined' end arquivo_tipo_icon"),
                    DB::raw("TO_CHAR(servidor_porta_arquivos.created_at, 'DD/MM/YYYY HH24:MI') as dta_upload_br")
                )
                ->Join('servidor_porta_arquivo_pastas', 'servidor_porta_arquivo_pastas.id', '=', 'servidor_porta_arquivos.pasta_id')
                ->where('servidor_porta_arquivos.excluido', false)
                ->where('servidor_porta_arquivos.servidor_id', $servidor_id)
                ->orderBy('servidor_porta_arquivo_pastas.descricao')
                ->orderBy('created_at');

                $retorno = $query->get();

                return response()->json(['message' => 'ok', 'retorno' => $retorno], 200);
            } catch (\Throwable $th) {
                return response()->json(['message' => 'Erro ao tentar buscar Arquivos! ' . $th, 'sql' => $query->toSql()], 400);
            }
        }


    public function listAuditoriaDossie(Request $req)//auditoria inclui/alterou/excluiu
    {
        $query = null;

        // Other code...

        //try {
        $xorder = '';

        $servidor_id = $req->has('servidor_id') ? $req->get('servidor_id') : null;

        if ($servidor_id == '') {
            return response()->json(['message' => 'Servidor não encontrado!'], 400);
        }

        $query = ServidorPortaArquivoAuditoria::select(
            'servidor_porta_arquivo_auditorias.*',
                    DB::raw("servidor_porta_arquivos.legenda"),
                    DB::raw("servidor_porta_arquivos.sei_numero"),
                    DB::raw("servidor_porta_arquivos.pasta_id"),
                    DB::raw("servidor_porta_arquivo_pastas.descricao as pasta"),
            DB::raw("TO_CHAR(servidor_porta_arquivo_auditorias.created_at, 'DD/MM/YYYY HH:MI') as dta_registro_br"),
            DB::raw("INITCAP(SPLIT_PART(servidor_porta_arquivo_auditorias.fun_cad, ' ', 1)) as fun_cad_abreviado"),
            DB::raw("INITCAP(SPLIT_PART(servidor_porta_arquivo_auditorias.descricao, '->', 1)) as descricao_abreviado")
        )
            ->leftJoin('servidor_porta_arquivos', 'servidor_porta_arquivos.id', '=', 'servidor_porta_arquivo_auditorias.servidor_porta_arquivo_id')
            ->leftJoin('servidor_porta_arquivo_pastas', 'servidor_porta_arquivo_pastas.id', '=', 'servidor_porta_arquivos.pasta_id')
            ->where('servidor_porta_arquivo_auditorias.servidor_id', $servidor_id)
            ->orderBy('servidor_porta_arquivo_auditorias.created_at', 'desc')
            ->get();

        $retorno = $query; // No need for another get() call here

        return response()->json(['message' => '', 'retorno' => $retorno], 200);
        /*} catch (\Throwable $th) {
        return response()->json(['message' => 'Erro ao tentar buscar! ' . $th], 400);
    }*/
    }

}

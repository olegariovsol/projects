<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('servidors', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->nullable();
            $table->integer('sicad_id')->nullable();
            $table->string('numero')->nullable()->comment('Número automático do anexo 1 do histórico funcional');
            $table->string('sei')->nullable();
            $table->string('historico_id')->nullable()->comment('Número do histórico funcional');
            $table->string('cpf');
            $table->string('nome');
            $table->string('genero');
            $table->string('cargo');
            $table->string('telefone')->nullable();
            $table->string('email')->nullable();
            $table->string('dp_lotacao')->nullable();
            $table->integer('dp_lotacao_id')->nullable();
            $table->date('dta_nascimento');
            $table->date('dta_inicio');
            $table->date('dta_requisicao');
            $table->string('idade_requisicao');
            $table->date('dta_ultima_lotacao')->nullable();
            $table->string('regra')->default('ANALISE')->comment('ANALISE - AGUARDANDO DEFINIÇÃO / 1035 - EC Nº 103, Art. 5º, CAPUT / 10353 - EC Nº 103, Art. 5º, §3º / 59 - LC Nº 59/2006');
            $table->integer('user_cad_id');
            $table->string('user_cad');
            $table->timestamps();
            $table->unique(['cpf']);
        });
    }

    /**
     * Reverse the migrations.

     */
    public function down(): void
    {
        //
    }
};

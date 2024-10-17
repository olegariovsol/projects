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
        Schema::create('historico_tipos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->nullable();
            $table->string('carreira')->comment('PCGO - Cargo Atual / CLT - Serviço CLT / PUB - Serviço Público sem Risco Policial / POL - Atividade de Risco Policial');
            $table->string('descricao');
            $table->integer('sinal');
            $table->string('label_dtai')->nullable();
            $table->string('label_dtaf')->nullable();
            $table->timestamps();
            $table->unique(['carreira', 'descricao']);
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

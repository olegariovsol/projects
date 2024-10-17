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
        Schema::create('servidor_historicos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->nullable();
            $table->integer('servidor_id');
            $table->string('servidor_cpf');
            $table->string('carreira')->comment('PCGO - Cargo Atual / CLT - Serviço CLT / PUB - Serviço Público sem Risco Policial / POL - Atividade de Risco Policial');
            $table->integer('historico_tipo_id');
            $table->date('dtai')->nullable();
            $table->date('dtaf')->nullable();
            $table->integer('dias')->nullable();
            $table->string('obs')->nullable();
            $table->integer('dias_regra')->nullable();
            $table->integer('user_cad_id');
            $table->string('user_cad');
            $table->timestamp('dta_cad')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamps();
        });
    }

    /**
     * CRIAR TRIGGER
     *
     CREATE FUNCTION servidor_historicos_sinc (
        )
        RETURNS trigger AS
        $body$
        BEGIN
            if((new.dtai is not null) and (new.dtaf is not null))then
                SELECT (
                (EXTRACT(YEAR FROM new.dtaf) - EXTRACT(YEAR FROM new.dtai)) * 365 +
                (EXTRACT(MONTH FROM new.dtaf) - EXTRACT(MONTH FROM new.dtai)) * 30 +
                EXTRACT(DAY FROM new.dtaf) - EXTRACT(DAY FROM new.dtai)
            ) into new.dias;

            if(new.historico_tipo_id=1)then
                SELECT (
                    (EXTRACT(YEAR FROM TO_DATE('30/12/2019', 'DD/MM/YYYY')) - EXTRACT(YEAR FROM new.dtai)) * 365 +
                    (EXTRACT(MONTH FROM TO_DATE('30/12/2019', 'DD/MM/YYYY')) - EXTRACT(MONTH FROM new.dtai)) * 30 +
                    EXTRACT(DAY FROM TO_DATE('30/12/2019', 'DD/MM/YYYY')) - EXTRACT(DAY FROM new.dtai)
                ) into new.dias_regra;
            end if;
            end if;

        return new;
        END;
        $body$
        LANGUAGE 'plpgsql'
        VOLATILE
        CALLED ON NULL INPUT
        SECURITY INVOKER
        PARALLEL UNSAFE;

        CREATE TRIGGER servidor_historicos_tr
        BEFORE INSERT OR UPDATE
        ON public.servidor_historicos

        FOR EACH ROW
        EXECUTE PROCEDURE servidor_historicos_sinc();
     */
    public function down(): void
    {
        //
    }
};

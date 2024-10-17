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



        DB::unprepared('
            CREATE FUNCTION update_servidor_numero (
                )
                RETURNS trigger AS
                $body$
                BEGIN


                                                -- Obtenha o último valor de numero para a data atual
                                                SELECT COALESCE(MAX(servidors.numero::integer), 0) + 1
                                                FROM public.servidors
                                                WHERE TO_CHAR(servidors.dta_requisicao, $$YYYY$$) = TO_CHAR(NEW.dta_requisicao, $$YYYY$$)
                                                into NEW.numero;

                                                if(NEW.numero = $$1$$)then
                                                    NEW.numero := TO_CHAR(NEW.dta_requisicao, $$YYYY$$)||LPAD($$1$$, 4, $$0$$);
                                                end if;

                                                return NEW;
                END;
                $body$
                LANGUAGE \'plpgsql\'
                VOLATILE
                CALLED ON NULL INPUT
                SECURITY INVOKER
                PARALLEL UNSAFE;

                CREATE TRIGGER servidors_tr
                BEFORE INSERT
                ON public.servidors
                FOR EACH ROW
                EXECUTE PROCEDURE public.update_servidor_numero();
        ');


         DB::unprepared('
            CREATE OR REPLACE FUNCTION public.calc_tempo (
                edias bigint
            )
            RETURNS text AS
            $body$
            DECLARE
                xanos integer;
                xmeses integer;
                xdias_restantes integer;
            BEGIN
                    xanos := $1 / 365;
                    xmeses := ($1 % 365) / 30;
                    xdias_restantes := ($1 % 365) % 30;
                    return $1||\' Dias, \'||xanos||\' Anos, \'||xmeses||\' Meses, \'||xdias_restantes||\' Dias\';
            END;
            $body$
            LANGUAGE \'plpgsql\'
            VOLATILE
            CALLED ON NULL INPUT
            SECURITY INVOKER
            COST 100;');


         DB::unprepared('
            CREATE OR REPLACE FUNCTION public.servidor_aposentadoria (
  ecpf text
)
RETURNS TABLE (
  snome text,
  scpf text,
  sgenero text,
  snascimento date,
  "1_pcgo_dias_trabalhados" text,
  "1_averbacao_dias" text,
  "1_desconto_dias" text,
  "1_total_dias" text,
  "1_pcgo_dias_trabalhados_hint" text,
  "1_2_pedagio_dias" text,
  "1_2_total_dias_com_pedagio" text,
  "1_2_requisito_tempo_pedagio" boolean,
  "1_2_data_pedagio_previsao" date,
  "1_2_requisito_tempo_pedagio_hint" text,
  "1_3_atividade_geral" boolean,
  "1_3_atividade_geral_hint" text,
  "1_3_atividade_geral_data" date,
  "1_3_atividade_geral_pedagio_data" date,
  "1_3_atividade_geral_previsao" date,
  "1_3_atividade_geral_previsao_afas_aver" date,
  "2_requisito_idade_risco" boolean,
  "2_1_requisito_idade_risco_tempo" text,
  "2_2_requisito_idade_risco_hint" text,
  "2_2_data_requisito_sem_ave_afa" date,
  "2_2_data_requisito" date,
  "3_idade_posse" integer,
  "3_idade" integer,
  "3_requisito_idade" boolean,
  "3_requisito_idade_hint" text,
  "3_data_idade_min" date,
  requisito_data_exercico boolean,
  requisito_data_exercico_hint text,
  "4_1_data_integralizacao" date,
  "4_1_conclusao" boolean,
  "4_2_tempo_total" text,
  teste text
) AS
$body$
DECLARE
  xlinha record;
  xlinha_pcgo_dias_trabalhados record;
  xlinha_historico record;
  xanos integer;
  xdias integer;
  xdias_pedagio integer;
  xdias_calc integer;
BEGIN

/*Trata os dados pessoais do servidor   */
  select s.cpf, s.nome,
  s.genero,
  case when s.genero=\'M\' then \'Masculino\' else \'Feminino\' end as genero_desc,
  s.dta_nascimento,
  case when s.genero=\'M\' THEN s.dta_nascimento + interval \'53 years\' ELSE s.dta_nascimento + interval\'52 years\' END as dta_niver2,
  s.dta_nascimento + interval \'55 years\' as dta_niver1,
  s.regra as regra_aposentadoria,
  case when s.genero=\'M\' then 7300 else 5475 end as anos_atividade_risco,
  case when s.genero=\'M\' then 30 else 25 end as anos_necessarios,
  case when s.genero=\'M\' then 10950 else 9125 end as dias_para_aposentar
  from servidors s
  where s.cpf=$1 into xlinha;

/*Trata os dados referentes ao tempo de carreira na PCGO*/
  select EXTRACT(YEAR FROM age(sh.dtaf, xlinha.dta_nascimento)) as idade,
  			EXTRACT(YEAR FROM age(sh.dtai, xlinha.dta_nascimento)) as idade_posse,
      case when cast(EXTRACT(YEAR FROM age(sh.dtaf, xlinha.dta_nascimento)) as INTEGER) >=55 then true else false end as idade_analise1,
      case when cast(EXTRACT(YEAR FROM age(sh.dtaf, xlinha.dta_nascimento)) as INTEGER) >= (case when xlinha.genero=\'M\' THEN 53 ELSE 52 END) then true else false end as idade_analise2,
      case when xlinha.genero=\'M\' THEN 53 ELSE 52 END as idade_minima2,

      sh.dias as pcgo_dias_regra1,

      sh.dias_regra as pcgo_dias_regras2_3,

      sh.dtaf as dataf,
      case when sh.dtai>cast(\'07/06/2017\' as date) then false else true end as requisito_data_exercicio,
      sh.dtai as datai
  from servidor_historicos sh
  join servidors s on s.id=sh.servidor_id
  where sh.carreira=\'PCGO\' and sh.historico_tipo_id=1 and s.cpf=$1
  into xlinha_pcgo_dias_trabalhados;



/*SOMATÓRIO DOS DEMAIS DIAS INFORMADOS*/
select
      sh.servidor_id,

      SUM(CASE WHEN sh.carreira=\'PCGO\' and sh.historico_tipo_id=1 THEN sh.dias ELSE 0 END) AS dias_pcgo_regras_1_ou_2,
      SUM(CASE WHEN sh.carreira=\'PCGO\' and sh.historico_tipo_id=1 THEN sh.dias_regra ELSE 0 END) AS dias_pcgo_regra3,

      SUM(CASE WHEN sh.carreira=\'PCGO\' and sh.historico_tipo_id in(2,3,4) THEN sh.dias ELSE 0 END) AS dias_averbacao_pcgo,
      SUM(CASE WHEN sh.carreira=\'PCGO\' and sh.historico_tipo_id in(5,6,7) THEN sh.dias ELSE 0 END) AS dias_desconto_pcgo,
      SUM(CASE WHEN sh.carreira=\'POL\' and sh.historico_tipo_id in(20,21,22,23) THEN sh.dias ELSE 0 END) AS dias_averbacao_atividade_risco,
      SUM(CASE WHEN sh.carreira=\'POL\' and sh.historico_tipo_id in(24,25,26) THEN sh.dias ELSE 0 END) AS dias_desconto_atividade_risco,
      SUM(CASE WHEN sh.carreira=\'PUB\' and sh.historico_tipo_id in(30,31,32,33) THEN sh.dias ELSE 0 END) AS dias_averbacao_publico,
      SUM(CASE WHEN sh.carreira=\'PUB\' and sh.historico_tipo_id in(34,35,36) THEN sh.dias ELSE 0 END) AS dias_desconto_publico,
      SUM(CASE WHEN sh.carreira=\'CLT\' and sh.historico_tipo_id in(40) THEN sh.dias ELSE 0 END) AS dias_averbacao_clt,


      SUM(CASE WHEN sh.historico_tipo_id in(20,21,22,23) THEN sh.dias ELSE 0 END) -
      SUM(CASE WHEN sh.historico_tipo_id in(24,25,26) THEN sh.dias ELSE 0 END) AS total_dias_atividade_risco_pol,

      (SUM(CASE WHEN sh.carreira=\'PCGO\' and sh.historico_tipo_id=1 THEN sh.dias ELSE 0 END) +
      SUM(CASE WHEN sh.historico_tipo_id in(2,3,4,20,21,22,23) THEN sh.dias ELSE 0 END)) -
      SUM(CASE WHEN sh.historico_tipo_id in(5,6,7,24,25,26) THEN sh.dias ELSE 0 END) AS total_dias_atividade_risco_pcgo_pol_regas_1_ou_2,

      (SUM(CASE WHEN sh.carreira=\'PCGO\' and sh.historico_tipo_id=1 THEN sh.dias_regra ELSE 0 END) +
      SUM(CASE WHEN sh.historico_tipo_id in(2,3,4,20,21,22,23) THEN sh.dias ELSE 0 END)) -
      SUM(CASE WHEN sh.historico_tipo_id in(5,6,7,24,25,26) THEN sh.dias ELSE 0 END) AS total_dias_atividade_risco_pcgo_pol_regra_3,

      SUM(CASE WHEN sh.historico_tipo_id in(2,3,4,20,21,22,23,30,31,32,33,40) THEN sh.dias ELSE 0 END) AS total_dias_trabalhados,
      SUM(CASE WHEN sh.historico_tipo_id in(20,21,22,23,30,31,32,33,40) THEN sh.dias ELSE 0 END) AS total_dias_averbados,
      SUM(CASE WHEN sh.historico_tipo_id in(5,6,7,24,25,26,34,35,36) THEN sh.dias ELSE 0 END) AS total_dias_descontados,
      SUM(CASE WHEN sh.historico_tipo_id in(2,3,4,20,21,22,23,30,31,32,33,40) THEN sh.dias ELSE 0 END) -
      SUM(CASE WHEN sh.historico_tipo_id in(5,6,7,24,25,26,34,35,36) THEN sh.dias ELSE 0 END) AS total_dias_calculado

  from servidor_historicos sh
  join servidors s on s.id=sh.servidor_id
  where s.cpf=$1
  group by sh.servidor_id
  into xlinha_historico;



  snome=xlinha.nome;
  scpf=xlinha.cpf;
  sgenero=xlinha.genero_desc;
  snascimento=xlinha.dta_nascimento;
  "3_idade_posse"=xlinha_pcgo_dias_trabalhados.idade_posse;

/******************REGRAS QUE SE APLICAM A TODAS********************/

/* /\/\/\/\/\/\/\>>>TEMPO AVERBADO E DESCONTADO<<</\/\/\/\/\/\/\ */
	select * from calc_tempo(xlinha_historico.total_dias_averbados) into "1_averbacao_dias";
    select * from calc_tempo(xlinha_historico.total_dias_descontados) into "1_desconto_dias";
/* /\/\/\/\/\/\/\>>>TEMPO AVERBADO E DESCONTADO<<</\/\/\/\/\/\/\ */



/* \/\/\/\/\/\/\/>>>REQUISITO DATA EXERCÍCIO REGRAS 1 E 2<<<\/\/\/\/\/\/\/ */
      requisito_data_exercico=xlinha_pcgo_dias_trabalhados.requisito_data_exercicio;
      if(xlinha_pcgo_dias_trabalhados.requisito_data_exercicio=true)then
          requisito_data_exercico_hint=\'Aplicável. Ingresso em \'||TO_CHAR(xlinha_pcgo_dias_trabalhados.datai, \'DD/MM/YYYY\')||\', Inferior há 06/07/2017\';
      else
          requisito_data_exercico_hint=\'Não Aplicável. Ingresso em \'||TO_CHAR(xlinha_pcgo_dias_trabalhados.datai, \'DD/MM/YYYY\')||\', Data Máxima até 06/07/2017\';
      end if;
/* /\/\/\/\/\/\/\>>>REQUISITO DATA EXERCÍCIO REGRAS 1 E 2<<</\/\/\/\/\/\/\ */

/******************REGRAS QUE SE APLICAM A TODAS********************/

  FOR i IN 1..3 LOOP

    	if(i<>1)then
          snome=\'\';
          scpf=\'\';
          sgenero=\'\';
          snascimento=null;
        end if;

        if(i=3)then
        	  /* \/\/\/\/\/\/\/>>>REQUISITO DATA EXERCÍCIO<<<\/\/\/\/\/\/\/ */
                  requisito_data_exercico=true;
                  requisito_data_exercico_hint=\'Não é Requisito Desta Regra\';
              /* /\/\/\/\/\/\/\>>>REQUISITO DATA EXERCÍCIO<<</\/\/\/\/\/\/\ */
        end if;


/*-*-*-*-*-*-*-*-*-*-*-->1ª REGRA EC Nº 103, Art. 5º, CAPUT<--*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/
        if(i=1)then--1ª REGRA EC Nº 103, Art. 5º, CAPUT


        /*\/\/\/\/\/\/\/>>>TEMPO EM ATIVIDADE DE RISCO MÍNIMO<<<\/\/\/\/\/\/\/ */
            select * from calc_tempo(xlinha_historico.total_dias_atividade_risco_pcgo_pol_regas_1_ou_2) into "2_1_requisito_idade_risco_tempo";
            xanos = xlinha_historico.total_dias_atividade_risco_pcgo_pol_regas_1_ou_2 / 365;


            SELECT xlinha_pcgo_dias_trabalhados.datai +((xlinha.anos_atividade_risco) || \' days\')::interval into "2_2_data_requisito_sem_ave_afa";

            if(xlinha_historico.total_dias_atividade_risco_pcgo_pol_regas_1_ou_2>=xlinha.anos_atividade_risco)then
                "2_requisito_idade_risco"=true;
                "2_2_requisito_idade_risco_hint"=\'Implementou. \'||xanos||\' Anos em Atividade de Risco dos \'||(xlinha.anos_atividade_risco/365)||\' Anos Exigidos\';
                SELECT xlinha_pcgo_dias_trabalhados.datai +((xlinha.anos_atividade_risco-xlinha_historico.total_dias_atividade_risco_pol) || \' days\')::interval into "2_2_data_requisito";
            else
                "2_requisito_idade_risco"=false;
                "2_2_requisito_idade_risco_hint"=\'NÃO Implementou. \'||xanos||\' Anos em Atividade de Risco dos \'||(xlinha.anos_atividade_risco/365)||\' Anos Exigidos\';

                xdias_calc=xlinha.anos_atividade_risco-xlinha_historico.total_dias_atividade_risco_pcgo_pol_regas_1_ou_2;

                SELECT xlinha_pcgo_dias_trabalhados.dataf +(xdias_calc || \' days\')::interval into "2_2_data_requisito";
            end if;
      /* /\/\/\/\/\/\/\>>>TEMPO EM ATIVIDADE DE RISCO MÍNIMO<<</\/\/\/\/\/\/\*/

		        /* \/\/\/\/\/\/\/>>>DIAS TRABALHADOS ATÉ DATA HISTÓRICO<<<\/\/\/\/\/\/\/ */
                	select * from calc_tempo(xlinha_pcgo_dias_trabalhados.pcgo_dias_regra1) into "1_pcgo_dias_trabalhados";
                    "1_pcgo_dias_trabalhados_hint"=\'Até dia \'||TO_CHAR(xlinha_pcgo_dias_trabalhados.dataf, \'DD/MM/YYYY\');
	            /* /\/\/\/\/\/\/\>>>DIAS TRABALHADOS ATÉ DATA HISTÓRICO<<</\/\/\/\/\/\/\ */

              /* \/\/\/\/\/\/\/>>>REQUISITO IDADE MÍNIMA<<<\/\/\/\/\/\/\/ */
                    "3_idade"=xlinha_pcgo_dias_trabalhados.idade;
                    "3_requisito_idade"=xlinha_pcgo_dias_trabalhados.idade_analise1;
                    "3_data_idade_min"=xlinha.dta_niver1;
                    if("3_requisito_idade"=true)then
                    	"3_requisito_idade_hint"="3_idade"||\' Anos de Idade na Data do Histórico. Implementou os 55 Anos de Idade\';
                    else
                    	"3_requisito_idade_hint"="3_idade"||\' Anos de Idade na Data do Histórico. NÃO Implementou os 55 Anos de Idade\';
                    end if;
              /* /\/\/\/\/\/\/\>>>REQUISITO IDADE MÍNIMA<<</\/\/\/\/\/\/\ */


              /* \/\/\/\/\/\/\/>>>REQUISITO PEDÁGIO<<<\/\/\/\/\/\/\/ */
                  "1_2_requisito_tempo_pedagio"=true;
                  "1_2_requisito_tempo_pedagio_hint"=\'Não é Requisito Desta Regra\';
                  "1_2_pedagio_dias"=0;
                  "1_3_atividade_geral_pedagio_data"=null;
                  "1_2_data_pedagio_previsao"=xlinha_pcgo_dias_trabalhados.dataf;
              /* /\/\/\/\/\/\/\>>>REQUISITO PEDÁGIO<<</\/\/\/\/\/\/\ */


              /* \/\/\/\/\/\/\/>>>REQUISITO ATIVIDADE GERAL<<<\/\/\/\/\/\/\/ */
                  xdias=xlinha_historico.total_dias_calculado+xlinha_pcgo_dias_trabalhados.pcgo_dias_regra1;
    			  select * from calc_tempo(xdias) into "1_total_dias";
                  "1_2_total_dias_com_pedagio"="1_total_dias";

                 -- teste=xlinha_pcgo_dias_trabalhados.datai ||\'((\'||xlinha.anos_necessarios||\'*365)-\'||xlinha_historico.total_dias_calculado||\')\';

                  SELECT xlinha_pcgo_dias_trabalhados.datai +(((xlinha.anos_necessarios*365)-xlinha_historico.total_dias_calculado) || \' days\')::interval into "1_3_atividade_geral_previsao_afas_aver";
                  SELECT xlinha_pcgo_dias_trabalhados.datai +((xlinha.anos_necessarios*365) || \' days\')::interval into "1_3_atividade_geral_previsao";

                  "1_3_atividade_geral_data"=xlinha_pcgo_dias_trabalhados.dataf;
                  xdias_calc=(xlinha.anos_necessarios*365)-xdias;
                  if(xdias_calc>0)then
	                  SELECT xlinha_pcgo_dias_trabalhados.dataf +(xdias_calc || \' days\')::interval into "1_3_atividade_geral_data";
                  end if;

                  xanos=xdias/365;
                  if(xanos>=xlinha.anos_necessarios)then
   		                "1_3_atividade_geral"=true;
                  		"1_3_atividade_geral_hint"=\'Implementou. \'||xanos||\' Anos de Contribuição dos \'||xlinha.anos_necessarios||\' Anos Esperados\';
                  else
	                    "1_3_atividade_geral"=false;
                  		"1_3_atividade_geral_hint"=\'NÃO Implementou. \'||xanos||\' Anos de Contribuição dos \'||xlinha.anos_necessarios||\' Anos Esperados. Falta \'||(xlinha.anos_necessarios-xanos)||\' Anos de contribuição\';
                  end if;
              /* /\/\/\/\/\/\/\>>>REQUISITO ATIVIDADE GERAL<<</\/\/\/\/\/\/\ */


        end if;--1ª REGRA EC Nº 103, Art. 5º, CAPUT






/*-*-*-*-*-*-*-*-*-*-*-->2ª EC Nº 103, Art. 5º, §3º<--*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/
        if(i=2)then

        /*\/\/\/\/\/\/\/>>>TEMPO EM ATIVIDADE DE RISCO MÍNIMO<<<\/\/\/\/\/\/\/ */
            select * from calc_tempo(xlinha_historico.total_dias_atividade_risco_pcgo_pol_regas_1_ou_2) into "2_1_requisito_idade_risco_tempo";
            xanos = xlinha_historico.total_dias_atividade_risco_pcgo_pol_regas_1_ou_2 / 365;


            SELECT xlinha_pcgo_dias_trabalhados.datai +((xlinha.anos_atividade_risco) || \' days\')::interval into "2_2_data_requisito_sem_ave_afa";

            if(xlinha_historico.total_dias_atividade_risco_pcgo_pol_regas_1_ou_2>=xlinha.anos_atividade_risco)then
                "2_requisito_idade_risco"=true;
                "2_2_requisito_idade_risco_hint"=\'Implementou. \'||xanos||\' Anos em Atividade de Risco dos \'||(xlinha.anos_atividade_risco/365)||\' Anos Exigidos\';
                SELECT xlinha_pcgo_dias_trabalhados.datai +((xlinha.anos_atividade_risco-xlinha_historico.total_dias_atividade_risco_pol) || \' days\')::interval into "2_2_data_requisito";
            else
                "2_requisito_idade_risco"=false;
                "2_2_requisito_idade_risco_hint"=\'NÃO Implementou. \'||xanos||\' Anos em Atividade de Risco dos \'||(xlinha.anos_atividade_risco/365)||\' Anos Exigidos\';

                xdias_calc=xlinha.anos_atividade_risco-xlinha_historico.total_dias_atividade_risco_pcgo_pol_regas_1_ou_2;

                SELECT xlinha_pcgo_dias_trabalhados.dataf +(xdias_calc || \' days\')::interval into "2_2_data_requisito";
            end if;
      /* /\/\/\/\/\/\/\>>>TEMPO EM ATIVIDADE DE RISCO MÍNIMO<<</\/\/\/\/\/\/\*/


        		/* \/\/\/\/\/\/\/>>>DIAS TRABALHADOS ATÉ 30/12/2019<<<\/\/\/\/\/\/\/ */
        	        select * from calc_tempo(xlinha_pcgo_dias_trabalhados.pcgo_dias_regras2_3) into "1_pcgo_dias_trabalhados";
            		"1_pcgo_dias_trabalhados_hint"=\'Até dia 30/12/2019\';
	            /* /\/\/\/\/\/\/\>>>DIAS TRABALHADOS ATÉ 30/12/2019<<</\/\/\/\/\/\/\ */

              /* \/\/\/\/\/\/\/>>>REQUISITO IDADE MÍNIMA<<<\/\/\/\/\/\/\/ */
                    "3_idade"=xlinha_pcgo_dias_trabalhados.idade;
                    "3_requisito_idade"=xlinha_pcgo_dias_trabalhados.idade_analise2;
                    "3_data_idade_min"=xlinha.dta_niver2;
                    if("3_requisito_idade"=true)then
                    	"3_requisito_idade_hint"="3_idade"||\' Anos de Idade na Data do Histórico. Implementou os \'||xlinha_pcgo_dias_trabalhados.idade_minima2||\' Anos de Idade\';
                    else
                    	"3_requisito_idade_hint"="3_idade"||\' Anos de Idade na Data do Histórico. NÃO Implementou os \'||xlinha_pcgo_dias_trabalhados.idade_minima2||\' Anos de Idade\';
                    end if;
              /* /\/\/\/\/\/\/\>>>REQUISITO IDADE MÍNIMA<<</\/\/\/\/\/\/\ */


              /* \/\/\/\/\/\/\/>>>REQUISITO PEDÁGIO<<<\/\/\/\/\/\/\/ */
	              xdias=xlinha.dias_para_aposentar-(xlinha_historico.total_dias_calculado+xlinha_pcgo_dias_trabalhados.pcgo_dias_regras2_3);
--                  teste=xlinha.dias_para_aposentar||\'-(\'||xlinha_historico.total_dias_calculado||\'+\'||xlinha_pcgo_dias_trabalhados.pcgo_dias_regras2_3||\')=\'||xdias;

                  if(xdias<=0)then
    				  "1_2_requisito_tempo_pedagio"=true;
                      "1_2_requisito_tempo_pedagio_hint"=\'Cumpriu os \'||(xlinha_historico.total_dias_calculado+xlinha_pcgo_dias_trabalhados.pcgo_dias_regras2_3)/365||\' Anos dos \'||(xlinha.dias_para_aposentar/365)||\' Anos Esperados\';
                  	  "1_2_pedagio_dias"=\'0\';
                      xdias_pedagio=0;
                      "1_2_data_pedagio_previsao"=xlinha_pcgo_dias_trabalhados.dataf;
                  else
	                  xdias=xdias*2;
                      "1_2_requisito_tempo_pedagio"=true;
                      "1_2_requisito_tempo_pedagio_hint"=\'Não Implementou os \'||(xlinha.dias_para_aposentar/365)||\' Anos Esperados. Faltam \'||xdias||\' Dias\';
                      xdias_pedagio=xdias;
                      select * from calc_tempo(xdias) into "1_2_pedagio_dias";
                      SELECT xlinha_pcgo_dias_trabalhados.dataf +(xdias || \' days\')::interval into "1_2_data_pedagio_previsao";
                  end if;
              /* /\/\/\/\/\/\/\>>>REQUISITO PEDÁGIO<<</\/\/\/\/\/\/\ */

              /* \/\/\/\/\/\/\/>>>REQUISITO TEMPO DE CONTRIBUIÇÃO<<<\/\/\/\/\/\/\/ */
	              xdias=(xlinha_historico.total_dias_calculado+xlinha_pcgo_dias_trabalhados.pcgo_dias_regras2_3);
    			  select * from calc_tempo(xdias) into "1_total_dias";

                  "1_3_atividade_geral_data"=xlinha_pcgo_dias_trabalhados.dataf;
                  xdias_calc=(xlinha.anos_necessarios*365)-xdias;
                  if(xdias_calc>0)then
	                  SELECT xlinha_pcgo_dias_trabalhados.dataf +(xdias_calc || \' days\')::interval into "1_3_atividade_geral_data";
                  end if;


                  xdias=(xlinha_historico.total_dias_calculado+xlinha_pcgo_dias_trabalhados.pcgo_dias_regras2_3)-xdias_pedagio;
                  select * from calc_tempo(xdias) into "1_2_total_dias_com_pedagio";


                  SELECT xlinha_pcgo_dias_trabalhados.datai +(((xlinha.anos_necessarios*365)-xlinha_historico.total_dias_calculado) || \' days\')::interval into "1_3_atividade_geral_previsao_afas_aver";
                  SELECT xlinha_pcgo_dias_trabalhados.datai +((xlinha.anos_necessarios*365) || \' days\')::interval into "1_3_atividade_geral_previsao";

                  "1_3_atividade_geral_pedagio_data"=null;
                  xdias_calc=(xlinha.anos_necessarios*365)-xdias;
                  if(xdias_calc>0)then
	                  SELECT xlinha_pcgo_dias_trabalhados.dataf +(xdias_calc || \' days\')::interval into "1_3_atividade_geral_pedagio_data";
                  end if;

                  xanos=xdias/365;
                  if(xanos>=xlinha.anos_necessarios)then
   		                "1_3_atividade_geral"=true;
                  		"1_3_atividade_geral_hint"=\'Implementou. \'||xanos||\' Anos de Contribuição dos \'||xlinha.anos_necessarios||\' Anos Esperados\';
                  else
	                    "1_3_atividade_geral"=false;
                  		"1_3_atividade_geral_hint"=\'NÃO Implementou. \'||xanos||\' Anos de Contribuição dos \'||xlinha.anos_necessarios||\' Anos Esperados. Falta \'||(xlinha.anos_necessarios-xanos)||\' Anos de contribuição\';
                  end if;
              /* /\/\/\/\/\/\/\>>>REQUISITO TEMPO DE CONTRIBUIÇÃO<<</\/\/\/\/\/\/\ */

        end if;--2ª EC Nº 103, Art. 5º, §3º









/*-*-*-*-*-*-*-*-*-*-*-->3ª LC Nº 59/2006<--*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*/
        if(i=3)then


              /*\/\/\/\/\/\/\/>>>TEMPO EM ATIVIDADE DE RISCO MÍNIMO<<<\/\/\/\/\/\/\/ */
                  select * from calc_tempo(xlinha_historico.total_dias_atividade_risco_pcgo_pol_regra_3) into "2_1_requisito_idade_risco_tempo";
                  xanos = (xlinha_historico.total_dias_atividade_risco_pcgo_pol_regra_3+xlinha_historico.dias_pcgo_regra3) / 365;


                  SELECT xlinha_pcgo_dias_trabalhados.datai +((xlinha.anos_atividade_risco) || \' days\')::interval into "2_2_data_requisito_sem_ave_afa";

                  if(xlinha_historico.total_dias_atividade_risco_pcgo_pol_regra_3>=xlinha.anos_atividade_risco)then
                      "2_requisito_idade_risco"=true;
                      "2_2_requisito_idade_risco_hint"=\'Implementou. \'||xanos||\' Anos em Atividade de Risco dos \'||(xlinha.anos_atividade_risco/365)||\' Anos Exigidos\';
                      SELECT xlinha_pcgo_dias_trabalhados.datai +((xlinha.anos_atividade_risco-xlinha_historico.total_dias_atividade_risco_pol) || \' days\')::interval into "2_2_data_requisito";
                  else
                      "2_requisito_idade_risco"=false;
                      "2_2_requisito_idade_risco_hint"=\'NÃO Implementou. \'||xanos||\' Anos em Atividade de Risco dos \'||(xlinha.anos_atividade_risco/365)||\' Anos Exigidos\';

                      xdias_calc=xlinha.anos_atividade_risco-xlinha_historico.total_dias_atividade_risco_pcgo_pol_regra_3;

                      SELECT xlinha_pcgo_dias_trabalhados.dataf +(xdias_calc || \' days\')::interval into "2_2_data_requisito";
                  end if;
            /* /\/\/\/\/\/\/\>>>TEMPO EM ATIVIDADE DE RISCO MÍNIMO<<</\/\/\/\/\/\/\*/

            /* \/\/\/\/\/\/\/>>>DIAS TRABALHADOS ATÉ 30/12/2019<<<\/\/\/\/\/\/\/ */
            select * from calc_tempo(xlinha_pcgo_dias_trabalhados.pcgo_dias_regras2_3) into "1_pcgo_dias_trabalhados";
            "1_pcgo_dias_trabalhados_hint"=\'Até dia 30/12/2019\';
            /* /\/\/\/\/\/\/\>>>DIAS TRABALHADOS ATÉ 30/12/2019<<</\/\/\/\/\/\/\ */

            /* \/\/\/\/\/\/\/>>>REQUISITO IDADE MÍNIMA<<<\/\/\/\/\/\/\/ */
            "3_idade"=xlinha_pcgo_dias_trabalhados.idade;
            "3_requisito_idade"=TRUE;--NÃO SE APLICA
            "3_requisito_idade_hint"=\'Requisito NÃO SE APLICA a está regra\';
            "3_data_idade_min"=xlinha_pcgo_dias_trabalhados.dataf;
            /* /\/\/\/\/\/\/\>>>REQUISITO IDADE MÍNIMA<<</\/\/\/\/\/\/\ */

            /* \/\/\/\/\/\/\/>>>REQUISITO PEDÁGIO<<<\/\/\/\/\/\/\/ */
	              xdias=xlinha.dias_para_aposentar-(xlinha_historico.total_dias_calculado+xlinha_pcgo_dias_trabalhados.pcgo_dias_regras2_3);
                  if(xdias<=0)then
    				  "1_2_requisito_tempo_pedagio"=true;
                      "1_2_requisito_tempo_pedagio_hint"=\'Cumpriu os \'||(xlinha_historico.total_dias_calculado+xlinha_pcgo_dias_trabalhados.pcgo_dias_regras2_3)/365||\' Anos dos \'||(xlinha.dias_para_aposentar/365)||\' Anos Esperados\';
                  	  "1_2_pedagio_dias"=0;
                      "1_2_data_pedagio_previsao"=xlinha_pcgo_dias_trabalhados.dataf;
                  else
	                  xdias=xdias*2;
                      "1_2_requisito_tempo_pedagio"=true;
                      "1_2_requisito_tempo_pedagio_hint"=\'Não Implementou os \'||(xlinha.dias_para_aposentar/365)||\' Anos Esperados. Faltam \'||xdias||\' Dias\';
                      xdias_pedagio=xdias;
                      select * from calc_tempo(xdias) into "1_2_pedagio_dias";
                      SELECT xlinha_pcgo_dias_trabalhados.dataf +(xdias || \' days\')::interval into "1_2_data_pedagio_previsao";
                  end if;
              /* /\/\/\/\/\/\/\>>>REQUISITO PEDÁGIO<<</\/\/\/\/\/\/\ */

              /* \/\/\/\/\/\/\/>>>REQUISITO TEMPO DE CONTRIBUIÇÃO<<<\/\/\/\/\/\/\/ */
	              xdias=(xlinha_historico.total_dias_calculado+xlinha_pcgo_dias_trabalhados.pcgo_dias_regras2_3);
    			  select * from calc_tempo(xdias) into "1_total_dias";

                  "1_3_atividade_geral_data"=xlinha_pcgo_dias_trabalhados.dataf;
                  xdias_calc=(xlinha.anos_necessarios*365)-xdias;
                  if(xdias_calc>0)then
	                  SELECT xlinha_pcgo_dias_trabalhados.dataf +(xdias_calc || \' days\')::interval into "1_3_atividade_geral_data";
                  end if;

	              xdias=(xlinha_historico.total_dias_calculado+xlinha_pcgo_dias_trabalhados.pcgo_dias_regras2_3)-xdias_pedagio;
                  select * from calc_tempo(xdias) into "1_2_total_dias_com_pedagio";

                  SELECT xlinha_pcgo_dias_trabalhados.datai +(((xlinha.anos_necessarios*365)-xlinha_historico.total_dias_calculado) || \' days\')::interval into "1_3_atividade_geral_previsao_afas_aver";
                  SELECT xlinha_pcgo_dias_trabalhados.datai +((xlinha.anos_necessarios*365) || \' days\')::interval into "1_3_atividade_geral_previsao";

                  "1_3_atividade_geral_pedagio_data"=null;
                  xdias_calc=(xlinha.anos_necessarios*365)-xdias;
                  if(xdias_calc>0)then
	                  SELECT xlinha_pcgo_dias_trabalhados.dataf +(xdias_calc || \' days\')::interval into "1_3_atividade_geral_pedagio_data";
                  end if;

                  xanos=xdias/365;
                  if(xanos>=xlinha.anos_necessarios)then
   		                "1_3_atividade_geral"=true;
                  		"1_3_atividade_geral_hint"=\'Implementou. \'||xanos||\' Anos de Contribuição dos \'||xlinha.anos_necessarios||\' Anos Esperados\';
                  else
	                    "1_3_atividade_geral"=false;
                  		"1_3_atividade_geral_hint"=\'NÃO Implementou. \'||xanos||\' Anos de Contribuição dos \'||xlinha.anos_necessarios||\' Anos Esperados. Falta \'||(xlinha.anos_necessarios-xanos)||\' Anos de contribuição\';
                  end if;
              /* /\/\/\/\/\/\/\>>>REQUISITO TEMPO DE CONTRIBUIÇÃO<<</\/\/\/\/\/\/\ */

        end if;--3ª LC Nº 59/2006

        "4_1_data_integralizacao"="1_2_data_pedagio_previsao";
        if("1_2_data_pedagio_previsao"<"2_2_data_requisito")then
        	"4_1_data_integralizacao"="2_2_data_requisito";
        end if;
        if("4_1_data_integralizacao"<"3_data_idade_min")then
        	"4_1_data_integralizacao"="3_data_idade_min";
        end if;
        if("4_1_data_integralizacao"<"1_3_atividade_geral_previsao")then
        	"4_1_data_integralizacao"="1_3_atividade_geral_previsao";
        end if;

        if("4_1_data_integralizacao"<=xlinha_pcgo_dias_trabalhados.dataf)then
        	"4_1_conclusao"=true;
            --select * from calc_tempo(xdias) into "4_2_tempo_total";
        else
        	"4_1_conclusao"=false;
        end if;

    return next;

  END LOOP;




END;
$body$
LANGUAGE \'plpgsql\'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION public.servidor_aposentadoria (eservidor_id integer)
  OWNER TO ditpcgo;');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};

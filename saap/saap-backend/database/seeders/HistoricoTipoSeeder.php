<?php

namespace Database\Seeders;
use App\Models\HistoricoTipo;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class HistoricoTipoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        HistoricoTipo::create(['carreira' => 'PCGO', 'descricao' => 'Dias Trabalhados', 'sinal' => '1', 'label_dtai' => 'Início:', 'label_dtaf' => 'Término:']);
        HistoricoTipo::create(['carreira' => 'PCGO', 'descricao' => 'Licença Prêmio', 'sinal' => '1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'PCGO', 'descricao' => 'Férias', 'sinal' => '1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'PCGO', 'descricao' => 'Outros Acrescimos', 'sinal' => '1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'PCGO', 'descricao' => 'Suspensão', 'sinal' => '-1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'PCGO', 'descricao' => 'Lic. Particular', 'sinal' => '-1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'PCGO', 'descricao' => 'Outros Descontos', 'sinal' => '-1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'PCGO', 'descricao' => 'Lic. Ativ. Política', 'sinal' => '-1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'PCGO', 'descricao' => 'Exercício de Mandato Eleitoral', 'sinal' => '-1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'PCGO', 'descricao' => 'Prisão', 'sinal' => '-1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'PCGO', 'descricao' => 'Cessão Órgão Não SSP', 'sinal' => '-1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'POL', 'descricao' => 'Dias Trabalhados(Averbação)', 'sinal' => '1', 'label_dtai' => 'Início:', 'label_dtaf' => 'Término:']);
        HistoricoTipo::create(['carreira' => 'POL', 'descricao' => 'Licença Prêmio', 'sinal' => '1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'POL', 'descricao' => 'Férias', 'sinal' => '1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'POL', 'descricao' => 'Outras Averbações', 'sinal' => '1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'POL', 'descricao' => 'Suspensão', 'sinal' => '-1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'POL', 'descricao' => 'Lic. Particular', 'sinal' => '-1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'POL', 'descricao' => 'Outros Descontos', 'sinal' => '-1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'POL', 'descricao' => 'Lic. Ativ. Política', 'sinal' => '-1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'POL', 'descricao' => 'Prisão', 'sinal' => '-1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'POL', 'descricao' => 'Exercício de Mandato Eleitoral', 'sinal' => '-1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'PUB', 'descricao' => 'Dias Trabalhados(Averbação)', 'sinal' => '1', 'label_dtai' => 'Início:', 'label_dtaf' => 'Término:']);
        HistoricoTipo::create(['carreira' => 'PUB', 'descricao' => 'Licença Prêmio', 'sinal' => '1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'PUB', 'descricao' => 'Férias', 'sinal' => '1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'PUB', 'descricao' => 'Outras Averbações', 'sinal' => '1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'PUB', 'descricao' => 'Suspensão', 'sinal' => '-1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'PUB', 'descricao' => 'Lic. Particular', 'sinal' => '-1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'PUB', 'descricao' => 'Outros Descontos', 'sinal' => '-1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'PUB', 'descricao' => 'Lic. Ativ. Política', 'sinal' => '-1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'PUB', 'descricao' => 'Exercício de Mandato Eleitoral', 'sinal' => '-1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'PUB', 'descricao' => 'Prisão', 'sinal' => '-1', 'label_dtai' => '-', 'label_dtaf' => '-']);
        HistoricoTipo::create(['carreira' => 'CLT', 'descricao' => 'Dias Trabalhados(Averbação)', 'sinal' => '1', 'label_dtai' => 'Início:', 'label_dtaf' => 'Término:']);
    }
}

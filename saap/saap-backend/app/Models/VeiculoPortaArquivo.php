<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VeiculoPortaArquivo extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $table = 'vtr.veiculo_porta_arquivos';
}

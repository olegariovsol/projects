<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VeiculoMultaPortaArquivo extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $table = 'vtr.multa_porta_arquivos';
}

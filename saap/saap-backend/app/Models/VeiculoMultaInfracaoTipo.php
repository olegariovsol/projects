<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VeiculoMultaInfracaoTipo extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $table = 'vtr.multa_infracao_tipos';
}

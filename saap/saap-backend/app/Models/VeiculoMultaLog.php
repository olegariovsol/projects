<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VeiculoMultaLog extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $table = 'vtr.multas_logs';
}

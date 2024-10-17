<?php

namespace App\Models;

//use App\Traits\TenantTable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServidorPortaArquivoPasta extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $table = 'public.servidor_porta_arquivo_pastas';
}

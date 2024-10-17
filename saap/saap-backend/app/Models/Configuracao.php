<?php

namespace App\Models;

//use App\Traits\TenantTable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Configuracao extends Model
{
    use HasFactory;
    //use TenantTable;

    protected $guarded = ['id'];
}

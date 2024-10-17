<?php

namespace App\Models;

//use App\Traits\TenantTable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServidorAposentadoria extends Model
{
    use HasFactory;
    //use TenantTable;

    protected $guarded = ['id'];

    protected $table = 'aposentadoria.servidor';
}

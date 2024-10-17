<?php

namespace App\Traits;

use App\Scopes\TenantScope;
use Illuminate\Support\Facades\Auth;

trait TenantTable{
    //Função para setar automaticamente o tenant do usuário logado.
    protected static function bootTenanttable(){
        if(Auth::check()){
            static::creating(function($model){
                $model->tenant_id = Auth::user()->tenant_id;
            });
        }
        static::addGlobalScope(new TenantScope);
    }
    //Função para saber quais objetos são de uma determinado tenant.
    public function tenant(){
        return $this->belongs(Tenant::class);
    }
}

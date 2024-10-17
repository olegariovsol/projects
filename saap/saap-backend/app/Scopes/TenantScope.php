<?php

namespace App\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth as FacadesAuth;

class TenantScope implements Scope {
    //Função para aplicar filtro de acordo com a Unidade que controla o material
    public function apply(Builder $builder, Model $model)
    {
        if(FacadesAuth::check()){
            //validar se o tenant é gestor.
            $builder->where('tenant_id', FacadesAuth::user()->tenant_id);
        }
    }
}

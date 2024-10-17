<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpFoundation\Response;

class ValidateSSO
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        //return response()->json($request->header(), 200);
        try {
            $tenant = $request->header('Tenant');
            //$token = explode(' ', $request->header('Token'))[1];
            if ($request->header('Token')) {
                $token = $request->header('Token');
            } else {
                $token = substr($request->header('Authorization'), 7, null);
            }
            //return response()->json($token, 200);
            //$token = $request->header('Token');
            $ssows = Http::get(env('SSO_URL') . "validate?token={$token}");
            //return response()->json('teste' . strlen($ssows), 200);
            if (strlen($ssows) == 0 || $ssows == null) {
                header('Location: ' . env('ENDERECO_SSOWS_LOGIN'));
                exit;
            }
            //return response()->json($tenant . ' - ' . $ssows, 200);
            if ($tenant == '' && !in_array($tenant, $ssows['unidadesDeTrabalho'], true)) {
                return response()->json($tenant . ' - ' . $ssows, 200);
                header('Location: ' . env('ENDERECO_SSOWS_LOGIN'));
                exit;
            }
            //return response()->json($tenant . ' - ' . $ssows, 200);
            //return response()->json('teste', 200);
            if (Auth::check()) {
                return $next($request);
            }

            $user = User::firstOrCreate([
                'cpf' => $ssows['cpf'],
            ]);
            $user->tenant_id = $tenant;
            $user->nome = $ssows['nome'];
            $user->email = $ssows['email'];
            $user->password = Hash::make($ssows['cpf']);

            $user->save();

            Auth::login($user);

            //return response()->json(Auth::check(), 200);

            if (Auth::check()) {
                //entrando aqui significa que já tenho um login feito e irei trabalhar no local
                return $next($request);
            } else {
                header('Location: ' . env('RELOAD_SISTEMA'));
            }

            return $next($request);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Erro ao tentar acessar o backend. ' . $th], 400);
        }
    }
}

<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

//a função abaixo é utilizada pelo kubernetes para validar se a aplicação está viva
Route::get('/healthcheck', function () {
    return 'ok';
})->name('healthcheck');

Route::get('/', function () {
    return view('welcome');
});

<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Aquí es donde puedes registrar rutas web para tu aplicación. Estas
| rutas son cargadas por el RouteServiceProvider dentro de un grupo que
| contiene el grupo de middleware "web". ¡Ahora crea algo grandioso!
|
*/

Route::get('/storage/{path?}', function ($path = null) {
    // Lógica para manejar la ruta /storage
    return response()->file(storage_path('app/public/' . $path));
});

Route::get('/{path?}/{path2?}/{path3?}/{path4?}/{path5?}', function () {
    return view('welcome');
})->where('path', '^(?!storage).*');

// Route::get('/', function () {
//     return view('welcome');
// });

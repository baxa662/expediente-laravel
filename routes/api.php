<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CitaController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\IngredientUnitController;
use App\Http\Controllers\MedidaController;
use App\Http\Controllers\NotaController;
use App\Http\Controllers\NutrientController;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentMethodsController;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\ServicioController;
use App\Http\Controllers\UsuarioController;
use App\Models\ingredientUnit;
use App\Models\Medico;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::controller(AuthController::class)->group(function () {
    Route::post('login', 'login');
    Route::post('register', 'register');
});

Route::middleware('auth:sanctum')->controller(AuthController::class)->group(function () {
    Route::post('logout', 'logout');
});

Route::middleware('auth:sanctum')->controller(PacienteController::class)->group(function () {
    Route::post('pacientes', 'showAll');
    Route::post('pacientes/sexos', 'getSexos');
    Route::post('pacientes/edoCivil', 'getEdoCivil');
    Route::post('pacientes/create', 'create');
    Route::post('pacientes/update', 'update');
    Route::post('pacientes/delete', 'destroy');
    Route::post('pacientes/show', 'show');
});

Route::middleware('auth:sanctum')->controller(MedidaController::class)->group(function () {
    Route::post('medidas/create', 'storeV2');
    Route::post('medidas/update', 'updateV2');
    Route::post('medidas/delete/{id}', 'destroy');
});

Route::middleware('auth:sanctum')->controller(NotaController::class)->group(function () {
    Route::post('notas/showAll', 'showAll');
    Route::post('notas/create', 'store');
    Route::post('notas/update', 'update');
    Route::post('notas/delete/{id}', 'destroy');
});

Route::middleware('auth:sanctum')->controller(CitaController::class)->group(function () {
    Route::post('citas/showAll', 'showAll');
    Route::post('citas/show', 'show');
    Route::post('citas/create', 'store');
    Route::post('citas/update/{id}', 'update');
    Route::post('citas/delete/{id}', 'destroy');
    Route::post('citas/resume/{id}', 'getResumeDate');
});

Route::middleware('auth:sanctum')->controller(UsuarioController::class)->group(function () {
    Route::post('users/showAll', 'showAll');
    Route::post('users/create', 'store');
    Route::post('users/update/{id}', 'update');
    Route::post('users/delete/{id}', 'destroy');
    Route::post('users/password/reset/{id}', 'resetPassword');
});

Route::middleware('auth:sanctum')->controller(ServicioController::class)->group(function () {
    Route::post('services/showAll', 'showAll');
    Route::post('services/create', 'store');
    Route::post('services/update/{id}', 'update');
    Route::post('services/delete/{id}', 'destroy');
});

Route::middleware('auth:sanctum')->controller(PaymentMethodsController::class)->group(function () {
    Route::post('paymentMethods/show/{id?}', 'show');
    // Route::post('paymentMethods/create', 'store');
    // Route::post('paymentMethods/update/{id}', 'update');
    // Route::post('paymentMethods/delete/{id}', 'destroy');
});

Route::middleware('auth:sanctum')->controller(PaymentController::class)->group(function () {
    Route::post('payment/show/{id?}', 'show');
    Route::post('payment/create', 'store');
    Route::post('payment/total/day/{day}', 'getTotalMount');
    // Route::post('paymentMethods/update/{id}', 'update');
    // Route::post('paymentMethods/delete/{id}', 'destroy');
});

Route::middleware('auth:sanctum')->controller(IngredientController::class)->group(function () {
    Route::post('ingredient/show/{id?}', 'show');
    Route::post('ingredient/create', 'save');
    Route::post('ingredient/nutrient/set', 'setNutrient');
    Route::post('ingredient/nutrient/delete', 'deleteNutrient');
    Route::post('ingredient/detail/{idIngredient}', 'getIngredientDetail');
    Route::post('ingredient/update/{id}', 'update');
    // Route::post('paymentMethods/update/{id}', 'update');
    Route::delete('ingredient/delete/{id}', 'delete');
});

Route::middleware('auth:sanctum')->controller(CategoryController::class)->group(function () {
    Route::post('ingredient/category/show/{id?}', 'show');
    Route::post('ingredient/category/create', 'save');
    // Route::post('paymentMethods/update/{id}', 'update');
    // Route::post('paymentMethods/delete/{id}', 'destroy');
});

Route::middleware('auth:sanctum')->controller(NutrientController::class)->group(function () {
    Route::post('nutrient/show/{id?}', 'show');
    Route::post('nutrient/create', 'save');
    // Route::post('paymentMethods/update/{id}', 'update');
    // Route::post('paymentMethods/delete/{id}', 'destroy');
});

Route::middleware('auth:sanctum')->controller(IngredientUnitController::class)->group(function () {
    Route::post('ingredient/unit/show', 'show');
    Route::post('ingredient/unit/create', 'save');
    // Route::post('paymentMethods/update/{id}', 'update');
    // Route::post('paymentMethods/delete/{id}', 'destroy');
});

Route::middleware('auth:sanctum')->controller(RecipeController::class)->group(function () {
    Route::post('recipes/show', 'show');
    Route::post('recipes/create', 'save');
    Route::post('recipes/update/{id}', 'update');
    Route::post('recipes/delete/{id}', 'destroy');
    Route::post('recipes/ingredient', 'addIngredientToRecipe');
    Route::post('recipes/ingredient/update', 'updateIngredientInRecipe');
    Route::post('recipes/ingredient/delete', 'deleteIngredientFromRecipe');
    Route::get('recipes/detail/{id}', 'getRecipeDetail');
    Route::post('recipes/update-image', 'updateRecipeImage');
    Route::post('recipes/update-pdf', 'updateRecipePdf');
});

Route::post('/tokens/create', function (Request $request) {
    $medico = Medico::find(2);
    $token = $medico->createToken('Token-Juan');
    return ['token' => $token->plainTextToken];
});

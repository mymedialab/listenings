<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', function() {
	return Response::json(['placeholder' => true], 200);
});

Route::post('api/login', 'AuthController@login');
Route::post('api/logout', 'AuthController@logout');
Route::get('api/session', 'AuthController@session');

// used for clientside error capturing
Route::post('api/log', 'LogController@store');

Route::controller('api/password', 'RemindersController');

Route::post('api/user/available', 'UserController@available');
Route::post('api/user/changepassword', 'UserController@changePassword');
Route::resource('api/user', 'UserController', ['only' => ['store', 'update', 'show']]);

Route::group(array('before' => 'auth'), function() {
  Route::resource('api/interviews', 'InterviewsController');
  Route::resource('api/questionnaires', 'QuestionnaireController');
  Route::resource('api/questions', 'QuestionController');
  Route::resource('api/areas', 'AreaController');
  Route::get('api/locations', 'AreaController@index');
});

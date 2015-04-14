<?php

class QuestionnaireController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return Response::json(Questionnaire::with('questions')->get(), 200);
	}

	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$questionnaire = Questionnaire::with('questions')->find($id);

		if (is_null($questionnaire)) {
			return Response::json([ 'error' => 'no such questionnaire found' ], 404);
		}

		return Response::json($questionnaire, 200);
	}

	public function store()
	{
		$v = Validator::make(Request::all(), [
			'name' => 'required|unique:questionnaire',
			'questions' => 'array',
			'taggable' => 'array'
		]);

		if ($v->fails()) {
			return Response::json([ 'errors' => $v->errors() ], 400);
		}

		$questionnaire = Questionnaire::create([ 'name' => Input::get('name') ]);

		if (Input::has('questions')) {
			foreach (Input::get('questions') as $question) {
				Question::create([
					'question' => $question,
					'questionnaire_id' => $questionnaire->id
				]);
			}
		}

		if (Input::has('taggable')) {
			foreach (Input::get('taggable') as $tagList) {
				$questionnaire->tagLists()->save(TagList::create(['name' => $tagList['name']]));
			}
			$questionnaire->load('tagLists');
		}

		$questionnaire->push();

		return Response::json($questionnaire, 201);
	}

	public function update($id)
	{
		$v = Validator::make($request->all(), [
			'name' => 'required|unique',
		]);

		if ($v->fails()) {
			return Response::json($v->errors(), 400);
		}

		$questionnaire = Questionnaire::find($id);

		if (is_null($questionnaire)) {
			return Response::json([ 'error'=> 'no such questionnaire found' ], 404);
		}

		$questionnaire->name = Input::get('name');

		return Response::json($questionnaire, 200);
	}
}

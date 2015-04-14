<?php

class QuestionnaireController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		$Questionnaire = Questionnaire::with('questions', 'tagLists', 'tagLists.tags')->get();
		return Response::json($this->reformatTagsAndQuestions($Questionnaire), 200);
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

	/**
	 * Need to rename tag_lists to taggable for the js
	 */
	protected function reformatTagsAndQuestions($Questionnaires)
	{
		$questionnaires = [];

		foreach ($Questionnaires as $Questionnaire) {
			$questionnaire = $Questionnaire->toArray();

			$questionnaire['taggable'] = array_map(function($tagList) {
				return [
					'id' => $tagList['id'],
					'name' => $tagList['name'],
					'existing' => array_map(
						function($item) {
							return $item['name'];
						},
						$tagList['tags']
					)
				];
			}, $questionnaire['tag_lists']);

			$questionnaire['questions'] = array_map(function($question) {
				return $question['question'];
			}, $questionnaire['questions']);

			unset($questionnaire['tag_lists']);

			$questionnaires[] = $questionnaire;
		}

		return $questionnaires;
	}
}

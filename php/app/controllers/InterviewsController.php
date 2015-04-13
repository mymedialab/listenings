<?php

class InterviewsController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return Response::json(Interview::with('response')->get(), 200);
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * Interviews are submitted as sets of tags and responses to questionnaires.
	 *
	 * @return Response
	 */
	public function store()
	{
		$v = Validator::make(Request::all(), [
			'type' => 'required',
			'questionSet' => 'required|string',
			'location' => 'required',
			'recordedAt' => 'required',
			'questions' => 'required|array',
			'taggable' => 'array',
		]);

		if ($v->fails() || Input::get('type') !== 'interview') {
			if (Input::get('type') !== 'interview') {
				$v->errors()->add('type', 'must be "interview"');
			}
			return Response::json([ 'errors' => $v->errors() ], 400);
		}

		$Date = date_create_from_format('U', Input::get('recordedAt'));

		$interview = Interview::firstOrCreate([
			'date' => $Date,
			'interviewer_id' => Auth::user()->id
		]);

		foreach (Input::get('questions') as $entry) {
			$interview->responses->add(
				InterviewResponse::firstOrCreate([
					'question' => $entry['question'],
					'answer' => $entry['response'],
					'interview_id' => $interview->id
				])
			);
		}

		if (Input::get('taggable')) {
			// todo: create tags/tag lists
		}

		$interview->push();


		return Response::json(Interview::with('responses')->find($interview->id), 200);
	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		//
	}


	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		//
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}


}

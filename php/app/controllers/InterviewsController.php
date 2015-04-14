<?php
use Carbon\Carbon;

class InterviewsController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return Response::json(Interview::with('responses')->with('questionnaire')->get(), 200);
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
			'type' => 'required|string',
			'questionSet' => 'required|string',
			'location' => 'required',
			'recordedAt' => 'required',
			'questions' => 'array',
			'taggable' => 'array',
			'location' => 'string',
		]);

		if ($v->fails()) {
			return Response::json([ 'errors' => $v->errors() ], 400);
		}

		$Date = Carbon::createFromTimeStamp(Input::get('recordedAt'));

		$interview = Interview::firstOrNew([
			'date'           => $Date,
			'interviewer_id' => Auth::user()->id,
		]);

		// important to fail here, you shouldn't be able to submit an interview for a questionnaire that doesn't exist
		$interview->questionnaire_id = Questionnaire::where('name', '=', Input::get('questionSet'))->firstOrFail()->id;
		$interview->type             = Input::get('type');
		if (Input::has('location')) {
			$interview->location       = Input::get('location');
		}

		$interview->save();

		if (Input::has('questions') && $interview->type === 'interview') {
			foreach (Input::get('questions') as $entry) {
				$interview->responses->add(
					InterviewResponse::firstOrCreate([
						'question'     => $entry['question'],
						'answer'       => $entry['response'],
						'interview_id' => $interview->id
					])
				);
			}
		}

		// if (Input::has('taggable')) {
		// 	foreach (Input::get('questions') as $entry) {
		// 		$interview->responses->add(
		// 			InterviewResponse::firstOrCreate([
		// 				'question' => $entry['question'],
		// 				'answer' => $entry['response'],
		// 				'interview_id' => $interview->id
		// 			])
		// 		);
		// 	}
			// todo: create tags/tag lists
		// }

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

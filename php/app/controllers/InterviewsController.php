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
			foreach (Input::get('questions') as $response) {
				InterviewResponse::create([
					'question'     => $response['question'],
					'answer'       => $response['answer'],
					'interview_id' => $interview->id
				]);
			}
		}
		if (Input::has('taggable') && $interview->type === 'interview') {
			foreach (Input::get('taggable') as $list) {
				if (isset($list['id'])) {
					$this->saveTagsToQuestionnaire($list);
				}
				$TagList = new TagList;
				$TagList->name = $list['name'];

				$interview->tagLists()->save($TagList);

				foreach ($list['tagged'] as $tag) {
					$TagList->tags()->save(Tag::create(['name' => $tag, 'tag_list_id' => $TagList->id]));
				}
			}
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


	/**
	 * Could be cleverer here..? We're basically ending up with a BIG list of tags
	 * for the questionnaire, and lots of little lists for the interviews. The questionnaire
	 * *should* be able to follow it's relationships through interviews to tags I reckon?
	 *
	 * @param  array  $list
	 */
	protected function saveTagsToQuestionnaire(array $list)
	{
		$TagList = TagList::findOrNew($list['id']);
		$TagList->name = $TagList->name ? $TagList->name : $list['name'];
		foreach ($list['tagged'] as $tag) {
			foreach ($TagList->tags as $Existing) {
				if ($Existing->name === $tag) {
					continue 2; // don't duplicate tags
				}
			}

			$TagList->tags()->save(Tag::create(['name' => $tag, 'tag_list_id' => $TagList->id]));
		}

		$TagList->save();
	}

}
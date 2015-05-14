<?php

class LogController extends Controller {
	/**
	 * Store a newly created resource in storage.
	 * POST /api/log
	 *
	 * @return Response
	 */
	public function store()
	{
		$Validator = Validator::make(Input::all(), ['message' => 'string|required']);

		if ($Validator->fails()) {
			$messages = $Validator->messages();
			\Log::error('Failed to log from POST request: ' . implode(', ', $messages->all()));
			return Response::json($messages, 400);
		}

		$context = [];
		if (Input::get('full')) {
			$context = Input::get('full');
		}

		\Log::error('client-error - ' . Input::get('message'), $context);
		return Response::json([], 200);
	}
}

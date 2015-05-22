<?php

class AreaController extends \Controller {

	/**
	 * Display a listing of the resource.
	 * GET /area
	 *
	 * @return Response
	 */
	public function index()
	{
		$Areas = Area::with('locations')->get();
		return Response::json(['count' => $Areas->count(), 'areas' => $Areas], 200);
	}

	/**
	 * Show the form for creating a new resource.
	 * GET /area/create
	 *
	 * @return Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created resource in storage.
	 * POST /area
	 *
	 * @return Response
	 */
	public function store()
	{
		$V = Validator::make(Input::all(), [
			'name' => 'required|string'
		]);

		if ($V->fails()) {
			return Response::json($V->messages()->all(), 400);
		}

		$name = Input::get('name');

		$Area = Area::where('name', '=', $name);
		if ($Area->count() > 0) {
			// already exists :/
			return Response::json($Area->toArray(), 409);
		}

		$NewArea = new Area;
		$NewArea->name = $name;
		$NewArea->save();

		return Response::json($NewArea->toArray(), 201);
	}

	/**
	 * Display the specified resource.
	 * GET /area/{id}
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$Area = Area::with('locations')->find($id);

		if (!$Area) {
			return Response::json([], 404);
		}

		return Response::json($Area->toArray, 200);
	}

	/**
	 * Show the form for editing the specified resource.
	 * GET /area/{id}/edit
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
	 * PUT /area/{id}
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		$Area = Area::find($id);

		if (!$Area) {
			return Response::json([ 'id' => $id ], 404);
		}

		$V = Validator::make(Input::all(), [
			'name' => 'required|string'
		]);

		if ($V->fails()) {
			return Response::json($V->messages()->all(), 400);
		}

		$Area->name = Input::get('name');
		if ($Area->save()) {
			return Response::json($Area->toArray(), 200);
		}
	}

	/**
	 * Remove the specified resource from storage.
	 * DELETE /area/{id}
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}
}

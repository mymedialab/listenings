<?php
use Carbon\Carbon;

class LocationsController extends Controller {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		return Response::json(Interview::distinct()->select('location')->get(), 200);
	}
}

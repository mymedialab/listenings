<?php

class QuestionController extends Controller {

  /**
   * Display a listing of the resource.
   *
   * @return Response
   */
  public function index()
  {
    return Response::json(Question::get(), 200);
  }

  /**
   * Display the specified resource.
   *
   * @param  int  $id
   * @return Response
   */
  public function show($id)
  {
    $Q = Question::with('questionnaire')->find($id);

    if (is_null($Q)) {
      return Response::json(['error'=>'no such question found'], 404);
    }

    return Response::json($Q, 200);
  }
}

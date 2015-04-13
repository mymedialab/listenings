<?php

class Question extends \Eloquent {
  protected $table = 'question';

  protected $fillable = [];

  public function questionnaire()
  {
      return $this->belongsTo('Questionnaire', 'questionnaire_id', 'id');
  }
}

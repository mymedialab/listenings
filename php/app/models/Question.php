<?php

class Question extends \Eloquent {
  protected $table = 'question';

  protected $fillable = ['question', 'questionnaire_id'];

  public function questionnaire()
  {
      return $this->belongsTo('Questionnaire', 'questionnaire_id', 'id');
  }
}

<?php

class Questionnaire extends \Eloquent {
  protected $table = 'questionnaire';

  protected $fillable = ['name'];


  public function questions()
  {
      return $this->hasMany('Question');
  }

  public function interviews()
  {
      return $this->hasMany('Interview');
  }

  public function tagLists()
  {
      return $this->belongsToMany('TagList', 'questionnaire_tag_lists');
  }
}
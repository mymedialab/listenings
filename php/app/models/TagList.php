<?php

/**
 * duplicates the question in case the original changes.
 * todo: have a relationship to the original question anyway?
 */
class TagList extends \Eloquent {
  public $timestamps = false;
  protected $table = 'tag_list';
  protected $fillable = ['name'];
  protected $touches = ['Questionnaire'];

  public function tags()
  {
      return $this->hasMany('Tag');
  }
  public function questionaire()
  {
      return $this->belongsToMany('Questionnaire', 'questionnaire_tag_lists');
  }
  public function interview()
  {
      return $this->belongsToMany('Interview', 'interview_tag_lists');
  }
}

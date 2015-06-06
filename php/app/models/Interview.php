<?php

/**
 * duplicates the question in case the original changes.
 * todo: have a relationship to the original question anyway?
 */
class Interview extends \Eloquent {
  protected $table = 'interview';

  protected $fillable = ['date', 'interviewer_id', 'type', 'location', 'house_number'];
  public function getDates()
  {
    return ['date', 'created_at', 'updated_at'];
  }

  public function responses()
  {
      return $this->hasMany('InterviewResponse');
  }

  public function interviewer()
  {
      return $this->belongsTo('User', 'interviewer_id', 'id');
  }

  public function questionnaire()
  {
      return $this->belongsTo('Questionnaire', 'questionnaire_id', 'id');
  }

  public function tagLists()
  {
      return $this->belongsToMany('TagList', 'interview_tag_lists');
  }

    public function getCreatedAtAttribute($date)
    {
        return Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $date)->format('c');
    }

    public function getUpdatedAtAttribute($date)
    {
        return Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $date)->format('c');
    }
}

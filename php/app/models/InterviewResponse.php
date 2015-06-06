<?php

/**
 * duplicates the question in case the original changes.
 * todo: have a relationship to the original question anyway?
 */
class InterviewResponse extends \Eloquent {
  protected $table = 'response';

  protected $fillable = ['question', 'answer', 'interview_id'];

  public function interview()
  {
      return $this->belongsTo('Interview', 'interview_id', 'id');
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

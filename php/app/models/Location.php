<?php

/**
 * duplicates the question in case the original changes.
 * todo: have a relationship to the original question anyway?
 */
class Location extends \Eloquent
{
  protected $fillable = ['name', 'area_id'];

  public function area()
  {
      return $this->belongsTo('Area', 'area_id', 'id');
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

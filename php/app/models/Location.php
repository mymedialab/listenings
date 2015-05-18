<?php

/**
 * duplicates the question in case the original changes.
 * todo: have a relationship to the original question anyway?
 */
class Location extends \Eloquent
{
  protected $fillable = ['name'];

  public function area()
  {
      return $this->belongsTo('Area', 'area_id', 'id');
  }
}

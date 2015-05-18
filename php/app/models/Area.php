<?php

/**
 * duplicates the question in case the original changes.
 * todo: have a relationship to the original question anyway?
 */
class Area extends \Eloquent
{
  protected $fillable = ['name'];

  public function locations()
  {
      return $this->hasMany('Location');
  }
}

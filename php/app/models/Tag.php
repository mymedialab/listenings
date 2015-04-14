<?php

/**
 * duplicates the question in case the original changes.
 * todo: have a relationship to the original question anyway?
 */
class Tag extends \Eloquent {
  public $timestamps = false;
  protected $table = 'tag';
  protected $fillable = ['name', 'tag_list_id'];

  public function tagList()
  {
      return $this->belongsTo('TagList');
  }
}

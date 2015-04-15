<?php

use Illuminate\Auth\UserTrait;
use Illuminate\Auth\UserInterface;
use Illuminate\Auth\Reminders\RemindableTrait;
use Illuminate\Auth\Reminders\RemindableInterface;

class User extends Eloquent implements UserInterface, RemindableInterface {

	use UserTrait, RemindableTrait;

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'user';

	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = array('password', 'remember_token');


	protected $fillable = array('name', 'username', 'password', 'email');

	/**
	 * force boolean coercion for the is_admin column
	 * On ubuntu installations without the mysqlnd extension installed, it will be coerced to a string!
	 */
	public function getIsAdminAttribute($value)
	{
		return !!((int) $value);
	}
}

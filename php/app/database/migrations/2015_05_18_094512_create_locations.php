<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateLocations extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('locations', function(Blueprint $t)
		{
			$t->increments('id');
			$t->string('name')->unique();
			$t->integer('area_id')->unsigned();

			$t->timestamps();
			$t->foreign('area_id')->references('id')->on('areas')->onDelete('cascade');
			$t->index('name');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('locations');
	}
}

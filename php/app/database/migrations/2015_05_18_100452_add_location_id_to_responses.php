<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddLocationIdToResponses extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('interview', function(Blueprint $t)
		{
			$t->integer('location_id')->unsigned()->nullable();
			$t->foreign('location_id')->references('id')->on('locations')->onDelete('restrict');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('interview', function(Blueprint $t)
		{
			$t->dropForeign('location_id');
			$t->dropColumn('location_id');
		});
	}
}

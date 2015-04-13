<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

/**
 * This doesn't really add anything, it's forcing me to use this name, I wanted change
 */
class AddForeignKeyColumnName extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('interview', function(Blueprint $table) {
			$table->renameColumn('interviewer', 'interviewer_id');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('interview', function(Blueprint $table) {
			$table->renameColumn('interviewer_id', 'interviewer');
		});
	}
}

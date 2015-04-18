<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddHouseNumber extends Migration
{
	private $ssql = 'alter table `interview` add `house_number` varchar(255) not null';

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('interview', function($table) {
			$table->string('house_number');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('interview', function($table) {
			$table->dropColumn('house_number');
		});
	}
}

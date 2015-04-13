<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class RemoveQuestionsPivotTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		// Schema::drop('questionnaire_questions');

		Schema::table('question', function($table) {
				$table->integer('questionnaire_id')->unsigned();
				$table->foreign('questionnaire_id')->references('id')->on('questionnaire');
		});
	}


	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
			Schema::create('questionnaire_questions', function($table) {
				$table->integer('questionnaire_id')->unsigned();
				$table->integer('question_id')->unsigned();

				$table->foreign('questionnaire_id')->references('id')->on('questionnaire');
				$table->foreign('question_id')->references('id')->on('question');
			});

			Schema::table('question', function($table) {
				$table->dropForeign('questionnaire_id');
				$table->dropColumn('questionnaire_id');
			});
	}

}

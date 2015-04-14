<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class DropTableQuestionnaireQuestions extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::drop('questionnaire_questions');
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
	}

}

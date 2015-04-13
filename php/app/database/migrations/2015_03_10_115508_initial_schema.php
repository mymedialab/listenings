<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class InitialSchema extends Migration
{
	private $sql = 'create table `user` (`id` int unsigned not null auto_increment primary key, `username` varchar(255) not null, `name` varchar(255) not null, `email` varchar(255) not null, `password` varchar(255) not null, `is_admin` tinyint(1) not null, `remember_token` varchar(255) null, `created_at` timestamp default 0 not null, `updated_at` timestamp default 0 not null) default character set utf8 collate utf8_unicode_ci;
					alter table `user` add unique users_username_unique(`username`);
					create table `questionnaire` (`id` int unsigned not null auto_increment primary key, `name` varchar(255) not null) default character set utf8 collate utf8_unicode_ci;
					create table `question` (`id` int unsigned not null auto_increment primary key, `question` varchar(255) not null) default character set utf8 collate utf8_unicode_ci;
					create table `tag_list` (`id` int unsigned not null auto_increment primary key, `name` varchar(255) not null) default character set utf8 collate utf8_unicode_ci;
					create table `tag` (`id` int unsigned not null auto_increment primary key, `name` varchar(255) not null, `tag_list_id` int unsigned not null) default character set utf8 collate utf8_unicode_ci;
					alter table `tag` add constraint tag_tag_list_id_foreign foreign key (`tag_list_id`) references `tag_list` (`id`);
					create table `interview` (`id` int unsigned not null auto_increment primary key, `date` datetime not null, `interviewer` int unsigned not null) default character set utf8 collate utf8_unicode_ci;
					alter table `interview` add constraint interview_interviewer_foreign foreign key (`interviewer`) references `user` (`id`);
					create table `response` (`id` int unsigned not null auto_increment primary key, `question` varchar(255) not null, `answer` varchar(255) not null, `interview_id` int unsigned not null) default character set utf8 collate utf8_unicode_ci;
					alter table `response` add constraint response_interview_id_foreign foreign key (`interview_id`) references `interview` (`id`);
					create table `questionnaire_questions` (`questionnaire_id` int unsigned not null, `question_id` int unsigned not null) default character set utf8 collate utf8_unicode_ci;
					alter table `questionnaire_questions` add constraint questionnaire_questions_questionnaire_id_foreign foreign key (`questionnaire_id`) references `questionnaire` (`id`);
					alter table `questionnaire_questions` add constraint questionnaire_questions_question_id_foreign foreign key (`question_id`) references `question` (`id`);
					create table `questionnaire_tag_lists` (`questionnaire_id` int unsigned not null, `tag_list_id` int unsigned not null) default character set utf8 collate utf8_unicode_ci;
					alter table `questionnaire_tag_lists` add constraint questionnaire_tag_lists_questionnaire_id_foreign foreign key (`questionnaire_id`) references `questionnaire` (`id`);
					alter table `questionnaire_tag_lists` add constraint questionnaire_tag_lists_tag_list_id_foreign foreign key (`tag_list_id`) references `tag_list` (`id`);
					create table `interview_tag_lists` (`interview_id` int unsigned not null, `tag_list_id` int unsigned not null) default character set utf8 collate utf8_unicode_ci;
					alter table `interview_tag_lists` add constraint interview_tag_lists_interview_id_foreign foreign key (`interview_id`) references `interview` (`id`);
					alter table `interview_tag_lists` add constraint interview_tag_lists_tag_list_id_foreign foreign key (`tag_list_id`) references `tag_list` (`id`)';
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('user', function ($table) {
	        $table->increments('id');
	        $table->string('username')->unique();
	        $table->string('name');
	        $table->string('email');
	        $table->string('password');
          $table->boolean('is_admin');
	        $table->string('remember_token', 255)->nullable();
	        $table->timestamps();
        });

        Schema::create('questionnaire', function($table) {
        	$table->increments('id');
        	$table->string('name');
        });
        Schema::create('question', function($table) {
        	$table->increments('id');
        	$table->string('question');
        });
        Schema::create('tag_list', function($table) {
        	$table->increments('id');
        	$table->string('name');
        });
        Schema::create('tag', function($table) {
        	$table->increments('id');
        	$table->string('name');
        	$table->integer('tag_list_id')->unsigned();

        	$table->foreign('tag_list_id')->references('id')->on('tag_list');
        });
        Schema::create('interview', function($table) {
        	$table->increments('id');
        	$table->datetime('date');
        	$table->integer('interviewer')->unsigned();

        	$table->foreign('interviewer')->references('id')->on('user');
        });
        Schema::create('response', function($table) {
        	$table->increments('id');
        	$table->string('question');
        	$table->string('answer');
        	$table->integer('interview_id')->unsigned();

        	$table->foreign('interview_id')->references('id')->on('interview');
        });

        Schema::create('questionnaire_questions', function($table) {
        	$table->integer('questionnaire_id')->unsigned();
        	$table->integer('question_id')->unsigned();

        	$table->foreign('questionnaire_id')->references('id')->on('questionnaire');
        	$table->foreign('question_id')->references('id')->on('question');
        });
        Schema::create('questionnaire_tag_lists', function($table) {
        	$table->integer('questionnaire_id')->unsigned();
        	$table->integer('tag_list_id')->unsigned();

        	$table->foreign('questionnaire_id')->references('id')->on('questionnaire');
        	$table->foreign('tag_list_id')->references('id')->on('tag_list');
        });
        Schema::create('interview_tag_lists', function($table) {
        	$table->integer('interview_id')->unsigned();
        	$table->integer('tag_list_id')->unsigned();

        	$table->foreign('interview_id')->references('id')->on('interview');
        	$table->foreign('tag_list_id')->references('id')->on('tag_list');
        });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('user');
		Schema::drop('question');
		Schema::drop('tag');
		Schema::drop('tag_list');
		Schema::drop('interview');
		Schema::drop('response');
		Schema::drop('questionnaire');
		Schema::drop('questionnaire_questions');
		Schema::drop('questionnaire_tag_lists');
		Schema::drop('interview_tag_lists');
	}

}

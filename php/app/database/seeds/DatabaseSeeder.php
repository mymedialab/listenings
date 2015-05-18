<?php

use Faker;

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Eloquent::unguard();

		$faker = Faker\Factory::create();

		$A = Area::firstOrCreate(['name' => 'Bodmin']);

		for ($i = 0; $i < 20; $i++) {
			Location::firstOrCreate([
				'name'    => $faker->streetName,
				'area_id' => $A->id
			]);
		}
	}
}

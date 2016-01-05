<?php

use \Faker as Faker;

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

		$u = User::firstOrCreate([
			'username' => 'admin',
			'name'     => 'The Admin',
			'email'    => 'admin@example.com',
			'is_admin' => true
		]);

		$u->password = Hash::make('password');
		$u->save();

		$A = Area::firstOrCreate(['name' => 'Bodmin']);

		for ($i = 0; $i < 20; $i++) {
			Location::firstOrCreate([
				'name'    => $faker->streetName,
				'area_id' => $A->id
			]);
		}
	}
}

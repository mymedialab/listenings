<?php

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class MigrateLocations extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'command:migrate_locations';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'Migrate existing locations to new table and link them in the responses table';

	/**
	 * Create a new command instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		parent::__construct();
	}

	/**
	 * Execute the console command.
	 *
	 *	@todo  DON'T UPDATE LOCATIONS IF THEY'RE ALREADY SET
	 *
	 * @return mixed
	 */
	public function fire()
	{
		$Bodmin = Area::firstOrCreate(['name' => 'Bodmin']);

		// Ensure current locations are saved.
		foreach(array_unique(Interview::where('location_id', '=', '')->lists('location')) as $location) {
			$L = Location::firstOrNew(['name' => $location]);

			if ($L->exists) {
				continue;
			}

			$L->area()->associate($Bodmin);
			$L->save();
		}

		Interview::all()->each(function($Interview) {
			$Location = Location::where('name', '=', $Interview->location);
			if ($Location->count() <= 0) {
				\Log::error("wat!!!!\n" . $Interview->location);
				return;
			}

			$Interview->location_id = $Location->first()->id;
			$Interview->save();
		});
	}

	/**
	 * Get the console command arguments.
	 *
	 * @return array
	 */
	protected function getArguments()
	{
		return [];
	}

	/**
	 * Get the console command options.
	 *
	 * @return array
	 */
	protected function getOptions()
	{
		return [];
	}
}

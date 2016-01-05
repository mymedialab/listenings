# Listenings

The offline-first questionnaire app.

## Installation

This project uses all the build tools, so in your $PATH, you should have the following:

    npm
    grunt
    bower
    bundler
    composer

To get started:

    npm install
    bower install
    bundle install

Create your database. You can change connection details in `php/app/config/local/database.php`

Then in the PHP directory:

    composer install
    php artisan migrate
    php artisan db:seed

Finally build the project

    grunt

You can serve a livereload server with

    grunt serve

## Contributing

All contributions welcome, to get started use the following steps.

Fork the repository
Create a feature branch
Commit your changes to the feature branch
Submit a pull request with details of your change

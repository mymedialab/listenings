<?php
error_reporting(-1);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
date_default_timezone_set('UTC');

$phpDirectory = realpath(__DIR__ . "/../php/bootstrap");
if (!is_dir($phpDirectory)) {
    $phpDirectory = realpath(__DIR__ . "/../bootstrap");
}
if (!is_dir($phpDirectory)) {
    throw new Exception("Could not find autoloader", 1);
}

require $phpDirectory . '/autoload.php';
$app = require_once $phpDirectory . '/start.php';
$app->run();

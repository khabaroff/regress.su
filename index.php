<?php
include 'config.php';
/** @var $config */

require_once 'lib/Twig/Autoloader.php';
Twig_Autoloader::register();

$loader = new Twig_Loader_Filesystem('templates');

$twig = new Twig_Environment($loader, array(
    'cache'       => 'compilation_cache',
    'auto_reload' => true
));

$countries = require('data.php');

foreach ($countries AS &$country)
{
    $country_slag = mb_strtolower(basename($country['flag'], '.jpg'));
    $country_slag = preg_replace('~_+~', '-', $country_slag);

    $country['slug'] = $country_slag;
}

echo $twig->render('countries.twig', array(
    'countries' => $countries,
    'fbAppID' => $config['fbAppID'],
    'siteUrl' => rtrim($config['siteUrl'], '/') . '/'
));

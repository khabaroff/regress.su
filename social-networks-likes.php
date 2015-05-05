<?php
include 'config.php';
/** @var $config */

$write_json = true;
$debug = false;

if(!empty($argv[1]))
{
    $pages_names_list = array(trim($argv[1]));
    $write_json = false;
    $debug = true;
}
else
{
    $pages_names_list = json_decode(file_get_contents('pages-names-list.json'), true);
}

function debug($msg = '')
{
    global $debug;

    if (!$debug)
    {
        return;
    }

    echo $msg, PHP_EOL;
}

require_once 'lib/SocialLikes/VK.php';
require_once 'lib/SocialLikes/Twitter.php';
require_once 'lib/SocialLikes/FB.php';

VK::$appId = $config['vkAppID'];

$pages_likes = array();

$siteUrl = rtrim($config['siteUrl'], '/') . '/';

foreach ($pages_names_list AS $i => $page_name)
{
    debug('VK');
    $vkLikes = VK::likes($siteUrl . $page_name);

    debug('FB');
    $fbLikes = FB::likes($siteUrl . $page_name);

    debug('Twitter');
    $twLikes = Twitter::likes($siteUrl . $page_name);

    $likes = array(
        'vk'      => $vkLikes,
        'fb'      => $fbLikes,
        'twitter' => $twLikes
    );

    $pages_likes[$page_name] = $likes;
}

if ($write_json)
{
    file_put_contents($config['countriesLikesJSON'], json_encode($pages_likes));
}
else
{
    print_r($pages_likes);
}
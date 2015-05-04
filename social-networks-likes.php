<?php
include 'config.php';
/** @var $config */

$pages_names_list = json_decode(file_get_contents('pages-names-list.json'), true);

require_once 'lib/SocialLikes/VK.php';
require_once 'lib/SocialLikes/FB.php';
require_once 'lib/SocialLikes/Twitter.php';

VK::$appId = 4527934;

$pages_likes = array();

$siteUrl = rtrim($config['siteUrl'], '/') . '/';

foreach ($pages_names_list AS $i => $page_name)
{
    $likes  = array(
        'vk' => VK::likes($siteUrl . $page_name),
        'fb' => FB::likes($siteUrl . $page_name),
        'twitter' => Twitter::likes($siteUrl . $page_name),
    );

    $pages_likes[$page_name] = $likes;
}

file_put_contents($config['countriesLikesJSON'], json_encode($pages_likes));
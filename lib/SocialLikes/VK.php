<?
require_once 'SocialNetwork.class.php';

class VK implements SocialNetwork
{
    public static $appId = 0;

    public static function likes($site_page)
    {
        $query = http_build_query(array(
            'type' => 'sitepage',
            'owner_id' => static::$appId,
            'page_url' => $site_page,
            'extended' => 0,
            'count' => 1
        ));

        try
        {
            $response = @file_get_contents('http://api.vk.com/method/likes.getList?' . $query);

            if (!$response OR !$response = json_decode($response, true))
            {
                throw new Exception('empty');
            }

            if (!empty($response['error']))
            {
                throw new Exception($response['error']['error_msg']);
            }
        }
        catch(Exception $error)
        {
            return 0;
        }

        return empty($response['response']) ? 0 : (float)$response['response']['count'];
    }
}

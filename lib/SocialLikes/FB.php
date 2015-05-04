<?
require_once 'SocialNetwork.class.php';

class Twitter implements SocialNetwork
{
    public static function likes($site_page)
    {
        try
        {
            $query = http_build_query(array(
                'url' => $site_page
            ));

            $response = @file_get_contents('http://urls.api.twitter.com/1/urls/count.json?' . $query);

            if (!$response OR !$response = json_decode($response, true))
            {
                throw new Exception('empty');
            }

            if (empty($response['count']))
            {
                throw new Exception('empty');
            }
        }
        catch(Exception $error)
        {
            return 0;
        }

        return (float)$response['count'];
    }
}
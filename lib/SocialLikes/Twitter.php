<?
require_once 'SocialNetwork.class.php';

class FB implements SocialNetwork
{
    public static function likes($site_page)
    {
        try
        {
            $response = @file_get_contents('http://graph.facebook.com/' . urlencode($site_page));

            if (!$response OR !$response = json_decode($response, true))
            {
                throw new Exception('empty');
            }

            if (empty($response['shares']))
            {
                throw new Exception('empty');
            }
        }
        catch(Exception $error)
        {
            return 0;
        }

        return (float)$response['shares'];
    }
}
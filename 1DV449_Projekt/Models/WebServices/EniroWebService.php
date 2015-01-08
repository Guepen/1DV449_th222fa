<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2015-01-07
 * Time: 11:59
 */

require_once("IEniroWebService.php");

class EniroWebService implements IEniroWebService {

    public function getCompanyInformation($searchWord, $county)
    {
        $response = Requests::get(
            "http://api.eniro.com/cs/search/basic?profile=guepen&key=5517669857990221000&country=se&version=1.1.3&search_word=$searchWord&geo_area=$county",
            array(
                'Accept' => 'application/json',
                'Accept-Language' => 'sv'
            )
        );
        if ($response->success) {
            return $response->body;
        }
        return null;
    }
}
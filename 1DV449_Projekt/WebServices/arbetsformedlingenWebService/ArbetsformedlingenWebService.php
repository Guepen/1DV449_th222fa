<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2014-12-15
 * Time: 09:05
 */

require_once('./vendor/rmccue/requests/library/Requests.php');
Requests::register_autoloader();

class ArbetsformedlingenWebService implements IArbetsformedlingWebService {

    public function getProvinces()
    {
        $response = Requests::get(
            "http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/lan",
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

    public function getCounties($provinceId)
    {
        $response = Requests::get(
            "http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/kommuner?lanid=$provinceId",
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

    public function getOccupations($countyId)
    {
        // TODO: Implement getOccupations() method.
    }
}
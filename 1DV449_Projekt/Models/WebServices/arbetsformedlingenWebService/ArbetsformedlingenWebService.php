<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2014-12-15
 * Time: 09:05
 */

Require_once('../vendor/rmccue/requests/library/Requests.php');
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

    public function getJobs($countyId, $occupationAreaId)
    {
        $response = Requests::get(
            "http://api.arbetsformedlingen.se/af/v0/platsannonser/matchning?kommunid=$countyId&yrkesomradeid=$occupationAreaId",
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

    public function getOccupationAreas()
    {
        $response = Requests::get(
            "http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrkesomraden",
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

    public function getJob($jobAdId)
    {

        $response = Requests::get(
            "http://api.arbetsformedlingen.se/af/v0/platsannonser/$jobAdId",
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
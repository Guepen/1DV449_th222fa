<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2014-12-11
 * Time: 16:24
 */
require_once('../../vendor/rmccue/requests/library/Requests.php');
Requests::register_autoloader();

new Provinces();

/**
 * Class Provinces
 * Handles the provinces
 */
class Provinces {
    public function __construct(){
        $this->getProvinces();
    }

    private function getProvinces(){
        if (!file_exists("Provinces.json")) {
            $response = Requests::get(
                "http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/lan",
                array(
                    'Accept' => 'application/json',
                    'Accept-Language' => 'sv'
                )
            );

            if ($response->status_code == 200) {
                file_put_contents("Provinces.json", $response->body);
            }

            $this->sendResponse($response->body);
        } else{
            $this->sendResponse(file_get_contents("Provinces.json"));
        }
    }

    private function sendResponse($response){
        echo $response;
    }
} 
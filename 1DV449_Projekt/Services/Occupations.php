<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2014-12-12
 * Time: 16:57
 */

require_once('../../vendor/rmccue/requests/library/Requests.php');
Requests::register_autoloader();

new Occupations();

class Occupations {

    public function __construct(){
        $this->getOccupations();
    }

    private function getOccupations(){
        if (!file_exists("occupations.json")) {
            $response = Requests::get(
                "http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrkesomraden",
                array(
                    'Accept' => 'application/json',
                    'Accept-Language' => 'sv'
                )
            );

            if ($response->status_code == 200) {
                file_put_contents("occupations.json", $response->body);
                $this->sendResponse($response->body);

            } else {
                $this->sendResponse(file_get_contents("occupations.json"));
            }
        } else{
            $this->sendResponse(file_get_contents("occupations.json"));
        }
    }

    private function fetchCountyId(){
        $id = isset($_POST["id"]) ? $_POST["id"] : null;
        return ($id);
    }


    private function sendResponse($response){
        echo $response;
    }
} 
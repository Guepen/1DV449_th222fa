<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2014-12-12
 * Time: 15:09
 */

require_once('../../vendor/rmccue/requests/library/Requests.php');
Requests::register_autoloader();

new County();

/**
 * Class County
 * Handles the counties
 */
class County {

    public function __construct(){
        $this->getCounties();
    }

    private function getCounties() {
        if (!file_exists("counties.json")) {
            $countyId = $this->fetchCountyId();
            $response = Requests::get(
                "http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/kommuner?lanid=$countyId",
                array(
                    'Accept' => 'application/json',
                    'Accept-Language' => 'sv'
                )
            );

            if ($response->status_code == 200) {
                file_put_contents("counties.json", $response->body);
                $this->sendResponse($response->body);

            } else {
                $this->sendResponse(file_get_contents("counties.json"));
            }
        } else{
            $this->sendResponse(file_get_contents("counties.json"));
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
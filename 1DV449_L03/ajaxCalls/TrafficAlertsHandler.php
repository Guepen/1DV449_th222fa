<?php

require_once('../vendor/rmccue/requests/library/Requests.php');

Requests::register_autoloader();

new TrafficAlertsHandler();

class TrafficAlertsHandler {

    public function __construct(){
        $this->getAlerts();
    }
    private function getAlerts(){

        if(!file_exists("timeStamp.txt") || time() > file_get_contents("timeStamp.txt")) {

            $response = Requests::get("http://api.sr.se/api/v2/traffic/messages?format=json&indent=true&size=100&sort=createddate+desc");

            //if everything goes fine
            if ($response->success) {
                file_put_contents("sr.json", $response->body);
                //Cache for 5 minutes
                file_put_contents("timeStamp.txt", strtotime("+5 minutes"));
                $this->output($response->body);
            } else {
               $this->output($response->status_code);
            }
        } else {
            $this->output(file_get_contents("sr.json"));
        }
    }

    private function output($output){
        echo ($output);
    }
} 
<?php

require_once('../vendor/rmccue/requests/library/Requests.php');

Requests::register_autoloader();

new TrafficAlertsHandler();

class TrafficAlertsHandler {

    public function __construct(){
        $this->getAlerts();
    }

    private function getAlerts(){
/*
        $response = Requests::get("http://api.sr.se/api/v2/traffic/messages?format=json&&indent=true&&size=100&sort=createddate+desc");

        if($response->status_code == 200){
            file_put_contents("sr.json", $response->body);
            $this->output($response->body);
        } else{
            $this->output(file_get_contents("sr.json"));
        }*/

        $this->output(file_get_contents("sr.json"));
    }

    private function output($output){
        echo($output);
    }
} 
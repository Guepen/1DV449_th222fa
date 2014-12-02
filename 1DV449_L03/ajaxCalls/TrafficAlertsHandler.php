<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2014-12-01
 * Time: 13:42
 */

include('../../vendor\rmccue\requests\library\Requests.php');
Requests::register_autoloader();

new TrafficAlertsHandler();
class TrafficAlertsHandler {

    public function __construct(){
        $mode = $this->fetch('mode');
        switch($mode){
            case 'getAlerts':
                $this->getAlerts();
        }
    }

    private function getAlerts(){
/*
     $response = Requests::get("http://api.sr.se/api/v2/traffic/messages?format=json&&indent=true&&size=100&& sort=createddate+desc");

        if($response->status_code == 200){
            file_put_contents("sr.json", json_encode($response->body));
            $this->output($response->body);
        } else{
            $this->output(file_get_contents("sr.json"));
        }*/

        $this->output(file_get_contents("sr.json"));
    }

    private function fetch($name){
        $val = isset($_GET[$name]) ? $_GET[$name] : 0;
        return ($val);
    }
    private function output($output){
        echo($output);
    }
} 
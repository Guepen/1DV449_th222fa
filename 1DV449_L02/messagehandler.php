<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2014-11-20
 * Time: 13:23
 */
require_once("dbConnect.php");

new NewMessage();

/**
 * Class NewMessage
 * Inspired by http://portal.bluejack.binus.ac.id/tutorials/webchatapplicationusinglong-pollingtechnologywithphpandajax
 */
class NewMessage{


    public function __construct(){

        $mode = $this->fetch('mode');
        switch($mode){
            case 'get':
                $this->getMessage();
                break;
            case 'post':
                $this->postMessage();
                break;

        }

    }

    private function postMessage(){

        $name = strip_tags($this->fetch('user'));
        $message = strip_tags($this->fetch('message'));
        if(empty($name) || empty($message)) {
            $this->output(false, "You must enter both a namne and a message");
            return false;

        } else {
            $db = db();

            try {
                $q = "INSERT INTO messages (message, name) VALUES(?, ?)";
                $params = array($message,$name);
                $stm = $db->prepare($q);
                $stm->execute($params);

            } catch (PDOException $e) {
                return false;
            }

        }

    }

    private function getMessage() {
        $endTime = time() + 20;
        $numberOfMessages = $this->fetch('numberOfMessages');
        $lasttime = $this->fetch('lastTime');
        $currentTime = null;



        while (time() < $endTime) {

            try {
                $db = db();
                $q = "SELECT * FROM messages ORDER BY msgTime DESC";
                $stm = $db->prepare($q);
                $stm->execute();
                $result = $stm->fetchAll();

                $currentTime = strtotime($result[0]["msgTime"]);

                if(!empty($result) && $currentTime != $lasttime){
                    $newMessages = array();
                    $numberOfNewMessages = count($result) - $numberOfMessages;
                    for ($i = 0; $i < $numberOfNewMessages; $i++) {
                        $newMessages[] = $result[$i];
                    }

                    $this->output(true, "", array_reverse($newMessages), $currentTime);
                    break;
                }
                else{
                    sleep(1);
                }
            } catch (PDOException $e) {

            }

        }
    }


    private function fetch($name){
        $val = isset($_POST[$name]) ? $_POST[$name] : 0;
        return ($val);
    }
    private function output($result,$output,$message = null, $latest=null){
        echo json_encode(array(
            'result' => $result,
            'message' => $message,
            'output' => $output,
            'latest' => $latest
        ));
    }
}


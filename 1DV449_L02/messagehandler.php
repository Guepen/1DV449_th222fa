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
private $doRequest;


    public function __construct(){

            $mode = $this->fetch('mode');
            switch($mode){
                case 'get':
                   // $this->doRequest = true;
                    $this->getMessage();
                    break;
                case 'post':
                    $this->postMessage();
                    break;
            }








    }

    private function postMessage(){

        $token = $this->fetch('token');
        //var_dump($token);
        $name = strip_tags($this->fetch('user'));
        $message = strip_tags($this->fetch('message'));
        if(empty($name) || empty($message)) {
            //$this->doRequest = false;
            $this->output(false, "You must enter both a namne and a message");
            return false;

        }
        session_start();
        if($_SESSION['token'] != $token) {
            session_write_close();
            http_response_code(403);
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
        $latestMessageTimeLastCall = $this->fetch('lastTime');
        $latestMessageTime = null;
        //var_dump($latestMessageTime, $latestMessageTimeLastCall);



        while (time() < $endTime) {

            try {
                $db = db();
                $q = "SELECT * FROM messages ORDER BY msgTime DESC";
                $stm = $db->prepare($q);
                $stm->execute();
                $result = $stm->fetchAll();

                $latestMessageTime = strtotime($result[0]["msgTime"]);

                /*if($latestMessageTime == $latestMessageTimeLastCall){
                    var_dump("sammma");
                }*/
                if(!empty($result) && $latestMessageTime != $latestMessageTimeLastCall){
                    $newMessages = array();
                    $numberOfNewMessages = count($result) - $numberOfMessages;
                    for ($i = 0; $i < $numberOfNewMessages; $i++) {
                        $newMessages[] = $result[$i];
                    }

                    $this->output(true, "", array_reverse($newMessages), $latestMessageTime);
                    break;


                }
                else{
                    sleep(1);
                }
            } catch (PDOException $e) {

            }

        }
       // $this->output(false, "");
    }


    private function fetch($name){
        $val = isset($_POST[$name]) ? $_POST[$name] : 0;
        var_dump($name, $val);
        return ($val);
    }
    private function output($result,$output,$message = null, $latestMessageTime=null){
        echo json_encode(array(
            'result' => $result,
            'message' => $message,
            'output' => $output,
            'latestMessageTime' => $latestMessageTime
        ));
    }
}


<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2014-11-20
 * Time: 13:23
 */
require_once("dbConnect.php");
require_once("post.php");

new NewMessage();

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
        addToDB($message, $name);
    }

    private function getMessage(){
        $numberOfMessages = $this->fetch('numberOfMessages');

        $db = db();

        try {
            $q = "SELECT * FROM messages ORDER BY msgTime DESC";
            $stm = $db->prepare($q);
            $stm->execute();
            $result = $stm->fetchAll();

            if (!empty($result) && $numberOfMessages < count($result)) {
                $newMessages = array();
                $numberOfNewMessages = count($result) - $numberOfMessages;
                for($i = 0; $i < $numberOfNewMessages; $i++){
                    $newMessages[] = $result[$i];
                }

                $this->output(true, '', $newMessages);
            } else {
                sleep(1);
            }
        } catch (PDOException $e) {
            return;
        }
    }



    private function fetch($name){
        $val = isset($_POST[$name]) ? $_POST[$name] : 0;
        return ($val);
    }
    private function output($result,$output,$message = null){
        echo json_encode(array(
            'result' => $result,
            'message' => $message,
            'output' => $output,
        ));
    }
}


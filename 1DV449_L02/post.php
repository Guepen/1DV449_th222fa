<?php
require_once("dbConnect.php");

/**
 * @param $message
 * @param $user
 * @return bool|string
 */
function addToDB($message, $user) {
	$db = db();

    try {
        $q = "INSERT INTO messages (message, name) VALUES(?, ?)";
        $params = array($message,$user);
        $stm = $db->prepare($q);
        $stm->execute($params);
    } catch (PDOException $e) {
        return false;
    }

}


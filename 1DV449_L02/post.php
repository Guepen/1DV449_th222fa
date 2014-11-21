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

	try {
        $q = "SELECT * FROM users WHERE username = ?";
        $params = array($user);
		$stm = $db->prepare($q);
		$stm->execute($params);
		$result = $stm->fetchAll();
		if(!$result) {
			return "Could not find the user";
		}
	}
	catch(PDOException $e) {
		return false;
	}
	// Send the message back to the client
	echo "Message saved by user: " .json_encode($result);
	
}


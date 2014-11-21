<?php
require_once("dbConnect.php");
function getMessages() {
	$db = db();
    $q = "SELECT * FROM messages";
	try {

		$stm = $db->prepare($q);
		$stm->execute();
		$result = $stm->fetchAll();
	}
	catch(PDOException $e) {
		return false;
	}
	
	if($result) {
        return $result;
    }
	else
	 	return false;
}
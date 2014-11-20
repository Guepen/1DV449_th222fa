<?php

/**
Just som simple scripts for session handling
*/
function sec_session_start() {
        $session_name = 'sec_session_id'; // Set a custom session name
        $secure = false; // Set to true if using https.
        ini_set('session.use_only_cookies', 1); // Forces sessions to only use cookies.
        $cookieParams = session_get_cookie_params(); // Gets current cookies params.
        session_set_cookie_params(3600, $cookieParams["path"], $cookieParams["domain"], $secure, false);
        $httponly = true; // This stops javascript being able to access the session id.
        session_name($session_name); // Sets the session name to the one set above.
        session_start(); // Start the php session
       // session_regenerate_id(); // regenerated the session, delete the old one.
}


function getUserPass($u) {
	$db = null;

	try {
		$db = new PDO("sqlite:db.db");
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}
	catch(PDOEception $e) {
		die("Del -> " .$e->getMessage());
	}
	$sql = "SELECT password FROM users WHERE username = ?";
    $params = array($u);


	$result;
	$stm;
	try {
		$stm = $db->prepare($sql);
		$stm->execute($params);
		$result = $stm->fetch();
		if(!$result) {
			return false;
		}
	}
	catch(PDOException $e) {
		echo("Error creating query: " .$e->getMessage());
		return false;
	}
	return $result['password'];
	
}




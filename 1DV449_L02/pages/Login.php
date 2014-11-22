<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2014-11-19
 * Time: 11:06
 */

require_once("./check.php");

function logInControl(){
    if(isset($_POST['logout'])){
        unset($_SESSION['username']);
    }
    if(isset($_SESSION['username'])){
        renderMessagePage();
    } else if(isset($_POST['submit'])) {
        if(isLoggedin()){
            renderMessagePage();
        }
    } else {
        renderLoginForm();
    }



}

function sec_session_start() {
    $session_name = 'sec_session_id'; // Set a custom session name
    $secure = false; // Set to true if using https.
    ini_set('session.use_only_cookies', 1); // Forces sessions to only use cookies.
    $cookieParams = session_get_cookie_params(); // Gets current cookies params.
    session_set_cookie_params(3600, $cookieParams["path"], $cookieParams["domain"], $secure, false);
    $httponly = true; // This stops javascript being able to access the session id.
    session_name($session_name); // Sets the session name to the one set above.
    session_start(); // Start the php session
    session_regenerate_id(); // regenerated the session, delete the old one.
}


function getUserPass($u) {

    try {
        $db = db();
        $sql = "SELECT password FROM users WHERE username = ?";
        $params = array($u);
        $stm = $db->prepare($sql);
        $stm->execute($params);
        $result = $stm->fetch();
        if(!$result) {
            return false;
        }

    }
    catch(PDOEception $e) {
        return false;
    }

    return $result['password'];

}


function renderLoginForm(){
    echo '
        <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="ico/favicon.png">
    <link rel="stylesheet" type="text/css" href="./css/login.css" />

    <title>Mezzy Labbage - Logga in</title>

    <link href="./css/bootstrap.css" rel="stylesheet">
    	<script type="text/javascript" src="./js/jquery.js"></script>
		<script src="./js/bootstrap.js"></script>
  </head>

  <body>

    <div class="container">

      <form class="form-signin" method="POST">
        <h2 class="form-signin-heading">Log in</h2>
        <input value="" name="username" type="text" class="form-control" placeholder="Användarnamn" required autofocus>
        <input value="" name="password" type="password" class="form-control" placeholder="Password" required>
        <button class="btn btn-lg btn-primary btn-block" name="submit" type="submit">Log in</button>
      </form>
    </div>
  </body>
</html>';

}

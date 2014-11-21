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

<?php
require_once("pages/mess.php");
require_once("pages/Login.php");
require_once("SessionHandler.php");


/**
 * @return bool
 */
function isLoggedin()
{
    if (isset($_POST['username']) && isset($_POST['password'])) {


        // gets the input from user
        $u = $_POST['username'];
        $p = $_POST['password'];

        //if password is verified
        if (logIn($p, getUserPass($u))) {
            new Session($u);
            return true;

        } else {
            renderLoginForm();

        }
    }
    return false;
}

/**
 * checks that the input password matches the password in db
 * @param $pass
 * @param $dbPass
 * @return bool
 */
function logIn($pass, $dbPass){
    if(password_verify($pass, $dbPass)){
        return true;
    }
    return false;
}

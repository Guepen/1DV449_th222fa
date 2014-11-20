<?php
require_once("sec.php");
require_once("pages/mess.php");
require_once("pages/Login.php");


// Check if user is OK
function isLoggedin()
{
    if (isset($_POST['username']) && isset($_POST['password'])) {

        $u = $_POST['username'];
        $p = $_POST['password'];

        if (logIn($p, getUserPass($u))) {

            $_SESSION['username'] = $u;
            // $_SESSION['login_string'] = password_hash($u, PASSWORD_DEFAULT);
            return true;

        } else {
            renderLoginForm();

        }
    }
    return false;
}

function logIn($pass, $dbPass){
    if(password_verify($pass, $dbPass)){
        return true;
    }
    return false;
}

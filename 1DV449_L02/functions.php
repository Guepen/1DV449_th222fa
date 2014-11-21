<?php
require_once("get.php");
require_once("post.php");
require_once("sec.php");

/*
* It's here all the ajax calls goes
*/
if(isset($_GET['function'])) {

    if($_GET['function'] == 'add') {
        $name = strip_tags($_GET["name"]);
        $message = strip_tags($_GET["message"]);
        addToDB($message, $name);

    }
    else if($_GET['function'] == 'getMessages') {
        echo(json_encode(getMessages()));
    }
}


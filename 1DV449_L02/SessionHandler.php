<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2014-11-24
 * Time: 14:53
 */

class Session {

    public function __construct($name){
        //session_start();
        $_SESSION['user'] = $name;
        //session_write_close();

    }

} 
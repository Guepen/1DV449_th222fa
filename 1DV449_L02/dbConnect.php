<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2014-11-20
 * Time: 10:29
 */
require_once("./settings.php");

/**
 * creates connection to db
 * @return bool|PDO
 */
function db(){
    try {
        $db = new PDO(getDbConnectionstring(), getDbUsername(), getDbPass());
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    catch(PDOEception $e) {
        return false;
    }
    return $db;
}
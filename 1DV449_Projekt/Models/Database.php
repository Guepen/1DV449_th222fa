<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2014-12-15
 * Time: 09:59
 */
require_once('./Settings.php');

abstract class Database {
    protected $dbConnection;

    /**
     * tries to make connection to the db
     * @return PDO
     */
    protected function connection(){
        if($this->dbConnection == null){
            try {
                $this->dbConnection = new PDO(dbSettings::$connectionString, dbSettings::$dbUsername,
                    dbSettings::$dbPassword);
                $this->dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            } catch (Exception $ex) {
                var_dump($ex->getMessage());
            }
            return $this->dbConnection;
        }

        return $this->dbConnection;
    }
} 
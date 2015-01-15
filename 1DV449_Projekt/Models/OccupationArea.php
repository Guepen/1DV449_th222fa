<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2015-01-14
 * Time: 23:45
 */

class OccupationArea {
    private $id;
    private $name;

    /**
     * @param $id
     * @param $name
     */
    public function __construct($id, $name){
        $this->id = $id;
        $this->name = $name;
    }


    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }



} 

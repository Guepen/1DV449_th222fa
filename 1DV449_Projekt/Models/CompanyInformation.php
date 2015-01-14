<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2015-01-14
 * Time: 20:47
 */

class CompanyInformation {
    private $facebook;
    private $streetName;
    private $postCode;
    private $postArea;

    /**
     * @param $facebook
     * @param $postArea
     * @param $postCode
     * @param $streetName
     */
    function __construct($facebook, $postArea, $postCode, $streetName) {
        $this->facebook = $facebook;
        $this->postArea = $postArea;
        $this->postCode = $postCode;
        $this->streetName = $streetName;
    }

    /**
     * @return mixed
     */
    public function getFacebook()
    {
        return $this->facebook;
    }

    /**
     * @return mixed
     */
    public function getPostArea()
    {
        return $this->postArea;
    }

    /**
     * @return mixed
     */
    public function getPostCode()
    {
        return $this->postCode;
    }

    /**
     * @return mixed
     */
    public function getStreetName()
    {
        return $this->streetName;
    }


} 
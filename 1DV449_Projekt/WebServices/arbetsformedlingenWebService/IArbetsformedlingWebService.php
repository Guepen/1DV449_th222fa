<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2014-12-15
 * Time: 08:59
 */

interface IArbetsformedlingWebService {

    public function getProvinces();
    public function getCounties($provinceId);
    public function getOccupations($countyId);

} 
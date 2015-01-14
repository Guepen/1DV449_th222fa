<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2014-12-15
 * Time: 10:21
 */

interface IWorkRepository {
    public function find($table, $tableId, $id);
    public function findJobs($countyId, $occupationAreaId);
    public function add($table, array $columns, array $values);
    public function remove($table);
    public function removeCounties($provinceId);
    public function removeJobs($countyId, $occupationAreaId);
    public function removeJobAd($jobAdId);
} 
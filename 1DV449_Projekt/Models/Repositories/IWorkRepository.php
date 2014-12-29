<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2014-12-15
 * Time: 10:21
 */

interface IWorkRepository {
    public function find($table, $tableId, $id);
    public function add($table, array $columns, array $values);
    public function remove($table);
} 
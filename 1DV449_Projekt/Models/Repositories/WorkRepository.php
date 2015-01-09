<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2014-12-15
 * Time: 10:28
 */

require_once('../Models/Database.php');
require_once('IWorkRepository.php');

/**
 * Class WorkRepository
 *
 */
class WorkRepository extends Database implements IWorkRepository  {
    private $db;

    public function __construct(){
        $this->db = $this->connection();
    }

    public function findJobs($countyId, $occupationAreaId){
        try{
            $sql = "SELECT * FROM jobs WHERE countyId =? AND occupationAreaId=?";
            $params = array($countyId, $occupationAreaId);
            $query = $this->db->prepare($sql);
            $query->execute($params);
            $result = $query->fetchAll();

            if($result){
                $latestUpdate = $result[0]['nextUpdate'];
                if(time() < $latestUpdate ){
                    return $result;
                }
            }

        } catch(Exception $ex){
            var_dump( $ex->getMessage());
        }
        return null;
    }

    /**
     * @param $table string the name of the table to fetch data from
     * @param $idColumn null|int example: to fetch data from the county table we need to pass in the id
     *        of a province. To fetch data from the province table we do not need to pass in any id.
     * @param $id null|int the id of province or county
     * @return array|null
     */
    public function find($table, $idColumn = null, $id = null)
    {
        try{
            if ($id == null || $idColumn == null) {
                $sql = "SELECT * FROM " . $table ;
                $query = $this->db->prepare($sql);
                $query->execute();
            } else{
                $sql = "SELECT * FROM " . $table . " WHERE ".$idColumn ."=?" ;
                $params = array($id);
                $query = $this->db->prepare($sql);
                $query->execute($params);
            }


            $result = $query->fetchAll();
            if ($result) {
                $latestUpdate = $result[0]['nextUpdate'];
                if(time() < $latestUpdate ){
                    //var_dump("cache");
                    return $result;
                }
                $this->remove($table);
               // var_dump("new");
             return null;
            }

        } catch(Exception $ex){
            return null;
           // var_dump($ex->getMessage());
        }
       return null;
    }

    /**
     * @param $table string the name of the table to add data to
     * @param array $columns name of the columns in the db
     * @param array $values values to add
     */
    public function add($table, array $columns, array $values)
    {
        $numberOfParams = "?";
        for($i = 1; $i < count($values); $i++){
           $numberOfParams .= " ,?";
        }

       try{
           $fields = implode(', ', $columns);
           $sql = "INSERT INTO ". $table . "(". $fields .")". " VALUES (". $numberOfParams.")";
           $params = $values;
           $query = $this->db->prepare($sql);
           $query->execute($params);

       } catch(Exception $ex){
           var_dump($ex->getMessage());
       }
    }

    /**
     * @param $table string the name of the table in the db
     */
    public function remove($table)
    {
        try{
            $sql = "DELETE * FROM  $table";
            $query = $this->db->prepare($sql);
            $query->execute();

        } catch(Exception $ex){
            //var_dump($ex->getMessage());
        }
    }
}
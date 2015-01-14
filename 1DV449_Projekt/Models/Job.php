<?php
/**
 * Created by PhpStorm.
 * User: Tobias
 * Date: 2015-01-14
 * Time: 21:24
 */

class Job {
    private $jobHeader;
    private $jobName;
    private $jobAdId;

    /**
     * @param $jobAdId
     * @param $jobHeader
     * @param $jobName
     */
    function __construct($jobAdId, $jobHeader, $jobName)
    {
        $this->jobAdId = $jobAdId;
        $this->jobHeader = $jobHeader;
        $this->jobName = $jobName;
    }

    /**
     * @return mixed
     */
    public function getJobAdId()
    {
        return $this->jobAdId;
    }

    /**
     * @return mixed
     */
    public function getJobHeader()
    {
        return $this->jobHeader;
    }

    /**
     * @return mixed
     */
    public function getJobName()
    {
        return $this->jobName;
    }



} 